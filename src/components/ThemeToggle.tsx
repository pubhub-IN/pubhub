import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "../lib/useTheme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-md ${
          theme === "light"
            ? "bg-white text-black shadow-sm"
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        }`}
        title="Light mode"
      >
        <Sun className="w-5 h-5" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-md ${
          theme === "dark"
            ? "bg-gray-700 text-white shadow-sm"
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        }`}
        title="Dark mode"
      >
        <Moon className="w-5 h-5" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-2 rounded-md ${
          theme === "system"
            ? "bg-white dark:bg-gray-700 shadow-sm"
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        }`}
        title="System preference"
      >
        <Monitor className="w-5 h-5" />
      </button>
    </div>
  );
}
