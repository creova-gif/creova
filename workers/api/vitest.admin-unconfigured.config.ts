import { cloudflareTest } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";

// Password is set. Session secret is not. Login must fail closed for every password.
export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: "./wrangler.toml" },
      miniflare: {
        bindings: {
          ADMIN_PASSWORD: "test-admin-password",
        },
      },
    }),
  ],
  test: {
    include: ["test/admin-unconfigured.test.ts"],
    setupFiles: ["./test/setup.ts"],
  },
});
