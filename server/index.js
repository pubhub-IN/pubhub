import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";
import { Mistral } from "@mistralai/mistralai";
import { fetchJobListings } from "@atharvh01/linkedin-jobs-api/src/services/linkedinService.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
// Try both environment variable names
const apiKey = process.env.MISTRAL_API_KEY || process.env.CODESTRAL_KEY;
console.log("Mistral API Key available:", apiKey ? "Yes" : "No");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "7d";

// Initialize Mistral API client
const mistralClient = new Mistral({ apiKey: apiKey });

// Rate limiting helper
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// GitHub API rate limiting tracker
let lastAPICall = 0;
const API_DELAY = 100; // Minimum delay between API calls in milliseconds

// Cache for repository data to prevent duplicate API calls
const repositoryCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes cache

const jobCache = new Map();
const JOB_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function normalizeJob(job, source) {
  if (source === "remotive") {
    return {
      id: `remotive-${job.id}`,
      title: job.title,
      company_name: job.company_name,
      candidate_required_location: job.candidate_required_location,
      url: job.url,
      publication_date: job.publication_date,
      job_type: job.job_type,
      salary: job.salary || "",
      experience: job.experience || "",
      remoteType: job.job_type?.toLowerCase().includes("remote")
        ? "remote"
        : "",
      description: job.description || "",
    };
  } else if (source === "remoteok") {
    return {
      id: `remoteok-${job.id}`,
      title: job.position || job.title,
      company_name: job.company || "",
      candidate_required_location: job.location || "Worldwide",
      url: job.url || job.apply_url || "",
      publication_date: job.date || job.created_at || "",
      job_type: job.tags ? job.tags.join(", ") : "",
      salary: job.salary || "",
      experience: job.experience || "",
      remoteType: (job.tags || []).includes("remote") ? "remote" : "",
      description: job.description || "",
    };
  } else if (source === "linkedin") {
    return {
      id: `linkedin-${job.link}`,
      title: job.title && job.title !== "*" ? job.title : "Untitled Position",
      company_name:
        job.company && job.company !== "*" ? job.company : "Unknown Company",
      candidate_required_location:
        job.location && job.location !== "*" ? job.location : "",
      url: job.link && job.link !== "*" ? job.link : "",
      publication_date:
        job.postedDate && job.postedDate !== "*" ? job.postedDate : "",
      job_type: "",
      salary: "",
      experience: "",
      remoteType:
        job.location && job.location.toLowerCase().includes("remote")
          ? "remote"
          : "",
      description:
        job.description && job.description !== "*" ? job.description : "",
    };
  }
  return null;
}

async function fetchRemotiveJobs({
  techStack,
  location,
  jobType,
  perPage = 20,
}) {
  try {
    let url = "https://remotive.com/api/remote-jobs";
    const res = await fetch(url);
    const data = await res.json();
    let jobs = data.jobs || [];
    if (techStack)
      jobs = jobs.filter((j) =>
        (j.title + " " + j.job_type)
          .toLowerCase()
          .includes(techStack.toLowerCase())
      );
    if (location)
      jobs = jobs.filter(
        (j) =>
          j.candidate_required_location.trim().toLowerCase() ===
          location.trim().toLowerCase()
      );
    if (jobType) {
      const jt = jobType.trim().toLowerCase();
      if (jt === "remote") {
        jobs = jobs.filter((j) =>
          (j.job_type || "").toLowerCase().includes("remote")
        );
      } else {
        jobs = jobs.filter((j) =>
          (j.job_type || "")
            .toLowerCase()
            .replace(/[-_ ]/g, "")
            .includes(jt.replace(/[-_ ]/g, ""))
        );
      }
    }
    return jobs.slice(0, perPage).map((j) => normalizeJob(j, "remotive"));
  } catch (e) {
    return { error: "Remotive fetch failed" };
  }
}

async function fetchRemoteOKJobs({
  techStack,
  location,
  jobType,
  perPage = 20,
}) {
  try {
    const res = await fetch("https://remoteok.com/api");
    const data = await res.json();
    let jobs = data.slice(1) || [];
    if (techStack)
      jobs = jobs.filter((j) =>
        (
          (j.position || j.title || "") +
          " " +
          (j.tags ? j.tags.join(", ") : "")
        )
          .toLowerCase()
          .includes(techStack.toLowerCase())
      );
    if (location)
      jobs = jobs.filter(
        (j) =>
          (j.location || "Worldwide").trim().toLowerCase() ===
          location.trim().toLowerCase()
      );
    if (jobType) {
      const jt = jobType.trim().toLowerCase();
      if (jt === "remote") {
        jobs = jobs.filter((j) =>
          (j.tags || []).map((t) => t.toLowerCase()).includes("remote")
        );
      } else {
        jobs = jobs.filter((j) =>
          (j.tags || [])
            .map((t) => t.toLowerCase().replace(/[-_ ]/g, ""))
            .includes(jt.replace(/[-_ ]/g, ""))
        );
      }
    }
    return jobs.slice(0, perPage).map((j) => normalizeJob(j, "remoteok"));
  } catch (e) {
    return { error: "RemoteOK fetch failed" };
  }
}

