(function () {
  const state = {
    chargerId: window.CHARGERS[0]?.id || null,
    goalId: null,
    batteryTypeId: null,
    size: null,
    capacityMah: null,
    speed: "standard",
  };

  function currentCharger() {
    return window.CHARGERS.find((c) => c.id === state.chargerId);
  }

  function setState(patch) {
    Object.assign(state, patch);
    render();
  }

  // Exposed for inline onclick/onchange handlers built as HTML strings below.
  window.appSelect = function (key, value) {
    const patch = { [key]: value };
    // Changing upstream choices invalidates anything decided after it.
    if (key === "chargerId") Object.assign(patch, { goalId: null, batteryTypeId: null, size: null, capacityMah: null, speed: "standard" });
    if (key === "goalId") Object.assign(patch, { batteryTypeId: null, size: null, capacityMah: null, speed: "standard" });
    if (key === "batteryTypeId") Object.assign(patch, { size: null, capacityMah: null, speed: "standard" });
    setState(patch);
  };

  window.appSetCapacity = function (value) {
    const n = parseInt(value, 10);
    setState({ capacityMah: Number.isFinite(n) && n > 0 ? n : null });
  };

  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  function chargerPickerHtml() {
    const chargers = window.CHARGERS;
    if (chargers.length <= 1) return "";
    const options = chargers
      .map((c) => `<option value="${c.id}" ${c.id === state.chargerId ? "selected" : ""}>${c.name} — ${c.tagline}</option>`)
      .join("");
    return `
      <label class="charger-picker">
        <span>Charger</span>
        <select onchange="appSelect('chargerId', this.value)">${options}</select>
      </label>`;
  }

  function stepGoal(charger) {
    const cards = window.GOALS.map((g) => {
      const selected = g.id === state.goalId;
      return `
        <button class="card ${selected ? "selected" : ""}" onclick="appSelect('goalId','${g.id}')">
          <span class="card-icon">${g.icon}</span>
          <span class="card-label">${g.label}</span>
          <span class="card-blurb">${g.blurb}</span>
        </button>`;
    }).join("");
    return step(1, "What do you want to do?", `<div class="card-grid">${cards}</div>`);
  }

  function stepBatteryType(charger) {
    const cards = charger.batteryTypes.map((bt) => {
      const selected = bt.id === state.batteryTypeId;
      return `
        <button class="card small ${selected ? "selected" : ""}" onclick="appSelect('batteryTypeId','${bt.id}')">
          <span class="card-label">${bt.label}</span>
        </button>`;
    }).join("");

    const identify = charger.identify?.length
      ? `<details class="identify-help">
           <summary>Not sure which chemistry it is?</summary>
           <ul>${charger.identify.map((i) => `<li><strong>${i.voltage}</strong> — ${i.chemistryHint}</li>`).join("")}</ul>
           <p class="tiny">Check the resting voltage with a multimeter (battery out of any device, not under load) and match it above.</p>
         </details>`
      : "";

    return step(2, "What kind of battery is it?", `<div class="card-grid">${cards}</div>${identify}`);
  }

  function stepSize(charger) {
    const buttons = charger.formFactors
      .map((s) => `<button class="pill ${s === state.size ? "selected" : ""}" onclick="appSelect('size','${s}')">${s}</button>`)
      .join("");
    return step(3, "What size?", `<div class="pill-row">${buttons}</div>`);
  }

  function stepDetails(charger, batteryType) {
    const typical = batteryType.typicalCapacityMah[state.size];
    const speedRow = batteryType.fastCRate
      ? `
        <div class="field">
          <span>Charge speed</span>
          <div class="pill-row">
            <button class="pill ${state.speed === "standard" ? "selected" : ""}" onclick="appSelect('speed','standard')">Standard (${batteryType.defaultCRate}C)</button>
            <button class="pill ${state.speed === "fast" ? "selected" : ""}" onclick="appSelect('speed','fast')">Fast (${batteryType.fastCRate}C)</button>
          </div>
        </div>`
      : `<p class="tiny">Fast charging isn't recommended for this chemistry — using standard (${batteryType.defaultCRate}C) speed.</p>`;

    return step(
      4,
      "A couple of details (optional)",
      `
      <div class="field">
        <label>
          <span>Rated capacity in mAh — printed on the battery${typical ? `, typically ~${typical} mAh for this size` : ""}</span>
          <input type="number" min="1" placeholder="${typical || ""}" value="${state.capacityMah ?? ""}" oninput="appSetCapacity(this.value)" />
        </label>
      </div>
      ${speedRow}
      `
    );
  }

  function step(n, title, body) {
    return `<section class="step"><h2><span class="step-num">${n}</span>${title}</h2>${body}</section>`;
  }

  function resultHtml(charger, rec) {
    if (!rec) return "";

    if (!rec.supported) {
      return `
        <section class="step result unsupported">
          <h2><span class="step-num">✕</span>Not a fit for this charger</h2>
          <p>${rec.unsupportedNote}</p>
        </section>`;
    }

    const rows = [];
    rows.push(row("Battery type to select", rec.batteryType.label));
    rows.push(row("Mode to select", `${rec.mode.label} <span class="tiny">— ${rec.mode.description}</span>`));
    if (rec.chargeMa) rows.push(row("Charge current", `${rec.chargeMa} mA`));
    if (rec.dischargeMa) rows.push(row("Discharge current", `${rec.dischargeMa} mA`));

    const capNote = rec.usedTypicalCapacity
      ? `<p class="tiny">Using a typical ${rec.typicalCapacityMah} mAh capacity for this size/chemistry since none was entered — enter the printed rating above for a more precise current.</p>`
      : "";

    const notes = [...rec.goalNotes, ...rec.batteryWarnings];
    const notesHtml = notes.length ? `<ul class="notes">${notes.map((n) => `<li>${n}</li>`).join("")}</ul>` : "";
    const chargerNotesHtml = rec.chargerNotes.length
      ? `<div class="charger-notes"><strong>General for this charger:</strong><ul class="notes">${rec.chargerNotes.map((n) => `<li>${n}</li>`).join("")}</ul></div>`
      : "";

    return `
      <section class="step result">
        <h2><span class="step-num">✓</span>Recommended settings</h2>
        <div class="result-grid">${rows.join("")}</div>
        ${capNote}
        ${notesHtml}
        ${chargerNotesHtml}
      </section>`;
  }

  function row(label, value) {
    return `<div class="result-row"><span class="result-label">${label}</span><span class="result-value">${value}</span></div>`;
  }

  function render() {
    const charger = currentCharger();
    const app = document.getElementById("app");
    if (!charger) {
      app.innerHTML = "<p>No charger configured.</p>";
      return;
    }

    let html = `
      <header class="app-header">
        <h1>${charger.name}</h1>
        <p class="tagline">${charger.tagline}</p>
        ${chargerPickerHtml()}
      </header>
      <div class="steps">`;

    html += stepGoal(charger);

    if (state.goalId) html += stepBatteryType(charger);
    if (state.goalId && state.batteryTypeId) html += stepSize(charger);

    let rec = null;
    if (state.goalId && state.batteryTypeId && state.size) {
      const batteryType = charger.batteryTypes.find((b) => b.id === state.batteryTypeId);
      html += stepDetails(charger, batteryType);
      rec = window.ChargerEngine.recommend({
        charger,
        batteryTypeId: state.batteryTypeId,
        goalId: state.goalId,
        size: state.size,
        capacityMah: state.capacityMah,
        speed: state.speed,
      });
    }

    html += "</div>";
    html += resultHtml(charger, rec);

    app.innerHTML = html;
  }

  render();
})();
