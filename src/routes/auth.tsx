import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Camera, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — Netra Command" },
      {
        name: "description",
        content:
          "Authorized personnel sign-in for the Netra municipal traffic and surveillance command dashboard.",
      },
      { property: "og:title", content: "Sign In — Netra Command" },
      {
        property: "og:description",
        content: "Authorized personnel sign-in for the Netra command dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        navigate({ to: "/", replace: true });
      } else {
        setChecking(false);
      }
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setError("Access denied — verify your credentials and try again.");
      return;
    }
    navigate({ to: "/", replace: true });
  }

  return (
    <div className="grid-backdrop flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 grid size-14 place-items-center rounded-xl border border-primary/40 bg-primary/15">
            <Camera className="size-7 text-primary" />
          </span>
          <h1 className="text-lg font-bold tracking-wide">
            NETRA <span className="font-mono text-[10px] font-normal uppercase tracking-[0.2em] text-muted-foreground">v2.4</span>
          </h1>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Municipal command access
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-xl border border-border bg-panel p-6 shadow-2xl shadow-black/40"
        >
          <div className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <ShieldCheck className="size-3.5 text-ok" />
            Restricted — authorized personnel only
          </div>

          <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground" htmlFor="email">
            Operator email
          </label>
          <div className="relative mb-4">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@netra.gov"
              className="w-full rounded-md border border-input bg-panel-elevated py-2.5 pl-9 pr-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
            />
          </div>

          <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground" htmlFor="password">
            Password
          </label>
          <div className="relative mb-5">
            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-md border border-input bg-panel-elevated py-2.5 pl-9 pr-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
            />
          </div>

          {error && (
            <p className="mb-4 rounded-md border border-alert/50 bg-alert-soft/40 px-3 py-2 font-mono text-xs text-alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy || checking}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {busy && <Loader2 className="size-4 animate-spin" />}
            {busy ? "Verifying…" : "Sign in"}
          </button>

          <p className="mt-4 text-center font-mono text-[10px] text-muted-foreground/70">
            Accounts are provisioned by the system administrator.
          </p>
        </form>
      </div>
    </div>
  );
}
