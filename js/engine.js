/*
 * Charger-agnostic recommendation engine.
 *
 * Takes a charger definition (see js/data/chargers/isdt-n8.js for the
 * schema) plus the user's picks, and works out what to set on the
 * charger. Nothing in here is specific to any one device — a new
 * charger file that follows the same schema gets this logic for free.
 */
(function () {
  function clampToStep(value, range) {
    if (!range) return null;
    const stepped = Math.round(value / range.step) * range.step;
    return Math.min(range.max, Math.max(range.min, stepped));
  }

  function currentFor(role, batteryType, size, capacityMah, speed, charger) {
    const cRate = speed === "fast" && batteryType.fastCRate ? batteryType.fastCRate : batteryType.defaultCRate;
    const mah = capacityMah || batteryType.typicalCapacityMah[size] || 1000;
    const raw = mah * cRate;

    const result = {};
    if ((role === "charge" || role === "both") && charger.chargeCurrent) {
      result.chargeMa = clampToStep(raw, charger.chargeCurrent);
    }
    if ((role === "discharge" || role === "both") && charger.dischargeCurrent) {
      // Discharge/health/storage passes are commonly run a bit gentler than charge.
      const dischargeRaw = role === "both" ? raw : mah * Math.min(cRate, 0.5);
      result.dischargeMa = clampToStep(dischargeRaw, charger.dischargeCurrent);
    }
    return result;
  }

  function recommend({ charger, batteryTypeId, goalId, size, capacityMah, speed }) {
    const batteryType = charger.batteryTypes.find((b) => b.id === batteryTypeId);
    if (!batteryType) return null;

    // "unsure" isn't its own recipe in a battery type's goal map — once the
    // chemistry is identified (see the charger's `identify` table, shown on
    // the battery-type step), a plain "charge" is the safe default to fall
    // back on.
    const effectiveGoalId = goalId === "unsure" && !batteryType.goals[goalId] ? "charge" : goalId;
    const goal = batteryType.goals[effectiveGoalId];
    if (!goal) return null;
    const fallbackIntro =
      effectiveGoalId !== goalId ? ["Once you've matched the chemistry above, here's a safe starting point:"] : [];

    if (!goal.supported) {
      return {
        supported: false,
        batteryType,
        unsupportedNote: goal.unsupportedNote,
      };
    }

    const mode = charger.modes[goal.mode];
    const currents = currentFor(goal.currentRole, batteryType, size, capacityMah, speed, charger);
    const usedTypicalCapacity = !capacityMah;

    return {
      supported: true,
      batteryType,
      mode,
      modeId: goal.mode,
      currentRole: goal.currentRole,
      chargeMa: currents.chargeMa ?? null,
      dischargeMa: currents.dischargeMa ?? null,
      usedTypicalCapacity,
      typicalCapacityMah: batteryType.typicalCapacityMah[size],
      goalNotes: [...fallbackIntro, ...(goal.notes || [])],
      batteryWarnings: [
        ...(batteryType.mustChargeSeparately ? ["Charge this chemistry in its own batch — don't mix it with other chemistries in the same run."] : []),
        ...(batteryType.autoDetect === false ? [`Select "${batteryType.label}" manually on the charger — it won't be picked up by Auto mode.`] : []),
      ],
    };
  }

  window.ChargerEngine = { recommend, clampToStep };
})();
