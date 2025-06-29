import { useState, KeyboardEvent } from "react";
import { CornerDownLeft, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { AuthUser } from "../lib/auth-jwt";
import { authService } from "../lib/auth-jwt";

const PROFESSIONS = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile App Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "Software Engineer",
  "Web Designer",
  "UI/UX Designer",
  "Product Manager",
  "QA Engineer",
  "System Administrator",
  "Database Administrator",
  "Cybersecurity Specialist",
  "Game Developer",
  "Blockchain Developer",
  "Cloud Architect",
  "Student",
  "Other",
];

const PROFESSION_TECHNOLOGIES: Record<string, string[]> = {
  "Frontend Developer": [
    "JavaScript",
    "TypeScript",
    "React",
    "Vue.js",
    "Angular",
    "HTML",
    "CSS",
    "Sass",
    "Tailwind CSS",
    "Next.js",
    "Nuxt.js",
    "Svelte",
    "Webpack",
    "Vite",
  ],
  "Backend Developer": [
    "Node.js",
    "Python",
    "Java",
    "C#",
    "PHP",
    "Go",
    "Rust",
    "Express",
    "Django",
    "Flask",
    "Spring Boot",
    "Laravel",
    "Rails",
    "REST APIs",
    "GraphQL",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
  ],
  "Full Stack Developer": [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "PostgreSQL",
    "MongoDB",
    "Express",
    "Next.js",
    "REST APIs",
    "GraphQL",
    "Docker",
    "AWS",
    "Git",
    "HTML",
    "CSS",
  ],
  "Mobile App Developer": [
    "React Native",
    "Flutter",
    "Swift",
    "Kotlin",
    "Java",
    "JavaScript",
    "TypeScript",
    "Expo",
    "Firebase",
    "iOS",
    "Android",
  ],
  "DevOps Engineer": [
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "Google Cloud",
    "Jenkins",
    "GitLab CI",
    "Terraform",
    "Ansible",
    "Linux",
    "Bash",
    "Python",
    "CI/CD",
    "Monitoring",
    "Git",
  ],
  "Data Scientist": [
    "Python",
    "R",
    "SQL",
    "Machine Learning",
    "TensorFlow",
    "PyTorch",
    "Pandas",
    "NumPy",
    "Jupyter",
    "Scikit-learn",
    "Matplotlib",
    "Seaborn",
    "Statistics",
    "Data Visualization",
  ],
  "Machine Learning Engineer": [
    "Python",
    "TensorFlow",
    "PyTorch",
    "Machine Learning",
    "Deep Learning",
    "MLOps",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "Git",
    "SQL",
    "Scikit-learn",
    "OpenCV",
  ],
  "Software Engineer": [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "Git",
    "SQL",
    "REST APIs",
    "Agile",
    "Testing",
    "Data Structures",
    "Algorithms",
    "System Design",
  ],
  "Web Designer": [
    "HTML",
    "CSS",
    "JavaScript",
    "Figma",
    "Adobe XD",
    "Photoshop",
    "Illustrator",
    "Responsive Design",
    "UI Design",
    "Prototyping",
  ],
  "UI/UX Designer": [
    "Figma",
    "Adobe XD",
    "Sketch",
    "Prototyping",
    "User Research",
    "Wireframing",
    "Design Systems",
    "Usability Testing",
    "HTML",
    "CSS",
  ],
  "Product Manager": [
    "Product Strategy",
    "Agile",
    "Scrum",
    "User Research",
    "Analytics",
    "A/B Testing",
    "Roadmapping",
    "Stakeholder Management",
    "SQL",
    "Excel",
  ],
  "QA Engineer": [
    "Testing",
    "Automation Testing",
    "Selenium",
    "Jest",
    "Cypress",
    "Manual Testing",
    "Bug Tracking",
    "Test Planning",
    "API Testing",
    "SQL",
  ],
  "System Administrator": [
    "Linux",
    "Windows Server",
    "Bash",
    "PowerShell",
    "Networking",
    "Security",
    "Monitoring",
    "Backup",
    "Virtualization",
    "Active Directory",
  ],
  "Database Administrator": [
    "SQL",
    "PostgreSQL",
    "MySQL",
    "Oracle",
    "MongoDB",
    "Redis",
    "Database Design",
    "Performance Tuning",
    "Backup",
    "Security",
    "Linux",
  ],
  "Cybersecurity Specialist": [
    "Network Security",
    "Penetration Testing",
    "Vulnerability Assessment",
    "Incident Response",
    "Security Auditing",
    "Firewall",
    "Linux",
    "Python",
    "Cybersecurity Frameworks",
  ],
  "Game Developer": [
    "Unity",
    "Unreal Engine",
    "C#",
    "C++",
    "JavaScript",
    "3D Modeling",
    "Game Design",
    "Physics",
    "Graphics Programming",
    "Mobile Games",
  ],
  "Blockchain Developer": [
    "Solidity",
    "Web3",
    "Ethereum",
    "Smart Contracts",
    "DeFi",
    "NFTs",
    "JavaScript",
    "Node.js",
    "Crypto",
    "Decentralized Apps",
  ],
  "Cloud Architect": [
    "AWS",
    "Azure",
    "Google Cloud",
    "Cloud Computing",
    "Serverless",
    "Microservices",
    "Docker",
    "Kubernetes",
    "Terraform",
    "DevOps",
  ],
  Student: [
    "JavaScript",
    "Python",
    "HTML",
    "CSS",
    "Git",
    "SQL",
    "React",
    "Data Structures",
    "Algorithms",
    "Web Development",
    "Programming Fundamentals",
  ],
  Other: [
    "JavaScript",
    "Python",
    "HTML",
    "CSS",
    "React",
    "Node.js",
    "Git",
    "SQL",
    "REST APIs",
    "TypeScript",
  ],
};

