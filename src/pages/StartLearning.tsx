import { useState, useEffect } from "react";
import CourseCard from "../components/learning/CourseCard";
import {
    Book,
    Search,
    Filter,
    Code,
    Brain,
    Server,
    CloudCog,
    Database,
    Layers,
    Globe,
} from "lucide-react";
import { courses, getAllCategories } from "../courses/courseData";
import type { Course } from "../types/course";
import type { User } from "../lib/supabase";

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

export default function StartLearning({ user }: { user: User }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
    const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);

    // Get all categories
    const allCategories = getAllCategories();

    // Apply filters whenever search/category/difficulty changes
    useEffect(() => {
        let result = courses;

        // Filter by search
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(
                (course) =>
                    course.title.toLowerCase().includes(lowerQuery) ||
                    course.description.toLowerCase().includes(lowerQuery)
            );
        }

        // Filter by category
        if (selectedCategory !== "all") {
            result = result.filter(
                (course) => course.category === selectedCategory
            );
        }

        // Filter by difficulty
        if (selectedDifficulty !== "all") {
            result = result.filter(
                (course) => course.difficulty === selectedDifficulty
            );
        }

        setFilteredCourses(result);
    }, [searchQuery, selectedCategory, selectedDifficulty]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Start Learning
                    </h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                        Enhance your skills with our expert-created courses
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Search and filters */}
                <div className="mb-4 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                    <div className="flex flex-col justify-center  md:flex-row gap-4 jus  items-center">
                        {/* Search bar */}
                        <div className="relative justify-center flex items-center h-[30px]">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-[490px] pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        {/* Category filter */}
                        <div className="flex w-full  md:w-48">
                            <div className="flex items-center mb-1  flex-row">
                                <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                                <label className="text-sm text-gray-600 dark:text-gray-400">
                                    Category
                                </label>
                            </div>
                            <select
                                value={selectedCategory}
                                onChange={(e) =>
                                    setSelectedCategory(e.target.value)
                                }
                                className="w-[150px] px-2 ml-2  py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                                <option value="all">All Categories</option>
                                {allCategories.map((category) => (
                                    <option key={category} value={category}>
                                        {categoryLabels[category] || category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Difficulty filter */}
                        <div className="flex w-full md:w-48 ml-16">
                            <div className="flex items-center mb-1 flex-row">
                                <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                                <label className="text-sm text-gray-600 dark:text-gray-400">
                                    Difficulty
                                </label>
                            </div>
                            <select
                                value={selectedDifficulty}
                                onChange={(e) =>
                                    setSelectedDifficulty(e.target.value)
                                }
                                className="w-[110px]  px-2 ml-2  py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                                <option value="all">All Levels</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">
                                    Intermediate
                                </option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Category navigation */}
                <div className="mb-8 overflow-x-auto">
                    <div className="flex space-x-2 pb-2">
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-2 text-sm font-medium transition-colors
                ${
                    selectedCategory === "all"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                        >
                            <Book className="w-4 h-4" />
                            <span>All Courses</span>
                        </button>

                        {allCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-2 text-sm font-medium transition-colors
                  ${
                      selectedCategory === category
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                            >
                                {categoryIcons[category] || (
                                    <Book className="w-4 h-4" />
                                )}
                                <span>
                                    {categoryLabels[category] || category}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Course grid */}
                {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="inline-block p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                            <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            No courses found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Try adjusting your search or filter criteria
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
