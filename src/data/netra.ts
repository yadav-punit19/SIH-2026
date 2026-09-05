export type Camera = {
  id: string;
  name: string;
  sector: string;
  lat: number;
  lng: number;
  congestion: number; // 0-1
  throughput: number;
};

export const CAMERAS: Camera[] = [
  { id: "CAM-01", name: "Connaught Circus North", sector: "Central", lat: 28.6329, lng: 77.2195, congestion: 0.92, throughput: 4820 },
  { id: "CAM-02", name: "ITO Junction", sector: "Central", lat: 28.6289, lng: 77.2411, congestion: 0.87, throughput: 5310 },
  { id: "CAM-03", name: "Rajghat Corridor", sector: "East", lat: 28.6406, lng: 77.2497, congestion: 0.54, throughput: 2940 },
  { id: "CAM-04", name: "Kashmere Gate ISBT", sector: "North", lat: 28.6675, lng: 77.2281, congestion: 0.78, throughput: 4110 },
  { id: "CAM-05", name: "Chandni Chowk Gateway", sector: "North", lat: 28.656, lng: 77.2303, congestion: 0.81, throughput: 3760 },
  { id: "CAM-06", name: "AIIMS Flyover", sector: "South", lat: 28.5672, lng: 77.21, congestion: 0.69, throughput: 4390 },
  { id: "CAM-07", name: "Lajpat Nagar Ring Rd", sector: "South", lat: 28.5677, lng: 77.2433, congestion: 0.63, throughput: 3520 },
  { id: "CAM-08", name: "Dhaula Kuan Interchange", sector: "West", lat: 28.5921, lng: 77.1611, congestion: 0.74, throughput: 5020 },
  { id: "CAM-09", name: "Rajouri Garden Metro", sector: "West", lat: 28.6492, lng: 77.1206, congestion: 0.58, throughput: 3180 },
  { id: "CAM-10", name: "Punjabi Bagh Chowk", sector: "West", lat: 28.6742, lng: 77.1315, congestion: 0.47, throughput: 2610 },
];

export type Waypoint = {
  order: number;
  cameraId: string;
  timestamp: string;
  direction: string;
  speed: number;
  confidence: number;
};

export const TRACKS: Record<string, Waypoint[]> = {
  DL01AB1234: [
    { order: 1, cameraId: "CAM-09", timestamp: "2026-09-05T07:42:11", direction: "E", speed: 48, confidence: 0.97 },
    { order: 2, cameraId: "CAM-08", timestamp: "2026-09-05T07:56:03", direction: "NE", speed: 62, confidence: 0.94 },
    { order: 3, cameraId: "CAM-06", timestamp: "2026-09-05T08:09:47", direction: "NE", speed: 39, confidence: 0.91 },
    { order: 4, cameraId: "CAM-01", timestamp: "2026-09-05T08:24:20", direction: "N", speed: 27, confidence: 0.98 },
    { order: 5, cameraId: "CAM-02", timestamp: "2026-09-05T08:37:55", direction: "SE", speed: 31, confidence: 0.89 },
    { order: 6, cameraId: "CAM-03", timestamp: "2026-09-05T08:49:12", direction: "NE", speed: 55, confidence: 0.93 },
  ],
  HR26XY9087: [
    { order: 1, cameraId: "CAM-10", timestamp: "2026-09-05T09:10:04", direction: "S", speed: 51, confidence: 0.95 },
    { order: 2, cameraId: "CAM-09", timestamp: "2026-09-05T09:21:38", direction: "SE", speed: 44, confidence: 0.92 },
    { order: 3, cameraId: "CAM-08", timestamp: "2026-09-05T09:35:16", direction: "E", speed: 66, confidence: 0.9 },
    { order: 4, cameraId: "CAM-06", timestamp: "2026-09-05T09:47:02", direction: "NE", speed: 42, confidence: 0.96 },
    { order: 5, cameraId: "CAM-07", timestamp: "2026-09-05T09:58:44", direction: "E", speed: 37, confidence: 0.88 },
  ],
  UP16CD4455: [
    { order: 1, cameraId: "CAM-04", timestamp: "2026-09-05T06:31:00", direction: "SW", speed: 58, confidence: 0.93 },
    { order: 2, cameraId: "CAM-05", timestamp: "2026-09-05T06:44:29", direction: "SW", speed: 33, confidence: 0.9 },
    { order: 3, cameraId: "CAM-01", timestamp: "2026-09-05T06:58:51", direction: "S", speed: 29, confidence: 0.97 },
    { order: 4, cameraId: "CAM-06", timestamp: "2026-09-05T07:14:07", direction: "SW", speed: 47, confidence: 0.94 },
    { order: 5, cameraId: "CAM-08", timestamp: "2026-09-05T07:26:33", direction: "W", speed: 71, confidence: 0.91 },
  ],
};

