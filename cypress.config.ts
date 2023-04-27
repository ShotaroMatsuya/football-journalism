import { defineConfig } from "cypress";
import getCompareSnapshotsPlugin from "cypress-visual-regression/dist/plugin";

export default defineConfig({
  projectId: 'uedm1r',
  chromeWebSecurity: false,
  screenshotsFolder: "./cypress/snapshots/actual",
  trashAssetsBeforeRuns: true,

  env: {
    failSilently: false,
    SNAPSHOT_BASE_DIRECTORY: "cypress/snapshots/base",
    SNAPSHOT_DIFF_DIRECTORY: "cypress/snapshots/diff",
    ALWAYS_GENERATE_DIFF: false,
    ALLOW_VISUAL_REGRESSION_TO_FAIL: true,
    type: "actual",
  },

  viewportWidth: 1280,
  viewportHeight: 800,

  retries: {
    runMode: 2,
    openMode: 0,
  },

  numTestsKeptInMemory: 5,

  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      getCompareSnapshotsPlugin(on, config);
    },
    baseUrl: "http://localhost:8080",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },
});