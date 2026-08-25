/*
 * Shared goal vocabulary used by every charger definition.
 *
 * A charger file (js/data/chargers/*.js) doesn't have to support every
 * goal for every battery type — it declares, per battery type, which of
 * these goal ids it can help with and what to do (see isdt-n8.js for the
 * pattern). This file just gives goals a stable id, label, and blurb so
 * the UI and every charger definition speak the same language.
 *
 * `clues` are optional, plain-language symptoms shown in the "Which one
 * do I need?" helper so someone can pick a goal from what they're
 * noticing rather than already knowing the right term for it.
 *
 * `whatNext` are optional, shown in the result as "What next" — how to
 * read the outcome once the charger's done its thing, and what to do
 * with that reading.
 */
window.GOALS = [
  {
    id: "charge",
    label: "Charge a battery",
    blurb: "Top up a battery that's just run down from normal use.",
    icon: "🔋",
    clues: ["It's just low from normal use, and everything else about it seems fine — this is the everyday default."],
    whatNext: [
      "Finished in roughly the expected time and the device runs normally on it? Healthy — nothing further needed.",
      "Finished suspiciously fast, or the device still doesn't last? Run a Health Check to see its real capacity.",
      "Won't finish charging, or gets hot or swells? Stop. Try Recover if it's just old/idle, or retire it if it looks damaged.",
    ],
  },
  {
    id: "health",
    label: "Check battery health / capacity",
    blurb: "Find out how many mAh a battery actually still holds.",
    icon: "🩺",
    clues: [
      "Device runtime has been getting shorter over time.",
      "It seems to charge fully but drains unusually fast in use.",
      "You want to compare a set of cells and retire the weak ones.",
      "It's old, or you just don't know its history.",
    ],
    whatNext: [
      "Compare the mAh the charger reports on Discharge to the rating printed on the battery.",
      "~80%+ of rated capacity: healthy.",
      "~60–80%: aging — fine for low-drain gear, less reliable for anything demanding.",
      "Below ~50–60%: worn out — don't rely on it for anything that matters.",
      "Number still climbing if you repeat the test? It may just be under-conditioned rather than weak — try Break in / refresh instead.",
    ],
  },
  {
    id: "recover",
    label: "Recover an old or dead battery",
    blurb: "Revive a cell that's been sitting deeply discharged or unused for a long time.",
    icon: "🚑",
    clues: [
      "It reads 0V, or very close to it, on a multimeter.",
      "The charger won't recognize it or shows a fault right away.",
      "It's been sitting unused for many months or years.",
      "It came from a drawer of old electronics and you don't know its condition.",
    ],
    whatNext: [
      "Success looks like: it now takes a normal charge and holds a sensible resting voltage.",
      "Once it does, run a Health Check — recovery restores function, not necessarily the capacity it started with.",
      "Still won't take a charge, or looks swollen, leaking, or damaged? Stop trying and recycle it instead.",
    ],
  },
  {
    id: "breakin",
    label: "Break in / refresh a battery",
    blurb: "Condition a brand-new cell, or clear up a NiMH/NiCd \"memory effect\" slump.",
    icon: "🔁",
    clues: [
      "It's brand new and has never been used.",
      "It's a NiMH/NiCd that reads full but dies at almost the same point every time, well short of what it should deliver.",
      "It's been sitting unused for months but used to work fine.",
    ],
    whatNext: [
      "Capacity should be stable or improving across a couple of Cycle passes.",
      "Still climbing each pass? Normal for a new or long-idle cell — run it through Cycle again.",
      "Flat or falling instead? That's real aging, not conditioning — run a Health Check to see where it actually stands.",
    ],
  },
  {
    id: "storagePrep",
    label: "Prepare for storage or travel",
    blurb: "Get a battery to a safe charge level before it sits unused for a while.",
    icon: "📦",
    clues: ["You're packing it away for a trip, off-season gear, or long-term storage and won't use it again soon."],
    whatNext: [
      "There's no single \"done\" signal here — the goal is just a safer resting state before it sits.",
      "Check back every few months, especially for Li-ion/LiHV: a big voltage drop while idle is a sign of a weak cell — worth a Health Check next time you use it.",
    ],
  },
  {
    id: "unsure",
    label: "Not sure what I have",
    blurb: "Help me figure out the chemistry and a safe starting point.",
    icon: "❓",
    clues: ["You don't know the chemistry, or don't know where to start."],
    whatNext: ["Once you've matched a resting voltage to a chemistry above, come back and pick the goal that actually matches what you're trying to do."],
  },
];
