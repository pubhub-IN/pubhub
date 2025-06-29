# GitHub OAuth Setup Guide for PubHub

## Current Issues Analysis

Based on your project structure, here are the potential issues with GitHub OAuth:

### 1. **Environment Variables Missing**
Your `.env` file is not visible, but you need these variables:

```env
# GitHub OAuth App Credentials
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Session Secret
SESSION_SECRET=your_random_session_secret

# Database URLs (if using Supabase)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# JWT Secret (for JWT auth)
JWT_SECRET=your_jwt_secret
```

### 2. **GitHub OAuth App Configuration**

You need to create a GitHub OAuth App:

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: PubHub
   - **Homepage URL**: `http://localhost:5173` (for development)
   - **Authorization callback URL**: `http://localhost:3000/auth/github/callback`

### 3. **Backend Server Issues**

Your `server/index.js` is not visible, but it should include:

```javascript
// Required dependencies
const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport configuration
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
  // Handle user data here
  // Save to database or return user object
  return done(null, profile);
}));

// Routes
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication
    res.redirect('http://localhost:5173/dashboard');
  }
);
```

### 4. **Frontend Auth Service Issues**

Your `authService.getGitHubAuthUrl()` should return:
```javascript
getGitHubAuthUrl() {
  return 'http://localhost:3000/auth/github';
}
```

## Step-by-Step Setup Instructions

### Step 1: Create GitHub OAuth App
1. Go to https://github.com/settings/developers
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in the details:
   - Application name: `PubHub`
   - Homepage URL: `http://localhost:5173`
   - Authorization callback URL: `http://localhost:3000/auth/github/callback`
4. Copy the Client ID and Client Secret

### Step 2: Update Environment Variables
Create/update your `.env` file with the GitHub credentials:

```env
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
SESSION_SECRET=your_random_secret_here
JWT_SECRET=your_jwt_secret_here
```

### Step 3: Verify Backend Dependencies
Make sure your `package.json` includes:
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "passport": "^0.7.0",
    "passport-github2": "^0.1.12",
    "express-session": "^1.17.3",
    "cors": "^2.8.5"
  }
}
```

### Step 4: Test the Flow
1. Start your backend server: `npm run dev:server`
2. Start your frontend: `npm run dev:client`
3. Click "Connect GitHub" button
4. Should redirect to GitHub for authorization
5. After approval, should redirect back to your app

## Common Issues and Solutions

### Issue 1: CORS Errors
**Solution**: Ensure CORS is properly configured in your backend:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Issue 2: Session Not Persisting
**Solution**: Check session configuration and ensure cookies are enabled:
```javascript
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // false for HTTP, true for HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));
```

### Issue 3: Callback URL Mismatch
**Solution**: Ensure the callback URL in GitHub OAuth app matches exactly:
- GitHub OAuth App: `http://localhost:3000/auth/github/callback`
- Backend route: `app.get('/auth/github/callback', ...)`

### Issue 4: Environment Variables Not Loading
**Solution**: Install and configure dotenv:
```javascript
require('dotenv').config();
```

## Testing Checklist

- [ ] GitHub OAuth App created with correct URLs
- [ ] Environment variables set correctly
- [ ] Backend server running on port 3000
- [ ] Frontend running on port 5173
- [ ] CORS configured properly
- [ ] Session middleware configured
- [ ] Passport strategies configured
- [ ] Routes defined correctly

## Next Steps

1. Check your current `.env` file
2. Verify your `server/index.js` configuration
3. Test the OAuth flow step by step
4. Check browser console and server logs for errors

Let me know which specific part is failing and I can provide more targeted help!