import { Course } from "../types/course";

// Create a TypeScript-specific course
export const typescriptCourse: Course = {
  id: "typescript-mastery",
  title: "TypeScript Complete Masterclass",
  description: "Master TypeScript development from basic to advanced concepts, with real-world projects and best practices.",
  category: "typescript",
  image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
  isAvailable: true,
  difficulty: "intermediate",
  creator: "PubHub Team",
  createdAt: "2025-05-01T00:00:00Z",
  updatedAt: "2025-06-15T00:00:00Z",
  modules: [
    {
      id: "typescript-mastery-m1",
      title: "TypeScript Fundamentals",
      description: "Learn the core concepts of TypeScript that set it apart from JavaScript.",
      lessons: [
        {
          id: "typescript-mastery-m1-l1",
          title: "Introduction to TypeScript",
          timeToComplete: 15,
          content: [
            { 
              type: "text", 
              content: "TypeScript is a strongly typed programming language that builds on JavaScript. It adds static type definitions to JavaScript, which helps detect errors early in the development process."
            },
            { 
              type: "text", 
              content: "Key benefits of TypeScript include:\n- Static typing\n- Better IDE support with intelligent code completion\n- Safer refactoring\n- Clearer interfaces between components"
            },
            {
              type: "code",
              language: "typescript",
              content: "// JavaScript\nfunction add(a, b) {\n  return a + b;\n}\n\n// TypeScript\nfunction add(a: number, b: number): number {\n  return a + b;\n}\n\n// TypeScript will catch this error at compile time\n// add('5', 10); // Error: Argument of type 'string' is not assignable to parameter of type 'number'"
            }
          ]
        },
        {
          id: "typescript-mastery-m1-l2",
          title: "Basic Types in TypeScript",
          timeToComplete: 20,
          content: [
            { 
              type: "text", 
              content: "TypeScript includes several basic types that you'll use frequently in your code."
            },
            { 
              type: "text", 
              content: "**Primitive Types**:\n- `boolean`: true or false values\n- `number`: floating point values\n- `string`: text values\n- `null` and `undefined`: represent absence of value\n- `symbol`: unique identifiers\n- `bigint`: whole numbers larger than 2^53"
            },
            {
              type: "code",
              language: "typescript",
              content: "// Basic type annotations\nlet isDone: boolean = false;\nlet decimal: number = 6;\nlet color: string = \"blue\";\n\n// Arrays\nlet list: number[] = [1, 2, 3];\nlet names: Array<string> = [\"John\", \"Jane\"];\n\n// Tuple - fixed length array with specific types\nlet tuple: [string, number] = [\"hello\", 10];\n\n// Enum - a set of named constants\nenum Color { Red, Green, Blue }\nlet c: Color = Color.Green;\n\n// Any - disable type checking\nlet notSure: any = 4;\nnotSure = \"maybe a string\";\n\n// Void - absence of any type\nfunction logMessage(message: string): void {\n  console.log(message);\n}\n\n// Never - values that never occur\nfunction throwError(message: string): never {\n  throw new Error(message);\n}"
            }
          ]
        }
      ]
    },
    {
      id: "typescript-mastery-m2",
      title: "Advanced Types",
      description: "Explore TypeScript's advanced typing system.",
      lessons: [
        {
          id: "typescript-mastery-m2-l1",
          title: "Interfaces and Type Aliases",
          timeToComplete: 25,
          content: [
            { 
              type: "text", 
              content: "Interfaces are one of TypeScript's most powerful features, allowing you to define contracts for your objects."
            },
            { 
              type: "text", 
              content: "**Interfaces** are a way to define the shape of an object. They can include properties, methods, and index signatures.\n\n**Type Aliases** are similar to interfaces but can also be used to create names for union types, tuple types, and other complex types."
            },
            {
              type: "code",
              language: "typescript",
              content: "// Interface Example\ninterface Person {\n  firstName: string;\n  lastName: string;\n  age?: number; // Optional property\n  readonly id: number; // Read-only property\n  greet(): string; // Method signature\n}\n\nconst john: Person = {\n  firstName: \"John\",\n  lastName: \"Doe\",\n  id: 123,\n  greet() {\n    return `Hello, my name is ${this.firstName} ${this.lastName}`;\n  }\n};\n\n// Type Alias Example\ntype Point = {\n  x: number;\n  y: number;\n};\n\n// Union Type\ntype Result = Success | Error;\ntype Success = { ok: true; value: string };\ntype Error = { ok: false; error: string };\n\n// Extending interfaces\ninterface Employee extends Person {\n  department: string;\n  salary: number;\n}"
            }
          ]
        }
      ]
    }
  ]
};

