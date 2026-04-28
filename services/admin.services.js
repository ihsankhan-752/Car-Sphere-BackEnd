import { userTable } from "../db/schema/user.schema.js";
import db from "../db/index.js";
import { and, eq } from "drizzle-orm";
import ErrorHandler from "../utils/error.handler.js";
import bcrypt from "bcrypt";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import jwt from "jsonwebtoken";

export const adminSignUpService = async (data) => {
  const { username, email, password, phone, city } = data;

  const [existingAdmin] = await db
    .select({ email: userTable.email })
    .from(userTable)
    .where(eq(userTable.email, email));

  if (existingAdmin) {
    throw new ErrorHandler(`Admin with this Email already exist`, 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [newAdmin] = await db
    .insert(userTable)
    .values({
      username,
      email,
      password: hashedPassword,
      phone,
      city,
      role: "admin",
    })
    .returning({ id: userTable.userId, role: userTable.role });

  return newAdmin;
};

export const adminLoginService = async (data) => {
  const { email, password } = data;

  const [existingAdmin] = await db
    .select({
      userId: userTable.userId,
      email: userTable.email,
      username: userTable.username,
      password: userTable.password,
      role: userTable.role,
    })
    .from(userTable)
    .where(eq(userTable.email, email));

  if (!existingAdmin) {
    throw new ErrorHandler(`Admin with Email does not exist`, 409);
  }

  const isPasswordMatch = await bcrypt.compare(
    password,
    existingAdmin.password,
  );

  if (!isPasswordMatch) {
    throw new ErrorHandler("Incorrect Password", 401);
  }

  const payload = {
    userId: existingAdmin.userId,
    username: existingAdmin.username,
    role: existingAdmin.role,
    email: existingAdmin.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });

  return {
    token: token,
    admin: {
      userId: existingAdmin.userId,
      username: existingAdmin.username,
      email: existingAdmin.email,
      role: existingAdmin.role,
    },
  };
};
