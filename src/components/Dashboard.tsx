import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService, type AuthUser } from "../lib/auth-jwt";
import {
  LuPencil,
  LuWifi,
  LuWifiHigh,
  LuWifiLow,
  LuWifiOff,
  LuWifiZero,
} from "react-icons/lu";
import {
  NetworkSpeedService,
  type NetworkQuality,
  type NetworkStatus,
} from "../lib/networkSpeedService";
import "../styles/dashboard-terminal.css";

interface DashboardProps {
  user: AuthUser;
}

type ConnectionSeverity = "OFFLINE" | "VERY LOW" | "LOW" | "MEDIUM" | "HIGH";

type SignalLevel = ConnectionSeverity;

function toShortName(name: string | undefined, username: string) {
  if (name && name.trim().length > 0) {
    return name.toUpperCase();
  }
  return username.toUpperCase();
}

const NETWORK_TEST_FILE_URL = "/shut-down.gif";
const NETWORK_TEST_FILE_SIZE_BYTES = 3489185;

function createFallbackStatus(): NetworkStatus {
  return {
    speedMbps: 0,
    latencyMs: 0,
    quality: typeof navigator !== "undefined" && !navigator.onLine ? "offline" : "slow",
    effectiveType: undefined,
  };
}

function toSignalLevel(quality: NetworkQuality): SignalLevel {
  if (quality === "offline") return "OFFLINE";
  if (quality === "slow") return "VERY LOW";
  if (quality === "moderate") return "MEDIUM";
  return "HIGH";
}

function getSignalIcon(level: SignalLevel) {
  switch (level) {
    case "OFFLINE":
      return LuWifiOff;
    case "VERY LOW":
      return LuWifiZero;
    case "LOW":
      return LuWifiLow;
    case "MEDIUM":
      return LuWifiHigh;
    case "HIGH":
    default:
      return LuWifi;
  }
}

function getSignalTone(level: SignalLevel) {
  switch (level) {
    case "OFFLINE":
      return "#7a7a7a";
    case "VERY LOW":
      return "#ff6b6b";
    case "LOW":
      return "#ffb84d";
    case "MEDIUM":
      return "#d8ff5a";
    case "HIGH":
    default:
      return "#35f160";
  }
}

function formatMbps(speedMbps: number) {
  return `${speedMbps.toFixed(2)} MBPS`;
}

function formatLatency(latencyMs: number) {
  return `${latencyMs.toFixed(2)} MS`;
}

function getConnectionTypeLabel(network: NetworkStatus) {
  return network.effectiveType
    ? network.effectiveType.toUpperCase()
    : network.quality.toUpperCase();
}

function formatMetricValue(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? String(value) : "NA";
}

