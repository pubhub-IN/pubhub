import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Award, Calendar, Book } from "lucide-react";
import { getCourseById } from "../../courses/courseData";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const course = getCourseById(courseId || "");

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We couldn't find the course you're looking for.
        </p>
        <Link
          to="/start-learning"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Back to Courses
        </Link>
      </div>
    );
  }

  // Calculate total lessons and estimated completion time
  const totalLessons = course.modules.reduce((total, module) => {
    return total + module.lessons.length;
  }, 0);

  const totalMinutes = course.modules.reduce((total, module) => {
    return (
      total +
      module.lessons.reduce((moduleTotal, lesson) => {
        return moduleTotal + lesson.timeToComplete;
      }, 0)
    );
  }, 0);

  // Convert minutes to hours and minutes
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Helper function to get badge color based on difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with course image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 z-20 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Link
              to="/start-learning"
              className="inline-flex items-center text-white hover:text-green-300 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to courses
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {course.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - Course details */}
          <div className="md:col-span-2 space-y-8">
            {/* Course info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
              <div className="flex flex-wrap gap-3 mb-4">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${getDifficultyColor(
                    course.difficulty
                  )}`}
                >
                  {course.difficulty.charAt(0).toUpperCase() +
                    course.difficulty.slice(1)}
                </span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-200">
                  {course.category.toUpperCase()}
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                About this course
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {course.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900">
                    <Book className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Modules
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {course.modules.length}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-green-100 dark:bg-green-900">
                    <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Lessons
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {totalLessons}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-purple-100 dark:bg-purple-900">
                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Duration
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-amber-100 dark:bg-amber-900">
                    <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Updated
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {new Date(course.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course curriculum */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Course Curriculum
              </h2>

              <div className="space-y-4">
                {course.modules.map((module, index) => (
                  <div
                    key={module.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 flex justify-between">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {index + 1}. {module.title}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {module.lessons.length}{" "}
                        {module.lessons.length === 1 ? "lesson" : "lessons"}
                      </span>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="p-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 dark:text-gray-300">
                              {index + 1}.{lessonIndex + 1} {lesson.title}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <Clock className="w-4 h-4 mr-1" />{" "}
                              {lesson.timeToComplete} min
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Call to action */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                Ready to start learning?
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400">
                    ✓
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Full course access
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400">
                    ✓
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Code examples & projects
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400">
                    ✓
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Progress tracking
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400">
                    ✓
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Certificate upon completion
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() =>
                    navigate(
                      `/courses/${course.id}/${course.modules[0]?.id}/${course.modules[0]?.lessons[0]?.id}`
                    )
                  }
                  className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center justify-center"
                >
                  Start Learning Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}