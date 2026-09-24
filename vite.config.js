import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dotenv from "dotenv";
import { BASE_URL_VAR, normalizeBaseUrl } from "./src/utils/baseUrl.js";

dotenv.config();
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // A build bakes the API address into the bundle. Without a valid one the build
  // used to succeed and the site loaded blank. Refuse here instead, with the same
  // rule the app applies at runtime. `vite dev` is left alone: it reads the value
  // live, and a missing one fails loudly in the browser console already.
  if (command === "build") {
    const env = loadEnv(mode, process.cwd(), "VITE_");
    try {
      normalizeBaseUrl(env[BASE_URL_VAR]);
    } catch (err) {
      throw new Error(`Refusing to build: ${err.message}`);
    }
  }

  return {
    plugins: [
      react({
        babel: {
          plugins: ["babel-plugin-macros", "babel-plugin-styled-components"],
        },
      }),
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@components": path.resolve(__dirname, "src/components"),
        "@features": path.resolve(__dirname, "src/features"),
        "@pages": path.resolve(__dirname, "src/pages"),
        "@context": path.resolve(__dirname, "src/context"),
        "@hooks": path.resolve(__dirname, "src/hooks"),
        "@utils": path.resolve(__dirname, "src/utils"),
        "@assets": path.resolve(__dirname, "src/assets"),
        "@types": path.resolve(__dirname, "src/types"),
        "@api": path.resolve(__dirname, "src/api"),
        "@routes": path.resolve(__dirname, "src/routes"),
        "@store": path.resolve(__dirname, "src/store"),
        "@demo-data": path.resolve(__dirname, "src/demo-data"),

        // ... add more aliases as needed. Dont forget to add it to the tsconfig as well
        find: "./runtimeConfig",
        replacement: "./runtimeConfig.browser",
      },
    },
    build: {
      outDir: "build",
    },
  };
});
