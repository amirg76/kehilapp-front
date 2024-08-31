// This is the main configuration file for Vite. The file exports a default configuration object that defines how Vite should build and serve the application.

import { defineConfig } from "vite";
//: a function that returns the configuration object
import react from "@vitejs/plugin-react";
//: a plugin that enables React support in Vite
import path from "path";
//: a built-in Node.js module for working with file paths
import dotenv from "dotenv";
//dotenv: a module that loads environment variables from a .env file

dotenv.config();

export default defineConfig({
  //an array of plugins that Vite should use. In this case, only the react plugin is enabled.
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-macros", "babel-plugin-styled-components"],
      },
    }),
  ],
  //resolve: an object that defines how Vite should resolve module imports.
  resolve: {
    //alias property that defines a set of aliases for module imports.
    //the alias property defines a set of shortcuts for module imports. For example, @ is an alias for the src directory, so importing @components would actually import from src/components.
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@features": path.resolve(__dirname, "src/features"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@context": path.resolve(__dirname, "src/context"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@services": path.resolve(__dirname, "src/services"),
      "@ui": path.resolve(__dirname, "src/components/ui"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@types": path.resolve(__dirname, "src/types"),
      "@api": path.resolve(__dirname, "src/api"),
      "@routes": path.resolve(__dirname, "src/routes"),
      "@store": path.resolve(__dirname, "src/store"),
      "@demo-data": path.resolve(__dirname, "src/demo-data"),

      // ... add more aliases as needed. Dont forget to add it to the tsconfig as well
      // This line is configuring a replacement for module imports. Specifically, it tells Vite to replace any import of "./runtimeConfig" with "./runtimeConfig.browser".
      // This is often used when you have different runtime configurations for different environments (e.g. browser, server). By replacing "./runtimeConfig" with "./runtimeConfig.browser", you can ensure that the correct configuration is used in the browser.
      find: "./runtimeConfig",
      replacement: "./runtimeConfig.browser",
    },
  },
  build: {
    outDir: "build",
  },
});
