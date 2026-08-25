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
 */
window.GOALS = [
  {
    id: "charge",
    label: "Charge a battery",
    blurb: "Top up a battery that's just run down from normal use.",
    icon: "🔋",
    clues: ["It's just low from normal use, and everything else about it seems fine — this is the everyday default."],
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
  },
  {
    id: "storagePrep",
    label: "Prepare for storage or travel",
    blurb: "Get a battery to a safe charge level before it sits unused for a while.",
    icon: "📦",
    clues: ["You're packing it away for a trip, off-season gear, or long-term storage and won't use it again soon."],
  },
  {
    id: "unsure",
    label: "Not sure what I have",
    blurb: "Help me figure out the chemistry and a safe starting point.",
    icon: "❓",
    clues: ["You don't know the chemistry, or don't know where to start."],
  },
];
