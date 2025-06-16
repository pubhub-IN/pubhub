import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { authService } from "./lib/auth";
import { type User } from "./lib/supabase";
import Hero from "./components/Hero";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check URL parameters for auth errors
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get("error");

        if (error === "auth_failed") {
          setAuthError("Authentication failed. Please try again.");
          // Clean up the URL
          window.history.replaceState({}, "", window.location.pathname);
          setIsLoading(false);
          return;
        }

        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setAuthError(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setAuthError(
          "Failed to verify authentication status. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);
  if (isLoading || authError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          {isLoading ? (
            <>
              <div className="w-12 h-12 bg-green-500 rounded-xl mb-4 animate-pulse"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </>
          ) : authError ? (
            <>
              <div className="w-12 h-12 bg-red-500 rounded-xl mb-4"></div>
              <p className="text-red-600 dark:text-red-400 mb-4">{authError}</p>
              <a
                href="/"
                className="text-green-600 dark:text-green-400 hover:underline"
              >
                Return to Home
              </a>
            </>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Hero />}
        />
        <Route
          path="/onboarding"
          element={
            user ? (
              <Onboarding user={user} onComplete={setUser} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
