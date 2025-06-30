# PubHub Deployment Guide

This guide will help you deploy your PubHub application to production using **Netlify** for the frontend and **Render** for the backend.

## 🚀 Quick Overview

- **Frontend**: React + Vite → Netlify (Free)
- **Backend**: Node.js + Express → Render (Free)
- **Database**: Supabase (Free tier)
- **Authentication**: GitHub OAuth

## 📋 Prerequisites

1. **GitHub Account** - for OAuth and code hosting
2. **Netlify Account** - for frontend hosting
3. **Render Account** - for backend hosting
4. **Supabase Account** - for database
5. **GitHub OAuth App** - for authentication

## 🔧 Step 1: Prepare Your GitHub OAuth App

### Update GitHub OAuth App Settings

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Find your OAuth App or create a new one
3. Update the **Authorization callback URL** to include both development and production:
   ```
   http://localhost:3000/auth/github/callback
   https://your-render-app-name.onrender.com/auth/github/callback
   ```
4. Note down your **Client ID** and **Client Secret**

## 🗄️ Step 2: Prepare Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Note down your **Project URL** and **Anon Key**
3. Ensure your database tables are set up correctly

## ⚙️ Step 3: Deploy Backend to Render

### 3.1 Create Render Account

1. Go to [Render.com](https://render.com) and sign up
2. Connect your GitHub account

### 3.2 Deploy Backend Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `pubhub-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Plan**: `Free`

### 3.3 Set Environment Variables

Add these environment variables in Render:

```env
NODE_ENV=production
PORT=10000
SESSION_SECRET=your-super-secret-session-key-here
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRATION=7d
SESSION_DURATION_DAYS=7
GITHUB_TOKEN=your-github-personal-access-token
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret
MISTRAL_API_KEY=your-mistral-api-key
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GITHUB_CLIENT_ID=your-github-oauth-client-id
FRONTEND_URL=https://your-netlify-app.netlify.app
```

### 3.4 Get Your Backend URL

After deployment, note your Render app URL: `https://your-app-name.onrender.com`

## 🌐 Step 4: Deploy Frontend to Netlify

### 4.1 Create Netlify Account

1. Go to [Netlify.com](https://netlify.com) and sign up
2. Connect your GitHub account

### 4.2 Deploy Frontend

1. Click **"New site from Git"**
2. Choose your GitHub repository
3. Configure the build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18`

### 4.3 Set Environment Variables

Add these environment variables in Netlify:

```env
VITE_API_URL=https://your-render-app-name.onrender.com
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GITHUB_CLIENT_ID=your-github-oauth-client-id
VITE_FRONTEND_URL=https://your-netlify-app.netlify.app
```

### 4.4 Update GitHub OAuth App

1. Go back to your GitHub OAuth App settings
2. Add your Netlify URL to **Homepage URL**:
   ```
   https://your-netlify-app.netlify.app
   ```

## 🔄 Step 5: Update Configuration Files

### 5.1 Update API Configuration

The `src/config/api.ts` file has been created to handle both environments automatically.

### 5.2 Update Backend CORS

The server CORS configuration has been updated to allow your Netlify domain.

## 🧪 Step 6: Test Your Deployment

### 6.1 Test Backend Health

Visit: `https://your-render-app-name.onrender.com/health`
Should return: `{"status":"ok"}`

### 6.2 Test Frontend

Visit your Netlify URL and test:

- [ ] Homepage loads
- [ ] GitHub login works
- [ ] User profile loads
- [ ] All features work

## 🔧 Troubleshooting

### Common Issues

#### 1. CORS Errors

- Ensure your Netlify URL is in the `allowedOrigins` array in `server/index.js`
- Check that `FRONTEND_URL` environment variable is set correctly in Render

#### 2. GitHub OAuth Errors

- Verify callback URLs in GitHub OAuth App settings
- Check that `VITE_GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set correctly

#### 3. Database Connection Issues

- Verify Supabase URL and keys are correct
- Check Supabase database is accessible

#### 4. Environment Variables Not Loading

- Ensure all environment variables are set in both Netlify and Render
- Check variable names match exactly (case-sensitive)

### Debug Commands

#### Check Backend Logs

```bash
# In Render dashboard, check the logs tab
```

#### Check Frontend Build

```bash
# Test build locally
npm run build
```

#### Test API Locally

```bash
# Test with production backend
curl https://your-render-app-name.onrender.com/health
```

## 📝 Environment Variables Reference

### Frontend (Netlify)

```env
VITE_API_URL=https://your-render-app-name.onrender.com
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GITHUB_CLIENT_ID=your-github-oauth-client-id
VITE_FRONTEND_URL=https://your-netlify-app.netlify.app
```

### Backend (Render)

```env
NODE_ENV=production
PORT=10000
SESSION_SECRET=your-super-secret-session-key-here
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRATION=7d
SESSION_DURATION_DAYS=7
GITHUB_TOKEN=your-github-personal-access-token
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret
MISTRAL_API_KEY=your-mistral-api-key
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GITHUB_CLIENT_ID=your-github-oauth-client-id
FRONTEND_URL=https://your-netlify-app.netlify.app
```

## 🎉 Success!

Once deployed, your app will be available at:

- **Frontend**: `https://your-netlify-app.netlify.app`
- **Backend**: `https://your-render-app-name.onrender.com`

## 🔄 Continuous Deployment

Both Netlify and Render will automatically redeploy when you push changes to your GitHub repository.

## 💰 Cost

This setup uses the **free tier** of both services:

- **Netlify**: Free tier includes 100GB bandwidth/month
- **Render**: Free tier includes 750 hours/month (enough for 24/7 uptime)
- **Supabase**: Free tier includes 500MB database and 50MB file storage

## 🚀 Next Steps

1. Set up custom domains (optional)
2. Configure monitoring and alerts
3. Set up database backups
4. Implement CI/CD pipelines
5. Add performance monitoring

---

**Need Help?** Check the troubleshooting section or create an issue in your repository.
