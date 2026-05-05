import express from "express";
import HabitService from "@/services/habitService";
import HabitController from "@/controllers/habitController";

//Validation
import validateRequest from "@/middleware/validateRequest";
import {
  getHabitsSchema,
  showHabitSchema,
  createHabitSchema,
  updateHabitSchema,
  deleteHabitSchema,
  logHabitSchema,
  getLogsSchema,
  streakHabitSchema
} from "@/validators/habitValidators";

const habitRoutes = express.Router()

const habitService = new HabitService();
const habitController = new HabitController(habitService);


habitRoutes.get(
  "/show/:habitId",
  validateRequest(showHabitSchema),
  habitController.show
);

habitRoutes.get(
  "/get/:page?/:limit?",
  validateRequest(getHabitsSchema),
  habitController.get
);

habitRoutes.get(
  "/logs",
  validateRequest(getLogsSchema),
  habitController.getlogs
);

habitRoutes.get(
  "/streak/:habitId",
  validateRequest(streakHabitSchema),
  habitController.getStreakHabit
);

habitRoutes.post(
  "/create",
  validateRequest(createHabitSchema),
  habitController.create
);

habitRoutes.post(
  "/log/:habitId",
  validateRequest(logHabitSchema),
  habitController.log
);

habitRoutes.put(
  "/update/:habitId",
  validateRequest(updateHabitSchema),
  habitController.update
);

habitRoutes.delete(
  "/delete/:habitId",
  validateRequest(deleteHabitSchema),
  habitController.delete
);

export default habitRoutes;
