// Runs the edge function under Deno and prints the review checks.
// Does not call the hosted Supabase project.
import { spawn } from "node:child_process";
import http from "node:http";
import { once } from "node:events";

const DENO = process.env.DENO || "/tmp/deno/bin/deno";
const FUNCTION = "src/supabase/functions/server/index.tsx";

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve(server.address().port));
  });
}

async function request(port, path, { method = "POST", headers = {}, body } = {}) {
  const init = { method, headers: { ...headers } };
  if (body !== undefined) {
    init.headers["content-type"] = init.headers["content-type"] || "application/json";
    init.body = JSON.stringify(body);
  }
  return fetch(`http://127.0.0.1:${port}/make-server-feacf0d8${path}`, init).then(async (res) => {
    const text = await res.text();
    let json = null;
    try { json = text ? JSON.parse(text) : null; } catch { json = { raw: text }; }
    return { status: res.status, json, headers: res.headers };
  });
}

function post(port, path, { headers = {}, body = {} } = {}) {
  return request(port, path, { method: "POST", headers, body });
}

function freePort() {
  const server = http.createServer();
  return listen(server).then((port) => new Promise((resolve) => server.close(() => resolve(port))));
}

async function boot(env, extra = {}) {
  const port = await freePort();
  const allowNet = extra.allowNet || "--allow-net";
  const child = spawn(DENO, [
    "run",
    allowNet,
    "--allow-env",
    "--node-modules-dir=none",
    "--no-lock",
    FUNCTION,
  ], {
    env: { ...process.env, PORT: String(port), ...env },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let logs = "";
  child.stdout.on("data", (chunk) => { logs += chunk; });
  child.stderr.on("data", (chunk) => { logs += chunk; });
  const deadline = Date.now() + 20000;
  let up = false;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) break;
    try {
      const res = await fetch(`http://127.0.0.1:${port}/make-server-feacf0d8/health`);
      if (res.ok) { up = true; break; }
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 200));
  }
  if (!up) {
    child.kill("SIGKILL");
    throw new Error(`function did not start\n${logs.slice(-2000)}`);
  }
  return {
    port,
    logs: () => logs,
    async stop() {
      child.kill("SIGTERM");
      await Promise.race([once(child, "exit"), new Promise((r) => setTimeout(r, 2000))]);
      if (child.exitCode === null) child.kill("SIGKILL");
    },
    ...extra,
  };
}

function line(label, value) {
  console.log(`${label}: ${typeof value === "string" ? value : JSON.stringify(value)}`);
}

