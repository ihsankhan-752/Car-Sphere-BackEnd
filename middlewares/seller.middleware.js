import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/error.handler.js";

export const sellerMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new ErrorHandler("Auth Header Missing", 401));
    }

    if (!authHeader.startsWith("Bearer")) {
      return next(new ErrorHandler("Header Must Start with Bearer", 401));
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(new ErrorHandler("Token Missing", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    if (decoded.role !== "seller") {
      return next(new ErrorHandler("Access denied: Seller Only", 403));
    }

    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid or Expire Token", 401));
  }
};
