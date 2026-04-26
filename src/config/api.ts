// API Configuration for both development and production
const isDevelopment = import.meta.env.DEV;
const useProductionBackend =
  import.meta.env.VITE_USE_PRODUCTION_BACKEND === "true";

const DEFAULT_PRODUCTION_API_URL = "https://workingone.onrender.com";

const sanitizeApiBaseUrl = (rawUrl: string | undefined, fallback: string): string => {
  const candidate = (rawUrl || "").trim();
  const urlToParse = candidate || fallback;

  try {
    const parsed = new URL(urlToParse);
    const normalizedPath = parsed.pathname.replace(/\/+$/, "");
    const hasExtraPath = normalizedPath !== "" && normalizedPath !== "/";

    if (hasExtraPath) {
      console.warn(
        `[api-config] VITE_API_URL should be origin-only. Received '${urlToParse}'. Using '${parsed.origin}' instead.`
      );
    }

    return parsed.origin;
  } catch {
    console.warn(
      `[api-config] Invalid VITE_API_URL '${urlToParse}'. Falling back to '${fallback}'.`
    );
    return fallback;
  }
};

// Production backend URL (will be set by environment variable)
const PRODUCTION_API_URL = sanitizeApiBaseUrl(
  import.meta.env.VITE_API_URL,
  DEFAULT_PRODUCTION_API_URL
);

// Development backend URL
const DEVELOPMENT_API_URL = "http://localhost:3000";

// Export the appropriate API URL based on environment and configuration
export const API_BASE_URL =
  isDevelopment && !useProductionBackend
    ? DEVELOPMENT_API_URL
    : PRODUCTION_API_URL;

// CORS configuration for production
export const CORS_CONFIG = {
  origin:
    isDevelopment && !useProductionBackend
      ? "https://workingone.vercel.app"
      : import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173",
  credentials: true,
};

// Environment check utility
export const isProduction = () => !isDevelopment || useProductionBackend;

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  GITHUB_AUTH: "/auth/github",
  GITHUB_CALLBACK: "/auth/github/callback",
  SKIP_AUTH: "/auth/skip",
  LOGOUT: "/auth/logout",

  // User endpoints
  USER_PROFILE: "/api/user",
  USER_REPOS: "/api/user/own-repositories",
  USER_ACTIVE_DAYS: "/api/user/active-days",
  USER_TECHNOLOGIES: "/api/user/technologies",
  USER_PROFESSION: "/api/user/profession",
  USER_SOCIAL_LINKS: "/api/user/social-links",
  REFRESH_TOKEN: "/api/user/refresh-token",
  SESSION_STATUS: "/api/user/session-status",

  // Connection endpoints
  CONNECTIONS: "/api/connections",
  CONNECTION_REQUESTS: "/api/connection-requests",
  CONNECTION_STATUS: "/api/connections/status",

  // Hackathon endpoints
  HACKATHONS: "/api/hackathons",

  // Job endpoints
  JOBS: "/api/jobs",

  // Health check
  HEALTH: "/health",
} as const;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  const base = API_BASE_URL.replace(/\/+$/, "");
  const normalizedEndpoint = endpoint.replace(/^\/+/, "");
  return `${base}/${normalizedEndpoint}`;
};

// Helper function to check if API is available
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(buildApiUrl(API_ENDPOINTS.HEALTH), {
      method: "GET",
      cache: "no-cache",
    });
    return response.ok;
  } catch {
    return false;
  }
};
