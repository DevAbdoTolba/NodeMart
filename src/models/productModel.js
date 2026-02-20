import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [1, 'Price can\'t be less than 1']
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock can't be negative"]
    },
    image: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product must belong to a category']
    }
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;