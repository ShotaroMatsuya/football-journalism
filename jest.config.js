module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  silent: true,
  coverageReporters: [
    "json-summary",
    "text",
    "lcov",
    "clover"
  ]
}
