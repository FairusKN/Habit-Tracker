import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import ENV from "@/config/env";

const adapter = new PrismaPg({
  connectionString: ENV.POSTGRESQL_DATABASE_URL
});

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : [],
  adapter
});

export default prisma;
