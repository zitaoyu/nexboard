import { useState, useEffect, useCallback, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import type { WidgetProps } from "@/types/widget";

type TimerMode = "countdown" | "stopwatch";

function formatTime(totalMs: number): string {
  const totalSeconds = Math.floor(totalMs / 1000);
  const cs = Math.floor((totalMs % 1000) / 10); // centiseconds (2 digits)
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  const pad2 = (n: number): string => n.toString().padStart(2, "0");

  if (h > 0) return `${pad2(h)}:${pad2(m)}:${pad2(s)}.${pad2(cs)}`;
  return `${pad2(m)}:${pad2(s)}.${pad2(cs)}`;
}

export function TimerWidget({ config }: WidgetProps): React.ReactElement {
  const mode = (config.mode as TimerMode) || "stopwatch";
  const defaultDuration = (config.defaultDuration as number) || 300; // seconds

  const startMs = mode === "countdown" ? defaultDuration * 1000 : 0;
  const [ms, setMs] = useState(startMs);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
  }, []);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setMs((prev) => {
        if (mode === "countdown") {
          if (prev <= 10) {
            stop();
            return 0;
          }
          return prev - 10;
        }
        return prev + 10;
      });
    }, 10);
  }, [mode, stop]);

  const reset = useCallback(() => {
    stop();
    setMs(startMs);
  }, [startMs, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Reset when mode or default duration changes
  useEffect(() => {
    reset();
  }, [mode, defaultDuration, reset]);

  // Fraction of time remaining (1 → 0) used to derive elapsed fill
  const remaining = mode === "countdown" ? ms / (defaultDuration * 1000) : 0;

  const elapsed = 1 - remaining;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
      <div className="text-xs uppercase tracking-widest text-white/40">
        {mode === "countdown" ? "Countdown" : "Stopwatch"}
      </div>

      <div className="text-3xl font-light tabular-nums tracking-wide">
        {formatTime(ms)}
      </div>

      {/* Progress bar — only in countdown mode */}
      {mode === "countdown" && (
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${elapsed * 100}%`,
              backgroundColor: "rgba(96,165,250,0.85)",
              boxShadow: "0 0 6px 1px rgba(96,165,250,0.6)",
            }}
          />
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={running ? stop : start}
          className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
          title={running ? "Pause" : "Start"}
        >
          {running ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          onClick={reset}
          className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
          title="Reset"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}
