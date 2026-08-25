/*
 * Charger definition: ISDT N8 (8-slot AA/AAA smart charger).
 *
 * Schema (followed by every file in this folder so the app can support
 * more than one charger — see README.md "Adding a new charger"):
 *
 * {
 *   id, name, tagline, formFactors: [size ids],
 *   chargeCurrent:    {min, max, step, unit},   // omit if charger can't charge
 *   dischargeCurrent: {min, max, step, unit},   // omit if charger can't discharge
 *   modes: { modeId: {label, description} },
 *   identify: [{ chemistryHint, voltage }],     // rough resting-voltage table
 *   batteryTypes: [{
 *     id, label, autoDetect (bool), mustChargeSeparately (bool, optional),
 *     defaultCRate, fastCRate (optional — omit to hide the "fast" option),
 *     typicalCapacityMah: { sizeId: number },
 *     goals: {
 *       goalId: {
 *         supported: bool,
 *         mode: modeId,                 // required when supported
 *         currentRole: 'charge' | 'discharge' | 'both' | 'none',
 *         notes: [string],
 *         unsupportedNote: string,       // shown when supported === false
 *       }
 *     }
 *   }]
 * }
 */
window.CHARGERS = window.CHARGERS || [];
window.CHARGERS.push({
  id: "isdt-n8",
  name: "ISDT N8",
  tagline: "8-Slot AA / AAA Smart Charger",
  formFactors: ["AA", "AAA"],

  chargeCurrent: { min: 100, max: 1500, step: 100, unit: "mA" },
  dischargeCurrent: { min: 100, max: 1000, step: 100, unit: "mA" },

  modes: {
    charge: {
      label: "Charge",
      description: "Standard constant-current charge with automatic cutoff.",
    },
    discharge: {
      label: "Discharge",
      description: "Drains the battery at a set current and reports the capacity delivered.",
    },
    cycle: {
      label: "Cycle",
      description: "Repeats Charge → Discharge (→ Charge) automatically, a few passes at a time.",
    },
    activation: {
      label: "Activation Charge",
      description: "Discharges first, then charges — meant for cells that have sat deeply discharged.",
    },
    auto: {
      label: "Auto",
      description: "Lets the charger detect the chemistry itself. Not offered for NiZn or LiHV.",
    },
  },

  identify: [
    { chemistryHint: "NiMH / NiCd / Eneloop", voltage: "~1.2V resting" },
    { chemistryHint: "NiZn", voltage: "~1.6V resting" },
    { chemistryHint: "LiFePO4 (IFR14500-style)", voltage: "~3.2V resting" },
    { chemistryHint: "Li-ion (14500-style)", voltage: "~3.6–3.7V resting" },
    { chemistryHint: "LiHV", voltage: "~3.8–3.85V resting" },
  ],

  notes: [
    "This charger is for round AA/AAA-sized cells only — it does not support 1.5V \"USB-C rechargeable\" lithium AA/AAA batteries that have a built-in voltage regulator.",
    "Load every slot with the same chemistry for a given run — don't mix chemistries (especially NiZn) in the same batch.",
  ],

  batteryTypes: [
    {
      id: "nimh",
      label: "NiMH",
      autoDetect: true,
      defaultCRate: 0.5,
      fastCRate: 1,
      typicalCapacityMah: { AA: 2000, AAA: 900 },
      goals: {
        charge: { supported: true, mode: "charge", currentRole: "charge", notes: [] },
        health: {
          supported: true,
          mode: "discharge",
          currentRole: "discharge",
          notes: ["Charge it fully first, then run Discharge — the mAh reading at cutoff is your real-world capacity."],
        },
        recover: {
          supported: true,
          mode: "activation",
          currentRole: "both",
          notes: ["Activation Charge discharges the cell first, then charges it — a good first move for a cell that reads 0V or won't hold charge."],
        },
        breakin: {
          supported: true,
          mode: "cycle",
          currentRole: "both",
          notes: ["Run 2–3 Cycle passes on brand-new cells or ones that have been sitting unused for months — it also helps shake off NiMH \"memory\" slump."],
        },
        storagePrep: {
          supported: true,
          mode: "charge",
          currentRole: "charge",
          notes: ["NiMH self-discharges slowly and is fine to store fully charged — no special prep needed."],
        },
      },
    },
    {
      id: "nicd",
      label: "NiCd",
      autoDetect: true,
      defaultCRate: 0.5,
      fastCRate: 1,
      typicalCapacityMah: { AA: 800, AAA: 250 },
      goals: {
        charge: { supported: true, mode: "charge", currentRole: "charge", notes: [] },
        health: {
          supported: true,
          mode: "discharge",
          currentRole: "discharge",
          notes: ["Charge fully, then Discharge to read the actual mAh — old NiCds are especially worth checking, capacity fades a lot with age."],
        },
        recover: {
          supported: true,
          mode: "activation",
          currentRole: "both",
          notes: ["Activation Charge is the right tool for a NiCd that's been sitting flat."],
        },
        breakin: {
          supported: true,
          mode: "cycle",
          currentRole: "both",
          notes: ["NiCd is the chemistry most prone to \"memory effect\" — a few Cycle passes (full discharge/charge) is the classic fix."],
        },
        storagePrep: {
          supported: true,
          mode: "charge",
          currentRole: "charge",
          notes: ["Safe to store charged; NiCd self-discharges faster than NiMH, so top it up again before use if it's been sitting a long time."],
        },
      },
    },
    {
      id: "eneloop",
      label: "Eneloop (low self-discharge NiMH)",
      autoDetect: true,
      defaultCRate: 0.5,
      fastCRate: 1,
      typicalCapacityMah: { AA: 1900, AAA: 750 },
      goals: {
        charge: { supported: true, mode: "charge", currentRole: "charge", notes: [] },
        health: {
          supported: true,
          mode: "discharge",
          currentRole: "discharge",
          notes: ["Charge fully, then Discharge to read the real capacity — useful for spotting cells worn out after years of use."],
        },
        recover: {
          supported: true,
          mode: "activation",
          currentRole: "both",
          notes: ["Activation Charge works the same way as for regular NiMH."],
        },
        breakin: {
          supported: true,
          mode: "cycle",
          currentRole: "both",
          notes: ["Eneloops rarely need this, but 1–2 Cycle passes is a reasonable check for old stock."],
        },
        storagePrep: {
          supported: true,
          mode: "charge",
          currentRole: "charge",
          notes: ["This is the chemistry built for storage — Eneloops hold charge for years. No special prep needed."],
        },
      },
    },
    {
      id: "liion",
      label: "Li-ion (14500-style)",
      autoDetect: true,
      defaultCRate: 0.5,
      fastCRate: 1,
      typicalCapacityMah: { AA: 800, AAA: 350 },
      goals: {
        charge: { supported: true, mode: "charge", currentRole: "charge", notes: ["Double-check the cell is protected/rated for AA-can charging — unprotected 14500 cells need careful handling."] },
        health: {
          supported: true,
          mode: "discharge",
          currentRole: "discharge",
          notes: ["Charge fully, then Discharge to read capacity."],
        },
        recover: {
          supported: false,
          unsupportedNote: "This charger doesn't have a safe lithium-recovery mode. A Li-ion cell that has sat at 0V for a long time can have internal damage (dendrite risk) — don't try to force-charge it. If it won't take a normal Charge, or the wrapper is torn, swollen, or damaged, recycle it instead of reviving it.",
        },
        breakin: {
          supported: false,
          unsupportedNote: "Li-ion doesn't have a \"memory effect\" to work out — a plain Charge is all a new cell needs.",
        },
        storagePrep: {
          supported: true,
          mode: "discharge",
          currentRole: "discharge",
          notes: [
            "Lithium cells age faster stored at full charge. This model has no dedicated storage-charge mode, so the practical option is: run Discharge, then a short partial Charge to roughly the halfway point rather than topping all the way back up.",
          ],
        },
      },
    },
    {
      id: "life",
      label: "LiFePO4 (IFR14500-style)",
      autoDetect: true,
      defaultCRate: 0.5,
      fastCRate: 1,
      typicalCapacityMah: { AA: 400, AAA: 200 },
      goals: {
        charge: { supported: true, mode: "charge", currentRole: "charge", notes: [] },
        health: {
          supported: true,
          mode: "discharge",
          currentRole: "discharge",
          notes: ["Charge fully, then Discharge to read capacity."],
        },
        recover: {
          supported: false,
          unsupportedNote: "No safe lithium-recovery mode on this charger. LiFePO4 tolerates deep discharge better than Li-ion, but if a cell won't take a normal Charge or looks physically damaged, don't force it — recycle instead.",
        },
        breakin: {
          supported: false,
          unsupportedNote: "No memory effect with LiFePO4 — a plain Charge is all a new cell needs.",
        },
        storagePrep: {
          supported: true,
          mode: "charge",
          currentRole: "charge",
          notes: ["LiFePO4 is easygoing about storage charge level compared to Li-ion/LiHV — storing it charged is fine for shorter periods."],
        },
      },
    },
    {
      id: "lihv",
      label: "LiHV",
      autoDetect: false,
      defaultCRate: 0.5,
      fastCRate: 1,
      typicalCapacityMah: { AA: 800, AAA: 350 },
      goals: {
        charge: { supported: true, mode: "charge", currentRole: "charge", notes: [] },
        health: {
          supported: true,
          mode: "discharge",
          currentRole: "discharge",
          notes: ["Charge fully, then Discharge to read capacity."],
        },
        recover: {
          supported: false,
          unsupportedNote: "No safe lithium-recovery mode on this charger. A LiHV cell that's sat at 0V for a long time may be damaged internally — don't force-charge it; recycle instead.",
        },
        breakin: {
          supported: false,
          unsupportedNote: "No memory effect with LiHV — a plain Charge is all a new cell needs.",
        },
        storagePrep: {
          supported: true,
          mode: "discharge",
          currentRole: "discharge",
          notes: ["LiHV is charged to a higher voltage than regular Li-ion, so it's even more worth bringing down from full before long storage. Run Discharge, then a short partial Charge rather than topping back up to full."],
        },
      },
    },
    {
      id: "nizn",
      label: "NiZn",
      autoDetect: false,
      mustChargeSeparately: true,
      defaultCRate: 0.5,
      typicalCapacityMah: { AA: 1600, AAA: 550 },
      goals: {
        charge: { supported: true, mode: "charge", currentRole: "charge", notes: [] },
        health: {
          supported: true,
          mode: "discharge",
          currentRole: "discharge",
          notes: ["Charge fully, then Discharge to read capacity. NiZn's ~1.6V nominal voltage means its mAh rating looks lower than a same-size NiMH for similar energy — that's expected."],
        },
        recover: {
          supported: false,
          unsupportedNote: "This charger's Activation mode is only offered for NiCd/NiMH/Eneloop. If a NiZn cell won't take a normal Charge, or looks swollen or damaged, don't force it.",
        },
        breakin: {
          supported: false,
          unsupportedNote: "NiZn doesn't have the memory-effect issue NiMH/NiCd do — a plain Charge is all a new cell needs.",
        },
        storagePrep: {
          supported: true,
          mode: "charge",
          currentRole: "charge",
          notes: ["Fine to store charged for shorter periods, but NiZn self-discharges faster than NiMH — top it up again before use if it's been a while."],
        },
      },
    },
  ],
});
