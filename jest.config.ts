import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/api/**/*.test.ts", "<rootDir>/tests/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  clearMocks: true,
  resetMocks: true,
};

export default createJestConfig(config);
