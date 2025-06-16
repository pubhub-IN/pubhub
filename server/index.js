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

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://pubhubtest.vercel.app"
        : ["http://pubhubtest.vercel.app", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session secret validation
if (!process.env.SESSION_SECRET) {
  console.error("WARNING: SESSION_SECRET is not set in environment variables");
  console.error("Please set a secure SESSION_SECRET for production use");
}

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key-change-this",
    resave: false,
    saveUninitialized: false,
    proxy: process.env.NODE_ENV === "production", // Trust proxy in production
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: "/",
      domain:
        process.env.NODE_ENV === "production" ? ".onrender.com" : undefined,
    },
    name: "pubhub.sid",
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
      callbackURL: "https://pubhub-server.onrender.com/auth/github/callback",
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

// Helper functions for GitHub API
async function fetchUserRepos(token, username) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch repositories");
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
      const response = await fetch(repo.languages_url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

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
    failureRedirect: "http://pubhubtest.vercel.app/?error=auth_failed",
  }),
  (req, res) => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding =
      req.user.technologies && req.user.technologies.length > 0;

    // Use HTTPS in production
    const frontendUrl =
      process.env.NODE_ENV === "production"
        ? "https://pubhubtest.vercel.app"
        : "http://pubhubtest.vercel.app";

    if (hasCompletedOnboarding) {
      res.redirect(`${frontendUrl}/dashboard`);
    } else {
      res.redirect(`${frontendUrl}/onboarding`);
    }
  }
);

app.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.redirect("http://pubhubtest.vercel.app/");
  });
});

app.get("/api/user", (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
