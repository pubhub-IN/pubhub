#!/usr/bin/env node

/**
 * PubHub Deployment Checklist
 *
 * This script helps verify that all necessary configurations are in place
 * before deploying to production.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔍 PubHub Deployment Checklist\n");

const checks = [
  {
    name: "Configuration Files",
    items: [
      { file: "netlify.toml", description: "Netlify configuration (not used for localhost)" },
      { file: "render.yaml", description: "Render configuration (not used for localhost)" },
      { file: "src/config/api.ts", description: "API configuration" },
    ],
  },
  {
    name: "Environment Variables (Frontend - Localhost)",
    items: [
      { var: "VITE_API_URL", description: "Backend API URL (https://pubhub-lnao.onrender.com)" },
      { var: "VITE_GITHUB_CLIENT_ID", description: "GitHub OAuth client ID (local)" },
      { var: "VITE_FRONTEND_URL", description: "Frontend URL (http://localhost:5173)" },
    ],
  },
  {
    name: "Environment Variables (Backend - Localhost)",
    items: [
      { var: "NODE_ENV", description: "Development environment" },
      { var: "PORT", description: "Server port (3000)" },
      { var: "SESSION_SECRET", description: "Session secret (local)" },
      { var: "JWT_SECRET", description: "JWT secret (local)" },
      {
        var: "GITHUB_CLIENT_SECRET",
        description: "GitHub OAuth client secret (local)" },
      { var: "GITHUB_TOKEN", description: "GitHub personal access token (local)" },
      { var: "MISTRAL_API_KEY", description: "Mistral AI API key (local)" },
      { var: "MONGODB_URI", description: "MongoDB connection string" },
      { var: "FRONTEND_URL", description: "Frontend URL for CORS (http://localhost:5173)" },
    ],
  },
  {
    name: "GitHub OAuth App Settings",
    items: [
      {
        setting: "Authorization callback URL (Development)",
        value: "https://pubhub-lnao.onrender.com/auth/github/callback",
      },
      {
        setting: "Authorization callback URL (Production)",
        value: "https://pubhub-lnao.onrender.com/auth/github/callback",
      },
      {
        setting: "Homepage URL",
        value: "http://localhost:5173",
      },
    ],
  },
];

// Check configuration files
console.log("📁 Checking Configuration Files:");
checks[0].items.forEach((item) => {
  const exists = fs.existsSync(path.join(process.cwd(), item.file));
  console.log(`  ${exists ? "✅" : "❌"} ${item.file} - ${item.description}`);
});

console.log("\n🔧 Environment Variables Checklist:");

// Frontend environment variables
console.log("\n  Frontend (Netlify):");
checks[1].items.forEach((item) => {
  console.log(`    ⚙️  ${item.var} - ${item.description}`);
});

// Backend environment variables
console.log("\n  Backend (Render):");
checks[2].items.forEach((item) => {
  console.log(`    ⚙️  ${item.var} - ${item.description}`);
});

console.log("\n🔐 GitHub OAuth App Settings:");
checks[3].items.forEach((item) => {
  console.log(`    🔗 ${item.setting}: ${item.value}`);
});

console.log("\n📋 Manual Steps Required:");
console.log("  1. Create Netlify account and connect GitHub repository");
console.log("  2. Create Render account and deploy backend service");
console.log("  3. Set all environment variables in both platforms");
console.log("  4. Update GitHub OAuth App settings");
console.log("  5. Test the deployment");

console.log("\n📖 For detailed instructions, see: DEPLOYMENT_GUIDE.md");
console.log("\n🎉 Good luck with your deployment!");