const ALL_TECHNOLOGIES = [
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
  "HTML",
  "CSS",
  "Sass",
  "Tailwind CSS",
  "Figma",
  "Adobe XD",
  "Unity",
  "Unreal Engine",
  "Solidity",
  "TensorFlow",
  "PyTorch",
  "Linux",
  "Bash",
  "Testing",
  "Agile",
  "Scrum",
];

interface OnboardingProps {
  user: AuthUser;
  onComplete: (user: AuthUser) => void;
}

export default function Onboarding({ user, onComplete }: OnboardingProps) {
  const location = useLocation();
  const isEditMode = location.state?.editMode === true;

  // Get profession and technologies from state or user object
  const initialProfession = location.state?.profession || user.profession || "";
  const initialTechnologies =
    location.state?.technologies || user.technologies || [];

  const [currentStep, setCurrentStep] = useState<"profession" | "technologies">(
    isEditMode && initialProfession ? "technologies" : "profession"
  );
  const [selectedProfession, setSelectedProfession] =
    useState<string>(initialProfession);
  const [selectedTechnologies, setSelectedTechnologies] =
    useState<string[]>(initialTechnologies);
  const [customTech, setCustomTech] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Get technologies based on selected profession
  const getRecommendedTechnologies = () => {
    if (!selectedProfession) return ALL_TECHNOLOGIES;
    return PROFESSION_TECHNOLOGIES[selectedProfession] || ALL_TECHNOLOGIES;
  };

  const handleProfessionSelect = async (profession: string) => {
    setSelectedProfession(profession);
    setIsLoading(true);

    try {
      // Update user profession in database
      await authService.updateProfession(profession);
      setCurrentStep("technologies");
    } catch (error) {
      console.error("Error updating profession:", error);
      setError("Failed to save profession. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
        // Update the user object in memory before navigating
        onComplete(updatedUser);

        // Don't reload the page, directly navigate to dashboard
        navigate("/dashboard", { replace: true, state: { refreshUser: true } });
      }
    } catch (error) {
      console.error("Error updating technologies:", error);
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
          {currentStep === "profession" ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {isEditMode
                  ? `Edit Your Profile, ${user.name || user.github_username}`
                  : `Welcome to PubHub, ${user.name || user.github_username}!`}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Let's start by knowing what you do. Select your profession to
                get personalized technology recommendations.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-800 dark:text-red-200 text-sm">
                    {error}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {PROFESSIONS.map((profession) => (
                  <button
                    key={profession}
                    onClick={() => handleProfessionSelect(profession)}
                    disabled={isLoading}
                    className={`p-4 rounded-lg text-left border-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                              focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400
                              ${
                                profession === selectedProfession
                                  ? "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200"
                                  : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900"
                              }`}
                  >
                    <span className="font-medium">{profession}</span>
                  </button>
                ))}
              </div>

              {isLoading && (
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    Saving your profession...
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setCurrentStep("profession")}
                  className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                  title="Back to profession selection"
                  aria-label="Back to profession selection"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Technology Stack
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Profession: {selectedProfession}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Based on your profession, we've recommended some technologies.
                Select the ones you're interested in or currently working with.
              </p>

              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={customTech}
                    onChange={(e) => setCustomTech(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a custom technology (Press Enter)"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                              placeholder-gray-500 dark:placeholder-gray-400
                              focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400
                              transition-colors"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 pointer-events-none">
                    <CornerDownLeft size={18} />
                  </span>
                  {error && (
                    <p className="absolute -bottom-6 left-0 text-sm text-red-500 dark:text-red-400">
                      {error}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recommended for {selectedProfession}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {getRecommendedTechnologies().map((tech: string) => (
                    <button
                      key={tech}
                      onClick={() => toggleTechnology(tech)}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        selectedTechnologies.includes(tech)
                          ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 border-2 border-green-500 dark:border-green-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-2 border-transparent"
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>

              {selectedTechnologies.filter(
                (tech) => !getRecommendedTechnologies().includes(tech)
              ).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Your Custom Technologies
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {selectedTechnologies
                      .filter(
                        (tech) => !getRecommendedTechnologies().includes(tech)
                      )
                      .map((tech) => (
                        <button
                          key={tech}
                          onClick={() => toggleTechnology(tech)}
                          className="p-3 rounded-lg text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 border-2 border-blue-500 dark:border-blue-400 transition-colors"
                        >
                          {tech}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-between items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedTechnologies.length} technologies selected
                </p>
                <button
                  onClick={handleComplete}
                  disabled={selectedTechnologies.length === 0 || isLoading}
                  className={`px-6 py-3 rounded-lg text-white font-medium transition-colors flex items-center gap-2 ${
                    selectedTechnologies.length > 0 && !isLoading
                      ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                      : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                  }`}
                >
                  {isLoading
                    ? "Saving..."
                    : isEditMode
                    ? "Save Changes"
                    : "Continue to Dashboard"}
                  {!isLoading && <ArrowRight size={16} />}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
