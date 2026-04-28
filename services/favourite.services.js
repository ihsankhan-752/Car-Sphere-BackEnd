import { favouriteListingTable } from "../db/schema/favourite.schema.js";
import db from "../db/index.js";
import { and, eq } from "drizzle-orm";
import { listingTable } from "../db/schema/listing.schema.js";
import ErrorHandler from "../utils/error.handler.js";

export const addListingToFavouriteService = async (userId, listingId) => {
  const [listing] = await db
    .select()
    .from(favouriteListingTable)
    .where(
      and(
        eq(favouriteListingTable.listingId, listingId),
        eq(favouriteListingTable.userId, userId),
      ),
    );

  if (listing) {
    throw new ErrorHandler("Listing Already Exist in Favourites", 409);
  }

  const [newFavourite] = await db
    .insert(favouriteListingTable)
    .values({
      listingId: listingId,
      userId: userId,
    })
    .returning({
      id: favouriteListingTable.id,
      listingId: favouriteListingTable.listingId,
    });

  return newFavourite;
};

export const getUserFavouriteServices = async (userId) => {
  const favourites = await db
    .select({
      id: favouriteListingTable.id,
      listingId: listingTable.id,
      title: listingTable.title,
      company: listingTable.company,
      model: listingTable.model,
      price: listingTable.price,
      images: listingTable.images,
      status: listingTable.status,
    })
    .from(favouriteListingTable)
    .innerJoin(
      listingTable,
      eq(favouriteListingTable.listingId, listingTable.id),
    )
    .where(eq(favouriteListingTable.userId, userId));

  return favourites;
};

export const removeListingFromFavouriteService = async (
  favouriteId,
  userId,
) => {
  const [deleted] = await db
    .delete(favouriteListingTable)
    .where(
      and(
        eq(favouriteListingTable.id, favouriteId),
        eq(favouriteListingTable.userId, userId),
      ),
    )
    .returning({ id: favouriteListingTable.id });

  console.log(deleted);

  if (!deleted) {
    throw new ErrorHandler("Listing Not Found in Favourite", 404);
  }

  return deleted;
};
