import { createFileRoute } from "@tanstack/react-router";
import { Activity, ScanLine, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { AnalyticsTab } from "@/components/netra/AnalyticsTab";
import { TopBar } from "@/components/netra/TopBar";
import { TrajectoryTab } from "@/components/netra/TrajectoryTab";
import { WatchlistTab } from "@/components/netra/WatchlistTab";

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
] as const;

type TabId = (typeof TABS)[number]["id"];

function Index() {
  const [tab, setTab] = useState<TabId>("trajectory");
  const [alertCount, setAlertCount] = useState(3);
  const [alertsOpen, setAlertsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar
        alertCount={alertCount}
        alertsOpen={alertsOpen || tab === "watchlist"}
        onToggleAlerts={() => {
          setAlertsOpen(true);
          setTab("watchlist");
          setAlertCount(0);
        }}
      />

      <nav className="border-b border-border bg-panel/60 px-4 lg:px-6" aria-label="Dashboard sections">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 font-mono text-xs uppercase tracking-[0.15em] transition-colors ${
                tab === t.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="size-4" />
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="p-4 lg:p-6">
        {tab === "trajectory" && <TrajectoryTab />}
        {tab === "analytics" && <AnalyticsTab />}
        {tab === "watchlist" && <WatchlistTab />}
      </main>
    </div>
  );
}
