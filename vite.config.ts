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
    // Proxy only for development
    proxy:
      process.env.NODE_ENV === "development"
        ? {
            "/api": {
              target: "http://localhost:3000",
              changeOrigin: true,
            },
          }
        : undefined,
  },
});
