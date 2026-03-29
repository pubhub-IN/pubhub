# Working One Migration Plan: MEVN Stack + Clerk Authentication

## 📋 Executive Summary

This document outlines the complete migration strategy for Working One from:
- **Current Stack**: React + Vite + Express + PostgreSQL (Supabase) + Passport.js (GitHub OAuth)
- **Target Stack**: Vue.js + Vite + Express + MongoDB + Node.js + Clerk Authentication

---

## 🎯 Migration Objectives

1. Replace PostgreSQL/Supabase with MongoDB
2. Replace React with Vue.js (keeping Vite)
3. Replace Passport.js GitHub OAuth with Clerk authentication
4. Maintain all existing features and functionality
5. Improve authentication flexibility (Clerk supports multiple providers)

---

## 📊 Current vs New Architecture

### Current Architecture
```
Frontend: React 18.3 + TypeScript + Vite
├── State Management: React Context API
├── Routing: React Router DOM
├── UI: TailwindCSS + Lucide Icons
└── Authentication: JWT tokens from custom backend

Backend: Node.js + Express
├── Authentication: Passport.js + GitHub OAuth
├── Session: Express Session + JWT
├── Database: Supabase (PostgreSQL)
└── APIs: GitHub API, Mistral AI, LinkedIn Jobs

Database: PostgreSQL (via Supabase)
├── Users table with RLS policies
├── Connection requests
├── Chat messages
└── Migrations in SQL
```

### Target Architecture
```
Frontend: Vue.js 3 + TypeScript + Vite
├── State Management: Pinia (Vue's official store)
├── Routing: Vue Router
├── UI: TailwindCSS + Lucide Icons (Vue version)
└── Authentication: Clerk Vue SDK

Backend: Node.js + Express
├── Authentication: Clerk Backend SDK
├── Session: Clerk session verification
├── Database: MongoDB (Atlas or local)
└── APIs: GitHub API, Mistral AI, LinkedIn Jobs

Database: MongoDB
├── Users collection
├── Connections collection
├── ChatMessages collection
└── CourseProgress collection (optional)
```

---

## 🚦 Migration Strategy: Phased Approach

### Phase 1: Preparation & Setup (Manual Tasks)
### Phase 2: Database Migration (Mixed - Manual + Automated)
### Phase 3: Backend Migration (Mostly Automated)
### Phase 4: Frontend Migration (Mostly Automated)
### Phase 5: Testing & Deployment (Manual)

---

## 📝 PHASE 1: Preparation & Setup (Your Manual Tasks)

### 1.1 Account Setup

#### Create Clerk Account
1. Go to https://clerk.com/ and sign up
2. Create a new application called "working-one"
3. Enable authentication providers:
   - ✅ GitHub (primary)
   - ✅ Email/Password (optional backup)
   - ✅ Google (optional)
4. Note down your credentials (from API Keys section):
   - `CLERK_PUBLISHABLE_KEY` (starts with `pk_test_` or `pk_live_`)
   - `CLERK_SECRET_KEY` (starts with `sk_test_` or `sk_live_`)
   
   **Note**: The JWKS URL and Public Key are handled automatically by Clerk's SDK

