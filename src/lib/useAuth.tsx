import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { authService, AuthUser } from "./auth-jwt";
import { buildApiUrl, API_ENDPOINTS } from "../config/api";

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

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      // Handle token from URL (OAuth callback)
      authService.handleTokenFromUrl();

      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Failed to get current user:", error);
          setUser(null);
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
