import AppError from "../utils/appError.js";

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(new AppError("Admins only", 403));
  }
  next();
};

export default adminMiddleware;
