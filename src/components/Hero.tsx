import {
  Github,
  Star,
  Quote,
  Users,
  Code,
  TrendingUp,
  Target,
  Heart,
  Check,
  Zap,
  Mail,
  Twitter,
  Linkedin,
} from "lucide-react";
import { authService } from "../lib/auth";

export default function Hero() {
  const handleSignIn = () => {
    window.location.href = authService.getGitHubAuthUrl();
  };

  // Smooth scroll function
  const smoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Full Stack Developer",
      company: "TechCorp",
      avatar:
        "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=150&h=150&auto=format&fit=crop&crop=face&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      content:
        "PubHub transformed how I share my projects. The one-click social sharing feature saved me hours every week!",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Open Source Contributor",
      company: "Freelance",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content:
        "The open source recommendations are spot-on. I've discovered amazing projects to contribute to that match my skills perfectly.",
      rating: 5,
    },
    {
      name: "Priya Patel",
      role: "Frontend Developer",
      company: "StartupXYZ",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content:
        "The developer network feature helped me connect with amazing people in the tech community. Highly recommended!",
      rating: 5,
    },
    {
      name: "Alex Thompson",
      role: "Backend Engineer",
      company: "BigTech Inc",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      content:
        "Activity tracking keeps me motivated. Seeing my GitHub activity visualized is incredibly satisfying and keeps me consistent.",
      rating: 5,
    },
    {
      name: "Emma Wilson",
      role: "DevOps Engineer",
      company: "CloudScale",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      content:
        "The job hunting feature is a game-changer. I found my dream job through PubHub's curated opportunities.",
      rating: 5,
    },
    {
      name: "David Kim",
      role: "Mobile Developer",
      company: "AppStudio",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      content:
        "The text-based courses are perfect for learning on the go. Practical, concise, and immediately applicable.",
      rating: 5,
    },
  ];

  const stats = [
    { number: "100+", label: "Active Developers", icon: Users },
    { number: "50+", label: "Projects Shared", icon: Code },
    { number: "97%", label: "Success Rate", icon: TrendingUp },
    { number: "24/7", label: " AI Support Available", icon: Heart },
  ];

  const features = [
    "Unlimited project sharing",
    "One-click social media posting",
    "Developer network access",
    "Job recommendations",
    "Open source suggestions",
    "Activity tracking",
    "Personal dashboard",
    "Text-based courses",
    "YouTube lesson access",
    "Hackathon registrations",
    "GitHub integration",
    "Community support",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#048400] to-[#011E00] flex flex-col relative overflow-hidden font-poppins">
      {/* Navbar */}
      <nav className="h-[100px] flex items-center px-6 relative z-20">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img src="/pubhub.png" alt="PubHub Logo" className="h-12 w-auto" />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              onClick={(e) => smoothScroll(e, "features")}
              className="text-white hover:text-green-200 transition-colors font-medium cursor-pointer"
            >
              Features
            </a>
            <a
              href="#about"
              onClick={(e) => smoothScroll(e, "about")}
              className="text-white hover:text-green-200 transition-colors font-medium cursor-pointer"
            >
              About
            </a>
            <a
              href="#pricing"
              onClick={(e) => smoothScroll(e, "pricing")}
              className="text-white hover:text-green-200 transition-colors font-medium cursor-pointer"
            >
              Pricing
            </a>
            <a
              href="#contact"
              onClick={(e) => smoothScroll(e, "contact")}
              className="text-white hover:text-green-200 transition-colors font-medium cursor-pointer"
            >
              Contact
            </a>
          </div>

          <div className="flex items-center mt-8">
            <img
              src="https://res.cloudinary.com/dafqq1jvc/image/upload/v1749891645/black_circle_360x360_dpzcvm.png"
              alt="Profile"
              className="w-[80px] h-[80px] rounded-full object-cover"
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
      <div className="flex-1 flex items-center justify-center relative z-10 min-h-[80vh]">
        <div className="text-center max-w-[90%] mx-auto px-6">
          {/* Hero Content */}
          <div className="space-y-6">
            <h1 className="text-xl leading-[1.2] md:text-4xl md:leading-[1.2] lg:text-6xl lg:leading-[1.2] font-bold text-white w-full">
              One platform to manage, <br /> share, and grow in public.
            </h1>

            <p className="text-xs md:text-lg text-green-100 leading-relaxed font-medium">
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
      <section
        className="py-20 bg-green-900/20 backdrop-blur-sm relative z-10"
        id="features"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything you need to grow as a developer
            </h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              From your first commit to your next big launch, <br /> PubHub
              provides all the tools you need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <h3 className="text-lg font-semibold text-white mb-3">
                Profession-Based Setup
              </h3>
              <p className="text-green-100 text-sm">
                Get personalized environment setup during onboarding based on
                your profession.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <h3 className="text-lg font-semibold text-white mb-3">
                One-Click Sharing
              </h3>
              <p className="text-green-100 text-sm">
                Share your GitHub projects on LinkedIn or Twitter with just one
                click.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <h3 className="text-lg font-semibold text-white mb-3">
                Developer Network
              </h3>
              <p className="text-green-100 text-sm">
                Connect with other developers and founders to build your
                network.
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
                Get personalized open source contribution recommendations based
                on your skills.
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
                Learn with interactive text-based courses for practical skill
                development.
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
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 ">
              <h3 className="text-lg font-semibold text-white mb-3">
                Personal Dashboard
              </h3>
              <p className="text-green-100 text-sm">
                Your personal account section with analytics and profile
                management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-20 bg-green-900/30 backdrop-blur-sm relative z-10"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  About PubHub
                </h2>
                <p className="text-lg text-green-100 leading-relaxed mb-6">
                  PubHub is more than just a platform—it's a community-driven
                  ecosystem designed to accelerate your growth as a developer.
                  We believe that sharing your journey publicly is the fastest
                  way to learn, grow, and connect with opportunities.
                </p>
                <p className="text-lg text-green-100 leading-relaxed mb-6">
                  Founded by developers, for developers, we understand the
                  challenges of building in public. That's why we've created a
                  comprehensive suite of tools that streamline every aspect of
                  your developer journey, from your first commit to your next
                  big launch.
                </p>
              </div>

              {/* Mission Statement */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Target className="w-8 h-8 text-green-300 mr-3" />
                  <h3 className="text-xl font-semibold text-white">
                    Our Mission
                  </h3>
                </div>
                <p className="text-green-100 leading-relaxed">
                  To democratize access to developer opportunities by making it
                  easier to share, connect, and grow in the tech community.
                  We're building the future where every developer can thrive.
                </p>
              </div>

              {/* Values */}
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Our Values
                </h3>
                <div className="grid gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-green-100">
                      Transparency and authenticity in everything we do
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-green-100">
                      Community-driven development and feedback
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-green-100">
                      Continuous learning and skill development
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-green-100">
                      Inclusive and accessible technology for all
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Stats & Visual */}
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="flex justify-center mb-3">
                      <stat.icon className="w-8 h-8 text-green-300" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-green-100 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Visual Element */}
              <div className="relative">
                <div className="bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-2xl p-8 border border-green-300/30">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Code className="w-8 h-8 text-green-200" />
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-2">
                      Built for Developers
                    </h4>
                    <p className="text-green-100 text-sm leading-relaxed">
                      Every feature is designed with developers in mind. We
                      understand your workflow because we live it too.
                    </p>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-300/40 rounded-full blur-sm"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400/30 rounded-full blur-sm"></div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-8 py-4">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="text-white font-semibold">
                Join our growing community of developers
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className="py-20 bg-green-800/10 backdrop-blur-sm relative z-10"
        id="testimonials"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Loved by developers worldwide
            </h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Join thousands of developers who have transformed their careers
              with PubHub
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                {/* Quote Icon */}
                <div className="flex justify-start mb-4">
                  <Quote className="w-8 h-8 text-green-300 opacity-60" />
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-green-100 text-sm leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-green-300/30"
                  />
                  <div>
                    <h4 className="text-white font-semibold text-sm">
                      {testimonial.name}
                    </h4>
                    <p className="text-green-200 text-xs">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-8 py-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <span className="text-white font-semibold ml-2">
                Join 10,000+ developers
              </span>
            </div>
            <div className="mt-6">
              <button
                onClick={handleSignIn}
                className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50"
              >
                <Github className="w-6 h-6" />
                Start Your Journey
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-20 bg-green-800/20 backdrop-blur-sm relative z-10"
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Start Building in Public Today
            </h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Everything you need to grow as a developer - completely free,
              forever.
            </p>
          </div>

          {/* Single Pricing Card */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                {/* Popular Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    <Zap className="w-4 h-4 inline mr-2" />
                    Most Popular
                  </div>
                </div>

                {/* Plan Header */}
                <div className="text-center mb-8 pt-4">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Free Forever
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">$0</span>
                    <span className="text-green-100 text-lg">/month</span>
                  </div>
                  <p className="text-green-100 text-sm">
                    Perfect for developers getting started with building in
                    public
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-green-100 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleSignIn}
                  className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:from-green-500 hover:to-green-700"
                >
                  <Github className="w-5 h-5 inline mr-2" />
                  Get Started Free
                </button>

                {/* Additional Info */}
                <div className="text-center mt-6">
                  <p className="text-green-200 text-xs">
                    No credit card required • Cancel anytime
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-8 py-4">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-white text-sm">No setup fees</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-white text-sm">Instant access</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-white text-sm">Full features</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 bg-green-900/30 backdrop-blur-sm relative z-10"
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Have questions, feedback, or want to partner with us? Reach out
              and our team will get back to you soon!
            </p>
          </div>

          <div className="flex flex-col justify-center gap-12 items-center">
            {/* Contact Form */}
            <form
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 space-y-6 shadow-lg min-w-[70%]"
              action="https://api.web3forms.com/submit"
              method="POST"
            >
              <input
                type="hidden"
                name="access_key"
                value="1db24109-7af7-4a23-a923-8f9fcec9c8ee"
              />
              <div>
                <label
                  htmlFor="name"
                  className="block text-green-100 mb-2 font-medium"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-green-400/20 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-green-200"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-green-100 mb-2 font-medium"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-green-400/20 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-green-200"
                  placeholder="you@email.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-green-100 mb-2 font-medium"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-green-400/20 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-green-200"
                  placeholder="How can we help you?"
                  required
                ></textarea>
              </div>
              <input
                type="hidden"
                name="redirect"
                value="https://web3forms.com/success"
              ></input>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:from-green-500 hover:to-green-700"
              >
                Send Message
              </button>
            </form>

            {/* Contact Details */}
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <Mail className="w-7 h-7 text-green-300" />
                <div className="flex gap-2">
                  <div className="text-green-100 font-medium">Email :</div>
                  <a
                    href="mailto:pubhub.work@gmail.com"
                    className="text-white hover:underline"
                  >
                    pubhub.work@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900/40 backdrop-blur-sm border-t border-green-400/20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <img
                  src="/pubhub.png"
                  alt="PubHub Logo"
                  className="h-10 w-auto mr-3"
                />
                <span className="text-2xl font-bold text-white">PubHub</span>
              </div>
              <p className="text-green-100 text-sm leading-relaxed mb-6 max-w-md">
                The ultimate platform for developers to share, connect, and grow
                in public. From your first commit to your next big launch—we've
                got you covered.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://x.com/KotakPrerit"
                  className="text-green-300 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener"
                  title="X Pubhub"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/prerit-kotak/"
                  className="text-green-300 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener"
                  title="LinkedIn PubHub"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="mailto:pubhub.work@gmail.com"
                  className="text-green-300 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener"
                  title="Email PubHub"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    onClick={(e) => smoothScroll(e, "features")}
                    className="text-green-100 hover:text-white transition-colors text-sm cursor-pointer"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    onClick={(e) => smoothScroll(e, "about")}
                    className="text-green-100 hover:text-white transition-colors text-sm cursor-pointer"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    onClick={(e) => smoothScroll(e, "testimonials")}
                    className="text-green-100 hover:text-white transition-colors text-sm cursor-pointer"
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    onClick={(e) => smoothScroll(e, "contact")}
                    className="text-green-100 hover:text-white transition-colors text-sm cursor-pointer"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-green-400/20 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-green-100 text-sm mb-4 md:mb-0">
                © 2024 PubHub. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
