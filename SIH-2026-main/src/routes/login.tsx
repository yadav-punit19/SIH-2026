import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Camera,
  CheckCircle2,
  Eye,
  Fingerprint,
  KeyRound,
  Lock,
  Radio,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import React, { useState, type FormEvent } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Netra — Operator Command Authentication" },
      {
        name: "description",
        content: "Secure municipal surveillance operator login and clearance verification for the Netra ANPR Grid.",
      },
    ],
  }),
  component: LoginComponent,
});

const DEMO_PRESETS = [
  {
    role: "Chief Traffic Inspector",
    badge: "NETRA-9081-DEL",
    unit: "ANPR Trajectory & Surveillance",
    clearance: "Level 4 (Full Access)",
  },
  {
    role: "ANPR Operations Specialist",
    badge: "NETRA-4092-MUM",
    unit: "Macro Traffic Analytics",
    clearance: "Level 3 (Command)",
  },
  {
    role: "Watchlist Security Desk",
    badge: "NETRA-1823-BLR",
    unit: "Law Enforcement Alert Grid",
    clearance: "Level 3 (Alert Dispatch)",
  },
];

function LoginComponent() {
  const navigate = useNavigate();
  const [badgeId, setBadgeId] = useState("NETRA-9081-DEL");
  const [securityKey, setSecurityKey] = useState("admin123456");
  const [department, setDepartment] = useState("ANPR Trajectory & Surveillance");
  const [rememberSession, setRememberSession] = useState(true);
  const [showKey, setShowKey] = useState(false);

  const [authStep, setAuthStep] = useState<"idle" | "scanning" | "verifying" | "granted">("idle");
  const [authProgress, setAuthProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!badgeId.trim() || !securityKey.trim()) {
      setErrorMessage("Please enter both Badge ID and Security Clearance Key.");
      return;
    }

    setErrorMessage("");
    setAuthStep("scanning");
    setAuthProgress(25);

    setTimeout(() => {
      setAuthStep("verifying");
      setAuthProgress(70);
    }, 600);

    setTimeout(() => {
      setAuthStep("granted");
      setAuthProgress(100);

      const activePreset = DEMO_PRESETS.find((p) => p.badge === badgeId) || {
        role: "Command Officer",
        badge: badgeId,
        unit: department,
        clearance: "Level 3 Authorized",
      };

      localStorage.setItem("netra_operator", JSON.stringify(activePreset));

      setTimeout(() => {
        navigate({ to: "/" });
      }, 500);
    }, 1300);
  };

  const applyPreset = (preset: (typeof DEMO_PRESETS)[0]) => {
    setBadgeId(preset.badge);
    setDepartment(preset.unit);
    setSecurityKey("operator-passkey-verified");
    setErrorMessage("");
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background font-sans text-foreground selection:bg-primary/30 selection:text-primary">
      {/* Dynamic Cyber Ambient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background" />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d15_1px,transparent_1px),linear-gradient(to_bottom,#1f293d15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
        aria-hidden="true"
      />

      {/* Top Header System Clearance Banner */}
      <header className="absolute top-0 inset-x-0 z-10 flex items-center justify-between border-b border-border/60 bg-panel/70 px-6 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-lg border border-primary/40 bg-primary/20 text-primary">
            <Camera className="size-4" />
          </span>
          <div>
            <h2 className="text-xs font-bold tracking-wider text-foreground">
              NETRA COMMAND SYSTEM <span className="font-mono text-[10px] text-muted-foreground">v2.4</span>
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Municipal Traffic & Surveillance Intelligence Grid
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-4 text-xs font-mono md:flex">
          <div className="flex items-center gap-2 rounded-full border border-ok/30 bg-ok/10 px-3 py-1 text-ok">
            <Radio className="size-3 animate-pulse" />
            <span>Encrypted Node Gateway Active</span>
          </div>
          <span className="text-muted-foreground/60">|</span>
          <span className="text-muted-foreground">Restricted Access (Official Use Only)</span>
        </div>
      </header>

      {/* Main Login Panel Card */}
      <main className="relative z-20 w-full max-w-lg px-4 py-16">
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-panel/80 p-6 shadow-2xl backdrop-blur-xl md:p-8">
          {/* Subtle top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

          {/* Header Title */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 shadow-[0_0_20px_rgba(2,132,199,0.2)]">
              <ShieldCheck className="size-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Operator Authentication</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Verify your security clearance to access municipal ANPR feeds & route reconstruction
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-alert/40 bg-alert/15 p-3 text-xs text-alert animate-in fade-in">
              <AlertTriangle className="size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Operator Badge ID */}
            <div>
              <label htmlFor="badgeId" className="mb-1.5 flex items-center justify-between text-xs font-medium text-foreground">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="size-3.5 text-primary" />
                  Operator Badge ID
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">Format: NETRA-XXXX-AAA</span>
              </label>
              <div className="relative">
                <input
                  id="badgeId"
                  type="text"
                  value={badgeId}
                  onChange={(e) => setBadgeId(e.target.value)}
                  placeholder="e.g. NETRA-9081-DEL"
                  disabled={authStep !== "idle"}
                  className="w-full rounded-xl border border-border bg-panel-elevated px-4 py-2.5 font-mono text-sm uppercase text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                  required
                />
              </div>
            </div>

            {/* Department Selection */}
            <div>
              <label htmlFor="department" className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-foreground">
                <Building2 className="size-3.5 text-primary" />
                Assigned Command Unit
              </label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                disabled={authStep !== "idle"}
                className="w-full rounded-xl border border-border bg-panel-elevated px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
              >
                <option value="ANPR Trajectory & Surveillance">ANPR Trajectory & Surveillance Command</option>
                <option value="Macro Traffic Analytics">Macro Traffic Flow & Congestion Control</option>
                <option value="Law Enforcement Alert Grid">Security Watchlist & Rapid Patrol Response</option>
                <option value="Municipal Fleet Supervisor">Municipal Public Safety Fleet Division</option>
              </select>
            </div>

            {/* Security Clearance Key */}
            <div>
              <label htmlFor="securityKey" className="mb-1.5 flex items-center justify-between text-xs font-medium text-foreground">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="size-3.5 text-primary" />
                  Security Clearance Key
                </span>
                <span className="font-mono text-[10px] text-primary">AES-256</span>
              </label>
              <div className="relative">
                <input
                  id="securityKey"
                  type={showKey ? "text" : "password"}
                  value={securityKey}
                  onChange={(e) => setSecurityKey(e.target.value)}
                  placeholder="Enter security key"
                  disabled={authStep !== "idle"}
                  className="w-full rounded-xl border border-border bg-panel-elevated pl-4 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Toggle password visibility"
                >
                  <Eye className="size-4" />
                </button>
              </div>
            </div>

            {/* Remember Session Checkbox */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={(e) => setRememberSession(e.target.checked)}
                  className="size-4 rounded border-border bg-panel-elevated text-primary focus:ring-primary focus:ring-offset-background"
                />
                Maintain persistent command session
              </label>
              <span className="font-mono text-[10px] text-muted-foreground/80">Terminal 04-A</span>
            </div>

            {/* Biometric Verification Widget & Submit Button */}
            <div className="pt-3">
              {authStep !== "idle" ? (
                <div className="space-y-3 rounded-xl border border-primary/40 bg-primary/10 p-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <Fingerprint className="size-6 text-primary animate-pulse" />
                    <span className="font-mono text-xs font-semibold text-primary">
                      {authStep === "scanning" && "Scanning Biometric Hardware & Badge..."}
                      {authStep === "verifying" && "Verifying Security Token with Command Grid..."}
                      {authStep === "granted" && "Authentication Granted! Launching Netra..."}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full bg-gradient-to-r from-primary via-cyan-400 to-ok transition-all duration-500 ease-out"
                      style={{ width: `${authProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <button
                  type="submit"
                  className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30 active:scale-[0.99]"
                >
                  <Lock className="size-4 transition-transform group-hover:scale-110" />
                  Authenticate & Launch Command Center
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </button>
              )}
            </div>
          </form>

          {/* Quick Demo Credentials Presets */}
          <div className="mt-6 border-t border-border/60 pt-5">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                <Sparkles className="size-3 text-primary" /> Quick Demo Command Profiles
              </span>
              <span className="font-mono text-[10px] text-muted-foreground/70">1-Click Auto Fill</span>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              {DEMO_PRESETS.map((preset) => (
                <button
                  key={preset.badge}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`flex flex-col items-start rounded-lg border p-2.5 text-left transition-all hover:border-primary/50 hover:bg-panel-elevated ${
                    badgeId === preset.badge
                      ? "border-primary/60 bg-primary/10 text-primary"
                      : "border-border bg-panel/60 text-muted-foreground"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-mono text-[10px] font-bold tracking-wider">{preset.badge}</span>
                    {badgeId === preset.badge && <CheckCircle2 className="size-3 text-primary" />}
                  </div>
                  <span className="mt-1 line-clamp-1 text-[11px] font-semibold text-foreground">{preset.role}</span>
                  <span className="font-mono text-[9px] text-muted-foreground/80">{preset.clearance}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security Compliance Footer Notice */}
        <p className="mt-4 text-center font-mono text-[10px] text-muted-foreground/60">
          AUTHORIZED MUNICIPAL PERSONNEL ONLY · ALL LOGINS & ANPR SEARCHES LOGGED FOR AUDIT (ISO/IEC 27001)
        </p>
      </main>
    </div>
  );
}
