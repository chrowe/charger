/*
 * Shared goal vocabulary used by every charger definition.
 *
 * A charger file (js/data/chargers/*.js) doesn't have to support every
 * goal for every battery type — it declares, per battery type, which of
 * these goal ids it can help with and what to do (see isdt-n8.js for the
 * pattern). This file just gives goals a stable id, label, and blurb so
 * the UI and every charger definition speak the same language.
 */
window.GOALS = [
  {
    id: "charge",
    label: "Charge a battery",
    blurb: "Top up a battery that's just run down from normal use.",
    icon: "🔋",
  },
  {
    id: "health",
    label: "Check battery health / capacity",
    blurb: "Find out how many mAh a battery actually still holds.",
    icon: "🩺",
  },
  {
    id: "recover",
    label: "Recover an old or dead battery",
    blurb: "Revive a cell that's been sitting deeply discharged or unused for a long time.",
    icon: "🚑",
  },
  {
    id: "breakin",
    label: "Break in / refresh a battery",
    blurb: "Condition a brand-new cell, or clear up a NiMH/NiCd \"memory effect\" slump.",
    icon: "🔁",
  },
  {
    id: "storagePrep",
    label: "Prepare for storage or travel",
    blurb: "Get a battery to a safe charge level before it sits unused for a while.",
    icon: "📦",
  },
  {
    id: "unsure",
    label: "Not sure what I have",
    blurb: "Help me figure out the chemistry and a safe starting point.",
    icon: "❓",
  },
];
