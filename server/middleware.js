// Custom middleware for debugging and error handling

const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.user) {
    console.log('Authenticated user:', req.user.login || req.user.id);
  }
  next();
};

const errorHandler = (err, req, res, next) => {
  console.error('Server error:', err);
  
  if (err.name === 'AuthenticationError') {
    return res.status(401).json({ 
      error: 'Authentication failed',
      message: err.message 
    });
  }
  
  if (err.name === 'SessionError') {
    return res.status(500).json({ 
      error: 'Session error',
      message: 'Please try logging in again' 
    });
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

const notFound = (req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    message: `Route ${req.method} ${req.url} not found`
  });
};

module.exports = {
  requestLogger,
  errorHandler,
  notFound
};