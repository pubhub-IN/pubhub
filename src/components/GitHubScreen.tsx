import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ShutdownScreen from "./ShutdownScreen";
import { useAuth } from "../lib/useAuth";
import { authService } from "../lib/auth-jwt";
import { buildApiUrl, API_ENDPOINTS } from "../config/api";
import "../styles/retro-shared.css";

type TerminalEntry = {
  id: number;
  text: string;
  variant?: "default" | "boxed";
};

type ShutdownPhase = "idle" | "logging" | "animating" | "sleeping";

const SHUTDOWN_STATE_KEY = "working-one-shutdown-state";
const PENDING_ONBOARDING_KEY = "pending_onboarding_profile";

const PROMPT_USER = "guest";
const PROMPT_HOST = "working-one";

const COMMAND_HELP: string[] = [
  "Available commands:",
  "  help            Show all commands",
  "  status          Show setup progress",
  "  login           Connect with Github OAuth",
  "  skip            Skip Github authentication",
  "  finish          Alias for skip",
  "  clear           Clear terminal output",
  "  exit            Shutdown WORKING-ONE",
];

function getPromptPrefix() {
  return `${PROMPT_USER}@${PROMPT_HOST}:~$`;
}

function getIntroLines(profession: string, technologyCount: number) {
  return [
    "github setup shell v1.0.0",
    "loading profile context...done",
    `selected profession: ${profession || "not provided"}`,
    `selected technologies: ${technologyCount}`,
    "",
    "Type 'login' and press Enter to proceed with Github OAuth.",
    "Type 'skip' and press Enter to continue without Github authentication.",
    "Type 'help' to list all supported commands.",
  ];
}

