# Charger Setup Assistant

A small static web app that walks you through picking the right settings on
a battery charger: what to charge, what mode to use, and what current to
set — based on what you're trying to do (charge, check health, recover an
old cell, break in a new one, or prep for storage) and what battery you're
charging.

It currently ships with one charger, the **ISDT N8** (8-slot AA/AAA smart
charger), but the data model is built so more chargers can be dropped in
without touching the app logic.

## Running it

It's plain HTML/CSS/JS with no build step and no external dependencies —
just open `index.html` in a browser, or serve the folder with any static
file server (e.g. `python3 -m http.server`) and visit it.

## How it's organized

```
index.html                     shell page, loads the scripts below in order
css/styles.css                 all styling
js/data/goals.js               shared vocabulary of "what do you want to do" goals
js/data/chargers/isdt-n8.js    ISDT N8 charger definition (battery types, modes, current ranges, per-goal guidance)
js/engine.js                   charger-agnostic logic that turns a (charger, battery type, goal) pick into a recommendation
js/app.js                      UI wiring — renders the step-by-step picker and the result
```

## Adding a new charger

1. Copy `js/data/chargers/isdt-n8.js` to a new file, e.g.
   `js/data/chargers/my-charger.js`, and fill in the fields for the new
   device: its supported charge/discharge current ranges, its modes, and
   for each battery type it supports, what to do for each goal in
   `js/data/goals.js` (`charge`, `health`, `recover`, `breakin`,
   `storagePrep`, `unsure`). Set `supported: false` with an
   `unsupportedNote` for any goal/battery-type combination the charger
   can't do safely.
2. Add a `<script src="js/data/chargers/my-charger.js"></script>` line in
   `index.html`, after the existing charger script.

That's it — `js/engine.js` and `js/app.js` don't need any changes. As soon
as more than one charger is registered, the app automatically shows a
charger picker at the top.

If a future charger needs a goal that doesn't fit the existing vocabulary
(e.g. a balance charger's "Storage" mode with a target voltage), add it to
`js/data/goals.js` and wire it into `js/engine.js`/`js/app.js` — everything
is plain data and small functions, no framework to fight.

## Where the ISDT N8 numbers come from

Modes, current ranges (100–1500 mA charge, 100–1000 mA discharge), the
Activation/Cycle/Auto behavior, and the NiZn/LiHV manual-selection and
"don't mix chemistries" caveats are taken from the product manual and
listings for the ISDT N8 8-slot AA/AAA charger. Typical AA/AAA capacities
per chemistry are ballpark industry figures, not device-specific — the app
always prefers the capacity you type in over its defaults.
