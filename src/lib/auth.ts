const API_BASE_URL = "http://localhost:3000";

// Session refresh interval (25 minutes)
const SESSION_REFRESH_INTERVAL = 25 * 60 * 1000;
let refreshTimer: NodeJS.Timeout | null = null;

// Utility to check if server is running
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      cache: "no-cache",
    });
    return response.ok;
  } catch {
    return false;
  }
};

// Function to refresh session periodically
const refreshSession = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/refresh-session`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    });
    return response.ok;
  } catch (error) {
    console.error("Session refresh failed:", error);
    return false;
  }
};

// Start session refresh timer
const startSessionRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }

  refreshTimer = setInterval(async () => {
    const refreshed = await refreshSession();
    if (!refreshed) {
      console.warn("Session refresh failed - user may need to re-authenticate");
      stopSessionRefresh();
    }
  }, SESSION_REFRESH_INTERVAL);
};

// Stop session refresh timer
const stopSessionRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
};

export const authService = {
  // Get current user
  async getCurrentUser() {
    try {
      // Check if server is reachable first
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${API_BASE_URL}/api/user`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache", // Prevent caching of auth state
        },
        signal: controller.signal,
        cache: "no-store", // Force fresh request
      });

      clearTimeout(timeoutId);
      console.log("Auth response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Auth response data:", data);

        // Start session refresh when user is authenticated
        startSessionRefresh();

        return data;
      }

      if (response.status === 401) {
        console.log("User not authenticated (401)");
        stopSessionRefresh();
        return null;
      }

      if (response.status === 403) {
        console.log("User forbidden (403)");
        stopSessionRefresh();
        return null;
      }

      // Handle other error statuses
      const errorText = await response.text();
      console.error(`Auth error ${response.status}:`, errorText);
      stopSessionRefresh();
      return null;
    } catch (error) {
      stopSessionRefresh();

      if (error instanceof DOMException && error.name === "AbortError") {
        console.error(
          "Request timeout - server may not be running on port 3000"
        );
        throw new Error(
          "Connection timeout: Please ensure the server is running"
        );
      }

      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        console.error(
          "Network error - server may not be running or CORS issue"
        );
        throw new Error(
          "Unable to connect to server: Please ensure the backend server is running on port 3000"
        );
      }

      console.error("Error fetching current user:", error);
      throw error;
    }
  },

  // Update user technologies
  async updateTechnologies(technologies: string[]) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/technologies`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ technologies }),
      });

      if (!response.ok) {
        throw new Error("Failed to update technologies");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating technologies:", error);
      throw error;
    }
  },

  // Get GitHub auth URL
  getGitHubAuthUrl() {
    return `${API_BASE_URL}/auth/github`;
  },

  // Logout
  logout() {
    stopSessionRefresh();
    window.location.href = `${API_BASE_URL}/auth/logout`;
  },

  // Manual session refresh
  async refreshSession() {
    return await refreshSession();
  },

  // Check if session is active
  async isSessionActive() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/session-status`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  },
};