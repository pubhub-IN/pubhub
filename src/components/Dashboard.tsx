import React, { useEffect, useState } from 'react';
import { Github, Calendar, Code, TrendingUp, Users, GitCommit, LogOut } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { format, eachDayOfInterval, subDays, isSameDay } from 'date-fns';
import { authService } from '../lib/auth';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

interface DashboardProps {
  user: any;
}

export default function Dashboard({ user }: DashboardProps) {
  const [commitData, setCommitData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate sample commit data for demonstration
  useEffect(() => {
    const generateCommitData = () => {
      const endDate = new Date();
      const startDate = subDays(endDate, 365);
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      
      return days.map(day => ({
        date: format(day, 'yyyy-MM-dd'),
        commits: Math.floor(Math.random() * 5) // Random commits 0-4
      }));
    };

    setTimeout(() => {
      setCommitData(generateCommitData());
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  // Prepare chart data
  const contributionChartData = {
    labels: commitData.slice(-30).map(d => format(new Date(d.date), 'MMM dd')),
    datasets: [
      {
        label: 'Daily Commits',
        data: commitData.slice(-30).map(d => d.commits),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
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
          '#3B82F6',
          '#EF4444',
          '#F59E0B',
          '#10B981',
          '#8B5CF6',
          '#F97316',
          '#06B6D4',
          '#84CC16',
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
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
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
    <React.Fragment>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar_url}
                alt={user.github_username}
                className="w-12 h-12 rounded-xl"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.name || user.github_username}
                </h1>
                <p className="text-gray-600">@{user.github_username}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`https://github.com/${user.github_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Github className="w-5 h-5" />
                View GitHub
              </a>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <GitCommit className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Total Public Repositories</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{user.total_public_repos || 0}</p>
            <p className="text-sm text-gray-600">On GitHub</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Languages</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {Object.keys(user.languages || {}).length}
            </p>
            <p className="text-sm text-gray-600">Used in repos</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Technologies</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {user.technologies?.length || 0}
            </p>
            <p className="text-sm text-gray-600">Learning/Working with</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Active Days</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {commitData.filter(d => d.commits > 0).length}
            </p>
            <p className="text-sm text-gray-600">Past year</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Contribution Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Contribution Activity (Last 30 Days)
            </h3>
            <div className="h-64">
              <Line data={contributionChartData} options={chartOptions} />
            </div>
          </div>

          {/* Language Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Language Distribution
            </h3>
            <div className="h-64">
              {Object.keys(user.languages || {}).length > 0 ? (
                <Doughnut data={languageChartData} options={doughnutOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No language data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Technologies */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Technologies You're Working With
          </h3>
          {user.technologies && user.technologies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.technologies.map((tech: string) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No technologies selected yet.</p>
          )}
        </div>
      </div>
    </div>
    </React.Fragment>
  );
}