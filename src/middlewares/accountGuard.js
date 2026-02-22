import AppError from "../utils/appError.js";

export const accountGuard = (action) => {
    return (req, res, next) => {
        const status = req.user?.status;

        if (status === "Deleted") {
            return next(new AppError("User not found", 404));
        }

        if (status === "Restricted") {
            return next(new AppError("Your account is restricted", 403));
        }

        if (status === "Unverified") {
            return next(new AppError("Please verify your email first", 403));
        }

        if (status === "Guest" && action === "checkout") {
            if (!req.body.phone || !req.body.address) {
                return next(new AppError("Phone and address are required for guest checkout", 400));
            }
        }

        next();
    };
};
