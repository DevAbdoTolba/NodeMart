// Protect routes, Restrict to Admin, etc.
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";

export const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return next(new AppError("You are not logged in!", 401));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) return next(new AppError("User no longer exists", 401));
    if (currentUser.isBlocked)
      return next(new AppError("Your account is blocked", 403));

    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Access denied", 403));
    }
    next();
  };
};
