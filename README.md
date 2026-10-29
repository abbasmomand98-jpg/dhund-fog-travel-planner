# Dhund — Fog-Safe Travel Planner (UX Concept)

A fog-safe travel planner for Punjab and KP motorways: section-wise visibility,
a safe-departure verdict for your route and time, a fog-driving guide, and an
emergency-kit checklist that saves on your device.

**Sample data only.** Every visibility figure and status in this demo is invented
for demonstrating the design. Dhund is not a live traffic service and is not
connected to any motorway authority. Never decide a real journey on this demo —
always check an official source before travelling. No real person, phone number
or helpline number appears anywhere in this project.

## Try it

Open `index.html` in a browser — no build step, no server needed.

- **Visibility dashboard:** all four sample sections (M1 Peshawar–Islamabad 40m
  Closed, M2 Lahore–Islamabad 120m Caution, M3 Lahore–Abdul Hakeem 350m Open,
  M4 Pindi Bhattian–Multan 80m Caution). Filter by status: Open, Caution, Closed.
- **Departure planner:** pick a route and a departure time. M1 at 07:00 AM gives
  DELAY (Closed at 40m); M2 at 07:00 AM gives DELAY (Caution in the morning fog
  peak); M2 at 11:00 AM gives GO; M3 gives GO at any hour. Every DELAY names the
  next safe window: depart after 11:00 AM.
- **Fog guide + kit:** four driving rules (slow down, fog lights on, high beam
  off, never drive on hazards) and a four-item kit checklist saved in
  `localStorage` on your device only.

## How it works

The demo is pure HTML, CSS and JavaScript with no frameworks, split into small
files so each part is easy to read:

- `data.js` — the sample sections, guide rules and kit items, plus the fog-peak
  window (05:00–10:00 AM) and the safe window (after 11:00 AM).
- `logic.js` — pure functions with no DOM code: `statusForVisibility` turns
  metres into Open / Caution / Closed (Open above 200m, Caution 50–200m, Closed
  below 50m); `planDeparture` applies the verdict rules (a Closed section always
  means DELAY; a Caution section in the fog peak means DELAY; otherwise GO).
- `app.js` — DOM wiring only: it renders the sections, fills the route picker,
  shows the verdict card, renders the guide, and saves kit ticks to
  `localStorage` under the key `dhund-kit-v1`.
- `style.css` — the whole look: headlight amber `#EA580C` on night slate
  `#0F172A` and off-white `#F8FAFC`.
- `test.js` — smoke tests you can run with `node test.js`.

## What you can learn from this project

- **Turning a number into a decision.** Raw visibility in metres means little to
  a driver at 6 AM; a band (Open / Caution / Closed) plus a verdict (GO / DELAY)
  is a decision. Notice how the logic file keeps that mapping in one place, so
  changing a threshold changes every screen at once.
- **Pure logic, thin UI.** `logic.js` never touches the page, so it can be tested
  in Node without a browser. `app.js` only renders what the logic returns. This
  split is the single most useful habit for building small tools that stay
  correct as they grow.
- **Honest sample data.** A demo that looks real but is labelled sample is a
  design tool; a demo that pretends to be live is a hazard. The banner, the
  "SAMPLE FORECAST" pills and this note are part of the design, not decoration.
- **localStorage for personal state.** The kit checklist persists without any
  account or server — the right tool when the data belongs to one person on one
  device.

Fork it and adapt the pattern to your own local problem: swap the sections for
your city's roads, the visibility bands for flood depths, load-shedding blocks
or clinic waiting times, and keep the same shape — a status list, a verdict
planner, and a checklist that saves on the device.
