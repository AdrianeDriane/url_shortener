import dotenv from "dotenv";

dotenv.config();

export const config = {
  server: {
    port: parseInt(process.env.PORT || "8000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
    baseUrl: process.env.BACKEND_URL || "http://localhost:8000",
  },
  database: {
    connectionUri: process.env.DB_CONNECTION_URI || "",
  },
  frontend: {
    url: process.env.FRONTEND_URL || "http://localhost:3000",
  },
  cache: {
    maxItems: 1000,
    defaultTtlMs: 5 * 60 * 1000, // 5 minutes
  },
};
