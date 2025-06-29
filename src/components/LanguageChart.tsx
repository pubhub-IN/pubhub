// Configure Chart.js to use necessary components for doughnut charts
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useEffect, useState } from "react";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface LanguageChartProps {
  languages: Record<string, number>;
}

// Type for our processed language data
type ProcessedLanguageData = Array<[string, number]>;

// Function to limit languages to show (combines smaller ones into "Other")
const processLanguageData = (
  languages: Record<string, number>,
  maxEntries = 7
): ProcessedLanguageData => {
  if (Object.keys(languages).length <= maxEntries) {
    return Object.entries(languages).sort(
      (a, b) => Number(b[1]) - Number(a[1])
    );
  }

  // Sort languages by percentage (descending)
  const sortedEntries = Object.entries(languages).sort(
    (a, b) => Number(b[1]) - Number(a[1])
  );

  // Take the top languages
  const topEntries = sortedEntries.slice(0, maxEntries - 1);

  // Combine the rest into "Other"
  const otherEntries = sortedEntries.slice(maxEntries - 1);
  const otherPercentage = otherEntries.reduce(
    (sum, [, percentage]) => sum + Number(percentage),
    0
  );

  // Add "Other" category if it's not 0
  if (otherPercentage > 0) {
    return [...topEntries, ["Other", otherPercentage]];
  }

  return topEntries;
};

export function LanguageChart({ languages }: LanguageChartProps) {
  // Chart data type
  type ChartDataType = {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
      hoverOffset: number;
    }[];
  };

  const [chartData, setChartData] = useState<ChartDataType | null>(null);

  const [isThemeDark, setIsThemeDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === "class" &&
          mutation.target === document.documentElement
        ) {
          setIsThemeDark(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Update chart data when languages or theme changes
  useEffect(() => {
    if (!languages || Object.keys(languages).length === 0) {
      setChartData(null);
      return;
    }

    // Define theme-friendly colors for the chart
    const chartColors = [
      "#3B82F6", // blue
      "#10B981", // green
      "#8B5CF6", // purple
      "#F59E0B", // amber
      "#EF4444", // red
      "#EC4899", // pink
      "#F97316", // orange
      "#06B6D4", // cyan
      "#84CC16", // lime
      "#6366F1", // indigo
      "#D97706", // yellow
      "#0EA5E9", // light blue
      "#14B8A6", // teal
    ];

    // Process language data to show top languages and combine the rest into "Other"
    const processedLanguages = processLanguageData(languages);

    setChartData({
      labels: processedLanguages.map(([language]) => language),
      datasets: [
        {
          data: processedLanguages.map(([, percentage]) => Number(percentage)),
          backgroundColor: processedLanguages.map(
            (_, index) => chartColors[index % chartColors.length]
          ),
          borderColor: processedLanguages.map(() =>
            isThemeDark ? "rgba(30, 30, 30, 0.8)" : "rgba(255, 255, 255, 0.8)"
          ),
          borderWidth: 2,
          hoverOffset: 10,
        },
      ],
    });
  }, [languages, isThemeDark]);

  // Simplified options to avoid type issues with Chart.js
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "55%",
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          color: isThemeDark
            ? "rgba(255, 255, 255, 0.8)"
            : "rgba(0, 0, 0, 0.7)",
          font: {
            size: 11,
            family: "'Poppins', sans-serif",
          },
        },
      },
      tooltip: {
        displayColors: true,
        padding: 8,
      },
    },
  };

  return (
    <div className="w-full h-full relative chart-container">
      {chartData ? (
        <Doughnut data={chartData} options={options} />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          No language data available
        </div>
      )}
    </div>
  );
}
