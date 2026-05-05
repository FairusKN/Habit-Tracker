//Package
import express from "express";

//Type
import type { ErrorRequestHandler } from "express";

//Files
import ENV from "@/config/env"
import routes from "@/routes/app";
import { errorHandler } from "@/middleware/errorHandler";
import { authLimiter, apiLimiter } from "@/middleware/rateLimiter";
import notFoundHandler from "@/middleware/notFound";

const app = express();

const setupMiddleware = (app: express.Application) => {
  // Security
  //app.use(cors({ origin: ENV.FRONTEND_URL, credentials: true }));

  //Size Lmit
  app.use(express.json({ limit: "10kb" }));

  //Rate Limiting
  app.use("/api/auth", authLimiter);
  app.use("/api", apiLimiter);
}

setupMiddleware(app);
app.use("/api", routes);

// Health Check
app.get("/health", (_, res) => {
  res.json({
    status: "ok",
    timestamp: new Date(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
  });
});

// Error Handler
const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  return errorHandler(err, req, res, next);
}

app.use(errorMiddleware);

app.use(notFoundHandler);

export default app;
