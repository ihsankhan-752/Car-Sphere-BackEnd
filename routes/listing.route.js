import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { sellerMiddleware } from "../middlewares/seller.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import {
  createListingController,
  deleteListingController,
  getListingController,
  listingInquiryController,
} from "../controllers/listing.controller.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  sellerMiddleware,
  upload.array("images", 5),
  createListingController,
);
router.get("/", getListingController);

router.delete(
  "/:id/delete",
  authMiddleware,
  sellerMiddleware,
  deleteListingController,
);

router.post("/inquiry", listingInquiryController);

export default router;
