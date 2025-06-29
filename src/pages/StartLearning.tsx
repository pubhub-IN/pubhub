import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CourseCard from "../components/learning/CourseCard";
import {
  Book,
  Search,
  Code,
  Brain,
  Server,
  CloudCog,
  Database,
  Layers,
  Globe,
  Sparkles,
  X,
  SlidersHorizontal,
  History,
  BookOpen,
  Info,
  ArrowUpDown,
  LayoutGrid,
  List,
  Clock,
  Filter,
} from "lucide-react";
import { courses } from "../courses/courseData.ts";
import type { Course } from "../types/course";
import { getUserCourseProgress } from "../lib/courseProgress";
import type { CourseProgress } from "../lib/courseProgress";
import { User } from "../lib/supabase";

const categoryLabels: Record<string, string> = {
  dsa: "Data Structures & Algorithms",
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  mern: "MERN Stack",
  mean: "MEAN Stack",
  rust: "Rust",
  go: "Go",
  frontend: "Frontend Development",
  backend: "Backend Development",
  devops: "DevOps",
  blockchain: "Blockchain",
  web3: "Web3",
  web2: "Web2",
  other: "Other Technologies",
};

const categoryIcons: Record<string, React.ReactNode> = {
  dsa: <Brain className="w-5 h-5" />,
  javascript: <Code className="w-5 h-5" />,
  typescript: <Code className="w-5 h-5" />,
  python: <Code className="w-5 h-5" />,
  mern: <Layers className="w-5 h-5" />,
  mean: <Layers className="w-5 h-5" />,
  rust: <Code className="w-5 h-5" />,
  go: <Code className="w-5 h-5" />,
  frontend: <Globe className="w-5 h-5" />,
  backend: <Server className="w-5 h-5" />,
  devops: <CloudCog className="w-5 h-5" />,
  blockchain: <Database className="w-5 h-5" />,
  web3: <Globe className="w-5 h-5" />,
  web2: <Globe className="w-5 h-5" />,
  other: <Book className="w-5 h-5" />,
};

