import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("role", ["buyer", "seller", "admin"]);

export const fuelTypeEnum = pgEnum("fuel_type", [
  "petrol",
  "diesel",
  "electric",
  "hybrid",
]);

export const transmissionEnum = pgEnum("transmission", ["manual", "automatic"]);

export const listingStatusEnum = pgEnum("listing_status", [
  "pending",
  "sold",
  "approved",
  "rejected",
]);
