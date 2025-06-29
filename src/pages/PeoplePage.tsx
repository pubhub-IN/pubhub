import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users as UsersIcon } from "lucide-react";

interface User {
  id: number;
  github_username: string;
  name?: string;
  avatar_url?: string;
  profession?: string;
  email?: string;
}

export default function PeoplePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load users");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <span className="inline-block bg-purple-100 text-purple-700 rounded-lg p-2">
          <UsersIcon className="w-6 h-6" />
        </span>
        People
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition cursor-pointer p-5 flex flex-col gap-2 border border-gray-100 dark:border-gray-700 hover:border-purple-400"
            onClick={() => navigate(`/profile/${user.github_username}`)}
            title={user.name || user.github_username}
          >
            <div className="flex items-center gap-3 mb-2">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name || user.github_username}
                  className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-xl font-bold text-purple-700">
                  {user.name?.[0] || user.github_username?.[0] || "U"}
                </div>
              )}
              <div>
                <div className="font-semibold text-blue-700 dark:text-blue-300 truncate max-w-[140px]">
                  {user.name || user.github_username}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  @{user.github_username}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 truncate">
              {user.profession || "No profession set"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
