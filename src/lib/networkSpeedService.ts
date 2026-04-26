export type NetworkQuality = "offline" | "slow" | "moderate" | "fast";

export interface NetworkStatus {
  speedMbps: number;
  latencyMs: number;
  quality: NetworkQuality;
  effectiveType?: string;
}

type NavigatorWithConnection = Navigator & {
  connection?: { effectiveType?: string };
  mozConnection?: { effectiveType?: string };
  webkitConnection?: { effectiveType?: string };
};

export class NetworkSpeedService {
  private testFileUrl: string;
  private testFileSizeBytes: number;

  constructor(testFileUrl: string, testFileSizeBytes = 2 * 1024 * 1024) {
    this.testFileUrl = testFileUrl;
    this.testFileSizeBytes = testFileSizeBytes;
  }

  async measure(): Promise<NetworkStatus> {
    if (!navigator.onLine) {
      return { speedMbps: 0, latencyMs: 0, quality: "offline" };
    }

    const [speedMbps, latencyMs] = await Promise.all([
      this.measureDownloadSpeed(),
      this.measureLatency(),
    ]);

    return {
      speedMbps,
      latencyMs,
      quality: this.classify(speedMbps),
      effectiveType: this.getEffectiveType(),
    };
  }

  private async measureDownloadSpeed(): Promise<number> {
    try {
      const start = performance.now();
      const res = await fetch(`${this.testFileUrl}?t=${Date.now()}`, {
        cache: "no-store",
      });
      await res.blob();
      const duration = (performance.now() - start) / 1000;
      return parseFloat(
        ((this.testFileSizeBytes * 8) / duration / 1_000_000).toFixed(2)
      );
    } catch {
      return 0;
    }
  }

  private async measureLatency(): Promise<number> {
    try {
      const start = performance.now();
      await fetch(`/favicon.ico?t=${Date.now()}`, {
        cache: "no-store",
        method: "HEAD",
      });
      return parseFloat((performance.now() - start).toFixed(2));
    } catch {
      return 0;
    }
  }

  private classify(speedMbps: number): NetworkQuality {
    if (speedMbps === 0) return "offline";
    if (speedMbps < 1) return "slow";
    if (speedMbps < 5) return "moderate";
    return "fast";
  }

  private getEffectiveType(): string | undefined {
    const nav = navigator as NavigatorWithConnection;
    return (
      nav.connection?.effectiveType ||
      nav.mozConnection?.effectiveType ||
      nav.webkitConnection?.effectiveType
    );
  }

  // Call this to monitor continuously
  monitor(
    intervalMs = 30000,
    callback: (status: NetworkStatus) => void
  ): () => void {
    const run = () => {
      void this.measure().then(callback);
    };

    run();
    const id = setInterval(run, intervalMs);
    return () => clearInterval(id); // returns cleanup function
  }
}
