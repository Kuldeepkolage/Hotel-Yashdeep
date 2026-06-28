import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";

import errorHandler from "./middleware/error.middleware.js";
import notFound from "./middleware/notFound.middleware.js";
import { apiLimiter } from "./middleware/rateLimiter.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/adminRoutes.js";
import menuRoutes from "./routes/menu.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import contentRoutes from "./routes/content.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";
import tableRoutes from "./routes/table.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

// Security headers
app.use(helmet());

// Logging
app.use(morgan("dev"));

// Response compression
app.use(compression());

// Allow Frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Parse JSON
app.use(express.json());

// Parse URL Encoded Data
app.use(express.urlencoded({ extended: true }));

// Rate limit all API traffic
app.use("/api", apiLimiter);

// Health Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hotel Yashdeep API is running 🚀",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 handler - must come after all routes
app.use(notFound);

// Centralized error handler - must be the LAST middleware registered
app.use(errorHandler);

export default app;
