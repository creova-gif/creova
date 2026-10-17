import { describe, expect, it } from "vitest";
import { postJson } from "./helpers";

describe("admin session secret unset", () => {
  it("returns 500 for the correct password and the wrong one", async () => {
    const wrong = await postJson(
      "/make-server-feacf0d8/admin-login",
      { password: "nope" },
      "203.0.113.1",
    );
    const right = await postJson(
      "/make-server-feacf0d8/admin-login",
      { password: "test-admin-password" },
      "203.0.113.2",
    );
    expect(wrong.status).toBe(500);
    expect(right.status).toBe(500);
    expect(await wrong.json()).toEqual({ error: "Admin login is not configured" });
    expect(await right.json()).toEqual({ error: "Admin login is not configured" });
  });
});
