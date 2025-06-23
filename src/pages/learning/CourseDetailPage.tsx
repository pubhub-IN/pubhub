import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourseById } from '../../courses/courseData';
import { startOrResumeCourse } from '../../lib/courseProgress';
import { Course, Module, Lesson } from '../../types/course';
import { User } from '../../lib/supabase';
import { Clock, Award, Calendar, Book } from 'lucide-react';

interface CourseDetailPageProps {
  user: User;
}

export default function CourseDetailPage({ user }: CourseDetailPageProps) {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const course = getCourseById(courseId || '');

  const handleStartCourse = () => {
    if (course) {
      const firstModule = course.modules[0];
      const firstLesson = firstModule?.lessons[0];
      if (firstModule && firstLesson) {
        startOrResumeCourse(user, course.id);
        navigate(`/courses/${course.id}/${firstModule.id}/${firstLesson.id}`);
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
  
  // Calculate total lessons and estimated completion time
  const totalLessons = course.modules.reduce((total, module) => {
    return total + module.lessons.length;
  }, 0);
  
  const totalMinutes = course.modules.reduce((total, module) => {
    return total + module.lessons.reduce((moduleTotal, lesson) => {
      return moduleTotal + lesson.timeToComplete;
    }, 0);
  }, 0);
  
  // Convert minutes to hours and minutes
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-4">
            <span className={`inline-block px-4 py-2 text-sm font-semibold rounded-full ${getDifficultyColor(course.difficulty)}`}>
              {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{course.title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{course.description}</p>
          
          <div className="flex flex-wrap gap-6 mb-8 text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900">
                <Book className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Modules</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{course.modules.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-green-100 dark:bg-green-900">
                <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Lessons</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{totalLessons}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-purple-100 dark:bg-purple-900">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
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
                <p className="text-sm text-gray-500 dark:text-gray-400">Updated</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {new Date(course.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleStartCourse}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg"
          >
            Start Course
          </button>
        </div>

        {/* Modules */}
        <div className="mt-12">
          {course.modules.map((module, index) => (
            <div key={module.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md mb-8">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Module {index + 1}: {module.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {module.lessons.length} {module.lessons.length === 1 ? 'lesson' : 'lessons'}
                </p>
              </div>
              <div>
                {module.lessons.map((lesson, lessonIndex) => (
                  <div key={lesson.id} className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-700 dark:text-gray-300">
                        {index + 1}.{lessonIndex + 1} {lesson.title}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <Clock className="w-4 h-4 mr-1" /> {lesson.timeToComplete} min
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
