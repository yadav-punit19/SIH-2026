# Netra — Municipal Traffic Intelligence

Netra is a dark municipal traffic and surveillance command dashboard for city-wide vehicle monitoring.

## Capabilities

- Searchable vehicle trajectory reconstruction across 32 camera nodes and 9 Delhi zones
- Interactive street maps with camera status, route waypoints, and congestion overlays
- Hourly throughput, congestion, and origin–destination traffic analytics
- Security watchlist with simulated live ANPR alerts
- CCTV frame and live-camera number plate recognition with confidence scoring
- Restricted operator authentication

## Technology

- React 19 and TanStack Start
- TypeScript and Tailwind CSS
- Leaflet and OpenStreetMap
- Recharts
- Managed authentication and vision inference

## Local development

Install Bun, then run:

```sh
bun install
bun run dev
```

The development server is available at `http://localhost:8080`.

## Deployment configuration

Provide the three public backend settings used by the browser build:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

The plate-recognition service also requires its server-side inference credential in the deployment environment.
