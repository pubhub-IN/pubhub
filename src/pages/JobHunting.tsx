import { useEffect, useState } from "react";
import { useAuth } from "../lib/useAuth";

interface Job {
  id: string;
  title: string;
  company_name: string;
  candidate_required_location: string;
  url: string;
  publication_date: string;
  job_type: string;
  salary: string;
  experience: string;
  remoteType: string;
  description: string;
  logo?: string;
}

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Freelance", "Remote"];

export default function JobHunting() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    techStack: "",
    location: "",
    jobType: "",
  });

  // Fetch jobs from backend
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.techStack) params.append("techStack", filters.techStack);
      if (filters.location) params.append("location", filters.location);
      if (filters.jobType) params.append("jobType", filters.jobType);
      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (e: any) {
      setError(e.message || "Unknown error");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.techStack, filters.location, filters.jobType]);

  // Handle filter changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Job Hunting</h1>
      <form
        className="flex flex-wrap gap-4 mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
        onSubmit={e => { e.preventDefault(); fetchJobs(); }}
      >
        <input
          type="text"
          name="techStack"
          value={filters.techStack}
          onChange={handleChange}
          placeholder="Tech Stack (e.g. React, Python)"
          className="flex-1 min-w-[180px] px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
        />
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="Location (e.g. Remote, US, Europe)"
          className="flex-1 min-w-[140px] px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
        />
        <select
          name="jobType"
          value={filters.jobType}
          onChange={handleChange}
          className="flex-1 min-w-[120px] px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
        >
          <option value="">All Types</option>
          {JOB_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <button
          type="submit"
          className="px-5 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition"
        >
          Search
        </button>
      </form>

      {loading && (
        <div className="text-center py-10 text-lg text-gray-500 dark:text-gray-400">Loading jobs...</div>
      )}
      {error && (
        <div className="text-center py-10 text-red-500">{error}</div>
      )}
      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">No jobs found. Try adjusting your filters.</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {jobs.map(job => (
          <div
            key={job.id}
            className="relative bg-white/90 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-5 flex flex-col min-h-[320px] transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.025] hover:shadow-2xl group overflow-hidden"
          >
            {/* Decorative gradient blob */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-tr from-green-400/30 via-purple-400/20 to-blue-400/20 rounded-full blur-2xl opacity-60 pointer-events-none z-0" />
            {/* Company avatar or logo */}
            <div className="flex items-center gap-3 mb-3 z-10">
              {job.logo ? (
                <img
                  src={job.logo}
                  alt={job.company_name + ' logo'}
                  className="w-12 h-12 rounded-full object-cover border-2 border-orange-300 shadow-md bg-white"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 via-pink-400 to-yellow-400 flex items-center justify-center text-white text-xl font-bold shadow-md">
                  {job.company_name?.[0] || "?"}
                </div>
              )}
              <div>
                <div className="text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{job.company_name}</div>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                  <svg className="w-4 h-4 mr-0.5 inline-block text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><circle cx="12" cy="11" r="3" /></svg>
                  {job.candidate_required_location}
                </div>
              </div>
            </div>
            {/* Job title */}
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2 line-clamp-2 z-10">
              {job.title}
            </h2>
            {/* Details row with icons */}
            <div className="flex flex-wrap gap-2 mb-3 z-10 text-xs font-medium">
              {job.job_type && (
                <span className="flex items-center gap-1 px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 0a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2m-6 0h6" /></svg>
                  {job.job_type}
                </span>
              )}
              {job.remoteType && (
                <span className="flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v4a1 1 0 001 1h3m10-5v4a1 1 0 01-1 1h-3m-4 4h6" /></svg>
                  Remote
                </span>
              )}
              {job.salary && (
                <span className="flex items-center gap-1 px-2 py-1 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 8v8" /></svg>
                  {job.salary}
                </span>
              )}
              {job.experience && (
                <span className="flex items-center gap-1 px-2 py-1 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" /></svg>
                  {job.experience}
                </span>
              )}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
            {/* Date posted */}
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2 z-10">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Posted {new Date(job.publication_date).toLocaleDateString()}
            </div>
            {/* Description */}
            <div className="relative mb-4 z-10">
              <div className="bg-gray-100/80 dark:bg-gray-800/70 rounded-lg px-4 py-3 text-[15px] leading-relaxed text-gray-800 dark:text-gray-100 font-normal max-h-24 overflow-hidden" style={{ position: 'relative' }}>
                {(() => {
                  const cleanDesc = job.description.replace(/<[^>]+>/g, "");
                  const isTruncated = cleanDesc.length > 260;
                  return (
                    <>
                      {cleanDesc.slice(0, 260)}{isTruncated ? '...' : ''}
                      {isTruncated && (
                        <>
                          <div className="absolute left-0 bottom-0 w-full h-8 bg-gradient-to-t from-gray-100/90 dark:from-gray-800/90 to-transparent pointer-events-none rounded-b-lg" />
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-2 right-3 flex items-center gap-1 text-xs font-semibold text-primary hover:underline bg-white/90 dark:bg-gray-900/90 px-2 py-0.5 rounded shadow-sm z-20"
                            style={{ pointerEvents: 'auto' }}
                          >
                            Read more
                            <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                          </a>
                        </>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
            {/* Apply button */}
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-block px-6 py-2 font-bold rounded-lg shadow-lg transition-transform duration-200 z-10 text-center border-2 border-primary/20 bg-primary text-primary-foreground dark:text-primary-foreground hover:scale-105 hover:bg-primary/80"
            >
              View & Apply
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}