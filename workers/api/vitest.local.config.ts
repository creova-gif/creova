import { cloudflareTest } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";

// Local test env only. CREOVA_ENV must be an exact skip value. The always-pass
// Turnstile dummy is not a usable secret (PR #64), so the gate skips instead of
// calling siteverify. Do not set CREOVA_ENV on the deployed worker.
export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: "./wrangler.toml" },
      miniflare: {
        bindings: {
          ADMIN_PASSWORD: "test-admin-password",
          ADMIN_SESSION_SECRET: "test-admin-session-secret",
          CREOVA_ENV: "test",
          TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA",
          EMAIL_SERVICE_API_KEY: "re_test_key",
          AIRTABLE_API_KEY: "pat_test_key",
        },
      },
    }),
  ],
  test: {
    include: ["test/local-skip.test.ts"],
    setupFiles: ["./test/setup.ts"],
  },
});
