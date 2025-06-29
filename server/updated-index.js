require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');

// Import configurations
const corsOptions = require('./cors-config');
const sessionConfig = require('./session-config');
const passport = require('./passport-config');
const authRoutes = require('./auth-routes');
const { requestLogger, errorHandler, notFound } = require('./middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy (important for session cookies)
app.set('trust proxy', 1);

// Middleware setup (ORDER IS IMPORTANT!)
app.use(requestLogger);

// CORS - must be before session
app.use(cors(corsOptions));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware - must be before passport
app.use(session(sessionConfig));

// Passport middleware - must be after session
app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Auth routes
app.use('/auth', authRoutes);

// Test endpoint to check if server is working
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is working!',
    authenticated: req.isAuthenticated(),
    user: req.user ? { id: req.user.id, login: req.user.login } : null
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);
app.use(notFound);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 GitHub Client ID: ${process.env.GITHUB_CLIENT_ID ? 'Set' : 'Missing'}`);
  console.log(`🔑 GitHub Client Secret: ${process.env.GITHUB_CLIENT_SECRET ? 'Set' : 'Missing'}`);
  console.log(`🍪 Session Secret: ${process.env.SESSION_SECRET ? 'Set' : 'Using fallback'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});