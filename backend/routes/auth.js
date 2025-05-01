const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check credentials against environment variables
  if (username === process.env.ADMIN_USERNAME && 
      password === process.env.ADMIN_PASSWORD) {
    
    // Generate JWT token
    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      message: 'Login successful'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];

  if (!bearerHeader) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

module.exports = {
  router,
  verifyToken
};
