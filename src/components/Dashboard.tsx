import { useEffect, useState } from "react";
import {
  LogOut,
  GitCommit,
  Code,
  TrendingUp,
  Calendar,
  Flame,
  Info,
  Book,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { format, eachDayOfInterval, subDays } from "date-fns";
import { authService } from "../lib/auth";
import { ThemeToggle } from "./ThemeToggle";
import type { User } from "../lib/supabase";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface CommitData {
  date: string;
  commits: number;
}

interface DashboardProps {
  user: User & {
    total_public_repos?: number;
  };
}

export default function Dashboard({ user }: DashboardProps) {
  const [commitData, setCommitData] = useState<CommitData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [hackathons, setHackathons] = useState(0);

  // Check if we're in dark mode
  const isDarkMode = document.documentElement.classList.contains("dark");

  // Generate sample commit data for demonstration
  useEffect(() => {
    const generateCommitData = () => {
      const endDate = new Date();
      const startDate = subDays(endDate, 365);
      const days = eachDayOfInterval({ start: startDate, end: endDate });

      return days.map((day) => ({
        date: format(day, "yyyy-MM-dd"),
        commits: Math.floor(Math.random() * 5), // Random commits 0-4
      }));
    };

    setTimeout(() => {
      setCommitData(generateCommitData());
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    setStreak(Math.floor(Math.random() * 26) + 1); // 1-26
    setHackathons(Math.floor(Math.random() * 6)); // 0-5
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  // Prepare chart data
  const contributionChartData = {
    labels: commitData
      .slice(-30)
      .map((d) => format(new Date(d.date), "MMM dd")),
    datasets: [
      {
        label: "Daily Commits",
        data: commitData.slice(-30).map((d) => d.commits),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const languageChartData = {
    labels: Object.keys(user.languages || {}),
    datasets: [
      {
        data: Object.values(user.languages || {}),
        backgroundColor: [
          "#3B82F6",
          "#84CC16",
          "#582C4D",
          "#C60F7B",
          "#D97706",
          "#EC4899",
          "#EF4444",
          "#F59E0B",
          "#10B981",
          "#8B5CF6",
          "#F97316",
          "#06B6D4",
        ],
        borderWidth: 0,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          color: isDarkMode ? "#e5e7eb" : "#374151",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDarkMode ? "#e5e7eb" : "#374151",
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          color: isDarkMode ? "#e5e7eb" : "#374151",
        },
      },
    },
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
              <img src="/pubhub.png" alt="PubHub Logo" className="h-8 w-auto" />
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex flex-col gap-2">
                <div className="flex gap-4">
                  <div className="flex items-center bg-orange-50 dark:bg-orange-900 px-4 py-2 rounded-lg border border-orange-100 dark:border-orange-800">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200 mr-1">
                      Day Learning Streak:
                    </span>
                    <Flame className="w-5 h-5 text-orange-500 mx-1" />
                    <span className="font-bold text-orange-600 dark:text-orange-300 mx-1">
                      {streak}
                    </span>
                    <Info className="w-4 h-4 text-yellow-400 ml-2" />
                  </div>
                  <div className="flex items-center bg-blue-50 dark:bg-blue-900 px-4 py-2 rounded-lg border border-blue-100 dark:border-blue-800">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200 mr-1">
                      Active Hackathons:
                    </span>
                    <Book className="w-5 h-5 text-blue-500 mx-1" />
                    <span className="font-bold text-blue-600 dark:text-blue-300 mx-1">
                      {hackathons}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
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
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <GitCommit className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Total Public Repositories
                  </h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {user.total_public_repos || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  On GitHub
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Languages
                  </h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {Object.keys(user.languages || {}).length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Used in repos
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Technologies
                  </h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {user.technologies?.length || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Learning/Working with
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Active Days
                  </h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {commitData.filter((d) => d.commits > 0).length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Past year
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contribution Chart */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Contribution Activity (Last 30 Days)
                </h3>
                <div className="h-64">
                  <Line data={contributionChartData} options={chartOptions} />
                </div>
              </div>

              {/* Language Distribution */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Language Distribution
                </h3>
                <div className="h-64">
                  {Object.keys(user.languages || {}).length > 0 ? (
                    <Doughnut
                      data={languageChartData}
                      options={doughnutOptions}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      No language data available
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Technologies You're Working With
              </h3>
              {user.technologies && user.technologies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.technologies.map((tech: string) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No technologies selected yet.
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
