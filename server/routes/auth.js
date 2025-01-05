const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/Users');

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, 
  port: process.env.SMTP_PORT, 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

router.post('/signup', async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const user = await User.create({ email, password, userType });
    res.status(201).json({ message: 'User created', user });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
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
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});



router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const resetLink = 'http://localhost:3000/reset-password/' + resetToken;
    await transporter.sendMail({
      from: 'process.env.EMAIL_USER',
      to: email,
      subject: 'Password Reset',
      text: `You can reset your password by clicking the link below:\n\n${resetLink}`,
      html: `<p>You can reset your password by clicking the link below:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });
    res.status(200).json({ message: 'Password reset link sent' });
  }catch (error) {
    res.status(500).json({ error: 'Error sending password reset email' });
  }
});

router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;

    // Sending test email
    await transporter.sendMail({
      from: 'dummy@example.com', // Your Yahoo email
      to: 'arvinnliutc@gmail.com', // Recipient email
      subject: 'Test Email',
      text: 'This is a test email from your project!',
    });

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});
  
module.exports = router;