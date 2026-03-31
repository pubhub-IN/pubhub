// JWT Authentication utilities for the frontend
import { buildApiUrl, API_ENDPOINTS } from "../config/api";

const TOKEN_KEY = "working_one_jwt_token";

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
  linkedin_username?: string;
  x_username?: string;
  created_at: string;
  updated_at: string;
}

class AuthService {
  private decodeJwtPayload(token: string): Record<string, unknown> | null {
    try {
      const parts = token.split(".");
      if (parts.length < 2 || !parts[1]) {
        return null;
      }

      // JWT uses base64url encoding.
      let payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const padding = payload.length % 4;
      if (padding > 0) {
        payload += "=".repeat(4 - padding);
      }

      return JSON.parse(atob(payload)) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

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

    const payload = this.decodeJwtPayload(token) as { exp?: number } | null;
    if (!payload) {
      this.removeToken();
      return false;
    }

    const currentTime = Date.now() / 1000;

    // Check if token is expired
    if (payload.exp && payload.exp < currentTime) {
      this.removeToken();
      return false;
    }

    return true;
  }

  // Get authorization headers for API requests
  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
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

  // Make an authenticated GET request
  async get<T = unknown>(endpoint: string): Promise<T> {
    const url = buildApiUrl(endpoint);
    const response = await this.fetchWithAuth(url);

    if (!response.ok) {
      throw new Error(`GET request failed: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }
  // Make an authenticated POST request
  async post<T = unknown>(
    endpoint: string,
    data: Record<string, unknown>
  ): Promise<T> {
    const url = buildApiUrl(endpoint);
    const response = await this.fetchWithAuth(url, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`POST request failed: ${response.status}`);
    }

    return response.json();
  }

  // Make an authenticated PUT request
  async put<T = unknown>(
    endpoint: string,
    data: Record<string, unknown>
  ): Promise<T> {
    const url = buildApiUrl(endpoint);
    const response = await this.fetchWithAuth(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`PUT request failed: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  // Get current user data
  async getCurrentUser(): Promise<AuthUser | null> {
    if (!this.isAuthenticated()) {
      return null;
    }

    try {
      const response = await this.fetchWithAuth(
        buildApiUrl(API_ENDPOINTS.USER_PROFILE)
      );

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
        buildApiUrl(API_ENDPOINTS.REFRESH_TOKEN),
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
  logout(): void {
    this.removeToken();
    window.location.href = buildApiUrl(API_ENDPOINTS.LOGOUT);
  }

  // Handle token from URL (OAuth callback)
  handleTokenFromUrl(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    if (error) {
      console.error("Authentication error:", error);
      return false;
    }

    if (token) {
      this.setToken(token);
      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      return true;
    }

    return false;
  }

  // Get token expiration date
  getTokenExpiration(): Date | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = this.decodeJwtPayload(token) as { exp?: number } | null;
    return payload?.exp ? new Date(payload.exp * 1000) : null;
  }

  // Update user technologies
  async updateTechnologies(technologies: string[]): Promise<AuthUser | null> {
    try {
      const response = await this.put(API_ENDPOINTS.USER_TECHNOLOGIES, {
        technologies,
      });

      if (response) {
        // Dispatch user-updated event
        window.dispatchEvent(
          new CustomEvent("user-updated", { detail: response })
        );
        return response as AuthUser;
      }
      return null;
    } catch (error) {
      console.error("Error updating technologies:", error);
      throw error;
    }
  }

  // Update user profession
  async updateProfession(profession: string): Promise<AuthUser | null> {
    try {
      const response = await this.put(API_ENDPOINTS.USER_PROFESSION, {
        profession,
      });

      if (response) {
        // Dispatch user-updated event
        window.dispatchEvent(
          new CustomEvent("user-updated", { detail: response })
        );
        return response as AuthUser;
      }
      return null;
    } catch (error) {
      console.error("Error updating profession:", error);
      throw error;
    }
  }

  // Update social links
  async updateSocialLinks(data: {
    linkedin_username?: string;
    x_username?: string;
  }): Promise<AuthUser | null> {
    try {
      const response = await this.put(API_ENDPOINTS.USER_SOCIAL_LINKS, data);

      if (response) {
        // Dispatch user-updated event
        window.dispatchEvent(
          new CustomEvent("user-updated", { detail: response })
        );
        return response as AuthUser;
      }
      return null;
    } catch (error) {
      console.error("Error updating social links:", error);
      throw error;
    }
  }

  // Send connection request
  async sendConnectionRequest(
    recipientUsername: string,
    message?: string
  ): Promise<any> {
    try {
      const response = await this.post(API_ENDPOINTS.CONNECTION_REQUESTS, {
        recipientUsername,
        message,
      });

      return response;
    } catch (error) {
      console.error("Error sending connection request:", error);
      throw error;
    }
  }

  // Accept connection request
  async acceptConnectionRequest(requestId: string): Promise<any> {
    try {
      const response = await this.put(
        `${API_ENDPOINTS.CONNECTION_REQUESTS}/${requestId}/accept`,
        {}
      );

      return response;
    } catch (error) {
      console.error("Error accepting connection request:", error);
      throw error;
    }
  }

  // Reject connection request
  async rejectConnectionRequest(requestId: string): Promise<any> {
    try {
      const response = await this.put(
        `${API_ENDPOINTS.CONNECTION_REQUESTS}/${requestId}/reject`,
        {}
      );

      return response;
    } catch (error) {
      console.error("Error rejecting connection request:", error);
      throw error;
    }
  }

  // Get connections
  async getConnections(): Promise<any> {
    try {
      const response = await this.get(API_ENDPOINTS.CONNECTIONS);
      return response;
    } catch (error) {
      console.error("Error fetching connections:", error);
      throw error;
    }
  }

  // Get connection requests
  async getConnectionRequests(): Promise<any> {
    try {
      const response = await this.get(API_ENDPOINTS.CONNECTION_REQUESTS);
      return response;
    } catch (error) {
      console.error("Error fetching connection requests:", error);
      throw error;
    }
  }

  // Get connection status with another user
  async getConnectionStatus(username: string): Promise<any> {
    try {
      const response = await this.get(
        `${API_ENDPOINTS.CONNECTION_STATUS}/${username}`
      );
      return response;
    } catch (error) {
      console.error("Error fetching connection status:", error);
      throw error;
    }
  }

  // Remove connection
  async removeConnection(connectionId: string): Promise<any> {
    try {
      const response = await fetch(
        buildApiUrl(`${API_ENDPOINTS.CONNECTIONS}/${connectionId}`),
        {
          method: "DELETE",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`DELETE request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error removing connection:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export for backward compatibility
export default authService;
