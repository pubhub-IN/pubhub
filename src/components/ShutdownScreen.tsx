import { HiMiniPower } from "react-icons/hi2";

type ShutdownScreenProps = {
  phase: "animating" | "sleeping";
  onRestart: () => void;
  title?: string;
  message?: string;
  sleepingMessage?: string;
};

export default function ShutdownScreen({
  phase,
  onRestart,
  title = "System Shutdown In Progress",
  message = "Flushing processes and powering down services.",
  sleepingMessage = "The system is sleeping",
}: ShutdownScreenProps) {
  if (phase === "animating") {
    return (
      <div className="retro-shutdown-overlay" role="status" aria-live="polite">
        <div className="retro-shutdown-panel">
          <p className="retro-shutdown-title">{title}</p>
          <p className="mt-2 text-sm text-[#f7c89a]">{message}</p>
          <div className="retro-shutdown-bar">
            <div className="retro-shutdown-bar-fill" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="retro-sleep-overlay" role="status" aria-live="polite">
      <div className="retro-sleep-graphic">
        <div className="retro-sleep-halo" aria-hidden="true" />
        <p className="text-3xl font-semibold tracking-[0.08em]">{sleepingMessage}</p>
      </div>
      <label className="retro-power-switch toggle" aria-label="Power on and restart system">
        <input
          type="checkbox"
          onChange={onRestart}
          aria-label="Power on and restart system"
        />
        <span className="button" />
        <span className="label">
          <HiMiniPower size={30} aria-hidden="true" />
        </span>
      </label>
    </div>
  );
}