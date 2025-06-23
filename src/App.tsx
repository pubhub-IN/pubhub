import { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    Outlet,
} from "react-router-dom";
import { authService } from "./lib/auth";
import { type User } from "./lib/supabase";
import Hero from "./components/Hero";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import HackathonsPage from "./pages/HackathonsPage";
import OpenSourceReposPage from "./pages/OpenSourceReposPage";
import AccountPage from "./pages/AccountPage";
import StartLearning from "./pages/StartLearning";
import CourseDetailPage from "./pages/learning/CourseDetailPage";
import LessonPage from "./pages/learning/LessonPage";
import CourseCompletionPage from "./pages/learning/CourseCompletionPage";
import Youtube from "./pages/Youtube";
function Layout() {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 ml-16 md:ml-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <Outlet />
            </div>
        </div>
    );
}

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuth = async () => {
        try {
            // Check URL parameters for auth errors
            const urlParams = new URLSearchParams(window.location.search);
            const error = urlParams.get("error");

            if (error === "auth_failed") {
                setAuthError("Authentication failed. Please try again.");
                setIsAuthenticated(false);
                // Clean up the URL
                window.history.replaceState({}, "", window.location.pathname);
                setIsLoading(false);
                return;
            }

            // Only check with server, no localStorage
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
                setIsAuthenticated(true);
                setAuthError(null);
                setIsLoading(false);
                return;
            } else {
                setUser(null);
                setIsAuthenticated(false);
                setIsLoading(false);
                setAuthError(null);
            }
        } catch (error) {
            console.error("Auth check error:", error);
            setUser(null);
            setIsAuthenticated(false);
            // Handle specific error types
            if (error instanceof Error) {
                if (
                    error.message.includes("Connection timeout") ||
                    error.message.includes("Unable to connect")
                ) {
                    setAuthError(
                        `${error.message}. The page will automatically retry when the server is available.`
                    );
                    // Retry after 5 seconds
                    setTimeout(() => {
                        checkAuth();
                    }, 5000);
                    return;
                }
                setAuthError(error.message);
            } else {
                setAuthError(
                    "Failed to verify authentication status. Please try again."
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    if (isLoading || authError) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center flex flex-col items-center">
                    {isLoading ? (
                        <>
                            <div className="w-12 h-12 bg-green-500 rounded-xl mb-4 animate-pulse"></div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Loading...
                            </p>
                        </>
                    ) : authError ? (
                        <>
                            <div className="w-12 h-12 bg-red-500 rounded-xl mb-4"></div>
                            <p className="text-red-600 dark:text-red-400 mb-4 max-w-md text-center">
                                {authError}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setAuthError(null);
                                        setIsLoading(true);
                                        checkAuth();
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    Retry
                                </button>
                                <a
                                    href="/"
                                    className="text-green-600 dark:text-green-400 hover:underline px-4 py-2"
                                >
                                    Return to Home
                                </a>
                            </div>
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
                    element={
                        isAuthenticated && user ? (
                            <Navigate to="/dashboard" />
                        ) : (
                            <Hero />
                        )
                    }
                />
                <Route
                    path="/onboarding"
                    element={
                        isAuthenticated && user ? (
                            <Onboarding user={user} onComplete={setUser} />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
                {/* Dashboard and sidebar-wrapped routes - Protected Routes */}
                <Route
                    element={
                        isAuthenticated && user ? (
                            <Layout />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                >
                    <Route
                        path="dashboard"
                        element={<Dashboard user={user!} />}
                    />
                    <Route
                        path="hackathons"
                        element={<HackathonsPage user={user!} />}
                    />
                    <Route
                        path="open-source"
                        element={<OpenSourceReposPage user={user!} />}
                    />
                    <Route 
                        path="start-learning"
                        element={ <StartLearning user={user!}/> }
                    />
                    <Route
                        path="youtube"
                        element={ <Youtube/> }
                    />
                    <Route 
                        path="courses/:courseId"
                        element={<CourseDetailPage user={user!} />}
                    />
                    <Route 
                        path="courses/:courseId/:moduleId/:lessonId"
                        element={<LessonPage user={user!} />}
                    />
                    <Route 
                        path="courses/:courseId/complete"
                        element={<CourseCompletionPage user={user!} />}
                    />
                    <Route
                        path="account"
                        element={
                            <AccountPage
                                user={user!}
                                onLogout={() => {
                                    setUser(null);
                                    setIsAuthenticated(false);
                                    authService.logout();
                                }}
                            />
                        }
                    />
                </Route>
                {/* Catch all route for unmatched paths */}
                <Route
                    path="*"
                    element={
                        <Navigate
                            to={isAuthenticated && user ? "/dashboard" : "/"}
                            replace
                        />
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
