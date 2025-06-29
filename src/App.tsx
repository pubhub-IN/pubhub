import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/useAuth";
import Hero from "./components/Hero";
import Onboarding from "./components/Onboarding";
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

function Layout() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-16 md:ml-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden">
        <Outlet />
        {/* AI Assistant is globally accessible on all authenticated pages */}
        <AIAssistant user={user || undefined} />
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center flex flex-col items-center">
        <div className="w-12 h-12 bg-green-500 rounded-xl mb-4 animate-pulse"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

function AuthenticatedRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route
        path="/onboarding"
        element={
          <Onboarding
            user={user}
            onComplete={(updatedUser) => {
              // Update the user data without full page reload
              window.dispatchEvent(
                new CustomEvent("user-updated", { detail: updatedUser })
              );
            }}
          />
        }
      />
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
        <Route path="/job-hunting" element={<JobHunting/>} />
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
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function PublicRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
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
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicRoutes />} />
        <Route path="/*" element={<AuthenticatedRoutes />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
