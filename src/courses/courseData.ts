import { Course } from "../types/course";
import { advancedCourses } from "./advancedCourses";

// Define the categories that are available (not coming soon)
const allowedCategories = ["dsa", "javascript"];

// Define course templates first
export const courseTemplates = [
  {
    id: "typescript-essentials",
    title: "TypeScript Essentials",
    description: "A comprehensive guide to TypeScript, covering types, interfaces, generics, and advanced features.",
    category: "typescript",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    difficulty: "intermediate",
    creator: "PubHub Team",
  },
  {
    id: "python-programming",
    title: "Python Programming Mastery",
    description: "Learn Python from basics to advanced concepts, including data structures, functions, OOP, and practical applications.",
    category: "python",
    image: "https://images.unsplash.com/photo-1526379879527-8559ecfd8bf7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
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
    image: "https://images.unsplash.com/photo-1600267204091-5c1ab8b10c02?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    difficulty: "intermediate",
    creator: "PubHub Team",
  },
  {
    id: "frontend-mastery",
    title: "Frontend Development Mastery",
    description: "Master modern frontend development with HTML5, CSS3, JavaScript, and popular frameworks like React.",
    category: "frontend",
    image: "https://images.unsplash.com/photo-1581276879432-15e50529f34b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    difficulty: "intermediate",
    creator: "PubHub Team",
  },
  {
    id: "backend-architecture",
    title: "Backend Architecture & Development",
    description: "Learn to design and implement robust backend systems with Node.js, databases, and API design.",
    category: "backend",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    difficulty: "advanced",
    creator: "PubHub Team",
  },
  {
    id: "devops-essentials",
    title: "DevOps Essentials",
    description: "Learn DevOps practices, CI/CD, containerization, and cloud infrastructure management.",
    category: "devops",
    image: "https://images.unsplash.com/photo-1607743386760-88ac62b89b8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    difficulty: "advanced",
    creator: "PubHub Team",
  },
  {
    id: "blockchain-development",
    title: "Blockchain Development Fundamentals",
    description: "Introduction to blockchain technology, smart contracts, and decentralized applications.",
    category: "blockchain",
    image: "https://images.unsplash.com/photo-1644143379190-08d601663834?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    difficulty: "intermediate",
    creator: "PubHub Team",
  },
  {
    id: "web3-development",
    title: "Web3 Development",
    description: "Build decentralized applications with Ethereum, Web3.js, and related technologies.",
    category: "web3",
    image: "https://images.unsplash.com/photo-1621501103258-3e135c8c1fda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    difficulty: "advanced",
    creator: "PubHub Team",
  },
  {
    id: "web2-optimization",
    title: "Web2 Development & Optimization",
    description: "Master modern web development practices for optimal performance, SEO, and user experience.",
    category: "web2",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80",
    difficulty: "intermediate",
    creator: "PubHub Team",
  }
];