async function fetchLinkedInJobs({
  techStack,
  location,
  jobType,
  perPage = 20,
}) {
  try {
    if (!techStack || !location) return [];
    const jobs = await fetchJobListings(techStack, location, "past_week");
    let filtered = jobs;
    if (jobType) {
      const jt = jobType.trim().toLowerCase();
      if (jt === "remote") {
        filtered = jobs.filter((j) =>
          (j.location || "").toLowerCase().includes("remote")
        );
      } else {
        filtered = jobs.filter(
          (j) =>
            (j.title || "")
              .toLowerCase()
              .replace(/[-_ ]/g, "")
              .includes(jt.replace(/[-_ ]/g, "")) ||
            (j.description || "")
              .toLowerCase()
              .replace(/[-_ ]/g, "")
              .includes(jt.replace(/[-_ ]/g, ""))
        );
      }
    }
    return filtered.slice(0, perPage).map((j) => normalizeJob(j, "linkedin"));
  } catch (e) {
    return { error: "LinkedIn fetch failed" };
  }
}

app.get("/api/jobs", async (req, res) => {
  try {
    const {
      location = "",
      techStack = "",
      jobType = "",
      salaryMin = "",
      salaryMax = "",
      experienceLevel = "",
      company = "",
      datePosted = "",
      remoteType = "",
      page = 1,
      perPage = 20,
    } = req.query;
    const perPageNum = Math.max(1, Math.min(parseInt(perPage), 100));
    const cacheKey = `jobs_${location}_${techStack}_${jobType}_${salaryMin}_${salaryMax}_${experienceLevel}_${company}_${datePosted}_${remoteType}_${page}_${perPageNum}`;
    const cached = jobCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < JOB_CACHE_DURATION) {
      return res.json({
        jobs: cached.jobs,
        total: cached.total,
        cached: true,
        errors: cached.errors,
      });
    }
    let jobs = [];
    let errors = {};
    const [remotive, remoteok, linkedin] = await Promise.all([
      fetchRemotiveJobs({ techStack, location, jobType, perPage: 100 }),
      fetchRemoteOKJobs({ techStack, location, jobType, perPage: 100 }),
      fetchLinkedInJobs({ techStack, location, jobType, perPage: 100 }),
    ]);
    if (Array.isArray(remotive)) jobs = jobs.concat(remotive);
    else errors.Remotive = remotive.error;
    if (Array.isArray(remoteok)) jobs = jobs.concat(remoteok);
    else errors.RemoteOK = remoteok.error;
    if (Array.isArray(linkedin)) jobs = jobs.concat(linkedin);
    else errors.LinkedIn = linkedin.error;
    jobs = jobs.filter(Boolean);
    if (salaryMin)
      jobs = jobs.filter((j) => {
        const min = parseInt(salaryMin);
        if (!j.salary) return true;
        const [low] = j.salary.split("-").map(Number);
        return !isNaN(low) && low >= min;
      });
    if (salaryMax)
      jobs = jobs.filter((j) => {
        const max = parseInt(salaryMax);
        if (!j.salary) return true;
        const [, high] = j.salary.split("-").map(Number);
        return !isNaN(high) && high <= max;
      });
    if (experienceLevel)
      jobs = jobs.filter((j) =>
        (j.experience || "")
          .toLowerCase()
          .includes(experienceLevel.toLowerCase())
      );
    if (company)
      jobs = jobs.filter((j) =>
        (j.company_name || "").toLowerCase().includes(company.toLowerCase())
      );
    if (datePosted) {
      const now = Date.now();
      let cutoff = now;
      if (datePosted === "24h") cutoff -= 24 * 60 * 60 * 1000;
      else if (datePosted === "7d") cutoff -= 7 * 24 * 60 * 60 * 1000;
      jobs = jobs.filter(
        (j) => new Date(j.publication_date).getTime() >= cutoff
      );
    }
    if (remoteType)
      jobs = jobs.filter(
        (j) => (j.remoteType || "").toLowerCase() === remoteType.toLowerCase()
      );
    jobs = jobs.sort(
      (a, b) =>
        new Date(b.publication_date).getTime() -
        new Date(a.publication_date).getTime()
    );
    const total = jobs.length;
    const start = (parseInt(page) - 1) * perPageNum;
    const end = start + perPageNum;
    const paginated = jobs.slice(start, end);
    jobCache.set(cacheKey, {
      jobs: paginated,
      total,
      timestamp: Date.now(),
      errors,
    });
    res.json({ jobs: paginated, total, cached: false, errors });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Job aggregation failed", details: error.message });
  }
});

