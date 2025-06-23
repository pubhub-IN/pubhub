import { Link } from 'react-router-dom';
import { Clock, BookOpen } from 'lucide-react';
import { User } from '../../lib/supabase';
import { getRecentCourses, getTotalLessonCount, getNextLessonPath } from '../../lib/courseProgress';
import { getCourseById } from '../../courses/courseData';

interface RecentCoursesProps {
  user: User;
  limit?: number;
}

export default function RecentCourses({ user, limit = 3 }: RecentCoursesProps) {
  const recentCourses = getRecentCourses(user, limit);
  
  if (recentCourses.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-block p-3 bg-gray-100 dark:bg-gray-800 rounded-full mb-3">
          <Clock className="h-6 w-6 text-gray-500 dark:text-gray-400" />
        </div>
        <h3 className="text-gray-700 dark:text-gray-300 mb-2">No courses yet</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          You haven't started any courses yet.
        </p>
        <Link 
          to="/start-learning" 
          className="inline-block mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
        >
          Browse Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recentCourses.map(progress => {
        const course = getCourseById(progress.courseId);
        if (!course) return null;
        
        return (
          <div 
            key={progress.courseId}
            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 transition-colors"
          >
            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <Link
                to={`/courses/${course.id}`}
                className="block font-semibold text-gray-900 dark:text-gray-100 hover:text-green-600 dark:hover:text-green-400 truncate"
              >
                {course.title}
              </Link>
              <div className="flex items-center gap-4 mt-1 text-sm">
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <BookOpen className="w-3 h-3" />
                  <span>{course.modules.length} modules</span>
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  {progress.isCompleted ? (
                    <span className="text-green-600 dark:text-green-400">Completed</span>
                  ) : (
                    <span>{Math.round((progress.completedLessons.length / getTotalLessonCount(course)) * 100)}% complete</span>
                  )}
                </div>
              </div>
            </div>
            <Link
              to={getNextLessonPath(course, progress.completedLessons)}
              className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-sm font-medium"
            >
              {progress.isCompleted ? 'Review' : 'Continue'}
            </Link>
          </div>
        );
      })}
      
      <div className="text-center pt-2">
        <Link 
          to="/start-learning" 
          className="inline-block text-green-600 dark:text-green-400 hover:underline"
        >
          View all courses
        </Link>
      </div>
    </div>
  );
}

// Helper functions are now in /lib/courseProgress.ts
