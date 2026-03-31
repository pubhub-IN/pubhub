import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { authService, AuthUser } from "./auth-jwt";
import { buildApiUrl, API_ENDPOINTS } from "../config/api";

const PENDING_ONBOARDING_KEY = "pending_onboarding_profile";

type PendingOnboardingProfile = {
  profession?: string;
  technologies?: string[];
};

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = authService.isAuthenticated();

  const getUserFromTokenFallback = (): AuthUser | null => {
    const token = authService.getToken();
    if (!token) {
      return null;
    }

    try {
      const payloadPart = token.split(".")[1] || "";
      let base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
      const padding = base64.length % 4;
      if (padding > 0) {
        base64 += "=".repeat(4 - padding);
      }

      const decoded = JSON.parse(atob(base64)) as Partial<AuthUser>;

      if (!decoded?.id || !decoded?.github_username) {
        return null;
      }

      return {
        id: String(decoded.id),
        github_id: Number(decoded.github_id || 0),
        github_username: String(decoded.github_username),
        name: decoded.name || "",
        email: decoded.email || "",
        avatar_url: decoded.avatar_url || "",
        profession: decoded.profession || "",
        technologies: Array.isArray(decoded.technologies)
          ? decoded.technologies
          : [],
        total_public_repos: Number(decoded.total_public_repos || 0),
        total_commits: Number(decoded.total_commits || 0),
        languages: decoded.languages || {},
        github_data: decoded.github_data || {},
        linkedin_username: decoded.linkedin_username,
        x_username: decoded.x_username,
        created_at:
          decoded.created_at || new Date().toISOString(),
        updated_at:
          decoded.updated_at || new Date().toISOString(),
      };
    } catch (error) {
      console.error("Failed to build user from token fallback:", error);
      return null;
    }
  };

  const applyPendingOnboardingProfile = async (
    userData: AuthUser
  ): Promise<AuthUser> => {
    try {
      const raw = sessionStorage.getItem(PENDING_ONBOARDING_KEY);
      if (!raw) {
        return userData;
      }

      const pending = JSON.parse(raw) as PendingOnboardingProfile;
      let updatedUser = userData;

      if (
        typeof pending.profession === "string" &&
        pending.profession.trim() &&
        pending.profession.trim() !== (updatedUser.profession || "")
      ) {
        const professionUpdate = await authService.updateProfession(
          pending.profession.trim()
        );
        if (professionUpdate) {
          updatedUser = professionUpdate;
        }
      }

      if (
        Array.isArray(pending.technologies) &&
        pending.technologies.length > 0
      ) {
        const normalizedTechnologies = pending.technologies
          .filter((item) => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean);

        if (normalizedTechnologies.length > 0) {
          const technologiesUpdate = await authService.updateTechnologies(
            normalizedTechnologies
          );
          if (technologiesUpdate) {
            updatedUser = technologiesUpdate;
          }
        }
      }

      sessionStorage.removeItem(PENDING_ONBOARDING_KEY);
      return updatedUser;
    } catch (error) {
      console.error("Failed to apply pending onboarding profile:", error);
      return userData;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      // Handle token from URL (OAuth callback)
      const tokenFromOAuth = authService.handleTokenFromUrl();

      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();

          if (userData) {
            const hydratedUser = tokenFromOAuth
              ? await applyPendingOnboardingProfile(userData)
              : userData;

            setUser(hydratedUser);

            if (tokenFromOAuth) {
              setLoading(false);
              window.location.replace("/dashboard");
              return;
            }
          } else {
            const fallbackUser = getUserFromTokenFallback();
            setUser(fallbackUser);

            if (tokenFromOAuth && fallbackUser) {
              setLoading(false);
              window.location.replace("/dashboard");
              return;
            }
          }
        } catch (error) {
          console.error("Failed to get current user:", error);
          const fallbackUser = getUserFromTokenFallback();
          setUser(fallbackUser);

          if (tokenFromOAuth && fallbackUser) {
            setLoading(false);
            window.location.replace("/dashboard");
            return;
          }
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // Listen for user-updated events to update the user state without full page reload
  useEffect(() => {
    const handleUserUpdated = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        setUser(customEvent.detail);
      }
    };

    window.addEventListener("user-updated", handleUserUpdated as EventListener);

    return () => {
      window.removeEventListener(
        "user-updated",
        handleUserUpdated as EventListener
      );
    };
  }, []);

  const login = () => {
    window.location.href = buildApiUrl(API_ENDPOINTS.GITHUB_AUTH);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    window.location.href = "/";
  };

  const refreshToken = async (): Promise<boolean> => {
    const success = await authService.refreshToken();
    if (success && authService.isAuthenticated()) {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    }
    return success;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshToken,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Custom hook for protected routes
export function useRequireAuth() {
  const { user, loading, login } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      login();
    }
  }, [user, loading, login]);

  return { user, loading };
}
