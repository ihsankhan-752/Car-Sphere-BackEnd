import {
  pgTable,
  varchar,
  uuid,
  text,
  timestamp,
  numeric,
  integer,
} from "drizzle-orm/pg-core";
import { userTable } from "./user.schema.js";
import { fuelTypeEnum, listingStatusEnum, transmissionEnum } from "./enums.js";

export const listingTable = pgTable("listings", {
  id: uuid().primaryKey().defaultRandom(),
  sellerId: uuid("seller_id")
    .references(() => userTable.userId)
    .notNull(),
  title: varchar({ length: 100 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  company: varchar({ length: 100 }).notNull(),
  model: varchar({ length: 100 }).notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  mileage: integer("mileage").notNull(),
  fuelType: fuelTypeEnum("fuel_type").notNull().default("petrol"),
  transmission: transmissionEnum("transmission").notNull().default("automatic"),
  color: varchar({ length: 30 }).notNull(),
  images: text("images").array().notNull(),
  status: listingStatusEnum().notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
