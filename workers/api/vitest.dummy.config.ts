import { cloudflareTest } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";

// Dummy secret with CREOVA_ENV unset must still fail closed.
export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: "./wrangler.toml" },
      miniflare: {
        bindings: {
          TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA",
        },
      },
    }),
  ],
  test: {
    include: ["test/dummy-secret.test.ts"],
    setupFiles: ["./test/setup.ts"],
  },
});
