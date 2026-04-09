import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { connectDatabase, disconnectDatabase } from "./config/db.js";
import { errorHandler, notFoundHandler } from "./middleware/common/errorHandler.js";
import { router } from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "config/.env") });

const app = express();
app.set("trust proxy", 1);
const PORT = Number(process.env.PORT || 3000);

const configuredOrigins = [
  process.env.FRONTEND_URL,
  process.env.VITE_FRONTEND_URL,
  ...(process.env.CORS_ORIGINS || "").split(",").map((origin) => origin.trim()),
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

const allowedOrigins = [...new Set(configuredOrigins)];

app.use(
  cors({
    origin(origin, callback) {
      // Allow tools/clients without an Origin header (e.g. curl, server-to-server).
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  const isMongoConfigured = Boolean(process.env.MONGO_URI);
  const isMongoConnected = mongoose.connection.readyState === 1;

  res.json({
    status: "ok",
    message: "API server is running",
    database: isMongoConfigured ? (isMongoConnected ? "connected" : "configured") : "not-configured",
    timestamp: new Date().toISOString(),
  });
});

app.use(router);
app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

async function shutdown(signal) {
  console.log(`Received ${signal}. Shutting down...`);
  await disconnectDatabase();
  process.exit(0);
}

process.on("SIGINT", () => {
  shutdown("SIGINT").catch((error) => {
    console.error("Shutdown error:", error);
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM").catch((error) => {
    console.error("Shutdown error:", error);
    process.exit(1);
  });
});

startServer().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});
