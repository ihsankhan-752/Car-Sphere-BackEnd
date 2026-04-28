import { userTable } from "../db/schema/user.schema.js";
import db from "../db/index.js";
import { and, eq } from "drizzle-orm";
import ErrorHandler from "../utils/error.handler.js";
import bcrypt from "bcrypt";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import jwt from "jsonwebtoken";

export const sellerSignUpService = async (data) => {
  const { username, email, password, phone, city } = data;

  const [existingSeller] = await db
    .select({ email: userTable.email })
    .from(userTable)
    .where(eq(userTable.email, email));

  if (existingSeller) {
    throw new ErrorHandler(`Seller with this Email already exist`, 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [newSeller] = await db
    .insert(userTable)
    .values({
      username,
      email,
      password: hashedPassword,
      phone,
      city,
      role: "seller",
    })
    .returning({ id: userTable.userId, role: userTable.role });

  return newSeller;
};

export const sellerLoginService = async (data) => {
  const { email, password } = data;

  const [existingSeller] = await db
    .select({
      userId: userTable.userId,
      email: userTable.email,
      username: userTable.username,
      password: userTable.password,
      role: userTable.role,
    })
    .from(userTable)
    .where(eq(userTable.email, email));

  if (!existingSeller) {
    throw new ErrorHandler(`Seller with Email does not exist`, 409);
  }

  const isPasswordMatch = await bcrypt.compare(
    password,
    existingSeller.password,
  );

  if (!isPasswordMatch) {
    throw new ErrorHandler("Incorrect Password", 401);
  }

  const payload = {
    userId: existingSeller.userId,
    username: existingSeller.username,
    role: existingSeller.role,
    email: existingSeller.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });

  return {
    token: token,
    seller: {
      userId: existingSeller.userId,
      username: existingSeller.username,
      email: existingSeller.email,
      role: existingSeller.role,
    },
  };
};
