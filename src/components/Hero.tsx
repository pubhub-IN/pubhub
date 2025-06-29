import { Github } from "lucide-react";
import { authService } from "../lib/auth";

export default function Hero() {
  const handleSignIn = () => {
    window.location.href = authService.getGitHubAuthUrl();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#048400] to-[#011E00] flex flex-col relative overflow-hidden font-poppins">
      {/* Navbar */}
      <nav className="h-[100px] flex items-center px-6 relative z-20">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img src="/pubhub.png" alt="PubHub Logo" className="h-12 w-auto" />
          </div>
          <div className="flex items-center">
            <img 
              src="https://res.cloudinary.com/dafqq1jvc/image/upload/v1749891645/black_circle_360x360_dpzcvm.png" 
              alt="Profile" 
              className="h-10 w-10 rounded-full"
            />
          </div>
        </div>
      </nav>

      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-2xl"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="text-center max-w-[80%] mx-auto px-6">
          {/* Hero Content */}
          <div className="space-y-6">
            <h1 className="text-xl leading-[1.2] md:text-6xl md:leading-[1.2] lg:text-7xl lg:leading-[1.2] font-bold text-white w-full">
              One platform to manage, share, and grow in public.
            </h1>

            <p className="text-xs md:text-2xl text-green-100 leading-relaxed font-medium">
              From your first commit to your next big launch—share it all.
            </p>

            <div className="pt-8">
              <button
                onClick={handleSignIn}
                className="inline-flex items-center gap-3 bg-white text-gray-900 px-6 py-3 rounded-lg text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50"
              >
                <Github className="w-5 h-5" />
                Connect GitHub
              </button>
            </div>
          </div>

          {/* Additional info */}
          <div className="mt-16 pt-8 border-t border-green-400/30">
            <p className="text-green-100 text-sm font-medium">
              Connect your GitHub account to get started
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-green-900/20 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything you need to grow as a developer
            </h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              From your first commit to your next big launch, PubHub provides all the tools you need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <h3 className="text-lg font-semibold text-white mb-3">
                Profession-Based Setup
              </h3>
              <p className="text-green-100 text-sm">
                Get personalized environment setup during onboarding based on your profession.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <h3 className="text-lg font-semibold text-white mb-3">
                One-Click Sharing
              </h3>
              <p className="text-green-100 text-sm">
                Share your GitHub projects on LinkedIn or Twitter with just one click.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <h3 className="text-lg font-semibold text-white mb-3">
                Developer Network
              </h3>
              <p className="text-green-100 text-sm">
                Connect with other developers and founders to build your network.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <h3 className="text-lg font-semibold text-white mb-3">
                Latest Jobs
              </h3>
              <p className="text-green-100 text-sm">
                Get fresh job opportunities every day, ready for you to apply.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <h3 className="text-lg font-semibold text-white mb-3">
                Open Source Recommendations
              </h3>
              <p className="text-green-100 text-sm">
                Get personalized open source contribution recommendations based on your skills.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <h3 className="text-lg font-semibold text-white mb-3">
                Hackathon Registration
              </h3>
              <p className="text-green-100 text-sm">
                Register for hackathons with ease and never miss opportunities.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <h3 className="text-lg font-semibold text-white mb-3">
                Text-Based Courses
              </h3>
              <p className="text-green-100 text-sm">
                Learn with interactive text-based courses for practical skill development.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <h3 className="text-lg font-semibold text-white mb-3">
                YouTube Lessons
              </h3>
              <p className="text-green-100 text-sm">
                Access curated YouTube lessons from the best mentors in tech.
              </p>
            </div>

            {/* Feature 9 */}
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <h3 className="text-lg font-semibold text-white mb-3">
                Activity Tracking
              </h3>
              <p className="text-green-100 text-sm">
                Track the days you've worked and pushed code to GitHub.
              </p>
            </div>

            {/* Feature 10 */}
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 md:col-span-2 lg:col-span-1">
              <h3 className="text-lg font-semibold text-white mb-3">
                Personal Dashboard
              </h3>
              <p className="text-green-100 text-sm">
                Your personal account section with analytics and profile management.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}