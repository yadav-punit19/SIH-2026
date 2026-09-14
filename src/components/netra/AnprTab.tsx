import { useServerFn } from "@tanstack/react-start";
import {
  Camera as CameraIcon,
  Cpu,
  ImageUp,
  Loader2,
  ScanLine,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Video,
  VideoOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CAMERAS, WATCHLIST } from "@/data/netra";
import { recognizePlate, type AnprResult } from "@/lib/anpr.functions";

type LogEntry = AnprResult & {
  id: number;
  at: string;
  cameraId: string;
  thumb: string;
};

const MAX_EDGE = 1280;

async function toDataUrl(file: File | Blob): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  return canvas.toDataURL("image/jpeg", 0.85);
}

export function AnprTab() {
  const run = useServerFn(recognizePlate);
  const [image, setImage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnprResult | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [cameraId, setCameraId] = useState(CAMERAS[0]?.id ?? "CAM-01");
  const [streaming, setStreaming] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextId = useRef(1);

  useEffect(
    () => () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    },
    [],
  );

  async function startCamera() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      setStreaming(true);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      });
    } catch {
      setError("Camera access was blocked. Upload a still frame instead.");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStreaming(false);
  }

  async function captureFrame() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, MAX_EDGE / Math.max(video.videoWidth, video.videoHeight));
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const url = canvas.toDataURL("image/jpeg", 0.85);
    setImage(url);
    setResult(null);
    await analyse(url);
  }

  async function handleFile(file: File) {
    setError(null);
    setResult(null);
    try {
      const url = await toDataUrl(file);
      setImage(url);
      await analyse(url);
    } catch {
      setError("That file could not be read as an image.");
    }
  }

  async function analyse(url: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await run({ data: { image: url } });
      setResult(res);
      setLog((prev) =>
        [
          {
            ...res,
            id: nextId.current++,
            at: new Date().toLocaleTimeString("en-GB", { hour12: false }),
            cameraId,
            thumb: url,
          },
          ...prev,
        ].slice(0, 25),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Recognition failed.");
    } finally {
      setBusy(false);
    }
  }

  const hit = result?.plateVisible ? WATCHLIST.find((w) => w.plate === result.plate) : undefined;

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-panel p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <Cpu className="size-3.5 text-primary" /> Netra ANPR inference engine
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Feed a CCTV still or a live camera frame — the vision model localises the plate and
                transcribes the registration number.
              </p>
            </div>
            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Source node
              </label>
              <select
                value={cameraId}
                onChange={(e) => setCameraId(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 font-mono text-xs outline-none focus:border-primary"
              >
                {CAMERAS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} · {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110">
              <ImageUp className="size-4" /> Upload frame
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleFile(f);
                  e.target.value = "";
                }}
              />
            </label>
            {streaming ? (
              <>
                <button
                  type="button"
                  onClick={() => void captureFrame()}
                  className="inline-flex items-center gap-2 rounded-md border border-primary/50 bg-primary/15 px-4 py-2.5 text-sm text-primary transition hover:bg-primary/25"
                >
                  <ScanLine className="size-4" /> Capture &amp; scan
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm text-muted-foreground transition hover:text-foreground"
                >
                  <VideoOff className="size-4" /> Stop feed
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => void startCamera()}
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm transition hover:border-primary/50"
              >
                <Video className="size-4" /> Use live camera
              </button>
            )}
          </div>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files?.[0];
            if (f) void handleFile(f);
          }}
          className={`overflow-hidden rounded-lg border bg-panel transition ${
            dragOver ? "border-primary" : "border-border"
          }`}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <span>Frame buffer · {cameraId}</span>
            {busy && (
              <span className="flex items-center gap-1.5 text-primary">
                <Loader2 className="size-3 animate-spin" /> inferring
              </span>
            )}
          </div>

          <div className="relative grid min-h-[320px] place-items-center grid-backdrop p-4">
            {streaming ? (
              <video
                ref={videoRef}
                muted
                playsInline
                className="max-h-[460px] w-full rounded-md object-contain"
              />
            ) : image ? (
              <img
                src={image}
                alt="CCTV frame submitted for plate recognition"
                className="max-h-[460px] w-full rounded-md object-contain"
              />
            ) : (
              <div className="text-center">
                <CameraIcon className="mx-auto size-8 text-muted-foreground/60" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Drop a CCTV frame here, or upload one above.
                </p>
              </div>
            )}
            {busy && (
              <div className="pointer-events-none absolute inset-4 rounded-md border border-primary/50">
                <div className="h-full w-full animate-pulse rounded-md bg-primary/5" />
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-alert/50 bg-alert/10 px-4 py-3 text-sm text-alert">
            {error}
          </div>
        )}

        {result && (
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div
              className={`rounded-lg border p-4 ${
                !result.plateVisible
                  ? "border-warn/50 bg-warn/10"
                  : hit
                    ? "border-alert/50 bg-alert/10"
                    : "border-ok/40 bg-ok/10"
              }`}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Recognised registration
              </p>
              <p className="mt-2 font-mono text-3xl font-bold tracking-[0.16em]">
                {result.plateVisible ? result.plate : "NO READ"}
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                confidence {Math.round(result.confidence * 100)}% · {result.inferenceMs} ms
              </p>
              <p
                className={`mt-3 flex items-center gap-2 text-sm font-semibold ${
                  hit ? "text-alert" : result.plateVisible ? "text-ok" : "text-warn"
                }`}
              >
                {hit ? <ShieldAlert className="size-4" /> : <ShieldCheck className="size-4" />}
                {hit
                  ? `BLACKLIST HIT — ${hit.reason}`
                  : result.plateVisible
                    ? "No active flags on this registration"
                    : "Plate not legible in this frame"}
              </p>
              {hit && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {hit.severity.toUpperCase()} · added {hit.addedOn} by {hit.addedBy}
                </p>
              )}
            </div>

            <div className="rounded-lg border border-border bg-panel p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Inference attributes
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <Field label="Vehicle type" value={result.vehicleType || "—"} />
                <Field label="Colour" value={result.vehicleColor || "—"} />
                <Field label="RTO / state" value={result.region || "—"} />
                <Field label="Model" value={result.model} />
              </dl>
              {result.notes && (
                <p className="mt-3 rounded-md border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
                  {result.notes}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <aside className="rounded-lg border border-border bg-panel">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Recognition log
          </p>
          {log.length > 0 && (
            <button
              type="button"
              onClick={() => setLog([])}
              className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition hover:text-foreground"
            >
              <Trash2 className="size-3" /> clear
            </button>
          )}
        </div>
        <ul className="max-h-[620px] divide-y divide-border overflow-auto">
          {log.map((e) => {
            const flagged = WATCHLIST.find((w) => w.plate === e.plate);
            return (
              <li key={e.id} className="flex items-center gap-3 px-4 py-3">
                <img
                  src={e.thumb}
                  alt={`Scanned frame for ${e.plate || "unreadable plate"}`}
                  className="size-12 shrink-0 rounded border border-border object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={`font-mono text-sm tracking-[0.12em] ${
                      flagged ? "text-alert" : e.plateVisible ? "text-foreground" : "text-warn"
                    }`}
                  >
                    {e.plateVisible ? e.plate : "NO READ"}
                  </p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {e.cameraId} · {e.at} · {Math.round(e.confidence * 100)}%
                  </p>
                </div>
                {flagged && <ShieldAlert className="size-4 shrink-0 text-alert" />}
              </li>
            );
          })}
          {log.length === 0 && (
            <li className="px-4 py-8 text-center text-xs text-muted-foreground">
              No scans in this session yet.
            </li>
          )}
        </ul>
      </aside>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background px-3 py-2">
      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 truncate font-mono text-xs">{value}</dd>
    </div>
  );
}
