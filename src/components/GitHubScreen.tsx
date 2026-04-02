import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/useAuth";
import { authService } from "../lib/auth-jwt";
import "../styles/retro-shared.css";

// Helper to create a temporary mock JWT token for testing without OAuth
const createMockToken = (profession: string, technologies: string[]): string => {
  const payload = {
    id: "temp-onboarding-user",
    github_id: 0,
    github_username: "temp_user",
    name: "Temporary User",
    profession,
    technologies,
    total_public_repos: 0,
    total_commits: 0,
    languages: {},
    github_data: {},
    exp: Math.floor(Date.now() / 1000) + 86400, // Expire in 24 hours
  };

  // Create a simple JWT-like token (note: not cryptographically signed for testing)
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa("temp-signature");

  return `${header}.${body}.${signature}`;
};

type TerminalEntry = {
  id: number;
  text: string;
  variant?: "default" | "boxed";
};

const PROMPT_USER = "guest";
const PROMPT_HOST = "working-one";

const COMMAND_HELP: string[] = [
  "Available commands:",
  "  help            Show all commands",
  "  status          Show setup progress",
  "  connect github  Go to dashboard",
  "  finish          Skip and go to dashboard",
  "  clear           Clear terminal output",
  "  exit            Quits WORKING-ONE",
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
    "Type 'connect github' and press Enter to proceed to dashboard.",
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

  const promptPrefix = useMemo(() => getPromptPrefix(), []);

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
      "next command: connect github",
      "oauth destination: github",
    ]);
  };

  const runCommand = (rawCommand: string) => {
    const command = rawCommand.trim();
    const normalized = command.toLowerCase();

    if (!normalized) {
      return;
    }

    if (normalized === "clear") {
      setEntries([]);
      return;
    }

    if (normalized === "exit") {
      pushEntries(["attempting to close this tab..."]);

      window.close();

      setTimeout(() => {
        if (!window.closed) {
          pushEntries([
            "browser blocked tab close",
            "press Ctrl+W (Windows/Linux) or Cmd+W (macOS)",
          ]);
        }
      }, 120);

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

    if (normalized === "finish") {
      navigate("/dashboard", { replace: true, state: { refreshUser: true } });
      return;
    }

    if (/^connect\s+github$/i.test(command)) {
      pushEntries(["connecting to dashboard..."]);
      // Create and set a temporary mock token so user can access dashboard
      const mockToken = createMockToken(profession, technologiesFromState || []);
      authService.setToken(mockToken);
      
      setTimeout(() => {
        navigate("/dashboard", { replace: true, state: { refreshUser: true } });
      }, 500);
      return;
    }

    pushEntries([
      `command not found: ${command}`,
      "type 'help' to list available commands",
    ]);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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

  return (
    <div
      className="retro-shell h-screen min-h-screen w-full overflow-hidden"
      style={{ minHeight: "100dvh", height: "100dvh" }}
      onClick={() => inputRef.current?.focus()}
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
