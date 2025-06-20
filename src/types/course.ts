export interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  image: string;
  difficulty: CourseDifficulty;
  modules: Module[];
  creator: string;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content: LessonContent[];
  timeToComplete: number; // in minutes
}

export interface LessonContent {
  type: 'text' | 'code' | 'image' | 'video';
  content: string;
  language?: string; // for code blocks
  caption?: string; // for images and videos
}

export type CourseCategory = 
  | 'dsa' 
  | 'javascript' 
  | 'typescript'
  | 'python'
  | 'mern' 
  | 'mean' 
  | 'rust' 
  | 'go' 
  | 'frontend' 
  | 'backend' 
  | 'devops' 
  | 'blockchain' 
  | 'web3' 
  | 'web2'
  | 'other';

export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced';
