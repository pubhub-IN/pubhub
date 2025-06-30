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
        target: "http://157.173.222.219:3000",
        changeOrigin: true,
        secure: false,
      },
      "/auth": {
        target: "http://157.173.222.219:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
