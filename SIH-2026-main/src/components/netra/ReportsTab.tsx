import { Download, FileSpreadsheet, RefreshCw, ShieldAlert, Sparkles } from "lucide-react";
import { useState } from "react";
import { CAMERAS, WATCHLIST } from "@/data/netra";

type ReportType = "trajectory" | "watchlist" | "analytics";

interface AuditRecord {
  id: string;
  timestamp: string;
  category: string;
  details: string;
  operator: string;
  status: "COMPLETED" | "FLAGGED" | "RESOLVED";
}

const DEMO_AUDIT_LOGS: AuditRecord[] = [
  {
    id: "REP-2026-0901",
    timestamp: "2026-09-08 19:14:22",
    category: "Watchlist Alert",
    details: "Critical match DL01AB1234 flagged at Junction 4 (Connaught Place)",
    operator: "NETRA-9081-DEL",
    status: "FLAGGED",
  },
  {
    id: "REP-2026-0902",
    timestamp: "2026-09-08 18:45:10",
    category: "Trajectory Query",
    details: "Full 12-hour spatial reconstruction executed for plate MH02CD5678",
    operator: "NETRA-4092-MUM",
    status: "COMPLETED",
  },
  {
    id: "REP-2026-0903",
    timestamp: "2026-09-08 17:30:00",
    category: "Speed Enforcement",
    details: "Automated speed violation event (112 km/h in 60 zone) detected at Node 12",
    operator: "NETRA-1823-BLR",
    status: "RESOLVED",
  },
  {
    id: "REP-2026-0904",
    timestamp: "2026-09-08 16:15:44",
    category: "Node Calibration",
    details: "ANPR Camera #CAM-008 firmware telemetry verification passed",
    operator: "SYSTEM_AUTO",
    status: "COMPLETED",
  },
  {
    id: "REP-2026-0905",
    timestamp: "2026-09-08 14:02:18",
    category: "Watchlist Sync",
    details: "National Crime Records Database (NCRB) sync imported 14 new stolen vehicle plates",
    operator: "NETRA-9081-DEL",
    status: "COMPLETED",
  },
];

export function ReportsTab() {
  const [reportType, setReportType] = useState<ReportType>("watchlist");
  const [dateRange, setDateRange] = useState("today");
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExportCSV = () => {
    setIsExporting(true);
    setExportSuccess(false);

    setTimeout(() => {
      let headers = "";
      let rows = "";

      if (reportType === "watchlist") {
        headers = "Plate,AddedBy,Reason,Severity,AddedOn,Status\n";
        rows = WATCHLIST.map(
          (w) => `"${w.plate}","${w.addedBy}","${w.reason}","${w.severity}","${w.addedOn}","Active"`
        ).join("\n");
      } else if (reportType === "trajectory") {
        headers = "RecordID,Timestamp,Category,Details,Operator,Status\n";
        rows = DEMO_AUDIT_LOGS.map(
          (l) => `"${l.id}","${l.timestamp}","${l.category}","${l.details}","${l.operator}","${l.status}"`
        ).join("\n");
      } else {
        headers = "CameraID,Name,Sector,Throughput,OnlineStatus\n";
        rows = CAMERAS.map(
          (c) => `"${c.id}","${c.name}","${c.sector}","${c.throughput} veh/h","Online"`
        ).join("\n");
      }

      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute("download", `netra_${reportType}_report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-panel p-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="size-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Command Audit &amp; Intelligence Reports</h2>
          </div>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            Generate, filter, and export municipal surveillance logs and trajectory audits (ISO 27001 compliant)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-md transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
          >
            {isExporting ? (
              <RefreshCw className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            {isExporting ? "Generating CSV..." : "Export CSV Report"}
          </button>
        </div>
      </div>

      {exportSuccess && (
        <div className="flex items-center gap-2.5 rounded-lg border border-ok/40 bg-ok/15 p-3.5 text-xs text-ok animate-in fade-in">
          <Sparkles className="size-4 shrink-0" />
          <span>Report exported successfully! CSV download started in your browser.</span>
        </div>
      )}

      {/* Controls / Filter Panel */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-panel p-4">
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as ReportType)}
            className="w-full rounded-lg border border-border bg-panel-elevated p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
          >
            <option value="watchlist">Security Watchlist &amp; Blacklist Hits</option>
            <option value="trajectory">Vehicle Trajectory &amp; Query Audit Logs</option>
            <option value="analytics">Node Telemetry &amp; Camera Grid Health</option>
          </select>
        </div>

        <div className="rounded-xl border border-border bg-panel p-4">
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Time Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full rounded-lg border border-border bg-panel-elevated p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
          >
            <option value="today">Today (Past 24 Hours)</option>
            <option value="7days">Past 7 Days</option>
            <option value="30days">Past 30 Days (Monthly Audit)</option>
          </select>
        </div>

        <div className="rounded-xl border border-border bg-panel p-4">
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Compliance Security Seal
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-panel-elevated p-2.5 text-xs font-mono text-muted-foreground">
            <ShieldAlert className="size-4 text-ok" />
            <span>SHA-256 Verified Log Integrity</span>
          </div>
        </div>
      </div>

      {/* Audit Log Table Preview */}
      <div className="rounded-xl border border-border bg-panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
            Report Data Preview ({reportType === "watchlist" ? WATCHLIST.length : DEMO_AUDIT_LOGS.length} Entries)
          </h3>
          <span className="font-mono text-[10px] text-muted-foreground">Filtered: {dateRange}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-panel-elevated/50 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Log ID / Plate</th>
                <th className="px-5 py-3">Timestamp / Added By</th>
                <th className="px-5 py-3">Category / Reason</th>
                <th className="px-5 py-3">Operator / Severity</th>
                <th className="px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-mono">
              {reportType === "watchlist"
                ? WATCHLIST.map((w) => (
                    <tr key={w.plate} className="hover:bg-panel-elevated/40">
                      <td className="px-5 py-3 font-bold text-foreground">{w.plate}</td>
                      <td className="px-5 py-3 text-muted-foreground">{w.addedBy}</td>
                      <td className="px-5 py-3 text-foreground">{w.reason}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-[10px] uppercase font-bold ${
                            w.severity === "critical"
                              ? "bg-alert/20 text-alert border border-alert/30"
                              : w.severity === "high"
                              ? "bg-warn/20 text-warn border border-warn/30"
                              : "bg-panel-elevated text-muted-foreground"
                          }`}
                        >
                          {w.severity}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right text-ok">ACTIVE</td>
                    </tr>
                  ))
                : DEMO_AUDIT_LOGS.map((log) => (
                    <tr key={log.id} className="hover:bg-panel-elevated/40">
                      <td className="px-5 py-3 font-bold text-foreground">{log.id}</td>
                      <td className="px-5 py-3 text-muted-foreground">{log.timestamp}</td>
                      <td className="px-5 py-3 text-foreground">{log.details}</td>
                      <td className="px-5 py-3 text-muted-foreground">{log.operator}</td>
                      <td className="px-5 py-3 text-right">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            log.status === "FLAGGED"
                              ? "bg-alert/20 text-alert"
                              : log.status === "RESOLVED"
                              ? "bg-warn/20 text-warn"
                              : "bg-ok/20 text-ok"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
