import { varchar, pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { userRoleEnum } from "./enums.js";

export const userTable = pgTable("users", {
  userId: uuid("user_id").primaryKey().defaultRandom(),
  username: varchar("user_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: text("password").notNull(),
  role: userRoleEnum().notNull().default("buyer"),
  phone: varchar("phone", { length: 25 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
