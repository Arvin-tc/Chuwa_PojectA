import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
      min: [0, 'Stock cannot be negative'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Refers to the User model
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    imageUrls: {
        type: [String],
        required: [true, 'Product images are required'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Category1', 'Category2', 'Category3'], // Predefined categories
    },
  });

export default mongoose.model('Product', ProductSchema);