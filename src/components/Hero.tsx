import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/retro-shared.css";

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
  "  start           Start Onboarding",
  "  about           What is working-one",
  "  features        Core platform features",
  "  clear           Clear terminal output",
  "  status          Show system status",
  "  time            Show local time",
  "  whoami          Show current terminal user",
];

function getPromptPrefix() {
  return `${PROMPT_USER}@${PROMPT_HOST}:~$`;
}

function getBootLines() {
  return [
    "boot sequence start...",
    "loading working-one shell v1.0.0",
    "establishing secure channel...done",
    "Welcome to Working One 1.0.0 LTS (GNU/Linux 6.8.0-100-generic x86_64)",
    " * Documentation:  https://docs.working-one.com",
    " * Management:     https://dashboard.working-one.com",
    " * Support:        support@working-one.com",
    "type 'help' to get started",
  ];
}

export default function Hero() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [draftInput, setDraftInput] = useState("");
  const [entries, setEntries] = useState<TerminalEntry[]>(() =>
    getBootLines().map((line, index) => ({ id: index, text: line }))
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

  const pushEntries = (lines: string[], variant: TerminalEntry["variant"] = "default") => {
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

  const runCommand = (rawCommand: string) => {
    const command = rawCommand.trim().toLowerCase();

    if (!command) {
      return;
    }

    if (command === "clear") {
      setEntries([]);
      return;
    }

    if (command === "help") {
      pushEntries(COMMAND_HELP);
      return;
    }

    if (command === "about") {
      pushEntries(
        [[
          "ABOUT WORKING-ONE",
          "-----------------------------------------------------------------------------------",
          "working-one is built for developers who are tired of juggling tools just to grow.",
          "",
          "It connects your GitHub, your learning, and real opportunities in one place.",
          "From tracking progress to finding hackathons, open source projects, jobs, and",
          "learning resources, everything is tailored to what you do and where you want to go.",
          "",
          "No noise. No fluff. Just a platform that helps you build, learn, and grow in public.",
        ].join("\n")],
        "boxed"
      );
      return;
    }

    if (command === "features") {
      pushEntries(
        [[
          "WORKING-ONE CORE FEATURES",
          "-----------------------------------------------------------------",
          "1) GitHub-based authentication with real activity sync",
          "2) Smart onboarding by role and technologies",
          "3) Developer dashboard with repos, languages, and contributions",
          "4) Personalized hackathons feed",
          "5) Open source discovery by stack and level",
          "6) Smart job hunting with role and tech filters",
          "7) Structured learning hub with curated courses",
          "8) YouTube learning engine with topic-based creators",
          "9) Social sharing engine for project updates",
          "10) Developer networking with connections",
          "11) Personalized ecosystem across content and opportunities",
          "12) Account and profile management for developer identity",
        ].join("\n")],
        "boxed"
      );
      return;
    }

    if (command === "status") {
      pushEntries(["system: online", "auth service: ready", "network: stable"]);
      return;
    }

    if (command === "time") {
      pushEntries([`local time: ${currentTime}`]);
      return;
    }

    if (command === "whoami") {
      pushEntries([PROMPT_USER]);
      return;
    }

    if (command === "start") {
      pushEntries(["redirecting to onboarding..."]);
      navigate("/onboarding");
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
            <span className="retro-tab-label retro-glow-text truncate text-xs text-[#f2a043]">MINGW64:/C/Users/Working-One</span>
          </div>

          <div className="absolute right-2 my-2 flex items-center gap-1">
            <span className="hidden text-lg tracking-[0.14em] text-[#b48b63] sm:inline">{currentTime}</span>
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

          <form onSubmit={onSubmit} className="mt-1 flex items-start gap-2" autoComplete="off">
            <label htmlFor="terminal-input" className="retro-glow-text shrink-0 whitespace-nowrap">
              {promptPrefix}
            </label>

            <div className="relative w-full">
              <input
                id="terminal-input"
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={onInputKeyDown}
                className="w-full bg-transparent pr-2 outline-none caret-transparent"
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                aria-label="Terminal command input"
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
        .retro-tab-dot {
          background: linear-gradient(160deg, #8ce99a 0%, #2b8a3e 100%);
          box-shadow: 0 0 8px rgba(140, 233, 154, 0.45);
        }

        .retro-window-btn {
          min-width: 28px;
          border: 1px solid #4c2f1b;
          background: #201108;
          color: #d7a873;
          font-size: 10px;
          line-height: 1;
          padding: 7px 0;
          transition: background-color 130ms ease, color 130ms ease, border-color 130ms ease;
        }

        .retro-window-btn:hover {
          background: #2a170b;
          border-color: #6d3f1e;
          color: #f4be83;
        }

        .retro-window-btn-close:hover {
          background: #6b1e13;
          border-color: #a7422a;
          color: #ffe7de;
        }

        .retro-entry-box {
          margin: 0.35rem 0 0.7rem;
          border: 1px solid #5a2602;
          background: linear-gradient(180deg, rgba(48, 24, 11, 0.66) 0%, rgba(27, 13, 2, 0.78) 100%);
          border-radius: 8px;
          padding: 0.5rem 0.7rem;
          box-shadow: inset 0 0 0 1px rgba(242, 160, 67, 0.08);
        }
      `}</style>
    </div>
  );
}
