import { useEffect, useState } from "react";
import {
  LogOut,
  GitCommit,
  Code,
  TrendingUp,
  Calendar,
  Flame,
  Book,
  Share2,
  ExternalLink,
  Loader2,
  RefreshCcw,
  Edit2,
} from "lucide-react";
import { authService } from "../lib/auth-jwt";
import { ThemeToggle } from "./ThemeToggle";
import { Particles } from "./magicui/particles";
import { ShareModal } from "./ShareModal";
import { LanguageChart } from "./LanguageChart";
import type { AuthUser } from "../lib/auth-jwt";
import { useNavigate, useLocation } from "react-router-dom";

interface DashboardProps {
  user: AuthUser;
}

export default function Dashboard({ user }: DashboardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hackathons, setHackathons] = useState(0);
  const [activeDays, setActiveDays] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(user);
  // Effect to refresh user data when navigating from onboarding
  useEffect(() => {
    // Check if we need to refresh user data
    if (location.state?.refreshUser) {
      const refreshData = async () => {
        try {
          const freshUserData = await authService.getCurrentUser();
          if (freshUserData) {
            setCurrentUser(freshUserData);
            // Clear the state to avoid repeated refreshes
            navigate(location.pathname, { replace: true, state: {} });
          }
        } catch (error) {
          console.error("Failed to refresh user data:", error);
        }
      };

      refreshData();
    }
  }, [location.state, navigate, location.pathname]);

  // Always use the most current user data
  const userData = currentUser || user;

  // Repositories state
  interface Repo {
    id: number;
    name: string;
    html_url: string;
    updated_at: string;
    // Add other fields as needed
  }
  const [userRepos, setUserRepos] = useState<Repo[]>([]);
  const [reposLoading, setReposLoading] = useState(true);
  const [reposError, setReposError] = useState<string | null>(null);
  const [generatingPost, setGeneratingPost] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<{
    [key: string]: string;
  }>({});

  // Share modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareModalRepo, setShareModalRepo] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Check if we're in dark mode
  const isDarkMode = document.documentElement.classList.contains("dark");

  useEffect(() => {
    const fetchActiveDays = async () => {
      try {
        const response = await authService.fetchWithAuth(
          "http://localhost:3000/api/user/active-days"
        );
        if (!response.ok) throw new Error(`${response.status}`);
        const data = await response.json();
        setActiveDays(data.activeDays);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchUserRepositories = async () => {
      try {
        setReposLoading(true);
        setReposError(null);
        const response = await authService.fetchWithAuth(
          "http://localhost:3000/api/user/own-repositories"
        );
        if (!response.ok) throw new Error(`${response.status}`);
        const data = await response.json();
        setUserRepos(data.repositories);
      } catch (error) {
        console.error("Error fetching repositories:", error);
        setReposError(
          error instanceof Error ? error.message : "Failed to load repositories"
        );
      } finally {
        setReposLoading(false);
      }
    };

    if (userData) {
      fetchActiveDays();
      fetchUserRepositories();
      setIsLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    setHackathons(Math.floor(Math.random() * 6)); // 0-5
  }, []);

  // No longer need the language colors array as it's defined in the LanguageChart component

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = "/"; // Redirect to home page
  };

  // Function to handle generating a post for a repository
  const handleGeneratePost = async (repoId: number, repoName: string) => {
    try {
      setGeneratingPost(repoId.toString());

      // Simulate API call to generate content
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate a fake post (in a real app, this would call an AI API)
      const platforms = ["Twitter", "LinkedIn"];
      const randomPlatform =
        platforms[Math.floor(Math.random() * platforms.length)];

      let generatedText = "";
      if (randomPlatform === "Twitter") {
        generatedText = `🚀 Just pushed updates to my ${repoName} project! Check it out on GitHub and let me know what you think. #OpenSource #Coding #Developer`;
      } else {
        generatedText = `I'm excited to share updates to my project "${repoName}"! I've been working on improving the functionality and adding new features. Take a look at the repository and feel free to contribute or provide feedback. #OpenSource #SoftwareDevelopment #Coding`;
      }

      // Store generated content
      const content = `${randomPlatform}: ${generatedText}`;
      setGeneratedContent((prev) => ({
        ...prev,
        [repoId]: content,
      }));

      // Open share modal
      setShareModalRepo({ id: repoId, name: repoName });
      setIsShareModalOpen(true);
    } catch (error) {
      console.error("Error generating post:", error);
    } finally {
      setGeneratingPost(null);
    }
  };

  // Handle opening share modal for existing content
  const handleOpenShareModal = (repoId: number, repoName: string) => {
    setShareModalRepo({ id: repoId, name: repoName });
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
    setShareModalRepo(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-500 rounded-xl mb-4 animate-pulse"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">PubHub</h1>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex flex-col gap-2">
                <div className="flex gap-4">
                  <div className="flex items-center bg-orange-50 dark:bg-orange-900 px-4 py-2 rounded-lg border border-orange-100 dark:border-orange-800">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200 mr-1">
                      Days Worked:
                    </span>
                    <Flame className="w-5 h-5 text-orange-500 mx-1" />
                    <span className="font-bold text-orange-600 dark:text-orange-300 mx-1">
                      {activeDays} /{" "}
                      {new Date(new Date().getFullYear(), 11, 31).getDate() ===
                      31
                        ? 366
                        : 365}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-[calc(100vh-200px)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-white via-green-50 to-white dark:from-gray-800 dark:via-green-900/20 dark:to-gray-800 p-6 rounded-xl card-shadow-green relative overflow-hidden border border-green-100/50 dark:border-green-900/30 hover:scale-[1.02] transition-transform duration-300">
                {/* Shiny effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-green-200/10 via-transparent to-green-100/20 dark:from-green-500/5 dark:via-transparent dark:to-green-300/10 z-0 opacity-70"></div>
                <Particles
                  className="absolute inset-0 z-0"
                  quantity={15}
                  color={isDarkMode ? "#22c55e" : "#4ade80"}
                  ease={80}
                  size={0.8}
                />
                <div className="flex items-center gap-3 mb-2 relative z-10">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-800 dark:to-green-900 rounded-lg flex items-center justify-center shadow-md shadow-green-100/50 dark:shadow-green-900/30 ring-1 ring-green-200/50 dark:ring-green-700/50">
                    <GitCommit className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Total Public Repositories
                  </h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 relative z-10">
                  {userData.total_public_repos || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 relative z-10">
                  On GitHub
                </p>
              </div>

              <div className="bg-gradient-to-br from-white via-blue-50 to-white dark:from-gray-800 dark:via-blue-900/20 dark:to-gray-800 p-6 rounded-xl card-shadow-blue relative overflow-hidden border border-blue-100/50 dark:border-blue-900/30 hover:scale-[1.02] transition-transform duration-300">
                {/* Shiny effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/10 via-transparent to-blue-100/20 dark:from-blue-500/5 dark:via-transparent dark:to-blue-300/10 z-0 opacity-70"></div>
                <Particles
                  className="absolute inset-0 z-0"
                  quantity={15}
                  color={isDarkMode ? "#3b82f6" : "#60a5fa"}
                  ease={80}
                  size={0.8}
                />
                <div className="flex items-center gap-3 mb-2 relative z-10">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-800 dark:to-blue-900 rounded-lg flex items-center justify-center shadow-md shadow-blue-100/50 dark:shadow-blue-900/30 ring-1 ring-blue-200/50 dark:ring-blue-700/50">
                    <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Languages
                  </h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 relative z-10">
                  {Object.keys(userData.languages || {}).length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 relative z-10">
                  Used in repos
                </p>
              </div>

              <div className="bg-gradient-to-br from-white via-purple-50 to-white dark:from-gray-800 dark:via-purple-900/20 dark:to-gray-800 p-6 rounded-xl card-shadow-purple relative overflow-hidden border border-purple-100/50 dark:border-purple-900/30 hover:scale-[1.02] transition-transform duration-300">
                {/* Shiny effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-200/10 via-transparent to-purple-100/20 dark:from-purple-500/5 dark:via-transparent dark:to-purple-300/10 z-0 opacity-70"></div>
                <Particles
                  className="absolute inset-0 z-0"
                  quantity={15}
                  color={isDarkMode ? "#9333ea" : "#a855f7"}
                  ease={80}
                  size={0.8}
                />
                <div className="flex items-center gap-3 mb-2 relative z-10">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-800 dark:to-purple-900 rounded-lg flex items-center justify-center shadow-md shadow-purple-100/50 dark:shadow-purple-900/30 ring-1 ring-purple-200/50 dark:ring-purple-700/50">
                    <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Technologies
                  </h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 relative z-10">
                  {userData.technologies?.length || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 relative z-10">
                  Learning/Working with
                </p>
              </div>

              <div className="bg-gradient-to-br from-white via-orange-50 to-white dark:from-gray-800 dark:via-orange-900/20 dark:to-gray-800 p-6 rounded-xl card-shadow-orange relative overflow-hidden border border-orange-100/50 dark:border-orange-900/30 hover:scale-[1.02] transition-transform duration-300">
                {/* Shiny effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-200/10 via-transparent to-orange-100/20 dark:from-orange-500/5 dark:via-transparent dark:to-orange-300/10 z-0 opacity-70"></div>
                <Particles
                  className="absolute inset-0 z-0"
                  quantity={15}
                  color={isDarkMode ? "#ea580c" : "#f97316"}
                  ease={80}
                  size={0.8}
                />
                <div className="flex items-center gap-3 mb-2 relative z-10">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-800 dark:to-orange-900 rounded-lg flex items-center justify-center shadow-md shadow-orange-100/50 dark:shadow-orange-900/30 ring-1 ring-orange-200/50 dark:ring-orange-700/50">
                    <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Active Days
                  </h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 relative z-10">
                  {activeDays}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 relative z-10">
                  Commits from Jan to{" "}
                  {(() => {
                    const now = new Date();
                    const prevMonth = new Date(
                      now.getFullYear(),
                      now.getMonth() - 1
                    );
                    return prevMonth.toLocaleString("default", {
                      month: "long",
                    });
                  })()}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Language Distribution - Doughnut Chart */}
              <div className="bg-gradient-to-br from-white via-blue-50/30 to-white dark:from-gray-800 dark:via-blue-900/10 dark:to-gray-800 p-6 rounded-xl shadow-sm border border-blue-100/50 dark:border-blue-900/30 card-shadow-blue card-full-height">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-800 dark:to-blue-900 rounded-lg flex items-center justify-center shadow-md shadow-blue-100/50 dark:shadow-blue-900/30 ring-1 ring-blue-200/50 dark:ring-blue-700/50 mr-2">
                    <Code className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  Language Distribution
                </h3>
                <div className="mt-4 relative h-72">
                  <LanguageChart languages={userData.languages || {}} />
                </div>
              </div>

              {/* Share on Socials Card */}
              <div className="bg-gradient-to-br from-white via-purple-50/30 to-white dark:from-gray-800 dark:via-purple-900/10 dark:to-gray-800 p-6 rounded-xl shadow-sm border border-purple-100/50 dark:border-purple-900/30 card-shadow-purple card-full-height">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-800 dark:to-purple-900 rounded-lg flex items-center justify-center shadow-md shadow-purple-100/50 dark:shadow-purple-900/30 ring-1 ring-purple-200/50 dark:ring-purple-700/50 mr-2">
                      <Share2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    Share on Socials
                  </h3>
                  <button
                    onClick={() => navigate("/share-socials")}
                    className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors"
                    aria-label="Go to Share on Socials page"
                    title="See all repositories"
                  >
                    See all
                  </button>
                </div>

                <div className="space-y-4 mt-6 max-h-[320px] overflow-y-auto pr-4">
                  {reposLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Loading your repositories...</span>
                      </div>
                    </div>
                  ) : reposError ? (
                    <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg text-center my-4">
                      <p className="text-red-700 dark:text-red-400">
                        {reposError}
                      </p>
                      <button
                        onClick={() => window.location.reload()}
                        className="mt-2 px-3 py-1 bg-green-200 dark:bg-green-800 rounded-md text-green-700 dark:text-green-200 text-sm hover:bg-green-300 dark:hover:bg-green-700 transition-colors"
                      >
                        Try again
                      </button>
                    </div>
                  ) : userRepos.length === 0 ? (
                    <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg text-center">
                      <p className="text-gray-600 dark:text-gray-400">
                        No repositories found
                      </p>
                    </div>
                  ) : (
                    userRepos.map((repo) => (
                      <div
                        key={repo.id}
                        className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700/50 shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1">
                              {repo.name}
                              <a
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`Open ${repo.name} on GitHub`}
                                className="inline-flex text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Last updated:{" "}
                              {new Date(repo.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                          {!generatedContent[repo.id] ? (
                            <button
                              onClick={() =>
                                handleGeneratePost(repo.id, repo.name)
                              }
                              disabled={generatingPost !== null}
                              className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md text-xs font-medium hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                              {generatingPost === repo.id.toString() ? (
                                <>
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>Generate</>
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleOpenShareModal(repo.id, repo.name)
                              }
                              className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md text-xs font-medium hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors flex items-center gap-1"
                            >
                              <Share2 className="w-3 h-3" />
                              Share
                            </button>
                          )}
                        </div>

                        {generatedContent[repo.id] && (
                          <div
                            className="mt-3 bg-green-50/50 dark:bg-green-900/20 p-3 rounded-md text-xs text-gray-700 dark:text-gray-300 border border-green-100/50 dark:border-green-800/30 cursor-pointer hover:bg-green-100/50 dark:hover:bg-green-900/30"
                            onClick={() =>
                              handleOpenShareModal(repo.id, repo.name)
                            }
                          >
                            <div className="flex justify-between items-center">
                              <div className="line-clamp-1">
                                {generatedContent[repo.id]}
                              </div>
                              <Share2 className="w-3.5 h-3.5 text-green-500 dark:text-green-400 ml-2 flex-shrink-0" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" />
                    Refresh repositories
                  </button>
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div className="bg-gradient-to-br from-white via-purple-50/30 to-white dark:from-gray-800 dark:via-purple-900/10 dark:to-gray-800 p-6 rounded-xl border border-purple-100/50 dark:border-purple-900/30 card-shadow-purple">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-800 dark:to-purple-900 rounded-lg flex items-center justify-center shadow-md shadow-purple-100/50 dark:shadow-purple-900/30 ring-1 ring-purple-200/50 dark:ring-purple-700/50 mr-2">
                    <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  Technologies You're Working With
                </h3>
                <button
                  onClick={() =>
                    navigate("/onboarding", {
                      state: {
                        editMode: true,
                        technologies: userData.technologies,
                        profession: userData.profession,
                      },
                    })
                  }
                  className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md text-xs font-medium hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors flex items-center gap-1"
                  aria-label="Edit technologies"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>
              {userData.technologies && userData.technologies.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-4">
                  {userData.technologies.map((tech: string, index: number) => {
                    const delayClass = `delay-${Math.min(index * 50, 950)}`;
                    return (
                      <span
                        key={tech}
                        className={`px-4 py-2 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 text-green-700 dark:text-green-100 rounded-lg text-sm font-medium border border-green-200/50 dark:border-green-700/50 shadow-sm animate-fade-in ${delayClass}`}
                      >
                        {tech}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-purple-50/50 dark:bg-purple-900/20 rounded-lg p-4 mt-4 text-center">
                  <p className="text-gray-600 dark:text-gray-400 flex flex-col items-center">
                    <TrendingUp className="w-6 h-6 text-purple-400 dark:text-purple-500 mb-2 opacity-70" />
                    No technologies selected yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Share Modal */}
      {shareModalRepo && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={handleCloseShareModal}
          repoName={shareModalRepo.name}
          content={generatedContent[shareModalRepo.id] || ""}
        />
      )}
    </div>
  );
}
