import { Link } from 'react-router-dom';
import { Course } from '../../types/course';
import { Clock, BookOpen, Calendar } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  viewMode?: "grid" | "list" | "carousel" | "masonry";
  progress?: number;
}

export default function CourseCard({ course, progress }: CourseCardProps) {
  // Helper function to get badge color based on difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner':
        return 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 dark:from-green-900/70 dark:to-green-800/70 dark:text-green-300 border border-green-200 dark:border-green-800';
      case 'intermediate':
        return 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 dark:from-blue-900/70 dark:to-blue-800/70 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
      case 'advanced':
        return 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 dark:from-red-900/70 dark:to-red-800/70 dark:text-red-300 border border-red-200 dark:border-red-800';
      default:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 dark:from-gray-900/70 dark:to-gray-800/70 dark:text-gray-300 border border-gray-200 dark:border-gray-800';
    }
  };

  // Calculate total lessons
  const totalLessons = course.modules.reduce((total, module) => {
    return total + module.lessons.length;
  }, 0);

  // Estimate total duration (assuming average 10 mins per lesson)
  const totalMinutes = totalLessons * 10;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const durationText = hours > 0 
    ? `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`
    : `${minutes}m`;

  // Format date in a more readable way
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Determine if the course is available or coming soon
  const isAvailable = course.isAvailable !== false; // If not explicitly false, consider available

  // Render different components based on availability
  if (isAvailable) {
    return (
      <Link 
        to={`/courses/${course.id}`}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col relative group border border-gray-100 dark:border-gray-700 course-card-hover"
      >
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${getDifficultyColor(course.difficulty)} shadow-sm`}>
              {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
            </span>
          </div>
          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">{course.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1 line-clamp-3">{course.description}</p>
          
          {progress !== undefined && (
            <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <BookOpen className="w-3.5 h-3.5 mr-1.5 text-green-500 dark:text-green-400" />
              <span>{course.modules.length} modules · {totalLessons} lessons</span>
            </div>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-green-500 dark:text-green-400" />
              <span>{durationText}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-green-500 dark:text-green-400" />
              <span>Updated {formatDate(course.updatedAt)}</span>
            </div>
            <span className="inline-flex items-center text-sm font-medium text-green-600 dark:text-green-400 group-hover:translate-x-0.5 transition-transform duration-300">
              Start Learning
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    );
  } else {
    // Coming soon version
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col relative group border border-gray-100 dark:border-gray-700">
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${getDifficultyColor(course.difficulty)} shadow-sm`}>
              {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
            </span>
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold px-3 py-1.5 rounded-lg shadow-md">
              Coming Soon
            </span>
          </div>
          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100 line-clamp-2">{course.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1 line-clamp-3">{course.description}</p>
          
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <BookOpen className="w-3.5 h-3.5 mr-1.5 text-amber-500 dark:text-amber-400" />
              <span>{course.modules.length} modules · {totalLessons} lessons</span>
            </div>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-500 dark:text-amber-400" />
              <span>{durationText}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-amber-500 dark:text-amber-400" />
              <span>Expected {formatDate(course.updatedAt)}</span>
            </div>
            <button 
              className="px-4 py-1.5 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 dark:from-amber-900/30 dark:to-amber-900/50 dark:text-amber-400 rounded-lg text-sm font-medium cursor-not-allowed shadow-sm"
              disabled
            >
              Notify Me
            </button>
          </div>
        </div>
      </div>
    );
  }
}
