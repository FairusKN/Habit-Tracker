import ENV from "@/config/env";
import { AppError } from "@utils/appError";
import prisma from "@/config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


class AuthService {
  async register(data: {
    email: string,
    full_name: string,
    password: string,
  }) {
    const { password, ...rest } = data;

    if (await this.isUserExist(data.email)) throw new AppError("User Already Exist", 409);

    const user = await prisma.user.create({
      data: {
        ...rest,
        password: await this.hashPassword(password)
      },
      select: {
        id: true,
        email: true,
        full_name: true
      }
    });

    return user;
  }

  async login(data: {
    email: string,
    password: string
  }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (!user || !await bcrypt.compare(data.password, user.password)) throw new AppError("Email or Password Wrong", 404);
    const accessToken = this.generateAcessToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name
      },
      accessToken
    };
  }

  // Private
  private async hashPassword(password: string): Promise<string> {
    const salt = ENV.BCRYPT_SALT_ROUNDS;
    const hashed_password = await bcrypt.hash(password, salt);

    return hashed_password;
  }

  private async isUserExist(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    return user ? true : false;
  }

  private generateAcessToken(userId: string): string {
    return jwt.sign({ userId }, ENV.JWT_SECRET as string, {
      expiresIn: ENV.JWT_EXPIRY as any
    })
  }
}

export default AuthService;
