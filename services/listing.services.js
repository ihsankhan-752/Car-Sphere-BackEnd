import { listingTable } from "../db/schema/listing.schema.js";
import db from "../db/index.js";
import ErrorHandler from "../utils/error.handler.js";
import { and, eq, ilike, gte, lte } from "drizzle-orm";
import { sendInquiryFormEmail } from "./email.services.js";

export const createListingService = async (data, userId) => {
  const { title, description, company, model, price, mileage, color, images } =
    data;

  const [newListing] = await db
    .insert(listingTable)
    .values({
      sellerId: userId,
      title,
      description,
      company,
      model,
      price,
      mileage,
      color,
      images,
    })
    .returning({
      id: listingTable.id,
      title: listingTable.title,
      company: listingTable.company,
      model: listingTable.model,
      price: listingTable.price,
      images: listingTable.images,
      status: listingTable.status,
      createdAt: listingTable.createdAt,
    });

  return newListing;
};

export const getListingService = async (filters = {}) => {
  //                                               ^^^^^^
  //                                 Default value — if no filters passed,
  //                                 use empty object. Prevents crash.

  const { search, company, fuelType, transmission, minPrice, maxPrice } =
    filters;

  // Start with an empty array
  // We will only push conditions for filters that were actually sent
  const conditions = [];

  // here if search has some value
  if (search) {
    conditions.push(ilike(listingTable.title, `%${search}%`));
  }

  // if search contain company name
  if (company) {
    conditions.push(ilike(listingTable.company, `%${company}%`));
  }

  if (fuelType) {
    conditions.push(eq(listingTable.fuelType, fuelType)); // here we are using eq because its enum we need exact match
  }

  if (transmission) {
    conditions.push(eq(listingTable.transmission, transmission)); // here we are using eq because its enum we need exact match
  }

  if (minPrice !== undefined) {
    //  ^^^^^^^^^^^^^^^^^^^^
    //  !== undefined not just if (minPrice)
    //  Because if minPrice = 0, if(0) is false — wrong!
    //  minPrice = 0 is a valid filter and must be included
    conditions.push(gte(listingTable.price, String(minPrice)));
    //                ^^^
    //                gte = greater than or equal
    //                price >= minPrice
    //                String() because numeric column expects string
  }

  if (maxPrice !== undefined) {
    conditions.push(lte(listingTable.price, String(maxPrice)));
    //                ^^^
    //                lte = less than or equal
    //                price <= maxPrice
  }

  const listings = await db
    .select({
      id: listingTable.id,
      title: listingTable.title,
      description: listingTable.description,
      company: listingTable.company,
      model: listingTable.model,
      price: listingTable.price,
      mileage: listingTable.mileage,
      fuelType: listingTable.fuelType,
      transmission: listingTable.transmission,
      color: listingTable.color,
      images: listingTable.images,
      status: listingTable.status,
      createdAt: listingTable.createdAt,
    })
    .from(listingTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    //        Ternary — one line if/else:
    //        IF conditions array has items → combine with and()
    //        ELSE → undefined = no WHERE = return everything
    //
    //        ...conditions = spread operator
    //        Unpacks array: [a, b, c] → a, b, c
    //        and([a, b, c]) ← WRONG
    //        and(a, b, c)   ← CORRECT — spread does this
    // Spreads the array into: and(obj1, obj2, obj3)
    // Drizzle renders this as:
    //   WHERE fuel_type = 'petrol' AND price >= '5000' AND price <= '20000'

    .orderBy(listingTable.createdAt);

  return listings;
};

//actually conditions returns sql objects not raw strings

// conditions = [
//   // eq(listingTable.fuelType, "petrol")  ← the RESULT of calling this
//   { sql: `fuel_type = 'petrol'` },

//   // gte(listingTable.price, "5000")
//   { sql: `price >= '5000'` },

//   // lte(listingTable.price, "20000")
//   { sql: `price <= '20000'` },
// ]

export const deleteListingService = async (listingId, sellerId) => {
  const [deletedListing] = await db
    .delete(listingTable)
    .where(
      and(eq(listingTable.id, listingId), eq(listingTable.sellerId, sellerId)),
    )
    .returning({ id: listingTable.id });

  if (!deletedListing) {
    throw new ErrorHandler("No Listing Found", 400);
  }

  return deletedListing;
};

export const listingInquiryService = async ({
  username,
  userEmail,
  title,
  description,
}) => {
  const response = await sendInquiryFormEmail({
    userEmail,
    username,
    title,
    description,
  });

  return response;
};
