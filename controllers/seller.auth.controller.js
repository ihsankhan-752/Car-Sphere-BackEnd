import { userTable } from "../db/schema/user.schema.js";
import db from "../db/index.js";
import ErrorHandler from "../utils/error.handler.js";

import {
  loginValidation,
  signUpValidation,
} from "../validations/auth.validation.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { success } from "zod";
import {
  sellerLoginService,
  sellerSignUpService,
} from "../services/seller.services.js";

export const sellerSignUpController = async (req, res, next) => {
  try {
    const validateData = await signUpValidation.safeParseAsync(req.body);

    if (!validateData.success) {
      return next(new ErrorHandler(validateData.error.issues[0].message, 400));
    }

    const newSeller = await sellerSignUpService(validateData.data);

    return res.status(201).json({
      success: true,
      message: "Seller Account Created",
      data: newSeller,
    });
  } catch (error) {
    return next(error);
  }
};

export const sellerLoginController = async (req, res, next) => {
  try {
    const validateData = await loginValidation.safeParseAsync(req.body);

    if (!validateData.success) {
      return next(new ErrorHandler(validateData.error.issues[0].message, 400));
    }

    const seller = await sellerLoginService(validateData.data);

    return res.status(200).json({
      success: true,
      token: seller.token,
      data: seller.seller,
    });
  } catch (error) {
    return next(error);
  }
};