const failures = [];
function check(name, ok, detail) {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? " — " + detail : ""}`);
  if (!ok) failures.push(name);
}

async function main() {
  console.log("=== spoofed X-Forwarded-For and admin lockout ===");
  const app = await boot({
    ADMIN_PASSWORD: "test-admin-password",
    ADMIN_SESSION_SECRET: "test-admin-session-secret",
  });
  try {
    const suffix = "203.0.113.10";
    const contactStatuses = [];
    for (let i = 1; i <= 7; i++) {
      const res = await post(app.port, "/submit-contact", {
        headers: { "x-forwarded-for": `${i}.${i}.${i}.${i}, ${suffix}` },
        body: {},
      });
      contactStatuses.push(res.status);
    }
    line("xff prefix rotation statuses", contactStatuses);
    check(
      "rotating XFF prefix shares the appended hop",
      contactStatuses.slice(0, 5).every((s) => s !== 429) && contactStatuses[5] === 429 && contactStatuses[6] === 429,
      contactStatuses.join(","),
    );

    const lone = [];
    for (let i = 1; i <= 6; i++) {
      const res = await post(app.port, "/submit-rental", {
        headers: { "x-forwarded-for": `198.51.100.${i}` },
        body: {},
      });
      lone.push(res.status);
    }
    line("single-hop XFF statuses (local, no platform append)", lone);
    check(
      "a lone client-supplied hop is its own bucket",
      lone.every((s) => s !== 429),
      lone.join(","),
    );

    const login = await post(app.port, "/admin-login", {
      headers: { "x-forwarded-for": "198.51.100.20" },
      body: { password: "test-admin-password" },
    });
    line("admin login", { status: login.status, hasToken: Boolean(login.json?.token) });
    const token = login.json?.token;
    const anon = [];
    for (let i = 0; i < 5; i++) {
      const res = await post(app.port, "/send-booking-confirmation", {
        headers: { "x-forwarded-for": `10.1.1.${i}, 203.0.113.77` },
        body: {},
      });
      anon.push(res.status);
    }
    const authed = await post(app.port, "/send-booking-confirmation", {
      headers: {
        "x-forwarded-for": "10.9.9.9, 203.0.113.77",
        "x-admin-session": token || "",
      },
      body: {},
    });
    line("anonymous admin-route statuses", anon);
    line("authenticated follow-up", { status: authed.status, body: authed.json });
    check("five anonymous calls are 401", anon.every((s) => s === 401), anon.join(","));
    check("valid admin token is not locked out", authed.status !== 429, String(authed.status));

    const cors = await post(app.port, "/submit-contact", {
      headers: { origin: "https://evil.example" },
      body: { name: "Ada", email: "ada@example.com", message: "Hello" },
    });
    const allowOrigin = cors.headers.get("access-control-allow-origin");
    line("CORS and requireTurnstile", { status: cors.status, allowOrigin, body: cors.json });
    check(
      "CORS rejects an unlisted origin",
      allowOrigin !== "https://evil.example",
      String(allowOrigin),
    );
    check(
      "requireTurnstile fails closed without a secret",
      cors.status === 503 && cors.json?.error === "Security verification is not configured",
      JSON.stringify(cors.json),
    );
  } finally {
    await app.stop();
  }

  console.log("\n=== commerce routes are off ===");
  const commercePaths = [
    "/create-ticket",
    "/create-payment-intent",
    "/stripe-webhook",
    "/create-preorder",
    "/purchase-digital-product",
    "/purchase-event-ticket",
    "/create-membership",
    "/create-subscription-checkout",
    "/payments",
    "/create-refund",
    "/refunds",
    "/create-booking",
    "/create-rental",
  ];
  const pay = await boot(
    {
      CREOVA_ENV: "test",
      STRIPE_SECRET_KEY: "sk_test_local_only",
      STRIPE_WEBHOOK_SECRET: "whsec_local_only",
    },
    { allowNet: "--allow-net=127.0.0.1,0.0.0.0" },
  );
  try {
    const gone = { error: "This service is no longer available" };
    for (const path of commercePaths) {
      const res = await post(pay.port, path, {
        headers: { "stripe-signature": "t=1,v1=abc" },
        body: { type: "payment_intent.succeeded", payment_intent_id: "pi_replaytest1" },
      });
      line(`POST ${path}`, { status: res.status, body: res.json });
      const leaked = JSON.stringify(res.json);
      check(
        `POST ${path} is 410 and does not grant anything`,
        res.status === 410 && leaked === JSON.stringify(gone)
          && !/clientSecret|client_secret|download_token|ticket_code|member_number|sessionId/.test(leaked),
        leaked,
      );
    }
    for (const path of ["/payments", "/refunds"]) {
      const res = await request(pay.port, path, { method: "GET" });
      line(`GET ${path}`, { status: res.status, body: res.json });
      check(`GET ${path} is 410`, res.status === 410 && res.json?.error === gone.error);
    }
    const logs = pay.logs();
    check("commerce handlers did not call Stripe", !logs.includes("api.stripe.com"), logs.slice(-500));
  } finally {
    await pay.stop();
  }

  console.log("\n=== CREOVA_ENV / ENVIRONMENT ===");
  const contact = { name: "Ada", email: "ada@example.com", message: "Hello" };
  const cases = [
    ["ENVIRONMENT=Dev and CREOVA_ENV unset", { ENVIRONMENT: " Dev " }, 503],
    ["CREOVA_ENV padded", { CREOVA_ENV: " Dev " }, 503],
    ["CREOVA_ENV=development", { CREOVA_ENV: "development" }, 500],
    ["CREOVA_ENV=development on hosted URL", {
      CREOVA_ENV: "development",
      SUPABASE_URL: "https://vwestumjbrpwlbsewupz.supabase.co",
    }, 503],
  ];
  for (const [name, env, expected] of cases) {
    const proc = await boot(env);
    try {
      const res = await post(proc.port, "/submit-contact", { body: contact });
      line(name, { status: res.status, body: res.json });
      const leaked = JSON.stringify(res.json).includes("error.message")
        || /supabaseUrl is required|TypeError|ECONNREFUSED/i.test(JSON.stringify(res.json));
      check(`${name} -> ${expected}`, res.status === expected && !leaked, JSON.stringify(res.json));
    } finally {
      await proc.stop();
    }
  }

  if (failures.length) {
    console.error(`\n${failures.length} check(s) failed: ${failures.join("; ")}`);
    process.exit(1);
  }
  console.log("\nAll edge checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
