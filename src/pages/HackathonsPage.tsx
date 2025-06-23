import { useEffect, useState } from "react";
import hackathons from "../Hackathon-data/hackathonData.json";
import { AuthUser } from "../lib/auth-jwt";
import { Calendar, Globe, Info, ChevronLeft, ChevronRight } from "lucide-react";

interface Hackathon {
  title: string;
  link: string;
  date: string;
  prize: string;
  participants: string;
  image: string;
  tags: string[];
}

const motivations = [
  "Code for change, contribute today!",
  "Your PR can power the world.",
  "Open source needs your spark.",
  "Start small, impact big!",
  "Build. Share. Inspire.",
  "Every commit counts!",
  "Change the world, one repo at a time.",
  "Contribute. Collaborate. Create.",
  "Your code matters.",
  "Give back through Git.",
  "Hack for good, code for all.",
  "Real heroes commit.",
  "Share code, shape futures.",
  "Empower others, open your code.",
  "Fork it. Fix it. PR it.",
  "Be proud, contribute loud!",
  "You + Open Source = 🔥",
  "Push kindness with code.",
  "Code freely, help globally.",
  "Make GitHub proud today!",
];

function getWish() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

function daysLeft(dateStr: string) {
  // Try to extract the end date from the date string
  const match = dateStr.match(/\w+ \d{1,2},? \d{4}$/);
  if (!match) return null;
  const endDate = new Date(match[0]);
  const now = new Date();
  const diff = Math.ceil(
    (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff > 0 ? diff : null;
}

export default function HackathonsPage({ user }: { user: AuthUser }) {
  const [motivation, setMotivation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setMotivation(motivations[Math.floor(Math.random() * motivations.length)]);
  }, []);

  const indexOfLastHackathon = currentPage * itemsPerPage;
  const indexOfFirstHackathon = indexOfLastHackathon - itemsPerPage;
  const currentHackathons = hackathons.slice(
    indexOfFirstHackathon,
    indexOfLastHackathon
  );
  const totalPages = Math.ceil(hackathons.length / itemsPerPage);

  return (
    <div className="p-8 pl-16 transition-all">
      <h1 className="text-3xl font-bold mb-2">
        {getWish()} {user.name || user.github_username}! {motivation}
      </h1>
      <h2 className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        We've arranged some amazing Hackathons for you to participate.
      </h2>
      <div className="flex flex-col gap-8">
        {currentHackathons.map((h: Hackathon, i: number) => {
          const left = daysLeft(h.date);
          return (
            <a
              key={indexOfFirstHackathon + i}
              href={h.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-green-200 dark:border-green-800 rounded-xl bg-white dark:bg-gray-900 shadow hover:shadow-lg transition flex flex-col md:flex-row items-stretch overflow-hidden"
            >
              {" "}
              <div className="flex-shrink-0 flex items-center justify-center p-6 md:p-8">
                <img
                  src={h.image}
                  alt={h.title}
                  className="w-32 h-32 rounded object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col md:flex-row md:items-center p-6 md:p-8 gap-6">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-2xl mb-2 text-gray-900 dark:text-white">
                    {h.title}
                  </h3>
                  <div className="flex items-center gap-3 mb-3">
                    {left && (
                      <span className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
                        {left} days left
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                      <Globe className="w-4 h-4" /> Online
                    </span>
                  </div>
                  <div className="flex gap-8 mb-3">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {h.prize}{" "}
                      <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                        in prizes
                      </span>
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {h.participants}{" "}
                      <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                        participants
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 min-w-[220px] md:border-l md:pl-8 border-gray-200 dark:border-gray-800">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="inline-block bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200 dark:border-blue-800">
                      StackBlitz / Bolt
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 text-sm mb-1">
                    <Calendar className="w-4 h-4" /> {h.date}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 text-sm mb-1">
                    <Info className="w-4 h-4" /> Managed by Devpost
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {h.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <div className="mt-8 flex justify-center items-center gap-4">
        {" "}
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Previous page"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Next page"
          aria-label="Go to next page"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
