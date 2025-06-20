import { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, ArrowRight, GraduationCap } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Course } from '../../types/course';
import { User } from '../../lib/supabase';
import { isLessonCompleted } from '../../lib/courseProgress';

interface CourseNavigationProps {
  course: Course;
  user?: User;
}

export default function CourseNavigation({ course, user }: CourseNavigationProps) {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const { courseId, moduleId, lessonId } = useParams();

  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Check if a lesson is completed
  const checkLessonCompleted = (lessonId: string): boolean => {
    if (user && courseId) {
      return isLessonCompleted(user, courseId, lessonId);
    }
    return false;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Link 
          to={`/courses/${course.id}`}
          className="font-bold text-lg text-gray-900 dark:text-gray-100 hover:text-green-600 dark:hover:text-green-400"
        >
          {course.title}
        </Link>
      </div>
      <div className="p-2">
        {course.modules.map((module, index) => (
          <div key={module.id} className="mb-2">
            <button
              onClick={() => toggleModule(module.id)}
              className={`flex items-center justify-between w-full p-2 rounded-md text-left
                ${moduleId === module.id ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
            >
              <div className="flex items-center">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 mr-2 text-sm font-medium">
                  {index + 1}
                </div>
                <span>{module.title}</span>
              </div>
              {expandedModules[module.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            
            {expandedModules[module.id] && (
              <div className="ml-8 mt-1 space-y-1">
                {module.lessons.map((lesson) => {
                  const isActive = lessonId === lesson.id;
                  const lessonPath = `/courses/${course.id}/${module.id}/${lesson.id}`;
                  const isCompleted = checkLessonCompleted(lesson.id);
                  
                  return (
                    <Link
                      key={lesson.id}
                      to={lessonPath}
                      className={`flex items-center p-2 rounded-md text-sm
                        ${isActive 
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                          : isCompleted
                            ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                      {isCompleted ? (
                        <GraduationCap size={16} className="mr-2 text-green-500 dark:text-green-400" />
                      ) : (
                        <BookOpen size={16} className="mr-2" />
                      )}
                      <span>{lesson.title}</span>
                      {isActive && <ArrowRight size={14} className="ml-auto" />}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
