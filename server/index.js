import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Rate limiting helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// GitHub API rate limiting tracker
let lastAPICall = 0;
const API_DELAY = 100; // Minimum delay between API calls in milliseconds

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
    const remaining = response.headers.get('x-ratelimit-remaining');
    const resetTime = response.headers.get('x-ratelimit-reset');
    
    if (remaining && parseInt(remaining) < 10) {
        console.warn(`GitHub API rate limit warning: ${remaining} requests remaining`);
        if (resetTime) {
            const resetDate = new Date(parseInt(resetTime) * 1000);
            console.warn(`Rate limit resets at: ${resetDate.toISOString()}`);
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
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session secret validation
if (!process.env.SESSION_SECRET) {
    console.error(
        "WARNING: SESSION_SECRET is not set in environment variables"
    );
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
            secure: process.env.NODE_ENV === 'production', // Set to true in production with HTTPS
            httpOnly: true, // Prevent XSS attacks
            maxAge: (parseInt(process.env.SESSION_DURATION_DAYS) || 1) * 24 * 60 * 60 * 1000, // Persistent session (default 1 day)
            sameSite: 'lax' // CSRF protection
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
            callbackURL: "http://localhost:3001/auth/github/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Fetch additional GitHub data
                const userRepos = await fetchUserRepos(
                    accessToken,
                    profile.username
                );
                const languageStats = await fetchLanguageStats(
                    accessToken,
                    userRepos
                );

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
        Accept: 'application/vnd.github.cloak-preview',
    };
    if (GITHUB_TOKEN) {
        headers.Authorization = `token ${GITHUB_TOKEN}`;
    }

    const per_page = 100;
    let page = 1;
    const commitDates = new Set();
    let total_count = Infinity;

    const currentYear = new Date().getFullYear()
    const cutoff = new Date(currentYear, 0, 2);
    //  always true 
    while ((page - 1) * per_page < total_count) {
        const url = `https://api.github.com/search/commits?q=author:${username}&sort=author-date&order=asc&page=${page}&per_page=${per_page}`;
        try {
            const response = await fetch(url, { headers });
            if (!response.ok) {
                throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();

            if (page === 1) {
                total_count = Math.min(data.total_count, 1000);
            }
            if (!data.items || data.items.length === 0) {
                break;
            }
            data.items.forEach((item) => {
                const commitDate = new Date(item.commit.author.date)
                if(commitDate >= cutoff){
                    let preciseDate = item.commit.author.date.slice(0, 10)
                    commitDates.add(preciseDate);
                }
            });
            page++;
        } catch (error) {
            console.error('Error fetching commit history:', error);
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
        const reposResponse = await makeGitHubAPICall(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, headers);
        if (!reposResponse.ok) {
            throw new Error(`HTTP Error ${reposResponse.status}: ${reposResponse.statusText}`);
        }
        const repos = await reposResponse.json();

        // Process up to 20 most recently updated repositories to avoid rate limits
        const reposToProcess = repos.slice(0, 20);
        
        for (const repo of reposToProcess) {
            try {
                // Get commits from this repository
                const commitsUrl = `https://api.github.com/repos/${repo.full_name}/commits?author=${username}&since=${oneYearAgo.toISOString()}&per_page=100`;
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
                console.warn(`Error fetching commits for ${repo.full_name}:`, repoError.message);
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
        .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
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
            throw new Error(`Failed to fetch repositories: ${response.status} ${response.statusText}`);
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
        failureRedirect: "http://localhost:5173/?error=auth_failed",
    }),
    (req, res) => {
        // Check if user has completed onboarding
        const hasCompletedOnboarding =
            req.user.technologies && req.user.technologies.length > 0;

        if (hasCompletedOnboarding) {
            res.redirect(`http://localhost:5173/dashboard`);
        } else {
            res.redirect(`http://localhost:5173/onboarding`);
        }
    }
);

app.get("/auth/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: "Logout failed" });
        }
        res.redirect("http://localhost:5173/");
    });
});

app.get("/api/user", (req, res) => {
    console.log("Session ID:", req.sessionID);
    console.log("Session data:", req.session);
    console.log("Is authenticated:", req.isAuthenticated());
    console.log("User in session:", req.user);
    console.log("Session cookie maxAge:", req.session.cookie.maxAge);
    console.log("Session expires at:", new Date(Date.now() + req.session.cookie.maxAge));
    
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.status(401).json({ error: "Not authenticated" });
    }
});

app.put("/api/user/technologies", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Not authenticated" });
    }

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

app.get("/api/user/active-days", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        console.log(`Fetching active days for user: ${req.user.github_username}`);
        const days = await activeDays(req.user.github_username);
        res.json({ activeDays: days.size });
    } catch (error) {
        console.error("Error fetching active days:", error);
        res.status(500).json({ 
            error: "Failed to fetch active days", 
            details: error.message 
        });
    }
});

app.get("/api/user/commit-history", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        console.log(`Fetching commit history for user: ${req.user.github_username}`);
        const commitHistory = await getCommitHistoryWithDates(
            req.user.github_username
        );
        res.json({ commitHistory });
    } catch (error) {
        console.error("Error fetching commit history:", error);
        res.status(500).json({ 
            error: "Failed to fetch commit history", 
            details: error.message 
        });
    }
});

// Test endpoint to verify GitHub API authentication
app.get('/api/test-github', async (req, res) => {
  try {
    console.log('Testing GitHub API authentication...');
    
    // Test basic API access
    const response = await makeGitHubAPICall('https://api.github.com/user', {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "PubHub-App"
    });
    
    if (response && response.login) {
      res.json({ 
        success: true, 
        message: 'GitHub API authentication successful',
        user: response.login,
        rateLimit: {
          limit: response.headers?.get('x-ratelimit-limit'),
          remaining: response.headers?.get('x-ratelimit-remaining'),
          reset: response.headers?.get('x-ratelimit-reset')
        }
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'GitHub API authentication failed',
        error: 'No user data returned',
        response: response
      });
    }
  } catch (error) {
    console.error('GitHub API test failed:', error);
    res.status(500).json({ 
      success: false, 
      message: 'GitHub API test failed',
      error: error.message 
    });
  }
});

// Session refresh endpoint
app.post("/api/user/refresh-session", (req, res) => {
    if (req.isAuthenticated()) {
        // Touch the session to reset the expiration
        req.session.touch();
        res.json({ status: "refreshed", expires: new Date(Date.now() + req.session.cookie.maxAge) });
    } else {
        res.status(401).json({ error: "Not authenticated" });
    }
});

// Session status endpoint
app.get("/api/user/session-status", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ 
            authenticated: true, 
            expires: new Date(Date.now() + req.session.cookie.maxAge),
            sessionId: req.sessionID 
        });
    } else {
        res.status(401).json({ authenticated: false });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});
