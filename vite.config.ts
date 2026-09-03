import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDemo = mode === "demo";
  const isLibrary = !isDemo && (mode === "production" || process.env.BUILD_MODE === "lib");

  return {
    base: isDemo ? "/anyTable/" : "/",
    plugins: [
      tailwindcss(),
      react(),
      ...(isLibrary
        ? [
            dts({
              tsconfigPath: "./tsconfig.build.json",
              outDir: "dist",
            }),
          ]
        : []),
    ],
    build: {
      outDir: isDemo ? "dist-demo" : "dist",
      lib: isLibrary
        ? {
            entry: resolve(__dirname, "src/index.ts"),
            name: "AnyTable",
            formats: ["es", "cjs"],
            fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
            cssFileName: "style",
          }
        : undefined,
      rollupOptions: isLibrary
        ? {
            external: ["react", "react-dom", "react/jsx-runtime"],
            output: {
              exports: "named",
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
