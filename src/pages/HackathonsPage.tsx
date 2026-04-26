import { useState, useEffect, type MouseEvent } from "react";
import { API_ENDPOINTS, buildApiUrl } from "../config/api";
import { Trophy, ChevronLeft, ChevronRight } from "lucide-react";
import { HackathonFeedResponse } from "../types/hackathon";
import "../styles/hackathons-fonts.css";
import "../styles/hackathons-cards.css";

const ITEMS_PER_PAGE = 8;
const HACKATHONS_CACHE_KEY = "pubhub:hackathons:feed";
const HACKATHONS_CACHE_TTL_MS = 1000 * 60 * 20;

type HoverDirection = "from-top" | "from-bottom";
interface HoverAnimationState {
  direction: HoverDirection;
  active: boolean;
}

interface HackathonsCacheEntry {
  cachedAt: number;
  data: HackathonFeedResponse;
}

const isHackathonsResponse = (value: unknown): value is HackathonFeedResponse => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<HackathonFeedResponse>;
  return (
    typeof candidate.success === "boolean" &&
    !!candidate.latest &&
    !!candidate.upcoming &&
    Array.isArray(candidate.latest.items) &&
    Array.isArray(candidate.upcoming.items)
  );
};

const readHackathonsCache = (allowExpired = false): HackathonFeedResponse | null => {
  try {
    const rawCache = localStorage.getItem(HACKATHONS_CACHE_KEY);
    if (!rawCache) {
      return null;
    }

    const parsed = JSON.parse(rawCache) as Partial<HackathonsCacheEntry>;
    if (
      !parsed ||
      typeof parsed.cachedAt !== "number" ||
      !isHackathonsResponse(parsed.data)
    ) {
      localStorage.removeItem(HACKATHONS_CACHE_KEY);
      return null;
    }

    const isExpired = Date.now() - parsed.cachedAt > HACKATHONS_CACHE_TTL_MS;
    if (isExpired && !allowExpired) {
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
};

const writeHackathonsCache = (payload: HackathonFeedResponse) => {
  try {
    const cacheValue: HackathonsCacheEntry = {
      cachedAt: Date.now(),
      data: payload,
    };
    localStorage.setItem(HACKATHONS_CACHE_KEY, JSON.stringify(cacheValue));
  } catch {
    // Ignore storage errors (quota/private mode) and continue with in-memory state.
  }
};

const HackathonsPage = () => {
  const [data, setData] = useState<HackathonFeedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoverStates, setHoverStates] = useState<
    Record<string, HoverAnimationState>
  >({});

  useEffect(() => {
    const cachedData = readHackathonsCache();
    if (cachedData) {
      setData(cachedData);
      setLoading(false);
      return;
    }

    const fetchHackathons = async () => {
      try {
        setLoading(true);
        const url = buildApiUrl(API_ENDPOINTS.HACKATHONS);
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch hackathons");
        }
        const json = await res.json();
        setData(json);
        setCurrentPage(1);
        writeHackathonsCache(json);
      } catch (err) {
        const expiredCache = readHackathonsCache(true);
        if (expiredCache) {
          setData(expiredCache);
        } else {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchHackathons();
  }, []);

  // Combine all hackathons from both sections
  const allHackathons = data ? [...(data.latest?.items || []), ...(data.upcoming?.items || [])] : [];
  
  // Remove duplicates by id
  const uniqueHackathons = Array.from(new Map(allHackathons.map(item => [item.id, item])).values());
  
  // Calculate pagination
  const totalPages = Math.ceil(uniqueHackathons.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const paginatedHackathons = uniqueHackathons.slice(startIdx, endIdx);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getHoverDirection = (event: MouseEvent<HTMLAnchorElement>): HoverDirection => {
    const rect = event.currentTarget.getBoundingClientRect();
    const cursorY = event.clientY - rect.top;
    return cursorY <= rect.height / 2 ? "from-top" : "from-bottom";
  };

  const handleCardMouseEnter = (
    id: string,
    event: MouseEvent<HTMLAnchorElement>
  ) => {
    const direction = getHoverDirection(event);

    setHoverStates((prev) => ({
      ...prev,
      [id]: {
        direction,
        active: true,
      },
    }));
  };

  const handleCardMouseLeave = (
    id: string,
    event: MouseEvent<HTMLAnchorElement>
  ) => {
    const direction = getHoverDirection(event);

    setHoverStates((prev) => ({
      ...prev,
      [id]: {
        direction,
        active: false,
      },
    }));
  };

  const formatCardNumber = (value: number) => String(value).padStart(2, "0");

  const midpoint = Math.ceil(paginatedHackathons.length / 2);
  const leftColumnHackathons = paginatedHackathons.slice(0, midpoint);
  const rightColumnHackathons = paginatedHackathons.slice(midpoint);

  return (
    <div className="hackathons-page flex min-h-screen flex-1 overflow-y-auto text-[#f2a043]">
      <div className="w-full max-w-[1700px] space-y-8 bg-[#120901] px-6 py-8 md:px-12 md:py-10">
        <header className="space-y-3 pb-3">
          <h1 className="text-5xl font-bold tracking-tight md:text-6xl">Participate in Hackathons</h1>
          <p className="max-w-4xl text-base md:text-xl">
            Some of the best upcoming hackathons across global platforms for builders who love shipping in public.
          </p>
        </header>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#f2a043] border-t-white"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <span className="text-red-500">⚠</span>
              <p className="ml-3 text-sm text-red-200">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && data && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-6">
              <div>
                {leftColumnHackathons.map((hackathon, index) => {
                  const absoluteIndex = startIdx + index + 1;
                  const hoverState = hoverStates[hackathon.id];

                  return (
                    <a
                      key={hackathon.id}
                      href={hackathon.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={(event) => handleCardMouseEnter(hackathon.id, event)}
                      onMouseLeave={(event) => handleCardMouseLeave(hackathon.id, event)}
                      className={`hackathon-card hackathon-list-item group transition-colors duration-300 hover:text-black ${
                        hoverState?.direction === "from-bottom"
                          ? "hover-from-bottom"
                          : "hover-from-top"
                      } ${hoverState?.active ? "is-active" : ""}`}
                    >
                      <div className="hackathon-thumb">
                        {hackathon.bannerUrl ? (
                          <img
                            src={hackathon.bannerUrl}
                            alt={hackathon.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[#101010]">
                            <Trophy className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <span className="hackathon-rank">{formatCardNumber(absoluteIndex)}</span>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-2xl font-semibold leading-tight">
                          {hackathon.title}
                        </h3>
                        <p className="mt-1 truncate text-sm tracking-[0.03em]">
                          {hackathon.dateLabel || "Dates TBA"} • {hackathon.location || "Online"} • Source: {hackathon.sourceName || "Unknown"}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>

              <div>
                {rightColumnHackathons.map((hackathon, index) => {
                  const absoluteIndex = startIdx + midpoint + index + 1;
                  const hoverState = hoverStates[hackathon.id];

                  return (
                    <a
                      key={hackathon.id}
                      href={hackathon.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={(event) => handleCardMouseEnter(hackathon.id, event)}
                      onMouseLeave={(event) => handleCardMouseLeave(hackathon.id, event)}
                      className={`hackathon-card hackathon-list-item group transition-colors duration-300 hover:text-black ${
                        hoverState?.direction === "from-bottom"
                          ? "hover-from-bottom"
                          : "hover-from-top"
                      } ${hoverState?.active ? "is-active" : ""}`}
                    >
                      <div className="hackathon-thumb">
                        {hackathon.bannerUrl ? (
                          <img
                            src={hackathon.bannerUrl}
                            alt={hackathon.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[#101010]">
                            <Trophy className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <span className="hackathon-rank">{formatCardNumber(absoluteIndex)}</span>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-2xl font-semibold leading-tight">
                          {hackathon.title}
                        </h3>
                        <p className="mt-1 truncate text-sm tracking-[0.03em]">
                          {hackathon.dateLabel || "Dates TBA"} • {hackathon.location || "Online"} • Source: {hackathon.sourceName || "Unknown"}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {uniqueHackathons.length > 0 && (
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="text-sm md:text-base">
                  Showing {startIdx + 1}–{Math.min(endIdx, uniqueHackathons.length)} of {uniqueHackathons.length} events
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 p-2 text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`grid place-items-center h-8 w-8 rounded-full border text-sm font-medium cursor-pointer transition-colors ${
                          currentPage === page
                            ? "text-[#000] bg-[#f2a043] border-[#f2a043]"
                            : "text-gray-400 border-gray-400"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 p-2 text-sm text-[#f2a043] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HackathonsPage;