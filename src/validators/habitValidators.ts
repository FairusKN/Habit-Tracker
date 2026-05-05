import { z } from "zod";
import FrequencyType from "@utils/habitFrequencyType";

const habitIdParam = z.object({
  habitId: z.string().uuid("Invalid habit ID"),
});

export const getHabitsSchema = z.object({
  params: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
  }),
});

export const showHabitSchema = z.object({
  params: habitIdParam,
});

export const createHabitSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(255),
    description: z.string().max(1000).nullable().optional(),
    frequency_type: z.nativeEnum(FrequencyType),
    target: z.number().int().positive(),
  }),
});

export const updateHabitSchema = z.object({
  params: habitIdParam,
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().max(1000).optional(),
    frequency_type: z.nativeEnum(FrequencyType).optional(),
    target: z.number().int().positive().optional(),
  }),
});

export const deleteHabitSchema = z.object({
  params: habitIdParam,
});

export const logHabitSchema = z.object({
  params: habitIdParam,
  body: z.object({
    count: z.number().int().positive(),
  }),
});

export const getLogsSchema = z.object({
  query: z.object({
    start_date: z.string().datetime().optional(),
    end_date: z.string().datetime().optional(),
  }),
});

export const streakHabitSchema = z.object({
  params: habitIdParam,
});
