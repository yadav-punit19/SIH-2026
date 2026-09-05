import { Activity, Gauge, ScanLine, ShieldAlert } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import MapPanel from "./MapPanel";
import { CAMERAS, HOURLY, OD_MATRIX, SECTORS } from "@/data/netra";

const KPIS = [
  {
    label: "Vehicles scanned today",
    value: "78,412",
    delta: "+6.2% vs yesterday",
    tone: "text-ok",
    icon: ScanLine,
  },
  {
    label: "Peak congestion index",
    value: "0.92",
    delta: "Connaught Circus N · 18:00",
    tone: "text-alert",
    icon: Activity,
  },
  {
    label: "Average transit speed",
    value: "34 km/h",
    delta: "-4 km/h vs 7-day mean",
    tone: "text-warn",
    icon: Gauge,
  },
  {
    label: "Active blacklist detections",
    value: "17",
    delta: "5 unresolved",
    tone: "text-alert",
    icon: ShieldAlert,
  },
];

function odColor(v: number) {
  if (v >= 4500) return "bg-alert/70 text-foreground";
  if (v >= 3000) return "bg-warn/60 text-[oklch(0.18_0.02_250)]";
  if (v >= 1500) return "bg-primary/40";
  return "bg-panel-elevated text-muted-foreground";
}

export function AnalyticsTab() {
  const bottlenecks = [...CAMERAS].sort((a, b) => b.congestion - a.congestion).slice(0, 4);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="rounded-lg border border-border bg-panel p-4">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {k.label}
              </p>
              <k.icon className={`size-4 ${k.tone}`} />
            </div>
            <p className="mt-2 font-mono text-3xl font-bold tabular-nums">{k.value}</p>
            <p className={`mt-1 text-xs ${k.tone}`}>{k.delta}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-lg border border-border bg-panel">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Traffic density heatmap
            </p>
            <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
              <Legend color="bg-ok" label="Free flow" />
              <Legend color="bg-warn" label="Dense" />
              <Legend color="bg-alert" label="Bottleneck" />
            </div>
          </div>
          <div className="h-[380px]">
            <MapPanel heat />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-panel">
          <p className="border-b border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Congestion bottlenecks
          </p>
          <ul className="divide-y divide-border">
            {bottlenecks.map((c) => (
              <li key={c.id} className="px-4 py-3">
                <div className="flex items-center justify-between text-sm">
                  <span>{c.name}</span>
                  <span className="font-mono text-alert">{Math.round(c.congestion * 100)}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-panel-elevated">
                  <div
                    className="h-full rounded-full bg-alert"
                    style={{ width: `${c.congestion * 100}%` }}
                  />
                </div>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  {c.id} · {c.sector} sector · {c.throughput.toLocaleString()} veh/day
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-lg border border-border bg-panel p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Hourly vehicle throughput
          </p>
          <div className="mt-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY} margin={{ left: -18, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.32 0.02 258)" vertical={false} />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 10, fill: "oklch(0.68 0.015 255)" }}
                  interval={2}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "oklch(0.68 0.015 255)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "oklch(0.3 0.02 258 / 0.4)" }}
                  contentStyle={{
                    background: "oklch(0.27 0.02 258)",
                    border: "1px solid oklch(0.32 0.02 258)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="vehicles" radius={[3, 3, 0, 0]}>
                  {HOURLY.map((h) => (
                    <Cell
                      key={h.hour}
                      fill={h.vehicles > 5000 ? "#f43f5e" : h.vehicles > 3500 ? "#f59e0b" : "#38bdf8"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-panel p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Origin → destination flow matrix
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-separate border-spacing-1 text-center font-mono text-xs">
              <thead>
                <tr>
                  <th className="text-left text-[10px] uppercase tracking-widest text-muted-foreground">
                    From \ To
                  </th>
                  {SECTORS.map((s) => (
                    <th key={s} className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {s}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SECTORS.map((from) => (
                  <tr key={from}>
                    <td className="text-left text-[10px] uppercase tracking-widest text-muted-foreground">
                      {from}
                    </td>
                    {SECTORS.map((to) => {
                      if (from === to)
                        return (
                          <td key={to} className="rounded bg-background/60 py-2.5 text-muted-foreground/40">
                            —
                          </td>
                        );
                      const cell = OD_MATRIX.find((m) => m.from === from && m.to === to);
                      const v = cell?.volume ?? 0;
                      return (
                        <td key={to} className={`rounded py-2.5 tabular-nums ${odColor(v)}`}>
                          {v.toLocaleString()}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Trips per sector pair over the last 24 hours. Warmer cells indicate heavier corridors.
          </p>
        </div>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`size-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}
