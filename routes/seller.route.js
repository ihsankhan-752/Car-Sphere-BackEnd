import express from "express";

import {
  sellerLoginController,
  sellerSignUpController,
} from "../controllers/seller.auth.controller.js";

const router = express.Router();

router.post("/signUp", sellerSignUpController);
router.post("/login", sellerLoginController);

export default router;