const FeaturedCourseCard = ({ course }: { course: Course }) => {
  const totalLessons = course.modules.reduce(
    (total, module) => total + module.lessons.length,
    0
  );
  const totalMinutes = totalLessons * 10; // Assuming 10 mins per lesson
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const durationText =
    hours > 0 ? `${hours}h ${minutes > 0 ? `${minutes}m` : ""}` : `${minutes}m`;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-2/5 h-64 md:h-auto">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-8 md:w-3/5 flex flex-col justify-between">
          <div>
            <span
              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-2 ${getDifficultyColor(
                course.difficulty
              )}`}
            >
              {course.difficulty.charAt(0).toUpperCase() +
                course.difficulty.slice(1)}
            </span>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {course.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
              {course.description}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-700 dark:text-gray-200">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-500" />
                <span>{totalLessons} Lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-500" />
                <span>{durationText}</span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Link
              to={`/courses/${course.id}`}
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              Start Learning Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function StartLearning({ user }: { user: User }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedAvailability, setSelectedAvailability] =
    useState<string>("all");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    search: boolean;
    category: boolean;
    difficulty: boolean;
    tags: boolean;
    availability: boolean;
  }>({
    search: false,
    category: false,
    difficulty: false,
    tags: false,
    availability: false,
  });

  const [sortOption, setSortOption] = useState<
    "newest" | "popular" | "rating" | "duration"
  >("newest");
  const [viewMode, setViewMode] = useState<
    "grid" | "list" | "carousel" | "masonry"
  >("grid");
  const [isLoading, setIsLoading] = useState(false);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [showLearningPath] = useState(false);

  const [inProgressCourses, setInProgressCourses] = useState<
    {
      id: string;
      progress: number;
      lastLesson?: string;
      lastAccessed?: string;
    }[]
  >([]);

  useEffect(() => {
    const allProgress: CourseProgress[] = getUserCourseProgress(user);

    const coursesInProgress = allProgress
      .map((progress) => {
        const course = courses.find((c) => c.id === progress.courseId);
        if (!course) return null;

        const totalLessons = course.modules.reduce(
          (total, module) => total + module.lessons.length,
          0
        );
        const percentage =
          totalLessons > 0
            ? Math.round(
                (progress.completedLessons.length / totalLessons) * 100
              )
            : 0;

        const lastCompletedLessonId =
          progress.completedLessons[progress.completedLessons.length - 1];
        let lastCompletedLessonTitle = "Introduction";
        if (lastCompletedLessonId) {
          for (const module of course.modules) {
            const lesson = module.lessons.find(
              (l) => l.id === lastCompletedLessonId
            );
            if (lesson) {
              lastCompletedLessonTitle = lesson.title;
              break;
            }
          }
        }

        return {
          id: progress.courseId,
          progress: percentage,
          lastLesson: lastCompletedLessonTitle,
          lastAccessed: progress.lastAccessedAt,
        };
      })
      .filter(Boolean) as {
      id: string;
      progress: number;
      lastLesson?: string;
      lastAccessed?: string;
    }[];

    coursesInProgress.sort(
      (a, b) =>
        new Date(b.lastAccessed || 0).getTime() -
        new Date(a.lastAccessed || 0).getTime()
    );

    setInProgressCourses(coursesInProgress);
  }, [user]);

  const courseStats = {
    total: courses.length,
    beginner: courses.filter((c) => c.difficulty === "beginner").length,
    intermediate: courses.filter((c) => c.difficulty === "intermediate").length,
    advanced: courses.filter((c) => c.difficulty === "advanced").length,
  };

  const featuredCourses = courses.slice(0, 1);

  const getRandomEnrollment = (courseId: string) => {
    return Math.floor((courseId.length * 125) % 900) + 100;
  };

  const getRandomRating = (courseId: string) => {
    return (((courseId.length * 7) % 20) + 36) / 10;
  };

  const extractSkillTags = (course: Course): string[] => {
    const tags = new Set<string>();

    const words = (course.title + " " + course.description)
      .toLowerCase()
      .split(/\W+/);
    const commonProgrammingTerms = [
      "javascript",
      "typescript",
      "react",
      "node",
      "python",
      "api",
      "html",
      "css",
      "web",
      "redux",
      "hooks",
      "async",
      "algorithms",
      "data",
      "backend",
      "frontend",
    ];

    commonProgrammingTerms.forEach((term) => {
      if (words.includes(term)) tags.add(term);
    });

    tags.add(course.category);

    tags.add(course.difficulty);

    return Array.from(tags);
  };

  useEffect(() => {
    setIsLoading(true);

    const timeoutId = setTimeout(() => {
      let tempCourses = courses;

      // Search query filter
      if (searchQuery.trim() !== "") {
        const lowerCaseQuery = searchQuery.toLowerCase();
        tempCourses = tempCourses.filter(
          (course) =>
            course.title.toLowerCase().includes(lowerCaseQuery) ||
            course.description.toLowerCase().includes(lowerCaseQuery) ||
            course.category.toLowerCase().includes(lowerCaseQuery) ||
            (course.tags &&
              course.tags.some((tag: string) =>
                tag.toLowerCase().includes(lowerCaseQuery)
              ))
        );
      }

      // Category filter
      if (selectedCategory !== "all") {
        tempCourses = tempCourses.filter(
          (course) => course.category === selectedCategory
        );
      }

      // Difficulty filter
      if (selectedDifficulty !== "all") {
        tempCourses = tempCourses.filter(
          (course) => course.difficulty === selectedDifficulty
        );
      }

      // Availability filter
      if (selectedAvailability !== "all") {
        tempCourses = tempCourses.filter((course) =>
          selectedAvailability === "available"
            ? course.isAvailable !== false
            : course.isAvailable === false
        );
      }

      // Tag filter
      if (selectedTags.length > 0) {
        tempCourses = tempCourses.filter((course) =>
          selectedTags.some((tag) => extractSkillTags(course).includes(tag))
        );
      }

      // Sorting
      switch (sortOption) {
        case "newest":
          tempCourses = [...tempCourses].sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          break;
        case "popular":
          tempCourses = [...tempCourses].sort(
            (a, b) => getRandomEnrollment(b.id) - getRandomEnrollment(a.id)
          );
          break;
        case "rating":
          tempCourses = [...tempCourses].sort(
            (a, b) => getRandomRating(b.id) - getRandomRating(a.id)
          );
          break;
        case "duration":
          tempCourses = [...tempCourses].sort((a, b) => {
            const durationA = a.modules.reduce(
              (total, module) => total + module.lessons.length,
              0
            );
            const durationB = b.modules.reduce(
              (total, module) => total + module.lessons.length,
              0
            );
            return durationA - durationB;
          });
          break;
        default:
          break;
      }

      setFilteredCourses(tempCourses);
      setIsLoading(false);
    }, 400); // Short delay to show loading state

    return () => clearTimeout(timeoutId);
  }, [
    searchQuery,
    selectedCategory,
    selectedDifficulty,
    sortOption,
    selectedTags,
    selectedAvailability,
  ]);

  // Update active filters whenever search/category/difficulty changes
  useEffect(() => {
    setActiveFilters({
      search: searchQuery.trim() !== "",
      category: selectedCategory !== "all",
      difficulty: selectedDifficulty !== "all",
      tags: selectedTags.length > 0,
      availability: selectedAvailability !== "all",
    });
  }, [
    searchQuery,
    selectedCategory,
    selectedDifficulty,
    selectedTags,
    selectedAvailability,
  ]);

  // Clear individual filters
  const clearSearchFilter = () => setSearchQuery("");
  const clearCategoryFilter = () => setSelectedCategory("all");
  const clearDifficultyFilter = () => setSelectedDifficulty("all");
  const clearAvailabilityFilter = () => setSelectedAvailability("all");

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDifficulty("all");
    setSelectedTags([]);
    setSelectedAvailability("all");
  };

  // Check if any filter is active
  const hasActiveFilters = Object.values(activeFilters).some((value) => value);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-green-500 dark:text-green-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Start Learning
            </h1>
          </div>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
            Enhance your skills with our expert-created courses designed to help
            you master new technologies and concepts
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Statistics */}
        <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Courses
                </h3>
                <BookOpen className="h-5 w-5 text-green-500 dark:text-green-400" />
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {courseStats.total}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Beginner
                </h3>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {courseStats.beginner}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Intermediate
                </h3>
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {courseStats.intermediate}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Advanced
                </h3>
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {courseStats.advanced}
              </p>
            </div>
          </div>
        </div>

        {/* Search and filters */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-all duration-300 overflow-hidden">
          {/* Search header with background */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-700 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  Find Your Next Course
                </h2>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <Info className="h-3.5 w-3.5" />
                <span>
                  Showing {filteredCourses.length} of {courses.length} courses
                </span>
              </div>
            </div>
          </div>

          {/* Top section with search and filter toggle */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between mb-6">
              {/* Search bar - enhanced with clear button */}
              <div
                className={`relative w-full sm:max-w-md transition-all duration-300 ${
                  isSearchFocused
                    ? "scale-102 ring-2 ring-green-100 dark:ring-green-900/40 rounded-xl"
                    : ""
                }`}
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search
                    className={`h-5 w-5 ${
                      isSearchFocused || activeFilters.search
                        ? "text-green-500 dark:text-green-400"
                        : "text-gray-400"
                    } transition-colors duration-300`}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search course title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  aria-label="Search courses"
                  className="w-full pl-12 pr-10 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm transition-all duration-300 placeholder:text-gray-400"
                />
                {activeFilters.search && (
                  <button
                    onClick={clearSearchFilter}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Filter toggle button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-green-100 dark:bg-green-700 hover:bg-green-200 dark:hover:bg-green-600 text-green-700 dark:text-green-200 font-medium rounded-xl transition-colors duration-300"
                aria-expanded={showFilters ? true : false}
              >
                <SlidersHorizontal className="h-5 w-5" />
                <span>{showFilters} Filters</span>
              </button>
            </div>

            {/* Active filters display */}
            {hasActiveFilters && (
              <div className="mb-4 flex items-center flex-wrap gap-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Filters:
                </h3>
                {activeFilters.search && (
                  <span className="flex items-center gap-1.5 text-xs px-2 py-1 bg-green-100 dark:bg-green-700 rounded-full">
                    Search: "{searchQuery}"
                    <button
                      onClick={clearSearchFilter}
                      aria-label="Clear search filter"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                )}
                {activeFilters.category && (
                  <span className="flex items-center gap-1.5 text-xs px-2 py-1 bg-green-100 dark:bg-green-700 rounded-full">
                    Category: {selectedCategory}
                    <button
                      onClick={clearCategoryFilter}
                      aria-label="Clear category filter"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                )}
                {activeFilters.difficulty && (
                  <span className="flex items-center gap-1.5 text-xs px-2 py-1 bg-green-100 dark:bg-green-700 rounded-full">
                    Difficulty: {selectedDifficulty}
                    <button
                      onClick={clearDifficultyFilter}
                      aria-label="Clear difficulty filter"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                )}
                {activeFilters.availability && (
                  <span className="flex items-center gap-1.5 text-xs px-2 py-1 bg-green-100 dark:bg-green-700 rounded-full">
                    Availability:{" "}
                    {selectedAvailability === "available"
                      ? "Available"
                      : "Coming Soon"}
                    <button
                      onClick={clearAvailabilityFilter}
                      aria-label="Clear availability filter"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-green-600 dark:text-green-400 hover:underline"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Collapsible filter section */}
            <div
              className={`grid gap-6 transition-all duration-300 overflow-hidden ${
                showFilters
                  ? "grid-rows-[1fr] opacity-100 max-h-96 pt-4 mt-2 border-t border-gray-100 dark:border-gray-700"
                  : "grid-rows-[0fr] opacity-0 max-h-0"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Difficulty filter */}
                <div>
                  <label
                    htmlFor="difficulty-filter"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Difficulty Level
                  </label>
                  <select
                    id="difficulty-filter"
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm transition-colors"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                {/* Availability filter */}
                <div>
                  <label
                    htmlFor="availability-filter"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Course Availability
                  </label>
                  <select
                    id="availability-filter"
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm transition-colors"
                  >
                    <option value="all">All Courses</option>
                    <option value="available">Available Now</option>
                    <option value="unavailable">Coming Soon</option>
                  </select>
                </div>

                {/* Skill tags filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Filter by Skill Tags
                  </label>
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-3 flex flex-wrap gap-2 border border-gray-200 dark:border-gray-600 shadow-sm">
                    {/* Add some popular tags */}
                    {[
                      "react",
                      "typescript",
                      "python",
                      "api",
                      "frontend",
                      "backend",
                    ].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          const newTags = selectedTags.includes(tag)
                            ? selectedTags.filter((t) => t !== tag)
                            : [...selectedTags, tag];
                          setSelectedTags(newTags);
                        }}
                        className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                          selectedTags.includes(tag)
                            ? "bg-green-500 text-white"
                            : "bg-green-100 dark:bg-green-600 text-green-700 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-500"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category navigation */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Browse by Category
          </h2>
          <div className="overflow-x-auto custom-scrollbar pb-2">
            <div className="flex space-x-3 pb-2">
              {/* "All" category button */}
              <button
                onClick={() => setSelectedCategory("all")}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors duration-300 ${
                  selectedCategory === "all"
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-700"
                }`}
              >
                <Globe className="w-5 h-5" />
                <span className="font-medium">All</span>
              </button>
              {/* Dynamic category buttons */}
              {Object.entries(categoryIcons).map(([key, icon]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors duration-300 ${
                    selectedCategory === key
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-700"
                  }`}
                >
                  {icon}
                  <span className="font-medium">{categoryLabels[key]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Course Section - Only show if not filtered */}
        {!hasActiveFilters && featuredCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
              <Sparkles className="mr-3 h-6 w-6 text-yellow-400" />
              Featured Course
            </h2>

            {featuredCourses.map((course) => (
              <FeaturedCourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        {/* Continue Learning Section - Shows courses in progress */}
        {inProgressCourses.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                <History className="mr-2 h-5 w-5" />
                Continue Learning
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressCourses.map((progress) => {
                const course = courses.find((c) => c.id === progress.id);
                if (!course) return null;
                return (
                  <CourseCard
                    key={course.id}
                    course={course}
                    viewMode="grid"
                    progress={progress.progress}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Course grid with sorting and view options */}
        {filteredCourses.length > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-0">
                {hasActiveFilters ? "Filtered Courses" : "All Courses"}
              </h2>
              {/* Sorting and view mode controls */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                    className="bg-white dark:bg-gray-800 border-none text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-0"
                    aria-label="Filter by availability"
                  >
                    <option value="all">All</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Not Available</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-gray-500" />
                  <select
                    value={sortOption}
                    onChange={(e) =>
                      setSortOption(
                        e.target.value as
                          | "newest"
                          | "popular"
                          | "rating"
                          | "duration"
                      )
                    }
                    className="bg-white dark:bg-gray-800 border-none text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-0"
                    aria-label="Sort courses by"
                  >
                    <option value="newest">Newest</option>
                    <option value="popular">Popular</option>
                    <option value="rating">Rating</option>
                    <option value="duration">Duration</option>
                  </select>
                </div>
                <div className="flex items-center gap-1 p-1 bg-green-100 dark:bg-green-700 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md ${
                      viewMode === "grid"
                        ? "bg-white dark:bg-gray-600 shadow-sm"
                        : ""
                    }`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md ${
                      viewMode === "list"
                        ? "bg-white dark:bg-gray-600 shadow-sm"
                        : ""
                    }`}
                    aria-label="List view"
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Learning path visualization */}
            {showLearningPath && (
              <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-thin">
                {/* Placeholder for learning path */}
                <p>Learning Path Visualization Here</p>
              </div>
            )}

            {/* Loading skeletons */}
            {isLoading ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : viewMode === "masonry"
                    ? "columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
                    : "space-y-4"
                }
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow animate-pulse"
                  >
                    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Grid view */}
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        viewMode="grid"
                      />
                    ))}
                  </div>
                )}

                {/* List view */}
                {viewMode === "list" && (
                  <div className="space-y-4">
                    {filteredCourses.map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        viewMode="list"
                      />
                    ))}
                  </div>
                )}

                {/* Carousel view */}
                {viewMode === "carousel" && (
                  <div className="relative">
                    {/* Carousel implementation here */}
                    <p className="text-center">
                      Carousel View not implemented yet.
                    </p>
                  </div>
                )}

                {/* Masonry view */}
                {viewMode === "masonry" && (
                  <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {filteredCourses.map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        viewMode="grid"
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Add Recommended Courses and Pagination */}
            <div className="mt-12">{/* Recommended courses section */}</div>
          </>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
            <div className="inline-flex items-center justify-center p-6 rounded-full bg-gray-100 dark:bg-gray-700 mb-6">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">
              No courses found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              We couldn't find any courses matching your current filters. Try
              adjusting your search criteria or browse all courses.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-6 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Course Preview Modal - Rendered at the end for performance */}
      </main>
    </div>
  );
}
