import express from "express";

import {
  adminLoginController,
  adminSignUpController,
} from "../controllers/admin.auth.controller.js";

const router = express.Router();

router.post("/signUp", adminSignUpController);
router.post("/login", adminLoginController);

export default router;
