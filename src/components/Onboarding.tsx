import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthUser } from "../lib/auth-jwt";
import { authService } from "../lib/auth-jwt";
import "../styles/retro-shared.css";

const PROFESSIONS = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile App Developer",
  "DevOps Engineer",
  "Data Scientist",
  "ML Engineer",
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
  "ML Engineer": [
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
  user?: AuthUser;
  onComplete?: (user: AuthUser) => void;
}

export default function Onboarding({ user, onComplete }: OnboardingProps) {
  const location = useLocation();
  const isEditMode = location.state?.editMode === true;
  // const displayName = user?.name || user?.github_username || "Developer";

  // Get profession and technologies from state or user object
  const initialProfession = location.state?.profession || user?.profession || "";
  const initialTechnologies =
    location.state?.technologies || user?.technologies || [];

  const [currentStep, setCurrentStep] = useState<"profession" | "technologies">(
    isEditMode && initialProfession ? "technologies" : "profession"
  );
  const [selectedProfession, setSelectedProfession] =
    useState<string>(initialProfession);
  const [highlightedProfessionIndex, setHighlightedProfessionIndex] =
    useState<number>(() => {
      const initialIndex = PROFESSIONS.findIndex(
        (option) => option === initialProfession
      );
      return initialIndex >= 0 ? initialIndex : 0;
    });
  const [selectedTechnologies, setSelectedTechnologies] =
    useState<string[]>(initialTechnologies);
  const [highlightedTechnologyIndex, setHighlightedTechnologyIndex] =
    useState<number>(() => {
      const initialOptions =
        PROFESSION_TECHNOLOGIES[initialProfession] || ALL_TECHNOLOGIES;
      const initialSelectedTechnology = initialTechnologies[0];
      const initialIndex = initialOptions.findIndex(
        (option) => option === initialSelectedTechnology
      );

      return initialIndex >= 0 ? initialIndex : 0;
    });
  const [customTech, setCustomTech] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(() =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  );
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const professionTerminalRef = useRef<HTMLDivElement | null>(null);
  const technologyTerminalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (currentStep === "profession") {
      professionTerminalRef.current?.focus();

      const selectedIndex = PROFESSIONS.findIndex(
        (option) => option === selectedProfession
      );
      if (selectedIndex >= 0) {
        setHighlightedProfessionIndex(selectedIndex);
      }
      return;
    }
  }, [currentStep, selectedProfession]);

  useEffect(() => {
    if (currentStep !== "technologies") {
      return;
    }

    technologyTerminalRef.current?.focus();
    const recommendedTechnologies =
      PROFESSION_TECHNOLOGIES[selectedProfession] || ALL_TECHNOLOGIES;

    if (recommendedTechnologies.length > 0) {
      setHighlightedTechnologyIndex((prev) =>
        prev >= recommendedTechnologies.length ? 0 : prev
      );
    }
  }, [currentStep, selectedProfession]);

  useEffect(() => {
    const clock = window.setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    }, 1000);

    return () => {
      window.clearInterval(clock);
    };
  }, []);

  // Get technologies based on selected profession
  const getRecommendedTechnologies = () => {
    if (!selectedProfession) return ALL_TECHNOLOGIES;
    return PROFESSION_TECHNOLOGIES[selectedProfession] || ALL_TECHNOLOGIES;
  };

  const handleProfessionSelect = async (profession: string) => {
    setSelectedProfession(profession);
    if (!user) {
      setCurrentStep("technologies");
      return;
    }

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

    if (!user) {
      navigate("/github-screen", {
        replace: true,
        state: {
          profession: selectedProfession,
          technologies: selectedTechnologies,
        },
      });
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await authService.updateTechnologies(
        selectedTechnologies
      );
      if (updatedUser) {
        // Update the user object in memory before navigating
        onComplete?.(updatedUser);

        navigate("/github-screen", {
          replace: true,
          state: {
            profession: updatedUser.profession || selectedProfession,
            technologies: updatedUser.technologies || selectedTechnologies,
          },
        });
      }
    } catch (error) {
      console.error("Error updating technologies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfessionTerminalKeyDown = (
    event: KeyboardEvent<HTMLDivElement>
  ) => {
    if (isLoading) {
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedProfessionIndex((prev) =>
        prev <= 0 ? PROFESSIONS.length - 1 : prev - 1
      );
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedProfessionIndex((prev) =>
        prev >= PROFESSIONS.length - 1 ? 0 : prev + 1
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const chosen = PROFESSIONS[highlightedProfessionIndex];

      if (chosen) {
        void handleProfessionSelect(chosen);
      }
    }
  };

  const handleTechnologyTerminalKeyDown = (
    event: KeyboardEvent<HTMLDivElement>
  ) => {
    if (isLoading) {
      return;
    }

    if ((event.target as HTMLElement).tagName === "INPUT") {
      return;
    }

    const recommendedTechnologies = getRecommendedTechnologies();
    if (recommendedTechnologies.length === 0) {
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedTechnologyIndex((prev) =>
        prev <= 0 ? recommendedTechnologies.length - 1 : prev - 1
      );
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedTechnologyIndex((prev) =>
        prev >= recommendedTechnologies.length - 1 ? 0 : prev + 1
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const chosen = recommendedTechnologies[highlightedTechnologyIndex];

      if (chosen) {
        toggleTechnology(chosen);
        setHighlightedTechnologyIndex((prev) =>
          prev >= recommendedTechnologies.length - 1 ? 0 : prev + 1
        );
      }
    }
  };

  return (
    <div
      className="retro-shell h-screen min-h-screen w-full overflow-hidden"
      style={{ minHeight: "100dvh", height: "100dvh" }}
    >
      <div className="retro-terminal relative h-full min-h-full w-full bg-[#120900]/95">
        <div className="retro-topbar flex h-full items-center justify-between bg-[#130a06] px-2 text-sm relative overflow-hidden">
          <div className="retro-tab bg-[#f2a04304] flex min-w-0 items-center gap-2 rounded-t-lg border border-[#3a2416] border-b-0 p-2.5 absolute left-2.5 bottom-0">
            <span className="retro-tab-label retro-glow-text truncate text-[#f2a043] text-xs">MINGW64:/C/Users/w.o/onboarding</span>
          </div>

          <div className="my-2 flex items-center gap-1 absolute right-2">
            <span className="hidden text-lg tracking-[0.14em] text-[#b48b63] sm:inline">{currentTime}</span>
          </div>
        </div>

        <div
          data-lenis-prevent="true"
          className="retro-content h-full min-h-0 overflow-auto px-3 pb-14 pt-4 text-sm leading-[1.5] sm:px-5"
        >
          <div className="w-full">
          {currentStep === "profession" ? (
            <>
              <h1 className="retro-glow-text mb-2 text-3xl font-bold">
                {isEditMode
                  ? `Edit Your Profile`
                  : `Welcome to Working One!`}
              </h1>
              <p className="mb-2 text-[#d69f63] text-sm">
                Let's start by knowing what you do. Select your profession to
                get personalized technology recommendations.
              </p>

              <p className="mb-4 text-xs tracking-[0.08em] text-[#b8834f]">
                Use Arrow Up and Arrow Down to navigate, and Enter to select.
              </p>

              {error && (
                <div className="mb-6 rounded-lg border border-[#7a2b1f] bg-[#2f110b] p-4">
                  <p className="text-sm text-[#ffb7ab]">
                    {error}
                  </p>
                </div>
              )}

              <div
                ref={professionTerminalRef}
                tabIndex={0}
                onKeyDown={handleProfessionTerminalKeyDown}
                className="outline-none"
              >
                <div className="relative pl-8">
                  <div className="pointer-events-none absolute left-0 top-[6px] h-[calc(100%-8px)] w-4">
                    <span className="absolute left-0 top-0 h-[2px] w-4 bg-[#a85f27]" />
                    <span className="absolute left-0 top-0 h-full w-[2px] bg-[#a85f27]" />
                    <span className="absolute left-0 bottom-0 h-[2px] w-4 bg-[#a85f27]" />
                  </div>

                  <p className="mb-2 inline-flex items-center gap-2 text-md font-medium text-[#d69f63]">
                    <span className="h-2.5 w-2.5 rotate-45 border border-[#f2a043] bg-[#2a1305]" />
                    Select your profession:
                  </p>

                {PROFESSIONS.map((profession, index) => {
                  const isHighlighted = index === highlightedProfessionIndex;
                  const isSelected = profession === selectedProfession;

                  return (
                    <div
                      key={profession}
                      className="flex items-center gap-2 text-base"
                    >
                      <span className="inline-flex w-4 justify-center">
                        <span
                          className={`h-2.5 w-2.5 rounded-full border ${
                            isHighlighted
                              ? "border-[#59e86f] bg-[#00d719]"
                              : "border-[#777] bg-transparent"
                          }`}
                        />
                      </span>
                      <span style={{ color: isHighlighted ? "#00d719" : "#777" }}>{profession}</span>
                      {isSelected && (
                        <span className="ml-auto text-xs tracking-[0.08em] text-[#f2a043]">
                          selected
                        </span>
                      )}
                    </div>
                  );
                })}
                </div>
              </div>

              {isLoading && (
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center gap-2 text-[#d69f63]">
                    <div className="h-4 w-4 animate-pulse rounded-full bg-[#f2a043]"></div>
                    Saving your profession...
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setCurrentStep("profession")}
                  className="text-[#d69f63] transition-colors hover:text-[#f2a043]"
                  title="Back to profession selection"
                  aria-label="Back to profession selection"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h1 className="retro-glow-text text-3xl font-bold text-[#ffd29a]">
                    Technology Stack
                  </h1>
                  <p className="text-sm text-[#b8834f]">
                    Profession: {selectedProfession}
                  </p>
                </div>
              </div>

              <p className="mb-2 text-[#d69f63] text-sm">
                Based on your profession, we've recommended some technologies.
                Select the ones you're interested in or currently working with.
              </p>

              <p className="mb-4 text-xs tracking-[0.08em] text-[#b8834f]">
                Use Arrow Up and Down key to navigate, and Enter to select.
              </p>

              {error && (
                <div className="mb-6 rounded-lg border border-[#7a2b1f] bg-[#2f110b] p-4">
                  <p className="text-sm text-[#ffb7ab]">{error}</p>
                </div>
              )}

              <div
                ref={technologyTerminalRef}
                tabIndex={0}
                onKeyDown={handleTechnologyTerminalKeyDown}
                className="mb-6 outline-none"
              >
                <div className="relative pl-8">
                  <div className="pointer-events-none absolute left-0 top-[6px] h-[calc(100%-8px)] w-4">
                    <span className="absolute left-0 top-0 h-[2px] w-4 bg-[#a85f27]" />
                    <span className="absolute left-0 top-0 h-full w-[2px] bg-[#a85f27]" />
                    <span className="absolute left-0 bottom-0 h-[2px] w-4 bg-[#a85f27]" />
                  </div>

                  <p className="mb-2 inline-flex items-center gap-2 text-md font-medium text-[#d69f63]">
                    <span className="h-2.5 w-2.5 rotate-45 border border-[#f2a043] bg-[#2a1305]" />
                    Select your technologies:
                  </p>

                  {getRecommendedTechnologies().map((tech: string, index) => {
                    const isHighlighted = index === highlightedTechnologyIndex;
                    const isSelected = selectedTechnologies.includes(tech);

                    return (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => toggleTechnology(tech)}
                        className="flex w-full items-center gap-2 bg-transparent text-left text-base outine-none"
                      >
                        <span className="inline-flex w-4 justify-center">
                          <span
                            className={`inline-flex h-3 w-3 items-center justify-center ${
                              isSelected
                                ? "text-[#00d719]"
                                : isHighlighted
                                  ? "bg-[#00d719] rounded-full"
                                  : "border-[#777] bg-transparent rounded-full border"
                            }`}
                          >
                            {isSelected ? <Check size={12}/> : null}
                          </span>
                        </span>
                        <span
                          style={{
                            color: isSelected
                              ? "#00d719"
                              : isHighlighted
                                ? "#00d719"
                                : "#777",
                          }}
                          className={isHighlighted ? "underline" : ""}
                        >
                          {tech}
                        </span>
                        {isSelected && (
                          <span className="ml-auto text-xs tracking-[0.08em] text-[#f2a043]">
                            selected
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mb-6 relative pl-8">
                <div className="pointer-events-none absolute left-0 top-[6px] h-[calc(100%-8px)] w-4">
                  <span className="absolute left-0 top-0 h-[2px] w-4 bg-[#a85f27]" />
                  <span className="absolute left-0 top-0 h-full w-[2px] bg-[#a85f27]" />
                  <span className="absolute left-0 bottom-0 h-[2px] w-4 bg-[#a85f27]" />
                </div>

                <p className="mb-2 inline-flex items-center gap-2 text-md font-medium text-[#d69f63]">
                  <span className="h-2.5 w-2.5 rotate-45 border border-[#f2a043] bg-[#2a1305]" />
                  Add custom technology:
                </p>

                <input
                  type="text"
                  value={customTech}
                  onChange={(e) => setCustomTech(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type and press Enter"
                  className="w-full border border-[#5a2602] bg-[#120901] px-3 py-2 text-[#ffd29a] placeholder:text-[#9f6a3d] focus:outline-none focus:ring-2 focus:ring-[#f2a043]"
                />
              </div>

              {selectedTechnologies.filter(
                (tech) => !getRecommendedTechnologies().includes(tech)
              ).length > 0 && (
                <div className="mb-6 relative pl-8">
                  <div className="pointer-events-none absolute left-0 top-[6px] h-[calc(100%-8px)] w-4">
                    <span className="absolute left-0 top-0 h-[2px] w-4 bg-[#a85f27]" />
                    <span className="absolute left-0 top-0 h-full w-[2px] bg-[#a85f27]" />
                    <span className="absolute left-0 bottom-0 h-[2px] w-4 bg-[#a85f27]" />
                  </div>

                  <h3 className="mb-2 text-md font-medium text-[#d69f63]">
                    Your Custom Technologies
                  </h3>

                  <div>
                    {selectedTechnologies
                      .filter(
                        (tech) => !getRecommendedTechnologies().includes(tech)
                      )
                      .map((tech) => (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => toggleTechnology(tech)}
                          className="flex w-full items-center gap-2 bg-transparent text-left text-base"
                        >
                          <span className="inline-flex w-4 justify-center">
                            <span className="inline-flex h-3 w-3 items-center justify-centertext-[#00d719]">
                              <Check size={12} strokeWidth={3} />
                            </span>
                          </span>
                          <span className="text-[#00d719]">{tech}</span>
                          <span className="ml-auto text-xs tracking-[0.08em] text-[#a77749]">
                            custom
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              <div className="mt-8">
                <p className="text-sm text-[#b8834f]">
                  {selectedTechnologies.length} technologies selected
                </p>

                <button
                  type="button"
                  onClick={() => void handleComplete()}
                  disabled={selectedTechnologies.length === 0 || isLoading}
                  className={`mt-2 text-sm font-medium underline decoration-[#59e86f] underline-offset-4 transition-colors ${
                    selectedTechnologies.length > 0 && !isLoading
                      ? "text-[#59e86f] hover:text-[#8aff9c]"
                      : "cursor-not-allowed text-[#5f5f5f] decoration-[#5f5f5f]"
                  }`}
                >
                  {isLoading ? "Saving..." : "Finish and Connect GitHub"}
                </button>
              </div>
            </>
          )}
          </div>
        </div>

        <div className="retro-scanlines" />
      </div>

    </div>
  );
}
