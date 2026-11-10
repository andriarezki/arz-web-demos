# ARZ web app demos

Two small web apps with a shared design system, built without a framework or a backend. Everything runs in the browser and all data is made up.

| App | What it does | Live demo |
|---|---|---|
| **Warkop POS** (`pos/`) | Register for cafés and small shops: tap items, pay cash or QRIS, daily report with revenue and best sellers, editable menu | https://andriarezki.tech/demo/pos/ |
| **Fleet Ops** (`fleet/`) | Trip scheduling for vehicles and drivers, no double booking, vehicle status, dashboard | https://andriarezki.tech/demo/fleet/ |

Demo login: `demo` / `demo123` (checked in the browser only, it is not real authentication).

## What is shared (`shared/`)
- `arz.css`: colour tokens for light and dark mode, the two-panel login page, and the app shell.
- `core.js`: theme switch (light, dark, system), Indonesian and English dictionary, login and app shell, small icon set.

Each app sets its own brand colours in `index.html` and supplies its views in `app.js`.

## Run it
It is plain static files. From this folder:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/pos/` or `http://localhost:8000/fleet/`.

## Notes
- Data is stored in `localStorage`, so it stays in one browser and can be reset from the app.
- This is a demo, not production software: there is no server, no real login and no payment processing.
