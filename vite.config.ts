import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    host: true,
    proxy: {
      "/api": {
        target: "https://pubhub-lnao.onrender.com",
        changeOrigin: true,
        secure: false,
      },
      "/auth": {
        target: "https://pubhub-lnao.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
