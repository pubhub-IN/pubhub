export interface YouTuber {
  name: string;
  channelUrl: string;
  avatarUrl: string;
  description: string;
  playlists: string[];
  category: string;
}

export const categories = [
  "Programming in general",
  "Web Development",
  "Computer Science", 
  "Machine Learning",
  "Game Development",
  "Mobile Development",
  "Cybersecurity",
  "DevOps",
  "Hardware",
  "Digital Design",
  "Audio and Video",
  "Life Skills",
  "Operating Systems",
  "Software in general",
  "Internet/networking",
  "Competitive Programming"
] as const;

export const youtubers: YouTuber[] = [
  // Programming in general
  {
    name: "techsith",
    channelUrl: "https://www.youtube.com/c/Techsithtube",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJwEFEH0os2PjNYXfjC2tlO-VU5sSsB3rX6DOeFh=s100-c-k-c0xffffffff-no-rj-mo",
    description: "React.js, JavaScript",
    playlists: ["react js from scratch", "Node.js Tutorials For Beginners", "Data Structures in JavaScript", "Interview Preparation"],
    category: "Programming in general"
  },
  {
    name: "Derek Banas",
    channelUrl: "https://www.youtube.com/c/derekbanas",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJwVjl968ProbjWSmYNghqYxAG_EI0-3ZK6QNIHM=s88-c-k-c0x00ffffff-no-rj",
    description: "Mathematics, Programming languages",
    playlists: ["Learn Algebra", "C++ Tutorial", "C# Tutorial", "Java Video Tutorial"],
    category: "Programming in general"
  },
  {
    name: "Don Jones",
    channelUrl: "https://www.youtube.com/@DonJones",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJXsT8qW7rM9oH6pL3jG9kN5hF2sX_Q8vN=s176-c-k-c0x00ffffff-no-rj",
    description: "PowerShell and Windows administration tutorials",
    playlists: ["Learn Windows PowerShell in a Month of Lunches", "SAPIEN PowerShell Training", "PowerShell Tips, Tricks, and Snippets"],
    category: "Programming in general"
  },
  {
    name: "Corey Schafer",
    channelUrl: "https://www.youtube.com/c/Coreyms",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJxNLWZNUXOTpXHY9j8PvBdyZbGTkwbUznRvHtmH=s100-c-k-c0xffffffff-no-rj-mo",
    description: "Python, Backend",
    playlists: ["Python Tutorials", "Django Tutorials", "Flask Tutorials", "Matplotlib Tutorials", "SQL Tutorials"],
    category: "Programming in general"
  },
  {
    name: "ProgrammingKnowledge",
    channelUrl: "https://www.youtube.com/c/ProgrammingKnowledge",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJxg7ZDO-AqFL4bQWz38_7RZKYydoUQTpVuPAPzo=s100-c-k-c0xffffffff-no-rj-mo",
    description: "Backend, APIs",
    playlists: ["Node.js Tutorial for Beginners", "Python 3 Tutorial for Beginners", "C++ Programming Tutorial for Beginners"],
    category: "Programming in general"
  },
  {
    name: "freeCodeCamp.org",
    channelUrl: "https://www.youtube.com/channel/UC8butISFwT-Wl7EV0hUK0BQ",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJwFt03RAznOsPwlfo5c1kW1rp-1o3Xgpw9MNreQMQ=s288-c-k-c0xffffffff-no-rj-mo",
    description: "General programming, Computer science, Web Dev, DevOps",
    playlists: ["Python Tutorials", "Machine Learning", "Java Tutorials"],
    category: "Programming in general"
  },
  {
    name: "IAmTimCorey",
    channelUrl: "https://www.youtube.com/user/IAmTimCorey",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJxRGfv1YCCh9tamNue4H4J1Ih_5i9hlr5cVtrGd=s100-c-k-c0xffffffff-no-rj-mo",
    description: "C#, .NET",
    playlists: ["Advanced Topics in C#", "Getting Started with C#", "C# User Interfaces", ".NET video tutorials"],
    category: "Programming in general"
  },
  {
    name: "Caleb Curry",
    channelUrl: "https://www.youtube.com/c/CalebTheVideoMaker2",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJzFJLYJgEVYb9xBZrjEkikp4J1XCMJKGZLjMeBrcA=s100-c-k-c0xffffffff-no-rj-mo",
    description: "Python, JavaScript, C, C#, C++",
    playlists: ["Python Programming", "JavaScript playlist", "C# Tutorials", "C Programming Tutorials", "C++ Tutorials", "Java Tutorials"],
    category: "Programming in general"
  },
  {
    name: "Alex Lee",
    channelUrl: "https://www.youtube.com/channel/UC_fFL5jgoCOrwAVoM_fBYwA",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJznc40hgjUtfJdS_KNadxC_6isyQON0Hw54tGJ92w=s100-c-k-c0xffffffff-no-rj-mo",
    description: "Java",
    playlists: ["Java Basics 1", "Java Basics 2", "Java Intermediate 1"],
    category: "Programming in general"
  },
  {
    name: "Bro Code",
    channelUrl: "https://www.youtube.com/channel/UC4SVo0Ue36XCfOyb5Lh1viQ",
    avatarUrl: "https://yt3.ggpht.com/ytc/AAUvwngkLa2K2hztBjibf2pUaX9jdT9ytpNdPJqvRUUniw=s88-c-k-c0x00ffffff-no-rj",
    description: "Java, Python, C#/C++",
    playlists: ["Java Tutorial", "Python Tutorial", "C# Tutorial", "C++ Tutorial"],
    category: "Programming in general"
  },
  {
    name: "Ian Schoenrock",
    channelUrl: "https://www.youtube.com/channel/UCg1SjE1gwO8A0xqoFtfLEAA",
    avatarUrl: "https://yt3.ggpht.com/ytc/AAUvwnj-Xt8eCdr2yPU93-3iYiTn3mwZE4J5rhASgTd06Q=s88-c-k-c0x00ffffff-no-rj",
    description: "C#, Swift, Kotlin",
    playlists: ["C# Full Course Beginner to Advanced", "Swift Course", "Kotlin Course", "Xamarin Forms Lists Course"],
    category: "Programming in general"
  },
  {
    name: "javidx9",
    channelUrl: "https://www.youtube.com/channel/UC-yuWVUplUJZvieEligKBkA",
    avatarUrl: "https://yt3.ggpht.com/ytc/AAUvwnh02l6XSxqL7YSJYxbio_WW9Nk9ujDzG0BHY21m=s176-c-k-c0x00ffffff-no-rj",
    description: "C++, Theoretical, Game development",
    playlists: ["NES Emulator From Scratch", "Interesting Programming", "Code-It-Yourself!"],
    category: "Programming in general"
  },
  {
    name: "The Curious Guy",
    channelUrl: "https://www.youtube.com/@dhanushnehru",
    avatarUrl: "https://yt3.googleusercontent.com/1YPGrioQ5WToSYFRq47XhqxEjJ8bJqXcczqiDuJ9J_RyPLG0zZHOxcfebT7Np9Zw29W0_2FP=s160-c-k-c0x00ffffff-no-rj",
    description: "Programming, Hacking, Linux",
    playlists: ["Tech & Coding"],
    category: "Programming in general"
  },

  // Web Development
  {
    name: "The Net Ninja",
    channelUrl: "https://www.youtube.com/@NetNinja",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJWzJ5Q8rG2kT7oV3pM9sL6hF4jX_Q8sN=s176-c-k-c0x00ffffff-no-rj",
    description: "Frontend web development tutorials by Shaun Pelling. React, Vue, JavaScript, CSS, and more.",
    playlists: ["Flutter Tutorial for Beginners", "React.js and React Native playlists", "JavaScript playlists", "GraphQL Tutorial"],
    category: "Web Development"
  },
  {
    name: "Kevin Powell",
    channelUrl: "https://www.youtube.com/@KevinPowell",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJXjJV7PfDLiGM1R2rK2cGV3zHX9sGqKBnxQSzJGFw=s176-c-k-c0x00ffffff-no-rj",
    description: "CSS evangelist helping people fall in love with CSS",
    playlists: ["CSS Grid videos", "Flexbox basics", "Responsive CSS tutorials", "CSS animation"],
    category: "Web Development"
  },
  {
    name: "Hussein Nasser",
    channelUrl: "https://www.youtube.com/@hnasr",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJXHaFr8dVqm3uHgwjdwGzH3zOTcKq3v4SkgJh8=s176-c-k-c0x00ffffff-no-rj",
    description: "Software engineer specializing in backend engineering. Databases, Networking, Backend Development, Security, Protocols",
    playlists: ["High Availability", "Python by Example", "HTTP/2", "Message Queues & PubSub Systems", "Proxies"],
    category: "Web Development"
  },
  {
    name: "ThePrimeagen",
    channelUrl: "https://www.youtube.com/@ThePrimeagen",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJXxcJ-9_VrFhJw_qGOtN8q1R6ZRJnZ-VlGpQH6VKg=s176-c-k-c0x00ffffff-no-rj",
    description: "Software engineer, Vim enthusiast, former Netflix engineer. Backend Development, Concepts, Optimization techniques, Tools, Languages",
    playlists: ["Backend Development", "Programming Concepts", "Tech Reviews"],
    category: "Web Development"
  },
  {
    name: "Fireship",
    channelUrl: "https://www.youtube.com/@Fireship",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJVJSWtMGjb7_8Jq7qWOGdx1qgT8l6Y-VGjQsJ4=s176-c-k-c0x00ffffff-no-rj",
    description: "High-intensity ⚡ code tutorials and tech news by Jeff Delaney. Short, fast-paced coding tutorials on modern tech.",
    playlists: ["100 Seconds of Code", "Angular Basics", "Firebase", "Flutter"],
    category: "Web Development"
  },
  {
    name: "Traversy Media",
    channelUrl: "https://www.youtube.com/@TraversyMedia",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJWVjl968ProbjWSmYNghqYxAG_EI0-3ZK6QNIHM=s176-c-k-c0x00ffffff-no-rj",
    description: "Web development and programming tutorials by Brad Traversy.",
    playlists: ["HTML/CSS", "JavaScript", "React", "Node.js/Express"],
    category: "Web Development"
  },
  {
    name: "Coding Tech",
    channelUrl: "https://www.youtube.com/@CodingTech",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJUqT8rW7mM9oH6pL3jG9kN5hF2sX_Q8vN=s176-c-k-c0x00ffffff-no-rj",
    description: "Programming conference talks and tech presentations. IT technologies, CSS, JS, Python, Django, blockchain, microservices.",
    playlists: ["CSS", "JavaScript", "Python", "Django"],
    category: "Web Development"
  },
  {
    name: "Harkirat Singh",
    channelUrl: "https://www.youtube.com/@harkirat1",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJWsT8qW7rM9oH6pL3jG9kN5hF2sX_Q8vN=s176-c-k-c0x00ffffff-no-rj",
    description: "Full-stack development, system design, and hands-on coding tutorials",
    playlists: ["System Design", "Live-Coding", "Career Guidance"],
    category: "Web Development"
  },

  // Computer Science
  {
    name: "Arabsera (FCIHOCW formerly)",
    channelUrl: "https://www.youtube.com/user/FCIHOCW",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJwKt_euPqSdYAa1aMzL7fhO-JibtfEaEXX8OuPt=s100-c-k-c0xffffffff-no-rj-mo",
    description: "Math, Data science",
    playlists: ["Data Science, Data Visualization playlists", "Mathematics and Statistics playlists"],
    category: "Computer Science"
  },
  {
    name: "Harvard's CS50",
    channelUrl: "https://www.youtube.com/c/cs50",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJzF-K41Fq96yE6jxs_fE6Hr7zvMXsQbqz1QNxGpjg=s100-c-k-c0xffffffff-no-rj-mo",
    description: "Computer science and General Programming",
    playlists: ["CS50's Introduction to Artificial Intelligence with Python 2020", "CS50's Web Programming with Python and JavaScript 2020", "CS50's Introduction to Game Development 2018"],
    category: "Computer Science"
  },
  {
    name: "3Blue1Brown",
    channelUrl: "https://www.youtube.com/c/3blue1brown",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJzF-K41Fq96yE6jxs_fE6Hr7zvMXsQbqz1QNxGpjg=s100-c-k-c0xffffffff-no-rj-mo",
    description: "Maths and visualization of various mathematical concepts",
    playlists: ["Essence Of Calculus", "Essence Of linear Algebra", "Neural Networks"],
    category: "Computer Science"
  },
  {
    name: "Abdul Bari",
    channelUrl: "https://www.youtube.com/channel/UCZCFT11CWBi3MHNlGf019nw",
    avatarUrl: "https://yt3.ggpht.com/ytc/AAUvwngK_x_ibq6xRq-NExEjxP7EnPSYDhUbDHoacpgF=s88-c-k-c0x00ffffff-no-rj",
    description: "Algorithms",
    playlists: ["Algorithms"],
    category: "Computer Science"
  },
  {
    name: "mycodeschool",
    channelUrl: "https://www.youtube.com/channel/UClEEsT7DkdVO_fkrBw0OTrA",
    avatarUrl: "https://yt3.ggpht.com/ytc/AAUvwnjxmp9I5SL4FJUX1HWlg0k3jZVimZ6aNmuhPDJL=s88-c-k-c0x00ffffff-no-rj",
    description: "C/C++ language, Data structures, Algorithm",
    playlists: ["Sorting Algorithms", "Data structures", "Pointers in C/C++", "Introduction to Programming through 'C'"],
    category: "Computer Science"
  },
  {
    name: "StatQuest with Josh Starmer",
    channelUrl: "https://www.youtube.com/c/joshstarmer",
    avatarUrl: "https://yt3.ggpht.com/ytc/AKedOLQ4zr8L-6qw4muU5wvjEgGilOIGiHHigQrScWtz=s176-c-k-c0x00ffffff-no-rj",
    description: "Data visualization, Machine learning, Data manipulation, Neural networks",
    playlists: ["Linear Regression and Linear Models", "Machine Learning", "High Throughput Sequencing", "Statistics Fundamentals"],
    category: "Computer Science"
  },
  {
    name: "Eddie Woo",
    channelUrl: "https://www.youtube.com/channel/UCq0EGvLTyy-LLT1oUSO_0FQ",
    avatarUrl: "https://yt3.ggpht.com/ytc/AKedOLQ4zr8L-6qw4muU5wvjEgGilOIGiHHigQrScWtz=s176-c-k-c0x00ffffff-no-rj",
    description: "Mathematics",
    playlists: ["Binomial theory", "Calculus", "Algebra", "Complex numbers"],
    category: "Computer Science"
  },
  {
    name: "Professor Leonard",
    channelUrl: "https://www.youtube.com/channel/UCoHhuummRZaIVX7bD4t2czg",
    avatarUrl: "https://yt3.ggpht.com/ytc/AKedOLRab_Xl9yKoeSsWCGbwBAql4IRHyTWKar9DS9CT=s176-c-k-c0x00ffffff-no-rj",
    description: "Mathematics",
    playlists: ["Algebra", "Statistics", "Calculus"],
    category: "Computer Science"
  },
  {
    name: "Ben Eater",
    channelUrl: "https://www.youtube.com/c/BenEater",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJz2eRlqEOHdjeRc_S7emHmcEztpnY_R4JoKMLEZ=s88-c-k-c0x00ffffff-no-rj",
    description: "Assembly language, Hardware, Computer sciences",
    playlists: ["Building an 8-bit breadboard computer!", "Network tutorial", "Digital electronics tutorials"],
    category: "Computer Science"
  },

  // Machine Learning
  {
    name: "Abhishek Thakur",
    channelUrl: "https://www.youtube.com/c/AbhishekThakurAbhi",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJxzAin1zCLuS2UINl_fDJrzu_VsTVkEPgTv6MyRog=s100-c-k-c0xffffffff-no-rj-mo",
    description: "Practical videos, Talks",
    playlists: ["Applied Machine Learning Framework", "Tips & Tricks of machine learning"],
    category: "Machine Learning"
  },
  {
    name: "Ahlad Kumar",
    channelUrl: "https://www.youtube.com/c/AhladKumar",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJzcgfOw6DSoVxxHTvIKlZFG4MjZI9TbJGzAUNQC=s100-c-k-c0xffffffff-no-rj-mo",
    description: "Deep learning, Theoretical",
    playlists: ["Deep Learning", "Convolutional Neural Network", "Neural Networks playlists"],
    category: "Machine Learning"
  },
  {
    name: "Data School",
    channelUrl: "https://www.youtube.com/c/dataschool",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJzo7KJSSToapwqWLIadmUoLOFVBWTeYtOn3GeIv=s100-c-k-c0xffffffff-no-rj-mo",
    description: "Python, Machine learning, Theoretical",
    playlists: ["Introduction to Machine Learning playlists", "Data analysis in Python with Pandas"],
    category: "Machine Learning"
  },
  {
    name: "Henry AI Labs",
    channelUrl: "https://www.youtube.com/channel/UCHB9VepY6kYvZjj0Bgxnpbw",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJzo7KJSSToapwqWLIadmUoLOFVBWTeYtOn3GeIv=s100-c-k-c0xffffffff-no-rj-mo",
    description: "Theoretical",
    playlists: ["Deep Learning Paper Summaries", "Reinforcement Learning", "Generative Adversarial Networks", "Neural Network Design"],
    category: "Machine Learning"
  },
  {
    name: "Yannic Kilcher",
    channelUrl: "https://www.youtube.com/c/YannicKilcher",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJz3i_QqeXKrRmT018ffmOrWmkWxb2MEpHEtiR28BVc=s100-c-k-c0xffffffff-no-rj-mo",
    description: "NLP, Machine learning, Deep learning, Theoretical",
    playlists: ["Natural Language Processing", "General Machine Learning", "Deep Learning Architectures", "Computer Vision", "Applications of Machine Learning"],
    category: "Machine Learning"
  },
  {
    name: "OpenAI",
    channelUrl: "https://www.youtube.com/channel/UCXZCJLdBC09xxGZ6gcdrc6A",
    avatarUrl: "https://yt3.googleusercontent.com/MopgmVAFV9BqlzOJ-UINtmutvEPcNe5IbKMmP_4vZZo3vnJXcZGtybUBsXaEVxkmxKyGqX9R=s160-c-k-c0x00ffffff-no-rj",
    description: "NLP, Machine learning, AI",
    playlists: ["Events and Talks", "Research Releases", "Robotics"],
    category: "Machine Learning"
  },
  {
    name: "Mark Saroufim",
    channelUrl: "https://www.youtube.com/user/marksaroufim",
    avatarUrl: "https://yt3.ggpht.com/ytc/AKedOLQl78_pFQwA4Q145UKMQg4SOrKv0F46Gh9zq4mXng=s88-c-k-c0x00ffffff-no-rj",
    description: "Machine Learning Engineering, Practical videos, Books review",
    playlists: ["Machine Learning Systems", "Graph Neural Networks"],
    category: "Machine Learning"
  },

  // Game Development
  {
    name: "Dani Krossing",
    channelUrl: "https://www.youtube.com/c/TheCharmefis",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJx6TRb2UtlFRUrc1y8izsVdh5KgI1kYYBdZTwigIQ=s100-c-k-c0xffffffff-no-rj-mo",
    description: "Unity, C#",
    playlists: ["Create a 2D Game In Unity", "Unity for Beginners!", "Learn Unity Basics!", "C# Tutorials"],
    category: "Game Development"
  },
  {
    name: "ScriptersWar",
    channelUrl: "https://www.youtube.com/c/ScriptersWar",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJxHXU1KlWM0ZLoRVEhO0OkVoj7YGndylnAZYkTxdg=s100-c-k-c0xffffffff-no-rj-mo",
    description: "JavaScript, HTML5",
    playlists: ["How to Make HTML5 Games: JavaScript Tutorial for Beginners JS Guide"],
    category: "Game Development"
  },
  {
    name: "Mark Rise",
    channelUrl: "https://www.youtube.com/channel/UCX4mqbvv5lGqLpI4FYlJt4w",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJzLVHrXv3qfNCv7Qu9LX7x92XuCnNu8p4pQMd2YXA=s100-c-k-c0xffffffff-no-rj-mo",
    description: "Game design, Animation",
    playlists: ["Geometric design playlists", "Video Game Character Animation Course", "After Effects Animation Tutorials"],
    category: "Game Development"
  },
  {
    name: "Zenva",
    channelUrl: "https://www.youtube.com/c/Zenva",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJx1f7O5nvI5mIBDN5I3siO-x_3nXdmNb-ncK4Uz=s288-c-k-c0xffffffff-no-rj-mo",
    description: "Unity, Unreal Engine, Godot",
    playlists: ["Master Unity Game Development", "Unreal Game Development Mini-Degree", "Godot Game Development Mini-Degree"],
    category: "Game Development"
  },
  {
    name: "Mix and Jam",
    channelUrl: "https://www.youtube.com/c/MixandJam",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJx1f7O5nvI5mIBDN5I3siO-x_3nXdmNb-ncK4Uz=s288-c-k-c0xffffffff-no-rj-mo",
    description: "Unity",
    playlists: ["Mix and Jam Recreations", "Game Jams", "RE Mix and Jam"],
    category: "Game Development"
  },

  // Mobile Development
  {
    name: "Simplified Coding",
    channelUrl: "https://www.youtube.com/c/SimplifiedcodingNetOfficial",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJx_F6rE_flskMStro3T2TQ_s-NAl9j2k6nIahoP=s100-c-k-c0xffffffff-no-rj-mo",
    description: "Android, Backend",
    playlists: ["PHP, MySQL and Firebase videos", "Kotlin Programming Tutorial"],
    category: "Mobile Development"
  },
  {
    name: "Devslopes",
    channelUrl: "https://www.youtube.com/c/Devslopes",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJUE_t_F-A_B_A_A_A_A_A_A_A_A_A_A_A=s176-c-k-c0x00ffffff-no-rj",
    description: "Mobile & web development with a focus on iOS and Android.",
    playlists: ["iOS Development", "Android Development", "Web Development"],
    category: "Mobile Development"
  },

  // Cybersecurity
  {
    name: "Professor Messer",
    channelUrl: "https://www.youtube.com/channel/UCkefXKtInZ9PLsoGRtml2FQ",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJzNrZ0R2UonwEPRLM-mu3cqjLu2SUVG2VSev7jtGw=s100-c-k-c0xffffffff-no-rj-mo",
    description: "Security",
    playlists: ["CompTIA Security+ SY0-501 Training Course", "CompTIA N10-007 Network+ Study Groups"],
    category: "Cybersecurity"
  },

  // Internet/networking
  {
    name: "Net VN",
    channelUrl: "https://www.youtube.com/c/NETVN82",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJzSYAPTPcWy0bRmuTwX_ZoSf5glAyJey9l3DVyeKA=s88-c-k-c0x00ffffff-no-rj",
    description: "Internet, Networking, Command line, Hardware",
    playlists: ["Router/modem playlists", "Software management of internet connection and network videos"],
    category: "Internet/networking"
  },

  // Software in general
  {
    name: "Learn Google Spreadsheets",
    channelUrl: "https://www.youtube.com/c/LearnGoogleSpreadsheets",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJyI_LJUCt0PppNpYDlfW4KTcpmBf73M3hWv0YxH=s88-c-k-c0x00ffffff-no-rj",
    description: "Google Spreadsheets",
    playlists: ["Google Sheets - Fundamental Skills", "Google Apps Scripts - Fundamental"],
    category: "Software in general"
  },
  {
    name: "Tom Scott",
    channelUrl: "https://www.youtube.com/c/TomScottGo",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJwDmz-Sqfl3nOecezetnZo7lxo2sSFGahLOY7dGKg=s100-c-k-c0xffffffff-no-rj-mo",
    description: "Theoretical videos",
    playlists: ["How To Build An App", "The Basics (Code)", "other science videos"],
    category: "Software in general"
  },

  // Operating Systems
  {
    name: "Learn Linux TV",
    channelUrl: "https://www.youtube.com/channel/UCxQKHvKbmSzGMvUrVtJYnUA",
    avatarUrl: "https://yt3.googleusercontent.com/mfgw9-hHFToOujVfKxwqvvg1hhqbzEPTj2otSrWfF9kB7baYbqyu8GqCykaUaviVj151ZThW=s160-c-k-c0x00ffffff-no-rj",
    description: "Linux Tutorials, Distribution reviews, Linux Guides",
    playlists: ["Hardware reviews", "Linux essentials", "Linux commands for beginners"],
    category: "Operating Systems"
  },

  // Hardware
  {
    name: "Teaching Tech",
    channelUrl: "https://www.youtube.com/c/TeachingTech",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJwcYEZYVuVI4MejVHLNgPMLSWYzXmhTyVjgcweM=s100-c-k-c0xffffffff-no-rj-mo",
    description: "3D Printing",
    playlists: ["3D printing for beginners", "3D Printing", "Ender playlists", "Onshape 3D Modelling", "Printer reviews playlists"],
    category: "Hardware"
  },
  {
    name: "JayzTwoCents",
    channelUrl: "https://www.youtube.com/c/Jayztwocents",
    avatarUrl: "https://yt3.googleusercontent.com/60ZHdHfspX1q6YI8_RW8Zz8fyR8Ne5aDHIwQ0TGN-vFkBWp5J1htI2VsLQQsnVoQbGhIxmJ3lQ=s160-c-k-c0x00ffffff-no-rj",
    description: "All hardware",
    playlists: ["PC Building", "GPU", "Custom Builds"],
    category: "Hardware"
  },
  {
    name: "educ8s.tv",
    channelUrl: "https://www.youtube.com/c/Educ8s",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJzuLlqZ7x3U3Nbdg8BuL0GGAkQh00S9Sh87UTUV_Q=s100-c-k-c0xffffffff-no-rj-mo",
    description: "Arduino",
    playlists: ["Arduino Tutorials for Beginners", "Raspberry Pi Tutorials for Beginners"],
    category: "Hardware"
  },
  {
    name: "w2aew",
    channelUrl: "https://www.youtube.com/@w2aew",
    avatarUrl: "https://yt3.googleusercontent.com/ytc/AIdro_k-qMilaXXOCC7AjANxEeEcjhfowiKg25A-Dpa-QmPSzP4=s176-c-k-c0x00ffffff-no-rj",
    description: "Electronics, Circuits",
    playlists: ["Basics on Capacitors and Inductors", "Op Amp Tutorials", "Circuit Tutorials", "Bipolar Transistor Videos"],
    category: "Hardware"
  },

  // Competitive Programming
  {
    name: "Tushar Roy - Coding Made Simple",
    channelUrl: "https://www.youtube.com/user/tusharroy2525",
    avatarUrl: "https://yt3.ggpht.com/ytc/AMLnZu-vxWUfyxiYaed6g7no_ja24Sk4bOQvqy3vOA=s176-c-k-c0x00ffffff-no-rj",
    description: "Data Structures and Algorithms, Dynamic Programming, Leetcode",
    playlists: ["Dynamic Programming", "Graph Algorithms", "Binary Tree"],
    category: "Competitive Programming"
  },
  {
    name: "Nick White",
    channelUrl: "https://www.youtube.com/c/NickWhite",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJUE_t_F-A_B_A_A_A_A_A_A_A_A_A_A_A=s176-c-k-c0x00ffffff-no-rj",
    description: "Data structures, algorithms & interview prep.",
    playlists: ["Data Structures", "Algorithms", "LeetCode Solutions"],
    category: "Competitive Programming"
  },
  {
    name: "Big Box SWE",
    channelUrl: "https://www.youtube.com/c/BigBoxSWE",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJUE_t_F-A_B_A_A_A_A_A_A_A_A_A_A_A=s176-c-k-c0x00ffffff-no-rj",
    description: "System design & FAANG interview guidance.",
    playlists: ["System Design", "Interview Tips", "FAANG"],
    category: "Life Skills"
  },

  // Digital Design
  {
    name: "CharliMarieTV",
    channelUrl: "https://www.youtube.com/channel/UCScRSwdX0t31gjk3MYXIuYQ",
    avatarUrl: "https://yt3.googleusercontent.com/81uvut1NSf77K86u4yQczbAlWvVun5XAHpwPheF3cpZPCCCaHyNe4TmtDuVG_GbbyYow99evGw=s160-c-k-c0x00ffffff-no-rj",
    description: "web, graphic design",
    playlists: ["Design careers", "Workflow", "Design chat", "Freelancing as a designer"],
    category: "Digital Design"
  },
  {
    name: "Envato Tuts+",
    channelUrl: "https://www.youtube.com/c/tutsplus",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJyDKjIXjD19amsFlS8OLCTiMwplipojomEjZeUTrQ=s100-c-k-c0xffffffff-no-rj-mo",
    description: "All design, Illustrations, Web design",
    playlists: ["Learn Adobe Photoshop", "Learn About Fonts", "Photo and video manipulation playlists", "Figma videos", "Learn Photo Effects"],
    category: "Digital Design"
  },

  // Audio and Video
  {
    name: "Black Mixture",
    channelUrl: "https://www.youtube.com/c/BlackMixture",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJycV557ukLUO4022GP-8xFrGWBUjoj0PnUhQwuHRw=s100-c-k-c0xffffffff-no-rj-mo",
    description: "After Effects, Animation",
    playlists: ["SPEEDPAINT ANIMATION", "Motion Design", "After Effects Tutorials"],
    category: "Audio and Video"
  },
  {
    name: "Avnish Parker",
    channelUrl: "https://www.youtube.com/user/avnishparker",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJw1EJaU6c5-oLxVdCO91mNBSM0CaflC7YaVlbH67g=s100-c-k-c0xffffffff-no-rj-mo",
    description: "Animation, Design",
    playlists: ["After Effects Tutorials", "Text Animation - After Effects Tutorials", "Logo Intro - After Effects Tutorials", "Motion Graphics - After Effects Tutorials"],
    category: "Audio and Video"
  },
  {
    name: "Deny King",
    channelUrl: "https://www.youtube.com/c/DenyKingYoutube",
    avatarUrl: "https://yt3.googleusercontent.com/FjrS-9fmHvhq5l4AE_VAZyS6SF2PthnY57SYwOGW0pJoxVwKyrVXuApB8Ag70TZiUStuurtOVA=s160-c-k-c0x00ffffff-no-rj",
    description: "Video, Photos",
    playlists: ["Video Editing", "Manipulation PicsArt"],
    category: "Audio and Video"
  },
  {
    name: "Blender Guru",
    channelUrl: "https://www.youtube.com/user/AndrewPPrice",
    avatarUrl: "https://yt3.googleusercontent.com/nrV5iGyKXogAz448dTak1Fohx7MBr5l3mKlpUdhiTwzpyDYa3MKoAwsmClfdH75rPEX8TLgL=s160-c-k-c0x00ffffff-no-rj",
    description: "Blender, 3D modeling",
    playlists: ["Blender beginner tutorial series", "Blender modeling chair tutorial", "Couch tutorial series"],
    category: "Audio and Video"
  },
  {
    name: "Grant Abbitt",
    channelUrl: "https://www.youtube.com/@grabbitt",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJxM0K7wxdDj0TOqzP-qqkvafeirxwSV8G2I8SDfVA=s88-c-k-c0x00ffffff-no-rj",
    description: "3D modeling, Reptology, Blender",
    playlists: ["Learn sculpting in blender 2.8", "Blender 2.8 for beginners full course"],
    category: "Audio and Video"
  },
  {
    name: "CG Fast Track",
    channelUrl: "https://www.youtube.com/c/CGFastTrack",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJxlxDpTb7dFWyQpXiPqWxGQ0WWWyA5GNwf72ru1=s88-c-k-c0x00ffffff-no-rj",
    description: "Blender, 3D modeling",
    playlists: ["Blender 2.9 Beginner Tutorial Series", "CG Fast Track"],
    category: "Audio and Video"
  },
  {
    name: "CG Geek",
    channelUrl: "https://www.youtube.com/@CGGeek",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJUS0B38G8QpJm-h4PDd3wtrYFuSup0a3ZqD_a8uLw=s88-c-k-c0x00ffffff-no-rj",
    description: "Animation, Blender, 3D modeling, Visual Effects",
    playlists: ["Blender beginner tutorial series", "Bob Ross with Realistic 3D graphics", "Blender Nature tutorials", "Star wars 3D tutorials"],
    category: "Audio and Video"
  },
  {
    name: "DUCKY 3D",
    channelUrl: "https://www.youtube.com/channel/UCuNhGhbemBkdflZ1FGJ0lUQ",
    avatarUrl: "https://yt3.googleusercontent.com/FJ7as8ylKBl1ljf_rXqCp2BhdyMfoMXm91-B_on0QyrRcaImGFd0YWZQrGtHpRjux4mEbrRG=s160-c-k-c0x00ffffff-no-rj",
    description: "Video, Photos",
    playlists: ["Shading with nodes", "Making looping animations with Blender in Eevee engine"],
    category: "Audio and Video"
  },
  {
    name: "Marc Evanstein / music․py",
    channelUrl: "https://www.youtube.com/@marcevanstein",
    avatarUrl: "https://yt3.googleusercontent.com/BuasRsii8lSvqTuwH9qlolhSbVvJ5Zo-uqMTEN3pcZoxXYVwf_BaRCMDVHQoAgmTbwjKLbBJqA=s160-c-k-c0x00ffffff-no-rj",
    description: "Music theory, Music libraries",
    playlists: ["SCAMP Tutorial", "SCAMP", "Video Essays"],
    category: "Audio and Video"
  },

  // Life Skills
  {
    name: "GCFLearnFree.org",
    channelUrl: "https://www.youtube.com/c/GcflearnfreeOrgplus",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJwe6TjwIlLLS09rBm-AG81b6PslL87sIu8ULLAvpw=s100-c-k-c0xffffffff-no-rj-mo",
    description: "Job searching, General skills, Life tips",
    playlists: ["Searching For A Job", "Economic thinking playlists", "Office Suite tutorials", "Making Decisions", "Life skills playlists"],
    category: "Life Skills"
  },
  {
    name: "Joshua Fluke",
    channelUrl: "https://www.youtube.com/user/Tychos1",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJzsLfjQGNpQtVWS4hXGxM6F21cdArOL-sTIu9rOXw=s88-c-k-c0x00ffffff-no-rj",
    description: "Interviews, Portfolio Reviews, Getting a Job",
    playlists: ["Entrepreneurship", "How to apply to jobs"],
    category: "Life Skills"
  },
  {
    name: "Joma Tech",
    channelUrl: "https://www.youtube.com/c/JomaOppa",
    avatarUrl: "https://yt3.ggpht.com/a/AATXAJwnVxHV9cR_nofTeCXS3x2H2jRQjH3YEq8sYqpM=s176-c-k-c0x00ffffff-no-rj",
    description: "Programming, Job Offers, Salaries, Interviewing",
    playlists: ["Path to Software Engineering", "Tech Shows", "Startup Series", "Interviews", "Data Science Analytics"],
    category: "Life Skills"
  },
  {
    name: "Eddie Jaoude",
    channelUrl: "https://youtube.com/channel/UC5mnBodB73bR88fLXHSfzYA",
    avatarUrl: "https://yt3.googleusercontent.com/r2fH4HA6JbGYRzWJINZ8w4J4zUrocmGQy3PIwKFtLlNbdL9GCKCVTeyqzoqV_zHOAEThCf2S0Q=s160-c-k-c0x00ffffff-no-rj",
    description: "Open Source, Freelancing",
    playlists: ["Freelancing tips", "LinkFree Videos", "Git must know commands"],
    category: "Life Skills"
  },
  {
    name: "Programming with Mosh",
    channelUrl: "https://www.youtube.com/user/programmingwithmosh",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJVuqw-Kjiq9ROk9hq9hq9hq9hq9hq9hq9hq=s176-c-k-c0x00ffffff-no-rj",
    description: "Programming tutorials and courses",
    playlists: ["Python Tutorial", "JavaScript Tutorial", "React Tutorial", "Node.js Tutorial"],
    category: "Programming in general"
  },
  {
    name: "CS50",
    channelUrl: "https://www.youtube.com/@cs50",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJXHuUWiQbRlTuFw-QJrJOJpqkSQqCIqR4A8Uw=s176-c-k-c0x00ffffff-no-rj",
    description: "Harvard University's introduction to computer science and programming",
    playlists: ["CS50x 2023", "CS50 Web Programming", "CS50 AI"],
    category: "Computer Science"
  },
  {
    name: "Chris Hawkes",
    channelUrl: "https://www.youtube.com/user/noobtoprofessional",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJVuqw-KjKiq9ROk9hq9hq9hq9hq9hq9hq9hq=s176-c-k-c0x00ffffff-no-rj",
    description: "Programming tutorials for beginners",
    playlists: ["Python Basics", "Web Development", "Programming Career"],
    category: "Programming in general"
  },
  {
    name: "LearnCode.academy",
    channelUrl: "https://www.youtube.com/user/learncodeacademy",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJVuqw-KjKiq9ROk9hq9hq9hq9hq9hq9hq9hq=s176-c-k-c0x00ffffff-no-rj",
    description: "Web development tutorials",
    playlists: ["JavaScript", "React", "Angular", "Node.js"],
    category: "Web Development"
  },
  {
    name: "Paul Halliday",
    channelUrl: "https://www.youtube.com/channel/UCYJ9O6X1oFt7YGXpfRwrcWg",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJVuqw-KjKiq9ROk9hq9hq9hq9hq9hq9hq9hq=s176-c-k-c0x00ffffff-no-rj",
    description: "Vue.js and modern web development",
    playlists: ["Vue.js", "Nuxt.js", "TypeScript"],
    category: "Web Development"
  },
  {
    name: "Andre Madarang",
    channelUrl: "https://www.youtube.com/channel/UCtb40EQj2inp8zuaQlLx3iQ",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJVuqw-KjKiq9ROk9hq9hq9hq9hq9hq9hq9hq=s176-c-k-c0x00ffffff-no-rj",
    description: "Laravel, Vue.js, and full-stack development",
    playlists: ["Laravel", "Vue.js", "Full-stack development"],
    category: "Web Development"
  },
  {
    name: "Hitesh Choudhary",
    channelUrl: "https://www.youtube.com/@HiteshChoudharydotcom",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJWrT8qM7oH6pL3jG9kN5hF2sX_Q8vN=s176-c-k-c0x00ffffff-no-rj",
    description: "React, Flutter, and mobile development tutorials",
    playlists: ["React Native", "Flutter", "JavaScript"],
    category: "Mobile Development"
  },
  {
    name: "Jason Weimann",
    channelUrl: "https://www.youtube.com/channel/UCX_b3NNQN5bzExm-22-NVVg",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJVuqw-KjKiq9ROk9hq9hq9hq9hq9hq9hq9hq=s176-c-k-c0x00ffffff-no-rj",
    description: "Unity game development and C#",
    playlists: ["Unity Tutorials", "C# for Unity", "Game Development"],
    category: "Game Development"
  },
  {
    name: "Ben Awad",
    channelUrl: "https://www.youtube.com/@BenAwad97",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJXCzG4WsN7qzX-QJ8_2R9Fv4ZpG8lMmT8o4=s176-c-k-c0x00ffffff-no-rj",
    description: "Software developer making videos about React, GraphQL, TypeScript, and full-stack development",
    playlists: ["React", "GraphQL", "TypeScript", "Full-stack"],
    category: "Web Development"
  },
  {
    name: "Tech With Tim",
    channelUrl: "https://www.youtube.com/@TechWithTim",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJWvT2r7lq9X4sOlwT9qJ8v3hG5rZ-k1X4O_Mw=s176-c-k-c0x00ffffff-no-rj",
    description: "Software engineer, educator, and entrepreneur. Python programming and machine learning",
    playlists: ["Python", "Machine Learning", "Django", "Flask"],
    category: "Programming in general"
  },
  {
    name: "Kirupa Chinnathambi",
    channelUrl: "https://www.youtube.com/user/kirupa",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJVuqw-KjKiq9ROk9hq9hq9hq9hq9hq9hq9hq=s176-c-k-c0x00ffffff-no-rj",
    description: "Web animations and JavaScript",
    playlists: ["JavaScript", "CSS Animations", "React"],
    category: "Web Development"
  },
  {
    name: "Coding Addict",
    channelUrl: "https://www.youtube.com/@CodingAddict",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJUqV7wT5rE9M-Q2xL4hR8pG7jH2kN_Q9sX=s176-c-k-c0x00ffffff-no-rj",
    description: "JavaScript and React tutorials by John Smilga",
    playlists: ["JavaScript", "React", "Node.js"],
    category: "Web Development"
  },
  {
    name: "Codecourse",
    channelUrl: "https://www.youtube.com/@codecourse",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJVsT8qW7rM9oH6pL3jG9kN5hF2sX_Q8vN=s176-c-k-c0x00ffffff-no-rj",
    description: "PHP, Laravel, and web development tutorials",
    playlists: ["Laravel", "PHP", "Vue.js"],
    category: "Web Development"
  },
  {
    name: "Steve Griffith",
    channelUrl: "https://www.youtube.com/@SteveGriffith-Prof3ssorSt3v3",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJVBsT4W8rM7qH6pL3jG9kN5hF2sX_Q8vN=s176-c-k-c0x00ffffff-no-rj",
    description: "JavaScript and web development fundamentals by Prof3ssorSt3v3",
    playlists: ["JavaScript", "Web APIs", "CSS"],
    category: "Web Development"
  },
  {
    name: "Chris Courses",
    channelUrl: "https://www.youtube.com/@ChrisCourses",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJUqW8rT6mH7pL3jG9kN5hF2sX_Q8sV=s176-c-k-c0x00ffffff-no-rj",
    description: "HTML5 Canvas and JavaScript games development",
    playlists: ["HTML5 Canvas", "JavaScript Games", "Web Development"],
    category: "Game Development"
  },
  {
    name: "Flutter (Official)",
    channelUrl: "https://www.youtube.com/@flutterdev",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJVKsN4W6rT8oH3pQ9mG7jL5hF2kX_Q8sV=s176-c-k-c0x00ffffff-no-rj",
    description: "Official Flutter development channel by Google",
    playlists: ["Flutter Widget of the Week", "Flutter in Focus", "Flutter Engage"],
    category: "Mobile Development"
  },
  {
    name: "That DevOps Guy",
    channelUrl: "https://www.youtube.com/c/marceldempers",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJVuqw-KjKiq9ROk9hq9hq9hq9hq9hq9hq9hq=s176-c-k-c0x00ffffff-no-rj",
    description: "DevOps, Kubernetes, and cloud technologies",
    playlists: ["Kubernetes", "Docker", "DevOps"],
    category: "DevOps"
  },
  {
    name: "Dennis Ivy",
    channelUrl: "https://www.youtube.com/@DennisIvy",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJXwH8K5P2yT7oV4jR9qG3m6hL8sQ2_M7xF=s176-c-k-c0x00ffffff-no-rj",
    description: "Django and Python web development tutorials",
    playlists: ["Django", "Python", "React"],
    category: "Web Development"
  },
  {
    name: "Codevolution",
    channelUrl: "https://www.youtube.com/@Codevolution",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJVGsQ8R4mH7oT6xL9pJ2kN8sF5qW3_P4Ax=s176-c-k-c0x00ffffff-no-rj",
    description: "React, Angular, and modern web development by Vishwas Gopinath",
    playlists: ["React", "Angular", "JavaScript", "TypeScript"],
    category: "Web Development"
  },
  {
    name: "The Codeholic",
    channelUrl: "https://www.youtube.com/channel/UC_UMEcP_kF0z4E6KbxCpV1w",
    avatarUrl: "https://yt3.ggpht.com/ytc/AL5GRJVuqw-KjKiq9ROk9hq9hq9hq9hq9hq9hq9hq=s176-c-k-c0x00ffffff-no-rj",
    description: "PHP, Laravel, and full-stack development",
    playlists: ["Laravel", "PHP", "Vue.js", "React"],
    category: "Web Development"
  },
];

export function getYoutubersByCategory(category: string): YouTuber[] {
  return youtubers.filter(youtuber => youtuber.category === category);
}

export function getAllCategories(): string[] {
  return [...new Set(youtubers.map(youtuber => youtuber.category))];
}
