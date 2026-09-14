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
  { id: "CAM-11", name: "India Gate C-Hexagon", sector: "Central", lat: 28.6129, lng: 77.2295, congestion: 0.71, throughput: 4460 },
  { id: "CAM-12", name: "Kartavya Path Approach", sector: "Central", lat: 28.6141, lng: 77.2075, congestion: 0.66, throughput: 3890 },
  { id: "CAM-13", name: "Sarai Kale Khan Ring Rd", sector: "East", lat: 28.5895, lng: 77.2578, congestion: 0.84, throughput: 5540 },
  { id: "CAM-14", name: "Akshardham Flyover", sector: "East", lat: 28.6127, lng: 77.2773, congestion: 0.76, throughput: 4980 },
  { id: "CAM-15", name: "Anand Vihar ISBT", sector: "East", lat: 28.6512, lng: 77.3152, congestion: 0.69, throughput: 4230 },
  { id: "CAM-16", name: "Seelampur Bridge", sector: "North East", lat: 28.6702, lng: 77.2761, congestion: 0.62, throughput: 3410 },
  { id: "CAM-17", name: "Wazirabad Crossing", sector: "North East", lat: 28.7042, lng: 77.2331, congestion: 0.55, throughput: 3020 },
  { id: "CAM-18", name: "Mukarba Chowk", sector: "North", lat: 28.7331, lng: 77.1621, congestion: 0.79, throughput: 5210 },
  { id: "CAM-19", name: "Azadpur Mandi Gate", sector: "North", lat: 28.7076, lng: 77.1755, congestion: 0.83, throughput: 4670 },
  { id: "CAM-20", name: "Rohini Sector 18 Corridor", sector: "North West", lat: 28.7382, lng: 77.1101, congestion: 0.49, throughput: 2780 },
  { id: "CAM-21", name: "Peeragarhi Chowk", sector: "North West", lat: 28.6807, lng: 77.0932, congestion: 0.72, throughput: 4520 },
  { id: "CAM-22", name: "Janakpuri District Centre", sector: "West", lat: 28.6297, lng: 77.0817, congestion: 0.6, throughput: 3340 },
  { id: "CAM-23", name: "Dwarka Sector 21 Metro", sector: "South West", lat: 28.5522, lng: 77.0587, congestion: 0.51, throughput: 3860 },
  { id: "CAM-24", name: "IGI Terminal 3 Approach", sector: "South West", lat: 28.5562, lng: 77.0869, congestion: 0.68, throughput: 5120 },
  { id: "CAM-25", name: "Mahipalpur Bypass", sector: "South West", lat: 28.5433, lng: 77.1219, congestion: 0.77, throughput: 5390 },
  { id: "CAM-26", name: "Saket Outer Ring Rd", sector: "South", lat: 28.5245, lng: 77.2066, congestion: 0.64, throughput: 4040 },
  { id: "CAM-27", name: "Nehru Place Terminal", sector: "South", lat: 28.5494, lng: 77.2519, congestion: 0.8, throughput: 4710 },
  { id: "CAM-28", name: "Ashram Chowk", sector: "South", lat: 28.5729, lng: 77.2588, congestion: 0.89, throughput: 5680 },
  { id: "CAM-29", name: "Badarpur Border", sector: "South East", lat: 28.4936, lng: 77.3033, congestion: 0.73, throughput: 4890 },
  { id: "CAM-30", name: "Kalindi Kunj Bridge", sector: "South East", lat: 28.5391, lng: 77.3068, congestion: 0.66, throughput: 3950 },
  { id: "CAM-31", name: "Mayur Vihar Phase 1", sector: "South East", lat: 28.6088, lng: 77.2915, congestion: 0.57, throughput: 3290 },
  { id: "CAM-32", name: "Karol Bagh Ajmal Khan Rd", sector: "Central", lat: 28.6512, lng: 77.1902, congestion: 0.85, throughput: 4380 },
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
    { order: 7, cameraId: "CAM-14", timestamp: "2026-09-05T09:02:38", direction: "E", speed: 61, confidence: 0.9 },
    { order: 8, cameraId: "CAM-15", timestamp: "2026-09-05T09:16:04", direction: "NE", speed: 58, confidence: 0.92 },
  ],
  HR26XY9087: [
    { order: 1, cameraId: "CAM-10", timestamp: "2026-09-05T09:10:04", direction: "S", speed: 51, confidence: 0.95 },
    { order: 2, cameraId: "CAM-09", timestamp: "2026-09-05T09:21:38", direction: "SE", speed: 44, confidence: 0.92 },
    { order: 3, cameraId: "CAM-08", timestamp: "2026-09-05T09:35:16", direction: "E", speed: 66, confidence: 0.9 },
    { order: 4, cameraId: "CAM-06", timestamp: "2026-09-05T09:47:02", direction: "NE", speed: 42, confidence: 0.96 },
    { order: 5, cameraId: "CAM-07", timestamp: "2026-09-05T09:58:44", direction: "E", speed: 37, confidence: 0.88 },
    { order: 6, cameraId: "CAM-27", timestamp: "2026-09-05T10:11:19", direction: "SE", speed: 45, confidence: 0.93 },
    { order: 7, cameraId: "CAM-30", timestamp: "2026-09-05T10:26:52", direction: "SE", speed: 63, confidence: 0.89 },
  ],
  UP16CD4455: [
    { order: 1, cameraId: "CAM-04", timestamp: "2026-09-05T06:31:00", direction: "SW", speed: 58, confidence: 0.93 },
    { order: 2, cameraId: "CAM-05", timestamp: "2026-09-05T06:44:29", direction: "SW", speed: 33, confidence: 0.9 },
    { order: 3, cameraId: "CAM-01", timestamp: "2026-09-05T06:58:51", direction: "S", speed: 29, confidence: 0.97 },
    { order: 4, cameraId: "CAM-06", timestamp: "2026-09-05T07:14:07", direction: "SW", speed: 47, confidence: 0.94 },
    { order: 5, cameraId: "CAM-08", timestamp: "2026-09-05T07:26:33", direction: "W", speed: 71, confidence: 0.91 },
    { order: 6, cameraId: "CAM-24", timestamp: "2026-09-05T07:41:58", direction: "SW", speed: 68, confidence: 0.95 },
    { order: 7, cameraId: "CAM-23", timestamp: "2026-09-05T07:53:22", direction: "W", speed: 52, confidence: 0.92 },
  ],
  DL03SF6612: [
    { order: 1, cameraId: "CAM-20", timestamp: "2026-09-05T11:02:14", direction: "S", speed: 54, confidence: 0.94 },
    { order: 2, cameraId: "CAM-21", timestamp: "2026-09-05T11:15:47", direction: "SE", speed: 61, confidence: 0.91 },
    { order: 3, cameraId: "CAM-22", timestamp: "2026-09-05T11:29:03", direction: "S", speed: 43, confidence: 0.96 },
    { order: 4, cameraId: "CAM-23", timestamp: "2026-09-05T11:44:36", direction: "SW", speed: 66, confidence: 0.9 },
    { order: 5, cameraId: "CAM-25", timestamp: "2026-09-05T11:58:09", direction: "SE", speed: 72, confidence: 0.93 },
    { order: 6, cameraId: "CAM-26", timestamp: "2026-09-05T12:12:41", direction: "E", speed: 49, confidence: 0.89 },
    { order: 7, cameraId: "CAM-27", timestamp: "2026-09-05T12:24:57", direction: "E", speed: 35, confidence: 0.95 },
  ],
  RJ14PQ3300: [
    { order: 1, cameraId: "CAM-29", timestamp: "2026-09-05T13:05:22", direction: "N", speed: 64, confidence: 0.92 },
    { order: 2, cameraId: "CAM-30", timestamp: "2026-09-05T13:18:44", direction: "N", speed: 58, confidence: 0.9 },
    { order: 3, cameraId: "CAM-31", timestamp: "2026-09-05T13:31:12", direction: "N", speed: 46, confidence: 0.94 },
    { order: 4, cameraId: "CAM-13", timestamp: "2026-09-05T13:45:36", direction: "NW", speed: 38, confidence: 0.97 },
    { order: 5, cameraId: "CAM-02", timestamp: "2026-09-05T13:59:03", direction: "NW", speed: 30, confidence: 0.93 },
    { order: 6, cameraId: "CAM-32", timestamp: "2026-09-05T14:14:28", direction: "NW", speed: 41, confidence: 0.88 },
    { order: 7, cameraId: "CAM-19", timestamp: "2026-09-05T14:29:51", direction: "N", speed: 57, confidence: 0.91 },
    { order: 8, cameraId: "CAM-18", timestamp: "2026-09-05T14:42:17", direction: "NW", speed: 69, confidence: 0.94 },
  ],
  DL05TR1098: [
    { order: 1, cameraId: "CAM-17", timestamp: "2026-09-05T16:04:10", direction: "S", speed: 47, confidence: 0.9 },
    { order: 2, cameraId: "CAM-16", timestamp: "2026-09-05T16:17:39", direction: "S", speed: 52, confidence: 0.93 },
    { order: 3, cameraId: "CAM-15", timestamp: "2026-09-05T16:32:05", direction: "SE", speed: 44, confidence: 0.95 },
    { order: 4, cameraId: "CAM-14", timestamp: "2026-09-05T16:46:28", direction: "SW", speed: 39, confidence: 0.92 },
    { order: 5, cameraId: "CAM-13", timestamp: "2026-09-05T16:59:51", direction: "SW", speed: 34, confidence: 0.96 },
    { order: 6, cameraId: "CAM-28", timestamp: "2026-09-05T17:13:22", direction: "SW", speed: 26, confidence: 0.89 },
    { order: 7, cameraId: "CAM-07", timestamp: "2026-09-05T17:27:48", direction: "W", speed: 31, confidence: 0.94 },
  ],
  MH12KL8890: [
    { order: 1, cameraId: "CAM-25", timestamp: "2026-09-05T18:02:33", direction: "N", speed: 59, confidence: 0.91 },
    { order: 2, cameraId: "CAM-24", timestamp: "2026-09-05T18:15:07", direction: "NE", speed: 48, confidence: 0.94 },
    { order: 3, cameraId: "CAM-08", timestamp: "2026-09-05T18:29:44", direction: "NE", speed: 37, confidence: 0.9 },
    { order: 4, cameraId: "CAM-12", timestamp: "2026-09-05T18:44:19", direction: "E", speed: 28, confidence: 0.97 },
    { order: 5, cameraId: "CAM-11", timestamp: "2026-09-05T18:57:02", direction: "E", speed: 24, confidence: 0.93 },
    { order: 6, cameraId: "CAM-02", timestamp: "2026-09-05T19:09:38", direction: "NE", speed: 22, confidence: 0.88 },
  ],
  DL08CA7721: [
    { order: 1, cameraId: "CAM-32", timestamp: "2026-09-05T20:11:05", direction: "SE", speed: 43, confidence: 0.95 },
    { order: 2, cameraId: "CAM-01", timestamp: "2026-09-05T20:24:31", direction: "SE", speed: 36, confidence: 0.92 },
    { order: 3, cameraId: "CAM-11", timestamp: "2026-09-05T20:37:56", direction: "S", speed: 45, confidence: 0.9 },
    { order: 4, cameraId: "CAM-28", timestamp: "2026-09-05T20:52:14", direction: "S", speed: 51, confidence: 0.94 },
    { order: 5, cameraId: "CAM-27", timestamp: "2026-09-05T21:05:49", direction: "SW", speed: 47, confidence: 0.91 },
    { order: 6, cameraId: "CAM-26", timestamp: "2026-09-05T21:19:22", direction: "W", speed: 56, confidence: 0.96 },
  ],
};

