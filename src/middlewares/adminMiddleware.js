const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ status: "fail", message: "Admins only" });
  }
  next();
};

export default adminMiddleware;