export default function Dashboard({ user }: DashboardProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState<AuthUser>(user);
  const [activeDays, setActiveDays] = useState<number | null>(null);
  const [network, setNetwork] = useState<NetworkStatus>(createFallbackStatus);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState("");

  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!location.state?.refreshUser) {
      return;
    }

    const hydrate = async () => {
      try {
        const freshUser = await authService.getCurrentUser();
        if (freshUser) {
          setCurrentUser(freshUser);
        }
      } catch (error) {
        console.error("Failed to refresh user in dashboard:", error);
      } finally {
        navigate(location.pathname, { replace: true, state: {} });
      }
    };

    void hydrate();
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    const fetchActiveDays = async () => {
      try {
        const response = (await authService.get("/api/user/active-days")) as {
          activeDays?: number;
        };
        setActiveDays(
          typeof response.activeDays === "number" && Number.isFinite(response.activeDays)
            ? response.activeDays
            : null
        );
      } catch (error) {
        console.error("Failed to fetch active days:", error);
        setActiveDays(null);
      }
    };

    void fetchActiveDays();
  }, []);

  useEffect(() => {
    const networkService = new NetworkSpeedService(
      NETWORK_TEST_FILE_URL,
      NETWORK_TEST_FILE_SIZE_BYTES
    );

    const stopMonitoring = networkService.monitor(30000, (status) => {
      setNetwork(status);
    });

    const refreshImmediately = () => {
      void networkService.measure().then((status) => {
        setNetwork(status);
      });
    };

    window.addEventListener("online", refreshImmediately);
    window.addEventListener("offline", refreshImmediately);

    return () => {
      window.removeEventListener("online", refreshImmediately);
      window.removeEventListener("offline", refreshImmediately);
      stopMonitoring();
    };
  }, []);

  const resolvedUser = currentUser || user;
  const languageEntries = Object.keys(resolvedUser.languages || {});
  const languageCount = languageEntries.length > 0 ? languageEntries.length : null;
  const publicRepoCount =
    typeof resolvedUser.total_public_repos === "number" &&
    Number.isFinite(resolvedUser.total_public_repos)
      ? resolvedUser.total_public_repos
      : null;
  const onboardingTechnologies = (resolvedUser.technologies || []).filter(Boolean);
  const displayName =
    resolvedUser.name && resolvedUser.name.trim().length > 0
      ? resolvedUser.name
      : resolvedUser.github_username || "NA";
  const displayProfession =
    resolvedUser.profession && resolvedUser.profession.trim().length > 0
      ? resolvedUser.profession.toUpperCase()
      : "NA";

  const handleEditOnboardingTechnologies = () => {
    navigate("/onboarding", {
      state: {
        editMode: true,
        profession: resolvedUser.profession || "",
        technologies: onboardingTechnologies,
      },
    });
  };

  const signalLevel = toSignalLevel(network.quality);
  const signalIcon = getSignalIcon(signalLevel);
  const SignalIcon = signalIcon;
  const signalTone = getSignalTone(signalLevel);
  const networkLabel = getConnectionTypeLabel(network);

  const openFilePicker = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setAvatarError("Please choose an image file.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const previewValue = typeof reader.result === "string" ? reader.result : "";
      if (!previewValue) {
        setAvatarError("Failed to preview image.");
        return;
      }

      setAvatarPreviewUrl(previewValue);
      setAvatarError("");
    };

    reader.onerror = () => {
      setAvatarError("Failed to preview image.");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const closeAvatarPreview = () => {
    setAvatarPreviewUrl(null);
    setAvatarError("");
  };

  const confirmAvatarPreview = () => {
    if (!avatarPreviewUrl) {
      return;
    }

    setCurrentUser((prev) => ({
      ...prev,
      avatar_url: avatarPreviewUrl,
    }));
    setAvatarPreviewUrl(null);
    setAvatarError("");
  };

  return (
    <div className="terminal-dashboard">
      <section className="terminal-frame" aria-label="Police terminal dashboard">
        <span className="main-bottom-right-triangle"></span>
        <span className="bottom-half-triangle"></span>
        <span className="bottom--triangle"></span>
        <span className="bottom-half-left-triangle"></span>
        <span className="bottom-half-right-triangle"></span>
        <span className="top-half-triangle"></span>
        <span className="top-half-left-triangle"></span>
        <span className="top-half-right-triangle"></span>
        <span className="terminal-label font-thin top-[10px] left-[10px]">MINGW64:/C/Users/Working-One/Dashboard</span>
        <span
          className="terminal-label signal-indicator bottom-[8px] left-[30px]"
          style={{ color: signalTone }}
          aria-label={`Connection ${networkLabel}, quality ${network.quality}, speed ${formatMbps(network.speedMbps)}, latency ${formatLatency(network.latencyMs)}`}
          title={`Connection ${networkLabel}, quality ${network.quality}, speed ${formatMbps(network.speedMbps)}, latency ${formatLatency(network.latencyMs)}`}
        >
          <SignalIcon className="signal-icon" aria-hidden="true" focusable="false" />
          <span className="signal-type">{networkLabel}</span>
          <span className="signal-speed">
            {`${formatMbps(network.speedMbps)} / ${formatLatency(network.latencyMs)}`}
          </span>
        </span>

        <div className="terminal-grid h-full">
          <section className="left-panel left-panel-empty" aria-label="Empty left panel">
            
          </section>

          <aside className="right-panel">
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarFileChange}
              className="sr-only"
              aria-hidden="true"
              tabIndex={-1}
            />

            <div className="terminal-box officer-box bg-[#120901]">
              <div className="portrait">
                {resolvedUser.avatar_url ? (
                  <img
                    src={resolvedUser.avatar_url}
                    alt={`${resolvedUser.github_username} portrait`}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="portrait-fallback">
                    {resolvedUser.github_username.slice(0, 1).toUpperCase()}
                  </div>
                )}

                <button
                  type="button"
                  className="portrait-edit-button"
                  onClick={openFilePicker}
                  aria-label="Edit profile image"
                  title="Edit image"
                >
                  <LuPencil aria-hidden="true" focusable="false" className="h-8 w-8"/>
                </button>
              </div>

              <div className="officer-meta uppercase">
                <span className="officer-top-border"></span>
                <span className="officer-bottom-border"></span>
                <p className="flex flex-col gap-1 font-medium">
                  Profession: <br /><span className="text-white font-thin">{displayProfession}</span>
                </p>
                <p className="font-medium">
                  name: <span className="text-white font-thin">{toShortName(displayName, resolvedUser.github_username || "NA")}</span>
                </p>
                <p className="font-medium">
                  streak: <span className="text-white font-thin">{formatMetricValue(activeDays)}</span>
                </p>
                <p className="font-medium">
                  friends: <span className="text-white font-thin">NA</span>
                </p>
              </div>
            </div>

            {avatarPreviewUrl && (
              <div className="avatar-preview-overlay" role="dialog" aria-modal="true" aria-label="Profile image preview dialog">
                <div className="avatar-preview-modal">
                  <h3 className="avatar-preview-title">Preview Image</h3>

                  <div className="avatar-preview-frame">
                    <img src={avatarPreviewUrl} alt="Selected profile preview" className="avatar-preview-image" />
                  </div>

                  {avatarError && <p className="avatar-preview-error">{avatarError}</p>}

                  <div className="avatar-preview-actions">
                    <button
                      type="button"
                      className="avatar-preview-btn"
                      onClick={openFilePicker}
                    >
                      Choose Other
                    </button>
                    <button
                      type="button"
                      className="avatar-preview-btn avatar-preview-btn-confirm"
                      onClick={confirmAvatarPreview}
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      className="avatar-preview-btn"
                      onClick={closeAvatarPreview}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="terminal-box bio-box bg-[#120901]">
                <span className="terminal-box-top-border"></span>
                <span className="terminal-box-bottom-border"></span>
                <p className="text-xl font-medium text-white">
                <span className="text-white font-thin uppercase">total Public Repositories found: <span className="inline-flex justify-center items-center py-[2px] px-2 min-w-[40px] text-sm font-bold rounded-sm bg-[#f2a04373] text-white">{formatMetricValue(publicRepoCount)}</span></span>
              </p>
              <p className="text-xl font-medium text-white">
                <span className="text-white font-thin uppercase">Languages you've worked based on your repositories: <span className="inline-flex justify-center items-center py-[2px] px-2 min-w-[40px] text-sm font-bold rounded-sm bg-[#f2a04373] text-white">{formatMetricValue(languageCount)}</span></span>
              </p>

                <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xl font-medium text-white">ONBOARDING TECHNOLOGIES SELECTED:</p>
              </div>

              {onboardingTechnologies.length > 0 ? (
                <ul className="text-lg font-thin text-white capitalize flex flex-wrap gap-2 mt-2" aria-label="Onboarding technologies selected">
                  {onboardingTechnologies.map((technology) => (
                    <li key={technology} className="text-sm bg-[#f2a04373] py-1 px-3 rounded-full">
                      {technology}
                    </li>
                  ))}
                  <button
                  type="button"
                  onClick={handleEditOnboardingTechnologies}
                  className="rounded border border-[#f2a04373] hover:bg-[#f2a04373] hover:rounded-full hover:text-white px-3 py-1 text-xs font-medium tracking-[0.08em] text-[#f2a043] transition-colors cursor-pointer"
                >
                  <LuPencil aria-hidden="true" focusable="false" className="text-white"/>
                </button>
                </ul>
              ) : (
                <p className="bio-copy">- NONE SELECTED</p>
              )}
              
                </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
