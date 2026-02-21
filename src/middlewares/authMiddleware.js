import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const protect = catchAsync(async (req, res, next) => {
  // 1. Simply grab the token directly from the custom 'token' header
  const token = req.headers.token;

  // 2. If it's missing, reject the request
  if (!token) {
    return next(new AppError("You are not logged in. Please provide a 'token' header.", 401));
  }

  // 3. Verify the token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
  } catch (err) {
    return next(new AppError("Invalid token", 401));
  }

  // 4. Find the user
  const currentUser = await User.findById(decoded.data._id);

  if (!currentUser) {
    return next(new AppError("User no longer exists", 401));
  }

  // 5. Attach user to request and proceed
  req.user = currentUser;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Access denied", 403));
    }
    next();
  };
};
