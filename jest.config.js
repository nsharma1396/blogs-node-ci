const { defaults } = require("jest-config");
module.exports = {
  setupFilesAfterEnv: ["./__tests__/jest.setup.js"],
  testPathIgnorePatterns: [
    "./__tests__/factories/",
    "./__tests__/helpers/",
    "./__tests__/jest.setup.js",
  ],
  testEnvironment: "node", // Needed by mongoose
};
