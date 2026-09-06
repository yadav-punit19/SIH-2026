# Netra: City Intelligence

Build a production-grade, dark-themed Municipal Traffic & Surveillance Command Dashboard named "Netra". 

1. Branding & Head Elements:

- In index.html, change the document title to: "Netra — City-Wide ANPR & Traffic Intelligence".

- Replace the default favicon link with this inline camera SVG favicon:

  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230284c7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z'/%3E%3Ccircle cx='12' cy='13' r='3'/%3E%3C/svg%3E" />

2. Core Navigation & Layout:

- Top Navigation Bar: Displays "Netra Intelligence Grid", system status indicator ("Active • 12 Nodes Online"), live clock, and an emergency alert notification bell with a badge count.

- Main layout must include 3 primary tabs: "Trajectory Reconstruction", "Macro Traffic Analytics", and "Security Watchlist".

3. Tab 1: Trajectory Reconstruction:

- A prominent search input accepting a vehicle plate number (e.g., "DL01AB1234") with date/time range pickers.

- An interactive Leaflet map taking up central screen space showing mock city cameras (nodes).

- When a plate is searched, plot a sequential connected route (polyline) across camera points with ordered number badges (1, 2, 3...).

- Clicking a waypoint reveals a popup modal with: Camera ID, Timestamp, Direction (e.g., NW), Speed estimate, and a mock captured plate image crop.

- Include a timeline scrubber slider at the bottom to play/pause vehicle progress along the plotted route.

4. Tab 2: Macro Traffic Analytics:

- Summary KPI Cards: Total Vehicles Scanned Today, Peak Congestion Index, Average Transit Speed, Active Blacklist Detections.

- Map overlay showing a traffic density heatmap and highlighted congestion bottleneck points.

- Two charts (using Recharts):

  * Hourly vehicle throughput bar chart.

  * Origin-Destination (O-D) flow matrix between major city sectors.

5. Tab 3: Security Watchlist & Alert Drawer:

- Table listing flagged/blacklisted vehicles with columns: Plate Number, Reason (e.g., Stolen, Expired Permit), Date Added, and Action buttons.

- A live event stream drawer on the right side simulating incoming ANPR hits. If a blacklisted plate passes, trigger a high-contrast visual alert badge with warning audio cue simulation.

Use modern Tailwind styling with slate/zinc dark mode, emerald for normal status, amber for warnings, and rose/red for blacklist alerts. Prepopulate the app with realistic mock data across 10 city camera locations so all features are immediately testable.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://netra-watch.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/afe7e9a1-6022-4423-a01d-444e25cdc4ca).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
