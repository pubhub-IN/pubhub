import { useState } from "react";
import { AuthUser, authService } from "../lib/auth-jwt";
import { LogOut, Github, Linkedin, Twitter, Check, X } from "lucide-react";
import GitHubCalendar from "react-github-calendar";

export default function AccountPage({
  user,
  onLogout,
}: {
  user: AuthUser;
  onLogout: () => void;
}) {
  const [linkedinUsername, setLinkedinUsername] = useState(
    user.linkedin_username || ""
  );
  const [xUsername, setXUsername] = useState(user.x_username || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  const handleSaveSocialLinks = async () => {
    try {
      setIsSaving(true);
      setSaveError("");

      await authService.updateSocialLinks({
        linkedin_username: linkedinUsername.trim() || undefined,
        x_username: xUsername.trim() || undefined,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating social links:", error);
      setSaveError("Failed to update social links. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex items-center mb-8 gap-4">
        <img
          src={user.avatar_url}
          alt={user.name || user.github_username}
          className="w-24 h-24 rounded-lg"
        />
        <div className="flex items-left flex-col">
          <h1 className="text-2xl font-bold">
            {user.name || user.github_username}
          </h1>
          <div className="text-gray-500">{user.email}</div>

          {/* Social Links */}
          <div className="flex mt-2 space-x-3">
            <a
              href={`https://github.com/${user.github_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-green-200 dark:bg-green-700 text-green-700 dark:text-green-200 hover:bg-green-300 dark:hover:bg-green-600"
              title="GitHub Profile"
            >
              <Github size={20} />
            </a>

            {user.linkedin_username && (
              <a
                href={`https://linkedin.com/in/${user.linkedin_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800"
                title="LinkedIn Profile"
              >
                <Linkedin size={20} />
              </a>
            )}

            {user.x_username && (
              <a
                href={`https://x.com/${user.x_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-green-900 dark:bg-green-700 text-white hover:bg-green-800 dark:hover:bg-green-600"
                title="X (Twitter) Profile"
              >
                <Twitter size={20} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
        <div className="mb-2">
          <span className="font-semibold">Languages:</span>{" "}
          {Object.keys(user.languages || {}).length}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Account Created:</span>{" "}
          {new Date(user.created_at).toLocaleDateString()}
        </div>

        {/* Social Links Form */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Social Profiles</h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="linkedin"
                className="block text-sm font-medium mb-1"
              >
                LinkedIn Username
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                  linkedin.com/in/
                </span>
                <input
                  type="text"
                  id="linkedin"
                  value={linkedinUsername}
                  onChange={(e) => setLinkedinUsername(e.target.value)}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  placeholder="username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="x-twitter"
                className="block text-sm font-medium mb-1"
              >
                X (Twitter) Username
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                  x.com/
                </span>
                <input
                  type="text"
                  id="x-twitter"
                  value={xUsername}
                  onChange={(e) => setXUsername(e.target.value)}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  placeholder="username"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              {saveSuccess && (
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <Check className="w-4 h-4 mr-1" /> Saved successfully
                </div>
              )}

              {saveError && (
                <div className="flex items-center text-red-600 dark:text-red-400">
                  <X className="w-4 h-4 mr-1" /> {saveError}
                </div>
              )}

              <button
                onClick={handleSaveSocialLinks}
                disabled={isSaving}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>

        {/* GitHub Calendar */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">GitHub Contributions</h2>
          <div className="overflow-x-auto">
            {" "}
            <GitHubCalendar
              username={user.github_username}
              colorScheme="dark"
              blockRadius={2}
              blockSize={12}
              blockMargin={4}
              fontSize={12}
              style={{
                minWidth: "100%",
                maxWidth: "100%",
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800 font-semibold"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
        <button className="px-4 py-2 rounded-lg bg-green-200 dark:bg-green-700 text-green-700 dark:text-green-200 font-semibold">
          Delete Account
        </button>
      </div>
    </div>
  );
}
