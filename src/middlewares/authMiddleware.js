import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  // 1. Simply grab the token directly from the custom 'token' header
  const token = req.headers.token;

  // 2. If it's missing, reject the request
  if (!token) {
    return res.status(401).json({ status: "fail", message: "You are not logged in. Please provide a 'token' header." });
  }

  try {
    // 3. Verify the token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    
    // console.log("DECODED: ",decoded.findUser._id);

    // 4. Find the user
    const currentUser = await User.findById(decoded.findUser._id);
    
    // console.log(currentUser);
    
    if (!currentUser) {
      return res.status(401).json({ status: "fail", message: "User no longer exists" });
    }
    
    // 5. Attach user to request and proceed
    req.user = currentUser;
    next();
  } catch (err) {
    console.log(err);
    
    res.status(401).json({ status: "fail", message: "Invalid token" });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: "fail", message: "Access denied" });
    }
    next();
  };
};