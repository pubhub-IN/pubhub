const express = require('express');
const passport = require('passport');
const router = express.Router();

// GitHub OAuth routes
router.get('/github', 
  passport.authenticate('github', { 
    scope: ['user:email', 'read:user'] 
  })
);

router.get('/github/callback', 
  passport.authenticate('github', { 
    failureRedirect: 'http://localhost:5173/?error=auth_failed',
    session: true
  }),
  (req, res) => {
    try {
      // Successful authentication
      console.log('GitHub OAuth successful for user:', req.user?.login);
      
      // Redirect to frontend with success
      res.redirect('http://localhost:5173/dashboard?auth=success');
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect('http://localhost:5173/?error=callback_failed');
    }
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ error: 'Session cleanup failed' });
      }
      res.clearCookie('connect.sid');
      res.redirect('http://localhost:5173/');
    });
  });
});

// Check auth status
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ 
      authenticated: true, 
      user: {
        id: req.user.id,
        login: req.user.username || req.user.login,
        name: req.user.displayName,
        email: req.user.emails?.[0]?.value,
        avatar_url: req.user.photos?.[0]?.value
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;