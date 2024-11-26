import { defineConfig } from "cypress";
import viteConfig from './vite.config';

export default defineConfig({
  projectId: 'tz8q3z',
  component: {
    setupNodeEvents(on, config) {
      // Implement node event listeners here
    },
    devServer: {
      framework: "vue",
      bundler: "vite",
      viteConfig,
    },
  },
});
