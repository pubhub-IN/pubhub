import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Github,
  Mail,
  Briefcase,
  MessageCircle,
  ExternalLink,
  Star,
  GitFork,
} from "lucide-react";
import GitHubCalendar from "react-github-calendar";

// Helper function to format dates in a user-friendly way
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return "yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }
};

// Repository type definition
interface Repository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

// Repository data from GitHub API
interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

// Function to fetch repositories directly from GitHub API as a fallback
const fetchGitHubRepos = async (
  githubUsername: string
): Promise<Repository[]> => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=updated&direction=desc&per_page=10`
    );
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    const data = await response.json();
    return data.map((repo: GitHubRepo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      html_url: repo.html_url,
      description: repo.description,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      updated_at: repo.updated_at,
    }));
  } catch (error) {
    console.error("Error fetching from GitHub API:", error);
    return [];
  }
};

export default function ProfilePage() {
  const { username } = useParams();
  // Define a User interface to replace 'any'
  interface User {
    github_username: string;
    name?: string;
    avatar_url: string;
    email?: string;
    profession?: string;
    created_at?: string;
    languages?: Record<string, number>;
    [key: string]: unknown; // For other properties we might not know about
  }

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [repoCount, setRepoCount] = useState<number | null>(null);
  const [activeDays, setActiveDays] = useState<number | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setError("");
    fetch(`/api/user/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setError("User not found");
        setLoading(false);
      });
  }, [username]);

  useEffect(() => {
    if (!user) return;

    // Fetch repo count from backend (uses server's GitHub token)
    fetch(`/api/user/${user.github_username}/repo-count`)
      .then((res) => res.json())
      .then((data) =>
        setRepoCount(typeof data.repoCount === "number" ? data.repoCount : null)
      )
      .catch(() => setRepoCount(null));

    // Fetch active days for this user (custom endpoint by username)
    fetch(`/api/user/${user.github_username}/active-days`)
      .then((res) => (res.ok ? res.json() : { activeDays: null }))
      .then((data) =>
        setActiveDays(
          typeof data.activeDays === "number" ? data.activeDays : null
        )
      )
      .catch(() => setActiveDays(null));

    // Fetch recent repositories
    setReposLoading(true);

    // Try to fetch from our backend API first
    fetch(`/api/user/${user.github_username}/repositories`)
      .then((res) => {
        if (!res.ok) {
          // If endpoint returns 404 or other error, throw to use fallback
          throw new Error(`API endpoint not available (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.repositories && Array.isArray(data.repositories)) {
          // Sort by updated_at (most recent first) and take top 10
          const sortedRepos = data.repositories
            .sort(
              (a: Repository, b: Repository) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
            )
            .slice(0, 10);
          setRepositories(sortedRepos);
        }
        setReposLoading(false);
      })
      .catch(async (error) => {
        console.error("Error fetching repositories from backend:", error);

        // Use fallback: fetch directly from GitHub API
        try {
          setUsingFallback(true);
          const fallbackRepos = await fetchGitHubRepos(user.github_username);
          setRepositories(fallbackRepos);
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
        } finally {
          setReposLoading(false);
        }
      });
  }, [user]);

  // Note: Repository scrollbar styling is now in index.css

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto p-8 flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex items-center gap-6 mb-8">
        <img
          src={user.avatar_url}
          alt={user.name || user.github_username}
          className="w-24 h-24 rounded-full border-4 border-[#39D353] dark:border-[#39d353] shadow-lg"
        />
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">
            {user.name || user.github_username}
          </h1>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Mail className="w-4 h-4" />
            <span>{user.email ? user.email : "N/A"}</span>
          </div>
          <a
            href={`https://github.com/${user.github_username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 dark:text-blue-300 hover:underline mt-1"
          >
            <Github className="w-4 h-4" />@{user.github_username}
          </a>
          {user.profession && (
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 mt-1">
              <Briefcase className="w-4 h-4" />
              <span>{user.profession ? user.profession : "N/A"}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
        <div className="mb-2">
          <div className="flex gap-2 mb-4">
            <span className="font-semibold">Joined at:</span>
            <div className="mt-1 text-sm">
              {user.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : "-"}
            </div>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Languages:</span>
            <ul className="mt-1 ml-2 list-none text-sm text-gray-700 dark:text-gray-300 flex flex-wrap">
              {user.languages && Object.keys(user.languages).length > 0 ? (
                Object.entries(user.languages).map(([lang, count]) => (
                  <li
                    key={lang}
                    className="bg-[#39d35380] rounded-full mr-2 mt-2 py-1 px-2 flex items-center justify-center text-white text-xs"
                  >
                    {lang}{" "}
                    <span className="text-xs text-white ml-1">
                      ({Number(count)}%)
                    </span>
                  </li>
                ))
              ) : (
                <li>No languages found</li>
              )}
            </ul>
          </div>
          <div className="flex gap-10 mt-6">
            <div>
              <span className="font-semibold">Repositories</span>
              <div className="mt-1 text-lg">
                {typeof repoCount === "number" ? repoCount : "-"}
              </div>
            </div>
            <div>
              <span className="font-semibold">Active Days</span>
              <div className="mt-1 text-lg">
                {activeDays !== null ? activeDays : "-"}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Repositories Section */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">
            Recent Repositories
            {usingFallback && (
              <span className="ml-2 text-xs text-gray-500 font-normal">
                (via GitHub API)
              </span>
            )}
          </h2>
          {reposLoading ? (
            <div className="text-center py-4">Loading repositories...</div>
          ) : repositories.length > 0 ? (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 repositories-container">
              {repositories.map((repo) => (
                <div
                  key={repo.id}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center"
                      >
                        {repo.name}
                        <ExternalLink className="w-3.5 h-3.5 ml-1 inline" />
                      </a>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                        {repo.description || "No description provided"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400 flex-wrap gap-3">
                    {repo.language && (
                      <span className="flex items-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#39D353] mr-1.5"></span>
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center">
                      <Star className="w-3.5 h-3.5 mr-1" />
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center">
                      <GitFork className="w-3.5 h-3.5 mr-1" />
                      {repo.forks_count}
                    </span>
                    <span>Updated {formatDate(repo.updated_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              No repositories found
            </div>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">GitHub Contributions</h2>
          <div className="overflow-x-auto">
            <GitHubCalendar
              username={user.github_username}
              colorScheme="dark"
              blockRadius={2}
              blockSize={12}
              blockMargin={4}
              fontSize={12}
              style={{ minWidth: "100%", maxWidth: "100%" }}
            />
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
            title="Send a message"
          >
            <MessageCircle className="w-5 h-5" />
            Message
          </button>
        </div>
      </div>
    </div>
  );
}
