import { useParams, Link } from "react-router-dom";
import {
  Award,
  ArrowLeft,
  Download,
  BarChart,
  CheckCircle,
  Share2,
  AlertCircle,
} from "lucide-react";
import { getCourseById } from "../../courses/courseData";
import { AuthUser } from "../../lib/auth-jwt";
import {
  getCourseCompletionPercentage,
  markCourseAsCompleted,
  canCompleteCourse,
} from "../../lib/courseProgress";
import { useEffect, useState } from "react";

interface CourseCompletionPageProps {
  user: AuthUser;
}

export default function CourseCompletionPage({
  user,
}: CourseCompletionPageProps) {
  const { courseId } = useParams();
  const [canComplete, setCanComplete] = useState(false);
  const course = getCourseById(courseId || "");

  // Calculate total lessons
  const totalLessons =
    course?.modules.reduce((total, module) => {
      return total + module.lessons.length;
    }, 0) || 0;

  // Get completion percentage
  const completionPercentage = courseId
    ? getCourseCompletionPercentage(user, courseId, totalLessons)
    : 0;

  // Check if user can complete the course and mark as completed on first render
  useEffect(() => {
    if (user && courseId && totalLessons) {
      // Check if course meets 80% completion threshold
      const meetsRequirement = canCompleteCourse(user, courseId, totalLessons);
      setCanComplete(meetsRequirement);

      if (meetsRequirement) {
        markCourseAsCompleted(user, courseId, totalLessons);
      }
    }
  }, [user, courseId, totalLessons]);

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

  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div
            className={`p-8 text-center text-white ${
              canComplete
                ? "bg-gradient-to-r from-green-600 to-green-700"
                : "bg-gradient-to-r from-amber-500 to-amber-600"
            }`}
          >
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              {canComplete ? (
                <Award className="w-12 h-12 text-green-600" />
              ) : (
                <AlertCircle className="w-12 h-12 text-amber-500" />
              )}
            </div>

            {canComplete ? (
              <>
                <h1 className="text-3xl font-bold mb-3">Course Completed!</h1>
                <p className="text-green-100 mb-4">
                  Congratulations, you've completed the {course.title} course.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold mb-3">Almost There!</h1>
                <p className="text-amber-100 mb-4">
                  You've made progress on the {course.title} course, but need to
                  complete at least 80% to earn your certificate.
                </p>
              </>
            )}

            <div className="flex justify-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle
                  className={`w-5 h-5 ${
                    canComplete ? "text-green-300" : "text-amber-300"
                  }`}
                />
                <span>{completionPercentage}% Complete</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart
                  className={`w-5 h-5 ${
                    canComplete ? "text-green-300" : "text-amber-300"
                  }`}
                />
                <span>{totalLessons} Lessons</span>
              </div>
            </div>
          </div>

          {canComplete ? (
            // Certificate (only shown when >= 80% complete)
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-center">
                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-1">
                  Certificate of Completion
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  This certifies that
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  {user.name || user.github_username}
                </p>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  has successfully completed the course
                </p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400 mb-6">
                  {course.title}
                </p>
                <p className="text-gray-500 dark:text-gray-400 mb-1">
                  on {formattedDate}
                </p>
                <div className="w-24 h-1 bg-green-600 mx-auto my-4"></div>
                <p className="text-gray-800 dark:text-gray-200 font-semibold">
                  PubHub Learning
                </p>
              </div>

              <div className="flex justify-center mt-6">
                <button className="flex items-center gap-2 px-4 py-2 bg-green-200 dark:bg-green-700 hover:bg-green-300 dark:hover:bg-green-600 text-green-800 dark:text-green-200 rounded-md transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Download Certificate</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 ml-4 bg-green-100 dark:bg-green-900/40 hover:bg-green-200 dark:hover:bg-green-900 text-green-700 dark:text-green-400 rounded-md transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Share Achievement</span>
                </button>
              </div>
            </div>
          ) : (
            // Progress message (shown when < 80% complete)
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  Complete More Lessons
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  You need to complete at least 80% of the lessons to earn your
                  certificate. You've currently completed {completionPercentage}
                  %.
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full rounded-full ${
                      completionPercentage >= 80
                        ? "bg-green-500"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Keep going! You're making great progress.
                </p>
                <Link
                  to={`/start-learning/course/${courseId}`}
                  className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                >
                  Continue Learning
                </Link>
              </div>
            </div>
          )}

          {/* Next steps */}
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              What's Next?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    Explore More Courses
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Continue your learning journey with our other courses.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <Link
                to={`/start-learning/course/${courseId}`}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to course</span>
              </Link>
              <Link
                to="/start-learning"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
              >
                Explore More Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}