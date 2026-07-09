const { defineConfig } = require("vitest/config");

module.exports = defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    clearMocks: true,
    include: ["tests/**/*.test.ts"],
  },
});
