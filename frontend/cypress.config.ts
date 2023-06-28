import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: "projectId",
  video: true,
  videoCompression: 32,
  videoUploadOnPasses: true,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      if (config.isTextTerminal) {
        return {
          excludeSpecPattern: ['cypress/e2e/all.cy.js'],
        }
      }
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    defaultCommandTimeout: 20000,
    viewportHeight: 1080,
    viewportWidth: 1920,
  },
});
