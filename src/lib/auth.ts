const API_BASE_URL = "https://pubhub-server.onrender.com";

export const authService = {
  // Get current user
  async getCurrentUser() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      console.log("Auth response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Auth response data:", data);
        return data;
      }

      if (response.status === 401) {
        console.log("User not authenticated");
        return null;
      }

      const error = await response.text();
      console.error("Auth error response:", error);
      return null;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
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
    window.location.href = `${API_BASE_URL}/auth/logout`;
  },
};