// Create a Python-specific course
export const pythonCourse: Course = {
  id: "python-data-science",
  title: "Python for Data Science",
  description: "Learn Python programming for data analysis, visualization, and machine learning applications.",
  category: "python",
  image: "https://images.unsplash.com/photo-1526379879527-8559ecfd8bf7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
  isAvailable: true,
  difficulty: "beginner",
  creator: "PubHub Team",
  createdAt: "2025-04-15T00:00:00Z",
  updatedAt: "2025-06-10T00:00:00Z",
  modules: [
    {
      id: "python-data-science-m1",
      title: "Python Basics for Data Science",
      description: "Get started with Python programming fundamentals for data analysis.",
      lessons: [
        {
          id: "python-data-science-m1-l1",
          title: "Introduction to Python and Data Science",
          timeToComplete: 15,
          content: [
            { 
              type: "text", 
              content: "Python has become the most popular programming language for data science due to its simplicity, readability, and powerful libraries."
            },
            { 
              type: "text", 
              content: "In this course, you'll learn Python specifically in the context of data analysis and visualization. We'll cover the core libraries that make Python great for working with data, including:\n\n- NumPy for numerical computing\n- Pandas for data manipulation and analysis\n- Matplotlib and Seaborn for data visualization\n- Scikit-learn for machine learning"
            },
            {
              type: "code",
              language: "python",
              content: "# A simple Python data analysis example\nimport numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\n# Create some sample data\ndata = {\n    'name': ['Alice', 'Bob', 'Charlie', 'David', 'Eva'],\n    'age': [25, 30, 35, 40, 45],\n    'salary': [50000, 60000, 70000, 80000, 90000]\n}\n\n# Create a DataFrame\ndf = pd.DataFrame(data)\n\n# Display the data\nprint(df)\n\n# Basic statistics\nprint(\"\\nAverage age:\", df['age'].mean())\nprint(\"Average salary:\", df['salary'].mean())\n\n# Simple visualization\nplt.figure(figsize=(10, 6))\nplt.scatter(df['age'], df['salary'])\nplt.title('Age vs. Salary')\nplt.xlabel('Age')\nplt.ylabel('Salary')\nplt.grid(True)\nplt.show()"
            }
          ]
        },
        {
          id: "python-data-science-m1-l2",
          title: "Working with NumPy Arrays",
          timeToComplete: 25,
          content: [
            { 
              type: "text", 
              content: "NumPy (Numerical Python) is the fundamental library for scientific computing in Python. It provides support for large, multi-dimensional arrays and matrices, along with a large collection of high-level mathematical functions to operate on these arrays."
            },
            { 
              type: "text", 
              content: "Key features of NumPy include:\n\n- Fast array operations\n- Broadcasting functionality\n- Linear algebra operations\n- Random number generation\n- Support for integration with C/C++ and Fortran code"
            },
            {
              type: "code",
              language: "python",
              content: "import numpy as np\n\n# Creating arrays\na = np.array([1, 2, 3, 4, 5])\nb = np.array([6, 7, 8, 9, 10])\n\nprint(\"Array a:\", a)\nprint(\"Array b:\", b)\n\n# Basic operations\nprint(\"\\nAddition:\", a + b)  # Element-wise addition\nprint(\"Multiplication:\", a * b)  # Element-wise multiplication\n\n# Creating a matrix (2D array)\nmatrix = np.array([\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n])\n\nprint(\"\\nMatrix:\\n\", matrix)\n\n# Matrix operations\nprint(\"\\nTranspose:\\n\", matrix.T)\nprint(\"Matrix sum:\", matrix.sum())\nprint(\"Column sums:\", matrix.sum(axis=0))\nprint(\"Row sums:\", matrix.sum(axis=1))\n\n# Creating special arrays\nzeros = np.zeros((3, 3))  # 3x3 matrix of zeros\nones = np.ones((2, 4))    # 2x4 matrix of ones\neye = np.eye(3)          # 3x3 identity matrix\n\nprint(\"\\nZeros:\\n\", zeros)\nprint(\"Ones:\\n\", ones)\nprint(\"Identity:\\n\", eye)\n\n# Array slicing\nprint(\"\\nFirst row of matrix:\", matrix[0])\nprint(\"Element at (1,2):\", matrix[1, 2])\nprint(\"Submatrix:\\n\", matrix[0:2, 1:3])"
            }
          ]
        }
      ]
    }
  ]
};

