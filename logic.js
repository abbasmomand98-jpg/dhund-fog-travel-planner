/* Dhund — pure logic, no DOM. Safe to unit-test in Node. */

/* Visibility bands (metres): Open above 200, Caution 50–200, Closed below 50. */
function statusForVisibility(metres) {
  metres = Number(metres);
  if (isNaN(metres) || metres < 0) { return "Closed"; }
  if (metres < 50) { return "Closed"; }
  if (metres <= 200) { return "Caution"; }
  return "Open";
}

function findSection(sections, id) {
  for (var i = 0; i < sections.length; i++) {
    if (sections[i].id === id) { return sections[i]; }
  }
  return null;
}

function filterSections(sections, status) {
  if (!status || status === "All") { return sections.slice(); }
  return sections.filter(function (s) {
    return statusForVisibility(s.visibility) === status;
  });
}

function isFogPeakHour(hour) {
  hour = Number(hour);
  return !isNaN(hour) && hour >= FOG_PEAK_START && hour < FOG_PEAK_END;
}

/* Departure verdict. Pure: returns a verdict, never touches the DOM.
   - A Closed section always means DELAY, at any hour.
   - A Caution section in the morning fog peak (05:00–10:00) means DELAY.
   - Otherwise the verdict is GO. */
function planDeparture(sections, sectionId, hour) {
  var section = findSection(sections, sectionId);
  if (!section) {
    return { verdict: "DELAY", reason: "Pick a motorway section first.", window: "" };
  }
  var status = statusForVisibility(section.visibility);
  if (status === "Closed") {
    return { verdict: "DELAY",
             reason: section.code + " is Closed — visibility only " + section.visibility + "m.",
             window: "Next safe window: depart " + SAFE_WINDOW + ", when fog lifts and the section reopens. Recheck before you leave." };
  }
  if (status === "Caution" && isFogPeakHour(hour)) {
    return { verdict: "DELAY",
             reason: section.code + " is on Caution at " + section.visibility + "m, and fog is thickest 05:00–10:00 AM.",
             window: "Next safe window: depart " + SAFE_WINDOW + ". Recheck before you leave." };
  }
  return { verdict: "GO",
           reason: section.code + " is " + status + " at " + section.visibility + "m for this departure time.",
           window: "Safe to go — but recheck visibility before you leave, and drive to the fog rules below." };
}

function sectionSummary(sections) {
  var counts = { Open: 0, Caution: 0, Closed: 0 };
  sections.forEach(function (s) {
    counts[statusForVisibility(s.visibility)]++;
  });
  return counts;
}
