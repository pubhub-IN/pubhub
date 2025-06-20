import { Link } from 'react-router-dom';
import { Course } from '../../types/course';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  // Helper function to get badge color based on difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  // Calculate total lessons
  const totalLessons = course.modules.reduce((total, module) => {
    return total + module.lessons.length;
  }, 0);

  return (
    <Link 
      to={`/courses/${course.id}`}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getDifficultyColor(course.difficulty)}`}>
            {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {course.modules.length} modules · {totalLessons} lessons
          </span>
        </div>
        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">{course.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1 line-clamp-3">{course.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(course.updatedAt).toLocaleDateString()}
          </span>
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            Start Learning →
          </span>
        </div>
      </div>
    </Link>
  );
}
