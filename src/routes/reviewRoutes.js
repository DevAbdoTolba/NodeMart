import express from "express";
import { 
  createReview, 
  getReviews, 
  updateReview, 
  deleteReview, 
  getAllReviewsForAdmin 
} from "../controllers/reviewController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { validateCreateReview, validateId } from "../middlewares/validationMiddleware.js";

const router = express.Router();

// 1. مسار الأدمن لازم يكون فوق خالص
router.get("/all-admin", protect, restrictTo('admin'), getAllReviewsForAdmin);

// 2. إنشاء مراجعة
router.post("/", protect, validateCreateReview, createReview);

// 3. جلب مراجعات منتج معين (لاحظي validateId هنا)
router.get("/:productId", validateId('productId'), getReviews);

// 4. تحديث وحذف (استخدام validateId الافتراضي لـ :id)
router.patch("/:id", validateId(), protect, updateReview);
router.delete("/:id", validateId(), protect, deleteReview);

export default router;