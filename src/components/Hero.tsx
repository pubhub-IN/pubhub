import { Github, Users, Share2, Briefcase, GitFork, Calendar, BookOpen, Youtube, Activity, User } from "lucide-react";
import { authService } from "../lib/auth";

export default function Hero() {
  const handleSignIn = () => {
    window.location.href = authService.getGitHubAuthUrl();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-green-900 font-poppins">
      {/* Navbar */}
      <nav className="relative z-20 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img src="/pubhub.png" alt="PubHub Logo" className="h-10 w-auto" />
            <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">PubHub</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">Features</a>
            <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">About</a>
            <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">Contact</a>
          </div>
          <button
            onClick={handleSignIn}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <Github className="w-5 h-5" />
            Sign in
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  Build, Share, and{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                    Grow in Public
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                  The all-in-one developer platform built for techies and founders to manage their coding journey, share progress, and advance their careers.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleSignIn}
                  className="inline-flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Github className="w-6 h-6" />
                  Connect GitHub
                </button>
              </div>

              
            </div>

            {/* Right Image */}
            <div className="relative">
             
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-green-200 dark:bg-green-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
              <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-emerald-200 dark:bg-emerald-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to grow as a developer
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From your first commit to your next big launch, PubHub provides all the tools you need to showcase your work and advance your career.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 border border-green-100 dark:border-gray-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <User className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Profession-Based Setup
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get personalized environment setup and technology recommendations based on your profession during onboarding.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 border border-blue-100 dark:border-gray-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                One-Click Sharing
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Share your GitHub projects on LinkedIn or Twitter with just one click. Generate engaging posts automatically.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 border border-purple-100 dark:border-gray-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Developer Network
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect with other developers and founders. Build your professional network and collaborate on projects.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 border border-orange-100 dark:border-gray-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Latest Job Opportunities
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get fresh job opportunities every day, curated for your skills and ready for you to apply.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 border border-emerald-100 dark:border-gray-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GitFork className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Smart Open Source
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get personalized open source contribution recommendations based on your skills and interests.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-gray-700 dark:to-gray-600 border border-yellow-100 dark:border-gray-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Easy Hackathon Registration
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Discover and register for hackathons with ease. Never miss an opportunity to showcase your skills.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 border border-indigo-100 dark:border-gray-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Interactive Courses
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Learn with text-based courses designed for hands-on learning and practical skill development.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-red-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 border border-red-100 dark:border-gray-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Youtube className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Expert Video Lessons
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access curated YouTube lessons from the best mentors and educators in the tech industry.
              </p>
            </div>

            {/* Feature 9 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 border border-teal-100 dark:border-gray-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Activity Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track the days you've worked and pushed code to GitHub. Visualize your coding consistency and progress.
              </p>
            </div>

            {/* Feature 10 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-700 dark:to-gray-600 border border-gray-100 dark:border-gray-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 md:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <User className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Personal Dashboard
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your personal account section with comprehensive analytics, settings, and profile management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to accelerate your developer journey?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already building, sharing, and growing in public with PubHub.
          </p>
          <button
            onClick={handleSignIn}
            className="inline-flex items-center gap-3 bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <Github className="w-6 h-6" />
            Get Started for Free
          </button>
        </div>
      </section>
    </div>
  );
}