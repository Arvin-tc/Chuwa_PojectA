import express from 'express';
import Product from '../models/Product.js';
import { body, validationResult } from 'express-validator'; 

const router = express.Router();

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a positive integer'),
    body('category').notEmpty().withMessage('Category is required').isIn(['Category1', 'Category2', 'Category3']).withMessage('Invalid category'),
    body('imageUrls').isArray({ min: 1 }).withMessage('Image URLs are required'),
    body('imageUrls.*').isURL().withMessage('Invalid image URL'),
  ],

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { name, description, price, stock, createdBy, imageUrls, category } = req.body;
      const product = await Product.create({ name, description, price, stock, createdBy, imageUrls, category});
      res.status(201).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  }
);

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Product.countDocuments();

    res.status(200).json({
      products,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get("/:id", async (req, res) => {
  try {
      const product = await Product.findById(req.params.id);
      if (!product) {
          return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(product);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch product details" });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, 
      runValidators: true, 
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