export const HOURLY = Array.from({ length: 24 }, (_, h) => {
  const base = [820, 610, 430, 380, 520, 1240, 2680, 4310, 5620, 4890, 3910, 3540, 3720, 3480, 3390, 3860, 4720, 5980, 6240, 5110, 4020, 2870, 1930, 1180][h];
  return { hour: `${String(h).padStart(2, "0")}:00`, vehicles: base, violations: Math.round(base * 0.031) };
});

export const SECTORS = ["Central", "North", "South", "East", "West"] as const;

export const OD_MATRIX: { from: string; to: string; volume: number }[] = [
  { from: "Central", to: "North", volume: 4210 },
  { from: "Central", to: "South", volume: 5380 },
  { from: "Central", to: "East", volume: 2140 },
  { from: "Central", to: "West", volume: 3960 },
  { from: "North", to: "Central", volume: 3890 },
  { from: "North", to: "South", volume: 1420 },
  { from: "North", to: "East", volume: 1810 },
  { from: "North", to: "West", volume: 2270 },
  { from: "South", to: "Central", volume: 5120 },
  { from: "South", to: "North", volume: 1290 },
  { from: "South", to: "East", volume: 980 },
  { from: "South", to: "West", volume: 3410 },
  { from: "East", to: "Central", volume: 2360 },
  { from: "East", to: "North", volume: 1640 },
  { from: "East", to: "South", volume: 1120 },
  { from: "East", to: "West", volume: 760 },
  { from: "West", to: "Central", volume: 4080 },
  { from: "West", to: "North", volume: 2510 },
  { from: "West", to: "South", volume: 3220 },
  { from: "West", to: "East", volume: 840 },
];

export type WatchItem = {
  plate: string;
  reason: "Stolen Vehicle" | "Expired Permit" | "Unpaid Challans" | "Suspect Watchlist" | "Forged Plate";
  severity: "critical" | "high" | "moderate";
  addedOn: string;
  addedBy: string;
};

export const WATCHLIST: WatchItem[] = [
  { plate: "DL01AB1234", reason: "Stolen Vehicle", severity: "critical", addedOn: "2026-08-21", addedBy: "PS Connaught Place" },
  { plate: "HR26XY9087", reason: "Suspect Watchlist", severity: "critical", addedOn: "2026-08-29", addedBy: "Crime Branch" },
  { plate: "UP16CD4455", reason: "Unpaid Challans", severity: "moderate", addedOn: "2026-07-14", addedBy: "Traffic HQ" },
  { plate: "DL08CA7721", reason: "Expired Permit", severity: "moderate", addedOn: "2026-08-02", addedBy: "RTO South" },
  { plate: "RJ14PQ3300", reason: "Forged Plate", severity: "high", addedOn: "2026-08-30", addedBy: "ANPR Audit Unit" },
  { plate: "DL03SF6612", reason: "Stolen Vehicle", severity: "critical", addedOn: "2026-09-01", addedBy: "PS Rajouri Garden" },
  { plate: "MH12KL8890", reason: "Expired Permit", severity: "moderate", addedOn: "2026-06-19", addedBy: "RTO West" },
  { plate: "DL05TR1098", reason: "Unpaid Challans", severity: "high", addedOn: "2026-08-11", addedBy: "Traffic HQ" },
];

export const RANDOM_PLATES = [
  "DL02CV4412", "DL09GH7781", "HR51MN2093", "UP14QR5567", "DL04TZ8834",
  "DL10BX1177", "RJ02LM6654", "DL07NC3391", "HR29VB4408", "DL06AS9925",
];

export function cameraById(id: string) {
  return CAMERAS.find((c) => c.id === id)!;
}
