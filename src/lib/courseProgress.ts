import { User } from "./supabase";

// Types for course progress tracking
export interface CourseProgress {
  userId: string;
  courseId: string;
  completedLessons: string[]; // Lesson IDs
  lastAccessedAt: string;
  isCompleted: boolean;
  completedAt?: string;
}

// Mock database for course progress (would be replaced with actual backend implementation)
const userCourseProgressMap: Record<string, CourseProgress[]> = {};

// Get progress for all courses for a user
export function getUserCourseProgress(user: User): CourseProgress[] {
  return userCourseProgressMap[user.id] || [];
}

// Get progress for a specific course
export function getCourseProgress(user: User, courseId: string): CourseProgress | undefined {
  const userProgress = userCourseProgressMap[user.id] || [];
  return userProgress.find(progress => progress.courseId === courseId);
}

// Check if a lesson is completed
export function isLessonCompleted(user: User, courseId: string, lessonId: string): boolean {
  const courseProgress = getCourseProgress(user, courseId);
  return courseProgress ? courseProgress.completedLessons.includes(lessonId) : false;
}

// Mark a lesson as completed
export function markLessonAsCompleted(user: User, courseId: string, lessonId: string): CourseProgress {
  // Get existing progress or create a new one
  let courseProgress = getCourseProgress(user, courseId);
  
  if (!courseProgress) {
    courseProgress = {
      userId: user.id,
      courseId,
      completedLessons: [],
      lastAccessedAt: new Date().toISOString(),
      isCompleted: false
    };
    
    // Initialize user's progress array if needed
    if (!userCourseProgressMap[user.id]) {
      userCourseProgressMap[user.id] = [];
    }
    
    userCourseProgressMap[user.id].push(courseProgress);
  }
  
  // Check if lesson is already marked as completed
  if (!courseProgress.completedLessons.includes(lessonId)) {
    courseProgress.completedLessons.push(lessonId);
  }
  
  // Update last accessed time
  courseProgress.lastAccessedAt = new Date().toISOString();
  
  return courseProgress;
}

// Calculate overall course completion percentage
export function getCourseCompletionPercentage(user: User, courseId: string, totalLessons: number): number {
  const courseProgress = getCourseProgress(user, courseId);
  if (!courseProgress || totalLessons === 0) {
    return 0;
  }
  
  return Math.round((courseProgress.completedLessons.length / totalLessons) * 100);
}

// Mark course as completed
// Requires at least 80% of lessons to be completed
export function markCourseAsCompleted(user: User, courseId: string, totalLessons: number): CourseProgress | undefined {
  const courseProgress = getCourseProgress(user, courseId);
  if (courseProgress) {
    // Calculate completion percentage
    const completionPercentage = Math.round((courseProgress.completedLessons.length / totalLessons) * 100);
    
    // Only mark as completed if at least 80% of lessons are completed
    if (completionPercentage >= 80) {
      courseProgress.isCompleted = true;
      courseProgress.completedAt = new Date().toISOString();
    }
    return courseProgress;
  }
  return undefined;
}

// Check if course meets completion threshold (80%)
export function canCompleteCourse(user: User, courseId: string, totalLessons: number): boolean {
  const completionPercentage = getCourseCompletionPercentage(user, courseId, totalLessons);
  return completionPercentage >= 80;
}

// Get recently accessed courses
export function getRecentCourses(user: User, limit: number = 3): CourseProgress[] {
  const userProgress = userCourseProgressMap[user.id] || [];
  return [...userProgress]
    .sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime())
    .slice(0, limit);
}
