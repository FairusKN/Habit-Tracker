import app from "./app";
import prisma from "@/config/db";
import ENV from "@/config/env";
import { logger } from "@/config/logger";

const server = app.listen(ENV.PORT, () => {
  logger.info(`Server running on port ${ENV.PORT} in ${ENV.NODE_ENV} mode`);
})

const handleShutdown = async () => {
  logger.info("Shutdown signal received");

  // Add connection draining
  app.disable('connection'); // Stop accepting new connections

  // Add timeout for existing connections
  const _ = setTimeout(() => {
    logger.warn('Connection drain timeout reached, forcing shutdown');
    process.exit(1);
  }, 10000);

  server.close(async () => {
    logger.info("HTTP server closed");

    try {
      await prisma.$disconnect();
      logger.info("Database connections closed");

      process.exit(0);
    } catch (err) {
      logger.error("Error during shutdown:", err);
      process.exit(1);
    }
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 30000);
};

process.on("SIGTERM", handleShutdown);
process.on("SIGINT", handleShutdown);

