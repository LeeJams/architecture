import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig(({ mode }) => ({
  base: "./",
  plugins: [react()],
  server: { host: "127.0.0.1" },
  preview: { host: "127.0.0.1" },
  build: {
    target: "es2022",
    assetsInlineLimit: mode === "standalone" ? 10_000_000 : 4096,
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: {
      output:
        mode === "standalone"
          ? { inlineDynamicImports: true }
          : {
              manualChunks: {
                "react-vendor": ["react", "react-dom/client"],
                motion: ["motion/react"],
              },
            },
    },
    ...(mode === "standalone" ? { chunkSizeWarningLimit: 3000 } : {}),
  },
}));