#### Clerk Configuration Tasks
5. In Clerk Dashboard → Settings:
   - Set JWT Template for custom claims (we'll need GitHub data)
   - Configure OAuth scopes for GitHub (user:email, repo)
   - Set up user metadata fields:
     ```json
     {
       "publicMetadata": {
         "github_username": "",
         "profession": "",
         "technologies": [],
         "total_commits": 0,
         "total_public_repos": 0
       },
       "privateMetadata": {
         "github_access_token": ""
       }
     }
     ```
6. Configure webhooks (for user.created, user.updated events)
7. Set redirect URLs for development and production

#### MongoDB Setup
8. Choose your MongoDB hosting:
   - **Option A**: MongoDB Atlas (Cloud - Recommended)
     - Create account at https://www.mongodb.com/cloud/atlas
     - Create free tier cluster
     - Whitelist your IP addresses
     - Create database user
     - Get connection string
   - **Option B**: Local MongoDB
     - Install MongoDB Community Edition
     - Start MongoDB service
     - Create database "working-one"

9. Note down MongoDB connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/working-one?retryWrites=true&w=majority
   ```

### 1.2 Dependencies Research

#### Study Vue.js Equivalents (No installation yet)
Research the Vue.js equivalents for current React libraries:

| React Library | Vue.js Equivalent | Purpose |
|---------------|-------------------|---------|
| `react` | `vue` | Core framework |
| `react-dom` | (built-in) | DOM rendering |
| `react-router-dom` | `vue-router` | Routing |
| React Context | `pinia` | State management |
| `react-chartjs-2` | `vue-chartjs` | Charts |
| `lucide-react` | `lucide-vue-next` | Icons |
| `react-syntax-highlighter` | `highlight.js` + `vue-highlight.js` | Code highlighting |
| `react-github-calendar` | Custom component (use API) | GitHub calendar |
| `framer-motion` | `@vueuse/motion` or `gsap` | Animations |

### 1.3 Backup Current Project

```bash
# Create a backup branch
git checkout -b backup-react-version
git push origin backup-react-version

# Create a new migration branch
git checkout -b migration-mevn-clerk
```

### 1.4 Environment Variables Preparation

Create a new `.env.migration` file with the new variables you'll need:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=working-one

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_xxx  # From Clerk Dashboard → API Keys
CLERK_SECRET_KEY=sk_test_xxx       # From Clerk Dashboard → API Keys
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx  # Same as CLERK_PUBLISHABLE_KEY (for frontend)

# GitHub (for API calls, not auth)
GITHUB_TOKEN=your_github_personal_access_token

# Mistral AI
MISTRAL_API_KEY=your_mistral_api_key

# LinkedIn Jobs API
# (keep existing if you have it)

# Application URLs
VITE_API_BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# Legacy (can be removed after migration)
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...
# VITE_GITHUB_CLIENT_ID=...
# GITHUB_CLIENT_SECRET=...
```

---

## 📝 PHASE 2: Database Migration

### 2.1 Schema Analysis

Current PostgreSQL schema needs conversion to MongoDB collections:

#### Users Table → Users Collection

**PostgreSQL Schema:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  github_id BIGINT UNIQUE,
  github_username TEXT,
  avatar_url TEXT,
  email TEXT,
  name TEXT,
  profession TEXT,
  total_commits INTEGER,
  total_public_repos INTEGER,
  languages JSONB,
  technologies TEXT[],
  github_data JSONB,
  access_token TEXT,
  linkedin_username TEXT,
  x_username TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

**MongoDB Schema (Document):**
```javascript
{
  _id: ObjectId(),
  clerkUserId: String,  // Primary key from Clerk
  github: {
    id: Number,
    username: String,
    accessToken: String, // Encrypted or in Clerk metadata
  },
  profile: {
    email: String,
    name: String,
    avatarUrl: String,
    profession: String,
    linkedinUsername: String,
    xUsername: String,
  },
  githubStats: {
    totalCommits: Number,
    totalPublicRepos: Number,
    languages: Object, // { "JavaScript": 45.5, "Python": 30.2 }
    githubData: Object, // Raw GitHub API data
  },
  technologies: [String],
  createdAt: Date,
  updatedAt: Date,
}
```

#### Additional Collections Needed

1. **Connections Collection**
```javascript
{
  _id: ObjectId(),
  senderId: String, // Clerk user ID
  recipientId: String, // Clerk user ID
  status: String, // 'pending', 'accepted', 'rejected'
  createdAt: Date,
  updatedAt: Date,
}
```

2. **ChatMessages Collection**
```javascript
{
  _id: ObjectId(),
  userId: String, // Clerk user ID
  sessionId: String,
  role: String, // 'user', 'assistant', 'system'
  content: String,
  createdAt: Date,
}
```

3. **CourseProgress Collection** (Optional - currently in localStorage)
```javascript
{
  _id: ObjectId(),
  userId: String, // Clerk user ID
  courseId: String,
  progress: {
    completedLessons: [String], // Array of lesson IDs
    lastAccessedLesson: String,
    completionPercentage: Number,
  },
  startedAt: Date,
  updatedAt: Date,
}
```

### 2.2 Data Migration Script (You'll run this manually)

**Manual Task**: Once MongoDB is set up, you'll need to:

1. Export data from Supabase:
   - Use Supabase Dashboard → Database → Export
   - Or use SQL queries to export as JSON

2. Transform the data structure to match MongoDB schema

3. Import into MongoDB using:
   - MongoDB Compass (GUI)
   - `mongoimport` command
   - Or a custom migration script (I can help write this later)

**Note**: If you have no production data yet, we can skip the data migration and start fresh.

---

## 📝 PHASE 3: Backend Migration

### 3.1 Backend Changes Overview

**Files to Modify:**
- `server/index.js` - Main server file (authentication overhaul)
- `package.json` - Update dependencies

**New Dependencies to Install:**
```bash
npm install @clerk/clerk-sdk-node mongodb
npm uninstall passport passport-github2 @supabase/supabase-js
```

**Keep These Dependencies:**
- express
- express-session (can be removed later, Clerk handles sessions)
- cors
- dotenv
- jsonwebtoken (optional, Clerk has its own JWT)
- @mistralai/mistralai
- @atharvh01/linkedin-jobs-api

### 3.2 Backend Migration Tasks

**What I'll help you implement (later):**

1. **MongoDB Connection Setup**
   - Replace Supabase client with MongoDB client
   - Create database connection utility
   - Implement connection pooling

2. **Clerk Integration**
   - Replace Passport.js middleware with Clerk middleware
   - Use `@clerk/clerk-sdk-node` for backend verification
   - Implement Clerk webhook handlers for user events
   - Create middleware to verify Clerk JWT tokens

3. **Authentication Endpoints**
   - Remove `/auth/github` and `/auth/github/callback` routes
   - Remove JWT generation (Clerk handles this)
   - Update `/auth/me` to use Clerk user verification
   - Implement `/api/webhooks/clerk` for user sync

4. **User Management**
   - Update all database queries to use MongoDB syntax
   - Replace `supabase.from('users')` with MongoDB operations
   - Update user creation/update logic

5. **Protected Routes**
   - Replace `authenticateJWT` middleware with Clerk verification
   - Use `clerkClient.verifyToken()` for route protection

6. **GitHub Data Fetching**
   - Keep existing GitHub API integration
   - Get GitHub access token from Clerk OAuth data
   - Store GitHub data in MongoDB users collection

### 3.3 Backend Architecture Changes

**Current Flow:**
```
User → GitHub OAuth → Passport.js → Session → JWT → Backend → Supabase
```

**New Flow:**
```
User → Clerk (GitHub provider) → Clerk Session → Backend → MongoDB
                                                    ↓
                                            Clerk JWT Verification
```

---

## 📝 PHASE 4: Frontend Migration

### 4.1 Frontend Changes Overview

This is the most substantial change - converting React to Vue.js.

**Major File Structure Changes:**

```
Current (React):                  New (Vue.js):
src/
├── App.tsx                  →   App.vue
├── main.tsx                 →   main.ts
├── components/              →   components/
│   ├── Dashboard.tsx        →   Dashboard.vue
│   ├── Hero.tsx             →   Hero.vue
│   └── ...                  →   ...
├── pages/                   →   views/ (Vue convention)
│   ├── AccountPage.tsx      →   AccountView.vue
│   └── ...                  →   ...
├── lib/                     →   composables/ (Vue convention)
│   ├── useAuth.tsx          →   useAuth.ts (Vue composable)
│   ├── ThemeContext.tsx     →   useTheme.ts (Vue composable)
│   └── ...                  →   ...
├── types/                   →   types/ (keep as is)
└── index.css               →   assets/styles/main.css
```

### 4.2 Key Migration Concepts

#### React → Vue.js Conversion Guide

| React Concept | Vue.js Equivalent | Notes |
|---------------|-------------------|-------|
| JSX/TSX | Template syntax | Use `<template>`, `<script setup>`, `<style>` |
| `useState` | `ref()`, `reactive()` | From Vue Composition API |
| `useEffect` | `watch()`, `watchEffect()`, `onMounted()` | Lifecycle hooks |
| `useContext` | `provide/inject` or Pinia | Global state |
| `useNavigate` | `useRouter().push()` | From vue-router |
| `useLocation` | `useRoute()` | From vue-router |
| Props | `defineProps()` | With TypeScript support |
| Children | Slots | `<slot>` element |
| React.memo | `computed()` | For derived state |
| Custom hooks | Composables | Functions returning refs |

### 4.3 Frontend Dependencies

**Remove:**
```bash
npm uninstall react react-dom react-router-dom @types/react @types/react-dom
```

**Install:**
```bash
npm install vue@^3.4 vue-router@^4.2 pinia@^2.1
npm install -D @vitejs/plugin-vue @vue/tsconfig
npm install @clerk/vue
npm install lucide-vue-next
npm install vue-chartjs chart.js
npm install highlight.js
npm install @vueuse/core @vueuse/motion
```

### 4.4 Component Conversion Examples

**Example 1: Hero.tsx → Hero.vue**

Current React component structure:
```tsx
export default function Hero() {
  const [state, setState] = useState()
  useEffect(() => {}, [])
  return <div>...</div>
}
```

New Vue component structure:
```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const state = ref()
onMounted(() => {})
</script>

<template>
  <div>...</div>
</template>

<style scoped>
</style>
```

**Example 2: Auth Hook → Composable**

Current: `lib/useAuth.tsx` (React Context + Hook)
New: `composables/useAuth.ts` (Vue Composable)

```typescript
// Vue composable using Clerk
import { useAuth as useClerkAuth } from '@clerk/vue'
import { computed } from 'vue'

export function useAuth() {
  const { isSignedIn, user, userId } = useClerkAuth()
  
  const currentUser = computed(() => {
    // Transform Clerk user to your format
    return user.value ? {
      id: userId.value,
      github_username: user.value.publicMetadata.github_username,
      // ... other fields
    } : null
  })
  
  return {
    isSignedIn,
    user: currentUser,
    loading: false, // Clerk handles this
  }
}
```

### 4.5 Vite Configuration

**Update `vite.config.ts`:**

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' // Changed from react

export default defineConfig({
  plugins: [vue()], // Changed from react()
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
```

### 4.6 Router Setup

**Create `src/router/index.ts`:**

Will convert all React Router routes to Vue Router routes:
- Public routes (Hero/Landing)
- Authenticated routes (Dashboard, etc.)
- Protected route guards using Clerk

### 4.7 Store Setup (Pinia)

**Create `src/stores/user.ts`:**

Replace React Context with Pinia store for:
- User data
- Theme preferences
- Connection notifications
- Any other global state

---

## 📝 PHASE 5: Testing & Deployment

### 5.1 Testing Checklist (Your Manual Tasks)

After migration is complete, test each feature:

**Authentication & User Flow:**
- [ ] GitHub sign-in with Clerk works
- [ ] User data syncs to MongoDB
- [ ] User session persists across page reloads
- [ ] Logout works correctly
- [ ] Onboarding flow works
- [ ] Profile updates save to database

**Dashboard Features:**
- [ ] GitHub activity displays correctly
- [ ] Language chart renders
- [ ] Commit history shows
- [ ] Repository list loads
- [ ] AI post generation works

**Learning Platform:**
- [ ] Course listing displays
- [ ] Course navigation works
- [ ] Lesson content renders
- [ ] Progress tracking saves
- [ ] Syntax highlighting works

**Social Features:**
- [ ] People page lists users
- [ ] Profile pages load
- [ ] Connection requests send/receive
- [ ] Notifications show
- [ ] Share on socials works

**Other Features:**
- [ ] Hackathons page loads
- [ ] Open source page works
- [ ] Job hunting with all filters
- [ ] YouTube lectures page
- [ ] AI Assistant chat works
- [ ] Dark/Light mode toggles

**Cross-browser Testing:**
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

**Responsive Testing:**
- [ ] Mobile (< 640px)
- [ ] Tablet (640px - 1024px)
- [ ] Desktop (> 1024px)

### 5.2 Deployment Updates

**Update deployment configurations:**

1. **Netlify (`netlify.toml`):**
   - Build command stays same: `npm run build`
   - Publish directory stays same: `dist`
   - Update environment variables (add Clerk keys)

2. **Render (`render.yaml`):**
   - Update environment variables
   - Add MongoDB URI
   - Add Clerk secret keys

3. **Environment Variables:**
   - Remove old Supabase variables
   - Remove old GitHub OAuth variables
   - Add new Clerk variables
   - Add MongoDB URI

### 5.3 Rollback Plan

If migration fails:
```bash
# Switch back to backup branch
git checkout backup-react-version

# Redeploy old version
npm install
npm run build
# Deploy to Netlify/Render
```

---

## 📋 Migration Checklist Summary

### Your Manual Preparation Tasks:

- [ ] **Clerk Setup**
  - [ ] Create Clerk account
  - [ ] Create working-one application
  - [ ] Configure GitHub OAuth provider
  - [ ] Set up user metadata fields
  - [ ] Configure webhooks
  - [ ] Get API keys

- [ ] **MongoDB Setup**
  - [ ] Choose hosting (Atlas or local)
  - [ ] Create database
  - [ ] Create user and get connection string
  - [ ] Whitelist IP addresses

- [ ] **Backup**
  - [ ] Create backup branch
  - [ ] Export existing data (if any)
  - [ ] Create migration branch

- [ ] **Research**
  - [ ] Review Vue.js documentation
  - [ ] Review Clerk documentation
  - [ ] Review MongoDB documentation
  - [ ] Understand Composition API

- [ ] **Environment Setup**
  - [ ] Prepare new .env variables
  - [ ] Document all credentials
  - [ ] Test MongoDB connection

---

## 🎯 When You're Ready

Once you've completed all the manual preparation tasks above, provide me with:

1. ✅ Confirmation that Clerk is set up with credentials
2. ✅ Confirmation that MongoDB is ready with connection string
3. ✅ Your preferred approach for handling course progress (localStorage vs MongoDB)
4. ✅ Whether you have existing production data to migrate or starting fresh
5. ✅ Any specific features you want to prioritize in the migration

Then I'll help you:
1. Write the MongoDB connection and schema setup
2. Convert the backend to use Clerk + MongoDB
3. Create migration scripts for data (if needed)
4. Convert React components to Vue.js components
5. Set up Vue Router and Pinia stores
6. Update all authentication flows
7. Test and debug the migration

---

## 📚 Recommended Reading Before Migration

1. **Vue.js 3 Documentation**: https://vuejs.org/guide/introduction.html
2. **Clerk Documentation**: https://clerk.com/docs
3. **MongoDB Node.js Driver**: https://www.mongodb.com/docs/drivers/node/
4. **Vue Router**: https://router.vuejs.org/
5. **Pinia**: https://pinia.vuejs.org/

---

## ⏱️ Estimated Timeline

- **Phase 1 (Your setup)**: 2-4 hours
- **Phase 2 (Database)**: 4-6 hours (with my help)
- **Phase 3 (Backend)**: 6-8 hours (with my help)
- **Phase 4 (Frontend)**: 15-20 hours (with my help)
- **Phase 5 (Testing)**: 4-6 hours (your testing)

**Total Estimated Time**: 31-44 hours

---

## 🔴 Critical Notes

1. **No Frontend Authentication Logic**: With Clerk, most auth logic moves to Clerk's SDK. Your backend just verifies tokens.

2. **GitHub Data**: You'll still fetch GitHub data, but the access token comes from Clerk's OAuth integration, not Passport.js.

3. **Session Management**: Clerk handles sessions. You won't need express-session or custom JWT generation.

4. **Database Queries**: Every `supabase.from('table')` becomes MongoDB operations. This is a significant change.

5. **Component Rewrite**: Every React component needs conversion. TSX → Vue SFC (Single File Components).

6. **State Management**: Context API → Pinia. This affects how data flows through the app.

7. **Testing**: The entire app needs retesting after migration.

---

**Good luck with the preparation! Let me know when you're ready to proceed with the actual migration, and I'll help you through each phase.** 🚀
