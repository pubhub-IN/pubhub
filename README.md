# PubHub

A platform for developers to showcase their GitHub activity, participate in hackathons, and discover open-source repositories.

## Features

- 🔐 GitHub OAuth authentication
- 📊 GitHub activity dashboard with commit history
- 🏆 Hackathon discovery and participation
- 🌟 Open-source repository exploration
- 📱 Responsive design with dark/light theme support

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- GitHub OAuth App credentials
- Supabase account and project

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your environment variables in the `.env` file:
   - `VITE_GITHUB_CLIENT_ID`: Your GitHub OAuth App Client ID
   - `GITHUB_CLIENT_SECRET`: Your GitHub OAuth App Client Secret
   - `GITHUB_TOKEN`: Your GitHub Personal Access Token
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `SESSION_SECRET`: A secure random string for sessions

### Installation and Running

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start both client and server in development mode:
   ```bash
   npm run dev
   ```

This will start:
- Frontend (Vite + React) on `http://localhost:5173`
- Backend (Express) on `http://localhost:3000`

### Individual Commands

- `npm run dev:client` - Start only the frontend
- `npm run dev:server` - Start only the backend
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Troubleshooting

### "Failed to fetch" Error on Refresh

If you see a "Failed to fetch" error when refreshing the application:

1. Ensure both the frontend and backend servers are running
2. Check that the backend is accessible at `http://localhost:3000`
3. Verify your environment variables are properly set
4. The app will automatically retry connecting to the server

### Server Connection Issues

- Make sure port 3000 is not being used by another application
- Check that your firewall isn't blocking the connection
- Verify your environment variables match your GitHub OAuth app settings

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, Passport.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: GitHub OAuth 2.0
- **Charts**: Chart.js with React Chart.js 2