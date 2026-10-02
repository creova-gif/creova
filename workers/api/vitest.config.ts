import { cloudflareTest } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";

const admin = {
  ADMIN_PASSWORD: "test-admin-password",
  ADMIN_SESSION_SECRET: "test-admin-session-secret",
};

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: "./wrangler.toml" },
      miniflare: { bindings: admin },
    }),
  ],
  test: {
    include: ["test/**/*.test.ts"],
    exclude: ["test/local-skip.test.ts", "test/dummy-secret.test.ts"],
    setupFiles: ["./test/setup.ts"],
  },
});
