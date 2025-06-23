import { useEffect, useState } from "react";
import { authService, AuthUser } from "../lib/auth-jwt";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface TechRepoSection {
  technology: string;
  repositories: GitHubRepo[];
  count?: number;
  error?: string;
}

const API_BASE_URL = "http://localhost:3000";

const motivations = [
  "Code for change, contribute today!",
  "Your PR can power the world.",
  "Open source needs your spark.",
  "Start small, impact big!",
  "Build. Share. Inspire.",
  "Every commit counts!",
  "Change the world, one repo at a time.",
  "Contribute. Collaborate. Create.",
  "Your code matters.",
  "Give back through Git.",
  "Hack for good, code for all.",
  "Real heroes commit.",
  "Share code, shape futures.",
  "Empower others, open your code.",
  "Fork it. Fix it. PR it.",
  "Be proud, contribute loud!",
  "You + Open Source = 🔥",
  "Push kindness with code.",
  "Code freely, help globally.",
  "Make GitHub proud today!",
];

function getWish() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export default function OpenSourceReposPage({ user }: { user: AuthUser }) {
  const [motivation, setMotivation] = useState("");
  const [techSections, setTechSections] = useState<TechRepoSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCached, setIsCached] = useState(false);
  const SECTIONS_PER_PAGE = 5;

  useEffect(() => {
    setMotivation(motivations[Math.floor(Math.random() * motivations.length)]);

    const fetchRepositories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await authService.fetchWithAuth(
          `${API_BASE_URL}/api/user/repositories`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch repositories: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setTechSections(data.technologies);
          setIsCached(data.cached || false);
        } else {
          throw new Error(data.message || "Failed to fetch repositories");
        }
      } catch (err) {
        console.error("Error fetching repositories:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load repositories"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRepositories();
  }, [user]);

  // Calculate pagination
  const totalPages = Math.ceil(techSections.length / SECTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * SECTIONS_PER_PAGE;
  const endIndex = startIndex + SECTIONS_PER_PAGE;
  const currentSections = techSections.slice(startIndex, endIndex);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // Check if any sections have rate limit errors
  const hasRateLimitErrors = techSections.some(
    (section) => section.error && section.error.includes("Rate limit")
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-8 pl-16 transition-all">
        <h1 className="text-3xl font-bold mb-2">
          {getWish()} {user.name || user.github_username}! {motivation}
        </h1>{" "}
        <h2 className="text-lg text-gray-600 dark:text-gray-300 mb-2">
          We've arranged some amazing Open Source Repositories based on your
          technologies.
          {isCached && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              📋 Cached Data
            </span>
          )}
        </h2>{" "}
        <h2 className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          We believe open source contributions are a great proof of your
          knowledge.
        </h2>
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200 text-sm">❌ {error}</p>
          </div>
        )}
        {hasRateLimitErrors && !loading && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                🔄 Some repositories couldn't load due to rate limits. Data is
                cached and will refresh automatically.
              </p>
              <button
                onClick={handleRefresh}
                className="ml-4 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-200 dark:hover:bg-blue-700 transition-colors"
              >
                Refresh Now
              </button>
            </div>
          </div>
        )}
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Loading repositories from your tech stack...
          </div>
        ) : (
          <div className="space-y-12">
            {/* Technology Sections */}
            {currentSections.map((section) => (
              <div key={section.technology} className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {section.technology} Repositories
                  </h3>
                  <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                    {section.repositories.length} repos
                  </span>
                </div>{" "}
                {section.error ? (
                  <div className="text-center py-8">
                    <div
                      className={`p-4 rounded-lg ${
                        section.error.includes("Rate limit")
                          ? "bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800"
                          : "bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800"
                      }`}
                    >
                      <p
                        className={`text-sm ${
                          section.error.includes("Rate limit")
                            ? "text-yellow-800 dark:text-yellow-200"
                            : "text-red-800 dark:text-red-200"
                        }`}
                      >
                        {section.error.includes("Rate limit") ? (
                          <>
                            ⏱️ Rate limit reached for {section.technology}{" "}
                            repositories.
                            <br />
                            <span className="text-xs">
                              Data will be available shortly. Please refresh the
                              page in a few minutes.
                            </span>
                          </>
                        ) : (
                          <>
                            ❌ Failed to load {section.technology} repositories:{" "}
                            {section.error}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                ) : section.repositories.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No {section.technology} repositories found
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {section.repositories.map((repo) => (
                      <a
                        key={repo.id}
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group border border-green-200 dark:border-green-800 rounded-xl bg-white dark:bg-gray-900 shadow hover:shadow-lg transition overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <img
                              src={repo.owner.avatar_url}
                              alt={repo.owner.login}
                              className="w-12 h-12 rounded-full"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-lg mb-1 text-gray-900 dark:text-white truncate">
                                {repo.name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                by {repo.owner.login}
                              </p>
                            </div>
                          </div>

                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                            {repo.description || "No description available"}
                          </p>

                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                ⭐ {repo.stargazers_count}
                              </span>
                              <span className="flex items-center gap-1">
                                🍴 {repo.forks_count}
                              </span>
                              <span className="flex items-center gap-1">
                                📝 {repo.open_issues_count}
                              </span>
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}{" "}
            {/* Pagination Controls */}
            {techSections.length > SECTIONS_PER_PAGE && (
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 mt-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing{" "}
                  <span className="font-medium">
                    {startIndex + 1}-{Math.min(endIndex, techSections.length)}
                  </span>{" "}
                  of <span className="font-medium">{techSections.length}</span>{" "}
                  technologies
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    ← Previous
                  </button>

                  <div className="hidden sm:flex space-x-1">
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let page;
                      if (totalPages <= 7) {
                        page = i + 1;
                      } else if (currentPage <= 4) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 3) {
                        page = totalPages - 6 + i;
                      } else {
                        page = currentPage - 3 + i;
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            currentPage === page
                              ? "bg-green-600 text-white shadow-sm"
                              : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <div className="sm:hidden">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}