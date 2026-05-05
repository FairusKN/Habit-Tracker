import BaseController from "./baseController";
import HabitService from "@/services/habitService";
import type { WithHabitID as WithHabitID, PaginateParams } from "@utils/typeParams";
import type { Request, Response, NextFunction } from "express";



class AuthController extends BaseController {
  constructor(private habitService: HabitService) {
    super()
  }

  show = async (req: Request<WithHabitID>, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.habitService.showHabit(req.user.userId, req.params.habitId);
    })
  }

  get = async (req: Request<PaginateParams>, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.habitService.getHabits(req.params.page, req.params.limit, req.user.userId);
    })
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.habitService.createHabit(req.body, req.user.userId);
    })
  }


  update = async (req: Request<WithHabitID>, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.habitService.updateHabit(req.body, req.user.userId, req.params.habitId);
    })
  }


  delete = async (req: Request<WithHabitID>, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.habitService.deleteHabit(req.user.userId, req.params.habitId);
    })
  }

  log = async (req: Request<WithHabitID>, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.habitService.logHabit(req.body, req.user.userId, req.params.habitId);
    })
  }

  getlogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.habitService.getLogs(req.body, req.user.userId);
    })
  }

  getStreakHabit = async (req: Request<WithHabitID>, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.habitService.streakHabit(req.body, req.user.userId);
    })
  }
}

export default AuthController;
