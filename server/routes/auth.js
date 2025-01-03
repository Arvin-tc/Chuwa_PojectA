const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
      const { email, password, userType } = req.body;
  
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
  
  module.exports = router;