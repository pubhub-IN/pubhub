import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  Layers,
  User,
  Menu,
  Brain,
  Youtube,
  Share2,
  Users as UsersIcon,
  Briefcase,
} from "lucide-react";
import pubhubLogo from "/pubhub.png";

const navItems = [
  { to: "/dashboard", icon: <Home />, label: "Home" },
  { to: "/hackathons", icon: <Layers />, label: "Hackathons" },
  { to: "/open-source", icon: <BookOpen />, label: "Open Source" },
  { to: "/start-learning", icon: <Brain />, label: "Start Learning" },
  { to: "/youtube", icon: <Youtube />, label: "Recorded Lectures" },
  { to: "/share-socials", icon: <Share2 />, label: "Share on Socials" },
  { to: "/people", icon: <UsersIcon />, label: "People" },
  { to: "/job-hunting", icon: <Briefcase />, label: "Job Hunting" },
  { to: "/account", icon: <User />, label: "Account" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-gray-900 p-2 rounded-lg shadow"
        onClick={() => setOpen((o) => !o)}
        title="Open sidebar menu"
        aria-label="Open sidebar menu"
      >
        <Menu className="w-6 h-6" />
      </button>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 bg-white dark:bg-gray-800 shadow-lg flex flex-col border-r-4 border-[#555] transition-all duration-200
          ${open ? "w-64" : "w-16"} md:w-16 md:hover:w-64`}
        onMouseEnter={() => window.innerWidth >= 768 && setOpen(true)}
        onMouseLeave={() => window.innerWidth >= 768 && setOpen(false)}
      >
        <div className="flex justify-center py-6">
          <img src={pubhubLogo} alt="PubHub Logo" className="w-10 h-10" />
        </div>
        <nav className="flex flex-col gap-2 px-2 w-full">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative
                ${
                  location.pathname === item.to
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-200"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                }`}
              title={item.label}
            >
              <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
              <span
                className={`whitespace-nowrap overflow-hidden text-sm font-medium transition-all duration-200 ${
                  open ? "opacity-100 w-auto" : "opacity-0 w-0"
                }`}
              >
                {item.label}
              </span>

              {/* Tooltip for collapsed state */}
              {!open && (
                <div className="absolute left-full ml-2 pl-1 hidden group-hover:md:block z-50">
                  <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-md whitespace-nowrap shadow-lg">
                    {item.label}
                  </div>
                </div>
              )}
            </Link>
          ))}
        </nav>
      </aside>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
