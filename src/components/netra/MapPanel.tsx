import { lazy, Suspense, useEffect, useState } from "react";
import type { LeafletMapProps } from "./LeafletMap";

const LeafletMap = lazy(() => import("./LeafletMap"));

function MapSkeleton() {
  return (
    <div className="grid h-full w-full place-items-center grid-backdrop bg-panel">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Initialising grid overlay…
      </span>
    </div>
  );
}

export default function MapPanel(props: LeafletMapProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <MapSkeleton />;
  return (
    <Suspense fallback={<MapSkeleton />}>
      <LeafletMap {...props} />
    </Suspense>
  );
}
