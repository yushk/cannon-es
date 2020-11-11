const tsPreset = require('ts-jest/jest-preset')

module.exports = {
  ...tsPreset,
  testPathIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: [
    "./src/world/testHelpers.ts"
  ]
}
