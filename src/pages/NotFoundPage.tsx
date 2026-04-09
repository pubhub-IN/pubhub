import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/useAuth";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const randomCode = useMemo(() => {
    const segment = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `NF-${segment}`;
  }, []);

  useEffect(() => {
    const navigationEntry =
      performance.getEntriesByType("navigation")[0] as
        | (PerformanceNavigationTiming & { responseStatus?: number })
        | undefined;

    if (typeof navigationEntry?.responseStatus === "number") {
      setStatusCode(navigationEntry.responseStatus);
      return;
    }

    fetch(window.location.href, { method: "HEAD", cache: "no-store" })
      .then((response) => {
        setStatusCode(response.status);
      })
      .catch(() => {
        setStatusCode(null);
      });
  }, [location.pathname]);

  const displayStatus = statusCode ?? 404;
  const avatarUrl = user?.avatar_url?.trim() || "";

  return (
    <main className="notfound-root flex min-h-screen w-full items-center justify-center p-4 sm:p-8">
      <section className="notfound-shell w-full max-w-6xl rounded-[24px] p-4 sm:p-6 lg:p-7">
        <div className="notfound-topbar flex items-center justify-between">
          <img
            src="/android-chrome-512x512.png"
            alt="PubHub logo"
            className="notfound-logo"
          />

          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="GitHub avatar"
              className="notfound-avatar"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="notfound-avatar-fallback" aria-label="Default user avatar">
              W
            </div>
          )}
        </div>

        <div className="notfound-body grid items-center gap-8 py-8 sm:gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-12">
          <div className="notfound-image-wrap">
            <img
              src="/404-img.png"
              alt="404"
              className="notfound-image"
            />
          </div>

          <div className="notfound-copy-panel flex flex-col justify-center">
            <h1 className="notfound-title">{displayStatus}</h1>
            <p className="notfound-copy mt-3 max-w-md">
              The page you requested drifted outside the mapped terminal lanes.
              It may have moved, been removed, or never existed in this build.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="notfound-btn notfound-btn-primary"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                <span>Go home</span>
              </button>
            </div>

            <p className="notfound-meta mt-5">
              route: {location.pathname} | ref: {randomCode}
            </p>
          </div>
        </div>
      </section>

      <style>{`
        .notfound-root {
          background: #ffffff;
          color: #16181d;
          font-family: "Poppins", sans-serif;
        }

        .notfound-shell {
          background: #f8f8f8;
          border: 1px solid #ececec;
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.08);
        }

        .notfound-logo {
          height: 26px;
          width: 26px;
          object-fit: contain;
        }

        .notfound-avatar,
        .notfound-avatar-fallback {
          height: 38px;
          width: 38px;
          border-radius: 9999px;
        }

        .notfound-avatar {
          object-fit: cover;
          border: 1px solid #ececec;
        }

        .notfound-avatar-fallback {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #f2c94c;
          color: #1f1f1f;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .notfound-image-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notfound-title {
          font-size: clamp(2.9rem, 10vw, 5.2rem);
          line-height: 1;
          letter-spacing: -0.03em;
          font-weight: 700;
          color: #14161a;
        }

        .notfound-copy {
          color: #6b7280;
          font-size: 1.7rem;
          line-height: 1.35;
          font-weight: 500;
        }

        .notfound-image {
          display: block;
          width: auto;
          height: 80%;
          object-fit: contain;
        }

        .notfound-btn {
          border-radius: 9999px;
          font-size: 0.92rem;
          padding: 0.72rem 1.2rem;
          transition: transform 140ms ease, background-color 180ms ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
        }

        .notfound-btn:hover {
          transform: translateY(-1px);
        }

        .notfound-btn-primary {
          background: #16181d;
          color: #ffffff;
        }

        .notfound-btn-primary:hover {
          background: #090a0d;
        }

        .notfound-meta {
          color: #9ca3af;
          font-size: 0.78rem;
          letter-spacing: 0.02em;
          word-break: break-all;
        }

        @media (max-width: 1023px) {
          .notfound-image-wrap {
            order: -1;
          }

          .notfound-copy {
            font-size: 1.15rem;
          }
        }
      `}</style>
    </main>
  );
}
