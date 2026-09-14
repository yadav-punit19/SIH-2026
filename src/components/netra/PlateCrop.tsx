export function PlateCrop({ plate, cameraId }: { plate: string; cameraId: string }) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-[oklch(0.16_0.015_258)]">
      <div className="flex items-center justify-between border-b border-border px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <span>ANPR crop · {cameraId}</span>
        <span className="text-ok">IR</span>
      </div>
      <div
        className="relative grid place-items-center py-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, oklch(0.24 0.01 258) 0px, oklch(0.24 0.01 258) 1px, oklch(0.2 0.01 258) 1px, oklch(0.2 0.01 258) 3px)",
        }}
      >
        <div className="rounded-[3px] border-2 border-warn/70 bg-[oklch(0.9_0.02_100)] px-3 py-1 font-mono text-lg font-bold tracking-[0.14em] text-[oklch(0.18_0.02_250)] shadow-[0_0_18px_oklch(0.82_0.15_82/0.25)]">
          {plate}
        </div>
        <span className="absolute bottom-1 right-2 font-mono text-[9px] text-muted-foreground">
          1280×720 · crop 0.42
        </span>
      </div>
    </div>
  );
}
