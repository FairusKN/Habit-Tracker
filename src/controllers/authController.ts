import BaseController from "./baseController";
import AuthService from "@/services/authService";
import ENV from "@/config/env";
import type { Request, Response, NextFunction } from "express";

class AuthController extends BaseController {
  constructor(private authService: AuthService) {
    super()
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.authService.register(req.body);
    })
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      const data = await this.authService.login(req.body);
      res.cookie("token", data.accessToken, {
        sameSite: true,
        secure: ENV.NODE_ENV === "production",
        maxAge: (1000 * 60 * 60 * 24) * 7
      })
      return data;
    })
  }
}

export default AuthController;
