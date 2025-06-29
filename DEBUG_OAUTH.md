# GitHub OAuth Debug Guide

## Quick Debug Steps

### 1. Check Environment Variables
Run this in your terminal:
```bash
echo "GITHUB_CLIENT_ID: $GITHUB_CLIENT_ID"
echo "GITHUB_CLIENT_SECRET: $GITHUB_CLIENT_SECRET"
```

### 2. Test Server Endpoints
```bash
# Test if server is running
curl http://localhost:3000/health

# Test auth status
curl http://localhost:3000/auth/status

# Test GitHub OAuth redirect
curl -I http://localhost:3000/auth/github
```

### 3. Check Browser Console
Open browser dev tools and look for:
- CORS errors
- Network request failures
- JavaScript errors

### 4. Check Server Logs
Look for these messages in your server console:
- "Server running on http://localhost:3000"
- "GitHub Client ID: Set"
- "GitHub Client Secret: Set"

## Common Issues and Solutions

### Issue 1: "CORS policy" error
**Symptoms**: Browser console shows CORS error
**Solution**: The updated CORS config should fix this

### Issue 2: "Cannot GET /auth/github" 
**Symptoms**: 404 error when clicking GitHub button
**Solution**: Make sure server is running on port 3000

### Issue 3: GitHub redirects but no user data
**Symptoms**: Redirects to callback but user not logged in
**Solution**: Check session configuration and passport setup

### Issue 4: "Client ID not found" from GitHub
**Symptoms**: GitHub shows OAuth app error
**Solution**: Verify GITHUB_CLIENT_ID in .env matches GitHub app

## Testing the Flow

1. **Start both servers**:
   ```bash
   npm run dev
   ```

2. **Open browser to**: http://localhost:5173

3. **Click "Connect GitHub"** - should redirect to GitHub

4. **Authorize on GitHub** - should redirect back to your app

5. **Check browser network tab** for any failed requests

## Environment Variables Template

Your `.env` should look like this:
```env
GITHUB_CLIENT_ID=your_actual_client_id_from_github
GITHUB_CLIENT_SECRET=your_actual_client_secret_from_github
SESSION_SECRET=some_random_string_for_sessions
NODE_ENV=development
```

## Next Steps

1. Replace your current `server/index.js` with `server/updated-index.js`
2. Restart your server
3. Try the OAuth flow again
4. Check the debug endpoints listed above
5. Look at browser console and server logs for any errors

If you're still having issues, share:
- Browser console errors
- Server console output
- Network tab showing failed requests