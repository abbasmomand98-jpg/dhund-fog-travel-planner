/* Dhund — sample data ONLY. Every section visibility figure, status, rule and
   checklist item below is invented for demonstrating the design. These are NOT
   live motorway conditions and NOT real closure notices. Do not use this demo
   to decide a real journey — always check an official source before travelling.
   No real person, phone number or helpline number is shown. */
var SECTIONS = [
  { id: "M1", code: "M1", name: "Peshawar–Islamabad", visibility: 40 },
  { id: "M2", code: "M2", name: "Lahore–Islamabad", visibility: 120 },
  { id: "M3", code: "M3", name: "Lahore–Abdul Hakeem", visibility: 350 },
  { id: "M4", code: "M4", name: "Pindi Bhattian–Multan", visibility: 80 }
];

var GUIDE_RULES = [
  { title: "Slow down — halve your speed", detail: "If you cannot see 100m, drive under 50 km/h." },
  { title: "Fog lights on, high beam off", detail: "High beam reflects off fog and blinds you." },
  { title: "Never use hazard lights while moving", detail: "Hazards mean stopped — not driving in fog." },
  { title: "Follow lane lines, not the car ahead", detail: "Tailgating in fog causes pile-ups." }
];

var KIT_ITEMS = [
  "Fog lights checked",
  "Charged phone + power bank",
  "Water + warm blanket",
  "Reflective triangle"
];

var FOG_PEAK_START = 5;   /* 05:00 AM — fog is thickest in the morning */
var FOG_PEAK_END = 10;    /* 10:00 AM — peak window ends */
var SAFE_WINDOW = "after 11:00 AM";
