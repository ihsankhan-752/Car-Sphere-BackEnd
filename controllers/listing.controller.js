import { listingTable } from "../db/schema/listing.schema.js";
import db from "../db/index.js";
import { listingValidation } from "../validations/listing.validation.js";
import ErrorHandler from "../utils/error.handler.js";
import {
  createListingService,
  deleteListingService,
  getListingService,
  listingInquiryService,
} from "../services/listing.services.js";

import { uploadMultipleToCloudinary } from "../services/upload.service.js";
import { success } from "zod";

export const createListingController = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(new ErrorHandler("Please upload at least one image", 400));
    }

    if (req.files.length > 5) {
      return next(new ErrorHandler("Maximum 5 images allowed!", 400));
    }

    const validateData = await listingValidation.safeParseAsync(req.body);

    if (!validateData.success) {
      return next(new ErrorHandler(validateData.error.issues[0].message, 400));
    }

    const imageUrls = await uploadMultipleToCloudinary(
      req.files,
      "car-listings",
    );

    const listingData = {
      ...validateData.data,
      images: imageUrls,
    };

    const newListing = await createListingService(listingData, req.user.userId);

    return res.status(201).json({
      success: true,
      message: "Listing Created Successfully",
      data: newListing,
    });
  } catch (error) {
    return next(error);
  }
};

export const getListingController = async (req, res, next) => {
  try {
    const { search, company, fuelType, transmission, minPrice, maxPrice } =
      req.query;

    const filters = {
      search,
      company,
      fuelType,
      transmission,
      minPrice: minPrice ? Number(minPrice) : undefined,
      //        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      //        Convert string '500000' to number 500000
      //        Only if minPrice was actually sent
      //        If not sent — keep as undefined
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    };

    const listings = await getListingService(filters);

    return res.status(200).json({ data: listings });
  } catch (err) {
    return next(err);
  }
};

export const deleteListingController = async (req, res, next) => {
  try {
    const listingId = req.params.id;

    if (!listingId) {
      return next(new ErrorHandler("Listing ID is required", 400));
    }

    const deletedListing = await deleteListingService(
      listingId,
      req.user.userId,
    );

    return res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
      data: deletedListing,
    });
  } catch (error) {
    return next(error);
  }
};

export const listingInquiryController = async (req, res, next) => {
  try {
    const { userEmail, username, title, description } = req.body;

    if (!userEmail || !username || !title || !description) {
      return next(new ErrorHandler("All Fields are required", 400));
    }

    const result = await listingInquiryService({
      userEmail,
      username,
      title,
      description,
    });
    
    return res.status(200).json({
      success: true,
      message: "Inquiry sent successfully",
      data: {
        userEmail,
        username,
        title,
        description,
      },
    });
  } catch (error) {
    return next(error);
  }
};
