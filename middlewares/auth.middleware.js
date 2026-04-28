import ErrorHandler from "../utils/error.handler.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
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

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedData;
    next();
  } catch (error) {
    return next(error);
  }
};
