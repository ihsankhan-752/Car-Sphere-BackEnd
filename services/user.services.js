import { userTable } from "../db/schema/user.schema.js";
import db from "../db/index.js";
import { eq } from "drizzle-orm";
import ErrorHandler from "../utils/error.handler.js";

import bcrypt from "bcrypt";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import jwt from "jsonwebtoken";

export const userSignUpService = async (data) => {
  const { username, email, password, phone, city } = data;

  const [existingUser] = await db
    .select({ email: userTable.email })
    .from(userTable)
    .where(eq(userTable.email, email));

  if (existingUser) {
    throw new ErrorHandler(`User with this email ${email} already Exist`, 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [newUser] = await db
    .insert(userTable)
    .values({
      username,
      email,
      password: hashedPassword,
      phone,
      city,
    })
    .returning({ id: userTable.userId, role: userTable.role });

  return newUser;
};

export const userLoginService = async (data) => {
  const { email, password } = data;

  const [existingUser] = await db
    .select({
      userId: userTable.userId,
      email: userTable.email,
      username: userTable.username,
      password: userTable.password,
      role: userTable.role,
    })
    .from(userTable)
    .where(eq(userTable.email, email));

  if (!existingUser) {
    throw new ErrorHandler(`User with this email ${email} did not exist`, 404);
  }

  const isPasswordMatch = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordMatch) {
    throw new ErrorHandler("Incorrect Password", 401);
  }

  const payload = {
    userId: existingUser.userId,
    username: existingUser.username,
    role: existingUser.role,
    email: existingUser.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });

  return {
    token,
    user: {
      userId: existingUser.userId,
      username: existingUser.username,
      email: existingUser.email,
      role: existingUser.role,
    },
  };
};

export const currentUserInformationServices = async (userId) => {
  const [currentUser] = await db
    .select({
      username: userTable.username,
      email: userTable.email,
      role: userTable.role,
      city: userTable.city,
      phone: userTable.phone,
      createdAt: userTable.createdAt,
    })
    .from(userTable)
    .where(eq(userTable.userId, userId));

  return currentUser;
};
