import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Gauge, Navigation, Pause, Play, Search, SkipBack } from "lucide-react";
import MapPanel from "./MapPanel";
import { PlateCrop } from "./PlateCrop";
import { cameraById, TRACKS, WATCHLIST, type Waypoint } from "@/data/netra";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

const KNOWN = Object.keys(TRACKS);

function fmtTime(ts: string) {
  const d = new Date(ts);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function TrajectoryTab() {
  const [query, setQuery] = useState("DL01AB1234");
  const [plate, setPlate] = useState("DL01AB1234");
  const [from, setFrom] = useState("2026-09-05T06:00");
  const [to, setTo] = useState("2026-09-05T12:00");
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState<Waypoint | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const route = useMemo(() => TRACKS[plate] ?? [], [plate]);
  const flagged = WATCHLIST.find((w) => w.plate === plate);

  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => {
      setIndex((i) => {
        if (i >= route.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 1200);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, route.length]);

  function runSearch() {
    const p = query.toUpperCase().replace(/\s/g, "");
    setPlate(p);
    setIndex(0);
    setPlaying(false);
  }

  const active = route[index];

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-panel p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[240px] flex-1">
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Target plate
              </label>
              <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3">
                <Search className="size-4 text-primary" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && runSearch()}
                  placeholder="DL01AB1234"
                  className="w-full bg-transparent py-2.5 font-mono text-sm tracking-[0.14em] outline-none placeholder:text-muted-foreground/60"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                From
              </label>
              <input
                type="datetime-local"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2.5 font-mono text-xs outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                To
              </label>
              <input
                type="datetime-local"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2.5 font-mono text-xs outline-none focus:border-primary"
              />
            </div>
            <button
              onClick={runSearch}
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
            >
              Reconstruct
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono uppercase tracking-widest">Indexed plates:</span>
            {KNOWN.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setQuery(p);
                  setPlate(p);
                  setIndex(0);
                  setPlaying(false);
                }}
                className={`rounded border px-2 py-0.5 font-mono transition ${
                  p === plate
                    ? "border-primary/60 bg-primary/15 text-primary"
                    : "border-border hover:border-primary/40"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-panel">
          <div className="h-[420px] md:h-[520px]">
            <MapPanel
              route={route}
              activeOrder={active?.order}
              onWaypointClick={(order) => {
                const wp = route.find((w) => w.order === order) ?? null;
                setSelected(wp);
                if (wp) setIndex(route.indexOf(wp));
              }}
            />
          </div>

          <div className="border-t border-border p-4">
            {route.length === 0 ? (
              <p className="font-mono text-xs text-warn">
                No ANPR trail indexed for {plate} in the selected window.
              </p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPlaying((p) => !p)}
                    className="grid size-9 place-items-center rounded-md border border-primary/50 bg-primary/15 text-primary transition hover:bg-primary/25"
                    aria-label={playing ? "Pause playback" : "Play playback"}
                  >
                    {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
                  </button>
                  <button
                    onClick={() => {
                      setIndex(0);
                      setPlaying(false);
                    }}
                    className="grid size-9 place-items-center rounded-md border border-border text-muted-foreground transition hover:text-foreground"
                    aria-label="Restart playback"
                  >
                    <SkipBack className="size-4" />
                  </button>
                  <div className="flex-1 px-2">
                    <Slider
                      value={[index]}
                      min={0}
                      max={Math.max(route.length - 1, 0)}
                      step={1}
                      onValueChange={(v) => {
                        setIndex(v[0] ?? 0);
                        setPlaying(false);
                      }}
                    />
                  </div>
                  <span className="w-24 text-right font-mono text-xs text-muted-foreground">
                    {index + 1} / {route.length}
                  </span>
                </div>
                {active && (
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 font-mono text-xs text-muted-foreground">
                    <span className="text-foreground">{cameraById(active.cameraId).name}</span>
                    <span>{fmtTime(active.timestamp)}</span>
                    <span>HDG {active.direction}</span>
                    <span>{active.speed} km/h</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div
          className={`rounded-lg border p-4 ${
            flagged ? "border-alert/50 bg-alert/10" : "border-ok/40 bg-ok/10"
          }`}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Subject status
          </p>
          <p className="mt-1 font-mono text-lg font-bold tracking-[0.14em]">{plate}</p>
          <p className={`mt-1 text-sm font-semibold ${flagged ? "text-alert" : "text-ok"}`}>
            {flagged ? `BLACKLISTED — ${flagged.reason}` : "No active flags"}
          </p>
          {flagged && (
            <p className="mt-1 text-xs text-muted-foreground">
              Added {flagged.addedOn} by {flagged.addedBy}
            </p>
          )}
        </div>

        <div className="rounded-lg border border-border bg-panel">
          <p className="border-b border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Waypoint log
          </p>
          <ul className="max-h-[440px] divide-y divide-border overflow-auto">
            {route.map((w, i) => (
              <li key={w.order}>
                <button
                  onClick={() => {
                    setIndex(i);
                    setSelected(w);
                    setPlaying(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-panel-elevated ${
                    i === index ? "bg-primary/10" : ""
                  }`}
                >
                  <span
                    className={`grid size-6 shrink-0 place-items-center rounded-full font-mono text-[11px] font-bold ${
                      i === index
                        ? "bg-warn text-[oklch(0.18_0.02_250)]"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm">{cameraById(w.cameraId).name}</span>
                    <span className="block font-mono text-[11px] text-muted-foreground">
                      {w.cameraId} · {fmtTime(w.timestamp)} · {w.direction} · {w.speed} km/h
                    </span>
                  </span>
                </button>
              </li>
            ))}
            {route.length === 0 && (
              <li className="px-4 py-6 text-center text-xs text-muted-foreground">No hits</li>
            )}
          </ul>
        </div>
      </aside>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="bg-panel-elevated sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-mono text-sm uppercase tracking-[0.18em]">
              Waypoint #{selected ? route.indexOf(selected) + 1 : ""} detail
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <PlateCrop plate={plate} cameraId={selected.cameraId} />
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <Detail icon={<Camera className="size-3.5" />} label="Camera ID" value={selected.cameraId} />
                <Detail
                  icon={<Navigation className="size-3.5" />}
                  label="Direction"
                  value={selected.direction}
                />
                <Detail
                  icon={<Gauge className="size-3.5" />}
                  label="Speed est."
                  value={`${selected.speed} km/h`}
                />
                <Detail
                  icon={<Camera className="size-3.5" />}
                  label="Match conf."
                  value={`${Math.round(selected.confidence * 100)}%`}
                />
              </dl>
              <div className="rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-muted-foreground">
                {cameraById(selected.cameraId).name} · {selected.timestamp.replace("T", " ")}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background px-3 py-2">
      <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="mt-0.5 font-mono text-sm">{value}</dd>
    </div>
  );
}