async function makeGitHubAPICall(url, headers) {
  // Ensure minimum delay between API calls
  const now = Date.now();
  const timeSinceLastCall = now - lastAPICall;
  if (timeSinceLastCall < API_DELAY) {
    await delay(API_DELAY - timeSinceLastCall);
  }

  lastAPICall = Date.now();

  const response = await fetch(url, { headers });

  // Check rate limit headers
  const remaining = response.headers.get("x-ratelimit-remaining");
  const resetTime = response.headers.get("x-ratelimit-reset");

  if (remaining && parseInt(remaining) < 10) {
    console.warn(
      `GitHub API rate limit warning: ${remaining} requests remaining`
    );
    if (resetTime) {
      const resetDate = new Date(parseInt(resetTime) * 1000);
      console.warn(`Rate limit resets at: ${resetDate.toISOString()}`);
    }

    // If we're very close to rate limit, add extra delay
    if (parseInt(remaining) < 5) {
      console.log("Adding extra delay due to low rate limit...");
      await delay(2000); // 2 second delay
    }
  }

  // If we hit rate limit, wait until reset
  if (response.status === 403 && remaining === "0") {
    console.warn("Rate limit exceeded, waiting for reset...");
    if (resetTime) {
      const resetDate = new Date(parseInt(resetTime) * 1000);
      const waitTime = resetDate.getTime() - Date.now() + 1000; // Add 1 second buffer
      if (waitTime > 0 && waitTime < 60 * 60 * 1000) {
        // Don't wait more than 1 hour
        console.log(
          `Waiting ${Math.round(
            waitTime / 1000
          )} seconds for rate limit reset...`
        );
        await delay(waitTime);
        // Retry the request
        return await fetch(url, { headers });
      }
    }
  }

  return response;
}

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Middleware
const allowedOrigins = [
  "http://localhost:5173", // Development
  "http://localhost:5173", // Localhost for production too
  process.env.FRONTEND_URL, // Environment variable for production
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session secret validation
if (!process.env.SESSION_SECRET) {
  console.error("WARNING: SESSION_SECRET is not set in environment variables");
  console.error("Please set a secure SESSION_SECRET for production use");
}

// Best practice: Use HttpOnly, Secure (in production), and persistent cookies for session management.
// Do NOT use localStorage for authentication. Always check session with backend.
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key-change-this",
    resave: false,
    saveUninitialized: false,
    name: "pubhub.session", // Custom session name
    cookie: {
      secure: process.env.NODE_ENV === "production", // Set to true in production with HTTPS
      httpOnly: true, // Prevent XSS attacks
      maxAge:
        (parseInt(process.env.SESSION_DURATION_DAYS) || 1) *
        24 *
        60 *
        60 *
        1000, // Persistent session (default 1 day)
      sameSite: "lax", // CSRF protection
    },
    rolling: true, // Reset expiration on each request
    store: undefined, // Use default memory store for now, consider Redis for production
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.VITE_GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === "production"
          ? `https://pubhub-lnao.onrender.com/auth/github/callback`
          : `http://localhost:3000/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Fetch additional GitHub data
        const userRepos = await fetchUserRepos(accessToken, profile.username);
        const languageStats = await fetchLanguageStats(accessToken, userRepos);

        // Check if user exists in database
        const { data: existingUser } = await supabase
          .from("users")
          .select("*")
          .eq("github_id", profile.id)
          .single();

        const userData = {
          github_id: parseInt(profile.id),
          github_username: profile.username,
          avatar_url: profile.photos?.[0]?.value,
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          total_public_repos: userRepos.length,
          languages: languageStats,
          github_data: profile._json,
          access_token: accessToken,
        };

        if (existingUser) {
          // Update existing user
          const { data: updatedUser, error } = await supabase
            .from("users")
            .update(userData)
            .eq("github_id", profile.id)
            .select()
            .single();

          if (error) throw error;
          return done(null, updatedUser);
        } else {
          // Create new user
          const { data: newUser, error } = await supabase
            .from("users")
            .insert([userData])
            .select()
            .single();

          if (error) throw error;
          return done(null, newUser);
        }
      } catch (error) {
        console.error("GitHub authentication error:", error);
        return done(error, null);
      }
    }
  )
);

// Serialize/Deserialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

async function activeDays(username) {
  const headers = {
    Accept: "application/vnd.github.cloak-preview",
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `token ${GITHUB_TOKEN}`;
  }

  const per_page = 100;
  let page = 1;
  const commitDates = new Set();
  let total_count = Infinity;

  const currentYear = new Date().getFullYear();
  const cutoff = new Date(currentYear, 0, 2);
  //  always true
  while ((page - 1) * per_page < total_count) {
    const url = `https://api.github.com/search/commits?q=author:${username}&sort=author-date&order=asc&page=${page}&per_page=${per_page}`;
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(
          `HTTP Error ${response.status}: ${response.statusText}`
        );
      }
      const data = await response.json();

      if (page === 1) {
        total_count = Math.min(data.total_count, 1000);
      }
      if (!data.items || data.items.length === 0) {
        break;
      }
      data.items.forEach((item) => {
        const commitDate = new Date(item.commit.author.date);
        if (commitDate >= cutoff) {
          let preciseDate = item.commit.author.date.slice(0, 10);
          commitDates.add(preciseDate);
        }
      });
      page++;
    } catch (error) {
      console.error("Error fetching commit history:", error);
    }
  }
  return commitDates;
}

