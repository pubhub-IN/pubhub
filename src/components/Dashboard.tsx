import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService, type AuthUser } from "../lib/auth-jwt";
import { LuWifi, LuWifiHigh, LuWifiLow, LuWifiOff, LuWifiZero } from "react-icons/lu";
import "../styles/dashboard-terminal.css";

interface DashboardProps {
  user: AuthUser;
}

type ConnectionSeverity = "OFFLINE" | "VERY LOW" | "LOW" | "MEDIUM" | "HIGH";

type NetworkSnapshot = {
  supported: boolean;
  online: boolean;
  effectiveType: string | null;
  downlink: number | null;
  rtt: number | null;
};

type SignalLevel = ConnectionSeverity;

type NetworkInfoLike = {
  downlink?: number;
  effectiveType?: string;
  rtt?: number;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

function toShortName(name: string | undefined, username: string) {
  if (name && name.trim().length > 0) {
    return name.toUpperCase();
  }
  return username.toUpperCase();
}

function createFallbackSnapshot(): NetworkSnapshot {
  return {
    supported: false,
    online: typeof navigator !== "undefined" ? navigator.onLine : true,
    effectiveType: null,
    downlink: null,
    rtt: null,
  };
}

function createInitialSnapshot(): NetworkSnapshot {
  if (typeof navigator === "undefined") {
    return createFallbackSnapshot();
  }

  const nav = navigator as Navigator & {
    connection?: NetworkInfoLike;
    mozConnection?: NetworkInfoLike;
    webkitConnection?: NetworkInfoLike;
  };
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

  return {
    supported: Boolean(connection),
    online: navigator.onLine,
    effectiveType: connection?.effectiveType ?? null,
    downlink: typeof connection?.downlink === "number" ? connection.downlink : null,
    rtt: typeof connection?.rtt === "number" ? connection.rtt : null,
  };
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

function getSignalLevel(snapshot: NetworkSnapshot): SignalLevel {
  if (!snapshot.online) {
    return "OFFLINE";
  }

  const effectiveType = snapshot.effectiveType?.toLowerCase() ?? null;
  if (!snapshot.supported) {
    return "OFFLINE";
  }
  if (effectiveType === "slow-2g" || effectiveType === "2g") {
    return "VERY LOW";
  }
  if (effectiveType === "3g") {
    return "LOW";
  }
  if (effectiveType === "4g") {
    return "HIGH";
  }
  if (typeof snapshot.downlink === "number") {
    if (snapshot.downlink < 0.7) return "VERY LOW";
    if (snapshot.downlink < 2) return "LOW";
    if (snapshot.downlink < 8) return "MEDIUM";
    return "HIGH";
  }

  return "MEDIUM";
}

function formatMbps(downlink: number | null) {
  return typeof downlink === "number" ? `${downlink.toFixed(1)} MBPS` : "-- MBPS";
}

function formatRtt(rtt: number | null) {
  return typeof rtt === "number" ? `${Math.round(rtt)} MS` : "-- MS";
}

function getConnectionTypeLabel(snapshot: NetworkSnapshot) {
  if (!snapshot.supported) {
    return "NO INFO";
  }

  return snapshot.effectiveType ? snapshot.effectiveType.toUpperCase() : "UNKNOWN";
}

export default function Dashboard({ user }: DashboardProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState<AuthUser>(user);
  const [activeDays, setActiveDays] = useState(0);
  const [network, setNetwork] = useState<NetworkSnapshot>(createInitialSnapshot);

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
          activeDays: number;
        };
        setActiveDays(Number(response.activeDays || 0));
      } catch (error) {
        console.error("Failed to fetch active days:", error);
      }
    };

    void fetchActiveDays();
  }, []);

  useEffect(() => {
    const nav = navigator as Navigator & {
      connection?: NetworkInfoLike;
      mozConnection?: NetworkInfoLike;
      webkitConnection?: NetworkInfoLike;
    };

    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

    const readNetworkSnapshot = (): NetworkSnapshot => {
      if (!connection) {
        return {
          supported: false,
          online: navigator.onLine,
          effectiveType: null,
          downlink: null,
          rtt: null,
        };
      }

      return {
        supported: true,
        online: navigator.onLine,
        effectiveType: connection.effectiveType ?? null,
        downlink: typeof connection.downlink === "number" ? connection.downlink : null,
        rtt: typeof connection.rtt === "number" ? connection.rtt : null,
      };
    };

    const refreshNetwork = () => {
      setNetwork(readNetworkSnapshot());
    };

    refreshNetwork();
    window.addEventListener("online", refreshNetwork);
    window.addEventListener("offline", refreshNetwork);
    connection?.addEventListener?.("change", refreshNetwork);
    const intervalId = window.setInterval(refreshNetwork, 3000);

    return () => {
      window.removeEventListener("online", refreshNetwork);
      window.removeEventListener("offline", refreshNetwork);
      connection?.removeEventListener?.("change", refreshNetwork);
      window.clearInterval(intervalId);
    };
  }, []);

  const resolvedUser = currentUser || user;
  const languageCount = Object.keys(resolvedUser.languages || {}).length;
  const onboardingTechnologies = (resolvedUser.technologies || []).filter(Boolean);

  const signalLevel = getSignalLevel(network);
  const signalIcon = getSignalIcon(signalLevel);
  const SignalIcon = signalIcon;
  const signalTone = getSignalTone(signalLevel);
  const networkLabel = getConnectionTypeLabel(network);

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
          aria-label={`Connection ${networkLabel}, downlink ${formatMbps(network.downlink)}, RTT ${formatRtt(network.rtt)}`}
          title={`Connection ${networkLabel}, downlink ${formatMbps(network.downlink)}, RTT ${formatRtt(network.rtt)}`}
        >
          <SignalIcon className="signal-icon" aria-hidden="true" focusable="false" />
          <span className="signal-type">{networkLabel}</span>
          <span className="signal-speed">
            {network.supported ? `${formatMbps(network.downlink)} / ${formatRtt(network.rtt)}` : "NO NETWORK INFO"}
          </span>
        </span>
        <span className="terminal-label bottom-right">PROPERTY OF BALTIMORE POLICE DEPARTMENT</span>

        <div className="terminal-grid h-full">
          <section className="left-panel left-panel-empty" aria-label="Empty left panel">
            
          </section>

          <aside className="right-panel">

            <div className="terminal-box officer-box">
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
              </div>

              <div className="officer-meta uppercase">
                <span className="officer-top-border"></span>
                <span className="officer-bottom-border"></span>
                <p className="flex flex-col gap-1 font-medium">
                  Profession: <br /><span className="text-white font-thin">{resolvedUser.profession?.toUpperCase() || "SOFTWARE OPERATOR"}</span>
                </p>
                <p className="font-medium">
                  name: <span className="text-white font-thin">{toShortName(resolvedUser.name, resolvedUser.github_username)}</span>
                </p>
                <p className="font-medium">
                  streak: <span className="text-white font-thin">{activeDays}</span>
                </p>
                <p className="font-medium">
                  friends: <span className="text-white font-thin">0</span>
                </p>
              </div>
            </div>

            <div className="terminal-box bio-box">
                <span className="terminal-box-top-border"></span>
                <span className="terminal-box-bottom-border"></span>
                <p className="text-xl font-medium text-white">
                <span className="text-white font-thin uppercase">total Public Repositories found: <span className="py-1 px-2 rounded-sm bg-[#f2a04373] text-white">{resolvedUser.total_public_repos || 0}</span></span>
              </p>
              <p className="text-xl font-medium text-white">
                <span className="text-white font-thin uppercase">Languages you've worked based on your repositories: <span className="py-1 px-2 rounded-sm bg-[#f2a04373] text-white">{languageCount}</span></span>
              </p>

                <div>
              <p className="text-xl font-medium text-white">ONBOARDING TECHNOLOGIES SELECTED:</p>

              {onboardingTechnologies.length > 0 ? (
                <ul className="text-lg font-thin text-white capitalize flex flex-wrap gap-2 mt-2" aria-label="Onboarding technologies selected">
                  {onboardingTechnologies.map((technology) => (
                    <li key={technology} className="text-sm bg-[#f2a04373] py-1 px-3 rounded-full">
                      {technology}
                    </li>
                  ))}
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