export default function GitHubScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const professionFromState = location.state?.profession as string | undefined;
  const technologiesFromState = location.state?.technologies as string[] | undefined;

  const profession = professionFromState || user?.profession || "";
  const technologyCount =
    technologiesFromState?.length ?? user?.technologies?.length ?? 0;

  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [draftInput, setDraftInput] = useState("");
  const [entries, setEntries] = useState<TerminalEntry[]>(() =>
    getIntroLines(profession, technologyCount).map((line, index) => ({
      id: index,
      text: line,
    }))
  );
  const [caretVisible, setCaretVisible] = useState(true);
  const [shutdownPhase, setShutdownPhase] = useState<ShutdownPhase>("idle");
  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const [skipUsername, setSkipUsername] = useState("");
  const [skipError, setSkipError] = useState("");
  const [skipSubmitting, setSkipSubmitting] = useState(false);
  const [currentTime, setCurrentTime] = useState(() =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const skipUsernameInputRef = useRef<HTMLInputElement | null>(null);
  const shutdownTimersRef = useRef<number[]>([]);

  const promptPrefix = useMemo(() => getPromptPrefix(), []);

  const isShutdownStored = () => window.localStorage.getItem(SHUTDOWN_STATE_KEY) === "sleeping";

  const setShutdownStored = (value: boolean) => {
    if (value) {
      window.localStorage.setItem(SHUTDOWN_STATE_KEY, "sleeping");
      return;
    }

    window.localStorage.removeItem(SHUTDOWN_STATE_KEY);
  };

  useEffect(() => {
    const blink = window.setInterval(() => {
      setCaretVisible((prev) => !prev);
    }, 550);

    const clock = window.setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    }, 1000);

    return () => {
      window.clearInterval(blink);
      window.clearInterval(clock);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!showSkipDialog) {
      return;
    }

    const timer = window.setTimeout(() => {
      skipUsernameInputRef.current?.focus();
    }, 10);

    return () => {
      window.clearTimeout(timer);
    };
  }, [showSkipDialog]);

  useEffect(() => {
    if (!isShutdownStored()) {
      return;
    }

    setShutdownPhase("sleeping");
  }, []);

  useEffect(() => {
    return () => {
      for (const timer of shutdownTimersRef.current) {
        window.clearTimeout(timer);
      }
      shutdownTimersRef.current = [];
    };
  }, []);

  const pushEntries = (
    lines: string[],
    variant: TerminalEntry["variant"] = "default"
  ) => {
    if (!lines.length) {
      return;
    }

    setEntries((prev) => {
      const next = [...prev];
      let nextId = prev.length ? prev[prev.length - 1].id + 1 : 0;

      for (const line of lines) {
        next.push({ id: nextId, text: line, variant });
        nextId += 1;
      }

      return next;
    });
  };

  const printStatus = () => {
    pushEntries([
      "terminal: ready",
      "next command: login or skip",
      "oauth destination: github",
    ]);
  };

  const scheduleShutdownStep = (fn: () => void, delayMs: number) => {
    const timer = window.setTimeout(fn, delayMs);
    shutdownTimersRef.current.push(timer);
  };

  const resetShutdownTimers = () => {
    for (const timer of shutdownTimersRef.current) {
      window.clearTimeout(timer);
    }
    shutdownTimersRef.current = [];
  };

  const restartSystem = () => {
    resetShutdownTimers();
    setShutdownStored(false);
    setShutdownPhase("idle");
    setEntries(
      getIntroLines(profession, technologyCount).map((line, index) => ({
        id: index,
        text: line,
      }))
    );
    setInput("");
    setCommandHistory([]);
    setHistoryIndex(null);
    setDraftInput("");

    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 80);
  };

  const startShutdownSequence = () => {
    if (shutdownPhase !== "idle") {
      return;
    }

    setShutdownStored(true);

    const shutdownLogs = [
      "[shutdown] received exit signal",
      "[shutdown] stopping git-sync.service ... done",
      "[shutdown] stopping auth-session.service ... done",
      "[shutdown] stopping ui-renderer.service ... done",
      "[shutdown] closing network interfaces ... done",
      "[shutdown] system entering sleep mode",
    ];

    setShutdownPhase("logging");

    shutdownLogs.forEach((line, index) => {
      scheduleShutdownStep(() => pushEntries([line]), index * 260);
    });

    scheduleShutdownStep(() => setShutdownPhase("animating"), shutdownLogs.length * 260 + 120);
    scheduleShutdownStep(() => setShutdownPhase("sleeping"), shutdownLogs.length * 260 + 2320);
  };

  const openSkipDialog = () => {
    setSkipError("");
    setSkipUsername((prev) => prev || user?.github_username || user?.name || "");
    setShowSkipDialog(true);
  };

  const closeSkipDialog = () => {
    if (skipSubmitting) {
      return;
    }

    setShowSkipDialog(false);
    setSkipError("");
    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 40);
  };

  const submitSkipSession = async () => {
    const username = skipUsername.trim();
    if (!username) {
      setSkipError("Username is required.");
      return;
    }

    setSkipSubmitting(true);
    setSkipError("");

    try {
      const payload = await authService.skipGithubAuth({
        username,
        profession,
        technologies: technologiesFromState || user?.technologies || [],
      });

      authService.setToken(payload.token);
      window.dispatchEvent(new CustomEvent("auth-token-updated"));
      window.dispatchEvent(new CustomEvent("user-updated", { detail: payload.user }));

      pushEntries([
        "skip authentication completed.",
        `saved username: ${payload.user.github_username}`,
      ]);

      setShowSkipDialog(false);
      navigate("/dashboard", { replace: true, state: { refreshUser: true } });
    } catch (error) {
      setSkipError(error instanceof Error ? error.message : "Failed to continue with skip flow.");
    } finally {
      setSkipSubmitting(false);
    }
  };

  const runCommand = (rawCommand: string) => {
    const command = rawCommand.trim();
    const normalized = command.toLowerCase();

    if (!normalized) {
      return;
    }

    if (shutdownPhase !== "idle") {
      return;
    }

    if (normalized === "clear") {
      setEntries([]);
      return;
    }

    if (normalized === "exit") {
      startShutdownSequence();

      return;
    }

    if (normalized === "help") {
      pushEntries(COMMAND_HELP);
      return;
    }

    if (normalized === "status") {
      printStatus();
      return;
    }

    if (normalized === "skip" || normalized === "finish") {
      pushEntries(["skip command detected. opening username prompt..."]);
      openSkipDialog();
      return;
    }

    if (/^login$/i.test(command)) {
      pushEntries(["initiating Github OAuth..."]);

      const profileToPersist = {
        profession,
        technologies: technologiesFromState || user?.technologies || [],
      };

      if (
        profileToPersist.profession ||
        (Array.isArray(profileToPersist.technologies) &&
          profileToPersist.technologies.length > 0)
      ) {
        sessionStorage.setItem(
          PENDING_ONBOARDING_KEY,
          JSON.stringify(profileToPersist)
        );
      }

      // Use real OAuth flow so backend can fetch and persist live GitHub data.
      const url = new URL(buildApiUrl(API_ENDPOINTS.GITHUB_AUTH));
      url.searchParams.set("returnTo", window.location.origin);
      window.location.href = url.toString();
      return;
    }

    pushEntries([
      `command not found: ${command}`,
      "type 'help' to list available commands",
    ]);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (shutdownPhase !== "idle" || showSkipDialog) {
      return;
    }

    const rawCommand = input;
    const text = rawCommand.trim();
    setInput("");

    if (!text) {
      return;
    }

    setCommandHistory((prev) => [...prev, text]);
    setHistoryIndex(null);
    setDraftInput("");
    pushEntries([`${promptPrefix} ${text}`]);
    runCommand(text);
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (shutdownPhase !== "idle" || showSkipDialog) {
      return;
    }

    if (event.key === "ArrowUp") {
      if (!commandHistory.length) {
        return;
      }

      event.preventDefault();

      if (historyIndex === null) {
        setDraftInput(input);
        const nextIndex = commandHistory.length - 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
        return;
      }

      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }

      return;
    }

    if (event.key === "ArrowDown") {
      if (historyIndex === null) {
        return;
      }

      event.preventDefault();

      if (historyIndex < commandHistory.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
        return;
      }

      setHistoryIndex(null);
      setInput(draftInput);
    }
  };

  const onSkipDialogKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!skipSubmitting) {
        void submitSkipSession();
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeSkipDialog();
    }
  };

  return (
    <div
      className="retro-shell h-screen min-h-screen w-full overflow-hidden"
      style={{ minHeight: "100dvh", height: "100dvh" }}
      onClick={() => {
        if (shutdownPhase === "idle" && !showSkipDialog) {
          inputRef.current?.focus();
        }
      }}
      role="presentation"
    >
      <div className="retro-terminal relative h-full min-h-full w-full bg-[#120900]/95">
        <div className="retro-topbar relative flex h-full items-center justify-between overflow-hidden bg-[#130a06] px-2 text-sm">
          <div className="retro-tab absolute bottom-0 left-2.5 flex min-w-0 items-center gap-2 rounded-t-lg border border-[#3a2416] border-b-0 bg-[#f2a04304] p-2.5">
            <span className="retro-tab-label retro-glow-text truncate text-xs text-[#f2a043]">
              MINGW64:/C/Users/Working-One
            </span>
          </div>

          <div className="absolute right-2 my-2 flex items-center gap-1">
            <span className="hidden text-lg tracking-[0.14em] text-[#b48b63] sm:inline">
              {currentTime}
            </span>
          </div>
        </div>

        <div
          ref={scrollRef}
          data-lenis-prevent="true"
          className="retro-content h-full min-h-0 overflow-auto px-3 pb-14 pt-3 text-md leading-[1.5] sm:px-5"
        >
          {entries.map((entry) => (
            <p
              key={entry.id}
              className={
                entry.variant === "boxed"
                  ? "retro-entry-box whitespace-pre-wrap break-words"
                  : "whitespace-pre-wrap break-words"
              }
            >
              {entry.text}
            </p>
          ))}

          <form
            onSubmit={onSubmit}
            className="mt-1 flex items-start gap-2"
            autoComplete="off"
          >
            <label
              htmlFor="github-terminal-input"
              className="retro-glow-text shrink-0 whitespace-nowrap"
            >
              {promptPrefix}
            </label>

            <div className="relative w-full">
              <input
                id="github-terminal-input"
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={onInputKeyDown}
                className="w-full bg-transparent pr-2 outline-none caret-transparent"
                disabled={shutdownPhase !== "idle"}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                aria-label="GitHub setup terminal input"
              />

              {!input && (
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-[2px] inline-block h-[1.1em] w-[10px] bg-[#f2a043] ${
                    caretVisible ? "opacity-90" : "opacity-0"
                  }`}
                />
              )}
            </div>
          </form>
        </div>

        <div className="retro-scanlines" />

        {shutdownPhase === "animating" && (
          <ShutdownScreen phase="animating" onRestart={restartSystem} />
        )}

        {shutdownPhase === "sleeping" && (
          <ShutdownScreen phase="sleeping" onRestart={restartSystem} />
        )}

        {showSkipDialog && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#080301]/80 px-4">
            <div className="w-full max-w-[460px] rounded-md border border-[#5a2602] bg-[#120901] p-4 shadow-[0_0_0_1px_rgba(242,160,67,0.15),0_20px_40px_rgba(0,0,0,0.5)]">
              <h2 className="retro-glow-text text-lg uppercase tracking-[0.08em] text-[#ffd7ad]">
                please enter your user name.
              </h2>

              <div className="mt-4 space-y-3">
                <label htmlFor="skip-username" className="block text-sm text-[#f2a043]">
                  User name
                </label>
                <input
                  id="skip-username"
                  ref={skipUsernameInputRef}
                  value={skipUsername}
                  onChange={(event) => setSkipUsername(event.target.value)}
                  onKeyDown={onSkipDialogKeyDown}
                  disabled={skipSubmitting}
                  className="w-full rounded-sm border border-[#5a2602] bg-[#1a0d03] px-3 py-2 text-[#ffe3c3] outline-none focus:border-[#f2a043]"
                  placeholder="enter username"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                />

                {skipError && (
                  <p className="text-sm text-[#ff8d8d]">{skipError}</p>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={closeSkipDialog}
                    disabled={skipSubmitting}
                    className="rounded-sm border border-[#5a2602] px-3 py-1.5 text-sm text-[#d8a26f] transition-colors hover:bg-[#2a1305] disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void submitSkipSession();
                    }}
                    disabled={skipSubmitting}
                    className="rounded-sm border border-[#f2a043] bg-[#f2a0431a] px-4 py-1.5 text-sm font-medium text-[#ffd7ad] transition-colors hover:bg-[#f2a04333] disabled:opacity-60"
                  >
                    {skipSubmitting ? "Saving..." : "Enter"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .retro-entry-box {
          margin: 0.35rem 0 0.7rem;
          border: 1px solid #5a2602;
          background: linear-gradient(
            180deg,
            rgba(48, 24, 11, 0.66) 0%,
            rgba(27, 13, 2, 0.78) 100%
          );
          border-radius: 8px;
          padding: 0.5rem 0.7rem;
          box-shadow: inset 0 0 0 1px rgba(242, 160, 67, 0.08);
        }
      `}</style>
    </div>
  );
}
