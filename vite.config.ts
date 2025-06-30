import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
