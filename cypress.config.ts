import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportWidth: 1500,
    viewportHeight: 850,
    testIsolation: false,
  },
});
