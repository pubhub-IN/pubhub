import { Course } from "../types/course";
import { advancedCourses } from "./advancedCourses";

// Define course templates first
export const courseTemplates = [
  {
    id: "typescript-essentials",
    title: "TypeScript Essentials",
    description: "A comprehensive guide to TypeScript, covering types, interfaces, generics, and advanced features.",
    category: "typescript",
    image: "https://images.unsplash.com/photo-1613490900233-141c5560d75d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    difficulty: "intermediate",
    creator: "PubHub Team",
  },
  {
    id: "python-programming",
    title: "Python Programming Mastery",
    description: "Learn Python from basics to advanced concepts, including data structures, functions, OOP, and practical applications.",
    category: "python",
    image: "https://images.unsplash.com/photo-1649180556628-9ba704115795?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
    difficulty: "beginner",
    creator: "PubHub Team",
  },
  {
    id: "mean-stack",
    title: "MEAN Stack Development",
    description: "Build full-stack web applications with MongoDB, Express.js, Angular, and Node.js.",
    category: "mean",
    image: "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    difficulty: "intermediate",
    creator: "PubHub Team",
  },
  {
    id: "go-programming",
    title: "Go Programming Language",
    description: "Learn Go (Golang) for efficient and concurrent systems programming.",
    category: "go",
    image: "https://images.unsplash.com/photo-1592487939742-4295de31b3d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    difficulty: "intermediate",
    creator: "PubHub Team",
  },
  {
    id: "frontend-mastery",
    title: "Frontend Development Mastery",
    description: "Master modern frontend development with HTML5, CSS3, JavaScript, and popular frameworks like React.",
    category: "frontend",
    image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    difficulty: "intermediate",
    creator: "PubHub Team",
  },
  {
    id: "backend-architecture",
    title: "Backend Architecture & Development",
    description: "Learn to design and implement robust backend systems with Node.js, databases, and API design.",
    category: "backend",
    image: "https://images.unsplash.com/photo-1603575448360-153f093fd0b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    difficulty: "advanced",
    creator: "PubHub Team",
  },
  {
    id: "devops-essentials",
    title: "DevOps Essentials",
    description: "Learn DevOps practices, CI/CD, containerization, and cloud infrastructure management.",
    category: "devops",
    image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    difficulty: "advanced",
    creator: "PubHub Team",
  },
  {
    id: "blockchain-development",
    title: "Blockchain Development Fundamentals",
    description: "Introduction to blockchain technology, smart contracts, and decentralized applications.",
    category: "blockchain",
    image: "https://images.unsplash.com/photo-1642302776196-cdcc66106922?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    difficulty: "intermediate",
    creator: "PubHub Team",
  },
  {
    id: "web3-development",
    title: "Web3 Development",
    description: "Build decentralized applications with Ethereum, Web3.js, and related technologies.",
    category: "web3",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    difficulty: "advanced",
    creator: "PubHub Team",
  },
  {
    id: "web2-optimization",
    title: "Web2 Development & Optimization",
    description: "Master modern web development practices for optimal performance, SEO, and user experience.",
    category: "web2",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    difficulty: "intermediate",
    creator: "PubHub Team",
  }
];

// Helper function to create a complete course from a template
function createCourseFromTemplate(template: Partial<Course>): Course {
  return {
    id: template.id || "",
    title: template.title || "",
    description: template.description || "",
    category: template.category || "other",
    image: template.image || "",
    difficulty: template.difficulty || "beginner",
    creator: template.creator || "PubHub Team",
    createdAt: template.createdAt || "2025-06-01T00:00:00Z",
    updatedAt: template.updatedAt || "2025-06-15T00:00:00Z",
    modules: template.modules || [
      {
        id: `${template.id}-m1`,
        title: "Getting Started",
        description: "Introduction to the course content",
        lessons: [
          {
            id: `${template.id}-m1-l1`,
            title: "Welcome to the Course",
            timeToComplete: 10,
            content: [
              { 
                type: "text", 
                content: `Welcome to ${template.title}! In this course, you will learn all about ${template.description}`
              },
              { 
                type: "text", 
                content: "This is a placeholder for the course content. The full course is coming soon!"
              }
            ]
          }
        ]
      }
    ]
  };
}

