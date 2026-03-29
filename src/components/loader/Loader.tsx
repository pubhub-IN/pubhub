import "./Loader.css";

interface LoaderProps {
  progress?: number;
}

export default function Loader({ progress = 0 }: LoaderProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative">
      <div className="inline-block">
        <div className="flex items-center text-sm text-[#f2a043] font-mono">
          <span className="whitespace-pre text-[#f2a043] text-shadow-glow">working one</span>
          <span className="loader-cursor inline-block w-[2px] h-[1.2em] bg-[#f2a043] mx-[2px]"></span>
        </div>
      </div>
      <div className="h-[2px] w-full bg-transparent absolute bottom-0 left-0">
          <div
            className="h-[2px] bg-[#f2a043]"
            style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }}
          ></div>
        </div>
    </div>
  );
}
