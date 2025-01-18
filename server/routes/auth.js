import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/Users.js';
import Product from '../models/Product.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const user = await User.create({ email, password, userType });

    const token = jwt.sign(
      { id: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ 
      message: 'User created', 
      user: { id: user._id, email: user.email, userType: user.userType }, token, 
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', user:{id: user._id, email:user.email, userType:user.userType}, token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "f9595e6e9d11d1",
    pass: "4905811891a09c",
  },
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `You can reset your password by clicking the link below:\n\n${resetLink}`,
      html: `<p>You can reset your password by clicking the link below:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });

    res.status(200).json({ message: 'Password reset link sent' });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Test Email',
      text: 'This is a test email from your project!',
    });

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Failed to send email:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});



router.post("/save-cart", async (req, res) => {
  try {
      const { userId, cartItems } = req.body;
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      user.cart = cartItems;

      await user.save();

      res.status(200).json({
          message: "cart saved successfully",
          cart: user.cart,
      })
  } catch (error) {
      console.error("Error merging cart:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});



router.get("/cart/:userId", async (req, res) => {
  try {
      const { userId } = req.params;
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      const existingProducts = await Product.find({});
      // const existingProductIds = existingProducts.map((product) => product._id.toString());
      const existingProductsMap = new Map(
          existingProducts.map((product) => [product._id.toString(), product.stock])
      );

      // Filter out deleted items
      const validCartItems = user.cart.filter((item) => {
          const stock = existingProductsMap.get(item.id);
          return stock !== undefined && stock > 0;
      });

      // Update the user's cart in the database
      user.cart = validCartItems;
      await user.save();

      res.status(200).json({ cart: validCartItems });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