// Sample courses data
const baseCourses: Course[] = [
  {
    id: "dsa-101",
    title: "Data Structures and Algorithms Fundamentals",
    description: "Learn the essential data structures and algorithms concepts that form the foundation of computer science and software engineering.",
    category: "dsa",
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    difficulty: "beginner",
    creator: "PubHub Team",
    createdAt: "2025-05-15T00:00:00Z",
    updatedAt: "2025-06-10T00:00:00Z",
    modules: [
      {
        id: "dsa-101-m1",
        title: "Introduction to Data Structures",
        description: "Understanding the basics of data structures and their importance in programming.",
        lessons: [
          {
            id: "dsa-101-m1-l1",
            title: "What are Data Structures?",
            timeToComplete: 15,
            content: [
              { 
                type: "text", 
                content: "Data structures are specialized formats for organizing, processing, retrieving, and storing data. They provide a way to manage large amounts of data efficiently for uses such as large databases and internet indexing services."
              },
              { 
                type: "text", 
                content: "Why are data structures important? They allow programmers to:"
              },
              { 
                type: "text", 
                content: "- Process data efficiently\n- Design optimal algorithms\n- Manage memory usage\n- Improve performance of applications"
              },
              {
                type: "code",
                language: "javascript",
                content: "// Example of a simple data structure in JavaScript\nconst array = [1, 2, 3, 4, 5];\n\n// Accessing elements\nconsole.log(array[0]); // Output: 1\n\n// Adding elements\narray.push(6);\nconsole.log(array); // Output: [1, 2, 3, 4, 5, 6]"
              }
            ]
          },
          {
            id: "dsa-101-m1-l2",
            title: "Arrays and Linked Lists",
            timeToComplete: 20,
            content: [
              { 
                type: "text", 
                content: "Arrays and linked lists are two of the most fundamental data structures in computer science. Each has its own strengths and weaknesses."
              },
              { 
                type: "text", 
                content: "**Arrays**:\n- Contiguous memory allocation\n- Constant-time access by index\n- Fixed size in many languages (though dynamic in JavaScript)\n- Efficient for random access"
              },
              { 
                type: "text", 
                content: "**Linked Lists**:\n- Non-contiguous memory allocation\n- Linear-time access to elements\n- Dynamic size\n- Efficient for insertions and deletions"
              },
              {
                type: "code",
                language: "javascript",
                content: "// Implementing a simple Linked List in JavaScript\nclass Node {\n  constructor(data) {\n    this.data = data;\n    this.next = null;\n  }\n}\n\nclass LinkedList {\n  constructor() {\n    this.head = null;\n  }\n\n  append(data) {\n    const newNode = new Node(data);\n    \n    if (!this.head) {\n      this.head = newNode;\n      return;\n    }\n    \n    let current = this.head;\n    while (current.next) {\n      current = current.next;\n    }\n    \n    current.next = newNode;\n  }\n\n  print() {\n    let current = this.head;\n    const values = [];\n    \n    while (current) {\n      values.push(current.data);\n      current = current.next;\n    }\n    \n    console.log(values.join(' -> '));\n  }\n}\n\n// Usage\nconst list = new LinkedList();\nlist.append(1);\nlist.append(2);\nlist.append(3);\nlist.print(); // Output: 1 -> 2 -> 3"
              }
            ]
          }
        ]
      },
      {
        id: "dsa-101-m2",
        title: "Basic Algorithms",
        description: "Understanding fundamental algorithmic concepts and time complexity.",
        lessons: [
          {
            id: "dsa-101-m2-l1",
            title: "Introduction to Algorithms",
            timeToComplete: 15,
            content: [
              { 
                type: "text", 
                content: "An algorithm is a step-by-step procedure for solving a problem or accomplishing a task. In computer programming, algorithms are the foundation for efficient problem-solving."
              },
              { 
                type: "text", 
                content: "Characteristics of a good algorithm:\n- Correctness: Produces the correct output for all valid inputs\n- Efficiency: Uses minimal resources (time and space)\n- Simplicity: Easy to understand and implement\n- Optimality: Achieves the best possible performance"
              },
              {
                type: "code",
                language: "javascript",
                content: "// Simple algorithm to find the maximum number in an array\nfunction findMax(arr) {\n  if (arr.length === 0) {\n    return null;\n  }\n  \n  let max = arr[0];\n  \n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] > max) {\n      max = arr[i];\n    }\n  }\n  \n  return max;\n}\n\n// Usage\nconst numbers = [3, 7, 1, 9, 4, 6];\nconsole.log(findMax(numbers)); // Output: 9"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "js-fundamentals",
    title: "JavaScript from Scratch",
    description: "A comprehensive guide to modern JavaScript programming, from fundamentals to advanced concepts.",
    category: "javascript",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    difficulty: "beginner",
    creator: "PubHub Team",
    createdAt: "2025-04-20T00:00:00Z",
    updatedAt: "2025-06-15T00:00:00Z",
    modules: [
      {
        id: "js-fundamentals-m1",
        title: "JavaScript Basics",
        description: "Getting started with JavaScript programming language fundamentals.",
        lessons: [
          {
            id: "js-fundamentals-m1-l1",
            title: "Variables and Data Types",
            timeToComplete: 20,
            content: [
              { 
                type: "text", 
                content: "JavaScript has several data types that are crucial to understand for effective programming. Let's explore the fundamental data types and how to declare variables."
              },
              { 
                type: "text", 
                content: "JavaScript has the following primitive data types:\n- **String**: For text\n- **Number**: For integers and floating-point numbers\n- **Boolean**: true or false\n- **undefined**: Variable declared but not assigned\n- **null**: Deliberately empty value\n- **Symbol**: Unique and immutable identifier\n- **BigInt**: For integers larger than Number can represent"
              },
              {
                type: "code",
                language: "javascript",
                content: "// Variable declaration with different data types\n\n// Using let (block-scoped, can be reassigned)\nlet name = 'John'; // String\nlet age = 25;      // Number\nlet isActive = true; // Boolean\n\n// Using const (block-scoped, cannot be reassigned)\nconst PI = 3.14159;\nconst DAYS_IN_WEEK = 7;\n\n// Using var (function-scoped, can be reassigned, older syntax)\nvar count = 0;\n\nconsole.log(typeof name);     // Output: string\nconsole.log(typeof age);      // Output: number\nconsole.log(typeof isActive); // Output: boolean\n\n// Multiple assignments\nlet x, y, z;\nx = 5;\ny = 6;\nz = x + y;\nconsole.log(z); // Output: 11"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "mern-stack",
    title: "MERN Stack Development",
    description: "Learn to build full-stack web applications using MongoDB, Express.js, React, and Node.js.",
    category: "mern",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    difficulty: "intermediate",
    creator: "PubHub Team",
    createdAt: "2025-03-10T00:00:00Z",
    updatedAt: "2025-06-05T00:00:00Z",
    modules: [
      {
        id: "mern-stack-m1",
        title: "Introduction to MERN Stack",
        description: "Understanding the components of the MERN stack and how they work together.",
        lessons: [
          {
            id: "mern-stack-m1-l1",
            title: "What is MERN Stack?",
            timeToComplete: 15,
            content: [
              { 
                type: "text", 
                content: "MERN stack is a collection of JavaScript-based technologies used to develop web applications. The stack consists of MongoDB, Express.js, React, and Node.js."
              },
              { 
                type: "text", 
                content: "**M** - MongoDB: A NoSQL database that stores data in JSON-like format\n**E** - Express.js: A web application framework for Node.js\n**R** - React: A frontend library for building user interfaces\n**N** - Node.js: A JavaScript runtime environment for server-side programming"
              },
              { 
                type: "text", 
                content: "The MERN stack allows developers to build end-to-end applications using JavaScript throughout the entire stack, making development more consistent and efficient."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "rust-intro",
    title: "Rust Programming for Beginners",
    description: "Learn the fundamentals of Rust, a systems programming language focused on safety, speed, and concurrency.",
    category: "rust",
    image: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    difficulty: "beginner",
    creator: "PubHub Team",
    createdAt: "2025-04-05T00:00:00Z",
    updatedAt: "2025-05-30T00:00:00Z",
    modules: [
      {
        id: "rust-intro-m1",
        title: "Getting Started with Rust",
        description: "Setting up your development environment and understanding Rust's core concepts.",
        lessons: [
          {
            id: "rust-intro-m1-l1",
            title: "Why Rust?",
            timeToComplete: 10,
            content: [
              { 
                type: "text", 
                content: "Rust is a systems programming language that focuses on safety, speed, and concurrency. It was created by Mozilla Research as an alternative to C++ that provides memory safety without using garbage collection."
              },
              { 
                type: "text", 
                content: "Key features of Rust:\n- **Memory Safety**: Rust's ownership system ensures memory safety without a garbage collector\n- **Concurrency**: Safe concurrency without data races\n- **Zero-Cost Abstractions**: High-level features with no runtime overhead\n- **Pattern Matching**: Powerful pattern matching for complex data types\n- **Type Inference**: The compiler can infer types in many cases\n- **Minimal Runtime**: No runtime or garbage collector, can run in embedded environments"
              }
            ]
          }
        ]
      }
    ]
  }
];

// Create the final courses array by combining all course sources
export const courses: Course[] = [
  ...baseCourses,
  ...advancedCourses,
  ...courseTemplates.map(template => createCourseFromTemplate(template as Partial<Course>))
];

// Helper function to get all unique categories
export function getAllCategories(): string[] {
  const categories = new Set(courses.map(course => course.category));
  return Array.from(categories);
}

// Helper function to get course by ID
export function getCourseById(id: string): Course | undefined {
  return courses.find(course => course.id === id);
}

// Helper function to get courses by category
export function getCoursesByCategory(category: string): Course[] {
  return courses.filter(course => course.category === category);
}
