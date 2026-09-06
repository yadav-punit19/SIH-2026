import { Bell, Camera, Radio } from "lucide-react";
import { useEffect, useState } from "react";
import { CAMERAS, WATCHLIST } from "@/data/netra";

export function TopBar({ alertCount, onToggleAlerts, alertsOpen }: { alertCount: number; onToggleAlerts: () => void; alertsOpen: boolean }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-panel/90 backdrop-blur">
      <div className="flex h-14 items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg border border-primary/40 bg-primary/15">
            <Camera className="size-5 text-primary" />
          </span>
          <div>
            <h1 className="text-sm font-bold tracking-wide">
              NETRA <span className="font-mono text-[10px] font-normal uppercase tracking-[0.2em] text-muted-foreground">v2.4</span>
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              City-wide ANPR &amp; traffic intelligence
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            <Radio className="size-3.5 text-ok" />
            <span className="text-ok">{CAMERAS.length} nodes online</span>
            <span className="text-muted-foreground/50">·</span>
            <span>{WATCHLIST.length} flagged plates</span>
          </div>
          <p className="font-mono text-sm tabular-nums text-foreground">
            {now.toLocaleTimeString("en-IN", { hour12: false })}{" "}
            <span className="text-xs text-muted-foreground">IST</span>
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleAlerts}
          aria-label="Toggle alert stream"
          className={`relative grid size-9 place-items-center rounded-lg border transition-colors ${
            alertsOpen
              ? "border-alert/60 bg-alert/15 text-alert"
              : "border-border bg-panel-elevated text-muted-foreground hover:text-foreground"
          }`}
        >
          <Bell className="size-4" />
          {alertCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-alert font-mono text-[10px] font-bold text-white">
              {alertCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
