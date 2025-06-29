import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  Award,
  Check,
  AlertTriangle,
} from "lucide-react";
import { getCourseById } from "../../courses/courseData";
import CourseNavigation from "../../components/learning/CourseNavigation";
import LessonContentRenderer from "../../components/learning/LessonContentRenderer";
import {
  markLessonAsCompleted,
  isLessonCompleted,
  canCompleteCourse,
  getCourseCompletionPercentage,
} from "../../lib/courseProgress";
import { AuthUser } from "../../lib/auth-jwt";
import { useLocation } from "react-router-dom";
// import CourseCompletionPage from './CourseCompletionPage';

// Create a prop interface for the LessonPage component
interface LessonPageProps {
  user: AuthUser;
}

export default function LessonPage({ user }: LessonPageProps) {
  const { courseId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [canComplete, setCanComplete] = useState(false);

  // Fetch course data
  const course = getCourseById(courseId || "");

  // Calculate total lessons in the course
  const totalLessons =
    course?.modules.reduce((total, module) => {
      return total + module.lessons.length;
    }, 0) || 0;

  // Check if the lesson is already completed and if course can be completed
  useEffect(() => {
    if (user && courseId && lessonId) {
      // Check if this specific lesson is completed
      const completed = isLessonCompleted(user, courseId, lessonId);
      setIsCompleted(completed);

      // Check if the course meets the 80% completion requirement
      if (totalLessons > 0) {
        const meetsRequirement = canCompleteCourse(
          user,
          courseId,
          totalLessons
        );
        setCanComplete(meetsRequirement);
      }
    }
  }, [user, courseId, lessonId, location.pathname, totalLessons]);

  // Handle marking a lesson as complete
  const handleMarkComplete = () => {
    if (user && courseId && lessonId) {
      markLessonAsCompleted(user, courseId, lessonId);
      setIsCompleted(true);

      // Check if the course now meets the 80% completion requirement after marking this lesson
      if (totalLessons > 0) {
        const meetsRequirement = canCompleteCourse(
          user,
          courseId,
          totalLessons
        );
        setCanComplete(meetsRequirement);
      }

      // Navigate to the next lesson if available
      if (nextLesson) {
        navigate(
          `/courses/${courseId}/${nextLesson.moduleId}/${nextLesson.lessonId}`
        );
      }
    }
  };

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

  // Find current module and lesson
  const currentModule = course.modules.find((m) => m.id === moduleId);
  const currentLesson = currentModule?.lessons.find((l) => l.id === lessonId);

  if (!currentModule || !currentLesson) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Lesson Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We couldn't find the lesson you're looking for.
        </p>
        <Link
          to={`/courses/${courseId}`}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Back to Course
        </Link>
      </div>
    );
  }

  // Calculate navigation
  const moduleIndex = course.modules.findIndex((m) => m.id === moduleId);
  const lessonIndex = currentModule.lessons.findIndex((l) => l.id === lessonId);

  // Define navigation type
  type LessonNavigation = {
    moduleId: string;
    lessonId: string;
  } | null;

  // Previous lesson logic
  let previousLesson: LessonNavigation = null;
  if (lessonIndex > 0) {
    // Previous lesson in the same module
    previousLesson = {
      moduleId: currentModule.id,
      lessonId: currentModule.lessons[lessonIndex - 1].id,
    };
  } else if (moduleIndex > 0) {
    // Last lesson of the previous module
    const prevModule = course.modules[moduleIndex - 1];
    const prevLessonIndex = prevModule.lessons.length - 1;
    previousLesson = {
      moduleId: prevModule.id,
      lessonId: prevModule.lessons[prevLessonIndex].id,
    };
  }

  // Next lesson logic
  let nextLesson: LessonNavigation = null;
  if (lessonIndex < currentModule.lessons.length - 1) {
    // Next lesson in the same module
    nextLesson = {
      moduleId: currentModule.id,
      lessonId: currentModule.lessons[lessonIndex + 1].id,
    };
  } else if (moduleIndex < course.modules.length - 1) {
    // First lesson of the next module
    const nextModule = course.modules[moduleIndex + 1];
    nextLesson = {
      moduleId: nextModule.id,
      lessonId: nextModule.lessons[0].id,
    };
  }

  // Get course completion percentage
  const completionPercentage = courseId
    ? getCourseCompletionPercentage(user, courseId, totalLessons)
    : 0;

  // Navigate to previous lesson
  const goToPrevious = () => {
    if (previousLesson) {
      navigate(
        `/courses/${courseId}/${previousLesson.moduleId}/${previousLesson.lessonId}`
      );
    }
  };

  // Navigate to next lesson
  const goToNext = () => {
    if (nextLesson) {
      navigate(
        `/courses/${courseId}/${nextLesson.moduleId}/${nextLesson.lessonId}`
      );
    }
  };

  return (
    <div className="flex flex-col h-full ml-8">
      {/* Course header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 px-6">
        <div className="flex justify-between items-center">
          <div>
            <Link
              to={`/courses/${courseId}`}
              className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
            >
              {course.title}
            </Link>
            <h1 className="text-xl font-bold mt-1">{currentLesson.title}</h1>
          </div>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="hidden md:flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <BookOpen size={16} />
            <span>{showSidebar ? "Hide" : "Show"} Contents</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <div className="hidden md:block w-80 flex-shrink-0 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
            <CourseNavigation course={course} user={user} />
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-6">
            {/* Progress indicator when on last lesson */}
            {!nextLesson && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Course Progress</h3>
                  <span className="text-sm font-medium">
                    {completionPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      completionPercentage >= 80
                        ? "bg-green-500"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                {!canComplete && !nextLesson && (
                  <p className="mt-2 text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <AlertTriangle size={14} />
                    <span>
                      Complete at least 80% of lessons to finish the course
                    </span>
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <Clock size={16} />
              <span>
                Est. time to complete: {currentLesson.timeToComplete} min
              </span>
            </div>

            {/* Lesson content */}
            <div className="mb-8">
              {currentLesson.content.map((contentItem, index) => (
                <LessonContentRenderer key={index} content={contentItem} />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-12 pb-12">
              <button
                onClick={goToPrevious}
                disabled={!previousLesson}
                className={`flex items-center gap-2 px-4 py-2 rounded-md
                  ${
                    previousLesson
                      ? "bg-green-100 hover:bg-green-200 dark:bg-green-800 dark:hover:bg-green-700 text-green-800 dark:text-green-200"
                      : "bg-green-100 dark:bg-green-800 text-green-400 dark:text-green-600 cursor-not-allowed"
                  }`}
              >
                <ChevronLeft size={16} />
                <span>Previous Lesson</span>
              </button>

              <div className="flex gap-3">
                {!isCompleted && (
                  <button
                    onClick={handleMarkComplete}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                  >
                    <Check size={16} />
                    <span>Mark Complete</span>
                  </button>
                )}

                {nextLesson ? (
                  <button
                    onClick={goToNext}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                  >
                    <span>Next Lesson</span>
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <>
                    {canComplete ? (
                      <button
                        onClick={() =>
                          navigate(`/courses/${courseId}/complete`)
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                      >
                        <Award size={16} />
                        <span>Complete Course</span>
                      </button>
                    ) : (
                      <Link
                        to={`/courses/${courseId}`}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                      >
                        <BookOpen size={16} />
                        <span>Continue Learning</span>
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}