import { User } from "../lib/supabase";
import { LogOut } from "lucide-react";
import GitHubCalendar from "react-github-calendar";

export default function AccountPage({
    user,
    onLogout,
}: {
    user: User;
    onLogout: () => void;
}) {
    return (
        <div className="max-w-xl mx-auto p-8 flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div className="flex flex-col items-center mb-8">
                <img
                    src={user.avatar_url}
                    alt={user.name || user.github_username}
                    className="w-24 h-24 rounded-full mb-4"
                />
                <h1 className="text-2xl font-bold mb-1">
                    {user.name || user.github_username}
                </h1>
                <div className="text-gray-500 mb-1">{user.email}</div>
                <div className="text-xs text-gray-400">User ID: {user.id}</div>
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
            </div>

            <div className="mt-auto flex flex-col gap-3">
                <button
                    onClick={onLogout}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800 font-semibold"
                >
                    <LogOut className="w-5 h-5" /> Logout
                </button>
                <button className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold">
                    Delete Account
                </button>
            </div>
        </div>
    );
}
