/* Dhund — smoke tests. Run: node test.js
   Covers: section count + figures, visibility-band boundaries, status filter,
   planner verdicts (incl. closed-section → DELAY), guide rules, kit items. */
var fs = require("fs");
var path = require("path");

var dataCode = fs.readFileSync(path.join(__dirname, "data.js"), "utf8");
var logicCode = fs.readFileSync(path.join(__dirname, "logic.js"), "utf8");
var scope = new Function(dataCode + "\n" + logicCode +
  "\nreturn { statusForVisibility: statusForVisibility, " +
  "findSection: findSection, filterSections: filterSections, " +
  "isFogPeakHour: isFogPeakHour, planDeparture: planDeparture, " +
  "sectionSummary: sectionSummary, SECTIONS: SECTIONS, " +
  "GUIDE_RULES: GUIDE_RULES, KIT_ITEMS: KIT_ITEMS };")();

var total = 0, passed = 0;
function check(name, cond) {
  total++;
  if (cond) { passed++; console.log("PASS " + name); }
  else { console.log("FAIL " + name); }
}

// --- sections (must match the case-study mockups exactly) ---
check("4 sections", scope.SECTIONS.length === 4);
check("M1 = 40m", scope.findSection(scope.SECTIONS, "M1").visibility === 40);
check("M2 = 120m", scope.findSection(scope.SECTIONS, "M2").visibility === 120);
check("M3 = 350m", scope.findSection(scope.SECTIONS, "M3").visibility === 350);
check("M4 = 80m", scope.findSection(scope.SECTIONS, "M4").visibility === 80);
check("M1 route = Peshawar–Islamabad",
  scope.findSection(scope.SECTIONS, "M1").name === "Peshawar–Islamabad");
check("M2 route = Lahore–Islamabad",
  scope.findSection(scope.SECTIONS, "M2").name === "Lahore–Islamabad");
check("M3 route = Lahore–Abdul Hakeem",
  scope.findSection(scope.SECTIONS, "M3").name === "Lahore–Abdul Hakeem");
check("M4 route = Pindi Bhattian–Multan",
  scope.findSection(scope.SECTIONS, "M4").name === "Pindi Bhattian–Multan");
check("unknown section = null", scope.findSection(scope.SECTIONS, "M9") === null);

// --- visibility bands ---
check("49m = Closed", scope.statusForVisibility(49) === "Closed");
check("40m = Closed", scope.statusForVisibility(40) === "Closed");
check("50m = Caution", scope.statusForVisibility(50) === "Caution");
check("120m = Caution", scope.statusForVisibility(120) === "Caution");
check("200m = Caution", scope.statusForVisibility(200) === "Caution");
check("201m = Open", scope.statusForVisibility(201) === "Open");
check("350m = Open", scope.statusForVisibility(350) === "Open");

// --- status filter ---
check("filter All = 4", scope.filterSections(scope.SECTIONS, "All").length === 4);
check("filter Closed = 1 (M1)", scope.filterSections(scope.SECTIONS, "Closed").length === 1);
check("filter Caution = 2 (M2, M4)", scope.filterSections(scope.SECTIONS, "Caution").length === 2);
check("filter Open = 1 (M3)", scope.filterSections(scope.SECTIONS, "Open").length === 1);
var sum = scope.sectionSummary(scope.SECTIONS);
check("summary: 1 Open, 2 Caution, 1 Closed",
  sum.Open === 1 && sum.Caution === 2 && sum.Closed === 1);

// --- fog-peak hours ---
check("07:00 is fog peak", scope.isFogPeakHour(7) === true);
check("05:00 is fog peak", scope.isFogPeakHour(5) === true);
check("10:00 is not fog peak", scope.isFogPeakHour(10) === false);
check("11:00 is not fog peak", scope.isFogPeakHour(11) === false);

// --- planner verdicts ---
check("M1 07:00 = DELAY (closed)", scope.planDeparture(scope.SECTIONS, "M1", 7).verdict === "DELAY");
check("M1 12:00 = DELAY (closed at any hour)", scope.planDeparture(scope.SECTIONS, "M1", 12).verdict === "DELAY");
check("M1 delay reason names 40m", scope.planDeparture(scope.SECTIONS, "M1", 7).reason.indexOf("40m") !== -1);
check("M2 07:00 = DELAY (caution + peak)", scope.planDeparture(scope.SECTIONS, "M2", 7).verdict === "DELAY");
check("M2 11:00 = GO", scope.planDeparture(scope.SECTIONS, "M2", 11).verdict === "GO");
check("M4 09:00 = DELAY (caution + peak)", scope.planDeparture(scope.SECTIONS, "M4", 9).verdict === "DELAY");
check("M4 12:00 = GO", scope.planDeparture(scope.SECTIONS, "M4", 12).verdict === "GO");
check("M3 07:00 = GO (open)", scope.planDeparture(scope.SECTIONS, "M3", 7).verdict === "GO");
check("M3 06:00 = GO (open even in peak)", scope.planDeparture(scope.SECTIONS, "M3", 6).verdict === "GO");
check("DELAY window names 11:00 AM", scope.planDeparture(scope.SECTIONS, "M1", 7).window.indexOf("11:00 AM") !== -1);
check("unknown route = DELAY", scope.planDeparture(scope.SECTIONS, "M9", 7).verdict === "DELAY");

// --- guide + kit ---
check("4 guide rules", scope.GUIDE_RULES.length === 4);
check("guide warns on hazard lights",
  scope.GUIDE_RULES.some(function (r) { return r.title.indexOf("hazard") !== -1; }));
check("4 kit items", scope.KIT_ITEMS.length === 4);
check("kit includes reflective triangle",
  scope.KIT_ITEMS.indexOf("Reflective triangle") !== -1);

console.log("\n" + passed + "/" + total + " smoke tests passed.");
process.exit(passed === total ? 0 : 1);
