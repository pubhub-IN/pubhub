# Production Deployment Changes

This document summarizes all the changes made to prepare your PubHub application for production deployment.

## 📁 New Files Created

### Configuration Files

- `netlify.toml` - Netlify deployment configuration
- `render.yaml` - Render deployment configuration
- `src/config/api.ts` - Centralized API configuration for both environments
- `DEPLOYMENT_GUIDE.md` - Comprehensive deployment guide
- `scripts/deploy-checklist.js` - Deployment verification script

## 🔧 Files Modified

### Frontend Configuration

- `vite.config.ts` - Updated to conditionally use proxy only in development
- `package.json` - Added deployment checklist script

### API Configuration

- `src/lib/auth-jwt.ts` - Updated to use centralized API configuration
- `src/lib/auth.ts` - Updated to use centralized API configuration
- `src/lib/useAuth.tsx` - Updated to use centralized API configuration

### Components and Pages

- `src/components/Dashboard.tsx` - Updated API calls to use new configuration
- `src/pages/ShareOnSocials.tsx` - Updated API calls to use new configuration
- `src/pages/OpenSourceReposPage.tsx` - Updated API calls to use new configuration

### Backend Configuration

- `server/index.js` - Updated CORS configuration and OAuth callback URLs for production

## 🔄 Key Changes Made

### 1. Environment-Based API Configuration

- Created `src/config/api.ts` to handle both development and production environments
- Automatically switches between `localhost:3000` (dev) and production URL (prod)
- Centralized all API endpoints for easy maintenance

### 2. CORS Configuration

- Updated server CORS to allow both development and production origins
- Added environment variable support for frontend URL
- Improved security with proper origin validation

### 3. OAuth Configuration

- Updated GitHub OAuth callback URLs to work in both environments
- Added support for Render's external hostname environment variable

### 4. Build Configuration

- Added Netlify configuration for frontend deployment
- Added Render configuration for backend deployment
- Configured proper build commands and environment variables

### 5. Development vs Production

- Vite proxy only active in development
- Environment variables handle API URL switching
- Proper error handling for both environments

## 🚀 Deployment Strategy

### Frontend (Netlify)

- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**: Set via Netlify dashboard
- **Auto-deploy**: On Git push to main branch

### Backend (Render)

- **Build Command**: `npm install`
- **Start Command**: `node server/index.js`
- **Environment Variables**: Set via Render dashboard
- **Auto-deploy**: On Git push to main branch

## 🔐 Security Improvements

### Environment Variables

- All sensitive data moved to environment variables
- No hardcoded secrets in code
- Proper separation of development and production configs

### CORS Security

- Whitelist approach for allowed origins
- Proper credentials handling
- Production-ready security headers

### Session Management

- Secure cookie configuration for production
- JWT token management
- Proper session expiration handling

## 📋 Pre-Deployment Checklist

Run this command to verify your setup:

```bash
npm run deploy:check
```

### Required Environment Variables

#### Frontend (Netlify)

- `VITE_API_URL` - Your Render backend URL
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `VITE_FRONTEND_URL` - Your Netlify frontend URL

#### Backend (Render)

- `NODE_ENV=production`
- `PORT=10000`
- `SESSION_SECRET` - Secure random string
- `JWT_SECRET` - Secure random string
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret
- `GITHUB_TOKEN` - GitHub personal access token
- `MISTRAL_API_KEY` - Mistral AI API key
- `FRONTEND_URL` - Your Netlify frontend URL

## 🔧 GitHub OAuth App Updates

Update your GitHub OAuth App settings:

1. **Authorization callback URL**: Add your Render backend URL
2. **Homepage URL**: Set to your Netlify frontend URL

## 🧪 Testing

### Local Testing

```bash
# Test build
npm run build

# Test backend health
curl http://localhost:3000/health
```

### Production Testing

1. Deploy backend to Render
2. Test backend health: `https://your-app.onrender.com/health`
3. Deploy frontend to Netlify
4. Test full application flow

## 🚨 Important Notes

1. **Environment Variables**: Must be set in both Netlify and Render dashboards
2. **GitHub OAuth**: Update callback URLs before testing
3. **CORS**: Ensure frontend URL is properly configured
4. **Secrets**: Generate secure random strings for session and JWT secrets
5. **API Keys**: Ensure all third-party API keys are valid

## 📖 Next Steps

1. Follow the `DEPLOYMENT_GUIDE.md` for step-by-step instructions
2. Set up all environment variables
3. Deploy backend to Render
4. Deploy frontend to Netlify
5. Test all functionality
6. Monitor logs for any issues

## 🆘 Troubleshooting

- Check `DEPLOYMENT_GUIDE.md` for common issues and solutions
- Verify all environment variables are set correctly
- Check Render and Netlify logs for deployment issues
- Ensure GitHub OAuth app settings are updated

---

**Ready to deploy?** Follow the `DEPLOYMENT_GUIDE.md` for complete instructions!
