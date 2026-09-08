import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, AlertTriangle, ArrowRight, Camera, Gauge, FileSpreadsheet, ScanLine, ShieldAlert, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnalyticsTab } from "@/components/netra/AnalyticsTab";
import { TopBar } from "@/components/netra/TopBar";
import { TrajectoryTab } from "@/components/netra/TrajectoryTab";
import { WatchlistTab, makeEvent, type StreamEvent } from "@/components/netra/WatchlistTab";
import { ReportsTab } from "@/components/netra/ReportsTab";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Netra — City-Wide ANPR & Traffic Intelligence" },
      {
        name: "description",
        content:
          "Municipal command dashboard for ANPR vehicle trajectory reconstruction, congestion heatmaps, origin–destination flow analytics, and blacklist surveillance alerts.",
      },
      { property: "og:title", content: "Netra — City-Wide ANPR & Traffic Intelligence" },
      {
        property: "og:description",
        content:
          "Municipal command dashboard for ANPR vehicle trajectory reconstruction, congestion analytics, and blacklist surveillance alerts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230284c7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z'/%3E%3Ccircle cx='12' cy='13' r='3'/%3E%3C/svg%3E",
      },
    ],
  }),
  component: Index,
});

const TABS = [
  { id: "trajectory", label: "Trajectory Search", icon: ScanLine },
  { id: "analytics", label: "Traffic Analytics", icon: Activity },
  { id: "watchlist", label: "Blacklist Watchlist", icon: ShieldAlert },
  { id: "reports", label: "Audit & Reports", icon: FileSpreadsheet },
] as const;

type TabId = (typeof TABS)[number]["id"];

function Index() {
  const [tab, setTab] = useState<TabId>("trajectory");
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [live, setLive] = useState(true);
  const [hasSession, setHasSession] = useState(true);
  const [events, setEvents] = useState<StreamEvent[]>(() =>
    Array.from({ length: 8 }, (_, i) => makeEvent(i + 1)),
  );
  const nextId = useRef(9);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("netra_operator");
      setHasSession(!!saved);
    } catch {
      setHasSession(true);
    }
  }, []);

  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => {
      const e = makeEvent(nextId.current++);
      if (e.flagged) setSeen(false);
      setEvents((prev) => [e, ...prev].slice(0, 40));
    }, 2800);
    return () => clearInterval(t);
  }, [live]);

  const alertCount = seen ? 0 : events.filter((e) => e.flagged).length;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <TopBar
        alertCount={alertCount}
        alertsOpen={alertsOpen || tab === "watchlist"}
        onToggleAlerts={() => {
          setAlertsOpen(true);
          setTab("watchlist");
          setSeen(true);
        }}
      />

      {!hasSession && (
        <div className="flex items-center justify-between bg-primary/10 border-b border-primary/30 px-6 py-2.5 text-xs text-primary">
          <div className="flex items-center gap-2 font-mono">
            <AlertTriangle className="size-4 text-warn" />
            <span>Guest Preview Mode — You are currently viewing Netra with default inspector clearance.</span>
          </div>
          <Link
            to="/login"
            className="flex items-center gap-1 font-bold underline hover:text-white"
          >
            Authenticate Operator Badge <ArrowRight className="size-3.5" />
          </Link>
        </div>
      )}

      {/* KPI Executive Overview Panel */}
      <section className="border-b border-border bg-panel/40 px-4 py-4 lg:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3.5 rounded-xl border border-border/80 bg-panel p-3.5 shadow-sm">
            <div className="grid size-10 place-items-center rounded-lg border border-ok/30 bg-ok/15 text-ok">
              <Camera className="size-5" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Active ANPR Grid Nodes
              </p>
              <h3 className="text-lg font-bold tracking-tight text-foreground font-mono">
                18 / 18 <span className="text-xs font-normal text-ok">Online (100%)</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-xl border border-border/80 bg-panel p-3.5 shadow-sm">
            <div className="grid size-10 place-items-center rounded-lg border border-primary/30 bg-primary/15 text-primary">
              <Zap className="size-5" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Captures Today (24h)
              </p>
              <h3 className="text-lg font-bold tracking-tight text-foreground font-mono">
                142,890 <span className="text-xs font-normal text-primary">+12.4%</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-xl border border-border/80 bg-panel p-3.5 shadow-sm">
            <div className="grid size-10 place-items-center rounded-lg border border-alert/30 bg-alert/15 text-alert">
              <ShieldAlert className="size-5" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Blacklist Watchlist Hits
              </p>
              <h3 className="text-lg font-bold tracking-tight text-foreground font-mono">
                {events.filter((e) => e.flagged).length} <span className="text-xs font-normal text-alert">Critical</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-xl border border-border/80 bg-panel p-3.5 shadow-sm">
            <div className="grid size-10 place-items-center rounded-lg border border-warn/30 bg-warn/15 text-warn">
              <Gauge className="size-5" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Avg Corridor Flow Speed
              </p>
              <h3 className="text-lg font-bold tracking-tight text-foreground font-mono">
                48.2 <span className="text-xs font-normal text-muted-foreground">km/h</span>
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <nav className="border-b border-border bg-panel/60 px-4 lg:px-6" aria-label="Dashboard sections">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 font-mono text-xs uppercase tracking-[0.15em] transition-colors ${
                tab === t.id
                  ? "border-primary text-foreground font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="size-4" />
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="p-4 lg:p-6">
        {tab === "trajectory" && <TrajectoryTab />}
        {tab === "analytics" && <AnalyticsTab />}
        {tab === "watchlist" && (
          <WatchlistTab events={events} live={live} onToggleLive={() => setLive((v) => !v)} />
        )}
        {tab === "reports" && <ReportsTab />}
      </main>
    </div>
  );
}

