import crypto from "node:crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "7d";
const REFRESH_TOKEN_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS || "30");

export function buildUserClaims(user) {
  return {
    id: user.id,
    github_id: user.github_id || 0,
    github_username: user.github_username,
    name: user.name || "",
    email: user.email || "",
    avatar_url: user.avatar_url || "",
    profession: user.profession || "",
    technologies: Array.isArray(user.technologies) ? user.technologies : [],
    total_public_repos: user.total_public_repos || 0,
    total_commits: user.total_commits || 0,
    languages: user.languages || {},
    github_data: user.github_data || {},
    linkedin_username: user.linkedin_username || null,
    x_username: user.x_username || null,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

export function issueAccessToken(user) {
  const payload = buildUserClaims(user);
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function createRefreshTokenValue() {
  return crypto.randomBytes(48).toString("hex");
}

export function getRefreshTokenExpiry() {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + REFRESH_TOKEN_TTL_DAYS);
  return expiry;
}

export function extractBearerToken(headerValue) {
  if (!headerValue || !headerValue.startsWith("Bearer ")) {
    return null;
  }

  return headerValue.slice(7);
}
