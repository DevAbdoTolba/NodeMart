import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// Get current logged-in user
export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("-password");
  res.status(200).json({ status: "success", data: user });
});

// Update current logged-in user
export const updateMe = catchAsync(async (req, res, next) => {
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
});

// Delete current user
export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.user._id);
  res.status(204).json({ status: "success", data: null });
});

// Admin: Block/Unblock user
export const updateUserStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { isBlocked } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    { isBlocked },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) return next(new AppError("User not found", 404));
  res.status(200).json({ status: "success", data: user });
});
