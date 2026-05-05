import { AppError } from "@utils/appError";
import prisma from "@/config/db";
import type { HabitLog } from "@/generated/prisma";
import FrequencyType from "@utils/habitFrequencyType";

class HabitService {
  async getHabits(page: string, limit: string, userId: string) {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await Promise.all([
      prisma.habit.findMany(
        { skip, take: limitNum, orderBy: { id: 'desc' }, where: { user_id: userId } },
      ),
      prisma.habit.count()
    ]);

    return {
      data: data,
      total: total
    };
  }

  async showHabit(userId: string, habitId: string) {
    const habit = await prisma.habit.findUnique({
      where: {
        id: habitId,
        user_id: userId
      },
      include: {
        habitLogs: true
      }
    })

    return habit;
  }

  async createHabit(data: {
    name: string,
    description: string | null,
    frequency_type: FrequencyType,
    target: number
  }, userId: string) {
    const habit = await prisma.habit.create({
      data: {
        ...data,
        user_id: userId
      }
    });

    return habit;
  }

  async updateHabit(data: Partial<{
    name: string,
    description: string,
    frequency_type: FrequencyType,
    target: number
  }>, userId: string, habitId: string) {
    const habit = await prisma.habit.update({
      where: { id: habitId, user_id: userId },
      data,
    })

    return habit;
  }

  async deleteHabit(userId: string, habitId: string) {
    await prisma.habit.delete({
      where: { id: habitId, user_id: userId },
    })
  }

  async logHabit(data: {
    count: number
  }, habitId: string, userId: string) {
    if (!(await this.isUserCreateHabit(habitId, userId))) throw new AppError("This Habit is not created by the given User", 401);

    const habitLog = await prisma.habitLog.create({
      data: {
        // Specifically chose one if data grow
        count: data.count,
        habit_id: habitId
      }
    })

    return habitLog;
  }

  async getLogs(data: Partial<{
    start_date: string,
    end_date: string
  }>, userId: string) {
    const habitLogs = await prisma.habitLog.findMany({
      where: {
        date: {
          ...(data.start_date && { gte: new Date(data.start_date) }),
          ...(data.end_date && { lte: new Date(data.end_date) }),
        },
        habit: {
          user_id: userId
        }
      }
    })

    return habitLogs
  }

  async streakHabit(userId: string, habitId: string) {
    const habitLogs = await prisma.habitLog.findMany({
      where: {
        habit: {
          id: habitId,
          user_id: userId,
        }
      }
    })

    return this.calculateStreak(habitLogs);
  }

  //async dailySummary(userId: string) {
  //  const [total_habit, completed] = await prisma.$transaction([
  //    prisma.habitLog.findMany({
  //      distinct: ['habit_id'],
  //      where: {
  //        habit: {
  //          user_id: userId
  //        },
  //        date: {
  //          gte: new Date()
  //        }
  //      }
  //    }),

  //  ])
  //}

  private calculateStreak(habitLogs: HabitLog[]) {
    let current_streak = 0;
    let longest_streak = 0;
    let yesterday_date = habitLogs[0]
      ? new Date(habitLogs[0].date)
      : undefined;

    yesterday_date?.setDate(yesterday_date.getDate() - 1);

    for (const log of habitLogs) {
      yesterday_date?.setDate(yesterday_date?.getDate() + 1);

      if (yesterday_date?.toDateString() === log.date.toDateString()) {
        current_streak += 1;
      } else {
        yesterday_date = new Date(log.date)
        yesterday_date.setDate(yesterday_date.getDate() + 1)
      }

      if (current_streak > longest_streak) longest_streak = current_streak
    }

    return {
      current_streak: current_streak,
      longest_streak: longest_streak
    };
  }

  private async isUserCreateHabit(habitId: string, userId: string): Promise<boolean> {
    const habit = await prisma.habit.findUnique({ where: { id: habitId } });

    return habit?.user_id === userId;
  }
}

export default HabitService;
