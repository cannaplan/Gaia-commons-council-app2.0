// ============================================================================
// GAIA COMMONS API v5.0 - Server Entry Point
// ============================================================================

import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { registerRoutes } from "./routes";
import { testConnection, closePool } from "./db";

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Security headers
app.use(helmet());

// CORS - allow all origins in development
app.use(cors({
  origin: true,
  credentials: true,
}));

// Request logging
app.use(morgan("dev"));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// SERVER STARTUP
// ============================================================================

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Test database connection first
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error("❌ Cannot start server without database connection");
      process.exit(1);
    }

    // Register all API routes (this also seeds the database)
    const router = await registerRoutes(server);
    app.use(router);

    // ============================================================================
    // ERROR HANDLING (must be after routes)
    // ============================================================================

    
    // ============================================================================
    // ERROR HANDLING (must be after routes)
    // ============================================================================
    
    // 404 handler
    app.use((req: Request, res: Response) => {
      res.status(404).json({
        status: "error",
        message: `Route ${req.method} ${req.path} not found`,
      });
    });

    // Global error handler
    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      console.error("Error:", err);
      res.status(500).json({
        status: "error",
        message: err.message || "Internal server error",
      });
    });

    
    server.listen(PORT, () => {
      console.log("");
      console.log("╔══════════════════════════════════════════════════════════════╗");
      console.log("║                                                              ║");
      console.log("║           🌿 GAIA COMMONS API v5.0 🌿                        ║");
      console.log("║                                                              ║");
      console.log("║   Transforming education through regenerative agriculture    ║");
      console.log("║                                                              ║");
      console.log(`║   Server running on http://localhost:${PORT}                 ║`);
      console.log("║                                                              ║");
      console.log("║   Endpoints:                                                 ║");
      console.log("║   • GET  /api/health           - Health check                ║");
      console.log("║   • GET  /api/pilot            - Pilot program stats         ║");
      console.log("║   • GET  /api/endowment        - Endowment metrics           ║");
      console.log("║   • GET  /api/timeline         - Timeline events             ║");
      console.log("║   • GET  /api/financials       - Financial metrics           ║");
      console.log("║   • GET  /api/climate          - Climate metrics             ║");
      console.log("║   • GET  /api/slides           - Slide deck data             ║");
      console.log("║   • GET  /api/schools          - All schools                 ║");
      console.log("║   • GET  /api/school-clusters  - School clusters             ║");
      console.log("║   • GET  /api/scale-projections - Growth projections         ║");
      console.log("║   • ... and 30+ more endpoints                               ║");
      console.log("║                                                              ║");
      console.log("╚══════════════════════════════════════════════════════════════╝");
      console.log("");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(async () => {
    await closePool();
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully...");
  server.close(async () => {
    await closePool();
    console.log("Server closed");
    process.exit(0);
  });
});
