import { useEffect, useRef, useState } from "react";
import { Bell, Eye, Radio, Siren, Trash2, Volume2, VolumeX } from "lucide-react";
import { CAMERAS, RANDOM_PLATES, WATCHLIST, type WatchItem } from "@/data/netra";

export type StreamEvent = {
  id: number;
  plate: string;
  cameraId: string;
  cameraName: string;
  time: string;
  speed: number;
  flagged?: WatchItem | undefined;
};

const severityStyles: Record<WatchItem["severity"], string> = {
  critical: "border-alert/50 bg-alert/15 text-alert",
  high: "border-warn/50 bg-warn/15 text-warn",
  moderate: "border-border bg-panel-elevated text-muted-foreground",
};

export function makeEvent(id: number): StreamEvent {
  const cam = CAMERAS[Math.floor(Math.random() * CAMERAS.length)]!;
  const hit = Math.random() < 0.22;
  const item = WATCHLIST[Math.floor(Math.random() * WATCHLIST.length)]!;
  const plate = hit ? item.plate : RANDOM_PLATES[Math.floor(Math.random() * RANDOM_PLATES.length)]!;
  return {
    id,
    plate,
    cameraId: cam.id,
    cameraName: cam.name,
    time: new Date().toLocaleTimeString("en-GB"),
    speed: 22 + Math.floor(Math.random() * 60),
    flagged: hit ? item : undefined,
  };
}

function beep(muted: boolean) {
  if (muted || typeof window === "undefined") return;
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(620, ctx.currentTime + 0.14);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    /* audio not available */
  }
}

export function WatchlistTab({
  events,
  live,
  onToggleLive,
}: {
  events: StreamEvent[];
  live: boolean;
  onToggleLive: () => void;
}) {
  const [muted, setMuted] = useState(false);
  const [removed, setRemoved] = useState<string[]>([]);
  const lastAlert = useRef<number>(0);

  const latestHit = events.find((e) => e.flagged);

  useEffect(() => {
    if (latestHit && latestHit.id !== lastAlert.current) {
      lastAlert.current = latestHit.id;
      beep(muted);
    }
  }, [latestHit, muted]);

  const rows = WATCHLIST.filter((w) => !removed.includes(w.plate));

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <div className="rounded-lg border border-border bg-panel">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Blacklisted vehicles · {rows.length} active
          </p>
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-ok">
            <Radio className="size-3" /> synced with state registry
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                <th className="px-4 py-2.5">Plate</th>
                <th className="px-4 py-2.5">Reason</th>
                <th className="px-4 py-2.5">Date added</th>
                <th className="px-4 py-2.5">Source</th>
                <th className="px-4 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((w) => {
                const hot = events.some((e) => e.flagged?.plate === w.plate);
                return (
                  <tr key={w.plate} className={hot ? "bg-alert/5" : ""}>
                    <td className="px-4 py-3 font-mono tracking-[0.12em]">
                      <span className="flex items-center gap-2">
                        {w.plate}
                        {hot && (
                          <span className="rounded border border-alert/60 bg-alert/20 px-1.5 py-0.5 font-mono text-[9px] uppercase text-alert alert-flash">
                            live hit
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded border px-2 py-0.5 text-xs ${severityStyles[w.severity]}`}
                      >
                        {w.reason}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{w.addedOn}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{w.addedBy}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs transition hover:border-primary/60 hover:text-primary">
                          <Eye className="size-3.5" /> Track
                        </button>
                        <button
                          onClick={() => setRemoved((r) => [...r, w.plate])}
                          className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition hover:border-alert/60 hover:text-alert"
                        >
                          <Trash2 className="size-3.5" /> Clear
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-xs text-muted-foreground">
                    Watchlist empty
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <aside className="flex max-h-[720px] flex-col rounded-lg border border-border bg-panel">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <Bell className="size-3.5 text-primary" /> Live ANPR stream
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMuted((m) => !m)}
              className="grid size-7 place-items-center rounded border border-border text-muted-foreground transition hover:text-foreground"
              aria-label={muted ? "Unmute alerts" : "Mute alerts"}
            >
              {muted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5 text-ok" />}
            </button>
            <button
              onClick={onToggleLive}
              className={`rounded border px-2 py-1 font-mono text-[10px] uppercase tracking-widest transition ${
                live ? "border-ok/60 bg-ok/15 text-ok" : "border-border text-muted-foreground"
              }`}
            >
              {live ? "Live" : "Paused"}
            </button>
          </div>
        </div>

        <div className="flex-1 divide-y divide-border overflow-auto">
          {events.map((e) => (
            <div
              key={e.id}
              className={`px-4 py-3 ${e.flagged ? "border-l-2 border-l-alert bg-alert/10" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm tracking-[0.12em]">{e.plate}</span>
                {e.flagged ? (
                  <span className="flex items-center gap-1 rounded border border-alert/60 bg-alert/20 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-alert alert-flash">
                    <Siren className="size-3" /> blacklist
                  </span>
                ) : (
                  <span className="font-mono text-[9px] uppercase tracking-widest text-ok">clear</span>
                )}
              </div>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                {e.cameraId} · {e.cameraName}
              </p>
              <p className="font-mono text-[11px] text-muted-foreground">
                {e.time} · {e.speed} km/h
              </p>
              {e.flagged && (
                <p className="mt-1 text-xs font-semibold text-alert">{e.flagged.reason}</p>
              )}
            </div>
          ))}
          {events.length === 0 && (
            <p className="px-4 py-8 text-center text-xs text-muted-foreground">
              Awaiting ANPR telemetry…
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
