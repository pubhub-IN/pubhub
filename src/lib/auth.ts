const API_BASE_URL = "http://localhost:3001";

export const authService = {
  // Get current user
  async getCurrentUser() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user`, {
        credentials: "include",
      });

      if (response.ok) {
        return await response.json();
      }

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