async function getCommitHistoryWithDates(username) {
  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "PubHub-App",
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  const commitsByDate = new Map();

  // Get commits from the last 365 days
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  try {
    // First, get the user's repositories
    const reposResponse = await makeGitHubAPICall(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      headers
    );
    if (!reposResponse.ok) {
      throw new Error(
        `HTTP Error ${reposResponse.status}: ${reposResponse.statusText}`
      );
    }
    const repos = await reposResponse.json();

    // Process up to 20 most recently updated repositories to avoid rate limits
    const reposToProcess = repos.slice(0, 20);

    for (const repo of reposToProcess) {
      try {
        // Get commits from this repository
        const commitsUrl = `https://api.github.com/repos/${
          repo.full_name
        }/commits?author=${username}&since=${oneYearAgo.toISOString()}&per_page=100`;
        const commitsResponse = await makeGitHubAPICall(commitsUrl, headers);

        if (commitsResponse.ok) {
          const commits = await commitsResponse.json();
          commits.forEach((commit) => {
            if (commit.author && commit.author.login === username) {
              const commitDate = new Date(commit.commit.author.date);
              if (commitDate >= oneYearAgo) {
                const dateString = commitDate.toISOString().slice(0, 10);
                commitsByDate.set(
                  dateString,
                  (commitsByDate.get(dateString) || 0) + 1
                );
              }
            }
          });
        }
      } catch (repoError) {
        console.warn(
          `Error fetching commits for ${repo.full_name}:`,
          repoError.message
        );
        // Continue with other repositories
      }
    }
  } catch (error) {
    console.error("Error fetching commit history with dates:", error);
    // Return empty array instead of breaking
    return [];
  }

  // Convert to array and sort by date
  return Array.from(commitsByDate.entries())
    .map(([date, commits]) => ({ date, commits }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// Helper functions for GitHub API
async function fetchUserRepos(token, username) {
  try {
    const headers = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "PubHub-App",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await makeGitHubAPICall(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      headers
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch repositories: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching repos:", error);
    return [];
  }
}

async function fetchLanguageStats(token, repos) {
  const languageStats = {};

  for (const repo of repos.slice(0, 10)) {
    // Limit to avoid rate limits
    try {
      const headers = {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "PubHub-App",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await makeGitHubAPICall(repo.languages_url, headers);

      if (response.ok) {
        const languages = await response.json();
        for (const [lang, bytes] of Object.entries(languages)) {
          languageStats[lang] = (languageStats[lang] || 0) + bytes;
        }
      }
    } catch (error) {
      console.warn(`Failed to fetch languages for ${repo.name}:`, error);
    }
  }

  // Convert to percentages
  const totalBytes = Object.values(languageStats).reduce(
    (sum, bytes) => sum + bytes,
    0
  );
  const languagePercentages = {};

  for (const [lang, bytes] of Object.entries(languageStats)) {
    languagePercentages[lang] =
      Math.round((bytes / totalBytes) * 100 * 100) / 100;
  }

  return languagePercentages;
}

// JWT Utility Functions
function generateToken(user) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const payload = {
    id: user.id,
    github_id: user.github_id,
    github_username: user.github_username,
    email: user.email,
    name: user.name,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
    issuer: "pubhub-app",
    audience: "pubhub-users",
  });
}

function verifyToken(token) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: "pubhub-app",
      audience: "pubhub-users",
    });
  } catch (error) {
    throw new Error(`Invalid token: ${error.message}`);
  }
}

// JWT Authentication Middleware
async function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = verifyToken(token);

    // Get fresh user data from database
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", decoded.id)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Authentication error:", error);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

// Routes
app.get(
  "/auth/github",
  passport.authenticate("github", {
    scope: ["user:email", "repo"],
  })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "https://pubhub-bolt.netlify.app/?error=auth_failed",
  }),
  (req, res) => {
    try {
      // Generate JWT token for the authenticated user
      const token = generateToken(req.user);

      // Check if user has completed onboarding
      const hasCompletedOnboarding =
        req.user.technologies && req.user.technologies.length > 0;

      // Redirect with token as query parameter
      const redirectUrl = hasCompletedOnboarding
        ? `https://pubhub-bolt.netlify.app/dashboard?token=${token}`
        : `https://pubhub-bolt.netlify.app/onboarding?token=${token}`;

      res.redirect(redirectUrl);
    } catch (error) {
      console.error("Error generating JWT token:", error);
      res.redirect(
        "https://pubhub-bolt.netlify.app/?error=token_generation_failed"
      );
    }
  }
);

app.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.redirect("https://pubhub-bolt.netlify.app/");
  });
});

app.get("/api/user", authenticateJWT, (req, res) => {
  console.log("JWT authenticated user:", req.user.github_username);
  res.json(req.user);
});

