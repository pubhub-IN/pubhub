const session = require('express-session');

const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-fallback-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  name: 'pubhub.sid', // Custom session name
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax' // Important for OAuth flows
  },
  rolling: true // Reset expiration on activity
};

module.exports = sessionConfig;