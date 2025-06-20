import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Layers, User, Menu, Brain } from "lucide-react";
import pubhubLogo from "/pubhub.png";

const navItems = [
  { to: "/dashboard", icon: <Home />, label: "Home" },
  { to: "/hackathons", icon: <Layers />, label: "Hackathons" },
  { to: "/open-source", icon: <BookOpen />, label: "Open Source" },
  { to: "/start-learning", icon: <Brain/>, label: "Start Learning"},
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
        className={`fixed top-0 left-0 h-full z-40 bg-white dark:bg-gray-800 shadow-lg flex flex-col pl-[20px] transition-all duration-200
          ${
            open ? "w-64" : "w-24"
          } md:w-22 md:hover:w-64 md:hover:border-r-[5px] md:hover:border-r-[#999] md:hover:border-solid md:transition-all md:duration-200`}
        onMouseEnter={() => window.innerWidth >= 768 && setOpen(true)}
        onMouseLeave={() => window.innerWidth >= 768 && setOpen(false)}
      >
        <img
          src={pubhubLogo}
          alt="PubHub Logo"
          className="w-10 h-10 mt-6 mb-8"
        />
        <nav className="flex flex-col gap-4 w-full">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg w-12 md:w-12 md:hover:w-44 transition-all duration-200
                ${
                  location.pathname === item.to
                    ? "text-blue-600 dark:text-blue-200"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
            >
              <span className="w-6 h-6 flex-shrink-0">{item.icon}</span>
              <span
                className={`ml-2 text-base font-medium transition-opacity duration-200 ${
                  open ? "opacity-100" : "opacity-0 md:opacity-0"
                }`}
              >
                {item.label}
              </span>
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
