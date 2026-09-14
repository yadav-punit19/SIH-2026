import { useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  Clock3,
  Filter,
  Flame,
  Minus,
  RefreshCw,
  Search,
  ShieldAlert,
  Signal,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CAMERAS,
  SECTORS,
  predictCongestionForCamera,
  type Camera,
  type CongestionPrediction,
} from "@/data/netra";

const TIME_HORIZONS = [
  { minutes: 15, label: "+15 Mins" },
  { minutes: 30, label: "+30 Mins" },
  { minutes: 60, label: "+1 Hour" },
  { minutes: 120, label: "+2 Hours" },
  { minutes: 240, label: "+4 Hours" },
] as const;

export function CongestionTab() {
  const [horizon, setHorizon] = useState<number>(30);
  const [selectedSector, setSelectedSector] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeAdvisories, setActiveAdvisories] = useState<Record<string, string>>({});
  const [mitigatingNodes, setMitigatingNodes] = useState<Record<string, boolean>>({});

  // Compute predictions for all cameras for selected horizon
  const predictions: CongestionPrediction[] = CAMERAS.map((cam) =>
    predictCongestionForCamera(cam, horizon)
  );

  // Filtered cameras based on sector & search query
  const filteredPredictions = predictions.filter((p) => {
    const matchesSector = selectedSector === "ALL" || p.sector === selectedSector;
    const matchesSearch =
      p.cameraName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.cameraId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sector.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  // Summary Metrics
  const criticalNodes = predictions.filter((p) => p.riskLevel === "critical");
  const moderateNodes = predictions.filter((p) => p.riskLevel === "moderate");
  const topBottleneck = [...predictions].sort(
    (a, b) => b.predictedCongestion - a.predictedCongestion
  )[0];

  // Recharts predictive curve data by sector
  const sectorTrends = SECTORS.map((sec) => {
    const secCams = predictions.filter((p) => p.sector === sec);
    const avgCurrent =
      secCams.length > 0
        ? secCams.reduce((acc, c) => acc + c.currentCongestion, 0) / secCams.length
        : 0;
    const avgPredicted =
      secCams.length > 0
        ? secCams.reduce((acc, c) => acc + c.predictedCongestion, 0) / secCams.length
        : 0;
    return {
      sector: sec,
      current: Math.round(avgCurrent * 100),
      predicted: Math.round(avgPredicted * 100),
    };
  });

  const handleMitigateSignal = (cameraId: string) => {
    setMitigatingNodes((prev) => ({ ...prev, [cameraId]: true }));
    setActiveAdvisories((prev) => ({
      ...prev,
      [cameraId]: "Green signal timing extended by +20s. Monitoring traffic drain.",
    }));
    setTimeout(() => {
      setMitigatingNodes((prev) => ({ ...prev, [cameraId]: false }));
    }, 1500);
  };

  return (
    <div className="p-4 space-y-6 lg:p-6">
      {/* Top Header & Horizon Selector */}
      <div className="flex flex-col gap-4 justify-between items-start md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex justify-center items-center rounded-md size-8 bg-sky-500/10 text-sky-400">
              <TrendingUp className="size-5" />
            </span>
            <h1 className="font-mono text-xl font-bold uppercase tracking-wider text-foreground">
              Predictive Congestion Management Engine
            </h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            AI-driven spatial forecasting & real-time node bottleneck alert mitigation across 32 surveillance nodes
          </p>
        </div>

        {/* Time Horizon Selector Buttons */}
        <div className="flex flex-wrap gap-1.5 items-center p-1 rounded-lg border border-border bg-panel">
          <span className="px-2 font-mono text-[10px] uppercase text-muted-foreground flex items-center gap-1">
            <Clock3 className="size-3" /> Forecast Horizon:
          </span>
          {TIME_HORIZONS.map((h) => (
            <button
              key={h.minutes}
              type="button"
              onClick={() => setHorizon(h.minutes)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${
                horizon === h.minutes
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Alert Banner if any Node is at Critical Congestion */}
      {criticalNodes.length > 0 && (
        <div className="p-4 border rounded-xl bg-red-950/30 border-red-500/40 text-red-200 animate-pulse shadow-lg shadow-red-950/20">
          <div className="flex flex-col gap-3 justify-between items-start md:flex-row md:items-center">
            <div className="flex gap-3 items-center">
              <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                <AlertTriangle className="size-6" />
              </div>
              <div>
                <div className="flex gap-2 items-center font-mono text-sm font-bold tracking-wide uppercase text-red-300">
                  <span>CRITICAL NODE CONGESTION ALERT</span>
                  <span className="px-2 py-0.5 text-[10px] bg-red-500 text-white font-mono rounded">
                    {criticalNodes.length} Nodes &gt; 75%
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-red-200/90">
                  Critical bottleneck detected at{" "}
                  <strong className="text-white">{topBottleneck?.cameraName}</strong> (
                  {topBottleneck?.sector} Sector) with predicted congestion reaching{" "}
                  <span className="font-mono font-bold text-red-400">
                    {Math.round((topBottleneck?.predictedCongestion ?? 0) * 100)}%
                  </span>{" "}
                  within {horizon} minutes.
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <button
                type="button"
                onClick={() => topBottleneck && handleMitigateSignal(topBottleneck.cameraId)}
                className="px-3 py-1.5 text-xs font-mono font-semibold bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow"
              >
                <Zap className="size-3.5" /> Extend Signal Timing (+20s)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="p-4 rounded-xl border border-border bg-panel/70">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="font-mono text-xs uppercase tracking-wider">Critical Risk Nodes</span>
            <Flame className="size-4 text-red-400" />
          </div>
          <div className="flex gap-2 items-baseline mt-2">
            <span className="font-mono text-2xl font-bold text-red-400">
              {criticalNodes.length}
            </span>
            <span className="text-xs text-muted-foreground">/ {CAMERAS.length} Total Nodes</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Nodes predicted &gt;75% gridlock within {horizon}m
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-xl border border-border bg-panel/70">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="font-mono text-xs uppercase tracking-wider">Highest Risk Bottleneck</span>
            <ShieldAlert className="size-4 text-amber-400" />
          </div>
          <div className="mt-2 truncate font-mono text-base font-bold text-foreground">
            {topBottleneck?.cameraName ?? "N/A"}
          </div>
          <div className="flex gap-2 items-center mt-1 text-xs text-amber-400">
            <span>Sector: {topBottleneck?.sector}</span>
            <span>•</span>
            <span className="font-mono font-bold">
              {Math.round((topBottleneck?.predictedCongestion ?? 0) * 100)}% Risk
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-xl border border-border bg-panel/70">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="font-mono text-xs uppercase tracking-wider">Moderate Build-up</span>
            <Signal className="size-4 text-amber-400" />
          </div>
          <div className="flex gap-2 items-baseline mt-2">
            <span className="font-mono text-2xl font-bold text-amber-400">
              {moderateNodes.length}
            </span>
            <span className="text-xs text-muted-foreground">Nodes (50-75%)</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Stable arterial flow with moderate queue buildup
          </p>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded-xl border border-border bg-panel/70">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="font-mono text-xs uppercase tracking-wider">Forecast Horizon</span>
            <Clock className="size-4 text-sky-400" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-sky-400">
            +{horizon} Mins
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Predictive time-series algorithm active
          </p>
        </div>
      </div>

      {/* Sector Congestion Forecast Chart */}
      <div className="p-4 rounded-xl border border-border bg-panel/70">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
              Sector-Wise Baseline vs. Predicted Congestion ({+horizon} Mins Horizon)
            </h3>
            <p className="text-xs text-muted-foreground">
              Average predicted congestion percentage across city arterial sectors
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sectorTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="sector" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="current"
                name="Current Congestion (%)"
                stroke="#0284c7"
                fillOpacity={1}
                fill="url(#colorCurrent)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="predicted"
                name={`Predicted (+${horizon}m %)`}
                stroke="#f43f5e"
                fillOpacity={1}
                fill="url(#colorPredicted)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive 32 Camera Nodes Congestion Risk Matrix Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-panel/70">
        {/* Table Controls Header */}
        <div className="flex flex-col gap-3 justify-between items-start p-4 border-b border-border bg-panel md:flex-row md:items-center">
          <div>
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
              Node-by-Node Predictive Congestion Matrix ({filteredPredictions.length} Nodes)
            </h3>
            <p className="text-xs text-muted-foreground">
              Live & predicted node congestion indices, trend indicators, and traffic signal control actions
            </p>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search camera node or sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-1.5 pr-3 pl-8 w-56 font-mono text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Sector Filter Dropdown */}
            <div className="flex gap-1.5 items-center px-2.5 py-1.5 font-mono text-xs rounded-lg border border-border bg-background">
              <Filter className="size-3.5 text-muted-foreground" />
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="bg-transparent cursor-pointer text-foreground focus:outline-none"
              >
                <option value="ALL">All Sectors ({SECTORS.length})</option>
                {SECTORS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs text-left">
            <thead className="border-b border-border bg-muted/40 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Node ID / Location</th>
                <th className="px-4 py-3">Sector</th>
                <th className="px-4 py-3">Current Congestion</th>
                <th className="px-4 py-3">Predicted (+{horizon}m)</th>
                <th className="px-4 py-3">Delta Trend</th>
                <th className="px-4 py-3">Risk Level</th>
                <th className="px-4 py-3">Advisory & Signal Mitigation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredPredictions.map((pred) => {
                const currentPct = Math.round(pred.currentCongestion * 100);
                const predictedPct = Math.round(pred.predictedCongestion * 100);
                const isMitigating = mitigatingNodes[pred.cameraId];
                const activeAdvisory = activeAdvisories[pred.cameraId];

                return (
                  <tr
                    key={pred.cameraId}
                    className={`hover:bg-muted/20 transition-colors ${
                      pred.riskLevel === "critical" ? "bg-red-950/10" : ""
                    }`}
                  >
                    {/* Node ID & Name */}
                    <td className="px-4 py-3 font-semibold text-foreground">
                      <div className="flex gap-2 items-center">
                        <span className="px-1.5 py-0.5 font-mono text-[10px] rounded bg-muted text-muted-foreground">
                          {pred.cameraId}
                        </span>
                        <span>{pred.cameraName}</span>
                      </div>
                    </td>

                    {/* Sector */}
                    <td className="px-4 py-3 text-muted-foreground">{pred.sector}</td>

                    {/* Current Congestion Progress */}
                    <td className="px-4 py-3">
                      <div className="flex gap-2 items-center">
                        <div className="overflow-hidden w-24 h-2 rounded-full bg-muted">
                          <div
                            className={`h-full ${
                              currentPct >= 75
                                ? "bg-red-500"
                                : currentPct >= 50
                                ? "bg-amber-500"
                                : "bg-sky-500"
                            }`}
                            style={{ width: `${currentPct}%` }}
                          />
                        </div>
                        <span className="font-bold">{currentPct}%</span>
                      </div>
                    </td>

                    {/* Predicted Congestion Progress */}
                    <td className="px-4 py-3">
                      <div className="flex gap-2 items-center">
                        <div className="overflow-hidden w-24 h-2 rounded-full bg-muted">
                          <div
                            className={`h-full ${
                              predictedPct >= 75
                                ? "bg-red-500"
                                : predictedPct >= 50
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${predictedPct}%` }}
                          />
                        </div>
                        <span className="font-bold">{predictedPct}%</span>
                      </div>
                    </td>

                    {/* Delta Trend */}
                    <td className="px-4 py-3">
                      <div className="flex gap-1 items-center">
                        {pred.trend === "rising" && (
                          <span className="flex gap-0.5 items-center text-red-400">
                            <ArrowUpRight className="size-3.5" /> +
                            {Math.round(pred.congestionDelta * 100)}%
                          </span>
                        )}
                        {pred.trend === "easing" && (
                          <span className="flex gap-0.5 items-center text-emerald-400">
                            <ArrowDownRight className="size-3.5" />
                            {Math.round(pred.congestionDelta * 100)}%
                          </span>
                        )}
                        {pred.trend === "stable" && (
                          <span className="flex gap-0.5 items-center text-muted-foreground">
                            <Minus className="size-3.5" /> Stable
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Risk Badge */}
                    <td className="px-4 py-3">
                      {pred.riskLevel === "critical" && (
                        <span className="px-2 py-0.5 font-mono text-[10px] font-bold uppercase rounded border bg-red-500/20 text-red-400 border-red-500/30">
                          CRITICAL
                        </span>
                      )}
                      {pred.riskLevel === "moderate" && (
                        <span className="px-2 py-0.5 font-mono text-[10px] font-bold uppercase rounded border bg-amber-500/20 text-amber-400 border-amber-500/30">
                          MODERATE
                        </span>
                      )}
                      {pred.riskLevel === "low" && (
                        <span className="px-2 py-0.5 font-mono text-[10px] font-bold uppercase rounded border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          NORMAL
                        </span>
                      )}
                    </td>

                    {/* Advisory & Mitigation Action */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] truncate max-w-xs text-muted-foreground">
                          {activeAdvisory ?? pred.advisory}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleMitigateSignal(pred.cameraId)}
                          disabled={isMitigating}
                          className="flex gap-1 items-center self-start px-2.5 py-1 text-[10px] rounded border transition-colors bg-muted hover:bg-muted/80 text-foreground border-border disabled:opacity-50"
                        >
                          {isMitigating ? (
                            <>
                              <RefreshCw className="size-3 animate-spin" /> Adjusting Signal...
                            </>
                          ) : (
                            <>
                              <Signal className="size-3 text-sky-400" /> Extend Signal (+20s)
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
