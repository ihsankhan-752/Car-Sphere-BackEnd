import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  addListingToFavouriteController,
  getListingFromFavouriteController,
  removeListingFromFavouriteController,
} from "../controllers/favourite.controller.js";
const router = express.Router();

router.post("/", authMiddleware, addListingToFavouriteController);
router.get("/", authMiddleware, getListingFromFavouriteController);
router.delete("/:id", authMiddleware, removeListingFromFavouriteController);
export default router;
