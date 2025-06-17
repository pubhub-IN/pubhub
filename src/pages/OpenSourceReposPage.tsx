import { useEffect, useState } from "react";
import { User } from "../lib/supabase";

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

const motivations = [
  "Keep pushing forward!",
  "You're doing great!",
  "Every day is a new opportunity!",
  "Stay curious and keep building!",
  "Your hard work will pay off!",
  "Dream big, build bigger!",
  "Innovation starts with you!",
  "Make today count!",
  "Success is a journey!",
  "Keep learning, keep growing!",
];

function getWish() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export default function OpenSourceReposPage({ user }: { user: User }) {
  const [motivation, setMotivation] = useState("");
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMotivation(motivations[Math.floor(Math.random() * motivations.length)]);
    fetch(
      "https://api.github.com/search/repositories?q=react+language:JavaScript+stars:>=100+is:public&sort=stars&order=desc&per_page=12"
    )
      .then((res) => res.json())
      .then((data) => setRepos(data.items || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 pl-16 transition-all">
      <h1 className="text-3xl font-bold mb-2">
        {getWish()} {user.name || user.github_username}! {motivation}
      </h1>
      <h2 className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        We've arranged some amazing Open Source Repositories for you to
        contribute.
      </h2>
      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          Loading repositories...
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-green-200 dark:border-green-800 rounded-xl bg-white dark:bg-gray-900 shadow hover:shadow-lg transition flex flex-col md:flex-row items-stretch overflow-hidden"
            >
              {" "}
              <div className="flex-shrink-0 flex items-center justify-center p-6 md:p-8">
                <img
                  src={repo.owner.avatar_url}
                  alt={repo.owner.login}
                  className="w-32 h-32 rounded object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col md:flex-row md:items-center p-6 md:p-8 gap-6">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-2xl mb-2 text-gray-900 dark:text-white">
                    {repo.name}
                  </h3>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
                      ★ {repo.stargazers_count} stars
                    </span>
                    <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                      by {repo.owner.login}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
                    {repo.description}
                  </div>
                </div>
                <div className="flex flex-col gap-2 min-w-[220px] md:border-l md:pl-8 border-gray-200 dark:border-gray-800">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="inline-block bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200 dark:border-blue-800">
                      Open Source
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 text-sm mb-1">
                    Language: {repo.language}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 text-sm mb-1">
                    Forks: {repo.forks_count}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 text-sm mb-1">
                    Issues: {repo.open_issues_count}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
