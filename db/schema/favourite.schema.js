import { uuid, pgTable, timestamp } from "drizzle-orm/pg-core";
import { userTable } from "./user.schema.js";
import { listingTable } from "./listing.schema.js";

export const favouriteListingTable = pgTable("favourite_listings", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => userTable.userId)
    .notNull(),
  listingId: uuid("listing_id")
    .references(() => listingTable.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