app.put("/api/user/technologies", authenticateJWT, async (req, res) => {
  try {
    const { technologies } = req.body;

    const { data: updatedUser, error } = await supabase
      .from("users")
      .update({ technologies })
      .eq("id", req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating technologies:", error);
    res.status(500).json({ error: "Failed to update technologies" });
  }
});

app.put("/api/user/profession", authenticateJWT, async (req, res) => {
  try {
    const { profession } = req.body;

    const { data: updatedUser, error } = await supabase
      .from("users")
      .update({ profession })
      .eq("id", req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating profession:", error);
    res.status(500).json({ error: "Failed to update profession" });
  }
});

app.put("/api/user/social-links", authenticateJWT, async (req, res) => {
  try {
    const { linkedin_username, x_username } = req.body;
    const updateData = {};

    // Handle linkedin_username update
    if (linkedin_username !== undefined) {
      // Store empty string as null in the database
      updateData.linkedin_username = linkedin_username || null;
    }

    // Handle x_username update
    if (x_username !== undefined) {
      // Store empty string as null in the database
      updateData.x_username = x_username || null;
    }

    const { data: updatedUser, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating social links:", error);
    res.status(500).json({ error: "Failed to update social links" });
  }
});

app.get("/api/user/active-days", authenticateJWT, async (req, res) => {
  try {
    console.log(`Fetching active days for user: ${req.user.github_username}`);
    const days = await activeDays(req.user.github_username);
    res.json({ activeDays: days.size });
  } catch (error) {
    console.error("Error fetching active days:", error);
    res.status(500).json({
      error: "Failed to fetch active days",
      details: error.message,
    });
  }
});

app.get("/api/user/commit-history", authenticateJWT, async (req, res) => {
  try {
    console.log(
      `Fetching commit history for user: ${req.user.github_username}`
    );
    const commitHistory = await getCommitHistoryWithDates(
      req.user.github_username
    );
    res.json({ commitHistory });
  } catch (error) {
    console.error("Error fetching commit history:", error);
    res.status(500).json({
      error: "Failed to fetch commit history",
      details: error.message,
    });
  }
});

// New endpoint to fetch repositories based on user's technologies
app.get("/api/user/repositories", authenticateJWT, async (req, res) => {
  try {
    const user = req.user;
    const userId = user.id;

    // Check if we have cached data for this user
    const cacheKey = `user_repos_${userId}`;
    const cachedData = repositoryCache.get(cacheKey);

    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log(`Returning cached repository data for user ${userId}`);
      return res.json({
        success: true,
        technologies: cachedData.data,
        totalTechnologies: cachedData.data.length,
        message: `Returned cached repositories for ${cachedData.data.length} technologies`,
        cached: true,
      });
    }

    // Get user's technologies, fallback to popular technologies if none
    const userTechnologies =
      user.technologies && user.technologies.length > 0
        ? user.technologies // No limit - frontend will handle pagination
        : ["JavaScript", "React", "Node.js", "Python", "TypeScript", "CSS"];

    console.log(
      `Fetching repositories for ${
        userTechnologies.length
      } technologies: ${userTechnologies.join(", ")}`
    );

    const headers = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "PubHub-App",
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    };

    const results = [];

    // Fetch repositories for each technology with improved rate limiting
    for (let i = 0; i < userTechnologies.length; i++) {
      const tech = userTechnologies[i];

      try {
        // Check individual technology cache
        const techCacheKey = `tech_${tech}`;
        const cachedTechData = repositoryCache.get(techCacheKey);

        if (
          cachedTechData &&
          Date.now() - cachedTechData.timestamp < CACHE_DURATION
        ) {
          console.log(`Using cached data for technology: ${tech}`);
          results.push(cachedTechData.data);
          continue;
        }

        console.log(
          `Fetching repositories for: ${tech} (${i + 1}/${
            userTechnologies.length
          })`
        );

        const randomStars =
          Math.floor(Math.random() * (15000 - 3500 + 1)) + 3500;

        const response = await makeGitHubAPICall(
          `https://api.github.com/search/repositories?q=${encodeURIComponent(
            tech
          )}+stars:2500..${randomStars}+is:public&sort=stars&order=desc&per_page=3`,
          headers
        );

        if (!response.ok) {
          console.warn(
            `Failed to fetch repos for ${tech}: ${response.status} ${response.statusText}`
          );
          const errorResult = {
            technology: tech,
            repositories: [],
            error:
              response.status === 403
                ? "Rate limit exceeded"
                : `Failed to fetch: ${response.status}`,
          };
          results.push(errorResult);
          continue;
        }

        const data = await response.json();
        const repositories = data.items || [];

        const techResult = {
          technology: tech,
          repositories: repositories,
          count: repositories.length,
        };

        results.push(techResult);

        // Cache individual technology data
        repositoryCache.set(techCacheKey, {
          data: techResult,
          timestamp: Date.now(),
        });

        console.log(`Found ${repositories.length} repositories for ${tech}`);

        // Add progressive delay for large numbers of technologies
        if (userTechnologies.length > 10 && i < userTechnologies.length - 1) {
          await delay(200); // Extra delay for large requests
        }
      } catch (error) {
        console.error(`Error fetching repos for ${tech}:`, error);
        results.push({
          technology: tech,
          repositories: [],
          error: error.message,
        });
      }
    }

    // Cache the full result for this user
    repositoryCache.set(cacheKey, {
      data: results,
      timestamp: Date.now(),
    });

    // Log rate limit info
    try {
      const rateLimitResponse = await makeGitHubAPICall(
        "https://api.github.com/rate_limit",
        headers
      );
      if (rateLimitResponse.ok) {
        const rateLimit = await rateLimitResponse.json();
        console.log("GitHub API Rate Limit Status:", {
          remaining: rateLimit.rate.remaining,
          limit: rateLimit.rate.limit,
          reset: new Date(rateLimit.rate.reset * 1000).toLocaleTimeString(),
        });
      }
    } catch (rateLimitError) {
      console.warn("Could not fetch rate limit info:", rateLimitError.message);
    }

    res.json({
      success: true,
      technologies: results,
      totalTechnologies: userTechnologies.length,
      message: `Fetched repositories for ${results.length} technologies`,
      cached: false,
    });
  } catch (error) {
    console.error("Error fetching user repositories:", error);
    res.status(500).json({
      error: "Failed to fetch repositories",
      details: error.message,
    });
  }
});

// New endpoint to fetch user's own GitHub repositories
app.get("/api/user/own-repositories", authenticateJWT, async (req, res) => {
  try {
    const user = req.user;
    const username = user.github_username;

    // Check if we have cached data for this user's own repos
    const cacheKey = `user_own_repos_${username}`;
    const cachedData = repositoryCache.get(cacheKey);

    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log(`Returning cached own repository data for user ${username}`);
      return res.json({
        success: true,
        repositories: cachedData.data,
        cached: true,
      });
    }

    const headers = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "PubHub-App",
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    };

    console.log(`Fetching own repositories for user: ${username}`);

    // Fetch user's own repos sorted by updated date (most recent first)
    const response = await makeGitHubAPICall(
      `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=5`,
      headers
    );

    if (!response.ok) {
      console.warn(
        `Failed to fetch repositories for ${username}: ${response.status} ${response.statusText}`
      );
      return res.status(response.status).json({
        success: false,
        message:
          response.status === 403
            ? "Rate limit exceeded"
            : `Failed to fetch repositories: ${response.status}`,
      });
    }

    const repositories = await response.json();

    // Process the repos to get only the needed information
    const processedRepos = repositories.map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      updated_at: repo.updated_at,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      fork: repo.fork,
      visibility: repo.visibility,
    }));

    // Cache the result
    repositoryCache.set(cacheKey, {
      data: processedRepos,
      timestamp: Date.now(),
    });

    res.json({
      success: true,
      repositories: processedRepos,
    });
  } catch (error) {
    console.error("Error fetching user repositories:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Test endpoint to verify GitHub API authentication
app.get("/api/test-github", async (req, res) => {
  try {
    console.log("Testing GitHub API authentication...");

    // Test basic API access
    const response = await makeGitHubAPICall("https://api.github.com/user", {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "PubHub-App",
    });

    if (response && response.login) {
      res.json({
        success: true,
        message: "GitHub API authentication successful",
        user: response.login,
        rateLimit: {
          limit: response.headers?.get("x-ratelimit-limit"),
          remaining: response.headers?.get("x-ratelimit-remaining"),
          reset: response.headers?.get("x-ratelimit-reset"),
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: "GitHub API authentication failed",
        error: "No user data returned",
        response: response,
      });
    }
  } catch (error) {
    console.error("GitHub API test failed:", error);
    res.status(500).json({
      success: false,
      message: "GitHub API test failed",
      error: error.message,
    });
  }
});

// JWT token refresh endpoint
app.post("/api/user/refresh-token", authenticateJWT, async (req, res) => {
  try {
    // Generate a new token for the authenticated user
    const newToken = generateToken(req.user);

    res.json({
      success: true,
      token: newToken,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({
      error: "Failed to refresh token",
      details: error.message,
    });
  }
});

// Token verification endpoint
app.get("/api/user/verify-token", authenticateJWT, (req, res) => {
  res.json({
    valid: true,
    user: {
      id: req.user.id,
      github_username: req.user.github_username,
      name: req.user.name,
      email: req.user.email,
    },
  });
});

// Logout endpoint (client-side will handle token removal)
app.post("/api/user/logout", (req, res) => {
  res.json({
    success: true,
    message:
      "Logged out successfully. Please remove the token from client storage.",
  });
});

// AI Chat endpoint
app.post("/api/ai-chat", authenticateJWT, async (req, res) => {
  try {
    const { messages, sessionId } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format" });
    }

    console.log(
      "Attempting to chat with Mistral AI, messages:",
      JSON.stringify(
        messages.map((m) => ({
          role: m.role,
          content: m.content.substring(0, 30) + "...",
        }))
      )
    ); // Try with the correct model name - it might be mistral-large or mistral-medium instead of codestral-2501
    const modelName = "codestral-2501"; // Use the correct model name for Mistral API
    console.log("Using model:", modelName);

    try {
      // Call Mistral API with the provided messages
      // Use the chatCompletions method instead of chat (API changed)
      const chatResponse = await mistralClient.chat.complete({
        model: modelName,
        messages: messages,
      });

      console.log(
        "Mistral API response received:",
        chatResponse ? "Yes" : "No"
      );

      if (!chatResponse || !chatResponse.choices || !chatResponse.choices[0]) {
        throw new Error("Invalid response from Mistral API");
      }

      const assistantResponse = chatResponse.choices[0].message.content;

      console.log(
        "Assistant response received",
        assistantResponse ? "Yes" : "No",
        "Length:",
        assistantResponse ? assistantResponse.length : 0
      );

      // Store the user message and assistant response in Supabase
      if (sessionId) {
        // Only store if a session ID is provided
        const userId = req.user.id;

        // Store assistant's response
        const { error: assistantError } = await supabase
          .from("chat_messages")
          .insert({
            user_id: userId,
            session_id: sessionId,
            role: "assistant",
            content: assistantResponse,
          });

        if (assistantError) {
          console.error("Error storing assistant message:", assistantError);
        }
      }

      return res.json({ response: assistantResponse });
    } catch (mistralError) {
      console.error("Error calling Mistral API:", mistralError);
      console.error("Error details:", mistralError.stack);
      throw new Error(`Mistral API error: ${mistralError.message}`);
    }
  } catch (error) {
    console.error("Error in AI chat:", error);
    console.error("Stack trace:", error.stack);
    return res.status(500).json({
      error: "Error processing AI request",
      details: error.message,
    });
  }
}); // Store user message endpoint
app.post("/api/chat-messages", authenticateJWT, async (req, res) => {
  try {
    const { session_id, content, role } = req.body;

    console.log("Chat message received:", {
      session_id,
      role,
      contentLength: content?.length,
    });

    if (!session_id || !content || !role) {
      return res.status(400).json({
        error: "Missing required fields",
        received: {
          session_id: !!session_id,
          content: !!content,
          role: !!role,
        },
      });
    }

    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        user_id: req.user.id,
        session_id: session_id,
        role: role,
        content: content,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error("Error storing chat message:", error);
    return res.status(500).json({
      error: "Failed to store message",
      details: error.message,
    });
  }
});

// Get chat messages for a session
app.get("/api/chat-messages/:sessionId", authenticateJWT, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    console.log(
      `Fetching chat messages for session ${sessionId} and user ${userId}`
    );

    // Get messages from the last 48 hours
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", userId)
      .eq("session_id", sessionId)
      .gte(
        "created_at",
        new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Supabase error fetching messages:", error);
      throw error;
    }

    console.log(
      `Found ${data ? data.length : 0} messages for session ${sessionId}`
    );
    return res.json(data || []);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return res.status(500).json({
      error: "Failed to fetch messages",
      details: error.message,
    });
  }
});

// --- PUBLIC USER ENDPOINTS ---
// Get all users (public)
app.get("/api/users", async (req, res) => {
  try {
    const { data: users, error } = await supabase.from("users").select("*");
    if (error) throw error;
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get user by github_username (public)
app.get("/api/user/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("github_username", username)
      .single();
    if (error || !user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user by username:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Get active days for a user by username (public)
app.get("/api/user/:username/active-days", async (req, res) => {
  try {
    const { username } = req.params;
    const days = await activeDays(username);
    res.json({ activeDays: days.size });
  } catch (error) {
    console.error("Error fetching active days by username:", error);
    res.status(500).json({ error: "Failed to fetch active days" });
  }
});

// Get public repo count for a user by username (public, uses GITHUB_TOKEN)
app.get("/api/user/:username/repo-count", async (req, res) => {
  try {
    const { username } = req.params;
    const headers = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "PubHub-App",
    };
    if (GITHUB_TOKEN) {
      headers.Authorization = `token ${GITHUB_TOKEN}`;
    }
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers,
    });
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `GitHub API error: ${response.status}` });
    }
    const data = await response.json();
    res.json({ repoCount: data.public_repos || 0 });
  } catch (error) {
    console.error("Error fetching repo count by username:", error);
    res.status(500).json({ error: "Failed to fetch repo count" });
  }
});

// --- CONNECTION SYSTEM ENDPOINTS ---

// Send connection request
app.post("/api/connections/request", authenticateJWT, async (req, res) => {
  try {
    const { recipient_username, message } = req.body;
    const requester_id = req.user.id;

    if (!recipient_username) {
      return res.status(400).json({ error: "Recipient username is required" });
    }

    // Get recipient user
    const { data: recipient, error: recipientError } = await supabase
      .from("users")
      .select("id")
      .eq("github_username", recipient_username)
      .single();

    if (recipientError || !recipient) {
      return res.status(404).json({ error: "Recipient user not found" });
    }

    if (requester_id === recipient.id) {
      return res.status(400).json({ error: "Cannot send request to yourself" });
    }

    // Check if connection already exists
    const { data: existingConnection } = await supabase
      .from("connections")
      .select("id")
      .or(`user_id.eq.${requester_id},connected_user_id.eq.${requester_id}`)
      .or(`user_id.eq.${recipient.id},connected_user_id.eq.${recipient.id}`)
      .single();

    if (existingConnection) {
      return res.status(400).json({ error: "Connection already exists" });
    }

    // Check if request already exists
    const { data: existingRequest } = await supabase
      .from("connection_requests")
      .select("id, status")
      .or(`requester_id.eq.${requester_id},recipient_id.eq.${requester_id}`)
      .or(`requester_id.eq.${recipient.id},recipient_id.eq.${recipient.id}`)
      .single();

    if (existingRequest) {
      return res.status(400).json({
        error: "Connection request already exists",
        status: existingRequest.status,
      });
    }

    // Create connection request
    const { data: request, error } = await supabase
      .from("connection_requests")
      .insert({
        requester_id,
        recipient_id: recipient.id,
        message: message || null,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      request,
      message: "Connection request sent successfully",
    });
  } catch (error) {
    console.error("Error sending connection request:", error);
    res.status(500).json({ error: "Failed to send connection request" });
  }
});

// Accept connection request
app.put(
  "/api/connections/accept/:requestId",
  authenticateJWT,
  async (req, res) => {
    try {
      const { requestId } = req.params;
      const user_id = req.user.id;

      // Get the request
      const { data: request, error: requestError } = await supabase
        .from("connection_requests")
        .select("*")
        .eq("id", requestId)
        .eq("recipient_id", user_id)
        .eq("status", "pending")
        .single();

      if (requestError || !request) {
        return res
          .status(404)
          .json({ error: "Request not found or already processed" });
      }

      // Update request status
      const { error: updateError } = await supabase
        .from("connection_requests")
        .update({ status: "accepted", updated_at: new Date().toISOString() })
        .eq("id", requestId);

      if (updateError) throw updateError;

      // Create mutual connection
      const { error: connectionError } = await supabase
        .from("connections")
        .insert([
          {
            user_id: request.requester_id,
            connected_user_id: request.recipient_id,
          },
          {
            user_id: request.recipient_id,
            connected_user_id: request.requester_id,
          },
        ]);

      if (connectionError) throw connectionError;

      res.json({
        success: true,
        message: "Connection request accepted",
      });
    } catch (error) {
      console.error("Error accepting connection request:", error);
      res.status(500).json({ error: "Failed to accept connection request" });
    }
  }
);

// Reject connection request
app.put(
  "/api/connections/reject/:requestId",
  authenticateJWT,
  async (req, res) => {
    try {
      const { requestId } = req.params;
      const user_id = req.user.id;

      const { error } = await supabase
        .from("connection_requests")
        .update({ status: "rejected", updated_at: new Date().toISOString() })
        .eq("id", requestId)
        .eq("recipient_id", user_id)
        .eq("status", "pending");

      if (error) throw error;

      res.json({
        success: true,
        message: "Connection request rejected",
      });
    } catch (error) {
      console.error("Error rejecting connection request:", error);
      res.status(500).json({ error: "Failed to reject connection request" });
    }
  }
);

// Get user's connection requests (sent and received)
app.get("/api/connections/requests", authenticateJWT, async (req, res) => {
  try {
    const user_id = req.user.id;

    const { data: requests, error } = await supabase
      .from("connection_requests")
      .select(
        `
        *,
        requester:requester_id(id, github_username, name, avatar_url),
        recipient:recipient_id(id, github_username, name, avatar_url)
      `
      )
      .or(`requester_id.eq.${user_id},recipient_id.eq.${user_id}`)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      requests: requests || [],
    });
  } catch (error) {
    console.error("Error fetching connection requests:", error);
    res.status(500).json({ error: "Failed to fetch connection requests" });
  }
});