// Helper function to create a complete course from a template
function createCourseFromTemplate(template: Partial<Course>): Course {
  const category = template.category || "other";
  // Only certain categories are available now
  const isAvailable = allowedCategories.includes(category);
  
  return {
    id: template.id || "",
    title: template.title || "",
    description: template.description || "",
    category: category,
    image: template.image || "",
    difficulty: template.difficulty || "beginner",
    creator: template.creator || "PubHub Team",
    createdAt: template.createdAt || "2025-06-01T00:00:00Z",
    updatedAt: template.updatedAt || "2025-06-15T00:00:00Z",
    isAvailable: isAvailable,
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
    image: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2089&q=80",
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
          },
          {
            id: "dsa-101-m2-l2",
            title: "Bubble Sort",
            timeToComplete: 25,
            content: [
              {
                type: "text",
                content: "**Bubble Sort** is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted."
              },
              {
                type: "code",
                language: "cpp",
                content: "// Bubble sort in C++\nvoid bubbleSort(int arr[], int n)\n{\n    int temp;\n    bool swapped;\n    for (int i = 0; i < n - 1; i++)\n    {\n        swapped = false;\n        for (int j = 0; j < n - i - 1; j++)\n        {\n            if (arr[j] > arr[j + 1])\n            {\n                temp = arr[j];\n                arr[j] = arr[j + 1];\n                arr[j + 1] = temp;\n                swapped = true;\n            }\n        }\n        if (swapped == false)\n            break;\n    }\n}"
              }
            ]
          },
          {
            id: "dsa-101-m2-l3",
            title: "Insertion Sort",
            timeToComplete: 20,
            content: [
              {
                type: "text",
                content: "**Insertion sort** is a simple sorting algorithm that builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort."
              },
              {
                type: "code",
                language: "cpp",
                content: "// Insertion sort in C++\nvoid insertionSort(int arr[], int n)\n{\n    int i, key, j;\n    for (i = 1; i < n; i++)\n    {\n        key = arr[i];\n        j = i - 1;\n\n        /* Move elements of arr[0..i-1], that are\n           greater than key, to one position ahead\n           of their current position */\n        while (j >= 0 && arr[j] > key)\n        {\n            arr[j + 1] = arr[j];\n            j = j - 1;\n        }\n        arr[j + 1] = key;\n    }\n}"
              }
            ]
          },
          {
            id: 'dsa-101-m2-l4',
            title: 'Quick Sort',
            timeToComplete: 30,
            content: [
              {
                type: "text",
                content: "**Quick Sort** is a highly efficient sorting algorithm. It follows the divide-and-conquer paradigm. It picks an element as a pivot and partitions the given array around the picked pivot."
              },
              {
                type: "code",
                language: "cpp",
                content: `
#include <iostream>
using namespace std;

void swap(int* a, int* b) {
    int t = *a;
    *a = *b;
    *b = t;
}

int partition(int a[], int low, int high) {
    int pivot = a[high];
    int i = (low - 1);

    for (int j = low; j <= high - 1; j++) {
        if (a[j] < pivot) {
            i++;
            swap(&a[i], &a[j]);
        }
    }
    swap(&a[i + 1], &a[high]);
    return (i + 1);
}

void quickSort(int a[], int low, int high) {
    if (low < high) {
        int pi = partition(a, low, high);
        quickSort(a, low, pi - 1);
        quickSort(a, pi + 1, high);
    }
}`
              }
            ]
          }
        ]
      },
      {
        id: "dsa-101-m3",
        title: "Arrays",
        description: "An array is a collection of items of same data type stored at contiguous memory locations. This module covers key array operations and algorithms.",
        lessons: [
            {
                id: "dsa-101-m3-l1",
                title: "Counting Inversions",
                timeToComplete: 20,
                content: [
                    {
                        type: "text",
                        content: "**Inversion Count** is a fundamental array concept that measures how far an array is from being sorted. An inversion occurs when the elements in an array are out of their natural order."
                    },
                    {
                        type: "text",
                        content: "**Definition**: For an array `arr`, an inversion is a pair of elements `(arr[i], arr[j])` where `i < j` but `arr[i] > arr[j]`."
                    },
                    {
                        type: "text",
                        content: "**Key insights**:\n- A perfectly sorted array has 0 inversions\n- A reverse-sorted array has the maximum number of inversions: n*(n-1)/2\n- The inversion count can be used as a measure of how much work is needed to sort an array"
                    },
                    {
                        type: "text",
                        content: "**Applications**:\n- Measuring the similarity between two rankings (e.g., search result rankings)\n- Determining the minimum number of adjacent swaps needed to sort an array\n- Database query optimization\n\n**Time Complexity**: The naive approach shown below is O(n²), but a more efficient approach using merge sort is O(n log n)"
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `// Naive approach to count inversions in an array - O(n²) time complexity
long long int inversionCount(long long arr[], long long N)
{
    long long int count = 0;
    for(int i=0; i<N; i++){
        for(int j=i+1; j<N; j++){
            if(arr[i]>arr[j])
            count++;
        }
    }
    return count;
}`
                    }
                ]
            },
            {
                id: "dsa-101-m3-l2",
                title: "Dutch Flag Algorithm",
                timeToComplete: 20,
                content: [
                    {
                        type: "text",
                        content: "**The Dutch National Flag Algorithm** is an efficient sorting technique named after the Dutch flag's three colors. It was proposed by computer scientist Edsger Dijkstra, who was Dutch."
                    },
                    {
                        type: "text",
                        content: "**Problem**: Given an array containing only 0s, 1s, and 2s in random order, sort them in a single pass without using extra space or counting sort."
                    },
                    {
                        type: "text",
                        content: "**The Algorithm Approach**:\n1. Use three pointers: `low`, `mid`, and `high`\n2. Elements from index 0 to `low-1` are 0s\n3. Elements from `low` to `mid-1` are 1s\n4. Elements from `mid` to `high` are unsorted (to be processed)\n5. Elements from `high+1` to end are 2s"
                    },
                    {
                        type: "text",
                        content: "**How it works**:\n- If the current element (at `mid`) is 0, swap it with the element at `low`, increment both `low` and `mid`\n- If the current element is 1, just increment `mid`\n- If the current element is 2, swap it with the element at `high` and decrement `high`"
                    },
                    {
                        type: "text",
                        content: "**Real-world application**: This algorithm has applications beyond sorting 0s, 1s, and 2s:\n- Partitioning elements by multiple criteria\n- Organizing items into three categories efficiently\n- Implementation of quicksort's three-way partition\n\n**Time Complexity**: O(n) - the array is processed in a single pass\n**Space Complexity**: O(1) - in-place sorting with constant extra space"
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `// Dutch National Flag Algorithm - sorts array with 0s, 1s, and 2s in linear time
void sort012(int a[], int n)
{
    int low = 0;      // boundary for 0s (all elements before low are 0s)
    int high = n-1;   // boundary for 2s (all elements after high are 2s)
    int mid = 0;      // current element being examined

    // Continue until all elements are processed
    while(mid <= high){
        switch(a[mid]){
            case 0: 
                swap(a[low++], a[mid++]);  // Place 0 in the correct region and advance both pointers
                break;
            case 1: 
                mid++;                      // 1 is already in correct region, just move forward
                break;
            case 2: 
                swap(a[mid], a[high--]);   // Place 2 in the correct region and shrink high boundary
                break;
        }
    }`
                    }
                ]
            },
            {
                id: "dsa-101-m3-l3",
                title: "Left Rotation",
                timeToComplete: 15,
                content: [
                    {
                        type: "text",
                        content: "**Array Rotation** is a fundamental operation where elements of an array are shifted in a circular manner. In a left rotation, elements move to the left, with the leftmost elements wrapping around to the end of the array."
                    },
                    {
                        type: "text",
                        content: "**For example**, a left rotation of 2 positions on array [1,2,3,4,5]:\n1. After first rotation: [2,3,4,5,1]\n2. After second rotation: [3,4,5,1,2]"
                    },
                    {
                        type: "text",
                        content: "**Approaches to rotation**:\n1. **Using a temporary array** (shown in the code below): Store the first d elements in a temporary array, shift the remaining elements, then place the temporary elements at the end.\n2. **Juggling algorithm**: Rotate elements in sets using GCD.\n3. **Reversal algorithm**: Reverse the first d elements, reverse the remaining elements, then reverse the entire array."
                    },
                    {
                        type: "text",
                        content: "**Applications**:\n- Circular buffers and queues implementation\n- Polynomial multiplication in certain algorithms\n- Data processing where cyclic patterns need to be analyzed\n- Scheduling algorithms\n\n**Time Complexity**: O(n)\n**Space Complexity**: O(d) where d is the number of rotations"
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `// Left rotate an array by d positions using temporary array
void leftRotate(int arr[], int n, int d)
{
    // Handle case where d is larger than array size
    d = d % n;
    
    if (d == 0) return;  // No rotation needed
    
    // Store the first d elements in a temporary array
    int temp[d];
    for(int i=0; i<d; i++){
        temp[i] = arr[i];
    }
    
    // Shift the remaining elements to the left
    for(int i=d; i<n; i++){
        arr[i-d] = arr[i];
    }
    
    // Place the temporary elements at the end
    for(int i=0; i<d; i++){
        arr[n-d+i] = temp[i];
    }
}`
                    }
                ]
            },
            {
                id: "dsa-101-m3-l4",
                title: "Max Subarray Sum",
                timeToComplete: 25,
                content: [
                    {
                        type: "text",
                        content: "**The Maximum Subarray Problem** (also known as Kadane's algorithm) finds the contiguous subarray within a one-dimensional array of numbers that has the largest sum. This is a classic problem in computer science and is used in many real-world applications."
                    },
                    {
                        type: "text",
                        content: "**Problem statement**: Given an array of integers (positive and negative), find the subarray with the largest sum."
                    },
                    {
                        type: "text",
                        content: "**For example**, in the array [-2, 1, -3, 4, -1, 2, 1, -5, 4]:\n- The maximum subarray is [4, -1, 2, 1] with sum 6\n- Note that we choose [4, -1, 2, 1] and not [4, -1, 2, 1, -5, 4] because even though adding [-5, 4] gives us the same total (6), the problem asks for the maximum sum, not the longest subarray with that sum."
                    },
                    {
                        type: "text",
                        content: "**How Kadane's Algorithm works**:\n1. Keep track of the maximum sum seen so far (`maxi`)\n2. Maintain a running sum (`sum`) as you iterate through the array\n3. For each element, add it to the running sum\n4. If the running sum becomes greater than the maximum sum, update the maximum sum\n5. If the running sum becomes negative, reset it to 0 (as any future subarray would be better off without this negative contribution)"
                    },
                    {
                        type: "text",
                        content: "**Real-world applications**:\n- Stock market analysis (finding the best time to buy and sell)\n- Image processing (finding the brightest region in an image)\n- Route planning (finding segments with optimal characteristics)\n- Signal processing (identifying significant signal bursts)\n\n**Time Complexity**: O(n) - requires just one pass through the array\n**Space Complexity**: O(1) - uses only constant extra space"
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `// Kadane's algorithm for maximum subarray sum
long long maxSubarraySum(int arr[], int n){
    long long maxi = -1e18;     // Initialize maximum sum to a very small value
    long long sum = 0;          // Initialize current sum
    
    for(int i=0; i<n; i++){
        sum += arr[i];          // Add current element to running sum
        
        if(sum > maxi){
            maxi = sum;         // Update maximum sum if running sum is greater
        }
        
        if(sum < 0){
            sum = 0;            // Reset running sum if it becomes negative
        }
    }
    return maxi;                // Return the maximum subarray sum
}`
                    }
                ]
            },
            {
                id: "dsa-101-m3-l5",
                title: "Shift Negatives",
                timeToComplete: 15,
                content: [
                    {
                        type: "text",
                        content: "**Shifting Negatives** is a common array manipulation problem where the goal is to rearrange an array so that all negative numbers appear before all positive numbers. This problem tests understanding of in-place array manipulation and two-pointer techniques."
                    },
                    {
                        type: "text",
                        content: "**Problem Statement**: Given an array containing both positive and negative integers, rearrange the elements so that all negative integers appear before all positive integers while maintaining the relative order of elements."
                    },
                    {
                        type: "text",
                        content: "**For example**, given array [3, -2, 9, -4, 1, -7, 5]:\n- The result should be [-2, -4, -7, 3, 9, 1, 5]\n- All negative numbers come first, followed by all positive numbers"
                    },
                    {
                        type: "text",
                        content: "**Approaches**:\n1. **Two-pointer technique** (implemented below): Use left and right pointers to process the array\n2. **Quick sort partition method**: Similar to the partition step in quicksort\n3. **Using extra space**: Create a new array and fill it in two passes"
                    },
                    {
                        type: "text",
                        content: "**Applications**:\n- Pre-processing step in many numerical algorithms\n- Signal processing where negative values have special meaning\n- Image processing for separating positive and negative features\n- Financial data analysis for separating profits and losses\n\n**Time Complexity**: O(n) - in the worst case, each element might be compared and swapped once\n**Space Complexity**: O(1) - only uses a constant amount of extra space"
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `// Rearrange array such that all negative numbers appear before positive ones
void shiftall(int arr[], int left, int right)
{
  // Two-pointer approach - examining elements from both ends
  while (left <= right)
  {
    // Case 1: If both elements are negative, the left one is already in correct position
    if (arr[left] < 0 && arr[right] < 0)
      left += 1;
    
    // Case 2: If left is positive and right is negative, swap them and advance both pointers
    else if (arr[left] > 0 && arr[right] < 0)
    {
      int temp = arr[left];
      arr[left] = arr[right];
      arr[right] = temp;
      left += 1;
      right -= 1;
    }
    
    // Case 3: If both elements are positive, the right one is already in correct position
    else if (arr[left] > 0 && arr[right] > 0)
      right -= 1;
    
    // Case 4: If left is negative and right is positive, both are in correct positions
    else {
      left += 1;
      right -= 1;
    }
  }`
                    }
                ]
            }
        ]
      },
      {
        id: "dsa-101-m4",
        title: "Linked Lists",
        description: "A linked list is a linear data structure where elements are stored in nodes, and each node points to the next node in the sequence. Unlike arrays, linked lists use non-contiguous memory allocation.",
        lessons: [
            {
                id: "dsa-101-m4-l1",
                title: "Singly Linked List",
                timeToComplete: 20,
                content: [
                    {
                        type: "text",
                        content: "**Singly Linked Lists** are one of the most fundamental data structures in computer science. Unlike arrays that store elements in contiguous memory locations, linked lists allocate memory dynamically as nodes are added."
                    },
                    {
                        type: "text",
                        content: "**Structure of a Singly Linked List**:\n- Each element (called a node) contains two items: the data and a reference (or pointer) to the next node\n- The list starts with a reference to the first node, called the 'head'\n- The last node points to NULL, indicating the end of the list"
                    },
                    {
                        type: "text",
                        content: "**Key Operations** on a singly linked list include:\n- **Insertion**: Add a new node (at the beginning, end, or middle)\n- **Deletion**: Remove a node (from beginning, end, or middle)\n- **Traversal**: Visit each node to perform operations\n- **Search**: Find a node with a specific value"
                    },
                    {
                        type: "text",
                        content: "**Advantages** of linked lists:\n- Dynamic size (can grow and shrink during execution)\n- Ease of insertion/deletion (no need to shift elements)\n- Memory efficiency (only allocate what's needed)\n\n**Disadvantages**:\n- No random access (must traverse from head)\n- Extra memory for pointers\n- Not cache-friendly due to non-contiguous memory\n\n**Time Complexities**:\n- Access: O(n)\n- Search: O(n)\n- Insertion at beginning: O(1)\n- Deletion at beginning: O(1)"
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `// Basic structure of a node in a singly linked list
struct Node {
    int data;       // Data stored in the node
    Node* next;     // Pointer to the next node

    // Constructor to create a new node
    Node(int value) {
        data = value;
        next = NULL;
    }
};

// Basic implementation of a singly linked list
class LinkedList {
private:
    Node* head;
    
public:
    // Initialize an empty linked list
    LinkedList() {
        head = NULL;
    }
    
    // Insert a new node at the beginning
    void insertAtBeginning(int value) {
        Node* newNode = new Node(value);
        newNode->next = head;
        head = newNode;
    }
    
    // Insert a new node at the end
    void insertAtEnd(int value) {
        Node* newNode = new Node(value);
        
        // If the list is empty, make new node as head
        if (head == NULL) {
            head = newNode;
            return;
        }
        
        // Traverse to the last node
        Node* temp = head;
        while (temp->next) {
            temp = temp->next;
        }
        
        // Make new node as next of last node
        temp->next = newNode;
    }
    
    // Display the linked list
    void display() {
        Node* temp = head;
        while (temp != NULL) {
            cout << temp->data << " -> ";
            temp = temp->next;
        }
        cout << "NULL" << endl;
    }
};`
                    }
                ]
            },
            {
                id: "dsa-101-m4-l2",
                title: "Reverse a Linked List",
                timeToComplete: 20,
                content: [
                    {
                        type: "text",
                        content: "**Reversing a Linked List** is a classic problem that tests understanding of pointer manipulation and is frequently asked in technical interviews. The goal is to change the direction of all pointers in a linked list, making the last node the first and the first node the last."
                    },
                    {
                        type: "text",
                        content: "**For example**, reversing a list 1 -> 2 -> 3 -> 4 -> NULL results in 4 -> 3 -> 2 -> 1 -> NULL."
                    },
                    {
                        type: "text",
                        content: "**Approaches to reversing a linked list**:\n1. **Iterative approach** (shown in the code below): Use three pointers to track current, previous, and next nodes\n2. **Recursive approach**: Recursively reverse the rest of the list, then fix the head\n3. **Stack-based approach**: Push all nodes onto a stack, then pop them to create a new list"
                    },
                    {
                        type: "text",
                        content: "**How the iterative algorithm works**:\n1. Initialize three pointers: `prev` (NULL), `curr` (head), and `next` (NULL)\n2. Iterate through the list until `curr` becomes NULL\n3. For each node:\n   - Save the next node: `next = curr->next`\n   - Reverse the current node's pointer: `curr->next = prev`\n   - Move `prev` and `curr` one step forward: `prev = curr, curr = next`"
                    },
                    {
                        type: "text",
                        content: "**Applications**:\n- Required in many algorithms that process linked lists in reverse order\n- Used in implementing certain types of queues using stacks\n- Helpful in detecting palindrome linked lists\n- Step in various graph algorithms\n\n**Time Complexity**: O(n)\n**Space Complexity**: O(1) for iterative approach"
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `// Function to reverse a singly linked list using iterative approach
struct Node* reverseList(struct Node *head)
{
    // Initialize three pointers
    struct Node *prev = NULL;   // Previous pointer (starts as NULL)
    struct Node *curr = head;   // Current pointer (starts at head)
    struct Node *next = NULL;   // Next pointer (will be used to temporarily store the next node)
    
    // Iterate through the list
    while(curr != NULL){
        // Store next node before changing curr->next
        next = curr->next;
        
        // Reverse current node's pointer to point to previous
        curr->next = prev;
        
        // Move pointers one position ahead
        prev = curr;
        curr = next;
    }
    
    // Update head to point to the last node (now first)
    head = prev;
    return head;
}`
                    }
                ]
            },
            {
                id: "dsa-101-m4-l3",
                title: "Detect Cycle in a Linked List",
                timeToComplete: 25,
                content: [
                    {
                        type: "text",
                        content: "**Cycle Detection** in a linked list is a fundamental problem with applications in memory leak detection, infinite loop detection, and data structure validation. A cycle (or loop) exists when a node's next pointer points back to a previous node in the list."
                    },
                    {
                        type: "text",
                        content: "**For example**, in a list 1 -> 2 -> 3 -> 4, if node 4 points back to node 2, it creates a cycle: 1 -> 2 -> 3 -> 4 -> 2 -> ..."
                    },
                    {
                        type: "text",
                        content: "**Approaches to cycle detection**:\n1. **Floyd's Cycle-Finding Algorithm** (Tortoise and Hare) - implemented in the code below\n2. **Marking visited nodes** (requires modifying the node structure)\n3. **Using a hash set** to remember visited nodes (requires extra space)"
                    },
                    {
                        type: "text",
                        content: "**How Floyd's Algorithm works**:\n1. Use two pointers: `slow_p` (moves one step at a time) and `fast_p` (moves two steps at a time)\n2. If there is no cycle, `fast_p` will reach the end of the list\n3. If there is a cycle, `fast_p` will eventually meet `slow_p` inside the cycle\n4. This is because when `slow_p` enters the cycle, `fast_p` is already inside the cycle. Since `fast_p` moves one step faster than `slow_p`, it will catch up to `slow_p` eventually"
                    },
                    {
                        type: "text",
                        content: "**Why it works**: The mathematical proof involves considering the distance between the pointers. If they move at different speeds, they will eventually meet if confined to a cycle.\n\n**Applications**:\n- Detecting infinite loops in linked data structures\n- Memory leak detection in garbage collection algorithms\n- Validating graph structures in algorithms\n\n**Time Complexity**: O(n)\n**Space Complexity**: O(1) - only two pointers used regardless of list size"
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `// Floyd's Cycle-Finding Algorithm (Tortoise and Hare)
bool detectLoop(struct Node* head)
{
    // Initialize slow and fast pointers
    struct Node *slow_p = head, *fast_p = head;

    // Traverse the list
    while (slow_p && fast_p && fast_p->next) {
        // Move slow pointer one step at a time
        slow_p = slow_p->next;
        
        // Move fast pointer two steps at a time
        fast_p = fast_p->next->next;
        
        // If slow and fast pointers meet, there's a cycle
        if (slow_p == fast_p) {
            return true;
        }
    }
    
    // If we reach here, there's no cycle
    return false;
}`
                    }
                ]
            }
        ]
      },
      {
        id: "dsa-101-m5",
        title: "Stacks",
        description: "A stack is a linear data structure that follows the Last In First Out (LIFO) principle. Elements are added and removed from the same end, called the 'top' of the stack.",
        lessons: [
            {
                id: "dsa-101-m5-l1",
                title: "Stack using Array",
                timeToComplete: 15,
                content: [
                    {
                        type: "text",
                        content: "**Stacks** are a fundamental data structure that follows the Last In, First Out (LIFO) principle, similar to a stack of plates where you can only take the top plate. A stack supports two primary operations:"
                    },
                    {
                        type: "text",
                        content: "1. **Push**: Add an element to the top of the stack\n2. **Pop**: Remove and return the top element from the stack"
                    },
                    {
                        type: "text",
                        content: "**Other common stack operations**:\n- **Peek/Top**: View the top element without removing it\n- **isEmpty**: Check if the stack is empty\n- **isFull**: Check if the stack is full (for array implementations)\n- **Size**: Return the number of elements in the stack"
                    },
                    {
                        type: "text",
                        content: "**Array Implementation of a Stack**:\nAn array-based stack uses a fixed-size array to store elements and a variable (top) to track the index of the topmost element. The implementation provided below uses this approach."
                    },
                    {
                        type: "text",
                        content: "**Advantages of array implementation**:\n- Simple and easy to implement\n- Memory-efficient (no extra pointers)\n- Good cache locality\n\n**Limitations**:\n- Fixed maximum size defined at compile time\n- May waste memory if the array is too large\n- Resizing the array is expensive\n\n**Applications of stacks**:\n- Function call management (call stack)\n- Expression evaluation and syntax parsing\n- Undo/Redo operations in applications\n- Backtracking algorithms\n\n**Time Complexity**:\n- Push: O(1)\n- Pop: O(1)\n- Peek: O(1)\n- Search: O(n)"
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `// Stack implementation using an array
#define MAX 1000  // Maximum size of the stack

class Stack {
    int top;       // Index of the top element
public:
    int a[MAX];    // Array to store stack elements
    
    // Constructor - initialize empty stack
    Stack() { 
        top = -1;  // -1 indicates empty stack
    }
    
    // Push element onto stack
    bool push(int x) {
        // Check if stack is full
        if (top >= MAX-1) {
            cout << "Stack Overflow";
            return false;
        }
        else {
            a[++top] = x;  // Increment top, then insert element
            return true;
        }
    }
    
    // Remove and return top element from stack
    int pop() {
        // Check if stack is empty
        if (top < 0) {
            cout << "Stack Underflow";
            return 0;
        }
        else {
            return a[top--];  // Return top element, then decrement top
        }
    }
    
    // Return top element without removing
    int peek() {
        // Check if stack is empty
        if (top < 0) {
            cout << "Stack is Empty";
            return 0;
        }
        else {
            return a[top];  // Return top element
        }
    }
    
    // Check if stack is empty
    bool isEmpty() {
        return (top < 0);
    }
};`
                    }
                ]
            },
            {
                id: "dsa-101-m5-l2",
                title: "Balanced Parenthesis",
                timeToComplete: 25,
                content: [
                    {
                        type: "text",
                        content: "**The Balanced Parentheses Problem** is a classic application of stacks in computer science. The goal is to determine whether a given string of parentheses is balanced or not."
                    },
                    {
                        type: "text",
                        content: "**A string is considered balanced when**:\n- Every opening bracket has a corresponding closing bracket of the same type\n- Opening brackets must be closed in the correct order\n- Every closing bracket must match the most recently opened unmatched bracket"
                    },
                    {
                        type: "text",
                        content: "**Examples**:\n- Balanced: `{[()]}`, `(){}[]`, `(([{}]))`\n- Not balanced: `[(])`, `{[}]`, `(()`, `)]`"
                    },
                    {
                        type: "text",
                        content: "**The Algorithm**:\n1. Create an empty stack\n2. Iterate through each character in the string\n3. If the current character is an opening bracket, push it onto the stack\n4. If the current character is a closing bracket:\n   - If the stack is empty, return false (no matching opening bracket)\n   - If the top of the stack is the matching opening bracket, pop it from the stack\n   - Otherwise, return false (incorrect matching)\n5. After processing all characters, if the stack is empty, return true; otherwise, return false"
                    },
                    {
                        type: "text",
                        content: "**Applications**:\n- Syntax validation in compilers and interpreters\n- XML/HTML tag matching\n- Expression evaluation in mathematics\n- Checking for properly nested blocks in programming languages\n\n**Time Complexity**: O(n) where n is the length of the string\n**Space Complexity**: O(n) in the worst case when all characters are opening brackets"
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `// Function to check if a string has balanced parentheses
bool ispar(string x)
{
    stack<char> s;  // Stack to keep track of opening brackets
    
    // Traverse the string
    for(int i=0; i<x.length(); i++){
        // If stack is empty, push the current character
        if(s.empty()){
            s.push(x[i]);
        }
        // If current character is a closing bracket and matches the top of the stack
        else if((s.top()=='(' && x[i]==')') || 
                (s.top()=='{' && x[i]=='}') || 
                (s.top()=='[' && x[i]==']')){
            s.pop();  // Remove the matching pair
        }
        // If not a matching pair, push the current character
        else{
            s.push(x[i]);
        }
    }
    
    // If stack is empty, all brackets are matched
    if(s.empty()){
        return true;
    }
    // If stack is not empty, some brackets are unmatched
    return false;
}`
                    },
                    {
                        type: "text",
                        content: "**Alternative Implementation** (more intuitive):\n```cpp\nbool isBalanced(string expr) {\n    stack<char> s;\n    \n    for(char bracket : expr) {\n        if(bracket == '(' || bracket == '{' || bracket == '[') {\n            // Push opening brackets onto stack\n            s.push(bracket);\n        } else {\n            // For closing brackets\n            if(s.empty()) return false;  // No matching opening bracket\n            \n            char top = s.top();\n            if((bracket == ')' && top == '(') || \n               (bracket == '}' && top == '{') || \n               (bracket == ']' && top == '[')) {\n                s.pop();  // Matching pair found\n            } else {\n                return false;  // Mismatched brackets\n            }\n        }\n    }\n    \n    return s.empty();  // True if all brackets are matched\n}\n```"
                    }
                ]
            }
        ]
      },
      {
        id: "dsa-101-m6",
        title: "Queues",
        description: "A queue is a linear data structure that follows the First In First Out (FIFO) principle. Elements are added at the rear and removed from the front of the queue.",
        lessons: [
            {
                id: "dsa-101-m6-l1",
                title: "Queue using Linked List",
                timeToComplete: 15,
                content: [
                    {
                        type: "text",
                        content: "**Queues** are fundamental data structures that follow the First In, First Out (FIFO) principle, similar to a line of people waiting for a service. Unlike stacks, queues allow insertion at one end (rear) and deletion from the other end (front)."
                    },
                    {
                        type: "text",
                        content: "**Primary queue operations**:\n1. **Enqueue**: Add an element to the rear of the queue\n2. **Dequeue**: Remove and return the front element from the queue\n3. **Front/Peek**: View the front element without removing it\n4. **IsEmpty**: Check if the queue is empty"
                    },
                    {
                        type: "text",
                        content: "**Queue Implementation Approaches**:\n- **Array-based**: Simple but has fixed size limitations\n- **Linked List-based**: Dynamic size, efficient enqueue/dequeue (shown in the code below)\n- **Circular Queue**: Efficient array implementation to overcome limitations\n- **Double-ended Queue (Deque)**: Allows insertion and deletion at both ends"
                    },
                    {
                        type: "text",
                        content: "**Advantages of linked list implementation**:\n- Dynamic size (no overflow issue)\n- Efficient enqueue (O(1)) and dequeue (O(1)) operations\n- Memory is allocated only when needed\n\n**Disadvantages**:\n- Extra memory needed for pointer storage\n- No random access to elements\n- Not cache-friendly due to non-contiguous memory allocation"
                    },
                    {
                        type: "text",
                        content: "**Applications of queues**:\n- Task scheduling in operating systems\n- Handling requests in web servers\n- Breadth-first search in graphs\n- Message buffering in communication systems\n- Print job spooling\n\n**Time Complexity**:\n- Enqueue: O(1)\n- Dequeue: O(1)\n- Front/Peek: O(1)"
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `// Queue implementation using linked list
struct QNode {
    int data;       // Data stored in the node
    QNode* next;    // Pointer to next node
    
    // Constructor
    QNode(int d)
    {
        data = d;
        next = NULL;
    }
};

struct Queue {
    QNode *front, *rear;  // Track front and rear of queue
    
    // Constructor - initialize empty queue
    Queue()
    {
        front = rear = NULL;
    }

    // Add element to the queue (at rear)
    void enQueue(int x)
    {
        // Create a new node
        QNode* temp = new QNode(x);
        
        // If queue is empty, then new node is front and rear
        if (rear == NULL) {
            front = rear = temp;
            return;
        }
        
        // Add the new node at the end and update rear
        rear->next = temp;
        rear = temp;
    }

    // Remove element from queue (from front)
    void deQueue()
    {
        // If queue is empty, return
        if (front == NULL)
            return;
        
        // Store front and move front one node ahead
        QNode* temp = front;
        front = front->next;
        
        // If front becomes NULL, update rear to NULL as well
        if (front == NULL)
            rear = NULL;
            
        // Free memory of the dequeued node
        delete temp;
    }
    
    // Check if queue is empty
    bool isEmpty() 
    {
        return (front == NULL);
    }
    
    // Get front element without removing it
    int peek() 
    {
        // If queue is empty
        if (isEmpty()) {
            cout << "Queue is empty" << endl;
            return -1;
        }
        return front->data;
    }
};`
                    }
                ]
            },
            {
                id: "dsa-101-m6-l2",
                title: "Circular Queue",
                timeToComplete: 20,
                content: [
                    {
                        type: "text",
                        content: "**Circular Queues** are an improvement over the basic array implementation of queues. They address the problem of inefficiently using array space by connecting the last position of the array to the first position, creating a circular structure."
                    },
                    {
                        type: "text",
                        content: "**Problem with standard array queues**: In a regular array-based queue, when elements are dequeued from the front, those spaces remain unused even though we might run out of space at the rear. This leads to an inefficient use of memory, even when the queue isn't technically 'full'."
                    },
                    {
                        type: "text",
                        content: "**How circular queues work**:\n- The queue is visualized as a circular array where the last position connects back to the first\n- Two pointers, `front` and `rear`, track the queue boundaries\n- When `rear` reaches the end of the array, it wraps around to the beginning if there's space\n- The position calculation typically uses the modulo operator (`%`) to achieve the circular behavior"
                    },
                    {
                        type: "text",
                        content: "**Key operations**:\n- **Enqueue**: Add element at rear, then move rear pointer circularly\n- **Dequeue**: Remove element from front, then move front pointer circularly\n- **isFull**: Check if the queue is full (when front is at position (rear+1)%size)\n- **isEmpty**: Check if the queue is empty (when front is -1)"
                    },
                    {
                        type: "text",
                        content: "**Applications**:\n- CPU scheduling in operating systems\n- Memory management\n- Traffic light management systems\n- Buffering in data streams\n\n**Time Complexity**:\n- Enqueue: O(1)\n- Dequeue: O(1)\n- Front/Rear: O(1)"
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `// Implementation of Circular Queue using arrays
class CircularQueue {
private:
    int *arr;        // Array to store elements
    int front;       // Front pointer
    int rear;        // Rear pointer
    int capacity;    // Maximum capacity
    
public:
    // Constructor
    CircularQueue(int size) {
        arr = new int[size];
        capacity = size;
        front = rear = -1;
    }
    
    // Destructor
    ~CircularQueue() {
        delete[] arr;
    }
    
    // Check if queue is full
    bool isFull() {
        return (front == 0 && rear == capacity-1) || (rear == (front-1)%(capacity-1));
    }
    
    // Check if queue is empty
    bool isEmpty() {
        return (front == -1);
    }
    
    // Add an element to the queue
    void enqueue(int value) {
        // Check if the queue is full
        if (isFull()) {
            cout << "Queue Overflow" << endl;
            return;
        }
        
        // If queue is empty
        if (front == -1) {
            front = rear = 0;
        } 
        // If rear is at the end but front is not at the beginning
        else if (rear == capacity-1 && front != 0) {
            rear = 0;
        } 
        // Regular case: increment rear
        else {
            rear++;
        }
        
        // Insert new element
        arr[rear] = value;
    }
    
    // Remove an element from the queue
    int dequeue() {
        // Check if queue is empty
        if (isEmpty()) {
            cout << "Queue Underflow" << endl;
            return -1;
        }
        
        // Store front element to return
        int value = arr[front];
        
        // If queue has only one element
        if (front == rear) {
            front = rear = -1;
        }
        // If front is at the end of array
        else if (front == capacity-1) {
            front = 0;
        }
        // Regular case: increment front
        else {
            front++;
        }
        
        return value;
    }
    
    // Get front element without removing
    int peek() {
        if (isEmpty()) {
            cout << "Queue is Empty" << endl;
            return -1;
        }
        return arr[front];
    }
};`
                    }
                ]
            }
        ]
      },
      {
        id: "dsa-101-m7",
        title: "Trees",
        description: "Trees are hierarchical data structures with a root value and subtrees of children, representing a parent-child relationship. They are widely used to represent hierarchical data like file systems, organization structures, and more.",
        lessons: [
            {
                id: "dsa-101-m7-l1",
                title: "Binary Tree",
                timeToComplete: 20,
                content: [
                    {
                        type: "text",
                        content: "**Binary Trees** are a special type of tree data structure in which each node can have at most two children, referred to as the left child and the right child. Binary trees are one of the most fundamental hierarchical data structures in computer science."
                    },
                    {
                        type: "text",
                        content: "**Basic terminology**:\n- **Root**: The topmost node in a tree\n- **Parent**: A node that has children\n- **Child**: A node directly connected to another node when moving away from the root\n- **Leaf Node**: A node that has no children (terminal node)\n- **Internal Node**: A node that has at least one child\n- **Depth**: Length of the path from root to the node\n- **Height**: Length of the longest path from the node to a leaf"
                    },
                    {
                        type: "text",
                        content: "**Types of binary trees**:\n- **Full/Strict Binary Tree**: Each node has exactly 0 or 2 children\n- **Complete Binary Tree**: All levels are filled except possibly the last level, which is filled from left to right\n- **Perfect Binary Tree**: All internal nodes have two children and all leaf nodes are at the same level\n- **Balanced Binary Tree**: Height difference between left and right subtrees for every node is not more than 1\n- **Degenerate/Pathological Tree**: Every parent node has only one child (essentially a linked list)"
                    },
                    {
                        type: "text",
                        content: "**Common operations** on binary trees:\n- **Insertion**: Add a new node to the tree\n- **Deletion**: Remove a node from the tree\n- **Traversal**: Visit each node exactly once\n  - **Inorder**: Left subtree → Root → Right subtree\n  - **Preorder**: Root → Left subtree → Right subtree\n  - **Postorder**: Left subtree → Right subtree → Root\n  - **Level-order**: Level by level from top to bottom, left to right"
                    },
                    {
                        type: "text",
                        content: "**Applications**:\n- **Expression trees** for representing mathematical expressions\n- **Decision trees** in machine learning\n- **Huffman trees** for data compression\n- **Advanced data structures** like heaps, AVL trees, and red-black trees are specialized binary trees\n\n**Time Complexity** for a balanced BST:\n- Search/Insert/Delete: O(log n) average, but O(n) worst case for unbalanced trees\n- Min/Max: O(log n) for balanced trees, O(n) worst case"
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `// Basic structure of a binary tree node
struct Node
{
    int data;            // Data stored in the node
    struct Node* left;   // Pointer to left child
    struct Node* right;  // Pointer to right child
    
    // Constructor to create a new node
    Node(int x){
        data = x;
        left = right = NULL;
    }
};

// Common binary tree traversals
void inorderTraversal(struct Node* node) {
    if (node == NULL)
        return;
        
    // First traverse left subtree
    inorderTraversal(node->left);
    
    // Then print current node
    cout << node->data << " ";
    
    // Finally traverse right subtree
    inorderTraversal(node->right);
}

void preorderTraversal(struct Node* node) {
    if (node == NULL)
        return;
        
    // First print current node
    cout << node->data << " ";
    
    // Then traverse left subtree
    preorderTraversal(node->left);
    
    // Finally traverse right subtree
    preorderTraversal(node->right);
}

void postorderTraversal(struct Node* node) {
    if (node == NULL)
        return;
        
    // First traverse left subtree
    postorderTraversal(node->left);
    
    // Then traverse right subtree
    postorderTraversal(node->right);
    
    // Finally print current node
    cout << node->data << " ";
}`
                    }
                ]
            },
            {
                id: "dsa-101-m7-l2",
                title: "Level Order Traversal",
                timeToComplete: 25,
                content: [
                    {
                        type: "text",
                        content: "**Level Order Traversal**, also known as Breadth-First Traversal (BFT), visits all nodes of a binary tree level by level, starting from the root and moving downward. At each level, nodes are visited from left to right."
                    },
                    {
                        type: "text",
                        content: "**For example**, given this binary tree:\n```\n    1\n   / \\\n  2   3\n / \\   \\\n4   5   6\n```\nLevel order traversal would output: `1 2 3 4 5 6`"
                    },
                    {
                        type: "text",
                        content: "**How Level Order Traversal works**:\n1. Create a queue to store nodes\n2. Enqueue the root node\n3. While the queue is not empty:\n   - Dequeue a node and process it (print/store its value)\n   - Enqueue its left child if it exists\n   - Enqueue its right child if it exists"
                    },
                    {
                        type: "text",
                        content: "**Unlike other tree traversal methods** (inorder, preorder, postorder) that use recursive approaches, level order traversal typically uses an iterative approach with a queue data structure to keep track of nodes at each level."
                    },
                    {
                        type: "text",
                        content: "**Applications**:\n- Finding the shortest path between two nodes in unweighted graphs\n- Building a level-by-level view of hierarchical structures\n- Web crawling algorithms\n- GPS navigation systems\n- Serialization/deserialization of binary trees\n\n**Time Complexity**: O(n) where n is the number of nodes\n**Space Complexity**: O(w) where w is the maximum width of the tree"
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `// Level Order Traversal (Breadth-First Traversal)
vector<int> levelOrder(Node* node)
{
  vector<int> ans;  // Vector to store the traversal result
  
  // If tree is empty, return empty result
  if(node==NULL) return ans;
  
  // Create a queue for BFS
  queue<Node*> q;
  
  // Enqueue root
  q.push(node);
  
  // Standard BFS loop
  while(!q.empty()){
      // Dequeue a node from front of queue
      Node* temp = q.front();
      q.pop();
      
      // Add this node's value to our result
      ans.push_back(temp->data);
      
      // Enqueue left child if it exists
      if(temp->left) 
          q.push(temp->left);
      
      // Enqueue right child if it exists
      if(temp->right) 
          q.push(temp->right);
  }
  
  return ans;
}`
                    },
                    {
                        type: "text",
                        content: "**Extended Application: Level-by-Level Traversal**\n\nSometimes we need to process nodes level by level and keep track of the level structure. Here's how to modify the algorithm to return a 2D vector where each inner vector contains nodes of one level:\n\n```cpp\nvector<vector<int>> levelByLevelOrder(Node* root) {\n    vector<vector<int>> result;\n    if (!root) return result;\n    \n    queue<Node*> q;\n    q.push(root);\n    \n    while (!q.empty()) {\n        int levelSize = q.size();  // Number of nodes at current level\n        vector<int> currentLevel;\n        \n        for (int i = 0; i < levelSize; i++) {\n            Node* node = q.front();\n            q.pop();\n            \n            currentLevel.push_back(node->data);\n            \n            if (node->left) q.push(node->left);\n            if (node->right) q.push(node->right);\n        }\n        \n        result.push_back(currentLevel);\n    }\n    \n    return result;\n}\n```"
                    }
                ]
            },
            {
                id: "dsa-101-m7-l3",
                title: "Binary Search Tree",
                timeToComplete: 30,
                content: [
                    {
                        type: "text",
                        content: "**Binary Search Trees (BST)** are a special type of binary tree that maintain a useful ordering property: for any node, all elements in its left subtree are less than the node's value, and all elements in its right subtree are greater than the node's value."
                    },
                    {
                        type: "text",
                        content: "**Key Properties of Binary Search Trees**:\n1. All nodes in the left subtree have values less than the node's value\n2. All nodes in the right subtree have values greater than the node's value\n3. Each subtree is itself a binary search tree\n4. No duplicate values are allowed (in standard BST implementations)"
                    },
                    {
                        type: "text",
                        content: "**For example**, a valid BST:\n```\n     8\n   /   \\\n  3     10\n / \\      \\\n1   6      14\n   / \\\n  4   7\n```"
                    },
                    {
                        type: "text",
                        content: "**Advantages of BSTs**:\n- Efficient searching: The ordering property allows for binary search\n- Ordered operations: Elements can be accessed in sorted order via inorder traversal\n- Dynamic size: Nodes can be added or removed easily\n- Balanced BSTs (like AVL or Red-Black trees) guarantee O(log n) operations"
                    },
                    {
                        type: "text",
                        content: "**Common operations** on BSTs:\n1. **Search**: Find a node with a given key\n2. **Insert**: Add a new node maintaining BST properties\n3. **Delete**: Remove a node while preserving BST properties\n4. **Finding min/max**: Leftmost/rightmost node respectively\n5. **Inorder traversal**: Visit nodes in sorted order"
                    },
                    {
                        type: "text",
                        content: "**Applications**:\n- Implementing sets and maps in many programming language libraries\n- Database indexing\n- Priority queues\n- Symbol tables in compilers\n\n**Time Complexity** for a balanced BST:\n- Search/Insert/Delete: O(log n) average, but O(n) worst case for unbalanced trees\n- Min/Max: O(log n) for balanced trees, O(n) worst case"
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `// Search for a key in Binary Search Tree
Node* search(Node* root, int key)
{
    // Base cases: root is null or key is present at root
    if (root == NULL || root->key == key)
       return root;
    
    // Key is greater than root's key
    if (root->key < key)
       return search(root->right, key);
 
    // Key is smaller than root's key
    return search(root->left, key);
}

// Insert a new key in BST
Node* insert(Node* root, int key)
{
    // If the tree is empty, create a new node
    if (root == NULL)
        return new Node(key);
 
    // Otherwise, recur down the tree
    if (key < root->key)
        root->left = insert(root->left, key);
    else if (key > root->key)
        root->right = insert(root->right, key);
 
    // Return the unchanged node pointer
    return root;
}

// Find the minimum value node in a BST
Node* minValueNode(Node* node)
{
    Node* current = node;
 
    // Find the leftmost leaf node
    while (current && current->left != NULL)
        current = current->left;
 
    return current;
}

// Delete a node from BST
Node* deleteNode(Node* root, int key)
{
    // Base case
    if (root == NULL)
        return root;
 
    // Recursive calls for ancestors of node to be deleted
    if (key < root->key)
        root->left = deleteNode(root->left, key);
    else if (key > root->key)
        root->right = deleteNode(root->right, key);
    else {
        // Node with only one child or no child
        if (root->left == NULL) {
            Node* temp = root->right;
            delete root;
            return temp;
        }
        else if (root->right == NULL) {
            Node* temp = root->left;
            delete root;
            return temp;
        }
 
        // Node with two children: Get the inorder successor
        Node* temp = minValueNode(root->right);
 
        // Copy the inorder successor's data to this node
        root->key = temp->key;
 
        // Delete the inorder successor
        root->right = deleteNode(root->right, temp->key);
    }
    return root;
}`
                    }
                ]
            }
        ]
      },
      {
        id: "dsa-101-m8",
        title: "Searching",
        description: "Searching algorithms are designed to retrieve information stored within data structures. These algorithms are fundamental to computer science and optimize the process of finding specific elements in datasets.",
        lessons: [
            {
                id: "dsa-101-m8-l1",
                title: "Linear Search",
                timeToComplete: 15,
                content: [
                  {
                    type: "text",
                    content: "**Linear Search** is the simplest searching algorithm that sequentially checks each element in a collection until it finds the target element or reaches the end of the collection. It's a brute-force approach that works on any array, whether sorted or unsorted."
                  },
                  {
                    type: "text",
                    content: "**How Linear Search works**:\n1. Start from the leftmost element and compare it with the target value\n2. If they match, return the current position\n3. If not, move to the next element\n4. Repeat steps 1-3 until the element is found or the end of the array is reached\n5. If the element is not found, return -1 or another sentinel value"
                  },
                  {
                    type: "text",
                    content: "**For example**, searching for 7 in array [3, 1, 7, 9, 2]:\n1. Compare 3 with 7 → Not a match\n2. Compare 1 with 7 → Not a match\n3. Compare 7 with 7 → Match found at index 2"
                  },
                  {
                    type: "text",
                    content: "**Advantages**:\n- Simple to implement and understand\n- Works on unsorted arrays\n- No preprocessing required\n- Good for small arrays\n\n**Disadvantages**:\n- Inefficient for large arrays\n- Time complexity increases linearly with the size of the array"
                  },
                  {
                    type: "text",
                    content: "**Applications**:\n- Small datasets where implementing more complex algorithms isn't worth the overhead\n- Searching in unsorted arrays\n- When elements are continuously added/removed (making sorting inefficient)\n\n**Time Complexity**:\n- Best case: O(1) (element is at the first position)\n- Worst case: O(n) (element is at the last position or not present)\n- Average case: O(n/2) ≈ O(n)"
                  },
                  {
                    type: "code",
                    language: "cpp",
                    content: `// Linear search implementation
int linearSearch(int arr[], int n, int x)
{
    // Traverse the array sequentially
    for (int i = 0; i < n; i++)
        // If element is found, return its index
        if (arr[i] == x)
            return i;
    
    // If element is not found, return -1
    return -1;
}

// Example usage:
// int arr[] = {10, 20, 80, 30, 60, 50, 110, 100, 130, 170};
// int x = 110;
// int n = sizeof(arr)/sizeof(arr[0]);
// int result = linearSearch(arr, n, x); // Returns 6`
                  }
                ]
            },
            {
                id: "dsa-101-m8-l2",
                title: "Binary Search",
                timeToComplete: 20,
                content: [
                  {
                    type: "text",
                    content: "**Binary Search** is an efficient divide-and-conquer algorithm for finding an element in a sorted array. It repeatedly divides the search space in half, which makes it much faster than linear search for large datasets."
                  },
                  {
                    type: "text",
                    content: "**Key requirement**: The array must be sorted before applying binary search."
                  },
                  {
                    type: "text",
                    content: "**How Binary Search works**:\n1. Set two pointers: `left` pointing to the first element and `right` pointing to the last element\n2. Find the middle element: `mid = left + (right - left) / 2` (avoids overflow)\n3. If the middle element is equal to the target, return its index\n4. If the target is greater than the middle element, search in the right half: `left = mid + 1`\n5. If the target is less than the middle element, search in the left half: `right = mid - 1`\n6. Repeat steps 2-5 until the element is found or `left > right` (element not in array)"
                  },
                  {
                    type: "text",
                    content: "**For example**, searching for 23 in sorted array [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]:\n1. Initial: left=0, right=9, mid=4, arr[mid]=16 → 23 > 16, so search right half\n2. Updated: left=5, right=9, mid=7, arr[mid]=56 → 23 < 56, so search left half\n3. Updated: left=5, right=6, mid=5, arr[mid]=23 → Found at index 5"
                  },
                  {
                    type: "text",
                    content: "**Advantages**:\n- Very efficient for large datasets\n- Logarithmic time complexity\n- Works well when data doesn't fit into memory (can be adapted for external storage)\n\n**Disadvantages**:\n- Array must be sorted first\n- Not good for lists that change frequently (due to sorting overhead)\n- Inefficient for small arrays (linear search might be faster due to lower overhead)"
                  },
                  {
                    type: "text",
                    content: "**Applications**:\n- Database searching\n- Finding records in large datasets\n- Dictionary implementations\n- Debugging (e.g., finding first occurrence of a bug in version control)\n\n**Time Complexity**:\n- Best case: O(1) (element is at the middle position)\n- Worst case: O(log n) (element is at the extremes or not present)\n- Average case: O(log n)"
                  },
                  {
                    type: "code",
                    language: "cpp",
                    content: `// Binary search implementation (recursive)
int binarySearch(int arr[], int left, int right, int x)
{
    // Base case: element not found
    if (right < left)
        return -1;
    
    // Calculate middle index (avoiding overflow)
    int mid = left + (right - left) / 2;
    
    // If element is present at mid
    if (arr[mid] == x)
        return mid;
    
    // If element is smaller than mid, search in left subarray
    if (arr[mid] > x)
        return binarySearch(arr, left, mid - 1, x);
    
    // Else search in right subarray
    return binarySearch(arr, mid + 1, right, x);
}

// Iterative binary search implementation
int binarySearchIterative(int arr[], int n, int x)
{
    int left = 0, right = n - 1;
    
    while (left <= right)
    {
        int mid = left + (right - left) / 2;
        
        // Check if x is present at mid
        if (arr[mid] == x)
            return mid;
            
        // If x greater, ignore left half
        if (arr[mid] < x)
            left = mid + 1;
            
        // If x is smaller, ignore right half
        else
            right = mid - 1;
    }
    
    // Element not present
    return -1;
}`
                  }
                ]
            },
            {
                id: "dsa-101-m8-l3",
                title: "Jump Search",
                timeToComplete: 20,
                content: [
                    {
                        type: "text",
                        content: "**Jump Search** is a searching algorithm for sorted arrays that works by jumping ahead by fixed steps and then performing a linear search within a smaller range. It's a middle ground between linear search and binary search."
                    },
                    {
                        type: "text",
                        content: "**Key requirement**: The array must be sorted before applying jump search."
                    },
                    {
                        type: "text",
                        content: "**How Jump Search works**:\n1. Define a jump size (typically sqrt(n) where n is array length)\n2. Jump ahead by the jump size until you find a value greater than the target or reach the end\n3. Perform a linear search in the previous block (between the last jump and current position)\n4. Return the index if found, otherwise return -1"
                    },
                    {
                        type: "text",
                        content: "**For example**, searching for 33 in sorted array [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233]:\n1. Jump size = sqrt(14) ≈ 3\n2. First jump: check arr[3] = 2 → 33 > 2, continue\n3. Second jump: check arr[6] = 8 → 33 > 8, continue\n4. Third jump: check arr[9] = 34 → 33 < 34, found the right block\n5. Linear search from arr[6] to arr[9] → Element 33 not found"
                    },
                    {
                        type: "text",
                        content: "**Advantages**:\n- More efficient than linear search\n- Less complex than binary search\n- Fewer comparisons than binary search in some cases\n- Good for arrays stored on external storage (fewer reads/seeks)\n\n**Disadvantages**:\n- Less efficient than binary search for most cases\n- Array must be sorted\n- Determining optimal jump size can be tricky"
                    },
                    {
                        type: "text",
                        content: "**Applications**:\n- Finding maximum or minimum of a unimodal function\n- Optimizing certain mathematical problems\n- When the comparison operation is significantly more expensive than additional division operations\n\n**Time Complexity**:\n- Best case: O(1) (element is at the first position)\n- Worst case: O(√n) (element requires the maximum number of steps)\n- Average case: O(√n)"
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `// Jump search implementation
int jumpSearch(int arr[], int x, int n)
{
    // Finding optimal block size to jump
    int step = sqrt(n);
    
    // Finding the block where element may be present
    int prev = 0;
    while (arr[min(step, n)-1] < x)
    {
        prev = step;
        step += sqrt(n);
        if (prev >= n)
            return -1;
    }
    
    // Doing a linear search for x in the block
    while (arr[prev] < x)
    {
        prev++;
        
        // If we reached next block or end of array,
        // element is not present
        if (prev == min(step, n))
            return -1;
    }
    
    // If element is found
    if (arr[prev] == x)
        return prev;
        
    return -1;
}`
                    }
                ]
            },
            {
                id: "dsa-101-m8-l4",
                title: "Ternary Search",
                timeToComplete: 15,
                content: [
                    {
                        type: "text",
                        content: "**Ternary Search** is a divide-and-conquer search algorithm that extends the concept of binary search. Instead of dividing the array into two parts, it divides the array into three parts and determines which part the target element might be in."
                    },
                    {
                        type: "text",
                        content: "**Key requirement**: The array must be sorted before applying ternary search."
                    },
                    {
                        type: "text",
                        content: "**How Ternary Search works**:\n1. Calculate two mid points: `mid1 = left + (right - left) / 3` and `mid2 = right - (right - left) / 3`\n2. If the target is equal to the element at either mid point, return that index\n3. If the target is less than the element at `mid1`, search in the first part: `right = mid1 - 1`\n4. If the target is greater than the element at `mid2`, search in the third part: `left = mid2 + 1`\n5. Otherwise, search in the middle part: `left = mid1 + 1` and `right = mid2 - 1`\n6. Repeat steps 1-5 until the element is found or `left > right`"
                    },
                    {
                        type: "text",
                        content: "**For example**, searching for 22 in sorted array [1, 5, 8, 12, 16, 22, 38, 56, 72, 91]:\n1. Initial: left=0, right=9, mid1=3, mid2=6\n2. arr[mid1]=12, arr[mid2]=38 → 12 < 22, so search middle part\n3. Updated: left=4, right=9, mid1=4, mid2=6\n4. arr[mid1]=16, arr[mid2]=22 → 16 < 22 = arr[mid2], so found at index 6"
                    },
                    {
                        type: "text",
                        content: "**Ternary vs. Binary Search**:\nBinary search has O(log₂ n) comparisons in worst case, while ternary search has O(log₃ n) comparisons. However, ternary search makes 2 comparisons per step (vs. 1 for binary search). Since log₃ n ≈ 0.631 log₂ n, ternary search would make approximately 2 × 0.631 log₂ n ≈ 1.262 log₂ n comparisons, which is more than binary search."
                    },
                    {
                        type: "text",
                        content: "**Applications**:\n- Finding maximum or minimum of a unimodal function\n- Optimizing certain mathematical problems\n- When the comparison operation is significantly more expensive than additional division operations\n\n**Time Complexity**:\n- Best case: O(1) (element is at one of the mid points)\n- Worst case: O(log₃ n) (element is not present or at extremes)\n- Average case: O(log₃ n)"
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `// Ternary search implementation (recursive)
int ternarySearch(int arr[], int left, int right, int x)
{
    if (right >= left)
    {
        // Calculate two mid points
        int mid1 = left + (right - left) / 3;
        int mid2 = right - (right - left) / 3;
        
        // Check if x is present at mid1
        if (arr[mid1] == x)
            return mid1;
            
        // Check if x is present at mid2
        if (arr[mid2] == x)
            return mid2;
            
        // If x is smaller than mid1, search in first part
        if (x < arr[mid1])
            return ternarySearch(arr, left, mid1 - 1, x);
            
        // If x is greater than mid2, search in third part
        else if (x > arr[mid2])
            return ternarySearch(arr, mid2 + 1, right, x);
            
        // If none of the above, search in middle part
        else
            return ternarySearch(arr, mid1 + 1, mid2 - 1, x);
    }
    
    // Element not found
    return -1;
}`
                    }
                ]
            },
            {
                id: "dsa-101-m8-l5",
                title: "Exponential Search",
                timeToComplete: 15,
                content: [
                    {
                        type: "text",
                        content: "**Exponential Search** (also called doubling search or galloping search) is an algorithm for searching sorted arrays that works by finding a range where the target value might exist, and then performing a binary search within that range."
                    },
                    {
                        type: "text",
                        content: "**Key requirement**: The array must be sorted before applying exponential search."
                    },
                    {
                        type: "text",
                        content: "**How Exponential Search works**:\n1. Start with a subarray size of 1 and keep doubling until you find an element greater than the target or reach the end\n2. Once you've found a range, perform a binary search within that range\n3. Return the index if found, otherwise return -1"
                    },
                    {
                        type: "text",
                        content: "**For example**, searching for 25 in sorted array [2, 4, 8, 10, 16, 22, 25, 28, 30]:\n1. Check if arr[0] = 2 equals 25 → No\n2. Try index 1: arr[1] = 4 < 25\n3. Try index 2: arr[2] = 8 < 25\n4. Try index 4: arr[4] = 16 < 25\n5. Try index 8: arr[8] = 30 > 25\n6. Now perform binary search between indices 4 and 8\n7. Binary search finds 25 at index 6"
                    },
                    {
                        type: "text",
                        content: "**Advantages**:\n- More efficient than binary search when the target element is near the beginning\n- Works well for unbounded/infinite arrays\n- Performs better than binary search for arrays of unknown size\n\n**Disadvantages**:\n- Slightly more complex to implement than binary search\n- May perform worse than binary search when elements are at the end of large arrays"
                    },
                    {
                        type: "text",
                        content: "**Applications**:\n- Searching in unbounded/infinite lists\n- Efficient searching in large arrays when elements are likely at the beginning\n- Web search engines' first-level searching\n\n**Time Complexity**:\n- Best case: O(1) (element is at the beginning)\n- Worst case: O(log n) (similar to binary search)\n- Average case: O(log i) where i is the position of the element"
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `// Exponential search implementation
int exponentialSearch(int arr[], int n, int x)
{
    // If element is at the first position
    if (arr[0] == x)
        return 0;
    
    // Find range for binary search by repeated doubling
    int i = 1;
    while (i < n && arr[i] <= x)
        i = i * 2;
    
    // Call binary search for the range found
    return binarySearch(arr, i/2, min(i, n-1), x);
}

// Binary search used by exponential search
int binarySearch(int arr[], int left, int right, int x)
{
    while (left <= right)
    {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == x)
            return mid;
            
        if (arr[mid] < x)
            left = mid + 1;
            
        else
            right = mid - 1;
    }
    
    return -1;
}`
                    }
                ]
            },
            {
                id: "dsa-101-m8-l6",
                title: "Interpolation Search",
                timeToComplete: 15,
                content: [
                    {
                        type: "text",
                        content: "**Interpolation Search** is an improved variant of binary search that works better for uniformly distributed sorted arrays. Instead of always dividing the search space in half, it makes an intelligent guess about where the target value might be based on its value relative to values at the ends of the range."
                    },
                    {
                        type: "text",
                        content: "**Key requirement**: The array must be sorted and, ideally, uniformly distributed for optimal performance."
                    },
                    {
                        type: "text",
                        content: "**How Interpolation Search works**:\n1. Calculate the probable position of the target using the formula:\n   `pos = lo + ((x - arr[lo]) * (hi - lo)) / (arr[hi] - arr[lo])`\n2. If the element at `pos` equals the target, return that position\n3. If the target is greater than the element at `pos`, search in the right subarray\n4. If the target is less than the element at `pos`, search in the left subarray\n5. Repeat until the element is found or the search space is exhausted"
                    },
                    {
                        type: "text",
                        content: "**For example**, searching for 18 in sorted array [10, 12, 13, 16, 18, 19, 20, 21, 22, 23]:\n1. Initial: lo=0, hi=9\n2. Calculate pos = 0 + ((18-10)*(9-0))/(23-10) ≈ 0 + (8*9)/13 ≈ 0 + 5.53 ≈ 5\n3. arr[5] = 19 > 18, so search left subarray\n4. Updated: lo=0, hi=4\n5. Calculate pos = 0 + ((18-10)*(4-0))/(18-10) ≈ 0 + (8*4)/8 ≈ 0 + 4 = 4\n6. arr[4] = 18 = target, so return 4"
                    },
                    {
                        type: "text",
                        content: "**Interpolation vs. Binary Search**:\nBinary search always checks the middle element, while interpolation search makes an intelligent guess based on the target value and the distribution. For uniformly distributed arrays, interpolation search can reduce the time complexity to O(log log n), but for worst-case scenarios, it can degrade to O(n)."
                    },
                    {
                        type: "text",
                        content: "**Applications**:\n- Searching in telephone directories where names are more or less uniformly distributed\n- Searching in databases with uniformly distributed values\n- Used in some variations of hash tables for probing\n\n**Time Complexity**:\n- Best case: O(1) (element is found in first attempt)\n- Average case (uniform distribution): O(log log n)\n- Worst case: O(n) (when elements are not uniformly distributed)"
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `// Interpolation search implementation
int interpolationSearch(int arr[], int n, int x)
{
    // Find indexes of two corners
    int lo = 0, hi = (n - 1);
    
    // Since array is sorted, an element present
    // must be in range defined by corner elements
    while (lo <= hi && x >= arr[lo] && x <= arr[hi])
    {
        // If array has only one element
        if (lo == hi)
        {
            if (arr[lo] == x) return lo;
            return -1;
        }
        
        // Calculate the probable position using formula
        int pos = lo + (((double)(hi - lo) / (arr[hi] - arr[lo])) * (x - arr[lo]));
        
        // If target is found
        if (arr[pos] == x)
            return pos;
            
        // If x is larger, x is in right subarray
        if (arr[pos] < x)
            lo = pos + 1;
            
        // If x is smaller, x is in left subarray
        else
            hi = pos - 1;
    }
    
    // Element not found
    return -1;
}`
                    }
                ]
            }
        ]
      },
      {
        id: "dsa-101-m9",
        title: "Sorting",
        description: "Sorting algorithms arrange elements in a specific order, typically numerical or lexicographical. These algorithms are fundamental to computer science and serve as building blocks for many other algorithms and applications.",
        lessons: [
            {
                id: "dsa-101-m9-l1",
                title: "Selection Sort",
                timeToComplete: 15,
                content: [
                    {
                        type: "text",
                        content: "**Selection Sort** is a simple comparison-based sorting algorithm. The main idea behind this algorithm is to divide the array into two parts: a sorted subarray and an unsorted subarray. Initially, the sorted subarray is empty, and the unsorted subarray contains all elements."
                    },
                    {
                        type: "text",
                        content: "**How Selection Sort works**:\n1. Find the minimum element in the unsorted subarray\n2. Swap it with the first element of the unsorted subarray\n3. Move the boundary between sorted and unsorted subarrays one element to the right\n4. Repeat until the entire array is sorted"
                    },
                    {
                        type: "text",
                        content: "**For example**, sorting [64, 25, 12, 22, 11]:\n1. Find minimum in [64, 25, 12, 22, 11] → 11\n2. Swap 11 and 64: [11, 25, 12, 22, 64]\n3. Find minimum in [25, 12, 22, 64] → 12\n4. Swap 12 and 25: [11, 12, 25, 22, 64]\n5. Find minimum in [25, 22, 64] → 22\n6. Swap 22 and 25: [11, 12, 22, 25, 64]\n7. Find minimum in [25, 64] → 25\n8. No swap needed\n9. Only 64 remains, array is sorted: [11, 12, 22, 25, 64]"
                    },
                    {
                        type: "text",
                        content: "**Advantages**:\n- Simple and easy to understand\n- Performs well on small arrays\n- In-place sorting (doesn't require extra memory except for a single temporary variable)\n- Makes the minimum number of swaps (n-1 in the worst case)\n\n**Disadvantages**:\n- O(n²) time complexity makes it inefficient for large arrays\n- Does not preserve the relative order of equal elements (not stable)\n- Performance doesn't improve even if the array is partially sorted"
                    },
                    {
                        type: "text",
                        content: "**Applications**:\n- Used when the array size is small\n- Used when memory usage is a concern (due to minimal space complexity)\n- Educational purposes to introduce sorting concepts\n\n**Time Complexity**:\n- Best case: O(n²)\n- Average case: O(n²)\n- Worst case: O(n²)\n**Space Complexity**: O(1)"
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `// Selection Sort implementation
void selectionSort(int arr[], int n)
{
    int i, j, min_idx;
    
    // One by one move boundary of unsorted subarray
    for (i = 0; i < n-1; i++)
    {
        // Find the minimum element in unsorted array
        min_idx = i;
        for (j = i+1; j < n; j++)
        {
            if (arr[j] < arr[min_idx])
                min_idx = j;
        }
        
        // Swap the found minimum element with the first element
        if (min_idx != i) {
            int temp = arr[min_idx];
            arr[min_idx] = arr[i];
            arr[i] = temp;
        }
    }
}`
                    }
                ]
            },
            {
                id: "dsa-101-m9-l2",
                title: "Merge Sort",
                timeToComplete: 25,
                content: [
                    {
                        type: "text",
                        content: "**Merge Sort** is an efficient, stable, divide-and-conquer sorting algorithm. It divides the input array into smaller subarrays, sorts them recursively, and then merges the sorted subarrays to produce the final sorted output."
                    },
                    {
                        type: "text",
                        content: "**Key principles of Merge Sort**:\n1. **Divide**: Split the array into two equal halves\n2. **Conquer**: Recursively sort both halves\n3. **Combine**: Merge the sorted halves to create a sorted array"
                    },
                    {
                        type: "text",
                        content: "**How Merge Sort works**:\n1. If the array has 0 or 1 elements, it is already sorted\n2. Otherwise, divide the array into two equal halves\n3. Recursively sort both halves\n4. Merge the sorted halves by comparing elements and placing them in correct order"
                    },
                    {
                        type: "text",
                        content: "**For example**, sorting [38, 27, 43, 3, 9, 82, 10]:\n1. Split into [38, 27, 43, 3] and [9, 82, 10]\n2. Further split into [38, 27], [43, 3], [9, 82], and [10]\n3. Further split into [38], [27], [43], [3], [9], [82], and [10]\n4. Single elements are already sorted\n5. Merge [38] and [27] to get [27, 38]\n6. Merge [43] and [3] to get [3, 43]\n7. Merge [9] and [82] to get [9, 82]\n8. [10] remains as is\n9. Merge [27, 38] and [3, 43] to get [3, 27, 38, 43]\n10. Merge [9, 82] and [10] to get [9, 10, 82]\n11. Finally, merge [3, 27, 38, 43] and [9, 10, 82] to get [3, 9, 10, 27, 38, 43, 82]"
                    },
                    {
                        type: "text",
                        content: "**Advantages**:\n- Guaranteed O(n log n) time complexity for all cases\n- Stable sort (maintains relative order of equal elements)\n- Works well for linked lists with O(1) extra space\n- Parallelizable due to divide-and-conquer nature\n\n**Disadvantages**:\n- Requires O(n) extra space for the merge operation\n- For small arrays, the overhead of recursion makes it less efficient\n- Not an in-place sorting algorithm in its standard form"
                    },
                    {
                        type: "text",
                        content: "**Applications**:\n- External sorting (when data doesn't fit in memory)\n- Used in sorting linked lists\n- Inversion count problem\n- Stable sort implementations in programming languages\n\n**Time Complexity**:\n- Best case: O(n log n)\n- Average case: O(n log n)\n- Worst case: O(n log n)\n**Space Complexity**: O(n)"
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `// Merge Sort implementation
void merge(int arr[], int l, int m, int r)
{
    int i, j, k;
    int n1 = m - l + 1;  // Size of left subarray
    int n2 = r - m;      // Size of right subarray
    
    // Create temporary arrays
    int L[n1], R[n2];
    
    // Copy data to temporary arrays
    for (i = 0; i < n1; i++)
        L[i] = arr[l + i];
    for (j = 0; j < n2; j++)
        R[j] = arr[m + 1 + j];
    
    // Merge the temporary arrays back into arr[l..r]
    i = 0;    // Initial index of first subarray
    j = 0;    // Initial index of second subarray
    k = l;    // Initial index of merged subarray
    while (i < n1 && j < n2)
    {
        if (L[i] <= R[j])
        {
            arr[k] = L[i];
            i++;
        }
        else
        {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    
    // Copy the remaining elements of L[], if there are any
    while (i < n1)
    {
        arr[k] = L[i];
        i++;
        k++;
    }
    
    // Copy the remaining elements of R[], if there are any
    while (j < n2)
    {
        arr[k] = R[j];
        j++;
        k++;
    }
}

// l is for left index and r is for right index of the sub-array of arr to be sorted
void mergeSort(int arr[], int l, int r)
{
    if (l < r)
    {
        // Find the middle point
        int m = l + (r - l) / 2;
        
        // Sort first and second halves
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        
        // Merge the sorted halves
        merge(arr, l, m, r);
    }
}`
                    }
                ]
            },
            {
                id: "dsa-101-m9-l3",
                title: "Heap Sort",
                timeToComplete: 25,
                content: [
                    {
                        type: "text",
                        content: "**Heap Sort** is a comparison-based sorting algorithm that uses a binary heap data structure. It's similar to selection sort where we first find the maximum element and place it at the end. However, Heap Sort uses a heap to find the maximum element more efficiently."
                    },
                    {
                        type: "text",
                        content: "**Binary Heap Basics**:\nA binary heap is a complete binary tree where each node is either greater than or equal to its children (max heap) or less than or equal to its children (min heap). For Heap Sort, we typically use a max heap."
                    },
                    {
                        type: "text",
                        content: "**How Heap Sort works**:\n1. Build a max heap from the input array\n2. Extract the maximum element (root) and swap it with the last element in the heap\n3. Reduce the heap size by 1 and heapify the root element\n4. Repeat steps 2-3 until the heap size becomes 1"
                    },
                    {
                        type: "text",
                        content: "**For example**, sorting [4, 10, 3, 5, 1]:\n1. Build max heap: [10, 5, 3, 4, 1]\n2. Swap 10 with 1: [1, 5, 3, 4, 10], heapify first 4 elements\n3. After heapify: [5, 4, 3, 1]\n4. Swap 5 with 1: [1, 4, 3, 5], heapify first 3 elements\n5. After heapify: [4, 1, 3]\n6. Swap 4 with 3: [3, 1, 4], heapify first 2 elements\n7. After heapify: [3, 1]\n8. Swap 3 with 1: [1, 3], heapify first 1 element\n9. Sorted array: [1, 3, 4, 5, 10]"
                    },
                    {
                        type: "text",
                        content: "**Heapify Process**:\nHeapify is the process of converting a binary tree into a heap. In a max heap, for any given node i, the value must be greater than or equal to its children. If this property is violated, we swap the node with its largest child and continue heapifying downward."
                    },
                    {
                        type: "text",
                        content: "**Advantages**:\n- Guaranteed O(n log n) time complexity\n- In-place sorting (no extra space needed)\n- Works well with very large datasets\n\n**Disadvantages**:\n- Not stable (may change the relative order of equal elements)\n- Poor cache performance due to its non-contiguous accesses\n- Generally slower than quicksort in practice"
                    },
                    {
                        type: "text",
                        content: "**Applications**:\n- Systems concerned with security and embedded systems (due to guaranteed time complexity)\n- Priority queues\n- When space is a concern but stable sorting is not required\n\n**Time Complexity**:\n- Best case: O(n log n)\n- Average case: O(n log n)\n- Worst case: O(n log n)\n**Space Complexity**: O(1)"
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `// Heap Sort implementation

// To heapify a subtree rooted with node i which is
// an index in arr[]. n is size of heap
void heapify(int arr[], int n, int i)
{
    int largest = i;     // Initialize largest as root
    int left = 2*i + 1;  // left child
    int right = 2*i + 2; // right child
    
    // If left child is larger than root
    if (left < n && arr[left] > arr[largest])
        largest = left;
    
    // If right child is larger than largest so far
    if (right < n && arr[right] > arr[largest])
        largest = right;
    
    // If largest is not root
    if (largest != i)
    {
        swap(arr[i], arr[largest]);
        
        // Recursively heapify the affected sub-tree
        heapify(arr, n, largest);
    }
}

// Main function to perform heap sort
void heapSort(int arr[], int n)
{
    // Build heap (rearrange array)
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    
    // One by one extract an element from heap
    for (int i=n-1; i>0; i--)
    {
        // Move current root to end
        swap(arr[0], arr[i]);
        
        // Call max heapify on the reduced heap
        heapify(arr, i, 0);
    }
}`
                    }
                ]
            },
            {
                id: "dsa-101-m9-l4",
                title: "Shell Sort",
                timeToComplete: 20,
                content: [
                    {
                        type: "text",
                        content: "**Shell Sort** is an in-place comparison sort that generalizes insertion sort by allowing the exchange of items that are far apart. It's designed to improve the efficiency of insertion sort by comparing elements separated by a gap and then progressively reducing this gap."
                    },
                    {
                        type: "text",
                        content: "**Developed by Donald Shell in 1959**, this algorithm works by sorting elements at specific intervals, gradually reducing the interval size until it becomes 1, at which point it becomes a standard insertion sort. The method of selecting these intervals (gaps) significantly affects the algorithm's performance."
                    },
                    {
                        type: "text",
                        content: "**How Shell Sort works**:\n1. Start with a large gap value (typically n/2)\n2. Perform insertion sort on elements at gap distance\n3. Reduce the gap (typically gap = gap/2)\n4. Repeat until gap becomes 1, then perform a final insertion sort"
                    },
                    {
                        type: "text",
                        content: "**For example**, sorting [9, 8, 3, 7, 5, 6, 4, 1] with gaps [4, 2, 1]:\n1. With gap=4:\n   - Compare and sort [9, 5] → [5, 9]\n   - Compare and sort [8, 6] → [6, 8]\n   - Compare and sort [3, 4] → [3, 4]\n   - Compare and sort [7, 1] → [1, 7]\n   - Array becomes [5, 6, 3, 1, 9, 8, 4, 7]\n2. With gap=2:\n   - Compare and sort subarrays [5, 3, 9, 4], [6, 1, 8, 7]\n   - Array becomes [3, 1, 4, 5, 6, 7, 8, 9]\n3. With gap=1:\n   - Standard insertion sort\n   - Array becomes [1, 3, 4, 5, 6, 7, 8, 9]"
                    },
                    {
                        type: "text",
                        content: "**Gap Sequences**:\nDifferent gap sequences have been proposed to improve Shell Sort's performance:\n- Original sequence (Shell): n/2, n/4, n/8, ..., 1\n- Knuth's sequence: 1, 4, 13, 40, 121, ... (3ᵏ-1)/2\n- Hibbard's sequence: 1, 3, 7, 15, 31, ... (2ᵏ-1)\n- Sedgewick's sequence: 1, 8, 23, 77, ... combinations of powers of 4 and powers of 2 plus 1"
                    },
                    {
                        type: "text",
                        content: "**Advantages**:\n- Better than simple insertion sort for large arrays\n- In-place sorting with low memory overhead\n- Relatively simple to implement\n- Works well on partially sorted arrays\n\n**Disadvantages**:\n- Complex time analysis\n- Not stable (may change the relative order of equal elements)\n- Performance highly depends on the gap sequence chosen"
                    },
                    {
                        type: "text",
                        content: "**Applications**:\n- Used in embedded systems and hardware sorting networks\n- When simplicity is preferred with reasonable performance\n- For medium-sized arrays (too large for insertion sort, too small for quicksort)\n\n**Time Complexity**:\n- Best case: O(n log n) with optimal gap sequence\n- Average case: Depends on gap sequence, generally O(n^1.25) or less\n- Worst case: O(n²)\n**Space Complexity**: O(1)"
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `// Shell Sort implementation
void shellSort(int arr[], int n)
{
    // Start with a big gap, then reduce the gap
    for (int gap = n/2; gap > 0; gap /= 2)
    {
        // Do a gapped insertion sort for this gap size
        // The first gap elements a[0..gap-1] are already in gapped order
        // keep adding one more element until the entire array is gap sorted
        for (int i = gap; i < n; i += 1)
        {
            // add a[i] to the elements that have been gap sorted
            // save a[i] in temp and make a hole at position i
            int temp = arr[i];
            
            // shift earlier gap-sorted elements up until the correct
            // location for a[i] is found
            int j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap)
                arr[j] = arr[j - gap];
            
            // put temp (the original a[i]) in its correct location
            arr[j] = temp;
        }
    }
}`
                    }
                ]
            },
            {
                id: "dsa-101-m9-l5",
                title: "Radix Sort",
                timeToComplete: 20,
                content: [
                    {
                        type: "text",
                        content: "**Radix Sort** is a non-comparative integer sorting algorithm that sorts data by processing individual digits. Unlike comparison-based algorithms (like quicksort, merge sort), Radix Sort operates by distributing elements into buckets according to their digits, from the least significant digit to the most significant digit."
                    },
                    {
                        type: "text",
                        content: "**Key concept**: Radix Sort uses the concept of stable sort (like counting sort) as a subroutine to sort elements based on individual digits."
                    },
                    {
                        type: "text",
                        content: "**How Radix Sort works**:\n1. Find the maximum number to know the number of digits\n2. Do counting sort for every digit\n   - Start from the least significant digit (rightmost)\n   - Move to the most significant digit (leftmost)\n3. Return the sorted array"
                    },
                    {
                        type: "text",
                        content: "**For example**, sorting [170, 45, 75, 90, 802, 24, 2, 66]:\n1. Maximum number is 802, with 3 digits\n2. Sort by the least significant digit (ones place):\n   - [170, 90, **802**, 2, 24, 45, 75, 66] (numbers ending in 0, 0, 2, 2, 4, 5, 5, 6)\n3. Sort by the tens place:\n   - [**802**, **2**, 24, **45**, 66, **170**, 75, 90] (numbers with tens place 0, 0, 2, 4, 6, 7, 7, 9)\n4. Sort by the hundreds place:\n   - [**2**, 24, 45, 66, 75, 90, **170**, **802**] (numbers with hundreds place 0, 0, 0, 0, 0, 0, 1, 8)"
                    },
                    {
                        type: "text",
                        content: "**Two main variants**:\n- **LSD (Least Significant Digit)**: Start sorting from the least significant digit (rightmost) and move towards the most significant digit. This is the most common implementation.\n- **MSD (Most Significant Digit)**: Start sorting from the most significant digit (leftmost) and move towards the least significant digit. This can be more efficient for strings and variable-length keys."
                    },
                    {
                        type: "text",
                        content: "**Advantages**:\n- Can be faster than comparison-based sorts for certain types of data\n- Linear time complexity when the range of values is limited\n- Stable sort (preserves the relative order of equal elements)\n- Well-suited for sorting strings and fixed-length integer keys\n\n**Disadvantages**:\n- Requires extra space for bucket storage\n- Less efficient when the range of values is large compared to the number of elements\n- Only works directly with integers or strings (requires modification for floating-point values)"
                    },
                    {
                        type: "text",
                        content: "**Applications**:\n- Sorting numbers in a limited range\n- String sorting in lexicographical order\n- Card sorting machines\n- External sorting applications\n\n**Time Complexity**:\n- Best/Average/Worst case: O(d*(n+b)) where:\n  - d is the number of digits\n  - n is the number of elements\n  - b is the base (number of possible values for a digit, typically 10)\n**Space Complexity**: O(n+b)"
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `// Radix Sort implementation using counting sort as a subroutine

// Find the maximum element in the array
int getMax(int arr[], int n)
{
    int mx = arr[0];
    for (int i = 1; i < n; i++)
        if (arr[i] > mx)
            mx = arr[i];
    return mx;
}

// A function to do counting sort of arr[] according to
// the digit represented by exp (e.g., 1, 10, 100, ...)
void countSort(int arr[], int n, int exp)
{
    int output[n];  // output array
    int count[10] = {0};  // count array for digits 0-9
    
    // Store count of occurrences in count[]
    for (i = 0; i < n; i++)
        count[(arr[i]/exp)%10]++;
    
    // Change count[i] so that count[i] now contains actual
    // position of this digit in output[]
    for (i = 1; i < 10; i++)
        count[i] += count[i - 1];
    
    // Build the output array
    for (i = n - 1; i >= 0; i--)
    {
        output[count[(arr[i]/exp)%10] - 1] = arr[i];
        count[(arr[i]/exp)%10]--;
    }
    
    // Copy the output array to arr[], so that arr[] now
    // contains sorted numbers according to current digit
    for (i = 0; i < n; i++)
        arr[i] = output[i];
}

// The main function to sort arr[] of size n using Radix Sort
void radixSort(int arr[], int n)
{
    // Find the maximum number to know number of digits
    int m = getMax(arr, n);
    
    // Do counting sort for every digit
    // Instead of passing digit number, exp is passed
    // exp is 10^i where i is current digit number
    for (int exp = 1; m/exp > 0; exp *= 10)
        countSort(arr, n, exp);
}`
                    }
                ]
            }
        ]
      },
      {
        id: "dsa-101-m10",
        title: "Dynamic Programming",
        description: "Dynamic Programming is an algorithmic paradigm that solves a given complex problem by breaking it into subproblems and stores the results of subproblems to avoid computing the same results again.",
        lessons: [
            {
                id: "dsa-101-m10-l1",
                title: "Fibonacci Series",
                timeToComplete: 15,
                content: [
                    {
                        type: "text",
                        content: "The Fibonacci numbers are the numbers in the following integer sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ···"
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `int fib(int n)
{
    int f[n+2];
    int i;
    
    f[0] = 0;
    f[1] = 1;
    
    for (i = 2; i <= n; i++)
    {
        f[i] = f[i-1] + f[i-2];
    }
    
    return f[n];
}`
                    }
                ]
            },
            {
                id: "dsa-101-m10-l2",
                title: "Longest Common Subsequence",
                timeToComplete: 25,
                content: [
                    {
                        type: "text",
                        content: "Longest Common Subsequence (LCS) problem: Given two sequences, find the length of longest subsequence present in both of them. A subsequence is a sequence that appears in the same relative order, but not necessarily contiguous."
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `int lcs(char *X, char *Y, int m, int n)
{
    int L[m+1][n+1];
    int i, j;
    
    for (i=0; i<=m; i++)
    {
        for (j=0; j<=n; j++)
        {
            if (i == 0 || j == 0)
                L[i][j] = 0;
            else if (X[i-1] == Y[j-1])
                L[i][j] = L[i-1][j-1] + 1;
            else
                L[i][j] = max(L[i-1][j], L[i][j-1]);
        }
    }
    
    return L[m][n];
}`
                    }
                ]
            },
            {
                id: "dsa-101-m10-l3",
                title: "0/1 Knapsack",
                timeToComplete: 25,
                content: [
                    {
                        type: "text",
                        content: "0/1 Knapsack Problem: Given weights and values of n items, put these items in a knapsack of capacity W to get the maximum total value in the knapsack."
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `int knapSack(int W, int wt[], int val[], int n)
{
    int i, w;
    int K[n+1][W+1];
    
    for (i = 0; i <= n; i++)
    {
        for (w = 0; w <= W; w++)
        {
            if (i==0 || w==0)
                K[i][w] = 0;
            else if (wt[i-1] <= w)
                K[i][w] = max(val[i-1] + K[i-1][w-wt[i-1]], K[i-1][w]);
            else
                K[i][w] = K[i-1][w];
        }
    }
    
    return K[n][W];
}`
                    }
                ]
            }
        ]
      },
      {
        id: "dsa-101-m11",
        title: "Strings",
        description: "Strings are arrays of characters. They are widely used in programming languages and have specific algorithms for processing them.",
        lessons: [
            {
                id: "dsa-101-m11-l1",
                title: "Rabin-Karp Algorithm",
                timeToComplete: 20,
                content: [
                    {
                        type: "text",
                        content: "Rabin-Karp algorithm is a string-searching algorithm that uses hashing to find patterns in strings."
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `#define d 256
int search(char pat[], char txt[], int q)
{
    int M = strlen(pat);
    int N = strlen(txt);
    int i, j;
    int p = 0; // hash value for pattern
    int t = 0; // hash value for txt
    int h = 1;
 
    // The value of h would be "pow(d, M-1)%q"
    for (i = 0; i < M - 1; i++)
        h = (h * d) % q;
 
    // Calculate the hash value of pattern and first
    // window of text
    for (i = 0; i < M; i++) {
        p = (d * p + pat[i]) % q;
        t = (d * t + txt[i]) % q;
    }
 
    // Slide the pattern over text one by one
    for (i = 0; i <= N - M; i++) {
 
        // Check the hash values of current window of text
        // and pattern. If the hash values match then only
        // check for characters one by one
        if (p == t) {
            /* Check for characters one by one */
            for (j = 0; j < M; j++) {
                if (txt[i + j] != pat[j])
                    break;
            }
 
            // if p == t and pat[0...M-1] = txt[i, i+1, ...i+M-1]
            if (j == M)
                return i;
        }
 
        // Calculate hash value for next window of text: Remove
        // leading digit, add trailing digit
        if (i < N - M) {
            t = (d * (t - txt[i] * h) + txt[i + M]) % q;
 
            // We might get negative value of t, converting it
            // to positive
            if (t < 0)
                t = (t + q);
        }
    }
    return -1;
}`
                    }
                ]
            },
            {
                id: "dsa-101-m11-l2",
                title: "Anagram Check",
                timeToComplete: 15,
                content: [
                    {
                        type: "text",
                        content: "An anagram of a string is another string that contains the same characters, only the order of characters can be different. For example, 'abcd' and 'dabc' are an anagram of each other."
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `bool areAnagram(string str1, string str2)
{
    int n1 = str1.length();
    int n2 = str2.length();
    
    if (n1 != n2)
        return false;
    
    sort(str1.begin(), str1.end());
    sort(str2.begin(), str2.end());
    
    for (int i = 0; i < n1; i++)
        if (str1[i] != str2[i])
            return false;
    
    return true;
}`
                    }
                ]
            }
        ]
      },
      {
        id: "dsa-101-m12",
        title: "Recursion",
        description: "Recursion is a method where the solution to a problem depends on solutions to smaller instances of the same problem.",
        lessons: [
            {
                id: "dsa-101-m12-l1",
                title: "Tower of Hanoi",
                timeToComplete: 20,
                content: [
                    {
                        type: "text",
                        content: "Tower of Hanoi is a mathematical puzzle where we have three rods and n disks. The objective of the puzzle is to move all the disks from source rod to destination rod using an auxiliary rod."
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `void towerOfHanoi(int n, char from_rod, char to_rod, char aux_rod)
{
    if (n == 1)
    {
        cout << \"Move disk 1 from rod \" << from_rod << \" to rod \" << to_rod << endl;
        return;
    }
    towerOfHanoi(n-1, from_rod, aux_rod, to_rod);
    cout << \"Move disk \" << n << \" from rod \" << from_rod << \" to rod \" << to_rod << endl;
    towerOfHanoi(n-1, aux_rod, to_rod, from_rod);
}`
                    }
                ]
            },
            {
                id: "dsa-101-m12-l2",
                title: "Factorial",
                timeToComplete: 15,
                content: [
                    {
                        type: "text",
                        content: "Factorial of a non-negative integer n, denoted by n!, is the product of all positive integers less than or equal to n."
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `int factorial(int n)
{
    if (n == 0)
        return 1;
    return n * factorial(n - 1);
}`
                    }
                ]
            }
        ]
      },
      {
        id: "dsa-101-m13",
        title: "Graphs",
        description: "A Graph is a non-linear data structure consisting of nodes and edges. It is used to represent pairwise relations between objects.",
        lessons: [
            {
                id: "dsa-101-m13-l1",
                title: "Breadth First Search",
                timeToComplete: 25,
                content: [
                    {
                        type: "text",
                        content: "Breadth First Search (BFS) is an algorithm for traversing or searching tree or graph data structures. It starts at the tree root (or some arbitrary node of a graph) and explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level."
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `void BFS(int s, vector<int> adj[], bool visited[])
{
    queue<int> q;
    visited[s] = true;
    q.push(s);
    
    while(!q.empty())
    {
        int u = q.front();
        cout << u << " ";
        q.pop();
        
        for(int i = 0; i < adj[u].size(); i++)
        {
            if(visited[adj[u][i]] == false)
            {
                visited[adj[u][i]] = true;
                q.push(adj[u][i]);
            }
        }
    }`
                    }
                ]
            },
            {
                id: "dsa-101-m13-l2",
                title: "Depth First Search",
                timeToComplete: 25,
                content: [
                    {
                        type: "text",
                        content: "Depth First Search (DFS) is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node and explores as far as possible along each branch before backtracking."
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `void DFS(int s, vector<int> adj[], bool visited[])
{
    visited[s] = true;
    cout << s << " ";
    
    for(int i = 0; i < adj[s].size(); i++)
    {
        if(visited[adj[s][i]] == false)
            DFS(adj[s][i], adj, visited);
    }
}`
                    }
                ]
            },
            {
                id: "dsa-101-m13-l3",
                title: "Dijkstra's Algorithm",
                timeToComplete: 30,
                content: [
                    {
                        type: "text",
                        content: "Dijkstra's algorithm is an algorithm for finding the shortest paths between nodes in a graph, which may represent, for example, road networks."
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `void dijkstra(int graph[V][V], int src)
{
    int dist[V];
    bool sptSet[V];
    
    for (int i = 0; i < V; i++)
    {
        dist[i] = INT_MAX;
        sptSet[i] = false;
    }
    
    dist[src] = 0;
    
    for (int count = 0; count < V-1; count++)
    {
        int u = minDistance(dist, sptSet);
        
        sptSet[u] = true;
        
        for (int v = 0; v < V; v++)
        {
            if (!sptSet[v] && graph[u][v] && dist[u] != INT_MAX && dist[u]+graph[u][v] < dist[v])
                dist[v] = dist[u] + graph[u][v];
        }
    }
}`
                    }
                ]
            },
            {
                id: "dsa-101-m13-l4",
                title: "Bellman Ford Algorithm",
                timeToComplete: 30,
                content: [
                    {
                        type: "text",
                        content: "Bellman Ford algorithm is a single source shortest path algorithm. The algorithm finds the shortest path from a source node to all other nodes in the graph, including those with negative edge weights."
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `void BellmanFord(int graph[][3], int V, int E, int src)
{
    int dist[V];
    for (int i = 0; i < V; i++)
        dist[i] = INT_MAX;
    dist[src] = 0;
    
    for (int i = 0; i < V - 1; i++)
    {
        for (int j = 0; j < E; j++)
        {
            int u = graph[j][0];
            int v = graph[j][1];
            int weight = graph[j][2];
            if (dist[u] != INT_MAX && dist[u] + weight < dist[v])
                dist[v] = dist[u] + weight;
        }
    }
    
    for (int i = 0; i < E; i++)
    {
        int u = graph[i][0];
        int v = graph[i][1];
        int weight = graph[i][2];
        if (dist[u] != INT_MAX && dist[u] + weight < dist[v])
            cout << "Graph contains negative weight cycle";
    }
}`
                    }
                ]
            },
            {
                id: "dsa-101-m13-l5",
                title: "Topological Sort",
                timeToComplete: 25,
                content: [
                    {
                        type: "text",
                        content: "Topological sorting for Directed Acyclic Graph (DAG) is a linear ordering of vertices such that for every directed edge uv, vertex u comes before v in the ordering."
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `void topologicalSortUtil(int v, bool visited[], stack<int> &Stack, vector<int> adj[])
{
    visited[v] = true;
    
    for (auto i = adj[v].begin(); i != adj[v].end(); ++i)
        if (!visited[*i])
            topologicalSortUtil(*i, visited, Stack, adj);
    
    Stack.push(v);
}

void topologicalSort(vector<int> adj[], int V)
{
    stack<int> Stack;
    bool *visited = new bool[V];
    for (int i = 0; i < V; i++)
        visited[i] = false;
    
    for (int i = 0; i < V; i++)
      if (visited[i] == false)
        topologicalSortUtil(i, visited, Stack, adj);
    
    while (Stack.empty() == false)
    {
        cout << Stack.top() << " ";
        Stack.pop();
    }
}`
                    }
                ]
            }
        ]
      },
      {
        id: "dsa-101-m14",
        title: "Number System",
        description: "Number System is a mathematical notation for representing numbers of a given set using digits or other symbols in a consistent manner.",
        lessons: [
            {
                id: "dsa-101-m14-l1",
                title: "Binary to Decimal",
                timeToComplete: 15,
                content: [
                    {
                        type: "text",
                        content: "Binary to decimal conversion involves converting a number from base 2 (binary) to base 10 (decimal)."
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `int binaryToDecimal(int n)
{
    int num = n;
    int dec_value = 0;
    
    int base = 1;
    
    int temp = num;
    while (temp)
    {
        int last_digit = temp % 10;
        temp = temp / 10;
        
        dec_value += last_digit * base;
        
        base = base * 2;
    }
    
    return dec_value;
}`
                    }
                ]
            },
            {
                id: "dsa-101-m14-l2",
                title: "Decimal to Binary",
                timeToComplete: 15,
                content: [
                    {
                        type: "text",
                        content: "Decimal to binary conversion involves converting a number from base 10 (decimal) to base 2 (binary)."
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `string decimalToBinary(int n)
{
    string s = "";
    
    while (n > 0)
    {
        s = to_string(n % 2) + s;
        n = n / 2;
    }
    
    return s;
}`
                    }
                ]
            },
            {
                id: "dsa-101-m14-l3",
                title: "Decimal to Hexadecimal",
                timeToComplete: 15,
                content: [
                    {
                        type: "text",
                        content: "Decimal to hexadecimal conversion involves converting a number from base 10 (decimal) to base 16 (hexadecimal)."
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `string decimalToHexadecimal(int n)
{
    string s = "";
    
    while (n > 0)
    {
        int r = n % 16;
        
        if (r < 10)
            s = to_string(r) + s;
        else
            s = char(55 + r) + s;
        
        n = n / 16;
    }
    
    return s;
}`
                    }
                ]
            },
            {
                id: "dsa-101-m14-l4",
                title: "Hexadecimal to Decimal",
                timeToComplete: 15,
                content: [
                    {
                        type: "text",
                        content: "Hexadecimal to decimal conversion involves converting a number from base 16 (hexadecimal) to base 10 (decimal)."
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `int hexadecimalToDecimal(string hexVal)
{
    int len = hexVal.length();
    
    int base = 1;
    
    int dec_val = 0;
    
    for (int i=len-1; i>=0; i--)
    {
        if (hexVal[i]>='0' && hexVal[i]<='9')
        {
            dec_val += (hexVal[i] - '0') * base;
            base = base * 16;
        }
        else if (hexVal[i]>='A' && hexVal[i]<='F')
        {
            dec_val += (hexVal[i] - 'A' + 10) * base;
            base = base * 16;
        }
    }
    
    return dec_val;
}`
                    }
                ]
            }
        ]
      },
      {
        id: "dsa-101-m15",
        title: "Backtracking",
        description: "Backtracking is an algorithmic technique for solving problems recursively by trying to build a solution incrementally, one piece at a time, removing those solutions that fail to satisfy the constraints of the problem at any point of time.",
        lessons: [
            {
                id: "dsa-101-m15-l1",
                title: "N-Queens Problem",
                timeToComplete: 30,
                content: [
                    {
                        type: "text",
                        content: "The N-Queens problem is the problem of placing N chess queens on an N×N chessboard so that no two queens attack each other."
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `bool isSafe(int board[N][N], int row, int col)
{
    int i, j;
    
    /* Check this row on left side */
    for (i = 0; i < col; i++)
        if (board[row][i])
            return false;
    
    /* Check upper diagonal on left side */
    for (i=row, j=col; i>=0 && j>=0; i--, j--)
        if (board[i][j])
            return false;
    
    /* Check lower diagonal on left side */
    for (i=row, j=col; j>=0 && i<N; i++, j--)
        if (board[i][j])
            return false;
    
    return true;
}

bool solveNQUtil(int board[N][N], int col)
{
    /* base case: If all queens are placed
      then return true */
    if (col >= N)
        return true;
    
    /* Consider this column and try placing
       this queen in all rows one by one */
    for (int i = 0; i < N; i++)
    {
        /* Check if the queen can be placed on
          board[i][col] */
        if (isSafe(board, i, col))
        {
            /* Place this queen in board[i][col] */
            board[i][col] = 1;
            
            /* recur to place rest of the queens */
            if (solveNQUtil(board, col + 1))
                return true;
            
            /* If placing queen in board[i][col]
               doesn't lead to a solution, then
               remove queen from board[i][col] */
            board[i][col] = 0; // BACKTRACK
        }
    }
    
    /* If the queen cannot be placed in any row in
        this column col  then return false */
    return false;
}`
                    }
                ]
            },
            {
                id: "dsa-101-m15-l2",
                title: "Rat in a Maze",
                timeToComplete: 25,
                content: [
                    {
                        type: "text",
                        content: "The Rat in a Maze problem is about finding a path from the source to the destination in a maze. A maze is a 2D matrix where some cells are blocked."
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `bool isSafe(int maze[N][N], int x, int y)
{
    // if (x, y outside maze) return false
    if (x >= 0 && x < N && y >= 0 && y < N && maze[x][y] == 1)
        return true;
    
    return false;
}

bool solveMazeUtil(int maze[N][N], int x, int y, int sol[N][N])
{
    // if (x, y is goal) return true
    if (x == N - 1 && y == N - 1 && maze[x][y] == 1)
    {
        sol[x][y] = 1;
        return true;
    }
    
    // Check if maze[x][y] is valid
    if (isSafe(maze, x, y) == true)
    {
        // mark x, y as part of solution path
        sol[x][y] = 1;
        
        /* Move forward in x direction */
        if (solveMazeUtil(maze, x + 1, y, sol) == true)
            return true;
        
        /* If moving in x direction doesn't give
           solution then Move down in y direction */
        if (solveMazeUtil(maze, x, y + 1, sol) == true)
            return true;
        
        /* If none of the above movements works then
           BACKTRACK: unmark x, y as part of solution
           path */
        sol[x][y] = 0;
        return false;
    }
    
    return false;
}`
                    }
                ]
            }
        ]
      },
      {
        id: "dsa-101-m16",
        title: "Maths",
        description: "Mathematical algorithms and concepts that are commonly used in computer science and programming.",
        lessons: [
            {
                id: "dsa-101-m16-l1",
                title: "Prime Number Check",
                timeToComplete: 15,
                content: [
                    {
                        type: "text",
                        content: "A prime number is a natural number greater than 1 that is not a product of two smaller natural numbers. This algorithm checks if a given number is prime."
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `bool isPrime(int n)
{
    // Corner cases
    if (n <= 1) return false;
    if (n <= 3) return true;
    
    // This is checked so that we can skip
    // middle five numbers in below loop
    if (n % 2 == 0 || n % 3 == 0) return false;
    
    for (int i = 5; i * i <= n; i = i + 6)
        if (n % i == 0 || n % (i + 2) == 0)
            return false;
    
    return true;
}`
                    }
                ]
            },
            {
                id: "dsa-101-m16-l2",
                title: "Prime Sieve",
                timeToComplete: 20,
                content: [
                    {
                        type: "text",
                        content: "The Sieve of Eratosthenes is an ancient algorithm for finding all prime numbers up to any given limit. It does so by iteratively marking as composite (not prime) the multiples of each prime, starting from the first prime number, 2."
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `void SieveOfEratosthenes(int n)
{
    bool prime[n+1];
    memset(prime, true, sizeof(prime));
    
    for (int p=2; p*p<=n; p++)
    {
        // If prime[p] is not changed, then it is a prime
        if (prime[p] == true)
        {
            // Update all multiples of p greater than or
            // equal to the square of it
            // numbers which are multiple of p and are
            // less than p^2 are already been marked.
            for (int i=p*p; i<=n; i += p)
                prime[i] = false;
        }
    }
    
    // Print all prime numbers
    for (int p=2; p<=n; p++)
       if (prime[p])
          cout << p << " ";
}`
                    }
                ]
            },
            {
                id: "dsa-101-m16-l3",
                title: "Armstrong Number",
                timeToComplete: 15,
                content: [
                    {
                        type: "text",
                        content: "An Armstrong number is a number that is equal to the sum of the cubes of its digits. For example, 153 is an Armstrong number because 1^3 + 5^3 + 3^3 = 153."
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `bool isArmstrong(int n)
{
    int temp = n;
    int sum = 0;
    int digit;
    
    while (temp != 0)
    {
        digit = temp % 10;
        sum += digit * digit * digit;
        temp /= 10;
    }
    
    return (sum == n);
}`
                    }
                ]
            },
            {
                id: "dsa-101-m16-l4",
                title: "Palindrome Check",
                timeToComplete: 10,
                content: [
                    {
                        type: "text",
                        content: "A palindrome is a word, number, phrase, or other sequence of characters which reads the same backward as forward. Examples include 'madam', 'racecar', and '12321'."
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `bool isPalindrome(string str)
{
    int l = 0;
    int h = str.length() - 1;
    
    // Keep comparing characters while they are same
    while (h > l)
    {
        if (str[l++] != str[h--])
        {
            return false;
        }
    }
    return true;
}`
                    }
                ]
            }
        ]
      },
      {
        id: "dsa-101-m17",
        title: "Trie",
        description: "Trie is an efficient information retrieval data structure. It is a tree-like data structure used to store a dynamic set or associative array where the keys are usually strings.",
        lessons: [
            {
                id: "dsa-101-m17-l1",
                title: "Trie Implementation",
                timeToComplete: 25,
                content: [
                    {
                        type: "text",
                        content: "A trie, also called digital tree or prefix tree, is a kind of search tree—an ordered tree data structure used to store a dynamic set or associative array where the keys are usually strings."
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `struct TrieNode {
    struct TrieNode *children[26];
    bool isEndOfWord;
};

struct TrieNode *getNode(void)
{
    struct TrieNode *pNode = new TrieNode;
    
    pNode->isEndOfWord = false;
    
    for (int i = 0; i < 26; i++)
        pNode->children[i] = NULL;
    
    return pNode;
}

void insert(struct TrieNode *root, string key)
{
    struct TrieNode *pCrawl = root;
    
    for (int i = 0; i < key.length(); i++)
    {
        int index = key[i] - 'a';
        if (!pCrawl->children[index])
            pCrawl->children[index] = getNode();
        
        pCrawl = pCrawl->children[index];
    }
    
    pCrawl->isEndOfWord = true;
}

bool search(struct TrieNode *root, string key)
{
    struct TrieNode *pCrawl = root;
    
    for (int i = 0; i < key.length(); i++)
    {
        int index = key[i] - 'a';
        if (!pCrawl->children[index])
            return false;
        
        pCrawl = pCrawl->children[index];
    }
    
    return (pCrawl != NULL && pCrawl->isEndOfWord);
}`
                    }
                ]
            },
            {
                id: "dsa-101-m17-l2",
                title: "Word Search in a Trie",
                timeToComplete: 20,
                content: [
                    {
                        type: "text",
                        content: "Using a trie data structure to efficiently search for a word in a dictionary."
                    },
                    {
                        type: "code",
                        language: "cpp",
                        content: `bool searchWord(struct TrieNode *root, string word)
{
    struct TrieNode *node = root;
    for (int i = 0; i < word.length(); i++)
    {
        int index = word[i] - 'a';
        if (!node->children[index])
            return false;
        
        node = node->children[index];
    }
    
    return (node != NULL && node->isEndOfWord);
}`
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
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    difficulty: "beginner",
    creator: "PubHub Team",
    createdAt: "2025-04-20T00:00:00Z",
    updatedAt: "2025-06-15T00:00:00Z",
    modules: [
      {
        id: "js-fundamentals-m1",
        title: "JavaScript Fundamentals",
        description: "Introduction to JavaScript, variables, data types, and basic syntax.",
        lessons: [
          { id: "js-fundamentals-m1-l1", title: "Introduction to JavaScript", timeToComplete: 10, content: [
            { type: "text", content: "What is JavaScript? History, usage, and where it runs." },
            { type: "code", language: "javascript", content: "// JavaScript runs in browsers and on servers (Node.js)\nconsole.log('Hello, JavaScript!');" },
            { type: "text", content: "JavaScript was created in 1995 by Brendan Eich. Today, it powers most interactive websites and is also used for server-side development with Node.js. It is one of the core technologies of the web, alongside HTML and CSS." },
            { type: "text", content: "\u26a0\ufe0f Common Pitfall: JavaScript is not the same as Java! They are different languages with different purposes." }
          ] },
          { id: "js-fundamentals-m1-l2", title: "Code Structure & Statements", timeToComplete: 10, content: [
            { type: "text", content: "Statements, semicolons, and code blocks." },
            { type: "code", language: "javascript", content: "{\n  let x = 5;\n  let y = 10;\n  console.log(x + y); // 15\n}" },
            { type: "text", content: "Tip: JavaScript automatically inserts semicolons in most cases, but omitting them can sometimes cause bugs. It's a good practice to use semicolons consistently." },
            { type: "text", content: "Real-world: Code blocks are used in functions, loops, and conditionals to group multiple statements together." }
          ] },
          { id: "js-fundamentals-m1-l3", title: "Variables: let, const, var", timeToComplete: 15, content: [
            { type: "text", content: "Declaring variables, scope, and best practices." },
            { type: "code", language: "javascript", content: "let name = 'Alice';\nconst PI = 3.14;\nvar age = 30;" },
            { type: "text", content: "\u2705 Best Practice: Use 'let' for variables that change, 'const' for constants, and avoid 'var' in modern code due to its function-scoped behavior." },
            { type: "text", content: "Did you know? Variables declared with 'let' and 'const' are block-scoped, while 'var' is function-scoped." }
          ] },
          { id: "js-fundamentals-m1-l4", title: "Data Types", timeToComplete: 15, content: [
            { type: "text", content: "Primitive types: string, number, boolean, null, undefined, symbol, bigint." },
            { type: "code", language: "javascript", content: "let str = 'Hello';\nlet num = 42;\nlet bool = true;\nlet n = null;\nlet u = undefined;\nlet sym = Symbol('id');\nlet big = 12345678901234567890n;" },
            { type: "text", content: "Tip: Use 'typeof' to check the type of a value. Example: typeof str // 'string'" },
            { type: "text", content: "Common Pitfall: typeof null returns 'object' (this is a long-standing JavaScript quirk)." }
          ] },
          { id: "js-fundamentals-m1-l5", title: "Type Conversion", timeToComplete: 10, content: [
            { type: "text", content: "Implicit and explicit type conversion in JavaScript." },
            { type: "code", language: "javascript", content: "let num = '5' * 2; // 10 (implicit)\nlet str = String(123); // '123' (explicit)" },
            { type: "text", content: "Real-world: Type coercion can lead to unexpected results. For example, '5' + 2 results in '52' (string), but '5' - 2 results in 3 (number)." },
            { type: "text", content: "Tip: Always be explicit with type conversions to avoid bugs." }
          ] }
        ]
      },
      {
        id: "js-fundamentals-m2",
        title: "Operators and Expressions",
        description: "Learn about JavaScript operators and how to use them in expressions.",
        lessons: [
          { id: "js-fundamentals-m2-l1", title: "Basic Operators", timeToComplete: 10, content: [
            { type: "text", content: "Arithmetic, assignment, comparison, logical, and string operators." },
            { type: "code", language: "javascript", content: "let a = 5 + 3; // 8 (arithmetic)\nlet b = 10;\nb += 2; // 12 (assignment)\nlet isEqual = (a === b); // false (comparison)\nlet isTrue = true && false; // false (logical)\nlet str = 'Hello' + ' ' + 'World'; // 'Hello World' (string)" },
            { type: "text", content: "Tip: Use === instead of == for comparison to avoid unexpected type coercion." },
            { type: "text", content: "Real-world: Logical operators are often used in conditional rendering in frameworks like React." }
          ] },
          { id: "js-fundamentals-m2-l2", title: "Operator Precedence", timeToComplete: 10, content: [
            { type: "text", content: "How JavaScript evaluates complex expressions." },
            { type: "code", language: "javascript", content: "let result = 2 + 3 * 4; // 14 (multiplication first)\nlet grouped = (2 + 3) * 4; // 20 (parentheses first)" },
            { type: "text", content: "Tip: Use parentheses to make your code more readable and to ensure the intended order of operations." }
          ] },
          { id: "js-fundamentals-m2-l3", title: "Bitwise and Other Operators", timeToComplete: 10, content: [
            { type: "text", content: "Bitwise, typeof, instanceof, and more." },
            { type: "code", language: "javascript", content: "let bit = 5 & 1; // 1 (bitwise AND)\nconsole.log(typeof 123); // 'number'\nconsole.log([] instanceof Array); // true" },
            { type: "text", content: "Did you know? Bitwise operators are rarely used in everyday web development, but are important in low-level programming and performance-critical code." }
          ] }
        ]
      },
      {
        id: "js-fundamentals-m3",
        title: "Control Flow",
        description: "Control the flow of your programs with conditions and loops.",
        lessons: [
          { id: "js-fundamentals-m3-l1", title: "Conditional Statements", timeToComplete: 10, content: [
            { type: "text", content: "if, else, else if, switch statements." },
            { type: "code", language: "javascript", content: "let age = 18;\nif (age >= 18) {\n  console.log('Adult');\n} else {\n  console.log('Minor');\n}\n\nlet color = 'red';\nswitch (color) {\n  case 'red':\n    console.log('Stop');\n    break;\n  case 'green':\n    console.log('Go');\n    break;\n  default:\n    console.log('Unknown');\n}" }
          ] },
          { id: "js-fundamentals-m3-l2", title: "Loops", timeToComplete: 15, content: [
            { type: "text", content: "for, while, do...while, break, continue." },
            { type: "code", language: "javascript", content: "for (let i = 0; i < 3; i++) {\n  console.log(i);\n}\n\nlet j = 0;\nwhile (j < 3) {\n  console.log(j);\n  j++;\n}\n\nlet k = 0;\ndo {\n  console.log(k);\n  k++;\n} while (k < 3);" }
          ] },
          { id: "js-fundamentals-m3-l3", title: "The ? (Ternary) Operator", timeToComplete: 5, content: [
            { type: "text", content: "Short conditional expressions." },
            { type: "code", language: "javascript", content: "let age = 20;\nlet status = (age >= 18) ? 'Adult' : 'Minor';\nconsole.log(status);" }
          ] }
        ]
      },
      {
        id: "js-fundamentals-m4",
        title: "Functions",
        description: "Defining and using functions in JavaScript.",
        lessons: [
          { id: "js-fundamentals-m4-l1", title: "Function Declaration & Expression", timeToComplete: 10, content: [
            { type: "text", content: "How to declare and use functions." },
            { type: "code", language: "javascript", content: "function greet(name) {\n  return 'Hello, ' + name;\n}\n\nconst sayHi = function(name) {\n  return 'Hi, ' + name;\n};" }
          ] },
          { id: "js-fundamentals-m4-l2", title: "Arrow Functions", timeToComplete: 10, content: [
            { type: "text", content: "ES6 arrow function syntax and use cases." },
            { type: "code", language: "javascript", content: "const add = (a, b) => a + b;\nconsole.log(add(2, 3)); // 5" }
          ] },
          { id: "js-fundamentals-m4-l3", title: "Parameters and Arguments", timeToComplete: 10, content: [
            { type: "text", content: "Default, rest, and spread parameters." },
            { type: "code", language: "javascript", content: "function sum(a = 1, b = 2) {\n  return a + b;\n}\n\nfunction total(...nums) {\n  return nums.reduce((acc, n) => acc + n, 0);\n}\n\nlet arr = [1, 2, 3];\nconsole.log(Math.max(...arr));" }
          ] },
          { id: "js-fundamentals-m4-l4", title: "Return Values and Scope", timeToComplete: 10, content: [
            { type: "text", content: "Function return values and variable scope." },
            { type: "code", language: "javascript", content: "function square(x) {\n  return x * x;\n}\n\nfunction outer() {\n  let outerVar = 'I am outside!';\n  function inner() {\n    return outerVar;\n  }\n  return inner();\n}" }
          ] }
        ]
      },
      {
        id: "js-fundamentals-m5",
        title: "Objects and Arrays",
        description: "Work with objects and arrays, the core data structures in JavaScript.",
        lessons: [
          { id: "js-fundamentals-m5-l1", title: "Objects: Basics", timeToComplete: 10, content: [
            { type: "text", content: "Objects are one of the most fundamental data structures in JavaScript. They allow you to store collections of key-value pairs, where keys are strings (or Symbols) and values can be any type. You can create objects using curly braces or the Object constructor. Properties can be added, updated, or deleted dynamically. Objects are used to model real-world entities and to group related data and functions together. Mastering objects is essential for working with more complex JavaScript code." },
            { type: "code", language: "javascript", content: "const user = { name: 'Alice', age: 25 }\nuser.age = 26;\ndelete user.name;\nconsole.log(user); // { age: 26 }" }
          ] },
          { id: "js-fundamentals-m5-l2", title: "Arrays: Basics", timeToComplete: 10, content: [
            { type: "text", content: "Arrays are ordered collections of values, used to store lists of items in JavaScript. You can create arrays using square brackets and access elements by their index, starting from zero. Arrays have a dynamic length and can hold any type of value, including other arrays or objects. Common operations include adding, removing, and iterating over elements. Arrays are essential for handling data sets, loops, and many built-in JavaScript methods rely on them. Understanding arrays is key to effective JavaScript programming." },
            { type: "code", language: "javascript", content: "let arr = [1, 2, 3];\narr.push(4);\nconsole.log(arr[0]); // 1\nconsole.log(arr.length); // 4" }
          ] },
          { id: "js-fundamentals-m5-l3", title: "Array Methods", timeToComplete: 15, content: [
            { type: "text", content: "JavaScript arrays come with a variety of powerful methods for manipulating and processing data. Methods like map, filter, and reduce allow you to transform, select, and aggregate array elements efficiently. forEach lets you iterate over each element, performing actions or side effects. These methods are essential for writing clean, functional code and are widely used in modern JavaScript development. Mastering array methods will help you solve complex data problems with concise, readable code. Practice using these methods to become a more effective JavaScript developer." },
            { type: "code", language: "javascript", content: "let nums = [1, 2, 3, 4];\nlet doubled = nums.map(n => n * 2);\nlet evens = nums.filter(n => n % 2 === 0);\nlet sum = nums.reduce((acc, n) => acc + n, 0);\nnums.forEach(n => console.log(n));" }
          ] },
          { id: "js-fundamentals-m5-l4", title: "Object Methods & 'this'", timeToComplete: 10, content: [
            { type: "text", content: "Objects can have methods, which are functions stored as properties. The 'this' keyword inside a method refers to the object the method belongs to. Understanding how 'this' works is crucial for writing correct object-oriented code in JavaScript. Methods allow objects to perform actions and interact with their own data. You can define methods using function expressions or ES6 shorthand syntax. Mastering object methods and 'this' is key to building reusable and maintainable code." },
            { type: "code", language: "javascript", content: "const person = {\n  name: 'Bob',\n  greet() {\n    return 'Hello, ' + this.name;\n  }\n};\nconsole.log(person.greet()); // Hello, Bob" }
          ] }
        ]
      },
      {
        id: "js-fundamentals-m6",
        title: "Advanced Functions",
        description: "Closures, context, and advanced function patterns.",
        lessons: [
          { id: "js-fundamentals-m6-l1", title: "Closures", timeToComplete: 15, content: [
            { type: "text", content: "A closure is a function that remembers the environment in which it was created. This means it can access variables from its outer (enclosing) function even after that function has finished executing. Closures are a powerful feature in JavaScript, enabling data privacy and function factories. They are commonly used in callbacks, event handlers, and module patterns. Understanding closures is essential for mastering advanced JavaScript concepts. Practice creating and using closures to deepen your understanding." },
            { type: "code", language: "javascript", content: "function makeCounter() {\n  let count = 0;\n  return function() {\n    count++;\n    return count;\n  };\n}\nconst counter = makeCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2" }
          ] },
          { id: "js-fundamentals-m6-l2", title: "Function Context & call/apply/bind", timeToComplete: 10, content: [
            { type: "text", content: "In JavaScript, the context of a function (the value of 'this') can be changed using call, apply, or bind. These methods allow you to control what 'this' refers to when a function is invoked. call and apply immediately invoke the function with a specified context, while bind returns a new function with a permanently bound context. Understanding function context is crucial for working with event handlers, callbacks, and object methods. Mastering these techniques will help you write more flexible and reusable code." },
            { type: "code", language: "javascript", content: "function show() {\n  console.log(this.value);\n}\nconst obj = { value: 42 };\nshow.call(obj); // 42" }
          ] },
          { id: "js-fundamentals-m6-l3", title: "Recursion", timeToComplete: 10, content: [
            { type: "text", content: "Recursion is a programming technique where a function calls itself to solve a problem. Each recursive call should bring the problem closer to a base case, which stops the recursion. Recursion is useful for tasks that can be broken down into similar subproblems, such as traversing trees or calculating factorials. However, improper use can lead to stack overflow errors. Understanding recursion helps you write elegant solutions for complex problems. Practice writing recursive functions to build your skills." },
            { type: "code", language: "javascript", content: "function factorial(n) {\n  if (n === 0) return 1;\n  return n * factorial(n - 1);\n}\nconsole.log(factorial(5)); // 120" }
          ] }
        ]
      },
      {
        id: "js-fundamentals-m7",
        title: "Error Handling",
        description: "How to handle errors and exceptions in JavaScript.",
        lessons: [
          { id: "js-fundamentals-m7-l1", title: "try...catch...finally", timeToComplete: 10, content: [
            { type: "text", content: "JavaScript provides try...catch...finally blocks to handle errors gracefully. The try block contains code that may throw an error. If an error occurs, control passes to the catch block, where you can handle or log the error. The finally block always runs, regardless of whether an error occurred, and is useful for cleanup tasks. Proper error handling makes your code more robust and user-friendly. Learning to use these blocks is essential for writing reliable JavaScript applications." },
            { type: "code", language: "javascript", content: "try {\n  throw new Error('Oops!');\n} catch (e) {\n  console.log(e.message);\n} finally {\n  console.log('Done');\n}" }
          ] },
          { id: "js-fundamentals-m7-l2", title: "Custom Errors", timeToComplete: 10, content: [
            { type: "text", content: "You can create custom error types in JavaScript by extending the built-in Error class. Custom errors allow you to represent specific error conditions in your application, making debugging and error handling easier. Throwing custom errors helps you communicate what went wrong more clearly. You can add custom properties or methods to your error classes. Mastering custom errors is important for building large, maintainable codebases." },
            { type: "code", language: "javascript", content: "class MyError extends Error {\n  constructor(message) {\n    super(message);\n    this.name = 'MyError';\n  }\n}\nthrow new MyError('Something went wrong');" }
          ] }
        ]
      },
      {
        id: "js-fundamentals-m8",
        title: "Prototypes and Inheritance",
        description: "Understand JavaScript's prototype-based inheritance.",
        lessons: [
          { id: "js-fundamentals-m8-l1", title: "Prototypes", timeToComplete: 10, content: [
            { type: "text", content: "Every JavaScript object has a prototype, which is another object it inherits properties and methods from. This prototype chain allows for shared behavior and efficient memory usage. You can access an object's prototype using Object.getPrototypeOf or the __proto__ property. Prototypes are the foundation of inheritance in JavaScript. Understanding how prototypes work is crucial for mastering advanced JavaScript patterns and optimizing your code." },
            { type: "code", language: "javascript", content: "const animal = { eats: true }\nconst rabbit = Object.create(animal);\nconsole.log(rabbit.eats); // true" }
          ] },
          { id: "js-fundamentals-m8-l2", title: "Constructor Functions", timeToComplete: 10, content: [
            { type: "text", content: "Constructor functions are special functions used to create and initialize objects in JavaScript. When called with the new keyword, they set up a new object and assign properties to it. Constructor functions enable you to create multiple similar objects efficiently. They are the basis for classical inheritance patterns in JavaScript. Understanding constructor functions is key to building scalable and reusable code." },
            { type: "code", language: "javascript", content: "function Person(name) {\n  this.name = name;\n}\nconst bob = new Person('Bob');\nconsole.log(bob.name); // Bob" }
          ] },
          { id: "js-fundamentals-m8-l3", title: "Class Syntax (ES6)", timeToComplete: 10, content: [
            { type: "text", content: "ES6 introduced the class syntax as a more convenient way to create constructor functions and set up inheritance. Classes provide a clear, concise syntax for defining objects and their behavior. You can use extends to create subclasses and super to call parent class methods. Classes make object-oriented programming in JavaScript more approachable and maintainable. Learning class syntax is important for working with modern JavaScript frameworks and libraries." },
            { type: "code", language: "javascript", content: "class Animal {\n  speak() {\n    return '...';\n  }\n}\nclass Dog extends Animal {\n  speak() {\n    return 'Woof!';\n  }\n}\nconst d = new Dog();\nconsole.log(d.speak()); // Woof!" }
          ] }
        ]
      },
      {
        id: "js-fundamentals-m9",
        title: "Asynchronous JavaScript",
        description: "Callbacks, promises, and async/await.",
        lessons: [
          { id: "js-fundamentals-m9-l1", title: "Callbacks", timeToComplete: 10, content: [
            { type: "text", content: "Callbacks are functions passed as arguments to other functions, to be executed later. They are a fundamental part of asynchronous programming in JavaScript, allowing you to handle events, timers, and I/O operations. Callbacks can lead to deeply nested code, known as 'callback hell,' if not managed carefully. Understanding callbacks is essential for working with APIs and event-driven code. Practice using callbacks to become comfortable with asynchronous JavaScript." },
            { type: "code", language: "javascript", content: "function fetchData(cb) {\n  setTimeout(() => cb('done'), 1000);\n}\nfetchData(result => console.log(result));" }
          ] },
          { id: "js-fundamentals-m9-l2", title: "Promises", timeToComplete: 15, content: [
            { type: "text", content: "Promises are objects that represent the eventual completion or failure of an asynchronous operation. They provide a cleaner, more manageable way to handle async code compared to callbacks. Promises have three states: pending, fulfilled, and rejected. You can chain .then and .catch methods to handle results and errors. Mastering promises is crucial for working with modern JavaScript APIs and libraries. Practice creating and using promises to improve your async code." },
            { type: "code", language: "javascript", content: "const p = new Promise(resolve => setTimeout(() => resolve(42), 500));\np.then(val => console.log(val));" }
          ] },
          { id: "js-fundamentals-m9-l3", title: "Async/Await", timeToComplete: 15, content: [
            { type: "text", content: "Async/await is a modern syntax for writing asynchronous code that looks and behaves like synchronous code. The async keyword declares a function as asynchronous, and await pauses execution until a promise resolves. This makes code easier to read and maintain, especially for complex async flows. Async/await is built on top of promises and is widely used in modern JavaScript development. Practice using async/await to write cleaner, more readable async code." },
            { type: "code", language: "javascript", content: "async function getData() {\n  return 123;\n}\n(async () => {\n  const val = await getData();\n  console.log(val);\n})();" }
          ] }
        ]
      },
      {
        id: "js-fundamentals-m10",
        title: "The Browser: DOM & Events",
        description: "Manipulate the DOM and handle browser events.",
        lessons: [
          { id: "js-fundamentals-m10-l1", title: "The DOM Tree", timeToComplete: 10, content: [
            { type: "text", content: "What is the DOM and how to traverse it." },
            { type: "code", language: "javascript", content: "// Accessing the DOM\ndocument.body.style.background = 'lightblue';" }
          ] },
          { id: "js-fundamentals-m10-l2", title: "Selecting Elements", timeToComplete: 10, content: [
            { type: "text", content: "querySelector, getElementById, etc." },
            { type: "code", language: "javascript", content: "const el = document.querySelector('#myId');\nconst byId = document.getElementById('myId');" }
          ] },
          { id: "js-fundamentals-m10-l3", title: "Modifying the DOM", timeToComplete: 15, content: [
            { type: "text", content: "Changing content, attributes, and styles." },
            { type: "code", language: "javascript", content: "const el = document.getElementById('demo');\nel.textContent = 'Updated!';\nel.setAttribute('data-test', 'value');\nel.style.color = 'red';" }
          ] },
          { id: "js-fundamentals-m10-l4", title: "Event Handling", timeToComplete: 15, content: [
            { type: "text", content: "addEventListener, event object, event delegation." },
            { type: "code", language: "javascript", content: "document.getElementById('btn').addEventListener('click', function(event) {\n  alert('Button clicked!');\n});" }
          ] }
        ]
      },
      {
        id: "js-fundamentals-m11",
        title: "Forms and User Input",
        description: "Working with forms and validating user input.",
        lessons: [
          { id: "js-fundamentals-m11-l1", title: "Form Elements & Events", timeToComplete: 10, content: [
            { type: "text", content: "Input, select, textarea, and form events." },
            { type: "code", language: "javascript", content: "document.querySelector('form').addEventListener('submit', function(e) {\n  e.preventDefault();\n  alert('Form submitted!');\n});" }
          ] },
          { id: "js-fundamentals-m11-l2", title: "Form Validation", timeToComplete: 15, content: [
            { type: "text", content: "Validating user input in JavaScript." },
            { type: "code", language: "javascript", content: "const input = document.getElementById('email');\nif (!input.value.includes('@')) {\n  alert('Invalid email!');\n}" }
          ] }
        ]
      },
      {
        id: "js-fundamentals-m12",
        title: "Modules and Tooling",
        description: "Organize code with modules and use modern JavaScript tooling.",
        lessons: [
          { id: "js-fundamentals-m12-l1", title: "ES Modules (import/export)", timeToComplete: 10, content: [
            { type: "text", content: "How to use import and export in JavaScript." },
            { type: "code", language: "javascript", content: "// module.js\nexport function greet() { return 'Hello'; }\n// main.js\nimport { greet } from './module.js';\ngreet();" }
          ] },
          { id: "js-fundamentals-m12-l2", title: "Bundlers & Transpilers", timeToComplete: 10, content: [
            { type: "text", content: "Webpack, Babel, and other tools." },
            { type: "code", language: "javascript", content: "// Example Babel config\n{\n  \"presets\": [\"@babel/preset-env\"]\n}" }
          ] }
        ]
      },
      {
        id: "js-fundamentals-m13",
        title: "Regular Expressions",
        description: "Pattern matching and text processing with RegExp.",
        lessons: [
          { id: "js-fundamentals-m13-l1", title: "RegExp Basics", timeToComplete: 10, content: [
            { type: "text", content: "Syntax and basic usage of regular expressions." },
            { type: "code", language: "javascript", content: "let re = /hello/i;\nconsole.log(re.test('Hello world')); // true" }
          ] },
          { id: "js-fundamentals-m13-l2", title: "RegExp Methods", timeToComplete: 10, content: [
            { type: "text", content: "test, exec, match, replace, etc." },
            { type: "code", language: "javascript", content: "let str = 'abc123';\nlet digits = str.match(/\\d+/); // ['123']\nlet replaced = str.replace(/\\d+/, '#'); // 'abc#'" }
          ] }
        ]
      },
      {
        id: "js-fundamentals-m14",
        title: "JSON and Data Exchange",
        description: "Working with JSON and exchanging data.",
        lessons: [
          { id: "js-fundamentals-m14-l1", title: "JSON Syntax & Methods", timeToComplete: 10, content: [
            { type: "text", content: "JSON.parse, JSON.stringify, and structure." },
            { type: "code", language: "javascript", content: "let obj = { name: 'Alice' };\nlet json = JSON.stringify(obj);\nlet parsed = JSON.parse(json);" }
          ] },
          { id: "js-fundamentals-m14-l2", title: "Data Exchange Patterns", timeToComplete: 10, content: [
            { type: "text", content: "How data is sent and received in web apps." },
            { type: "code", language: "javascript", content: "fetch('/api/data')\n  .then(res => res.json())\n  .then(data => console.log(data));" }
          ] }
        ]
      },
      {
        id: "js-fundamentals-m15",
        title: "Networking and Fetch API",
        description: "Make network requests and handle responses.",
        lessons: [
          { id: "js-fundamentals-m15-l1", title: "The Fetch API", timeToComplete: 15, content: [
            { type: "text", content: "How to use fetch to get and send data." },
            { type: "code", language: "javascript", content: "fetch('https://api.example.com/data')\n  .then(response => response.json())\n  .then(data => console.log(data));" }
          ] },
          { id: "js-fundamentals-m15-l2", title: "AJAX and XMLHttpRequest", timeToComplete: 10, content: [
            { type: "text", content: "Legacy AJAX techniques." },
            { type: "code", language: "javascript", content: "const xhr = new XMLHttpRequest();\nxhr.open('GET', '/api/data');\nxhr.onload = function() {\n  if (xhr.status === 200) {\n    console.log(xhr.responseText);\n  }\n};\nxhr.send();" }
          ] }
        ]
      },
      {
        id: "js-fundamentals-m16",
        title: "Storage: Cookies, localStorage, and More",
        description: "Persist data in the browser.",
        lessons: [
          { id: "js-fundamentals-m16-l1", title: "localStorage & sessionStorage", timeToComplete: 10, content: [
            { type: "text", content: "Storing data in the browser." },
            { type: "code", language: "javascript", content: "localStorage.setItem('key', 'value');\nlet val = localStorage.getItem('key');\nsessionStorage.setItem('foo', 'bar');" }
          ] },
          { id: "js-fundamentals-m16-l2", title: "Cookies", timeToComplete: 10, content: [
            { type: "text", content: "How cookies work and how to use them." },
            { type: "code", language: "javascript", content: "document.cookie = 'username=Alice; expires=Fri, 31 Dec 2025 23:59:59 GMT';\nconsole.log(document.cookie);" }
          ] }
        ]
      },
      {
        id: "js-fundamentals-m17",
        title: "Advanced Objects and Symbols",
        description: "Deep dive into objects, property descriptors, and symbols.",
        lessons: [
          { id: "js-fundamentals-m17-l1", title: "Property Descriptors", timeToComplete: 10, content: [
            { type: "text", content: "Configurable, enumerable, writable, and value." },
            { type: "code", language: "javascript", content: "let obj = {};\nObject.defineProperty(obj, 'x', {\n  value: 42,\n  writable: false\n});\nconsole.log(obj.x); // 42" }
          ] },
          { id: "js-fundamentals-m17-l2", title: "Symbols", timeToComplete: 10, content: [
            { type: "text", content: "Unique property keys and their use cases." },
            { type: "code", language: "javascript", content: "let sym = Symbol('id');\nlet obj = { [sym]: 123 };\nconsole.log(obj[sym]); // 123" }
          ] }
        ]
      },
      {
        id: "js-fundamentals-m18",
        title: "Iterables, Generators, and Advanced Iteration",
        description: "Work with iterables, generators, and custom iteration.",
        lessons: [
          { id: "js-fundamentals-m18-l1", title: "Iterables & for...of", timeToComplete: 10, content: [
            { type: "text", content: "How iteration protocols work." },
            { type: "code", language: "javascript", content: "let arr = [10, 20, 30];\nfor (let value of arr) {\n  console.log(value);\n}" }
          ] },
          { id: "js-fundamentals-m18-l2", title: "Generators", timeToComplete: 15, content: [
            { type: "text", content: "Generator functions and yield." },
            { type: "code", language: "javascript", content: "function* gen() {\n  yield 1;\n  yield 2;\n}\nconst g = gen();\nconsole.log(g.next().value); // 1\nconsole.log(g.next().value); // 2" }
          ] }
        ]
      },
      {
        id: "js-fundamentals-m19",
        title: "Memory Management and Performance",
        description: "How JavaScript manages memory and tips for performance.",
        lessons: [
          { id: "js-fundamentals-m19-l1", title: "Garbage Collection", timeToComplete: 10, content: [
            { type: "text", content: "How memory is managed in JS." },
            { type: "code", language: "javascript", content: "let obj = { a: 1 };\nobj = null; // Eligible for garbage collection" }
          ] },
          { id: "js-fundamentals-m19-l2", title: "Performance Tips", timeToComplete: 10, content: [
            { type: "text", content: "Best practices for writing efficient code." },
            { type: "code", language: "javascript", content: "// Use local variables inside loops\nfor (let i = 0, len = arr.length; i < len; i++) {\n  // ...\n}\n// Minimize DOM access\n// Use efficient algorithms" }
          ] }
        ]
      },
      {
        id: "js-fundamentals-m20",
        title: "Modern JavaScript Features (ES6+)",
        description: "Explore the latest features in JavaScript.",
        lessons: [
          { id: "js-fundamentals-m20-l1", title: "Destructuring & Spread", timeToComplete: 10, content: [
            { type: "text", content: "Destructuring assignment and spread/rest syntax." },
            { type: "code", language: "javascript", content: "const [a, b] = [1, 2];\nconst { x, y } = { x: 10, y: 20 };\nconst arr = [1, 2, 3];\nconst arr2 = [...arr, 4];" }
          ] },
          { id: "js-fundamentals-m20-l2", title: "Template Literals", timeToComplete: 5, content: [
            { type: "text", content: "String interpolation with backticks." },
            { type: "code", language: "javascript", content: "let name = 'Alice';\nconsole.log(`Hello, ${name}!`);" }
          ] },
          { id: "js-fundamentals-m20-l3", title: "Optional Chaining & Nullish Coalescing", timeToComplete: 10, content: [
            { type: "text", content: "?. and ?? operators." },
            { type: "code", language: "javascript", content: "let user = {};\nconsole.log(user?.address?.city); // undefined\nlet val = null;\nconsole.log(val ?? 'default'); // 'default'" }
          ] }
        ]
      },
      {
        id: "js-fundamentals-m21",
        title: "Coding Style and Best Practices",
        description: "Write clean, maintainable, and modern JavaScript.",
        lessons: [
          { id: "js-fundamentals-m21-l1", title: "Code Style", timeToComplete: 10, content: [
            { type: "text", content: "Indentation, naming, and formatting conventions." },
            { type: "code", language: "javascript", content: "// Good style\nfunction add(a, b) {\n  return a + b;\n}\n// Use camelCase for variables\nlet userName = 'Alice';" }
          ] },
          { id: "js-fundamentals-m21-l2", title: "Linting & Formatting Tools", timeToComplete: 10, content: [
            { type: "text", content: "ESLint, Prettier, and automated code style." },
            { type: "code", language: "javascript", content: "// .eslintrc.json\n{\n  \"extends\": [\"eslint:recommended\"]\n}\n// .prettierrc\n{\n  \"singleQuote\": true\n}" }
          ] }
        ]
      }
    ]
  },
  {
    id: "mern-stack",
    title: "MERN Stack Development",
    description: "Learn to build full-stack web applications using MongoDB, Express.js, React, and Node.js.",
    category: "mern",
    image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
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
    image: "https://images.unsplash.com/photo-1648483893285-4bf2462e93fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    difficulty: "beginner",
    creator: "PubHub Team",
    createdAt: "2025-04-05T00:00:00Z",
    updatedAt: "2025-05-30T00:00:00Z",
    isAvailable: false, // Manually set to unavailable
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

// Add isAvailable property to the courses
const processedBaseCourses = baseCourses.map(course => ({
  ...course,
  isAvailable: ["dsa", "javascript", "typescript", "python", "frontend"].includes(course.category)
}));

const processedAdvancedCourses = advancedCourses.map(course => ({
  ...course,
  isAvailable: ["dsa", "javascript", "typescript", "python", "frontend"].includes(course.category)
}));

// Process all courses to ensure isAvailable is set based on the allowed categories
function ensureAvailabilityFlag(course: Course): Course {
  // Set isAvailable based on the category
  course.isAvailable = allowedCategories.includes(course.category);
  return course;
}

// Create the final courses array by combining all course sources and removing duplicates by ID
export const courses: Course[] = Array.from(
  new Map(
    [
      ...processedBaseCourses,
      ...processedAdvancedCourses,
      ...courseTemplates.map(template => createCourseFromTemplate(template as Partial<Course>))
    ].map(course => [course.id, ensureAvailabilityFlag(course)])
  ).values()
);

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

// Helper function to get all available courses
export function getAvailableCourses(): Course[] {
  return courses.filter(course => course.isAvailable);
}

// Helper function to get coming soon courses
export function getComingSoonCourses(): Course[] {
  return courses.filter(course => !course.isAvailable);
}
