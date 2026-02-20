import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true
    },
    slug: String // optional, for SEO-friendly URLs
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);
export default Category;
