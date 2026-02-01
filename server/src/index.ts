import express from "express";
import cors from "cors";
import { config } from "./config";
import urlRoutes from "./routes/url.routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(urlRoutes);

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start server
app.listen(config.server.port, () => {
  console.log(`✓ Server running on port ${config.server.port}`);
  console.log(`✓ Environment: ${config.server.nodeEnv}`);
  console.log(`✓ Frontend URL: ${config.frontend.url}`);
});
