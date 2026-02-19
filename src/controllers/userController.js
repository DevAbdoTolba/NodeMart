import User from "../models/userModel.js";
import AppError from "../utils/appError.js";

// Get current logged-in user
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ status: "success", data: user });
  } catch (err) {
    next(err);
  }
};

// Update current logged-in user
export const updateMe = async (req, res, next) => {
  try {
    const allowedFields = ["name", "email", "phone"];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field]) updates[field] = req.body[field];
    });

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({ status: "success", data: updatedUser });
  } catch (err) {
    next(err);
  }
};

// Delete current user
export const deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    next(err);
  }
};

// Admin: Block/Unblock user
export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isBlocked },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return next(new AppError("User not found", 404));
    res.status(200).json({ status: "success", data: user });
  } catch (err) {
    next(err);
  }
};
