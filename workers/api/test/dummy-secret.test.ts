import { describe, expect, it } from "vitest";
import { postJson } from "./helpers";

describe("dummy Turnstile secret", () => {
  it("still returns 503 when CREOVA_ENV is unset", async () => {
    const res = await postJson(
      "/make-server-feacf0d8/submit-contact",
      { name: "Ada Lovelace", email: "ada@creova.one", message: "dummy secret must fail closed" },
      "203.0.113.70",
    );
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "Security verification is not configured" });
  });
});
