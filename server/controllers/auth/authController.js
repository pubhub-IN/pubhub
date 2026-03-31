import { RefreshToken } from "../../models/tokens/refreshTokenModel.js";
import { User } from "../../models/user/userModel.js";
import {
  createRefreshTokenValue,
  getRefreshTokenExpiry,
  issueAccessToken,
} from "../../middleware/auth/tokenUtils.js";

function getOAuthConfig() {
  return {
    frontendUrl:
      process.env.FRONTEND_URL ||
      process.env.VITE_FRONTEND_URL ||
      "http://localhost:5173",
    githubClientId: process.env.GITHUB_CLIENT_ID || "",
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    githubCallbackUrl:
      process.env.GITHUB_CALLBACK_URL ||
      "http://localhost:3000/auth/github/callback",
  };
}

function hasGithubOAuthConfig() {
  const { githubClientId, githubClientSecret } = getOAuthConfig();
  return Boolean(githubClientId && githubClientSecret);
}

function redirectToFrontend(res, query = {}) {
  const { frontendUrl } = getOAuthConfig();
  const url = new URL(frontendUrl);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  res.redirect(url.toString());
}

async function fetchGithubAccessToken(code) {
  const { githubClientId, githubClientSecret, githubCallbackUrl } =
    getOAuthConfig();

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: githubClientId,
      client_secret: githubClientSecret,
      code,
      redirect_uri: githubCallbackUrl,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange GitHub OAuth code");
  }

  const data = await response.json();
  if (!data.access_token) {
    throw new Error(data.error_description || "GitHub access token missing");
  }

  return data.access_token;
}

async function fetchGithubProfile(accessToken) {
  const [userResponse, emailResponse, reposResponse] = await Promise.all([
    fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    }),
    fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    }),
    fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    }),
  ]);

  if (!userResponse.ok) {
    throw new Error("Failed to fetch GitHub user profile");
  }

  const githubUser = await userResponse.json();
  const githubEmails = emailResponse.ok ? await emailResponse.json() : [];
  const githubRepos = reposResponse.ok ? await reposResponse.json() : [];

  const primaryEmail = Array.isArray(githubEmails)
    ? githubEmails.find((email) => email.primary)?.email || githubEmails[0]?.email || ""
    : "";

  const languageTotals = {};
  const activityDays = new Set();
  const normalizedRepos = Array.isArray(githubRepos)
    ? githubRepos.map((repo) => {
        const language = repo.language || "Unknown";
        languageTotals[language] = (languageTotals[language] || 0) + 1;

        if (repo.pushed_at) {
          activityDays.add(new Date(repo.pushed_at).toISOString().slice(0, 10));
        }

        return {
          repo_id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          html_url: repo.html_url,
          description: repo.description || "",
          language: repo.language || "",
          stargazers_count: repo.stargazers_count || 0,
          forks_count: repo.forks_count || 0,
          open_issues_count: repo.open_issues_count || 0,
          default_branch: repo.default_branch || "main",
          updated_at: repo.updated_at ? new Date(repo.updated_at) : null,
          pushed_at: repo.pushed_at ? new Date(repo.pushed_at) : null,
        };
      })
    : [];

  const technologies = Object.keys(languageTotals).filter((name) => name && name !== "Unknown");

  return {
    githubUser,
    primaryEmail,
    normalizedRepos,
    languageTotals,
    technologies,
    activityDays: Array.from(activityDays),
  };
}

async function issueAndStoreTokens(user) {
  const token = issueAccessToken(user.toJSON());
  const refreshToken = createRefreshTokenValue();
  const expiresAt = getRefreshTokenExpiry();

  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expires_at: expiresAt,
  });

  return { token, refreshToken };
}

export async function startGithubAuth(_req, res) {
  if (!hasGithubOAuthConfig()) {
    return res.status(503).json({
      error: "GitHub OAuth is not configured",
      required: ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET", "GITHUB_CALLBACK_URL"],
    });
  }

  const { githubClientId, githubCallbackUrl } = getOAuthConfig();

  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.searchParams.set("client_id", githubClientId);
  authUrl.searchParams.set("redirect_uri", githubCallbackUrl);
  authUrl.searchParams.set("scope", "read:user user:email repo");

  return res.redirect(authUrl.toString());
}

export async function githubCallback(req, res) {
  if (!hasGithubOAuthConfig()) {
    return redirectToFrontend(res, { error: "github_oauth_not_configured" });
  }

  const { code } = req.query;
  if (!code) {
    return redirectToFrontend(res, { error: "github_oauth_code_missing" });
  }

  try {
    const githubAccessToken = await fetchGithubAccessToken(code);
    const { githubUser, primaryEmail, normalizedRepos, languageTotals, technologies, activityDays } =
      await fetchGithubProfile(githubAccessToken);

    const update = {
      github_id: githubUser.id,
      github_username: githubUser.login,
      name: githubUser.name || githubUser.login,
      email: primaryEmail || "",
      avatar_url: githubUser.avatar_url || "",
      github_access_token: githubAccessToken,
      github_data: {
        followers: githubUser.followers || 0,
        following: githubUser.following || 0,
        public_gists: githubUser.public_gists || 0,
      },
      technologies,
      total_public_repos: githubUser.public_repos || normalizedRepos.length,
      languages: languageTotals,
      repositories: normalizedRepos,
      activity_days: activityDays,
      last_active_at: new Date(),
    };

    const user = await User.findOneAndUpdate(
      { github_id: githubUser.id },
      { $set: update, $setOnInsert: { profession: "", linkedin_username: null, x_username: null } },
      { upsert: true, new: true, runValidators: true }
    );

    const { token, refreshToken } = await issueAndStoreTokens(user);
    return redirectToFrontend(res, { token, refreshToken });
  } catch (error) {
    console.error("GitHub OAuth callback failed:", error.message);
    return redirectToFrontend(res, { error: "github_auth_failed" });
  }
}

export async function logout(req, res) {
  const refreshToken = req.body?.refreshToken || req.query?.refreshToken;

  if (refreshToken) {
    await RefreshToken.findOneAndUpdate({ token: refreshToken }, { $set: { revoked_at: new Date() } });
  }

  if (req.user?.id) {
    await RefreshToken.updateMany({ user: req.user.id, revoked_at: null }, { $set: { revoked_at: new Date() } });
  }

  const expectsJson = req.headers.accept?.includes("application/json") || req.query?.json === "true";
  if (expectsJson) {
    return res.json({ success: true, message: "Logged out" });
  }

  return redirectToFrontend(res);
}

export async function refreshAccessToken(req, res) {
  if (req.user) {
    const token = issueAccessToken(req.user.toJSON());
    return res.json({ token });
  }

  const refreshToken = req.body?.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({ error: "refreshToken is required" });
  }

  const tokenRecord = await RefreshToken.findOne({ token: refreshToken });
  if (!tokenRecord || tokenRecord.revoked_at || tokenRecord.expires_at < new Date()) {
    return res.status(403).json({ error: "Invalid or expired refresh token" });
  }

  const user = await User.findById(tokenRecord.user);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const token = issueAccessToken(user.toJSON());
  return res.json({ token });
}
