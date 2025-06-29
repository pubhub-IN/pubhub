import { useEffect, useState } from "react";
import {
  Share2,
  ExternalLink,
  Loader2,
  RefreshCcw,
  ArrowLeft,
} from "lucide-react";
import { authService, AuthUser } from "../lib/auth-jwt";
import { useNavigate } from "react-router-dom";
import { ShareModal } from "../components/ShareModal";
import { Particles } from "../components/magicui/particles";

interface Repo {
  id: number;
  name: string;
  html_url: string;
  updated_at: string;
  description: string | null;
}

interface ShareOnSocialsProps {
  user: AuthUser;
}

export default function ShareOnSocials({ user }: ShareOnSocialsProps) {
  const navigate = useNavigate();
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

    if (user) {
      fetchUserRepositories();
    }
  }, [user]);

  // Function to handle generating a post for a repository
  const handleGeneratePost = async (repoId: number, repoName: string) => {
    try {
      setGeneratingPost(repoId.toString());

      // Simulate API call to generate content
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate a fake post (in a real app, this would call an AI API)
      const platforms = [
        "Twitter",
        "LinkedIn",
        "Facebook",
        "Instagram",
        "Dev.to",
      ];
      const randomPlatform =
        platforms[Math.floor(Math.random() * platforms.length)];

      let generatedText = "";

      switch (randomPlatform) {
        case "Twitter":
          generatedText = `🚀 Just pushed updates to my ${repoName} project! Check it out on GitHub and let me know what you think. #OpenSource #Coding #Developer`;
          break;
        case "LinkedIn":
          generatedText = `I'm excited to share updates to my project "${repoName}"! I've been working on improving the functionality and adding new features. Take a look at the repository and feel free to contribute or provide feedback. #OpenSource #SoftwareDevelopment #Coding`;
          break;
        case "Facebook":
          generatedText = `Just updated my coding project "${repoName}" with some cool new features! If you're into programming, check it out and let me know your thoughts.`;
          break;
        case "Instagram":
          generatedText = `💻 Developer life: Late nights working on "${repoName}". Just pushed some updates that I'm really proud of. Check out my GitHub to see what I've been building! #CodingLife #DevLife`;
          break;
        case "Dev.to":
          generatedText = `# ${repoName} Project Update\n\nI've been working on some exciting new features for my open source project. Here's what's new:\n\n- Improved performance\n- Better documentation\n- New API endpoints\n\nCheck out the repo and feel free to contribute!`;
          break;
        default:
          generatedText = `Check out my latest updates to ${repoName} on GitHub!`;
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

  const handleRefresh = () => {
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

    fetchUserRepositories();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center mr-4 p-2 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
              aria-label="Back to dashboard"
              title="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-800 dark:to-purple-900 rounded-lg flex items-center justify-center shadow-md shadow-purple-100/50 dark:shadow-purple-900/30 ring-1 ring-purple-200/50 dark:ring-purple-700/50 mr-3">
                <Share2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              Share on Socials
            </h1>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Description */}
        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-400">
            Generate shareable posts about your GitHub repositories for various
            social platforms. Share your projects with friends, colleagues, and
            the world.
          </p>
        </div>

        {/* Main content */}
        <div className="bg-gradient-to-br from-white via-purple-50/30 to-white dark:from-gray-800 dark:via-purple-900/10 dark:to-gray-800 p-6 rounded-xl shadow-sm border border-purple-100/50 dark:border-purple-900/30 card-shadow-purple relative">
          {/* Particle effects */}
          <Particles
            className="absolute inset-0 z-0"
            quantity={20}
            color={isDarkMode ? "#9333ea" : "#a855f7"}
            ease={100}
            size={0.8}
          />
          <div className="relative z-10">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Your GitHub Repositories
            </h2>

            <div className="space-y-6">
              {reposLoading ? (
                <div className="flex items-center justify-center h-32 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading your repositories...</span>
                  </div>
                </div>
              ) : reposError ? (
                <div className="bg-green-100 dark:bg-green-900/20 p-6 rounded-lg text-center my-4">
                  <p className="text-green-700 dark:text-green-400">{reposError}</p>
                  <button
                    onClick={handleRefresh}
                    className="mt-4 px-4 py-2 bg-green-200 dark:bg-green-800 rounded-md text-green-700 dark:text-green-200 hover:bg-green-300 dark:hover:bg-green-700 transition-colors"
                  >
                    Try again
                  </button>
                </div>
              ) : userRepos.length === 0 ? (
                <div className="bg-purple-50/50 dark:bg-purple-900/20 p-6 rounded-lg text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    No repositories found. Create some repositories on GitHub
                    first!
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {userRepos.map((repo) => (
                    <div
                      key={repo.id}
                      className="bg-white dark:bg-gray-800/50 p-6 rounded-lg border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="font-medium text-lg text-gray-900 dark:text-gray-100 flex items-center gap-1">
                            {repo.name}
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`Open ${repo.name} on GitHub`}
                              className="inline-flex text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Last updated:{" "}
                            {new Date(repo.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {generatedContent[repo.id] ? (
                        <div
                          className="mt-3 mb-4 bg-green-50/50 dark:bg-green-900/20 p-4 rounded-md text-sm text-gray-700 dark:text-gray-300 border border-green-100/50 dark:border-green-800/30 cursor-pointer hover:bg-green-100/50 dark:hover:bg-green-900/30"
                          onClick={() =>
                            handleOpenShareModal(repo.id, repo.name)
                          }
                        >
                          <div className="flex justify-between items-center">
                            <div className="line-clamp-3">
                              {generatedContent[repo.id]}
                            </div>
                            <Share2 className="w-4 h-4 text-green-500 dark:text-green-400 ml-3 flex-shrink-0" />
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 mb-4 bg-gray-50 dark:bg-gray-800/70 p-4 rounded-md text-sm text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700 italic">
                          Generate a post to share this repository on social
                          media.
                        </div>
                      )}

                      <div className="flex justify-center">
                        {!generatingPost ||
                        generatingPost !== repo.id.toString() ? (
                          <button
                            onClick={() =>
                              handleGeneratePost(repo.id, repo.name)
                            }
                            disabled={generatingPost !== null}
                            className="w-full px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md font-medium hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {generatedContent[repo.id] ? (
                              <>
                                <RefreshCcw className="w-4 h-4" />
                                Regenerate Post
                              </>
                            ) : (
                              <>
                                <Share2 className="w-4 h-4" />
                                Generate Post
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="w-full px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md font-medium opacity-70 cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Generating...
                          </button>
                        )}
                      </div>

                      {generatedContent[repo.id] && (
                        <button
                          onClick={() =>
                            handleOpenShareModal(repo.id, repo.name)
                          }
                          className="w-full mt-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md font-medium hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors flex items-center justify-center gap-2"
                        >
                          <Share2 className="w-4 h-4" />
                          Share Now
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
