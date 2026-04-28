import { userTable } from "../db/schema/user.schema.js";
import db from "../db/index.js";
import ErrorHandler from "../utils/error.handler.js";

import {
  loginValidation,
  signUpValidation,
} from "../validations/auth.validation.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import {
  currentUserInformationServices,
  userLoginService,
  userSignUpService,
} from "../services/user.services.js";
import { success } from "zod";

export const userSignUpController = async (req, res, next) => {
  try {
    const validateData = await signUpValidation.safeParseAsync(req.body);
    if (!validateData.success) {
      return next(new ErrorHandler(validateData.error.issues[0].message, 400));
    }

    const newUser = await userSignUpService(validateData.data);

    return res.status(201).json({
      success: true,
      message: `Account Created Successfully`,
      data: newUser,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message));
  }
};

export const userLoginController = async (req, res, next) => {
  try {
    const validateData = await loginValidation.safeParseAsync(req.body);

    if (!validateData.success) {
      return next(new ErrorHandler(validateData.error.issues[0].message, 400));
    }

    const loggedInUser = await userLoginService(validateData.data);

    return res.status(200).json({
      success: true,
      message: "User Logged In",
      token: loggedInUser.token,
      user: loggedInUser.user,
    });
  } catch (error) {
    return next(error);
  }
};

export const userProfileController = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const currentUser = await currentUserInformationServices(userId);

    return res.status(200).json({ success: true, data: currentUser });
  } catch (error) {
    return next(error);
  }
};
