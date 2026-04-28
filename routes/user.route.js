import express from "express";

import {
  userLoginController,
  userProfileController,
  userSignUpController,
} from "../controllers/user.auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signUp", userSignUpController);
router.post("/login", userLoginController);
router.get("/me", authMiddleware, userProfileController);

export default router;