// Create a Go-specific course
export const goCourse: Course = {
  id: "go-programming",
  title: "Go Programming from Zero to Hero",
  description: "Learn the Go programming language (Golang) from basics to advanced concepts, with a focus on concurrency and systems programming.",
  category: "go",
  image: "https://images.unsplash.com/photo-1600267204091-5c1ab8b10c02?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  isAvailable: false, // Go is marked as coming soon
  difficulty: "intermediate",
  creator: "PubHub Team",
  createdAt: "2025-05-10T00:00:00Z",
  updatedAt: "2025-06-12T00:00:00Z",
  modules: [
    {
      id: "go-programming-m1",
      title: "Introduction to Go",
      description: "Get started with the Go programming language and its core concepts.",
      lessons: [
        {
          id: "go-programming-m1-l1",
          title: "Why Go?",
          timeToComplete: 15,
          content: [
            { 
              type: "text", 
              content: "Go (often called Golang) is an open-source programming language created at Google in 2009 by Robert Griesemer, Rob Pike, and Ken Thompson. It's designed to be simple, efficient, and excellent for building scalable server-side applications."
            },
            { 
              type: "text", 
              content: "**Key advantages of Go:**\n\n- **Simplicity**: Go has a clean syntax that's easy to learn and read.\n- **Fast compilation**: Go compiles directly to machine code very quickly.\n- **Garbage collection**: Automatic memory management.\n- **Built-in concurrency**: Goroutines and channels make concurrent programming easier.\n- **Standard library**: Rich standard library for common tasks.\n- **Static typing**: Catch errors at compile time.\n- **Cross-platform**: Compiles to native binaries for different operating systems."
            },
            {
              type: "code",
              language: "go",
              content: "// Hello World in Go\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, World!\")\n}"
            }
          ]
        },
        {
          id: "go-programming-m1-l2",
          title: "Go Fundamentals: Variables and Types",
          timeToComplete: 20,
          content: [
            { 
              type: "text", 
              content: "Go is a statically typed language, which means variable types are explicitly declared and determined at compile time."
            },
            { 
              type: "text", 
              content: "**Basic Types in Go:**\n\n- **Numeric types**: `int`, `int8`, `int16`, `int32`, `int64`, `uint`, `uint8`, `uint16`, `uint32`, `uint64`, `float32`, `float64`, `complex64`, `complex128`\n- **Boolean type**: `bool`\n- **String type**: `string`\n- **Derived types**: Arrays, Slices, Maps, Structs, Pointers, Functions, Interfaces, Channels"
            },
            {
              type: "code",
              language: "go",
              content: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    // Variable declaration\n    var name string = \"John\"\n    var age int = 30\n    \n    // Short declaration syntax\n    city := \"New York\" // Type is inferred\n    \n    // Multiple variable declaration\n    var (\n        isEmployed bool = true\n        salary float64 = 50000.0\n    )\n    \n    // Constants\n    const Pi = 3.14159\n    \n    fmt.Println(\"Name:\", name)\n    fmt.Println(\"Age:\", age)\n    fmt.Println(\"City:\", city)\n    fmt.Println(\"Employed:\", isEmployed)\n    fmt.Println(\"Salary:\", salary)\n    fmt.Println(\"Pi:\", Pi)\n    \n    // Type conversions are explicit in Go\n    var i int = 42\n    var f float64 = float64(i)\n    fmt.Println(\"float64 value:\", f)\n}"
            }
          ]
        }
      ]
    }
  ]
};

// Export all advanced courses
export const advancedCourses = [
  typescriptCourse,
  pythonCourse,
  goCourse,
];
