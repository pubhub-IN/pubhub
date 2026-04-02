import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/useAuth";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const randomCode = useMemo(() => {
    const segment = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `NF-${segment}`;
  }, []);

  return (
    <main className="notfound-root flex min-h-screen w-full items-center justify-center px-4 py-8 sm:px-8">
      <div className="notfound-grid" aria-hidden="true" />
      <div className="notfound-glow notfound-glow-left" aria-hidden="true" />
      <div className="notfound-glow notfound-glow-right" aria-hidden="true" />

      <section className="notfound-card w-full max-w-3xl overflow-hidden rounded-2xl">
        <div className="notfound-header flex items-center justify-between border-b px-4 py-3 sm:px-6">
          <p className="text-xs tracking-[0.18em]">PUBHUB NAVIGATOR</p>
          <span className="notfound-chip">{randomCode}</span>
        </div>

        <div className="p-6 sm:p-10">
          <p className="notfound-kicker">Route not found</p>
          <h1 className="notfound-title mt-2">404</h1>
          <p className="notfound-copy mt-4 max-w-xl">
            The page you requested drifted outside the mapped developer lanes.
            The route may be outdated, removed, or typed incorrectly.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate(user ? "/dashboard" : "/")}
              className="notfound-btn notfound-btn-primary"
            >
              {user ? "Go to dashboard" : "Go to home"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="notfound-btn notfound-btn-ghost"
            >
              Go back
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .notfound-root {
          --bg-ink: #09070c;
          --bg-mid: #121022;
          --line: rgba(140, 194, 255, 0.18);
          --edge: rgba(140, 194, 255, 0.35);
          --text-main: #f4f7ff;
          --text-muted: #a9b6d6;
          --accent: #75d6ff;
          --accent-2: #a0ffcf;
          --panel: rgba(18, 16, 34, 0.72);

          position: relative;
          overflow: hidden;
          background:
            radial-gradient(1200px 600px at 15% 10%, #1b2c52 0%, transparent 55%),
            radial-gradient(800px 500px at 90% 80%, #19413d 0%, transparent 60%),
            linear-gradient(145deg, var(--bg-ink) 0%, var(--bg-mid) 55%, #090a13 100%);
          color: var(--text-main);
          font-family: "Space Mono", "JetBrains Mono", "Fira Code", monospace;
        }

        .notfound-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(var(--line) 1px, transparent 1px),
            linear-gradient(90deg, var(--line) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(circle at center, black 20%, transparent 100%);
          opacity: 0.35;
          pointer-events: none;
          animation: gridShift 18s linear infinite;
        }

        .notfound-glow {
          position: absolute;
          width: 32rem;
          height: 32rem;
          filter: blur(80px);
          border-radius: 9999px;
          opacity: 0.3;
          pointer-events: none;
        }

        .notfound-glow-left {
          left: -10rem;
          top: -12rem;
          background: #2d8cff;
          animation: floatLeft 10s ease-in-out infinite;
        }

        .notfound-glow-right {
          right: -8rem;
          bottom: -16rem;
          background: #26d29a;
          animation: floatRight 12s ease-in-out infinite;
        }

        .notfound-card {
          position: relative;
          z-index: 2;
          background: var(--panel);
          backdrop-filter: blur(8px);
          border: 1px solid var(--edge);
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.45),
            inset 0 0 0 1px rgba(255, 255, 255, 0.04);
          animation: cardIn 520ms cubic-bezier(0.19, 1, 0.22, 1);
        }

        .notfound-header {
          border-color: rgba(140, 194, 255, 0.24);
          color: var(--text-muted);
        }

        .notfound-chip {
          border: 1px solid rgba(160, 255, 207, 0.35);
          background: rgba(160, 255, 207, 0.08);
          color: var(--accent-2);
          padding: 0.22rem 0.55rem;
          border-radius: 9999px;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
        }

        .notfound-kicker {
          color: var(--accent-2);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-size: 0.72rem;
        }

        .notfound-title {
          font-size: clamp(3.8rem, 16vw, 8rem);
          line-height: 0.95;
          letter-spacing: -0.04em;
          text-shadow: 0 0 22px rgba(117, 214, 255, 0.28);
        }

        .notfound-copy {
          color: var(--text-muted);
          font-size: 0.98rem;
          line-height: 1.7;
        }

        .notfound-btn {
          border-radius: 9999px;
          font-size: 0.86rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.72rem 1.15rem;
          transition: transform 140ms ease, box-shadow 180ms ease, background-color 180ms ease;
        }

        .notfound-btn:hover {
          transform: translateY(-1px);
        }

        .notfound-btn-primary {
          background: linear-gradient(95deg, var(--accent), #6ce3cc);
          color: #04151d;
          box-shadow: 0 10px 28px rgba(117, 214, 255, 0.32);
        }

        .notfound-btn-primary:hover {
          box-shadow: 0 14px 30px rgba(117, 214, 255, 0.4);
        }

        .notfound-btn-ghost {
          border: 1px solid rgba(169, 182, 214, 0.35);
          color: var(--text-main);
          background: rgba(9, 7, 12, 0.35);
        }

        .notfound-btn-ghost:hover {
          background: rgba(9, 7, 12, 0.55);
          border-color: rgba(169, 182, 214, 0.55);
        }

        @keyframes cardIn {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes gridShift {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(32px, 32px, 0);
          }
        }

        @keyframes floatLeft {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(24px, 22px);
          }
        }

        @keyframes floatRight {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-26px, -18px);
          }
        }
      `}</style>
    </main>
  );
}
