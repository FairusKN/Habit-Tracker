import express from "express";
import AuthController from "@/controllers/authController";
import AuthService from "@/services/authService";

//Validation
import validateRequest from "@/middleware/validateRequest";
import { registerSchema, loginSchema } from "@/validators/authValidators";

const authRoutes = express.Router();

const authService = new AuthService();
const authController = new AuthController(authService)

authRoutes.post("/register", validateRequest(registerSchema), authController.register);
authRoutes.post("/login", validateRequest(loginSchema), authController.login);
//authRoutes.use("/logout");

export default authRoutes;
