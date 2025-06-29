import { useEffect, useRef, useState } from "react";
import { Github, ArrowRight, Play, Star, GitBranch, Users, Code2, Zap, Globe, Sparkles } from "lucide-react";
import { authService } from "../lib/auth";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Animated background particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Mouse interaction
        const dx = mousePosition.x * canvas.width * 0.5 - particle.x;
        const dy = mousePosition.y * canvas.height * 0.5 - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          particle.x -= dx * 0.01;
          particle.y -= dy * 0.01;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 197, 94, ${particle.opacity})`;
        ctx.fill();

        // Connect nearby particles
        particles.slice(index + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(34, 197, 94, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mousePosition]);

  const handleSignIn = () => {
    window.location.href = authService.getGitHubAuthUrl();
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-green-900 to-gray-900">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 12}%`,
              animationDelay: `${i * 0.5}s`,
              transform: `translateZ(${i * 10}px)`,
            }}
          >
            <div
              className={`w-${8 + i * 2} h-${8 + i * 2} bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-lg backdrop-blur-sm border border-white/10 rotate-45`}
              style={{
                transform: `rotate(${45 + mousePosition.x * 10}deg) scale(${1 + mousePosition.y * 0.1})`,
                transition: "transform 0.3s ease-out",
              }}
            />
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6">
        <div className="flex items-center space-x-2">
          <img 
            src="/pubhub.png" 
            alt="PubHub Logo" 
            className="h-10 w-auto transition-transform duration-300 hover:scale-110" 
          />
          <span className="text-xl font-bold text-white">PubHub</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection('features')}
            className="text-gray-300 hover:text-white transition-colors duration-300"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('stats')}
            className="text-gray-300 hover:text-white transition-colors duration-300"
          >
            Stats
          </button>
          <button 
            onClick={() => scrollToSection('community')}
            className="text-gray-300 hover:text-white transition-colors duration-300"
          >
            Community
          </button>
        </div>

        <button
          onClick={handleSignIn}
          className="group relative px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-medium overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25"
        >
          <span className="relative z-10 flex items-center space-x-2">
            <Github className="w-4 h-4" />
            <span>Sign In</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </nav>

      {/* Main Hero Section */}
      <div 
        ref={heroRef}
        className="relative z-40 flex flex-col items-center justify-center min-h-screen px-6 text-center"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      >
        {/* Animated badge */}
        <div 
          className={`mb-8 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-green-300">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Now with AI-powered insights</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Main heading with 3D effect */}
        <h1 
          className={`text-6xl md:text-8xl font-bold text-white mb-6 transform transition-all duration-1000 delay-200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          style={{
            textShadow: '0 0 30px rgba(34, 197, 94, 0.5)',
            transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`,
          }}
        >
          Build in
          <span className="block bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent animate-pulse">
            Public
          </span>
        </h1>

        {/* Subtitle */}
        <p 
          className={`text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl leading-relaxed transform transition-all duration-1000 delay-400 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          The ultimate platform for developers to showcase their journey, 
          connect with peers, and grow their skills through collaborative learning.
        </p>

        {/* CTA Buttons */}
        <div 
          className={`flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16 transform transition-all duration-1000 delay-600 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <button
            onClick={handleSignIn}
            className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25"
          >
            <span className="relative z-10 flex items-center space-x-3">
              <Github className="w-5 h-5" />
              <span>Connect GitHub</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          <button className="group flex items-center space-x-3 px-8 py-4 border-2 border-white/20 text-white rounded-full font-semibold text-lg backdrop-blur-md hover:bg-white/10 transition-all duration-300">
            <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <span>Watch Demo</span>
          </button>
        </div>

        {/* Floating stats */}
        <div 
          className={`grid grid-cols-3 gap-8 transform transition-all duration-1000 delay-800 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {[
            { icon: Users, label: "Developers", value: "10K+" },
            { icon: GitBranch, label: "Projects", value: "50K+" },
            { icon: Star, label: "Stars", value: "100K+" },
          ].map((stat, index) => (
            <div 
              key={index}
              className="text-center group cursor-pointer"
              style={{
                transform: `translateZ(${index * 20}px)`,
              }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-3 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                <stat.icon className="w-8 h-8 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div 
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="flex flex-col items-center space-y-2 text-white/60 animate-bounce">
            <span className="text-sm">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="relative z-30 py-32 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Everything you need to
              <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                grow as a developer
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From tracking your progress to connecting with the community, 
              PubHub provides all the tools you need for your developer journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Code2,
                title: "Track Your Progress",
                description: "Monitor your coding journey with detailed analytics and insights.",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: Users,
                title: "Connect & Collaborate",
                description: "Build meaningful connections with developers worldwide.",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: Zap,
                title: "Learn & Grow",
                description: "Access curated learning resources and skill-building challenges.",
                gradient: "from-green-500 to-emerald-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105"
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative z-30 py-32 bg-gradient-to-b from-gray-900/50 to-green-900/20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Trusted by developers
            <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              around the world
            </span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
            {[
              { value: "10,000+", label: "Active Developers" },
              { value: "50,000+", label: "Projects Shared" },
              { value: "1M+", label: "Lines of Code" },
              { value: "100+", label: "Countries" },
            ].map((stat, index) => (
              <div
                key={index}
                className="group cursor-pointer"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="text-4xl md:text-6xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-gray-300 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="relative z-30 py-32 bg-gradient-to-b from-green-900/20 to-gray-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Join the
            <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              developer community
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Connect your GitHub account and start building in public today.
          </p>
          
          <button
            onClick={handleSignIn}
            className="group relative px-12 py-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-bold text-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25"
          >
            <span className="relative z-10 flex items-center space-x-3">
              <Github className="w-6 h-6" />
              <span>Get Started Now</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-30 py-12 bg-gray-900 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src="/pubhub.png" alt="PubHub Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold text-white">PubHub</span>
          </div>
          <p className="text-gray-400">
            © 2025 PubHub. Built with ❤️ for the developer community.
          </p>
        </div>
      </footer>
    </div>
  );
}