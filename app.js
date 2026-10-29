/* Dhund — DOM wiring. Logic lives in logic.js; data lives in data.js. */
(function () {
  var KIT_KEY = "dhund-kit-v1";

  function statusClass(status) {
    return "flag " + status.toLowerCase();
  }

  function renderSections() {
    var filter = document.getElementById("status-filter").value;
    var list = filterSections(SECTIONS, filter);
    var box = document.getElementById("section-list");
    document.getElementById("section-count").textContent =
      list.length + " of " + SECTIONS.length + " sections shown.";
    box.innerHTML = "";
    list.forEach(function (s) {
      var status = statusForVisibility(s.visibility);
      var card = document.createElement("div");
      card.className = "card section-card";
      var title = document.createElement("p");
      title.innerHTML = "<strong>" + s.code + " · " + s.name + "</strong>";
      var vis = document.createElement("p");
      vis.textContent = s.visibility + "m visibility";
      var flag = document.createElement("span");
      flag.className = statusClass(status);
      flag.textContent = status.toUpperCase();
      card.appendChild(title);
      card.appendChild(vis);
      card.appendChild(flag);
      box.appendChild(card);
    });
  }

  function renderRoutes() {
    var sel = document.getElementById("route-select");
    SECTIONS.forEach(function (s) {
      var opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = s.code + " · " + s.name + " (" + s.visibility + "m, " +
        statusForVisibility(s.visibility) + ")";
      sel.appendChild(opt);
    });
  }

  function checkDeparture() {
    var sectionId = document.getElementById("route-select").value;
    var timeVal = document.getElementById("departure-time").value || "07:00";
    var hour = Number(timeVal.split(":")[0]);
    var result = planDeparture(SECTIONS, sectionId, hour);
    var card = document.getElementById("verdict-card");
    card.hidden = false;
    card.className = "card verdict-" + result.verdict.toLowerCase();
    document.getElementById("verdict-text").textContent = result.verdict;
    document.getElementById("verdict-reason").textContent = result.reason;
    document.getElementById("verdict-window").textContent = result.window;
  }

  function loadKit() {
    try {
      var saved = JSON.parse(localStorage.getItem(KIT_KEY) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch (e) { return []; }
  }

  function saveKit(checked) {
    try { localStorage.setItem(KIT_KEY, JSON.stringify(checked)); } catch (e) { /* private mode */ }
  }

  function renderKit() {
    var checked = loadKit();
    var box = document.getElementById("kit-list");
    box.innerHTML = "";
    KIT_ITEMS.forEach(function (item, i) {
      var label = document.createElement("label");
      label.className = "kit-row";
      var boxEl = document.createElement("input");
      boxEl.type = "checkbox";
      boxEl.checked = checked.indexOf(i) !== -1;
      boxEl.addEventListener("change", function () {
        var now = loadKit();
        var pos = now.indexOf(i);
        if (boxEl.checked && pos === -1) { now.push(i); }
        if (!boxEl.checked && pos !== -1) { now.splice(pos, 1); }
        saveKit(now);
        renderKitProgress();
      });
      label.appendChild(boxEl);
      label.appendChild(document.createTextNode(" " + item));
      box.appendChild(label);
    });
    renderKitProgress();
  }

  function renderKitProgress() {
    var checked = loadKit();
    document.getElementById("kit-progress").textContent =
      checked.length + " of " + KIT_ITEMS.length + " kit items ticked.";
  }

  function renderGuide() {
    var list = document.getElementById("guide-list");
    GUIDE_RULES.forEach(function (rule) {
      var li = document.createElement("li");
      var title = document.createElement("strong");
      title.textContent = rule.title;
      li.appendChild(title);
      li.appendChild(document.createTextNode(" — " + rule.detail));
      list.appendChild(li);
    });
  }

  document.getElementById("status-filter").addEventListener("change", renderSections);
  document.getElementById("plan-btn").addEventListener("click", checkDeparture);
  document.getElementById("kit-reset-btn").addEventListener("click", function () {
    saveKit([]);
    renderKit();
  });

  renderSections();
  renderRoutes();
  renderGuide();
  renderKit();
})();
