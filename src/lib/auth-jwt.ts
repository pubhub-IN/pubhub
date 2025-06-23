// JWT Authentication utilities for the frontendAdd commentMore actions

const TOKEN_KEY = "pubhub_jwt_token";
const API_BASE_URL = "http://localhost:3000";

export interface AuthUser {
  id: string;
  github_id: number;
  github_username: string;
  name?: string;
  email?: string;
  avatar_url?: string;
  profession?: string;
  technologies: string[];
  total_public_repos: number;
  total_commits: number;
  languages: Record<string, number>;
  github_data: Record<string, unknown>;
  access_token?: string;
  created_at: string;
  updated_at: string;
}

class AuthService {
  // Store JWT token in localStorage
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  // Get JWT token from localStorage
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Remove JWT token from localStorage
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  // Check if user is authenticated (has valid token)
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Decode JWT payload (without verification, just to check expiration)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;

      // Check if token is expired
      if (payload.exp && payload.exp < currentTime) {
        this.removeToken();
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking token validity:", error);
      this.removeToken();
      return false;
    }
  }

  // Get authorization headers for API requests
  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    console.log('Getting auth headers. Token exists:', !!token);
    if (token) {
      console.log('Token preview:', token.substring(0, 20) + '...');
    }
    return token
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      : {
          "Content-Type": "application/json",
        };
  }

  // Make authenticated API request
  async fetchWithAuth(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const headers = this.getAuthHeaders();

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    // If token is invalid/expired, redirect to login
    if (response.status === 401 || response.status === 403) {
      this.logout();
      window.location.href = "/?error=session_expired";
    }

    return response;
  }

  // Get current user data
  async getCurrentUser(): Promise<AuthUser | null> {
    if (!this.isAuthenticated()) {
      return null;
    }

    try {
      const response = await this.fetchWithAuth(`${API_BASE_URL}/api/user`);

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Failed to fetch user: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      this.logout();
      return null;
    }
  }

  // Refresh JWT token
  async refreshToken(): Promise<boolean> {
    if (!this.isAuthenticated()) {
      return false;
    }

    try {
      const response = await this.fetchWithAuth(
        `${API_BASE_URL}/api/user/refresh-token`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const data = await response.json();
        this.setToken(data.token);
        return true;
      } else {
        this.logout();
        return false;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      this.logout();
      return false;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Notify server about logout (optional)
      if (this.isAuthenticated()) {
        await this.fetchWithAuth(`${API_BASE_URL}/api/user/logout`, {
          method: "POST",
        });
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      this.removeToken();
    }
  }

  // Handle token from URL (after OAuth callback)
  handleTokenFromUrl(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      this.setToken(token);
      // Clean URL
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      return true;
    }

    return false;
  }

  // Get token expiration time
  getTokenExpiration(): Date | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp ? new Date(payload.exp * 1000) : null;
    } catch {
      return null;
    }
  }

  // Update user technologies
  async updateTechnologies(technologies: string[]): Promise<AuthUser | null> {
    if (!this.isAuthenticated()) {
      throw new Error("Not authenticated");
    }

    try {
      const response = await this.fetchWithAuth(
        `${API_BASE_URL}/api/user/technologies`,
        {
          method: "PUT",
          body: JSON.stringify({ technologies }),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        return updatedUser;
      } else {
        throw new Error(`Failed to update technologies: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating technologies:", error);
      throw error;
    }
  }

  // Update user profession
  async updateProfession(profession: string): Promise<AuthUser | null> {
    if (!this.isAuthenticated()) {
      throw new Error("Not authenticated");
    }

    try {
      const response = await this.fetchWithAuth(
        `${API_BASE_URL}/api/user/profession`,
        {
          method: "PUT",
          body: JSON.stringify({ profession }),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        return updatedUser;
      } else {
        throw new Error(`Failed to update profession: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating profession:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export for backward compatibility
export default authService;