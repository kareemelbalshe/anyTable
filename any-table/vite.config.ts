import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isLibrary = mode === "production" || process.env.BUILD_MODE === "lib";

  return {
    plugins: [react()],
    build: {
      lib: isLibrary
        ? {
            entry: resolve(__dirname, "src/index.ts"),
            name: "AnyTable",
            formats: ["es", "cjs"],
            fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
          }
        : undefined,
      rollupOptions: isLibrary
        ? {
            external: ["react", "react-dom", "react/jsx-runtime"],
            output: {
              globals: {
                react: "React",
                "react-dom": "ReactDOM",
                "react/jsx-runtime": "jsxRuntime",
              },
              assetFileNames: (assetInfo) => {
                if (assetInfo.name === "style.css") return "style.css";
                return assetInfo.name || "asset";
              },
            },
          }
        : undefined,
      sourcemap: true,
      emptyOutDir: true,
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/tests/setup.ts",
    },
  };
});