export const HOURLY = Array.from({ length: 24 }, (_, h) => {
  const base = [820, 610, 430, 380, 520, 1240, 2680, 4310, 5620, 4890, 3910, 3540, 3720, 3480, 3390, 3860, 4720, 5980, 6240, 5110, 4020, 2870, 1930, 1180][h] ?? 1000;
  return { hour: `${String(h).padStart(2, "0")}:00`, vehicles: base, violations: Math.round(base * 0.031) };
});

export const SECTORS = [
  "Central",
  "North",
  "North East",
  "North West",
  "East",
  "West",
  "South",
  "South East",
  "South West",
] as const;

const OD_SEED: Record<string, number> = {
  Central: 5200,
  North: 4100,
  "North East": 2600,
  "North West": 2400,
  East: 3800,
  West: 3900,
  South: 4600,
  "South East": 2900,
  "South West": 3300,
};

export const OD_MATRIX: { from: string; to: string; volume: number }[] = SECTORS.flatMap((from, i) =>
  SECTORS.filter((to) => to !== from).map((to, j) => {
    const a = OD_SEED[from] ?? 3000;
    const b = OD_SEED[to] ?? 3000;
    const wobble = ((i * 7 + j * 13) % 11) / 20; // deterministic 0-0.5
    return { from, to, volume: Math.round(((a + b) / 2) * (0.45 + wobble)) };
  }),
);

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
  { plate: "PB10ZS4471", reason: "Suspect Watchlist", severity: "high", addedOn: "2026-09-03", addedBy: "Special Cell" },
  { plate: "DL12QW5580", reason: "Forged Plate", severity: "high", addedOn: "2026-08-24", addedBy: "ANPR Audit Unit" },
  { plate: "UP32EF1290", reason: "Stolen Vehicle", severity: "critical", addedOn: "2026-09-06", addedBy: "PS Anand Vihar" },
  { plate: "HR55JD7734", reason: "Unpaid Challans", severity: "moderate", addedOn: "2026-07-29", addedBy: "Traffic HQ" },
];

export const RANDOM_PLATES = [
  "DL02CV4412", "DL09GH7781", "HR51MN2093", "UP14QR5567", "DL04TZ8834",
  "DL10BX1177", "RJ02LM6654", "DL07NC3391", "HR29VB4408", "DL06AS9925",
  "DL13KP2276", "UP15RW8802", "HR70TF5519", "DL11JN6640", "PB65XD1123",
  "DL14MB9958", "RJ45CS3307", "DL15YT4482", "UP78HK6693", "DL16VE7710",
];

export function cameraById(id: string) {
  return CAMERAS.find((c) => c.id === id)!;
}