// Get user's connections
app.get("/api/connections", authenticateJWT, async (req, res) => {
  try {
    const user_id = req.user.id;

    const { data: connections, error } = await supabase
      .from("connections")
      .select(
        `
        *,
        connected_user:connected_user_id(id, github_username, name, avatar_url, profession)
      `
      )
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      connections: connections || [],
    });
  } catch (error) {
    console.error("Error fetching connections:", error);
    res.status(500).json({ error: "Failed to fetch connections" });
  }
});

// Remove connection
app.delete(
  "/api/connections/:connectionId",
  authenticateJWT,
  async (req, res) => {
    try {
      const { connectionId } = req.params;
      const user_id = req.user.id;

      // Get the connection to find the other user
      const { data: connection, error: connectionError } = await supabase
        .from("connections")
        .select("*")
        .eq("id", connectionId)
        .or(`user_id.eq.${user_id},connected_user_id.eq.${user_id}`)
        .single();

      if (connectionError || !connection) {
        return res.status(404).json({ error: "Connection not found" });
      }

      // Delete both connection records (mutual connection)
      const { error } = await supabase
        .from("connections")
        .delete()
        .or(
          `user_id.eq.${connection.user_id},connected_user_id.eq.${connection.user_id}`
        )
        .or(
          `user_id.eq.${connection.connected_user_id},connected_user_id.eq.${connection.connected_user_id}`
        );

      if (error) throw error;

      res.json({
        success: true,
        message: "Connection removed",
      });
    } catch (error) {
      console.error("Error removing connection:", error);
      res.status(500).json({ error: "Failed to remove connection" });
    }
  }
);

