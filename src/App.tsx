import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/useAuth";
import Hero from "./components/Hero.tsx";
import Onboarding from "./components/Onboarding";
import GitHubScreen from "./components/GitHubScreen";
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import { AIAssistant } from "./components/AIAssistant";
import HackathonsPage from "./pages/HackathonsPage";
import OpenSourceReposPage from "./pages/OpenSourceReposPage";
import AccountPage from "./pages/AccountPage";
import StartLearning from "./pages/StartLearning";
import CourseDetailPage from "./pages/learning/CourseDetailPage";
import LessonPage from "./pages/learning/LessonPage";
import CourseCompletionPage from "./pages/learning/CourseCompletionPage";
import Youtube from "./pages/Youtube";
import ShareOnSocials from "./pages/ShareOnSocials";
import PeoplePage from "./pages/PeoplePage";
import ProfilePage from "./pages/ProfilePage";
import ConnectionsPage from "./pages/ConnectionsPage";
import JobHunting from "./pages/JobHunting.tsx";
import NotFoundPage from "./pages/NotFoundPage";
import { Loader as LoadingScreen } from "./components/loader";
import "lenis/dist/lenis.css";
import Lenis from "lenis";

const PROTECTED_PATH_PREFIXES = [
  "/dashboard",
  "/hackathons",
  "/open-source",
  "/start-learning",
  "/courses",
  "/youtube",
  "/share-socials",
  "/job-hunting",
  "/account",
  "/people",
  "/profile",
  "/connections",
];

function isKnownProtectedPath(pathname: string) {
  return PROTECTED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function Layout() {
  // const { user } = useAuth();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-16 md:ml-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden">
        <Outlet />
        {/* AI Assistant is globally accessible on all authenticated pages */}
        {/* <AIAssistant user={user || undefined} /> */}
      </div>
    </div>
  );
}

function AuthenticatedRoutes() {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log("AuthenticatedRoutes render:", { loading, user: user?.github_username, path: location.pathname });

  if (loading) {
    console.log("AuthenticatedRoutes: still loading");
    return null;  // Show nothing while loading
  }

  if (!user) {
    // Check if there's a token in localStorage (might be a mock token we just set)
    const token = localStorage.getItem("working_one_jwt_token");
    if (token) {
      console.log("Token exists but user not yet set, returning null to wait for auth context update");
      return null;  // Wait for the token to be processed
    }
    
    console.log("AuthenticatedRoutes: user is null and no token, path is", location.pathname);
    if (isKnownProtectedPath(location.pathname)) {
      console.log("Known protected path, redirecting to home");
      return <Navigate to="/" replace />;
    }

    return <NotFoundPage />;
  }

  console.log("AuthenticatedRoutes: user is authenticated as", user.github_username);
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/hackathons" element={<HackathonsPage user={user} />} />
        <Route
          path="/open-source"
          element={<OpenSourceReposPage user={user} />}
        />
        <Route path="/start-learning" element={<StartLearning user={user} />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
        <Route
          path="/courses/:courseId/:moduleId/:lessonId"
          element={<LessonPage user={user} />}
        />
        <Route
          path="/courses/:courseId/complete"
          element={<CourseCompletionPage user={user} />}
        />
        <Route path="/youtube" element={<Youtube />} />
        <Route path="/share-socials" element={<ShareOnSocials user={user} />} />
        <Route path="/job-hunting" element={<JobHunting />} />
        <Route
          path="/account"
          element={
            <AccountPage
              user={user}
              onLogout={() => (window.location.href = "/")}
            />
          }
        />
        <Route path="/people" element={<PeoplePage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/connections" element={<ConnectionsPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function OnboardingRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <Onboarding
      user={user || undefined}
      onComplete={(updatedUser) => {
        // Update the user data without full page reload
        window.dispatchEvent(
          new CustomEvent("user-updated", { detail: updatedUser })
        );
      }}
    />
  );
}

function PublicRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    // Check if user has completed onboarding
    const hasCompletedOnboarding =
      user.technologies && user.technologies.length > 0;
    return (
      <Navigate
        to={hasCompletedOnboarding ? "/dashboard" : "/onboarding"}
        replace
      />
    );
  }

  return <Hero />;
}

function AppRoutes() {
  const [minLoadingTimePassed, setMinLoadingTimePassed] = useState(false);
  const [timerProgress, setTimerProgress] = useState(0);
  const { loading: authLoading } = useAuth();
  const MIN_LOADING_MS = 2000;

  useEffect(() => {
    const start = Date.now();
    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - start;
      const nextProgress = Math.min((elapsed / MIN_LOADING_MS) * 100, 100);
      setTimerProgress(nextProgress);
    }, 50);

    const timer = setTimeout(() => {
      setMinLoadingTimePassed(true);
    }, MIN_LOADING_MS);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, []);

  const loaderProgress = authLoading ? Math.min(timerProgress, 95) : timerProgress;

  if (!minLoadingTimePassed || authLoading) {
    return <LoadingScreen progress={loaderProgress} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicRoutes />} />
        <Route path="/onboarding" element={<OnboardingRoute />} />
        <Route path="/github-screen" element={<GitHubScreen />} />
        <Route path="/*" element={<AuthenticatedRoutes />} />
      </Routes>
    </Router>
  );
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      prevent: (node: HTMLElement) => Boolean(node.closest("[data-lenis-prevent='true']")),
    });

    let rafId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
