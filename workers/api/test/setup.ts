import { env } from "cloudflare:workers";
import { beforeEach } from "vitest";
import migration from "../migrations/0001_create_kv.sql?raw";

beforeEach(async () => {
  const statements = migration
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n")
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);
  for (const statement of statements) {
    await env.DB.prepare(statement).run();
  }
});
