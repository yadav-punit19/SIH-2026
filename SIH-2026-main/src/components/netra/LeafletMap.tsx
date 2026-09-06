import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { CAMERAS, cameraById, type Waypoint } from "@/data/netra";

export type LeafletMapProps = {
  route?: Waypoint[] | undefined;
  activeOrder?: number | undefined;
  onWaypointClick?: ((order: number) => void) | undefined;
  heat?: boolean | undefined;
};

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    map.fitBounds(L.latLngBounds(points), { padding: [56, 56], maxZoom: 14 });
  }, [map, JSON.stringify(points)]);
  return null;
}

function congestionColor(c: number) {
  if (c >= 0.8) return "#f43f5e";
  if (c >= 0.65) return "#f59e0b";
  return "#10b981";
}

export default function LeafletMap({
  route = [],
  activeOrder,
  onWaypointClick,
  heat = false,
}: LeafletMapProps) {
  const routePoints: [number, number][] = route.map((w) => {
    const cam = cameraById(w.cameraId);
    return [cam.lat, cam.lng];
  });

  const fitPoints = routePoints.length ? routePoints : CAMERAS.map((c) => [c.lat, c.lng] as [number, number]);

  return (
    <MapContainer
      center={[28.62, 77.2]}
      zoom={12}
      scrollWheelZoom
      className="h-full w-full"
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap &copy; CARTO"
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <FitBounds points={fitPoints} />

      {heat &&
        CAMERAS.map((cam) => (
          <CircleMarker
            key={`heat-${cam.id}`}
            center={[cam.lat, cam.lng]}
            radius={16 + cam.congestion * 34}
            pathOptions={{
              color: "transparent",
              fillColor: congestionColor(cam.congestion),
              fillOpacity: 0.16 + cam.congestion * 0.22,
            }}
          />
        ))}

      {CAMERAS.map((cam) => (
        <CircleMarker
          key={cam.id}
          center={[cam.lat, cam.lng]}
          radius={heat && cam.congestion >= 0.8 ? 8 : 5}
          pathOptions={{
            color: heat ? congestionColor(cam.congestion) : "#38bdf8",
            weight: 2,
            fillColor: heat ? congestionColor(cam.congestion) : "#38bdf8",
            fillOpacity: 0.85,
          }}
        >
          <Tooltip direction="top" offset={[0, -6]}>
            <span className="font-mono text-[11px]">
              {cam.id} · {cam.name}
              {heat ? ` · ${Math.round(cam.congestion * 100)}% load` : ""}
            </span>
          </Tooltip>
        </CircleMarker>
      ))}

      {routePoints.length > 1 && (
        <>
          <Polyline positions={routePoints} pathOptions={{ color: "#38bdf8", weight: 3, opacity: 0.85 }} />
          <Polyline
            positions={routePoints}
            pathOptions={{ color: "#38bdf8", weight: 12, opacity: 0.12 }}
          />
        </>
      )}

      {route.map((w, i) => {
        const cam = cameraById(w.cameraId);
        const isActive = activeOrder === w.order;
        return (
          <Marker
            key={`wp-${w.order}`}
            position={[cam.lat, cam.lng]}
            icon={L.divIcon({
              className: "",
              html: `<div class="netra-badge${isActive ? " is-active" : ""}">${i + 1}</div>`,
              iconSize: [26, 26],
              iconAnchor: [13, 13],
            })}
            eventHandlers={{ click: () => onWaypointClick?.(w.order) }}
          />
        );
      })}
    </MapContainer>
  );
}
