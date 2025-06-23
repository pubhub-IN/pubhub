import { useState, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { User } from "../lib/supabase";
import { authService, AuthUser } from "../lib/auth-jwt";

const TECHNOLOGIES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "React",
  "Vue.js",
  "Angular",
  "Node.js",
  "Express",
  "Django",
  "Flask",
  "Spring Boot",
  "Laravel",
  "Rails",
  "Next.js",
  "Nuxt.js",
  "Svelte",
  "Flutter",
  "React Native",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Google Cloud",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "GraphQL",
  "REST APIs",
  "Microservices",
  "DevOps",
  "CI/CD",
  "Git",
  "Machine Learning",
  "AI",
  "Web3",
  "Blockchain",
];

interface OnboardingProps {
  user: User;
  onComplete: (user: User) => void;
}

export default function Onboarding({ user, onComplete }: OnboardingProps) {
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(
    []
  );
  const [customTech, setCustomTech] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const toggleTechnology = (tech: string) => {
    setSelectedTechnologies((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && customTech.trim()) {
      e.preventDefault();
      const newTech = customTech.trim();

      // Check if technology already exists
      if (selectedTechnologies.includes(newTech)) {
        setError("This technology is already selected");
        return;
      }

      // Add the new technology
      setSelectedTechnologies((prev) => [...prev, newTech]);
      setCustomTech(""); // Clear the input
      setError(""); // Clear any existing error
    }
  };

  const handleComplete = async () => {
    if (selectedTechnologies.length === 0) return;

    setIsLoading(true);
    try {
      const updatedUser = await authService.updateTechnologies(
        selectedTechnologies
      );
      
      if (updatedUser) {
        onComplete(updatedUser as User);
        navigate("/dashboard");
      } else {
        setError("Failed to update technologies. Please try again.");
      }
    } catch (error) {
      console.error("Error updating technologies:", error);
      setError("Failed to update technologies. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-green-900">
      <nav className="h-[100px] flex items-center justify-between px-6">
        <div className="flex items-center">
          <img src="/pubhub.png" alt="PubHub Logo" className="h-12 w-auto" />
        </div>
        <ThemeToggle />
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to PubHub, {user.name || user.github_username}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Select the technologies you're interested in or currently working
            with. This will help us personalize your experience.
          </p>

          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={customTech}
                onChange={(e) => setCustomTech(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a custom technology (press Enter)"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                          placeholder-gray-500 dark:placeholder-gray-400
                          focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400
                          transition-colors"
              />
              {error && (
                <p className="absolute -bottom-6 left-0 text-sm text-red-500 dark:text-red-400">
                  {error}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              ...selectedTechnologies,
              ...TECHNOLOGIES.filter(
                (tech) => !selectedTechnologies.includes(tech)
              ),
            ].map((tech) => (
              <button
                key={tech}
                onClick={() => toggleTechnology(tech)}
                className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                  selectedTechnologies.includes(tech)
                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {tech}
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleComplete}
              disabled={selectedTechnologies.length === 0 || isLoading}
              className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                selectedTechnologies.length > 0 && !isLoading
                  ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                  : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Saving..." : "Continue to Dashboard"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
