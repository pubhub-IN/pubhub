import { Github } from "lucide-react";

export default function Hero() {
  const handleSignIn = () => {
    window.location.href = "http://localhost:3000/auth/github";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#048400] to-[#011E00] flex flex-col relative overflow-hidden font-poppins">
      {/* Navbar */}
      <nav className="h-[100px] flex items-center px-6 relative z-20">
        <div className="flex items-center">
          <img src="/pubhub.png" alt="PubHub Logo" className="h-12 w-auto" />
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
            <h1 className="text-5xl leading-[1.2] md:text-6xl md:leading-[1.2] lg:text-7xl lg:leading-[1.2] font-bold text-white w-full">
              One platform to manage,
              <br />
              share, and grow in public.
            </h1>

            <p className="text-xl md:text-2xl text-green-100 mx-auto leading-relaxed font-medium">
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
    </div>
  );
}
