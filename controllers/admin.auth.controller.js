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
  adminLoginService,
  adminSignUpService,
} from "../services/admin.services.js";

export const adminSignUpController = async (req, res, next) => {
  try {
    const validateData = await signUpValidation.safeParseAsync(req.body);

    if (!validateData.success) {
      return next(new ErrorHandler(validateData.error.issues[0].message, 400));
    }

    const newAdmin = await adminSignUpService(validateData.data);

    return res.status(201).json({
      success: true,
      message: "Admin Account Created",
      data: newAdmin,
    });
  } catch (error) {
    return next(error);
  }
};

export const adminLoginController = async (req, res, next) => {
  try {
    const validateData = await loginValidation.safeParseAsync(req.body);

    if (!validateData.success) {
      return next(new ErrorHandler(validateData.error.issues[0].message, 400));
    }

    const admin = await adminLoginService(validateData.data);

    return res.status(200).json({
      success: true,
      token: admin.token,
      data: admin.admin,
    });
  } catch (error) {
    console.log(error.message);
    return next(error);
  }
};