// Get connection status with another user
app.get(
  "/api/connections/status/:username",
  authenticateJWT,
  async (req, res) => {
    try {
      const { username } = req.params;
      const user_id = req.user.id;

      // Get the other user
      const { data: otherUser, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("github_username", username)
        .single();

      if (userError || !otherUser) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user_id === otherUser.id) {
        return res.json({
          status: "self",
          message: "This is your own profile",
        });
      }

      // Check if connected
      const { data: connection } = await supabase
        .from("connections")
        .select("id")
        .eq("user_id", user_id)
        .eq("connected_user_id", otherUser.id)
        .single();

      if (connection) {
        return res.json({
          status: "connected",
          message: "Already connected",
        });
      }

      // Check for pending requests
      const { data: sentRequest } = await supabase
        .from("connection_requests")
        .select("id, status")
        .eq("requester_id", user_id)
        .eq("recipient_id", otherUser.id)
        .single();

      if (sentRequest) {
        return res.json({
          status: "request_sent",
          requestStatus: sentRequest.status,
          message:
            sentRequest.status === "pending"
              ? "Request sent"
              : "Request " + sentRequest.status,
        });
      }

      const { data: receivedRequest } = await supabase
        .from("connection_requests")
        .select("id, status")
        .eq("requester_id", otherUser.id)
        .eq("recipient_id", user_id)
        .single();

      if (receivedRequest) {
        return res.json({
          status: "request_received",
          requestStatus: receivedRequest.status,
          message:
            receivedRequest.status === "pending"
              ? "Request received"
              : "Request " + receivedRequest.status,
        });
      }

      res.json({
        status: "not_connected",
        message: "Not connected",
      });
    } catch (error) {
      console.error("Error checking connection status:", error);
      res.status(500).json({ error: "Failed to check connection status" });
    }
  }
);

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

// Handle port already in use error
const server = app
  .listen(PORT,"0.0.0.0", () => {
    console.log(`Server running on PORT : ${PORT}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Please try one of the following:`
      );
      console.error(
        `1. Kill the process using port ${PORT}: lsof -ti:${PORT} | xargs kill -9`
      );
      console.error(
        `2. Use a different port by setting PORT environment variable`
      );
      console.error(`3. Wait a moment and try again`);
      process.exit(1);
    } else {
      console.error("Server error:", err);
      process.exit(1);
    }
  });

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
