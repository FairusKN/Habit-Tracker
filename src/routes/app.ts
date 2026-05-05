import express from "express";
import { requireAuth } from "@/middleware/authMiddleware";
import authRoutes from "./authRoutes";
import habitRoutes from "./habitRoutes";

const routes = express.Router();

routes.use("/auth", authRoutes);
routes.use("/habits", requireAuth, habitRoutes);

export default routes;
