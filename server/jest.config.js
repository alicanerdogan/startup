module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json"
    }
  },
  moduleFileExtensions: ["ts", "js", "json"],
  transform: { "^.+\\.(ts|tsx)$": "ts-jest" },
  clearMocks: true,
  testEnvironment: "node",
  testMatch: ["**/__tests__/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/", "/.git/"]
};
