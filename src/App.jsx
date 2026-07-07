import React, { useState, useEffect } from "react";
import { Copy, Download, DollarSign, Radar, Wrench, Search, Factory, Flame, Grid3X3, ClipboardCheck, AlertTriangle, RefreshCw, ShieldCheck, Handshake, Plane, LayoutDashboard, Target, Building2, Users, CheckSquare, Plus, X, Pencil, Trash2, Filter, RotateCcw, UserPlus, TrendingUp, BarChart3, ArrowRight, Phone, Mail, CalendarDays, MessageSquare, Settings, LogOut, Lock, Eye, Package, FileText, Check, ChevronDown, ChevronUp, Send } from "lucide-react";

/* ------------------------------------------------------------------ */
/* BAI Africa CRM v37 - Landing page refined: editorial serif display,  */
/* burnished-gold aviation accent, ICAO coverage strip as signature.    */
/* Two-column structure preserved. All landing styling is scoped to the */
/* !me branch — global palette C is unchanged.                          */
/* v36: Industry Network (relationship contacts not tied to a customer  */
/* account) as an Aircraft 360 sub-tab visible to Area Director & execs.*/
/* Product catalog · Quote builder · Discount approval workflow        */
/* Chain: Area Director → COO → CEO → President (by discount %)        */
/* Persistent via window.storage (key: bai_crm_v4, migrates v3/v2/v1)  */
/* ------------------------------------------------------------------ */

const KEY_V36 = "bai_crm_v36";
const KEY_V35 = "bai_crm_v35";
const KEY_V34 = "bai_crm_v34";
const KEY_V33 = "bai_crm_v33";
const KEY_V32 = "bai_crm_v32";
const KEY_V31 = "bai_crm_v31";
const KEY_V30 = "bai_crm_v30";
const KEY_V29 = "bai_crm_v29";
const KEY_V28 = "bai_crm_v28";
const KEY_V27 = "bai_crm_v27";
const KEY_V26 = "bai_crm_v26";
const KEY_V25 = "bai_crm_v25";
const KEY_V24 = "bai_crm_v24";
const KEY_V23 = "bai_crm_v23";
const KEY_V22 = "bai_crm_v22";
const KEY_V21 = "bai_crm_v21";
const KEY_V20 = "bai_crm_v20";
const KEY_V19 = "bai_crm_v19";
const KEY_V18 = "bai_crm_v18";
const KEY_V17 = "bai_crm_v17";
const KEY_V16 = "bai_crm_v16";
const KEY_V15 = "bai_crm_v15";
const KEY_V14 = "bai_crm_v14";
const KEY_V13 = "bai_crm_v13";
const KEY_V12 = "bai_crm_v12";
const KEY_V11 = "bai_crm_v11";
const KEY_V10 = "bai_crm_v10";
const KEY_V9 = "bai_crm_v9";
const KEY_V8 = "bai_crm_v8";
const KEY_V7 = "bai_crm_v7";
const KEY_V6 = "bai_crm_v6";
const KEY_V5 = "bai_crm_v5";
const KEY_V4 = "bai_crm_v4";
const KEY_V3 = "bai_crm_v3";
const KEY_V2 = "bai_crm_v2";
const KEY_V1 = "bai_crm_v1";

const PRODUCTS = {
  "Oshino Lamps": { rate: 0.03, short: "Oshino" },
  "Repair Management": { rate: 0.03, short: "Repair Mgmt" },
  "Vogt PMA Parts": { rate: 0.05, short: "Vogt PMA" },
  "Anjou Seat Belts": { rate: 0.05, short: "Anjou" },
  "Novega ULBs": { rate: 0.05, short: "Novega" }, // rate TBC — not in June 2026 memo
  "Tooling & Calibration": { rate: 0.03, short: "Tooling" }, // rate TBC — line from banner.aero, not in June 2026 memo
};

const STAGES = ["Prospect", "Contacted", "Meeting Held", "Quote / RFQ", "Negotiation", "Won", "Lost"];
const STAGE_PROB = { Prospect: 10, Contacted: 20, "Meeting Held": 40, "Quote / RFQ": 60, Negotiation: 75, Won: 100, Lost: 0 };
const STAGE_FCAT = { Prospect: "Pipeline", Contacted: "Pipeline", "Meeting Held": "Pipeline", "Quote / RFQ": "Upside", Negotiation: "Forecast", Won: "Closed", Lost: "Omitted" };
const FORECAST_CATS = ["Omitted", "Pipeline", "Upside", "Forecast", "Closed"]; // Oracle forecast categories
const LEAD_STATUSES = ["Unqualified", "Qualified", "Converted", "Retired"]; // Oracle lead progression
const LEAD_RANKS = ["Hot", "Warm", "Cool"];
const LEAD_SOURCES = ["Referral", "Event / Conference", "LinkedIn", "Cold Outreach", "Inbound", "Existing Relationship"];
const INTERACTION_TYPES = ["Call", "Email", "Meeting", "WhatsApp", "Note"];
const REGIONS = ["East Africa", "West Africa", "Southern Africa", "Central Africa", "North Africa", "Middle East"];
const TIERS = ["Tier 1", "Tier 2", "Tier 3"];

/* ------------------------- roles & approvals ----------------------- */

const ROLES = {
  "Area Director": { scope: "all", edit: true, admin: true, catalog: true, finance: true, blurb: "Full access — all territories, team, quota, catalog & approvals." },
  "Territory Manager (BD)": { scope: "region", edit: true, admin: false, catalog: false, finance: false, blurb: "Works own territory — full edit within assigned region." },
  "COO": { scope: "all", edit: false, admin: false, catalog: false, finance: false, blurb: "View all territories · approves discounts at COO level." },
  "CEO": { scope: "all", edit: false, admin: false, catalog: false, finance: false, blurb: "View all territories · approves discounts at CEO level." },
  "President": { scope: "all", edit: false, admin: false, catalog: false, finance: false, blurb: "View all territories · approves discounts at President level." },
  "Analyst": { scope: "all", edit: false, admin: false, catalog: true, finance: false, blurb: "Analytics access — view all data; can update catalog & pricing." },
  "Operations": { scope: "all", edit: false, admin: false, catalog: true, finance: false, blurb: "Tracks orders and quotes across the territory; maintains product list & pricing." },
  "Finance": { scope: "all", edit: false, admin: false, catalog: false, finance: true, blurb: "Tracks collections; processes commission payouts to staff." },
};
const ROLE_NAMES = Object.keys(ROLES);
const OWNER_ROLES = ["Area Director", "Territory Manager (BD)"];
const roleColorMap = { "Area Director": "#B8720F", "Territory Manager (BD)": "#0E6E6E", COO: "#14538C", CEO: "#14538C", President: "#0C3557", Analyst: "#6E88A0", Operations: "#256E4E", Finance: "#A63A3A" };

const DEFAULT_THRESHOLDS = { ad: 5, coo: 10, ceo: 15, president: 20 };
const APPROVAL_LEVELS = [
  { key: "ad", role: "Area Director" },
  { key: "coo", role: "COO" },
  { key: "ceo", role: "CEO" },
  { key: "president", role: "President" },
];
/* Discount % above a threshold pulls that level into the chain (sequential). */
const requiredChain = (pct, th) => APPROVAL_LEVELS.filter((l) => pct > (Number(th[l.key]) || 0)).map((l) => l.role);

/* Payment terms carry their own approval matrix: credit exposure escalates sign-off. */
const PAYMENT_TERMS = ["Cash on Order", "Cash on Delivery", "Net 20 days", "Net 45 days", "Net 60 days"];
const TERMS_LEVEL_OPTIONS = ["None (auto)", "Area Director", "COO", "CEO", "President"];
const DEFAULT_TERMS_MATRIX = {
  "Cash on Order": "None (auto)",
  "Cash on Delivery": "Area Director",
  "Net 20 days": "Area Director",
  "Net 45 days": "COO",
  "Net 60 days": "CEO",
};
const discountDepth = (pct, th) => APPROVAL_LEVELS.filter((l) => pct > (Number(th[l.key]) || 0)).length;
const termsDepth = (term, matrix) => {
  const lvl = (matrix || DEFAULT_TERMS_MATRIX)[term] || "None (auto)";
  const i = APPROVAL_LEVELS.findIndex((l) => l.role === lvl);
  return i === -1 ? 0 : i + 1;
};
/* Combined chain = deepest requirement wins; approvals run sequentially AD -> COO -> CEO -> President. */
const chainForQuote = (pct, term, th, matrix) =>
  APPROVAL_LEVELS.slice(0, Math.max(discountDepth(pct, th), termsDepth(term, matrix))).map((l) => l.role);

const QUOTE_STATUSES = ["Draft", "Pending Approval", "Approved", "Rejected", "Sent", "Accepted", "Declined"];
const quoteStatusColor = { Draft: "#8CA0AE", "Pending Approval": "#B8720F", Approved: "#256E4E", Rejected: "#A63A3A", Sent: "#14538C", Accepted: "#256E4E", Declined: "#A63A3A" };

/* Guided selling — requirements & rules per product line (from Banner product docs) */
const GUIDANCE = {
  "Anjou Seat Belts": "Collect Aircraft Type, LOPA and seat CMM. SB route: 2\u20134 wks first time; STC route (A330/A350/B777/B787/737NG without existing STC): 3\u20136 months. Production 2\u20133 wks, delivery \u22641 wk, 36-month warranty. Anchor: Anjou \u2248\u20AC95/belt vs AmSafe \u2248$300.",
  "Novega ULBs": "Confirm recorder models \u2014 L3Harris FA2100/FA5000 and Universal Avionics CVFDR/CVR/FDR service letters support alternate ULB installation. GREEN90 is lithium-free: standard shipping, no hazmat handling.",
  "Vogt PMA Parts": "Confirm NHA and OEM PN cross-reference (e.g. lav systems 24E507009G03 / 24E507040G04). FAA-PMA approved; check lessor consent position early.",
  "Oshino Lamps": "Provide aircraft type and current lamp PNs for OL-prefix cross-reference. LED direct replacements are FAA-PMA/STC and EASA approved.",
  "Repair Management": "Scope per event: component PN, condition, required TAT. 400+ FAA/EASA certified shop network; AOG 24/7/365.",
  "Tooling & Calibration": "Banner partners with 100+ tooling/GSE brands: hand tools, instruments (borescopes, analyzers), GSE (engine stands, lifts), custom manufacturing (3D printing, machining), hardware and maintenance materials. EASA/FAA-approved machine shops; stock and custom solutions per RFQ.",
};

const COND_CODES = ["NE", "NS", "OH", "SV", "AR", "RP", "SVC"]; // New, New Surplus, Overhauled, Serviceable, As Removed, Repaired, Service
const COND_LEGEND = "Condition codes: NE New | NS New Surplus | OH Overhauled | SV Serviceable | AR As Removed | RP Repaired | SVC Service";
const INCOTERMS = ["EXW Hollywood, FL", "FCA Miami, FL", "FOB Miami, FL", "CIP Destination", "CPT Destination", "DAP Destination", "DDP Destination"];

/* -------------------- Aircraft 360 reference data ------------------- */

const ATA_CHAPTERS = [
  { ch: 21, name: "Air Conditioning" }, { ch: 23, name: "Communications" }, { ch: 24, name: "Electrical Power" },
  { ch: 25, name: "Equipment & Furnishings", banner: ["Anjou Seat Belts"] }, { ch: 26, name: "Fire Protection" },
  { ch: 27, name: "Flight Controls" }, { ch: 28, name: "Fuel" }, { ch: 29, name: "Hydraulic Power" },
  { ch: 30, name: "Ice & Rain Protection" }, { ch: 31, name: "Indicating / Recording", banner: ["Novega ULBs"] },
  { ch: 32, name: "Landing Gear" }, { ch: 33, name: "Lights", banner: ["Oshino Lamps"] },
  { ch: 34, name: "Navigation" }, { ch: 35, name: "Oxygen" }, { ch: 36, name: "Pneumatic" },
  { ch: 38, name: "Water / Waste", banner: ["Vogt PMA Parts"] }, { ch: 49, name: "APU" },
  { ch: 52, name: "Doors" }, { ch: 57, name: "Wings" },
];

/* Aircraft family -> recommended Banner lines (opportunity engine) */
const fleetSuggest = (type) => {
  const base = ["Oshino Lamps", "Anjou Seat Belts", "Novega ULBs", "Repair Management"];
  const t = (type || "").toUpperCase();
  if (/737|777|787|767/.test(t)) return [...base, "Vogt PMA Parts"]; // Boeing lav-system PMA fit
  return base;
};

/* Indicative fleet compositions (public sources, 2025) — VERIFY before customer use */
const REVENUE_SEED = {
  a21: { total: 164834, lastActive: "07-2026", monthly: { "01-2025": 2459, "02-2025": 12385, "06-2025": 12984, "08-2025": 9426, "10-2025": 4640, "11-2025": 850, "12-2025": 4030, "02-2026": 1890, "03-2026": 800, "04-2026": 4600, "05-2026": 52200, "06-2026": 51870, "07-2026": 6700 } },
  a23: { total: 0, lastActive: null, monthly: {  } },
  a54: { total: 0, lastActive: null, monthly: {  } },
  a53: { total: 324326, lastActive: "06-2026", monthly: { "01-2025": 63174, "02-2025": 18650, "03-2025": 1000, "04-2025": 6225, "05-2025": 2500, "06-2025": 18920, "07-2025": 30977, "08-2025": 5950, "09-2025": 122944, "11-2025": 31145, "12-2025": 600, "03-2026": 15762, "04-2026": 4530, "06-2026": 1950 } },
  a55: { total: 1485, lastActive: "06-2025", monthly: { "03-2025": 1160, "06-2025": 325 } },
  a52: { total: 53966, lastActive: "07-2026", monthly: { "01-2025": 4100, "05-2025": 1150, "06-2025": 22382, "07-2025": 725, "08-2025": 200, "10-2025": 150, "11-2025": 300, "12-2025": 8000, "01-2026": 1469, "03-2026": 5598, "04-2026": 5587, "05-2026": 3165, "06-2026": 400, "07-2026": 740 } },
  a32: { total: 7154, lastActive: "04-2025", monthly: { "03-2025": 6904, "04-2025": 250 } },
  a27: { total: 526058, lastActive: "05-2026", monthly: { "01-2025": 82485, "02-2025": 40433, "03-2025": 73935, "04-2025": 21300, "05-2025": 2320, "06-2025": 14495, "07-2025": 30780, "08-2025": 42030, "11-2025": 19290, "12-2025": 22700, "01-2026": 625, "02-2026": 47804, "03-2026": 113900, "04-2026": 7110, "05-2026": 6850 } },
  a56: { total: 0, lastActive: null, monthly: {  } },
  a26: { total: 5880, lastActive: "04-2026", monthly: { "07-2025": 2105, "03-2026": 850, "04-2026": 2925 } },
  a31: { total: 96467, lastActive: "07-2026", monthly: { "05-2025": 4642, "06-2025": 8606, "07-2025": 10383, "08-2025": 23189, "09-2025": 10990, "10-2025": 608, "11-2025": 990, "12-2025": 2813, "02-2026": 202, "03-2026": 840, "06-2026": 8609, "07-2026": 24595 } },
  a30: { total: 0, lastActive: null, monthly: {  } },
  a29: { total: 328957, lastActive: "05-2026", monthly: { "01-2025": 100, "02-2025": 140761, "03-2025": 2344, "04-2025": 15804, "05-2025": 64109, "06-2025": 4470, "07-2025": 5060, "08-2025": 28462, "09-2025": 9835, "10-2025": 350, "11-2025": 1152, "01-2026": 1100, "02-2026": 7880, "03-2026": 9950, "04-2026": 36740, "05-2026": 839 } },
  a28: { total: 26943, lastActive: "03-2026", monthly: { "03-2025": 344, "05-2025": 5341, "06-2025": 678, "07-2025": 6450, "08-2025": 2105, "09-2025": 2280, "12-2025": 600, "01-2026": 2450, "03-2026": 6695 } },
  a35: { total: 36520, lastActive: "11-2025", monthly: { "02-2025": 14657, "03-2025": 15123, "05-2025": 1000, "06-2025": 3974, "08-2025": 1280, "11-2025": 485 } },
  a37: { total: 12298, lastActive: "02-2026", monthly: { "01-2026": 7079, "02-2026": 5219 } },
  a36: { total: 110274, lastActive: "05-2026", monthly: { "01-2025": 26307, "02-2025": 8540, "03-2025": 27774, "04-2025": 5205, "06-2025": 3838, "08-2025": 1400, "09-2025": 310, "10-2025": 505, "12-2025": 5195, "01-2026": 2820, "02-2026": 4990, "03-2026": 10350, "05-2026": 13040 } },
  a45: { total: 11168, lastActive: "06-2026", monthly: { "11-2025": 9415, "03-2026": 1513, "06-2026": 240 } },
  a13: { total: 85924, lastActive: "07-2026", monthly: { "04-2026": 4220, "05-2026": 78800, "06-2026": 1395, "07-2026": 1510 } },
  a42: { total: 25505, lastActive: "05-2026", monthly: { "02-2026": 640, "03-2026": 6255, "04-2026": 1800, "05-2026": 16810 } },
  a39: { total: 28861, lastActive: "06-2026", monthly: { "01-2026": 6610, "02-2026": 1150, "03-2026": 4045, "04-2026": 8230, "05-2026": 1860, "06-2026": 6965 } },
  a47: { total: 216086, lastActive: "06-2026", monthly: { "01-2025": 8735, "02-2025": 9925, "03-2025": 7655, "04-2025": 3695, "05-2025": 8090, "06-2025": 7290, "07-2025": 7925, "08-2025": 9236, "09-2025": 22710, "10-2025": 14400, "11-2025": 3592, "12-2025": 3937, "01-2026": 10076, "02-2026": 290, "03-2026": 24060, "04-2026": 24748, "05-2026": 12589, "06-2026": 37133 } },
  a6: { total: 241671, lastActive: "06-2026", monthly: { "01-2025": 2248, "02-2025": 13685, "03-2025": 13100, "04-2025": 18655, "05-2025": 1125, "06-2025": 4900, "07-2025": 41608, "08-2025": 9860, "09-2025": 7500, "10-2025": 27860, "11-2025": 5190, "12-2025": 27065, "01-2026": 7730, "02-2026": 2760, "03-2026": 3700, "04-2026": 45235, "05-2026": 6655, "06-2026": 2795 } },
  a48: { total: 829680, lastActive: "06-2026", monthly: { "01-2025": 36560, "02-2025": 85210, "03-2025": 71550, "04-2025": 25080, "05-2025": 30050, "06-2025": 11240, "07-2025": 43240, "08-2025": 71750, "09-2025": 8700, "11-2025": 79090, "12-2025": 7700, "01-2026": 48820, "02-2026": 181100, "03-2026": 66060, "04-2026": 16730, "05-2026": 5200, "06-2026": 41600 } },
  a49: { total: 250837, lastActive: "07-2026", monthly: { "02-2025": 6586, "03-2025": 23913, "04-2025": 53764, "05-2025": 17204, "07-2025": 951, "11-2025": 950, "12-2025": 53759, "02-2026": 34546, "03-2026": 8569, "04-2026": 12714, "06-2026": 26829, "07-2026": 11052 } },
  a50: { total: 448059, lastActive: "06-2026", monthly: { "01-2025": 2438, "02-2025": 2623, "03-2025": 18674, "04-2025": 59343, "05-2025": 40265, "06-2025": 67081, "07-2025": 12461, "08-2025": 7200, "09-2025": 8033, "10-2025": 8543, "11-2025": 26033, "12-2025": 6911, "01-2026": 45945, "04-2026": 30983, "05-2026": 44648, "06-2026": 66878 } },
  a4: { total: 166182, lastActive: "06-2026", monthly: { "01-2025": 3350, "02-2025": 45122, "03-2025": 5157, "07-2025": 5600, "09-2025": 5000, "10-2025": 5900, "11-2025": 72103, "03-2026": 2100, "04-2026": 2100, "05-2026": 2100, "06-2026": 17650 } },
  a1: { total: 289613, lastActive: "06-2026", monthly: { "01-2025": 3800, "02-2025": 10050, "03-2025": 6500, "04-2025": 15186, "05-2025": 36037, "06-2025": 1910, "07-2025": 39311, "08-2025": 2325, "10-2025": 22130, "11-2025": 975, "12-2025": 1300, "01-2026": 466, "02-2026": 11844, "03-2026": 104533, "04-2026": 19921, "06-2026": 13324 } },
  a57: { total: 0, lastActive: null, monthly: {  } },
  a12: { total: 0, lastActive: null, monthly: {  } },
  a3: { total: 299447, lastActive: "07-2026", monthly: { "01-2025": 32539, "02-2025": 21094, "03-2025": 60082, "04-2025": 3471, "06-2025": 2165, "07-2025": 6300, "09-2025": 25279, "11-2025": 1188, "02-2026": 8000, "04-2026": 3550, "05-2026": 133800, "07-2026": 1980 } },
  a51: { total: 0, lastActive: null, monthly: {  } },
};

const FUNNEL_SEED = {
  months: ["01-2025", "02-2025", "03-2025", "04-2025", "05-2025", "06-2025", "07-2025", "08-2025", "09-2025", "10-2025", "11-2025", "12-2025", "01-2026", "02-2026", "03-2026", "04-2026", "05-2026", "06-2026", "07-2026"],
  rfqUniquePN: [12, 24, 33, 107, 25, 22, 64, 28, 29, 70, 34, 83, 40, 26, 65, 32, 24, 28, 2],
  quotedUniquePN: [10, 20, 13, 84, 21, 18, 63, 26, 22, 50, 22, 53, 35, 20, 65, 22, 19, 23, 2],
  quotedValueUniquePN: [384890, 347929, 426230, 195428, 81874, 145795, 320050, 221894, 164820, 252535, 276736, 492040, 949815, 166879, 386020, 376450, 220520, 1339310, 11500],
  totalQuotesCount: [6, 14, 10, 13, 6, 7, 20, 13, 14, 13, 10, 22, 13, 13, 13, 12, 11, 13, 2],
  totalQuotesValue: [393300, 375814, 763490, 242100, 153324, 182595, 346900, 292874, 224000, 290195, 412636, 751340, 966815, 166879, 386020, 446240, 250470, 2405110, 11500],
  totalSOCount: [1, 3, 0, 0, 0, 2, 1, 2, 0, 1, 1, 2, 0, 1, 1, 1, 4, 2, 1],
  totalSOValue: [4390, 7995, 0, 0, 0, 14100, 840, 8310, 0, 3800, 1800, 3080, 0, 1890, 800, 4600, 91170, 12900, 6700],
  totalInvoices: [2459, 12385, 0, 0, 0, 12984, 0, 9426, 0, 4640, 850, 4030, 0, 1890, 800, 4600, 52200, 51870, 6700],
};

/* Report classification & distribution — mirrors document-handling convention.
   Each role has a ceiling on how sensitive a report it may generate or receive. */
const MONTH_ORD = ["01","02","03","04","05","06","07","08","09","10","11","12"];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
/* Display-only: "07-2026" -> "Jul 2026". The underlying MM-YYYY string stays
   the actual data key everywhere else (matching, sorting, storage). */
const formatMonth = (m) => {
  if (!m || typeof m !== "string" || !m.includes("-")) return m;
  const [mm, yy] = m.split("-");
  const idx = Number(mm) - 1;
  return idx >= 0 && idx < 12 ? `${MONTH_NAMES[idx]} ${yy}` : m;
};
const monthKey = (m) => { const [mm, yy] = m.split("-"); return Number(yy) * 12 + MONTH_ORD.indexOf(mm); };
const monthInRange = (m, from, to) => (!from || monthKey(m) >= monthKey(from)) && (!to || monthKey(m) <= monthKey(to));
/* Slice FUNNEL_SEED's parallel arrays down to a date range, preserving alignment. */
const filterFunnel = (from, to) => {
  const idx = FUNNEL_SEED.months.map((m, i) => (monthInRange(m, from, to) ? i : -1)).filter((i) => i >= 0);
  const pick = (arr) => idx.map((i) => arr[i]);
  return {
    months: pick(FUNNEL_SEED.months), rfqUniquePN: pick(FUNNEL_SEED.rfqUniquePN), quotedUniquePN: pick(FUNNEL_SEED.quotedUniquePN),
    quotedValueUniquePN: pick(FUNNEL_SEED.quotedValueUniquePN), totalQuotesCount: pick(FUNNEL_SEED.totalQuotesCount), totalQuotesValue: pick(FUNNEL_SEED.totalQuotesValue),
    totalSOCount: pick(FUNNEL_SEED.totalSOCount), totalSOValue: pick(FUNNEL_SEED.totalSOValue), totalInvoices: pick(FUNNEL_SEED.totalInvoices),
  };
};

const CLASSIFICATIONS = ["Public", "Internal", "Confidential", "Restricted"];
const CLASS_COLOR = { Public: "#256E4E", Internal: "#14538C", Confidential: "#B8720F", Restricted: "#A63A3A" };
const CLASS_CEILING = {
  "Area Director": "Restricted", "Finance": "Restricted",
  "COO": "Confidential", "CEO": "Confidential", "President": "Confidential",
  "Territory Manager (BD)": "Internal", "Analyst": "Internal", "Operations": "Internal",
};
const classRank = (c) => CLASSIFICATIONS.indexOf(c);
const maxClassFor = (role) => CLASS_CEILING[role] || "Public";

/* Report sections — each can require a minimum classification and/or specific roles. */
const REPORT_SECTIONS = [
  { id: "kpis", label: "Executive KPIs (win rate, cycle time, avg deal size)", minClass: "Public" },
  { id: "revenue", label: "Historic invoiced revenue trend", minClass: "Internal" },
  { id: "monthlyDetail", label: "Monthly tracking — revenue & funnel, month by month", minClass: "Internal" },
  { id: "stageTracking", label: "Sales stage tracking by month", minClass: "Internal" },
  { id: "invoiceAging", label: "Invoice collection & aging (AR)", minClass: "Internal" },
  { id: "repDetail", label: "Detailed breakdown — per rep (named)", minClass: "Confidential" },
  { id: "productDetail", label: "Detailed breakdown — per product line", minClass: "Internal" },
  { id: "accountDetail", label: "Detailed breakdown — per airline / account (full list)", minClass: "Internal" },
  { id: "aircraftDetail", label: "Detailed breakdown — per aircraft model", minClass: "Internal" },
  { id: "rawMatrix", label: "Raw invoice data — account × month (full detail, no summarizing)", minClass: "Internal" },
  { id: "funnel", label: "BD funnel — RFQ / Quoted / Sales Order / Invoiced", minClass: "Internal" },
  { id: "topAccounts", label: "Top accounts by invoiced revenue", minClass: "Internal" },
  { id: "region", label: "Open pipeline by region", minClass: "Public" },
  { id: "product", label: "Open pipeline by product line", minClass: "Public" },
  { id: "owner", label: "Open pipeline by owner (named reps)", minClass: "Confidential" },
  { id: "loss", label: "Lost deal reasons", minClass: "Internal" },
  { id: "commission", label: "Commission summary (Finance/Area Director only)", minClass: "Restricted", roles: ["Area Director", "Finance"] },
];

const FLEET_SEED = {
  /* Verified mid-2026 where sourced (ET factsheet 04/2026: 170+ a/c avg age 7y; KQ ch-aviation/AeroTime 01/2026: ~34 a/c). Others indicative — verify. */
  a1: [{ type: "B787", count: 30, engine: "GEnx" }, { type: "A350", count: 28, engine: "Trent XWB" }, { type: "B777 (pax+F)", count: 28, engine: "GE90" }, { type: "B737NG/MAX", count: 46, engine: "CFM56/LEAP-1B" }, { type: "DHC-8 Q400", count: 30, engine: "PW150A" }, { type: "B767", count: 4, engine: "CF6" }],
  a3: [{ type: "B787-8", count: 9, engine: "GEnx" }, { type: "B737-800", count: 11, engine: "CFM56-7B" }, { type: "B737F (300SF/800SF)", count: 4, engine: "CFM56" }, { type: "E190", count: 9, engine: "CF34-10E" }],
  a4: [{ type: "DHC-8 Q400", count: 10, engine: "PW150A" }],
  a5: [{ type: "B737-800", count: 29, engine: "CFM56-7B" }, { type: "A320neo fam", count: 15, engine: "LEAP-1A" }, { type: "A330", count: 7, engine: "Trent 700" }, { type: "B777-300ER", count: 6, engine: "GE90" }, { type: "B787-9", count: 6, engine: "GEnx" }, { type: "A220", count: 12, engine: "PW1500G" }],
  a6: [{ type: "B737-800/MAX", count: 35, engine: "CFM56/LEAP-1B" }, { type: "B787", count: 9, engine: "GEnx" }, { type: "E190", count: 4, engine: "CF34-10E" }, { type: "ATR 72", count: 6, engine: "PW127" }],
  a7: [{ type: "B737 (Classic/NG)", count: 14, engine: "CFM56" }, { type: "E195-E2", count: 13, engine: "PW1900G" }, { type: "B777", count: 4, engine: "GE90" }, { type: "E145", count: 3, engine: "AE3007" }],
  a8: [{ type: "B737-800", count: 32, engine: "CFM56-7B" }],
  a9: [{ type: "A330", count: 2, engine: "Trent 700" }, { type: "B737-800", count: 4, engine: "CFM56-7B" }, { type: "CRJ900", count: 2, engine: "CF34-8C5" }],
  a10: [{ type: "B737-700/800", count: 7, engine: "CFM56-7B" }, { type: "DHC-8 Q400", count: 2, engine: "PW150A" }],
  a11: [{ type: "A330-800neo", count: 2, engine: "Trent 7000" }, { type: "CRJ900", count: 4, engine: "CF34-8C5" }],
  a12: [{ type: "B787-8", count: 2, engine: "GEnx" }, { type: "A220", count: 4, engine: "PW1500G" }, { type: "DHC-8 Q400", count: 5, engine: "PW150A" }, { type: "B767F", count: 1, engine: "CF6" }],
  a13: [{ type: "Embraer E-Jets (E170/190/195)", count: 45, engine: "CF34-8E/10E" }],
  a21: [{ type: "A320/neo fam", count: 12, engine: "CFM56-5B/LEAP-1A" }],
  a22: [{ type: "A320/A321", count: 5, engine: "V2500/CFM56" }],
  a23: [{ type: "A320", count: 3, engine: "V2500" }],
  a25: [{ type: "A320/neo fam", count: 50, engine: "CFM56/LEAP-1A" }, { type: "A330", count: 4, engine: "Trent 700" }],
  a26: [{ type: "B787-9", count: 10, engine: "GEnx" }, { type: "A320/321neo", count: 23, engine: "LEAP-1A" }],
  a35: [{ type: "ATR 72-600", count: 4, engine: "PW127M" }],
  a36: [{ type: "CRJ900", count: 5, engine: "CF34-8C5" }],
  a40: [{ type: "A320", count: 10, engine: "CFM56/V2500" }, { type: "A330", count: 3, engine: "Trent 700" }],
  a42: [{ type: "B737-400/800 (ACMI)", count: 10, engine: "CFM56" }],
  a45: [{ type: "A350", count: 4, engine: "Trent XWB" }, { type: "A330neo", count: 2, engine: "Trent 7000" }, { type: "ATR 72", count: 3, engine: "PW127" }],
  a48: [{ type: "A330", count: 8, engine: "Trent 700" }, { type: "B737-800", count: 25, engine: "CFM56-7B" }, { type: "ATR 72", count: 12, engine: "PW127" }],
  a49: [{ type: "B737-800", count: 4, engine: "CFM56-7B" }, { type: "DHC-8 Q400/Q200", count: 6, engine: "PW150A/PW123" }],
  a51: [{ type: "Cessna 208 Caravan", count: 9, engine: "PT6A" }, { type: "DHC-8-100/300", count: 3, engine: "PW120" }],
  a53: [{ type: "A320", count: 9, engine: "CFM56-5B" }],
};

/* Model 360 — aircraft family definitions & facts */
const FAMILY_DEFS = [
  { id: "737NG", label: "B737NG / Classic", re: "737(?!.*MAX)", oem: "Boeing", engines: "CFM56-7B (NG) / CFM56-3 (Classic)", vogt: true },
  { id: "737MAX", label: "B737 MAX", re: "MAX", oem: "Boeing", engines: "LEAP-1B", vogt: true },
  { id: "787", label: "B787 Dreamliner", re: "787", oem: "Boeing", engines: "GEnx-1B / Trent 1000", vogt: true },
  { id: "777", label: "B777", re: "777", oem: "Boeing", engines: "GE90-115B / GE90-94B", vogt: true },
  { id: "767", label: "B767", re: "767", oem: "Boeing", engines: "CF6-80 / PW4000", vogt: true },
  { id: "A320", label: "A320 family", re: "A?32[01]|A320", oem: "Airbus", engines: "CFM56-5B / V2500 / LEAP-1A / PW1100G", vogt: false },
  { id: "A330", label: "A330 / neo", re: "330", oem: "Airbus", engines: "Trent 700 / CF6-80E / Trent 7000 (neo)", vogt: false },
  { id: "A350", label: "A350", re: "350", oem: "Airbus", engines: "Trent XWB", vogt: false },
  { id: "A220", label: "A220", re: "220", oem: "Airbus (ex-CSeries)", engines: "PW1500G", vogt: false },
  { id: "EJET", label: "Embraer E-Jets / E2", re: "E1[4-9]|E19|E2\\b|Embraer", oem: "Embraer", engines: "CF34-8E/10E · E2: PW1900G", vogt: false },
  { id: "CRJ", label: "CRJ900", re: "CRJ", oem: "Bombardier/MHI", engines: "CF34-8C5", vogt: false },
  { id: "Q400", label: "DHC-8 / Q400", re: "Q400|Q200|DHC", oem: "De Havilland Canada", engines: "PW150A / PW120-series", vogt: false },
  { id: "ATR", label: "ATR 72", re: "ATR", oem: "ATR", engines: "PW127", vogt: false },
  { id: "C208", label: "Cessna 208 Caravan", re: "Caravan|208", oem: "Textron", engines: "PT6A-114A", vogt: false },
];

/* OEMs Banner represents (per Banner corporate deck) */
const OEM_DIRECTORY = [
  { name: "Oshino Lamps", role: "Authorised distributor", scope: "Nose-to-tail aircraft lighting (OL-prefix); FAA-PMA/STC & EASA LED replacements" },
  { name: "Vogt Aero / Vogt MRO", role: "Distributor — Africa, Asia/Pacific, LATAM", scope: "130+ FAA-PMA, STC & OOP parts; Part 145 component repair (Airmark heritage)" },
  { name: "Anjou Aeronautique", role: "Partner — full cabin support", scope: "Seat belts (TSO C22g / C114), restraints, textiles, composites; EASA 21J/21G/145" },
  { name: "Novega", role: "ULB programme", scope: "SID88 / BLUE90 / GREEN90 underwater locator beacons (L3Harris & UA service letters)" },
  { name: "Thales", role: "Represented manufacturer", scope: "Avionics" },
  { name: "Safran", role: "Represented manufacturer", scope: "Aerospace systems" },
  { name: "Parker", role: "Represented manufacturer", scope: "Hydraulics & fluid systems" },
  { name: "Lufthansa Technik", role: "Partner", scope: "Components & services" },
  { name: "Dayton-Granger", role: "Represented manufacturer", scope: "Antennas, static dischargers" },
  { name: "Bucher", role: "Represented manufacturer", scope: "Cabin interiors" },
  { name: "HRD Aero Systems", role: "Partner", scope: "Safety equipment" },
  { name: "PSE", role: "Partner", scope: "Components" },
  { name: "Kanemats", role: "Represented manufacturer", scope: "Components" },
];

/* African / territory MRO directory (linked to accounts where applicable) */
const MRO_DIRECTORY = [
  { name: "Ethiopian MRO", base: "Addis Ababa (ADD)", accountId: "a2", note: "Largest African MRO; airframe, engine, component" },
  { name: "SAA Technical", base: "Johannesburg (JNB)", accountId: "a39", note: "Wide/narrowbody heavy checks, components" },
  { name: "EgyptAir Maintenance & Engineering", base: "Cairo (CAI)", accountId: "a5", note: "Full MRO arm of EgyptAir" },
  { name: "Kenya Airways Technical", base: "Nairobi (NBO)", accountId: "a3", note: "B787/B737/E190 line & base" },
  { name: "Aerotechnic Industries", base: "Casablanca (CMN)", accountId: "a47", note: "RAM / AFI KLM E&M JV — narrowbody checks" },
  { name: "JORAMCO", base: "Amman (AMM)", accountId: "a30", note: "Independent MRO — A320/B737/B787/E-Jets" },
  { name: "Air Algérie Technics", base: "Algiers (ALG)", accountId: "a48", note: "Flag-carrier MRO" },
  { name: "Tunisair Technics", base: "Tunis (TUN)", accountId: "a52", note: "Tunisair MRO arm — on banner.aero customer map" },
];

/* Key supplier contacts (from official Banner / Vogt materials) */
const SUPPLIER_CONTACTS = [
  { company: "Vogt Aero", name: "Glen Edwardsen", title: "Business Development Director", email: "Glen.Edwardsen@vogtaero.com", phone: "+1 360 721 6055" },
  { company: "Vogt Aero", name: "Erik Vogt", title: "CEO | DER | Accountable Manager", email: "Erik.Vogt@vogtaero.com", phone: "+1 602 721 8567" },
  { company: "Vogt MRO", name: "Wesley Sperry", title: "General Manager", email: "Wesley.Sperry@vogtmro.com", phone: "+1 520 461 4505" },
  { company: "Banner Aircraft International", name: "Sales / AOG Desk", title: "24/7/365 · Customer portal: store.banner.aero", email: "sales@banner.aero", phone: "+1 (855) 822-6637 · +1 (213) 320-7877" },
  { company: "Anjou Aeronautique", name: "Marketing / Commercial", title: "Paris & Toulouse offices", email: "marketing@anjouaero.com", phone: "" },
];

const V12_CAT_ATA = { n1: { ata: 31 }, n2: { ata: 31 }, n3: { ata: 31 }, v1: { ata: 38, pma: true }, v2: { ata: 38, pma: true }, v3: { ata: 38, pma: true }, v4: { ata: 38, pma: true }, v5: { ata: 38, pma: true }, v6: { ata: 38, pma: true }, v7: { ata: 38, pma: true }, o1: { ata: 33 }, o2: { ata: 33 }, o3: { ata: 33 }, o4: { ata: 33 }, o5: { ata: 33 }, o6: { ata: 33, pma: true }, j1: { ata: 25 }, j2: { ata: 25 }, j3: { ata: 25 }, j4: { ata: 25 }, j5: { ata: 25 }, j6: { ata: 25 }, r1: { ata: 0 }, r2: { ata: 0 } };

const AOG_STATUSES = ["Open", "Quoted", "Shipped", "Closed"];
const aogColor = { Open: "#A63A3A", Quoted: "#B8720F", Shipped: "#14538C", Closed: "#256E4E" };

const REG_STATUSES = ["Not started", "Docs submitted", "Under evaluation", "Audit / site visit", "PVL awarded", "Expired"];
const LOSS_REASONS = ["Price", "Lead time", "OEM lock-in", "Lessor consent", "No budget", "Lost to competitor", "No decision", "Other"];
const STALE_DAYS = 14;
const REORDER_LINES = ["Oshino Lamps", "Anjou Seat Belts", "Novega ULBs"];
const REORDER_DAYS = 180;
const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

const uid = () => Math.random().toString(36).slice(2, 10);
const today = () => new Date().toISOString().slice(0, 10);
const fmt = (n) => "$" + Math.round(n).toLocaleString("en-US");
const fmt2 = (n) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const dealValue = (d) => (d.lines || []).reduce((s, l) => s + (Number(l.value) || 0), 0);
/* Owner-based flat commission (replaces per-product-line rates):
   Territory Manager (BD) = 3% of gross deal value on their own deals.
   Area Director = 2% direct on deals they personally register, PLUS a 1%
   override on every deal in the whole territory (including their own). */
const BDM_RATE = 0.03;
const AD_DIRECT_RATE = 0.02;
const AD_OVERRIDE_RATE = 0.01;
const dealDirectCommission = (d, ownerRole) => dealValue(d) * (ownerRole === "Area Director" ? AD_DIRECT_RATE : BDM_RATE);
const dealOverrideCommission = (d) => dealValue(d) * AD_OVERRIDE_RATE;
/* Cross-territory agreement: splits the OWNER's direct commission between owner and an assisting BD. */
const commissionShare = (d, userId, roleOf) => {
  const direct = dealDirectCommission(d, roleOf(d.ownerId));
  const agr = d.agreement;
  if (agr && agr.assistBDId) {
    const assistShare = direct * ((Number(agr.splitPct) || 0) / 100);
    if (d.ownerId === userId) return direct - assistShare;
    if (agr.assistBDId === userId) return assistShare;
    return 0;
  }
  return d.ownerId === userId ? direct : 0;
};
/* Legacy alias used where only a flat total (not owner-split) is needed, e.g. quick previews. */
const dealCommission = (d, ownerRole) => dealDirectCommission(d, ownerRole);
const dealWeighted = (d, stageProbMap = STAGE_PROB) => dealValue(d) * ((d.prob ?? stageProbMap[d.stage] ?? 0) / 100);
/* Given "Q3 2026", returns the three "MM-YYYY" months that make up that quarter. */
const monthToQuarter = (m) => {
  const [mm, yy] = m.split("-");
  return `Q${Math.ceil(Number(mm) / 3)} ${yy}`;
};

const monthsInQuarter = (q) => {
  if (!q) return [];
  const [qLabel, year] = q.split(" ");
  const qNum = Number(qLabel.replace("Q", ""));
  const startMonth = (qNum - 1) * 3 + 1;
  return [0, 1, 2].map((i) => String(startMonth + i).padStart(2, "0") + "-" + year);
};

const quarterOf = (dateStr) => {
  if (!dateStr) return "No date";
  const [y, m] = dateStr.split("-").map(Number);
  return `Q${Math.ceil(m / 3)} ${y}`;
};

/* quote maths */
const quoteSubtotal = (q) => (q.lines || []).reduce((s, l) => s + (Number(l.qty) || 0) * (Number(l.unitPrice) || 0), 0);
const quoteNet = (q) => quoteSubtotal(q) * (1 - (Number(q.discountPct) || 0) / 100);
const TERMS_DAYS = { "Cash on Order": 0, "Cash on Delivery": 0, "Net 20 days": 20, "Net 45 days": 45, "Net 60 days": 60 };
/* Expected collection date follows the accepted quote's payment terms from the deal's close date. */
/* Sales-stage tracking by month, built from each deal's stageHistory log.
   Deals that predate this feature carry one baseline entry (their stage as
   of when logging began) rather than a true transition history — noted in
   the report. */
const buildStageTracking = (deals, dateFrom, dateTo) => {
  const rows = {}; // month -> stage -> {count, value}
  deals.forEach((d) => {
    const val = dealValue(d);
    (d.stageHistory || []).forEach((h) => {
      if (!h.date) return;
      const m = h.date.slice(5, 7) + "-" + h.date.slice(0, 4);
      if (!monthInRange(m, dateFrom, dateTo)) return;
      rows[m] = rows[m] || {};
      rows[m][h.stage] = rows[m][h.stage] || { count: 0, value: 0 };
      rows[m][h.stage].count += 1;
      rows[m][h.stage].value += val;
    });
  });
  const months = Object.keys(rows).sort((a, b) => monthKey(a) - monthKey(b));
  return { months, rows };
};

/* Standard AR aging buckets, computed against each Won deal's expected
   collection date (from its accepted quote's payment terms). */
const AGING_BUCKETS = ["Current", "1-30 days", "31-60 days", "61-90 days", "90+ days"];
const agingBucketFor = (daysOverdue) => {
  if (daysOverdue <= 0) return "Current";
  if (daysOverdue <= 30) return "1-30 days";
  if (daysOverdue <= 60) return "31-60 days";
  if (daysOverdue <= 90) return "61-90 days";
  return "90+ days";
};
const buildInvoiceAging = (deals, quotes) => {
  const won = deals.filter((d) => d.stage === "Won" && !d.collectedAt);
  const buckets = {};
  AGING_BUCKETS.forEach((b) => { buckets[b] = { count: 0, value: 0 }; });
  const lines = won.map((d) => {
    const linkedQ = quotes.find((q) => q.oppId === d.id && q.status === "Accepted");
    const expected = expectedCollectionDate(d, linkedQ);
    const daysOverdue = expected ? daysBetween(expected, today()) : 0;
    const bucket = agingBucketFor(daysOverdue);
    buckets[bucket].count += 1;
    buckets[bucket].value += dealValue(d);
    return { name: d.name, accountId: d.accountId, value: dealValue(d), expected, daysOverdue, bucket, terms: linkedQ?.paymentTerms || "—" };
  }).sort((a, b) => b.daysOverdue - a.daysOverdue);
  return { buckets, lines, totalOutstanding: lines.reduce((s, l) => s + l.value, 0) };
};

/* Detailed per-rep breakdown — named individuals, so this section is
   classification-gated to Confidential+ in REPORT_SECTIONS. */
const buildRepDetail = (deals, quotes, users, roleOf, payouts) => {
  const owners = users.filter((u) => OWNER_ROLES.includes(u.role));
  return owners.map((o) => {
    const relevant = deals.filter((d) => d.ownerId === o.id || (d.agreement && d.agreement.assistBDId === o.id));
    const open = relevant.filter((d) => d.stage !== "Won" && d.stage !== "Lost");
    const won = relevant.filter((d) => d.stage === "Won");
    const collected = won.filter((d) => d.collectedAt);
    const shareOf = (d) => commissionShare(d, o.id, roleOf);
    const maturedComm = collected.reduce((s, d) => s + shareOf(d), 0);
    const paid = payouts.filter((p) => p.ownerId === o.id).reduce((s, p) => s + (Number(p.amount) || 0), 0);
    const ownQuotes = quotes.filter((q) => q.ownerId === o.id);
    return {
      name: o.name, region: o.region || "All territories",
      openCount: open.length, openValue: open.reduce((s, d) => s + dealValue(d), 0), weighted: open.reduce((s, d) => s + dealWeighted(d), 0),
      quotesCount: ownQuotes.length, quotesValue: ownQuotes.reduce((s, q) => s + quoteNet(q), 0),
      wonCount: won.length, wonValue: won.reduce((s, d) => s + dealValue(d), 0),
      maturedComm, payableComm: Math.max(0, maturedComm - paid),
    };
  });
};

/* Detailed per-product-line breakdown: pipeline, quoted, won, catalog depth. */
const buildProductDetail = (deals, quotes, catalog) => {
  const open = deals.filter((d) => d.stage !== "Won" && d.stage !== "Lost");
  const won = deals.filter((d) => d.stage === "Won");
  return Object.keys(PRODUCTS).map((line) => {
    const openLines = open.flatMap((d) => (d.lines || []).filter((l) => l.product === line));
    const wonLines = won.flatMap((d) => (d.lines || []).filter((l) => l.product === line));
    const quoteLines = quotes.flatMap((q) => (q.lines || []).filter((l) => catalog.find((p) => p.id === l.itemId)?.productLine === line).map((l) => ({ ...l, qty: Number(l.qty) || 0, unitPrice: Number(l.unitPrice) || 0 })));
    return {
      label: PRODUCTS[line].short,
      openCount: openLines.length, openValue: openLines.reduce((s, l) => s + (Number(l.value) || 0), 0),
      quotesCount: quoteLines.length, quotesValue: quoteLines.reduce((s, l) => s + l.qty * l.unitPrice, 0),
      wonCount: wonLines.length, wonValue: wonLines.reduce((s, l) => s + (Number(l.value) || 0), 0),
      catalogItems: catalog.filter((p) => p.productLine === line).length,
    };
  }).filter((r) => r.openCount || r.quotesCount || r.wonCount || r.catalogItems);
};

/* Detailed per-airline (account) breakdown — the full book, not just top 8. */
const buildAccountDetail = (accounts, deals, userById) => {
  const open = deals.filter((d) => d.stage !== "Won" && d.stage !== "Lost");
  const won = deals.filter((d) => d.stage === "Won");
  return accounts.map((a) => {
    const openA = open.filter((d) => d.accountId === a.id);
    const wonA = won.filter((d) => d.accountId === a.id);
    return {
      name: a.name, region: a.region, tier: a.tier, owner: userById(a.ownerId)?.name || "—",
      fleetSize: (a.fleet || []).reduce((s, f) => s + (Number(f.count) || 0), 0),
      invoiced: a.revenue?.total || 0, lastActive: a.revenue?.lastActive || "—",
      openValue: openA.reduce((s, d) => s + dealValue(d), 0), openCount: openA.length,
      wonCount: wonA.length, regStatus: a.reg?.status || "Not started",
    };
  }).sort((a, b) => b.invoiced - a.invoiced);
};

/* Detailed per-aircraft-model breakdown — mirrors Aircraft 360's Model 360 view. */
const buildAircraftDetail = (accounts, deals) => {
  const open = deals.filter((d) => d.stage !== "Won" && d.stage !== "Lost");
  return FAMILY_DEFS.map((fam) => {
    const re = new RegExp(fam.re, "i");
    const ops = accounts.filter((a) => (a.fleet || []).some((f) => re.test(f.type)));
    const tails = ops.reduce((s, a) => s + (a.fleet || []).filter((f) => re.test(f.type)).reduce((s2, f) => s2 + (Number(f.count) || 0), 0), 0);
    const opIds = new Set(ops.map((a) => a.id));
    const openOnOps = open.filter((d) => opIds.has(d.accountId));
    const engaged = new Set([...deals.filter((d) => opIds.has(d.accountId)).map((d) => d.accountId)]);
    return {
      label: fam.label, oem: fam.oem, tails, operators: ops.length,
      openPipeline: openOnOps.reduce((s, d) => s + dealValue(d), 0), engagedCount: engaged.size,
    };
  }).filter((r) => r.tails > 0);
};

/* Raw account x month invoice matrix — the actual figures from the
   invoice export, not an aggregate. Every account with invoice history,
   every month in range, no top-N cutoff. */
const buildRawMatrix = (accounts, dateFrom, dateTo) => {
  const months = [...new Set(accounts.flatMap((a) => Object.keys(a.revenue?.monthly || {})))]
    .filter((m) => monthInRange(m, dateFrom, dateTo)).sort((a, b) => monthKey(a) - monthKey(b));
  const rows = accounts.filter((a) => a.revenue?.total > 0).map((a) => ({
    name: a.name,
    values: months.map((m) => a.revenue.monthly?.[m] || 0),
    total: months.reduce((s, m) => s + (a.revenue.monthly?.[m] || 0), 0),
  })).sort((a, b) => b.total - a.total);
  return { months, rows, grandTotal: rows.reduce((s, r) => s + r.total, 0) };
};

const expectedCollectionDate = (d, linkedQuote) => {
  if (!d.closedAt) return null;
  const days = linkedQuote ? (TERMS_DAYS[linkedQuote.paymentTerms] ?? 30) : 30;
  const dt = new Date(d.closedAt);
  dt.setDate(dt.getDate() + days);
  return dt.toISOString().slice(0, 10);
};
const quoteCommission = (q, itemById) => (q.lines || []).reduce((s, l) => {
  const item = itemById(l.itemId);
  const rate = PRODUCTS[item?.productLine]?.rate || 0;
  return s + (Number(l.qty) || 0) * (Number(l.unitPrice) || 0) * (1 - (Number(q.discountPct) || 0) / 100) * rate;
}, 0);

/* ------------------------------ seed ------------------------------ */

const SEED_CATALOG = [
  // Novega ULBs — Banner pricing per ULB presentation (bulk tier at qty 10+)
  { id: "n1", productLine: "Novega ULBs", pn: "21435-00", name: "SID88 Low-Frequency ULB 8.8kHz (alt. for Dukane DK180)", unit: "EA", listPrice: 4300, bulkQty: 10, bulkPrice: 4000, lead: "Stock" },
  { id: "n2", productLine: "Novega ULBs", pn: "22960-00", name: "BLUE90 ULB 37.5kHz (alt. for DK120/90)", unit: "EA", listPrice: 1000, bulkQty: 10, bulkPrice: 950, lead: "Stock" },
  { id: "n3", productLine: "Novega ULBs", pn: "18717-00", name: "GREEN90 Lithium-Free ULB 37.5kHz (alt. for DK120/90)", unit: "EA", listPrice: 1000, bulkQty: 10, bulkPrice: 950, lead: "Stock" },
  // Vogt Aero PMA parts — priced per quote (POA)
  { id: "v1", productLine: "Vogt PMA Parts", pn: "VA-2540-T01", name: "Hot Water Tank Assy (OEM 8921110G5)", unit: "EA", listPrice: 0, lead: "2-3 wks" },
  { id: "v2", productLine: "Vogt PMA Parts", pn: "VA-2540-T02", name: "Hot Water Tank Assy (OEM 8921385G1)", unit: "EA", listPrice: 0, lead: "2-3 wks" },
  { id: "v3", productLine: "Vogt PMA Parts", pn: "VA-2540-H01", name: "Cartridge Heater Assy (OEM 24D507239P01)", unit: "EA", listPrice: 0, lead: "2-3 wks" },
  { id: "v4", productLine: "Vogt PMA Parts", pn: "VA-2540-H02", name: "Cartridge Heater Assy (OEM 24D507239P02)", unit: "EA", listPrice: 0, lead: "2-3 wks" },
  { id: "v5", productLine: "Vogt PMA Parts", pn: "3E2534-VA", name: "Water Level Sensor Assy (OEM 3E2534)", unit: "EA", listPrice: 0, lead: "2-3 wks" },
  { id: "v6", productLine: "Vogt PMA Parts", pn: "532T1-1M-140-VA", name: "Pressure Relief Valve (OEM 532T1-1M-140)", unit: "EA", listPrice: 0, lead: "2-3 wks" },
  { id: "v7", productLine: "Vogt PMA Parts", pn: "24B508385P1-VA", name: "Temperature Sensor Probe (OEM 24B508385P1)", unit: "EA", listPrice: 0, lead: "2-3 wks" },
  // Oshino aftermarket lighting — OL-prefix range
  { id: "o1", productLine: "Oshino Lamps", pn: "OL-series", name: "Filament / Halogen Lamps", unit: "EA", listPrice: 0, lead: "Stock-4 wks" },
  { id: "o2", productLine: "Oshino Lamps", pn: "OL-series", name: "Sealed Beam Landing Lights", unit: "EA", listPrice: 0, lead: "Stock-4 wks" },
  { id: "o3", productLine: "Oshino Lamps", pn: "OL-series", name: "Fluorescent Cabin Tubes", unit: "EA", listPrice: 0, lead: "Stock-4 wks" },
  { id: "o4", productLine: "Oshino Lamps", pn: "OL-series", name: "Miniature / Neon / Flash Tube Lamps", unit: "EA", listPrice: 0, lead: "Stock-4 wks" },
  { id: "o5", productLine: "Oshino Lamps", pn: "OL-series", name: "NVIS Filters", unit: "EA", listPrice: 0, lead: "4-6 wks" },
  { id: "o6", productLine: "Oshino Lamps", pn: "OL-LED", name: "LED Direct Replacements (FAA-PMA/STC, EASA)", unit: "EA", listPrice: 0, lead: "4-6 wks" },
  // Anjou Aeronautique — cabin & safety
  { id: "j1", productLine: "Anjou Seat Belts", pn: "349-series", name: "Steel-Buckle Lap Belt (TSO C22g, 16g seats)", unit: "EA", listPrice: 0, lead: "4-7 wks" },
  { id: "j2", productLine: "Anjou Seat Belts", pn: "353-series", name: "Light Aluminium-Buckle Belt (220g)", unit: "EA", listPrice: 0, lead: "4-7 wks" },
  { id: "j3", productLine: "Anjou Seat Belts", pn: "358-series", name: "Rotary-Buckle Restraint System 4/5-pt (TSO C114)", unit: "EA", listPrice: 0, lead: "4-7 wks" },
  { id: "j4", productLine: "Anjou Seat Belts", pn: "Various", name: "Belt Extensions (adult / baby)", unit: "EA", listPrice: 0, lead: "4-7 wks" },
  { id: "j5", productLine: "Anjou Seat Belts", pn: "Custom", name: "Cabin Textiles (covers, cushions, curtains, carpet kits)", unit: "KIT", listPrice: 0, lead: "4-8 wks" },
  { id: "j6", productLine: "Anjou Seat Belts", pn: "Custom", name: "Composite Products (dividers, stowage, literature pockets)", unit: "EA", listPrice: 0, lead: "6-10 wks" },
  // Repair Management — service, quoted per event
  { id: "r1", productLine: "Repair Management", pn: "N/A", name: "Component Repair — per event (400+ FAA/EASA shop network)", unit: "EVT", listPrice: 0, lead: "Per T/A" },
  { id: "r2", productLine: "Repair Management", pn: "N/A", name: "AOG Expedite Support — 24/7/365", unit: "EVT", listPrice: 0, lead: "AOG" },
  // Tooling & Calibration — per banner.aero service page (100+ partner brands); quoted per RFQ
  { id: "t1", productLine: "Tooling & Calibration", pn: "Various", name: "Electronic & Hand Tools, Fixtures", unit: "EA", listPrice: 0, lead: "Per RFQ", ata: 0 },
  { id: "t2", productLine: "Tooling & Calibration", pn: "Various", name: "Machinery, Tools & Supplies (abrasives, actuators, bearings, alignment)", unit: "EA", listPrice: 0, lead: "Per RFQ", ata: 0 },
  { id: "t3", productLine: "Tooling & Calibration", pn: "Custom", name: "Custom Manufacturing (3D printing, bonding, brazing, assembly)", unit: "LOT", listPrice: 0, lead: "Per RFQ", ata: 0 },
  { id: "t4", productLine: "Tooling & Calibration", pn: "Various", name: "Instruments & Controls (borescopes, analyzers, accelerometers)", unit: "EA", listPrice: 0, lead: "Per RFQ", ata: 0 },
  { id: "t5", productLine: "Tooling & Calibration", pn: "Various", name: "GSE & Material Handling (engine stands, lifts, pallet jacks)", unit: "EA", listPrice: 0, lead: "Per RFQ", ata: 0 },
  { id: "t6", productLine: "Tooling & Calibration", pn: "N/A", name: "Machine Shop Services (EASA/FAA-approved)", unit: "EVT", listPrice: 0, lead: "Per RFQ", ata: 0 },
  { id: "t7", productLine: "Tooling & Calibration", pn: "Various", name: "Hardware (fasteners, gaskets, hinges, washers)", unit: "LOT", listPrice: 0, lead: "Per RFQ", ata: 0 },
  { id: "t8", productLine: "Tooling & Calibration", pn: "Various", name: "Maintenance Materials (chemicals, adhesives, sealants, metals & alloys)", unit: "LOT", listPrice: 0, lead: "Per RFQ", ata: 0 },
  { id: "t9", productLine: "Tooling & Calibration", pn: "N/A", name: "Calibration Services — per event", unit: "EVT", listPrice: 0, lead: "Per T/A", ata: 0 },
];

/* Official Area Director Africa Region account list (Feb 07 2026 export),
   deduplicated, plus Zelealem's active pipeline targets (ET, ET MRO, Jambojet, ASKY). */
const SEED_ACCOUNTS = [
  { id: "a1", name: "Ethiopian Airlines", tier: "Tier 1", region: "East Africa", country: "Ethiopia", ownerId: "r0", notes: "ACTIVE CUSTOMER — $289,613 invoiced across 16 of the last 19 months (per Jul 2026 invoice export). Not a cold pipeline target — this is an expansion/retention account. Flag carrier, largest fleet in Africa.", reg: { status: "Docs submitted", submitted: "2026-07-01", expected: "2027-03-31", expiry: "", notes: "6–12 month cycle. Vendor pre-qualification pack sent." } },
  { id: "a2", name: "Ethiopian MRO", tier: "Tier 1", region: "East Africa", country: "Ethiopia", ownerId: "r0", notes: "Pipeline target — third-party MRO arm. Vogt PMA and Repair Mgmt fit. Contact: Daniel Demeke." },
  { id: "a3", name: "Kenya Airways", tier: "Tier 1", region: "East Africa", country: "Kenya", ownerId: "b8", notes: "Home-base account." },
  { id: "a4", name: "Jambojet", tier: "Tier 1", region: "East Africa", country: "Kenya", ownerId: "r0", notes: "ACTIVE CUSTOMER — $166,182 invoiced across 11 of the last 19 months (per Jul 2026 invoice export). Not a cold pipeline target — this is an expansion/retention account. LCC, Q400 fleet, 10M passengers. Contact: Kidus Melkamu (CTO)." },
  { id: "a5", name: "EgyptAir", tier: "Tier 1", region: "North Africa", country: "Egypt", ownerId: "b1", notes: "Large fleet + MRO.", reg: { status: "Under evaluation", submitted: "2026-06-01", expected: "2026-11-30", expiry: "", notes: "4–6 month cycle." } },
  { id: "a6", name: "Royal Air Maroc", tier: "Tier 1", region: "North Africa", country: "Morocco", ownerId: "b6", notes: "Expanding fleet under national aviation strategy.", reg: { status: "Docs submitted", submitted: "2026-07-01", expected: "2026-10-31", expiry: "", notes: "Fastest cycle (3–5 mo). Register Vogt PMA and Oshino separately — separate procurement committees." } },
  { id: "a7", name: "Air Peace Limited", tier: "Tier 1", region: "West Africa", country: "Nigeria", ownerId: "r0", notes: "Listed N/A on the region sheet — Zelealem interim coverage." },
  { id: "a8", name: "FlySafair", tier: "Tier 1", region: "Southern Africa", country: "South Africa", ownerId: "b5", notes: "737 operator, strong ops discipline." },
  { id: "a9", name: "RwandAir Limited", tier: "Tier 2", region: "East Africa", country: "Rwanda", ownerId: "b8", notes: "Qatar-backed growth." },
  { id: "a10", name: "ASKY Airlines", tier: "Tier 2", region: "West Africa", country: "Togo", ownerId: "r0", notes: "Pipeline target — ET-affiliated. Contact: Ahadu Simachew (CEO)." },
  { id: "a11", name: "Uganda Airlines", tier: "Tier 2", region: "East Africa", country: "Uganda", ownerId: "b8", notes: "Young fleet (A330neo, CRJ900)." },
  { id: "a12", name: "Air Tanzania Company Limited", tier: "Tier 2", region: "East Africa", country: "Tanzania", ownerId: "b8", notes: "Government-backed; 787/A220 fleet." },
  { id: "a13", name: "Airlink", tier: "Tier 2", region: "Southern Africa", country: "South Africa", ownerId: "b5", notes: "Largest Southern Africa regional network." },
  { id: "a21", name: "Air Cairo", tier: "Tier 1", region: "North Africa", country: "Egypt", ownerId: "b1", notes: "Upgraded Tier 2→1: $164,834 invoiced over 13 active months (Jul 2026 export)." },
  { id: "a22", name: "Nile Air", tier: "Tier 2", region: "North Africa", country: "Egypt", ownerId: "b1", notes: "" },
  { id: "a23", name: "Nesma Airlines", tier: "Tier 3", region: "North Africa", country: "Egypt", ownerId: "b1", notes: "Owner confirmed as Ahmed Elshahawy per Jul 2026 invoice export." },
  { id: "a24", name: "JAC", tier: "Tier 3", region: "Middle East", country: "", ownerId: "b2", notes: "Confirm entity details with Ahmed Youssry." },
  { id: "a25", name: "Flynas", tier: "Tier 1", region: "Middle East", country: "Saudi Arabia", ownerId: "b3", notes: "" },
  { id: "a26", name: "Gulf Air", tier: "Tier 1", region: "Middle East", country: "Bahrain", ownerId: "b3", notes: "" },
  { id: "a27", name: "Almasria", tier: "Tier 1", region: "North Africa", country: "Egypt", ownerId: "b3", notes: "Upgraded Tier 3→1: $526,058 invoiced over 15 active months — largest account in Hazem's book by revenue (Jul 2026 export)." },
  { id: "a28", name: "Red Sea Airlines", tier: "Tier 3", region: "North Africa", country: "Egypt", ownerId: "b3", notes: "" },
  { id: "a29", name: "Petroleum Air Services", tier: "Tier 1", region: "North Africa", country: "Egypt", ownerId: "b3", notes: "Upgraded Tier 3→1: $328,957 invoiced over 16 active months (Jul 2026 export)." },
  { id: "a30", name: "JORAMCO (Jordan A/C Maint.)", tier: "Tier 2", region: "Middle East", country: "Jordan", ownerId: "b3", notes: "MRO account — Repair Mgmt / Vogt PMA fit." },
  { id: "a31", name: "Gulf Helicopters Company", tier: "Tier 3", region: "Middle East", country: "Qatar", ownerId: "b3", notes: "" },
  { id: "a32", name: "Air Master", tier: "Tier 3", region: "North Africa", country: "Egypt", ownerId: "b3", notes: "" },
  { id: "a33", name: "Aeroparts Egypt", tier: "Tier 3", region: "North Africa", country: "Egypt", ownerId: "b3", notes: "Parts trader." },
  { id: "a34", name: "Pyramids Airlines", tier: "Tier 3", region: "North Africa", country: "Egypt", ownerId: "b3", notes: "" },
  { id: "a35", name: "Green Africa", tier: "Tier 2", region: "West Africa", country: "Nigeria", ownerId: "b4", notes: "" },
  { id: "a36", name: "ValueJet", tier: "Tier 2", region: "West Africa", country: "Nigeria", ownerId: "b4", notes: "" },
  { id: "a37", name: "Pioneer Airlines", tier: "Tier 3", region: "West Africa", country: "Nigeria", ownerId: "b4", notes: "" },
  { id: "a38", name: "ExecuJet Aviation Nigeria", tier: "Tier 3", region: "West Africa", country: "Nigeria", ownerId: "b4", notes: "Business aviation." },
  { id: "a39", name: "South African Airways Technical", tier: "Tier 1", region: "Southern Africa", country: "South Africa", ownerId: "b5", notes: "SAAT — MRO account." },
  { id: "a40", name: "South African Airways", tier: "Tier 2", region: "Southern Africa", country: "South Africa", ownerId: "b5", notes: "" },
  { id: "a41", name: "Valerex Aviation", tier: "Tier 3", region: "Southern Africa", country: "South Africa", ownerId: "b5", notes: "" },
  { id: "a42", name: "SAFAIR", tier: "Tier 2", region: "Southern Africa", country: "South Africa", ownerId: "b5", notes: "ACMI / ops arm." },
  { id: "a43", name: "Roesch Aviation", tier: "Tier 3", region: "Southern Africa", country: "South Africa", ownerId: "b5", notes: "" },
  { id: "a44", name: "Century Avionics (Pty) Ltd", tier: "Tier 3", region: "Southern Africa", country: "South Africa", ownerId: "b5", notes: "" },
  { id: "a45", name: "Air Mauritius", tier: "Tier 2", region: "Southern Africa", country: "Mauritius", ownerId: "b5", notes: "Indian Ocean." },
  { id: "a46", name: "Africa Charter Airline", tier: "Tier 3", region: "Southern Africa", country: "South Africa", ownerId: "b5", notes: "" },
  { id: "a47", name: "Aerotechnic Industries", tier: "Tier 1", region: "North Africa", country: "Morocco", ownerId: "b6", notes: "Upgraded Tier 2→1: $216,086 invoiced over 18 of the last 19 months — near-continuous billing (Jul 2026 export). RAM/AFI KLM JV — MRO." },
  { id: "a48", name: "Air Algérie", tier: "Tier 1", region: "North Africa", country: "Algeria", ownerId: "b7", notes: "" },
  { id: "a49", name: "Tassili Airlines", tier: "Tier 1", region: "North Africa", country: "Algeria", ownerId: "b7", notes: "Upgraded Tier 2→1: $250,837 invoiced over 12 active months (Jul 2026 export)." },
  { id: "a50", name: "Tassili Travail Aérien", tier: "Tier 1", region: "North Africa", country: "Algeria", ownerId: "b7", notes: "Upgraded Tier 3→1: $448,059 invoiced over 16 active months — larger than sister account Tassili Airlines (Jul 2026 export)." },
  { id: "a51", name: "Safarilink Aviation Limited", tier: "Tier 3", region: "East Africa", country: "Kenya", ownerId: "b8", notes: "" },
  { id: "a52", name: "Tunisair Technics", tier: "Tier 2", region: "North Africa", country: "Tunisia", ownerId: "r0", notes: "Listed on banner.aero customer map — Tunisia not on region sheet; confirm rep assignment with Darya." },
  { id: "a53", name: "Nouvelair", tier: "Tier 1", region: "North Africa", country: "Tunisia", ownerId: "r0", notes: "Upgraded Tier 2→1: $324,326 invoiced over 14 active months — currently UNASSIGNED to a territory rep despite being a top-5 account by revenue. Assign urgently." },
  { id: "a54", name: "Express Air Cargo", tier: "Tier 3", region: "North Africa", country: "Egypt", ownerId: "r0", notes: "New — surfaced by Jul 2026 invoice export. No BD manager listed on the source sheet; territory unassigned." },
  { id: "a55", name: "Sabena Technics MIR", tier: "Tier 3", region: "North Africa", country: "Morocco", ownerId: "r0", notes: "New — surfaced by Jul 2026 invoice export ($1,485 invoiced, 2 active months). No BD manager listed; territory unassigned." },
  { id: "a56", name: "Fly Egypt", tier: "Tier 3", region: "North Africa", country: "Egypt", ownerId: "b3", notes: "New — surfaced by Jul 2026 invoice export. BD manager listed as Hazem Abdelhamid; $0 invoiced to date." },
  { id: "a57", name: "Blue Bird Aviation Ltd", tier: "Tier 3", region: "East Africa", country: "Kenya", ownerId: "r0", notes: "New — surfaced by Jul 2026 invoice export. No BD manager listed; territory unassigned. Kenyan charter/cargo operator." },
];

/* BD team from the official region sheet */
const emailOf = (name) => name.trim().toLowerCase().replace(/[^a-z ]/g, "").split(/\s+/).join(".") + "@banner.aero";
const SEED_USERS = [
  { id: "r0", name: "Zelealem M.J.", role: "Area Director", region: "", email: "zelealem.mj@banner.aero", reportsTo: "" },
  { id: "b1", name: "Ahmed Elshahawy", role: "Territory Manager (BD)", region: "North Africa", email: emailOf("Ahmed Elshahawy"), reportsTo: "r0" },
  { id: "b2", name: "Ahmed Youssry", role: "Territory Manager (BD)", region: "Middle East", email: emailOf("Ahmed Youssry"), reportsTo: "r0" },
  { id: "b3", name: "Hazem Abdelhamid", role: "Territory Manager (BD)", region: "North Africa / Gulf", email: emailOf("Hazem Abdelhamid"), reportsTo: "r0" },
  { id: "b4", name: "Isaac Omotayo", role: "Territory Manager (BD)", region: "West Africa", email: emailOf("Isaac Omotayo"), reportsTo: "r0" },
  { id: "b5", name: "Jacques Brittz", role: "Territory Manager (BD)", region: "Southern Africa", email: emailOf("Jacques Brittz"), reportsTo: "r0" },
  { id: "b6", name: "Mahdi Sadiq", role: "Territory Manager (BD)", region: "North Africa", email: emailOf("Mahdi Sadiq"), reportsTo: "r0" },
  { id: "b7", name: "Mohamed Hemissi", role: "Territory Manager (BD)", region: "North Africa", email: emailOf("Mohamed Hemissi"), reportsTo: "r0" },
  { id: "b8", name: "Wambui Mureithi", role: "Territory Manager (BD)", region: "East Africa", email: emailOf("Wambui Mureithi"), reportsTo: "r0" },
  { id: "u2", name: "COO", role: "COO", region: "", email: "coo@banner.aero", reportsTo: "r0" },
  { id: "u3", name: "CEO", role: "CEO", region: "", email: "ceo@banner.aero", reportsTo: "u2" },
  { id: "u4", name: "President", role: "President", region: "", email: "president@banner.aero", reportsTo: "u3" },
  { id: "u5", name: "Analyst", role: "Analyst", region: "", email: "analyst@banner.aero", reportsTo: "r0" },
  { id: "u6", name: "Operations", role: "Operations", region: "", email: "operations@banner.aero", reportsTo: "r0" },
  { id: "u7", name: "Finance", role: "Finance", region: "", email: "finance@banner.aero", reportsTo: "r0" },
];

const SEED = {
  users: SEED_USERS,
  settings: { monthlyQuota: 300000, currentUserId: "", thresholds: DEFAULT_THRESHOLDS, termsMatrix: DEFAULT_TERMS_MATRIX, stageProb: { ...STAGE_PROB }, annualTarget: 3500000, repQuotas: {} },
  catalog: SEED_CATALOG,
  quotes: [
    {
      id: "q1", number: "Q-2026-001", accountId: "a4", oppId: "d1", ownerId: "r0",
      lines: [{ itemId: "n3", qty: 12, unitPrice: 950, cond: "NE", leadTime: "Stock" }],
      discountPct: 12, paymentTerms: "Net 45 days", incoterm: "EXW Hollywood, FL", attention: "Kidus Melkamu", customerRef: "JM-RFQ-2026-114", status: "Pending Approval",
      chain: ["Area Director", "COO"], approvals: [{ role: "Area Director", decision: "Approved", byName: "Zelealem M.J.", date: today(), comment: "Fleet-wide GREEN90 retrofit; bulk tier applied." }],
      createdAt: today(), rfqDate: today(), sentAt: "", notes: "Sample: 12× GREEN90 lithium-free ULBs at bulk price, 12% discount — awaiting COO.",
    },
  ],
  leads: [
    { id: "l1", accountId: "a37", contactId: "", contactName: "", title: "", source: "Event / Conference", product: "Oshino Lamps", est: 25000, status: "Unqualified", rank: "Hot", ownerId: "b4", notes: "Met at industry event — Pioneer Airlines, Embraer operator.", createdAt: today() },
  ],
  accounts: SEED_ACCOUNTS,
  contacts: [
    { id: "c1", name: "Daniel Demeke", title: "MD, Ethiopian MRO", accountId: "a2", email: "", phone: "", notes: "Key door for Vogt PMA + Repair Mgmt. | ANCHOR RELATIONSHIP — Personal Contact. Sole approval authority for new supplier qualification at ET (MD-MRO); oversees 6 directors + the MRO Procurement Wing. Submit approved-supplier package here first: FAA/EASA certs, quality manual, catalogue, references, financial capability statement." },
    { id: "c2", name: "Kidus Melkamu", title: "CTO", accountId: "a4", email: "", phone: "", notes: "Technical decision-maker at Jambojet. | Personal Contact — personal friend, met May 2026. CRITICAL ENTRY POINT: Banner not yet an approved supplier at Jambojet. Has personal access to MRO directors and procurement heads continent-wide (ex-ET, ex-ASKY)." },
    { id: "c3", name: "Fitsum Abadi", title: "Director of Cargo", accountId: "a3", email: "", phone: "", notes: "Kenya Airways relationship. | Full name: Fitsum Abadi Gebrehawaria. Personal Contact — 23yr ET alumnus (ex-MD Ethiopian Cargo & Logistics). Not the primary procurement route (Cargo, not Technical/MRO) but strongest personal network into KQ's C-suite for warm introductions." },
    { id: "c4", name: "Ahadu Simachew", title: "CEO", accountId: "a10", email: "", phone: "", notes: "ASKY executive sponsor. | 2nd degree — Personal Friend intro via Hailemelekot Mamo (VP, ET Group). Ex-Malawi Airlines CEO (peer bond with Hailemelekot). ASKY: 15 B737 across 24 cities/21 countries, ET holds 40% equity. Unlocks the Lomé MRO hub build ($100M, 2027 groundbreaking) and Ahadu's West Africa peer network." },
    { id: uid(), name: "Lemma Yadecha Gudeta", title: "Group Chief Commercial Officer (CCO)", accountId: "a1", email: "", phone: "", notes: "Personal Contact — college classmate. Highest-level personal access at ET; widely seen as leading internal candidate for Group CEO succession. Not a procurement entry — a strategic relationship for framework-level discussions (JV supply, preferred-supplier agreements)." },
    { id: uid(), name: "Adamu Tadele Belay", title: "Group Chief Financial Officer (CFO)", accountId: "a1", email: "", phone: "", notes: "Business Contact. Ultimate credit/financial sign-off for large framework deals — advance payment / LC structuring, consignment stock terms. Engage once a framework agreement is being negotiated." },
    { id: uid(), name: "Getinet Tadesse", title: "Group Chief Information Officer (CIO)", accountId: "a1", email: "", phone: "", notes: "Business Contact. Relevant if pursuing digital supplier integration — Repair Ops Portal, AOG ticketing, inventory API. SITA Council member. Lower near-term BD priority." },
    { id: uid(), name: "Samson Arega Bekele", title: "Group VP Customer Experience", accountId: "a1", email: "", phone: "", notes: "Business Contact. Cabin retrofit sign-off (Anjou seat belts, Oshino LED cabin lighting) routes through CX for passenger-facing upgrades — secondary to the MRO/Technical procurement path." },
    { id: uid(), name: "Hailemelekot Mamo", title: "VP — ET Holiday, Digital Sales & GCIC", accountId: "a1", email: "", phone: "", notes: "Personal — Family Friend. PRIMARY VALUE: gateway to Ahadu Simachew (CEO ASKY) — both are former Malawi Airlines CEOs, direct peer bond. Chain: Zelealem → Hailemelekot → Ahadu. Month-1 priority: arrange this introduction, it unlocks the whole West Africa strategy." },
    { id: uid(), name: "Firiehiwot Mekonnen", title: "Country Manager, Nigeria", accountId: "a1", email: "", phone: "", notes: "Business Contact, based Lagos. URGENT — gateway to Air Peace's new 7-bay MRO facility fit-out (time-critical, decisions being made now). Also connects to ASKY (ET 40% stake) and Nigerian NAMA/NCAA." },
    { id: uid(), name: "Gemechis Tujuba", title: "MD, Ethiopian Ground Services", accountId: "a1", email: "", phone: "", notes: "Personal Contact. Secondary procurement path (separate from MRO) for GSE consumables and lavatory accessories (VOGT pool). Confirm whether Ground Services has independent procurement authority for lav accessories." },
    { id: uid(), name: "Ms. Mekdes", title: "Head, MRO Procurement Wing", accountId: "a2", email: "", phone: "", notes: "Personal Business Contact, reports to Daniel Demeke. OPERATIONAL GATE after MD-MRO approval — oversees 4 category managers. Map Banner's lines before the meeting: cabin/safety = Anjou/Oshino, avionics/recorders = Novega, lavatory = VOGT, repair services = Calibration." },
    { id: uid(), name: "Telila Deressa Gutema", title: "Director, Aircraft Maintenance Technician School", accountId: "a2", email: "", phone: "", notes: "Personal Contact. Secondary BD relevance — trains technicians seeded across African carriers via the ET alumni network; useful intel source on which carriers are ET-trained (= warm BD targets). Explore calibration-service training endorsement." },
  ],
  deals: [
    { id: "d1", name: "Q400 fleet ULB + lamp programme", accountId: "a4", ownerId: "r0", lines: [{ product: "Novega ULBs", value: 11400 }, { product: "Oshino Lamps", value: 34000 }], stage: "Quote / RFQ", prob: 60, forecastCat: "Upside", closeDate: "2026-09-30", notes: "GREEN90 retrofit + lamp consumables. Quote Q-2026-001 issued.", createdAt: "2026-07-01", lastTouch: today(), closedAt: "", meetingNotes: [], agreement: null, stageHistory: [] },
    { id: "d2", name: "PMA parts evaluation", accountId: "a2", ownerId: "r0", lines: [{ product: "Vogt PMA Parts", value: 250000 }, { product: "Repair Management", value: 40000 }], stage: "Meeting Held", prob: 40, forecastCat: "Pipeline", closeDate: "2026-11-30", notes: "Lav system PMAs (VA-2540 family) + repair pilot. AFRAA follow-up.", createdAt: "2026-07-01", lastTouch: today(), closedAt: "", meetingNotes: [], agreement: null, stageHistory: [] },
    { id: "d3", name: "Component repair pilot", accountId: "a3", ownerId: "b8", lines: [{ product: "Repair Management", value: 120000 }], stage: "Prospect", prob: 10, forecastCat: "Pipeline", closeDate: "2026-10-31", notes: "Position ahead of Aviation Africa Summit (Sep, Nairobi).", createdAt: "2026-07-01", lastTouch: today(), closedAt: "", meetingNotes: [], agreement: null, stageHistory: [] },
    { id: "d4", name: "Anjou cabin belt refresh", accountId: "a8", ownerId: "b5", lines: [{ product: "Anjou Seat Belts", value: 60000 }], stage: "Prospect", prob: 10, forecastCat: "Pipeline", closeDate: "2026-12-15", notes: "349/353 belts — SB route, ~2-4 wk lead. Tie to cabin refurb cycle.", createdAt: "2026-07-01", lastTouch: today(), closedAt: "", meetingNotes: [], agreement: null, stageHistory: [] },
    { id: "d5", name: "Oshino lamp starter order", accountId: "a7", ownerId: "r0", lines: [{ product: "Oshino Lamps", value: 35000 }], stage: "Contacted", prob: 20, forecastCat: "Pipeline", closeDate: "2026-10-15", notes: "Air Peace — interim coverage account.", createdAt: "2026-07-01", lastTouch: today(), closedAt: "", meetingNotes: [], agreement: null, stageHistory: [] },
  ],
  activities: [
    { id: "t1", text: "Confirm meetings for Aviation Africa Summit (Nairobi, Sep 2026)", accountId: "", due: "2026-08-01", done: false },
    { id: "t2", text: "Send Vogt PMA technical pack (VA-2540 family) to Ethiopian MRO", accountId: "a2", due: "2026-07-10", done: false },
    { id: "t3", text: "Book AFRAA 58th AGA travel (Libreville, Nov 2026)", accountId: "", due: "2026-09-15", done: false },
    { id: "t4", text: "Confirm Novega ULB commission rate with BAI (not in June memo)", accountId: "", due: "2026-07-15", done: false },
  ],
  interactions: [],
  payouts: [],
  aircraft: [
    { id: "ac1", accountId: "a4", type: "DHC-8 Q400", reg: "5Y-JXA", msn: "", deliveryYear: "", engine: "PW150A", status: "Active", notes: "Sample record — verify against Jambojet fleet list" },
  ],
  aogCases: [],
  industryContacts: SEED_INDUSTRY_CONTACTS,
};
/* Accounts named on banner.aero's public customer map (Africa section) */
const WEB_CUSTOMERS = ["a1", "a3", "a4", "a5", "a6", "a7", "a13", "a21", "a27", "a28", "a29", "a36", "a37", "a39", "a47", "a49", "a50", "a52", "a53"];
/* fold indicative fleets + website-customer flags into seed accounts */
SEED.accounts = SEED.accounts.map((a) => ({ fleet: FLEET_SEED[a.id] || [], webCustomer: WEB_CUSTOMERS.includes(a.id), revenue: REVENUE_SEED[a.id] || null, ...a, ownerId: a.ownerId || "r0" }));
SEED.catalog = SEED.catalog.map((p) => (V12_CAT_ATA[p.id] ? { ...p, ...V12_CAT_ATA[p.id] } : p));
SEED.deals = SEED.deals.map((d) => ({ ...d, stageHistory: (d.stageHistory && d.stageHistory.length) ? d.stageHistory : [{ stage: d.stage, date: d.createdAt || today() }] }));
SEED.users = SEED.users.map((u) => ({ pin: "1234", ...u }));

/* --------------------------- migrations ---------------------------- */

const FCAT_MAP = { "Best Case": "Upside", "Committed": "Forecast" };

/* v10 -> v11: collection tracking — commission matures upon collection */
/* v35 -> v36: adds industryContacts — relationships that don't belong to
   any customer account (OEM execs, advisors, competitive intel), seeded
   with the 3 people from the NetworkIntel doc that had no account home. */
const SEED_INDUSTRY_CONTACTS = [
  { id: "ic1", name: "Henok Teferra Shawl", title: "Managing Director, Africa", company: "The Boeing Company", relationship: "Personal Contact", notes: "Based Addis Ababa. Ex-ET senior leadership, ex-CEO ASKY (predecessor to Ahadu Simachew), ex-Ethiopian Ambassador to France/UNESCO. Relationship node for all Boeing-operator relationships continent-wide — relevant for any Boeing-platform positioning." },
  { id: "ic2", name: "Tewolde Gebremariam", title: "Senior Strategic Advisor", company: "Delta Air Lines / TGM Advisory Services LLC", relationship: "Business Contact", notes: "Group CEO Ethiopian Airlines 2011–2022 (grew ET $1B→$4.5B revenue, 33→130 aircraft). Architect of ET's pan-African equity model (ASKY, Zambia, Malawi) — the network Banner's BD strategy is built on. Relationships with heads of state and airline CEOs across Africa remain intact post-retirement." },
  { id: "ic3", name: "Elias Dimitri", title: "VP, Flight Solutions Group (FSG) — Sub-Saharan Africa", company: "GA Telesis", relationship: "Competitive Intel", notes: "30+ yr ET alumnus (ex-Director Fleet & Network Planning). Appointed Jan 2026 as GA Telesis' formal SSA entry point (6th global region) — building an independent aftermarket parts/services platform using the same ET alumni network Banner relies on. DIRECT COMPETITIVE THREAT — track GA Telesis' SSA moves through this relationship." },
];

/* v34 -> v35: harvested contacts from Banner_NetworkIntel_Personas_v3.docx
   (validated May 2026). Enriches 4 existing contacts and adds 9 new ones at
   Ethiopian Airlines / Ethiopian MRO — matched only where an account exists;
   people at Boeing, Delta/TGM Advisory, and GA Telesis were left out since
   there's no CRM account to attach them to (see chat reply for those). */
const NETWORKINTEL_UPDATES = {
  "Daniel Demeke": "ANCHOR RELATIONSHIP — Personal Contact. Sole approval authority for new supplier qualification at ET (MD-MRO); oversees 6 directors + the MRO Procurement Wing. Submit approved-supplier package here first: FAA/EASA certs, quality manual, catalogue, references, financial capability statement.",
  "Kidus Melkamu": "Personal Contact — personal friend, met May 2026. CRITICAL ENTRY POINT: Banner not yet an approved supplier at Jambojet. Has personal access to MRO directors and procurement heads continent-wide (ex-ET, ex-ASKY).",
  "Ahadu Simachew": "2nd degree — Personal Friend intro via Hailemelekot Mamo (VP, ET Group). Ex-Malawi Airlines CEO (peer bond with Hailemelekot). ASKY: 15 B737 across 24 cities/21 countries, ET holds 40% equity. Unlocks the Lomé MRO hub build ($100M, 2027 groundbreaking) and Ahadu's West Africa peer network.",
  "Fitsum Abadi": "Full name: Fitsum Abadi Gebrehawaria. Personal Contact — 23yr ET alumnus (ex-MD Ethiopian Cargo & Logistics). Not the primary procurement route (Cargo, not Technical/MRO) but strongest personal network into KQ's C-suite for warm introductions.",
};
function migrateV34(v34) {
  const contacts = (v34.contacts || []).map((c) => (
    NETWORKINTEL_UPDATES[c.name] ? { ...c, notes: c.notes ? c.notes + " | " + NETWORKINTEL_UPDATES[c.name] : NETWORKINTEL_UPDATES[c.name] } : c
  ));
  const haveNames = new Set(contacts.map((c) => c.name.toLowerCase()));
  const newContacts = [
    { id: uid(), name: "Lemma Yadecha Gudeta", title: "Group Chief Commercial Officer (CCO)", accountId: "a1", email: "", phone: "", notes: "Personal Contact — college classmate. Highest-level personal access at ET; widely seen as leading internal candidate for Group CEO succession. Not a procurement entry — a strategic relationship for framework-level discussions (JV supply, preferred-supplier agreements)." },
    { id: uid(), name: "Adamu Tadele Belay", title: "Group Chief Financial Officer (CFO)", accountId: "a1", email: "", phone: "", notes: "Business Contact. Ultimate credit/financial sign-off for large framework deals — advance payment / LC structuring, consignment stock terms. Engage once a framework agreement is being negotiated." },
    { id: uid(), name: "Getinet Tadesse", title: "Group Chief Information Officer (CIO)", accountId: "a1", email: "", phone: "", notes: "Business Contact. Relevant if pursuing digital supplier integration — Repair Ops Portal, AOG ticketing, inventory API. SITA Council member. Lower near-term BD priority." },
    { id: uid(), name: "Samson Arega Bekele", title: "Group VP Customer Experience", accountId: "a1", email: "", phone: "", notes: "Business Contact. Cabin retrofit sign-off (Anjou seat belts, Oshino LED cabin lighting) routes through CX for passenger-facing upgrades — secondary to the MRO/Technical procurement path." },
    { id: uid(), name: "Hailemelekot Mamo", title: "VP — ET Holiday, Digital Sales & GCIC", accountId: "a1", email: "", phone: "", notes: "Personal — Family Friend. PRIMARY VALUE: gateway to Ahadu Simachew (CEO ASKY) — both are former Malawi Airlines CEOs, direct peer bond. Chain: Zelealem → Hailemelekot → Ahadu. Month-1 priority: arrange this introduction, it unlocks the whole West Africa strategy." },
    { id: uid(), name: "Firiehiwot Mekonnen", title: "Country Manager, Nigeria", accountId: "a1", email: "", phone: "", notes: "Business Contact, based Lagos. URGENT — gateway to Air Peace's new 7-bay MRO facility fit-out (time-critical, decisions being made now). Also connects to ASKY (ET 40% stake) and Nigerian NAMA/NCAA." },
    { id: uid(), name: "Gemechis Tujuba", title: "MD, Ethiopian Ground Services", accountId: "a1", email: "", phone: "", notes: "Personal Contact. Secondary procurement path (separate from MRO) for GSE consumables and lavatory accessories (VOGT pool). Confirm whether Ground Services has independent procurement authority for lav accessories." },
    { id: uid(), name: "Ms. Mekdes", title: "Head, MRO Procurement Wing", accountId: "a2", email: "", phone: "", notes: "Personal Business Contact, reports to Daniel Demeke. OPERATIONAL GATE after MD-MRO approval — oversees 4 category managers. Map Banner's lines before the meeting: cabin/safety = Anjou/Oshino, avionics/recorders = Novega, lavatory = VOGT, repair services = Calibration." },
    { id: uid(), name: "Telila Deressa Gutema", title: "Director, Aircraft Maintenance Technician School", accountId: "a2", email: "", phone: "", notes: "Personal Contact. Secondary BD relevance — trains technicians seeded across African carriers via the ET alumni network; useful intel source on which carriers are ET-trained (= warm BD targets). Explore calibration-service training endorsement." },
  ].filter((c) => !haveNames.has(c.name.toLowerCase()));
  return {
    ...v34,
    contacts: [...contacts, ...newContacts],
    settings: { ...v34.settings, currentUserId: "" },
  };
}

/* v35 -> v36: adds the industryContacts collection (seeded once). */
function migrateV35(v35) {
  return {
    ...v35,
    industryContacts: (v35.industryContacts && v35.industryContacts.length) ? v35.industryContacts : SEED_INDUSTRY_CONTACTS,
    settings: { ...v35.settings, currentUserId: "" },
  };
}

/* v33 -> v34: no persisted-shape change - month display formatting only. */
function migrateV33(v33) {
  return { ...v33, settings: { ...v33.settings, currentUserId: "" } };
}

/* v32 -> v33: users gain a pin field (default "1234" - a placeholder
   deterrent, not real security; Area Director should set real PINs per
   person via Users & Roles). */
function migrateV32(v32) {
  return {
    ...v32,
    users: (v32.users || []).map((u) => ({ pin: "1234", ...u })),
    settings: { ...v32.settings, currentUserId: "" },
  };
}

/* v31 -> v32: no persisted-shape change - purely a sign-in screen
   redesign. */
function migrateV31(v31) {
  return { ...v31, settings: { ...v31.settings, currentUserId: "" } };
}

/* v30 -> v31: no persisted-shape change - dual coverage is computed at
   render time from data that already exists. */
function migrateV30(v30) {
  return { ...v30, settings: { ...v30.settings, currentUserId: "" } };
}

/* v29 -> v30: no persisted-shape change - the trailing-2-quarter basis and
   the Area Director's flat (no-growth) treatment are computed at render
   time from data that already exists. */
function migrateV29(v29) {
  return { ...v29, settings: { ...v29.settings, currentUserId: "" } };
}

/* v28 -> v29: settings gain an editable annual company target (default
   $3.5M) and a per-rep annual quota override map. Defaults for any rep
   without an explicit override are computed live (25% over their historic
   invoiced achievement), so nothing needs to be set until someone edits it. */
function migrateV28(v28) {
  return {
    ...v28,
    settings: { annualTarget: 3500000, repQuotas: {}, ...v28.settings, currentUserId: "" },
  };
}

/* v27 -> v28: no persisted-shape change — per-rep actual-invoiced
   reconciliation is computed at render time from account ownership. */
function migrateV27(v27) {
  return { ...v27, settings: { ...v27.settings, currentUserId: "" } };
}

/* v26 -> v27: settings gain an editable stageProb map (defaults to the
   existing hardcoded STAGE_PROB constant, so nothing changes until the
   Area Director actually edits a value). */
function migrateV26(v26) {
  return {
    ...v26,
    settings: { stageProb: { ...STAGE_PROB }, ...v26.settings, currentUserId: "" },
  };
}

/* v25 -> v26: no persisted-shape change — historical quarters are derived
   at render time from existing account revenue and deal close dates. */
function migrateV25(v25) {
  return { ...v25, settings: { ...v25.settings, currentUserId: "" } };
}

/* v24 -> v25: no persisted-shape change — PDF pagination is assembled at
   export time only. */
function migrateV24(v24) {
  return { ...v24, settings: { ...v24.settings, currentUserId: "" } };
}

/* v23 -> v24: no persisted-shape change — the monthly-within-quarter
   breakdown is computed at render time from each deal's closeDate. */
function migrateV23(v23) {
  return { ...v23, settings: { ...v23.settings, currentUserId: "" } };
}

/* v22 -> v23: no persisted-shape change — the raw matrix and PDF
   pagination are computed/assembled at render/export time. */
function migrateV22(v22) {
  return { ...v22, settings: { ...v22.settings, currentUserId: "" } };
}

/* v21 -> v22: no persisted-shape change — detailed report breakdowns are
   computed at render/export time from data already in the document. */
function migrateV21(v21) {
  return { ...v21, settings: { ...v21.settings, currentUserId: "" } };
}

/* v20 -> v21: stage-history log on deals (one baseline entry for existing
   deals, since transitions before this feature existed aren't known). */
function migrateV20(v20) {
  return {
    ...v20,
    deals: (v20.deals || []).map((d) => ({
      stageHistory: (d.stageHistory && d.stageHistory.length) ? d.stageHistory : [{ stage: d.stage, date: d.lastTouch || d.createdAt || today() }],
      ...d,
    })),
    settings: { ...v20.settings, currentUserId: "" },
  };
}

/* v19 -> v20: no persisted-shape change — report date-range filtering and
   A4 layout are generated at render/export time, not stored. */
function migrateV19(v19) {
  return { ...v19, settings: { ...v19.settings, currentUserId: "" } };
}

/* v18 -> v19: no persisted-shape change — FUNNEL_SEED/classification
   constants are static reference data, not part of the stored document. */
function migrateV18(v18) {
  return { ...v18, settings: { ...v18.settings, currentUserId: "" } };
}

/* v17 -> v18: no persisted-shape change — v18 was a CSS/responsive-only
   release. (Declared here, correctly wired into the chain — a prior patch
   introduced KEY_V18 without actually chaining it, which this fixes.) */
function migrateV17(v17) {
  return { ...v17, settings: { ...v17.settings, currentUserId: "" } };
}

/* v16 -> v17: unassigned accounts default to the Area Director; users gain
   email + reportsTo for a real create-user/reporting-line flow */
function migrateV16(v16) {
  return {
    ...v16,
    accounts: (v16.accounts || []).map((a) => ({ ...a, ownerId: a.ownerId || "r0" })),
    users: (v16.users || []).map((u) => ({ email: u.email || "", reportsTo: u.reportsTo !== undefined ? u.reportsTo : (u.role === "Area Director" ? "" : "r0"), ...u })),
    settings: { ...v16.settings, currentUserId: "" },
  };
}

/* v15 -> v16: real invoiced-revenue history reconciled from Jul 2026 export */
function migrateV15(v15) {
  return {
    ...v15,
    accounts: (v15.accounts || []).map((a) => (REVENUE_SEED[a.id] ? { ...a, revenue: REVENUE_SEED[a.id] } : { revenue: a.revenue || null, ...a })),
    settings: { ...v15.settings, currentUserId: "" },
  };
}

/* v14 -> v15: governance fields — meetingNotes/agreement on deals, payouts, roles, lead->account linking */
function migrateV14(v14) {
  const rolesNeeded = ["Operations", "Finance"];
  const haveRoles = new Set((v14.users || []).map((u) => u.role));
  const newUsers = rolesNeeded.filter((r) => !haveRoles.has(r)).map((r, i) => ({ id: `u${6 + i}`, name: r, role: r, region: "" }));
  return {
    ...v14,
    users: [...(v14.users || []), ...newUsers],
    payouts: v14.payouts || [],
    deals: (v14.deals || []).map((d) => ({ meetingNotes: [], agreement: null, ...d })),
    leads: (v14.leads || []).map((l) => ({ accountId: l.accountId || "", contactId: l.contactId || "", ...l })),
    settings: { ...v14.settings, currentUserId: "" },
  };
}

/* v13 -> v14: Tooling & Calibration line + banner.aero customer flags + Tunisia accounts */
const V14_TOOLING_IDS = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9"];
function migrateV13(v13) {
  const have = new Set((v13.catalog || []).map((p) => p.id));
  const toolingItems = SEED_CATALOG.filter((p) => V14_TOOLING_IDS.includes(p.id) && !have.has(p.id));
  const haveNames = new Set((v13.accounts || []).map((a) => (a.name || "").toLowerCase()));
  const newAccounts = SEED.accounts.filter((a) => ["a52", "a53"].includes(a.id) && !haveNames.has(a.name.toLowerCase()));
  return {
    ...v13,
    catalog: [...(v13.catalog || []), ...toolingItems],
    accounts: [...(v13.accounts || []).map((a) => ({ ...a, webCustomer: WEB_CUSTOMERS.includes(a.id) || a.webCustomer || false })), ...newAccounts],
    activities: [...(v13.activities || []), { id: uid(), text: "Confirm Tooling & Calibration commission rate with BAI (line found on banner.aero, not in June memo); request portal data feed (store.banner.aero) for live stock/pricing", accountId: "", due: today(), done: false }],
    settings: { ...v13.settings, currentUserId: "" },
  };
}

/* v12 -> v13: refresh fleets with verified mid-2026 data + fleets for previously missing accounts */
function migrateV12(v12) {
  return {
    ...v12,
    accounts: (v12.accounts || []).map((a) => (FLEET_SEED[a.id] ? { ...a, fleet: FLEET_SEED[a.id] } : { fleet: [], ...a })),
    settings: { ...v12.settings, currentUserId: "" },
  };
}

/* v11 -> v12: Aircraft 360 — fleets on accounts, registry, AOG cases, ATA/PMA on catalog */
function migrateV11(v11) {
  return {
    ...v11,
    accounts: (v11.accounts || []).map((a) => ({ fleet: FLEET_SEED[a.id] || [], ...a })),
    catalog: (v11.catalog || []).map((p) => (V12_CAT_ATA[p.id] ? { ...p, ...V12_CAT_ATA[p.id] } : p)),
    aircraft: v11.aircraft || [],
    aogCases: v11.aogCases || [],
    settings: { ...v11.settings, currentUserId: "" },
  };
}

function migrateV10(v10) {
  return {
    ...v10,
    deals: (v10.deals || []).map((d) => ({ collectedAt: "", ...d })),
    settings: { ...v10.settings, currentUserId: "" },
  };
}

/* v9 -> v10: aviation quote format — PNs on catalog, condition/lead on lines, incoterms */
const V10_CAT_PATCH = {
  n1: { pn: "21435-00", name: "SID88 Low-Frequency ULB 8.8kHz (alt. for Dukane DK180)", unit: "EA", lead: "Stock" },
  n2: { pn: "22960-00", name: "BLUE90 ULB 37.5kHz (alt. for DK120/90)", unit: "EA", lead: "Stock" },
  n3: { pn: "18717-00", name: "GREEN90 Lithium-Free ULB 37.5kHz (alt. for DK120/90)", unit: "EA", lead: "Stock" },
  v1: { pn: "VA-2540-T01", name: "Hot Water Tank Assy (OEM 8921110G5)", unit: "EA", lead: "2-3 wks" },
  v2: { pn: "VA-2540-T02", name: "Hot Water Tank Assy (OEM 8921385G1)", unit: "EA", lead: "2-3 wks" },
  v3: { pn: "VA-2540-H01", name: "Cartridge Heater Assy (OEM 24D507239P01)", unit: "EA", lead: "2-3 wks" },
  v4: { pn: "VA-2540-H02", name: "Cartridge Heater Assy (OEM 24D507239P02)", unit: "EA", lead: "2-3 wks" },
  v5: { pn: "3E2534-VA", name: "Water Level Sensor Assy (OEM 3E2534)", unit: "EA", lead: "2-3 wks" },
  v6: { pn: "532T1-1M-140-VA", name: "Pressure Relief Valve (OEM 532T1-1M-140)", unit: "EA", lead: "2-3 wks" },
  v7: { pn: "24B508385P1-VA", name: "Temperature Sensor Probe (OEM 24B508385P1)", unit: "EA", lead: "2-3 wks" },
  o1: { pn: "OL-series", unit: "EA", lead: "Stock-4 wks" }, o2: { pn: "OL-series", unit: "EA", lead: "Stock-4 wks" }, o3: { pn: "OL-series", unit: "EA", lead: "Stock-4 wks" },
  o4: { pn: "OL-series", unit: "EA", lead: "Stock-4 wks" }, o5: { pn: "OL-series", unit: "EA", lead: "4-6 wks" }, o6: { pn: "OL-LED", unit: "EA", lead: "4-6 wks" },
  j1: { pn: "349-series", unit: "EA", lead: "4-7 wks" }, j2: { pn: "353-series", unit: "EA", lead: "4-7 wks" }, j3: { pn: "358-series", unit: "EA", lead: "4-7 wks" },
  j4: { pn: "Various", unit: "EA", lead: "4-7 wks" }, j5: { pn: "Custom", unit: "KIT", lead: "4-8 wks" }, j6: { pn: "Custom", unit: "EA", lead: "6-10 wks" },
  r1: { pn: "N/A", unit: "EVT", lead: "Per T/A" }, r2: { pn: "N/A", unit: "EVT", lead: "AOG" },
};
function migrateV9(v9) {
  return {
    ...v9,
    catalog: (v9.catalog || []).map((p) => (V10_CAT_PATCH[p.id] ? { ...p, ...V10_CAT_PATCH[p.id] } : { pn: p.pn || "TBD", ...p })),
    quotes: (v9.quotes || []).map((q) => ({
      incoterm: "EXW Hollywood, FL", attention: "", customerRef: "",
      ...q,
      lines: (q.lines || []).map((l) => ({ cond: "NE", leadTime: "", ...l })),
    })),
    settings: { ...v9.settings, currentUserId: "" },
  };
}

/* v8 -> v9: registrations, RFQ dates, stale tracking, loss reasons */
function migrateV8(v8) {
  return {
    ...v8,
    accounts: (v8.accounts || []).map((a) => ({ reg: { status: "Not started", submitted: "", expected: "", expiry: "", notes: "" }, ...a })),
    deals: (v8.deals || []).map((d) => ({ lastTouch: d.createdAt || today(), lossReason: "", lossNote: "", ...d })),
    quotes: (v8.quotes || []).map((q) => ({ rfqDate: "", sentAt: "", ...q })),
    settings: { ...v8.settings, currentUserId: "" },
  };
}

/* v7 -> v8: add payment terms to quotes and the terms approval matrix to settings */
function migrateV7(v7) {
  return {
    ...v7,
    quotes: (v7.quotes || []).map((q) => ({ paymentTerms: "Cash on Order", ...q })),
    settings: { ...v7.settings, termsMatrix: v7.settings?.termsMatrix || DEFAULT_TERMS_MATRIX, currentUserId: "" },
  };
}

/* v6 -> v7: add volume tiers to Novega catalog items */
const BULK_TIERS = { n1: { bulkQty: 10, bulkPrice: 4000 }, n2: { bulkQty: 10, bulkPrice: 950 }, n3: { bulkQty: 10, bulkPrice: 950 } };
function migrateV6(v6) {
  return {
    ...v6,
    catalog: (v6.catalog || []).map((p) => (BULK_TIERS[p.id] ? { ...p, ...BULK_TIERS[p.id] } : p)),
    settings: { ...v6.settings, currentUserId: "" },
  };
}

/* v5 -> v6: merge official account list & BD team into user data, swap in real catalog */
const normName = (s) => (s || "").toLowerCase().replace(/[^a-z ]/g, "").split(" ").filter((w) => !["limited", "ltd", "company", "pty", "plc"].includes(w)).join(" ").trim();
function migrateV5(v5) {
  const oldSeedCatalogIds = new Set(["p1","p2","p3","p4","p5","p6","p7","p8","p9","p10","p11","p12"]);
  const userCatalogItems = (v5.catalog || []).filter((p) => !oldSeedCatalogIds.has(p.id));
  const catalog = [...SEED_CATALOG, ...userCatalogItems];
  const catIds = new Set(catalog.map((p) => p.id));

  const existing = [...(v5.accounts || [])];
  const byNorm = {};
  existing.forEach((a) => { byNorm[normName(a.name)] = a; });
  const accounts = [...existing];
  SEED_ACCOUNTS.forEach((na) => {
    const hit = byNorm[normName(na.name)];
    if (hit) { hit.ownerId = na.ownerId; hit.region = na.region; hit.country = hit.country || na.country; }
    else accounts.push(na);
  });

  const oldUsers = v5.users || [];
  const users = [...oldUsers.filter((u) => u.role !== "Territory Manager (BD)" || !SEED_USERS.some((su) => normName(su.name) === normName(u.name)))];
  SEED_USERS.forEach((su) => { if (!users.some((u) => u.id === su.id || normName(u.name) === normName(su.name))) users.push(su); });

  const quotes = (v5.quotes || []).map((q) => ({ ...q, lines: (q.lines || []).filter((l) => catIds.has(l.itemId)) })).filter((q) => q.lines.length > 0);

  return {
    ...v5,
    users, accounts, catalog, quotes,
    leads: (v5.leads || []).map((l) => ({ ownerId: "r0", ...l })),
    settings: { ...v5.settings, currentUserId: "" },
  };
}
const LEAD_STATUS_MAP = { New: "Unqualified", Working: "Unqualified", Disqualified: "Retired" };
function migrateV4(v4) {
  return {
    ...v4,
    settings: { ...v4.settings, currentUserId: "" },
    deals: (v4.deals || []).map((d) => ({ ...d, forecastCat: FCAT_MAP[d.forecastCat] || d.forecastCat })),
    leads: (v4.leads || []).map((l) => ({ rank: "Warm", ...l, status: LEAD_STATUS_MAP[l.status] || l.status })),
  };
}

function migrateV3(v3) {
  return {
    ...v3,
    catalog: SEED_CATALOG,
    quotes: SEED.quotes,
    settings: { ...v3.settings, thresholds: DEFAULT_THRESHOLDS, currentUserId: "" },
  };
}
function migrateV2(v2) {
  const users = (v2.reps || []).map((r, i) => ({
    id: r.id, name: r.name, region: r.region || "",
    role: r.id === "r0" || i === 0 ? "Area Director" : "Territory Manager (BD)",
  }));
  SEED_USERS.forEach((su) => { if (!users.some((u) => u.role === su.role && su.role !== "Territory Manager (BD)")) users.push({ ...su, id: users.some((u) => u.id === su.id) ? uid() : su.id }); });
  return migrateV3({
    users,
    settings: { monthlyQuota: v2.settings?.monthlyQuota ?? 300000, currentUserId: "" },
    leads: v2.leads || SEED.leads,
    accounts: v2.accounts || SEED.accounts,
    contacts: v2.contacts || SEED.contacts,
    deals: v2.deals || SEED.deals,
    activities: v2.activities || SEED.activities,
    interactions: v2.interactions || [],
  });
}
function migrateV1(v1) {
  return {
    reps: [{ id: "r0", name: "Zelealem M.J.", region: "" }],
    settings: { monthlyQuota: 300000 },
    leads: SEED.leads,
    accounts: (v1.accounts || SEED.accounts).map((a) => ({ ownerId: "r0", ...a })),
    contacts: v1.contacts || SEED.contacts,
    activities: v1.activities || SEED.activities,
    interactions: [],
    deals: (v1.deals || []).map((d) => ({
      id: d.id, name: d.name, accountId: d.accountId, ownerId: "r0",
      lines: [{ product: d.product, value: d.value }],
      stage: d.stage, prob: STAGE_PROB[d.stage] ?? 10, forecastCat: STAGE_FCAT[d.stage] || "Pipeline",
      closeDate: d.closeDate || "", notes: d.notes || "", createdAt: today(), closedAt: d.stage === "Won" || d.stage === "Lost" ? today() : "",
    })),
  };
}

/* ------------------------------ theme ----------------------------- */

const C = {
  bg: "#F4F6F8", surface: "#FFFFFF", line: "#DDE3E9",
  ink: "#15242F", sub: "#5A6B78", faint: "#8CA0AE",
  blue: "#14538C", blueDeep: "#0C3557", teal: "#0E6E6E",
  amber: "#B8720F", amberBg: "#FBF3E4",
  green: "#256E4E", greenBg: "#E7F3ED",
  red: "#A63A3A", redBg: "#F9ECEC",
};
const tierColor = { "Tier 1": C.amber, "Tier 2": C.teal, "Tier 3": C.faint };
const stageColor = { Prospect: C.faint, Contacted: "#6E88A0", "Meeting Held": C.teal, "Quote / RFQ": C.blue, Negotiation: C.amber, Won: C.green, Lost: C.red };
const fcatColor = { Omitted: C.faint, Pipeline: "#6E88A0", Upside: C.blue, Forecast: C.amber, Closed: C.green };
const leadColor = { Unqualified: "#6E88A0", Qualified: C.teal, Converted: C.green, Retired: C.faint };
const rankColor = { Hot: C.red, Warm: C.amber, Cool: C.faint };
const regColor = { "Not started": C.faint, "Docs submitted": "#6E88A0", "Under evaluation": C.blue, "Audit / site visit": C.amber, "PVL awarded": C.green, Expired: C.red };

const inputStyle = { width: "100%", boxSizing: "border-box", padding: "8px 10px", border: `1px solid ${C.line}`, borderRadius: 4, fontSize: 14, color: C.ink, background: "#fff", fontFamily: "inherit" };

const Tag = ({ color, children }) => (
  <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 3, fontSize: 11, fontWeight: 600, letterSpacing: "0.03em", color: "#fff", background: color, whiteSpace: "nowrap" }}>{children}</span>
);

const Field = ({ label, children, flex }) => (
  <label style={{ display: "block", marginBottom: 12, flex: flex ? 1 : undefined }}>
    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: C.sub, marginBottom: 4 }}>{label}</div>
    {children}
  </label>
);

const Btn = ({ onClick, kind = "primary", children, small, disabled }) => {
  const base = { border: "none", borderRadius: 4, cursor: disabled ? "not-allowed" : "pointer", fontWeight: 600, fontFamily: "inherit", fontSize: small ? 12 : 13, padding: small ? "5px 10px" : "9px 14px", display: "inline-flex", alignItems: "center", gap: 6, opacity: disabled ? 0.5 : 1 };
  const kinds = {
    primary: { background: C.blue, color: "#fff" },
    green: { background: C.green, color: "#fff" },
    amber: { background: C.amber, color: "#fff" },
    ghost: { background: "transparent", color: C.blue, border: `1px solid ${C.line}` },
    danger: { background: "transparent", color: C.red, border: `1px solid ${C.line}` },
  };
  return <button onClick={disabled ? undefined : onClick} disabled={disabled} style={{ ...base, ...kinds[kind] }}>{children}</button>;
};

const IconBtn = ({ onClick, color = C.sub, title, children }) => (
  <button onClick={onClick} title={title} style={{ background: "none", border: "none", cursor: "pointer", color, padding: 4 }}>{children}</button>
);

const Modal = ({ title, onClose, children, wide }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(12,25,35,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16 }} onClick={onClose}>
    <div style={{ background: "#fff", borderRadius: 8, width: "100%", maxWidth: wide ? 680 : 480, maxHeight: "90vh", overflowY: "auto", padding: 20 }} onClick={(e) => e.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h3 style={{ margin: 0, fontSize: 16, color: C.ink }}>{title}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.sub }}><X size={18} /></button>
      </div>
      {children}
    </div>
  </div>
);

const Card = ({ children, style }) => (
  <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 6, ...style }}>{children}</div>
);

const SectionTitle = ({ children, right }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
    <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: C.blueDeep }}>{children}</div>
    {right}
  </div>
);

/* ------------------------------- App ------------------------------ */

export default function BAICrmV36() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("dashboard");
  const [modal, setModal] = useState(null);
  const [loginStep, setLoginStep] = useState("landing"); // "landing" -> "gate"
  const [loginQuery, setLoginQuery] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const [loginSelected, setLoginSelected] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [regionFilter, setRegionFilter] = useState("All");
  const [saveState, setSaveState] = useState("");

  useEffect(() => {
    (async () => {
      for (const [key, mig] of [[KEY_V36, (x) => x], [KEY_V35, migrateV35], [KEY_V34, (x) => migrateV35(migrateV34(x))], [KEY_V33, (x) => migrateV35(migrateV34(migrateV33(x)))], [KEY_V32, (x) => migrateV35(migrateV34(migrateV33(migrateV32(x))))], [KEY_V31, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(x)))))], [KEY_V30, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(x))))))], [KEY_V29, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(x)))))))], [KEY_V28, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(x))))))))], [KEY_V27, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(x)))))))))], [KEY_V26, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(migrateV26(x))))))))))], [KEY_V25, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(migrateV26(migrateV25(x)))))))))))], [KEY_V24, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(migrateV26(migrateV25(migrateV24(x))))))))))))], [KEY_V23, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(migrateV26(migrateV25(migrateV24(migrateV23(x)))))))))))))], [KEY_V22, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(migrateV26(migrateV25(migrateV24(migrateV23(migrateV22(x))))))))))))))], [KEY_V21, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(migrateV26(migrateV25(migrateV24(migrateV23(migrateV22(migrateV21(x)))))))))))))))], [KEY_V20, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(migrateV26(migrateV25(migrateV24(migrateV23(migrateV22(migrateV21(migrateV20(x))))))))))))))))], [KEY_V19, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(migrateV26(migrateV25(migrateV24(migrateV23(migrateV22(migrateV21(migrateV20(migrateV19(x)))))))))))))))))], [KEY_V18, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(migrateV26(migrateV25(migrateV24(migrateV23(migrateV22(migrateV21(migrateV20(migrateV19(migrateV18(x))))))))))))))))))], [KEY_V17, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(migrateV26(migrateV25(migrateV24(migrateV23(migrateV22(migrateV21(migrateV20(migrateV19(migrateV18(migrateV17(x)))))))))))))))))))], [KEY_V16, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(migrateV26(migrateV25(migrateV24(migrateV23(migrateV22(migrateV21(migrateV20(migrateV19(migrateV18(migrateV17(migrateV16(x))))))))))))))))))))], [KEY_V15, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(migrateV26(migrateV25(migrateV24(migrateV23(migrateV22(migrateV21(migrateV20(migrateV19(migrateV18(migrateV17(migrateV16(migrateV15(x)))))))))))))))))))))], [KEY_V14, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(migrateV26(migrateV25(migrateV24(migrateV23(migrateV22(migrateV21(migrateV20(migrateV19(migrateV18(migrateV17(migrateV16(migrateV15(migrateV14(x))))))))))))))))))))))], [KEY_V13, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(migrateV26(migrateV25(migrateV24(migrateV23(migrateV22(migrateV21(migrateV20(migrateV19(migrateV18(migrateV17(migrateV16(migrateV15(migrateV14(migrateV13(x)))))))))))))))))))))))], [KEY_V12, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(migrateV26(migrateV25(migrateV24(migrateV23(migrateV22(migrateV21(migrateV20(migrateV19(migrateV18(migrateV17(migrateV16(migrateV15(migrateV14(migrateV13(migrateV12(x))))))))))))))))))))))))], [KEY_V11, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(migrateV26(migrateV25(migrateV24(migrateV23(migrateV22(migrateV21(migrateV20(migrateV19(migrateV18(migrateV17(migrateV16(migrateV15(migrateV14(migrateV13(migrateV12(migrateV11(x)))))))))))))))))))))))))], [KEY_V10, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(migrateV26(migrateV25(migrateV24(migrateV23(migrateV22(migrateV21(migrateV20(migrateV19(migrateV18(migrateV17(migrateV16(migrateV15(migrateV14(migrateV13(migrateV12(migrateV11(migrateV10(x))))))))))))))))))))))))))], [KEY_V9, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(migrateV26(migrateV25(migrateV24(migrateV23(migrateV22(migrateV21(migrateV20(migrateV19(migrateV18(migrateV17(migrateV16(migrateV15(migrateV14(migrateV13(migrateV12(migrateV11(migrateV10(migrateV9(x)))))))))))))))))))))))))))], [KEY_V8, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(migrateV26(migrateV25(migrateV24(migrateV23(migrateV22(migrateV21(migrateV20(migrateV19(migrateV18(migrateV17(migrateV16(migrateV15(migrateV14(migrateV13(migrateV12(migrateV11(migrateV10(migrateV9(migrateV8(x))))))))))))))))))))))))))))], [KEY_V7, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(migrateV26(migrateV25(migrateV24(migrateV23(migrateV22(migrateV21(migrateV20(migrateV19(migrateV18(migrateV17(migrateV16(migrateV15(migrateV14(migrateV13(migrateV12(migrateV11(migrateV10(migrateV9(migrateV8(migrateV7(x)))))))))))))))))))))))))))))], [KEY_V6, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(migrateV26(migrateV25(migrateV24(migrateV23(migrateV22(migrateV21(migrateV20(migrateV19(migrateV18(migrateV17(migrateV16(migrateV15(migrateV14(migrateV13(migrateV12(migrateV11(migrateV10(migrateV9(migrateV8(migrateV7(migrateV6(x))))))))))))))))))))))))))))))], [KEY_V5, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(migrateV26(migrateV25(migrateV24(migrateV23(migrateV22(migrateV21(migrateV20(migrateV19(migrateV18(migrateV17(migrateV16(migrateV15(migrateV14(migrateV13(migrateV12(migrateV11(migrateV10(migrateV9(migrateV8(migrateV7(migrateV6(migrateV5(x)))))))))))))))))))))))))))))))], [KEY_V4, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(migrateV26(migrateV25(migrateV24(migrateV23(migrateV22(migrateV21(migrateV20(migrateV19(migrateV18(migrateV17(migrateV16(migrateV15(migrateV14(migrateV13(migrateV12(migrateV11(migrateV10(migrateV9(migrateV8(migrateV7(migrateV6(migrateV5(migrateV4(x))))))))))))))))))))))))))))))))], [KEY_V3, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(migrateV26(migrateV25(migrateV24(migrateV23(migrateV22(migrateV21(migrateV20(migrateV19(migrateV18(migrateV17(migrateV16(migrateV15(migrateV14(migrateV13(migrateV12(migrateV11(migrateV10(migrateV9(migrateV8(migrateV7(migrateV6(migrateV5(migrateV4(migrateV3(x)))))))))))))))))))))))))))))))))], [KEY_V2, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(migrateV26(migrateV25(migrateV24(migrateV23(migrateV22(migrateV21(migrateV20(migrateV19(migrateV18(migrateV17(migrateV16(migrateV15(migrateV14(migrateV13(migrateV12(migrateV11(migrateV10(migrateV9(migrateV8(migrateV7(migrateV6(migrateV5(migrateV4(migrateV2(x)))))))))))))))))))))))))))))))))], [KEY_V1, (x) => migrateV35(migrateV34(migrateV33(migrateV32(migrateV31(migrateV30(migrateV29(migrateV28(migrateV27(migrateV26(migrateV25(migrateV24(migrateV23(migrateV22(migrateV21(migrateV20(migrateV19(migrateV18(migrateV17(migrateV16(migrateV15(migrateV14(migrateV13(migrateV12(migrateV11(migrateV10(migrateV9(migrateV8(migrateV7(migrateV6(migrateV5(migrateV4(migrateV2(migrateV1(x))))))))))))))))))))))))))))))))))]]) {
        try {
          const res = await window.storage.get(key);
          if (res && res.value) {
            const d = mig(JSON.parse(res.value));
            setData(d);
            if (key !== KEY_V36) { try { await window.storage.set(KEY_V36, JSON.stringify(d)); } catch (e) {} }
            return;
          }
        } catch (e) { /* try next */ }
      }
      setData(SEED);
      try { await window.storage.set(KEY_V36, JSON.stringify(SEED)); } catch (e) { console.error(e); }
    })();
  }, []);

  const persist = async (next) => {
    setData(next);
    setSaveState("Saving…");
    try {
      await window.storage.set(KEY_V36, JSON.stringify(next));
      setSaveState("Saved");
      setTimeout(() => setSaveState(""), 1500);
    } catch (e) { setSaveState("Save failed — data kept in session"); }
  };

  if (!data) return <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", padding: 40, color: C.sub }}>Loading your pipeline…</div>;

  const { accounts, contacts, deals, activities, leads, users, interactions, settings, catalog, quotes, aircraft = [], aogCases = [], payouts = [], industryContacts = [] } = data;
  const thresholds = settings.thresholds || DEFAULT_THRESHOLDS;
  const termsMatrix = settings.termsMatrix || DEFAULT_TERMS_MATRIX;
  const me = users.find((u) => u.id === settings.currentUserId);

  /* ---------- sign-in: landing page, then a name + PIN gate ---------- */
  if (!me) {
    /* --- v37 landing: editorial refinement, scoped to this branch only ---
       Local design tokens (L, displayStack, bodyStack, monoStack) intentionally
       do NOT touch the global palette C — once we're past sign-in, the app
       reverts to the existing corporate palette without any disruption.      */
    const L = {
      ink:       "#0A1F33",  // deep aviation midnight (hero bg — flat, no marketing gradient)
      paper:     "#F6F4EE",  // warm ivory (right panel — replaces cool #F4F6F8)
      paperLine: "#E3DFD3",  // fine ivory divider
      paperInk:  "#1B2733",  // heading ink on ivory
      paperSub:  "#5A6472",  // body ink on ivory
      paperFaint:"#8B94A0",  // meta / eyebrow on ivory
      gold:      "#B0873B",  // burnished gold — restrained instrument-panel accent
      goldSoft:  "#D9B679",  // soft gold for the one italic emphasis word
      inkOn:     "#EFEAE0",  // primary text on ink (warm off-white, not pure #fff)
      inkSub:    "rgba(239,234,224,0.62)",
      inkFaint:  "rgba(239,234,224,0.22)",
      inkField:  "#FBFAF6",  // input fills on ivory
    };
    const displayStack = "'Iowan Old Style', 'Charter', 'Palatino Linotype', Palatino, Georgia, serif";
    const bodyStack    = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
    const monoStack    = "'SF Mono', 'JetBrains Mono', Menlo, Consolas, 'Roboto Mono', monospace";

    const features = [
      [Building2, "46-account book across Africa and the Middle East — with real fleet and revenue data behind every name."],
      [TrendingUp, "Live pipeline, CPQ quoting, and territory-scoped forecasting under one roof."],
      [ShieldCheck, "Role-based access — every rep sees only their own accounts and commissions."],
    ];
    // Signature element: priority hubs actually in the account book.
    // ICAO codes read fluently to aviation professionals and substitute for the vague "30+ countries" stat.
    const HUBS = ["ADD", "NBO", "CAI", "CMN", "JNB", "ACC", "LOS", "KGL", "DAR", "LAD"];

    const matches = loginQuery.trim().length > 0
      ? users.filter((u) => u.name.toLowerCase().includes(loginQuery.trim().toLowerCase()))
      : [];

    const trySignIn = () => {
      if (!loginSelected) { setLoginError("Select your name from the list first."); return; }
      if (loginPin !== (loginSelected.pin || "1234")) { setLoginError("Incorrect PIN."); return; }
      persist({ ...data, settings: { ...settings, currentUserId: loginSelected.id } });
    };

    const inkBtnStyle = {
      fontFamily: bodyStack, background: L.ink, color: L.inkOn, border: "none",
      borderRadius: 3, padding: "12px 20px", fontSize: 13, fontWeight: 600,
      letterSpacing: "0.02em", cursor: "pointer", display: "inline-flex",
      alignItems: "center", gap: 8,
    };
    const ivoryInputStyle = {
      width: "100%", boxSizing: "border-box", padding: "11px 14px",
      border: `1px solid ${L.paperLine}`, borderRadius: 3, fontSize: 14,
      color: L.paperInk, background: L.inkField, fontFamily: bodyStack, outline: "none",
    };
    const eyebrow = (color) => ({
      fontFamily: bodyStack, fontSize: 10.5, fontWeight: 600,
      letterSpacing: "0.22em", textTransform: "uppercase", color,
    });

    const HeroPanel = (
      <div className="bai-login-hero" style={{
        flex: "1 1 460px", background: L.ink, color: L.inkOn,
        padding: "80px 64px 56px", display: "flex", flexDirection: "column",
        justifyContent: "space-between", minHeight: 560, position: "relative", overflow: "hidden",
      }}>
        {/* very subtle gold vignette — depth without a marketing gradient */}
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 80% at 100% 0%, rgba(176,135,59,0.12), transparent 55%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", maxWidth: 520 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 44 }}>
            <Plane size={16} style={{ transform: "rotate(-45deg)", color: L.gold, opacity: 0.95 }} />
            <span style={eyebrow(L.inkSub)}>Banner Aircraft International</span>
          </div>

          <h1 style={{
            fontFamily: displayStack, fontSize: "clamp(38px, 4.6vw, 56px)", lineHeight: 1.02,
            fontWeight: 600, margin: 0, marginBottom: 22, letterSpacing: "-0.015em", color: L.inkOn,
          }}>
            Africa Business<br />
            Development, <em style={{ fontStyle: "italic", color: L.goldSoft, fontWeight: 500 }}>unified</em>.
          </h1>

          <div style={{ fontFamily: bodyStack, fontSize: 15, opacity: 0.78, lineHeight: 1.65, marginBottom: 40, maxWidth: 440 }}>
            Every account, quote, and pipeline stage across the region — kept honest by one shared record.
          </div>

          {loginStep === "landing" && (
            <div style={{ borderTop: `1px solid ${L.inkFaint}` }}>
              {features.map(([Icon, text], i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 18, padding: "18px 0", borderBottom: `1px solid ${L.inkFaint}` }}>
                  <Icon size={16} color={L.gold} style={{ flexShrink: 0, marginTop: 3 }} />
                  <div style={{ fontFamily: bodyStack, fontSize: 13.5, lineHeight: 1.55, color: L.inkOn, opacity: 0.88 }}>{text}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Signature: COVERAGE flight-strip. Monospaced ICAO codes read as
            "these are the hubs we serve" — evidence, not marketing copy. */}
        <div style={{ position: "relative", marginTop: 48 }}>
          <div style={{ ...eyebrow(L.inkSub), opacity: 0.7, marginBottom: 12 }}>Coverage</div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0 14px", fontFamily: monoStack, fontSize: 13, letterSpacing: "0.08em", color: L.inkOn, opacity: 0.9 }}>
            {HUBS.map((code, i) => (
              <React.Fragment key={code}>
                <span>{code}</span>
                {i < HUBS.length - 1 && <span style={{ color: L.inkFaint }}>·</span>}
              </React.Fragment>
            ))}
          </div>
          <div style={{ display: "flex", gap: 44, marginTop: 26, paddingTop: 22, borderTop: `1px solid ${L.inkFaint}`, flexWrap: "wrap" }}>
            {[["1994", "Founded"], ["150+", "Clients"], ["100+", "Airlines"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: monoStack, fontSize: 22, fontWeight: 500, color: L.inkOn, letterSpacing: "-0.01em" }}>{n}</div>
                <div style={{ fontFamily: bodyStack, fontSize: 10, opacity: 0.55, textTransform: "uppercase", letterSpacing: "0.18em", marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    return (
      <div style={{ fontFamily: bodyStack, minHeight: "100vh", display: "flex", flexWrap: "wrap", background: L.paper }}>
        {HeroPanel}

        <div style={{ flex: "1 1 400px", background: L.paper, display: "flex", alignItems: "center", justifyContent: "center", padding: "56px 40px" }}>
          <div style={{ width: "100%", maxWidth: 340 }}>
            {loginStep === "landing" ? (
              <div>
                <div style={{ ...eyebrow(L.paperFaint), marginBottom: 22 }}>Africa Area · Restricted</div>
                <div style={{ fontFamily: displayStack, fontSize: 34, fontWeight: 600, color: L.paperInk, lineHeight: 1.1, letterSpacing: "-0.01em", marginBottom: 14 }}>
                  Welcome back.
                </div>
                <div style={{ fontFamily: bodyStack, fontSize: 13.5, color: L.paperSub, marginBottom: 32, lineHeight: 1.6 }}>
                  Sign in to pick up where you left off — pipeline, quotes, and the day's actions.
                </div>
                <button onClick={() => setLoginStep("gate")} style={inkBtnStyle}>
                  Sign in <span style={{ opacity: 0.55 }}>→</span>
                </button>
              </div>
            ) : (
              <div>
                <button onClick={() => { setLoginStep("landing"); setLoginQuery(""); setLoginSelected(null); setLoginPin(""); setLoginError(""); }}
                  style={{ background: "none", border: "none", color: L.paperSub, fontSize: 12, cursor: "pointer", fontFamily: bodyStack, padding: 0, marginBottom: 22, display: "inline-flex", alignItems: "center", gap: 6 }}>
                  ← Back
                </button>
                <div style={{ fontFamily: displayStack, fontSize: 30, fontWeight: 600, color: L.paperInk, lineHeight: 1.1, letterSpacing: "-0.01em", marginBottom: 8 }}>
                  Sign in.
                </div>
                <div style={{ fontFamily: bodyStack, fontSize: 13, color: L.paperSub, marginBottom: 24, lineHeight: 1.6 }}>
                  Type your name, then enter your PIN.
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontFamily: bodyStack, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: L.paperFaint, marginBottom: 8 }}>Name</div>
                  <input
                    style={ivoryInputStyle}
                    placeholder="Start typing…"
                    value={loginSelected ? loginSelected.name : loginQuery}
                    onChange={(e) => { setLoginQuery(e.target.value); setLoginSelected(null); setLoginError(""); }}
                    autoFocus
                  />
                </div>
                {!loginSelected && matches.length > 0 && (
                  <div style={{ marginBottom: 12, border: `1px solid ${L.paperLine}`, borderRadius: 3, overflow: "hidden", background: L.inkField }}>
                    {matches.slice(0, 6).map((u, idx) => (
                      <button key={u.id} onClick={() => { setLoginSelected(u); setLoginQuery(""); setLoginError(""); }}
                        style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", gap: 8, background: "none", border: "none", borderTop: idx === 0 ? "none" : `1px solid ${L.paperLine}`, padding: "10px 12px", cursor: "pointer", fontFamily: bodyStack, textAlign: "left" }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: L.paperInk }}>{u.name}</span>
                        <Tag color={roleColorMap[u.role] || C.faint}>{u.role}</Tag>
                      </button>
                    ))}
                  </div>
                )}
                {!loginSelected && loginQuery.trim() && matches.length === 0 && (
                  <div style={{ fontFamily: bodyStack, fontSize: 12, color: L.paperFaint, marginBottom: 12 }}>
                    No match — check your spelling.
                  </div>
                )}

                {loginSelected && (
                  <div>
                    <div style={{ fontFamily: bodyStack, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: L.paperFaint, marginTop: 6, marginBottom: 8 }}>PIN</div>
                    <input
                      type="password" inputMode="numeric" maxLength={4} style={ivoryInputStyle}
                      value={loginPin} onChange={(e) => { setLoginPin(e.target.value.replace(/\D/g, "")); setLoginError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && trySignIn()}
                      autoFocus
                    />
                    {loginError && <div style={{ fontFamily: bodyStack, fontSize: 12, color: C.red, marginTop: 10 }}>{loginError}</div>}
                    <button onClick={trySignIn} style={{ ...inkBtnStyle, marginTop: 16 }}>
                      Continue <span style={{ opacity: 0.55 }}>→</span>
                    </button>
                  </div>
                )}
                {!loginSelected && loginError && <div style={{ fontFamily: bodyStack, fontSize: 12, color: C.red, marginTop: 10 }}>{loginError}</div>}

                <div style={{ fontFamily: bodyStack, fontSize: 11, color: L.paperFaint, marginTop: 32, lineHeight: 1.6, borderTop: `1px solid ${L.paperLine}`, paddingTop: 16 }}>
                  PIN is a basic demo deterrent, not real security. Production sign-in will use banner.aero Google accounts.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const perm = ROLES[me.role] || ROLES["Analyst"];
  const canEdit = perm.edit;
  const isAdmin = perm.admin;
  const canEditCatalog = isAdmin || !!perm.catalog; // Area Director, Analyst, Operations
  const canProcessPayouts = isAdmin || !!perm.finance; // Area Director, Finance
  const isApproverRole = APPROVAL_LEVELS.some((l) => l.role === me.role);
  const isBD = perm.scope === "region"; // BDs are scoped to the accounts they own (per region sheet)
  const roleOf = (uid_) => users.find((u) => u.id === uid_)?.role;
  /* No backend mail server here — this composes a mailto: draft to the approver's inferred
     banner.aero address (first.last@banner.aero) as an escalation NOTIFICATION INTENT.
     True automated send requires the Supabase backend discussed earlier. */
  const approverEmailOf = (role) => {
    const u = users.find((x) => x.role === role);
    if (!u) return null;
    return u.name.trim().toLowerCase().replace(/[^a-z ]/g, "").split(/\s+/).join(".") + "@banner.aero";
  };
  const notifyApprover = (role, q) => {
    const email = approverEmailOf(role);
    const acctName = acct(q.accountId)?.name || "";
    const subject = encodeURIComponent(`Approval needed — Quote ${q.number} (${acctName})`);
    const body = encodeURIComponent(
      `Quote ${q.number} for ${acctName} requires your approval as ${role}.\n\n` +
      `Discount: ${q.discountPct}%\nPayment terms: ${q.paymentTerms || "Cash on Order"}\nNet value: ${fmt(quoteNet(q))}\n\n` +
      `Please review and approve/reject in the Quotes tab of the CRM.\n— Sent from BAI Africa CRM approval workflow`
    );
    if (email) window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank");
    persist({ ...data, activities: [...data.activities, { id: uid(), text: `Approval escalation e-mailed to ${role}${email ? " (" + email + ")" : ""} — Quote ${q.number}`, accountId: q.accountId, due: today(), done: true }] });
  };

  const acct = (id) => accounts.find((a) => a.id === id);
  const userById = (id) => users.find((u) => u.id === id);
  const itemById = (id) => catalog.find((p) => p.id === id);
  const owners = users.filter((u) => OWNER_ROLES.includes(u.role));

  /* ---------- scoping: BDs see their own book of accounts; others filter by region ---------- */
  const acctOK = (a) => {
    if (isBD) return a ? a.ownerId === me.id : false;
    if (!a) return true;
    return regionFilter === "All" || a.region === regionFilter;
  };
  const vAccounts = accounts.filter(acctOK);
  const vDeals = deals.filter((d) => acctOK(acct(d.accountId)));
  const vLeads = isBD ? leads.filter((l) => l.ownerId === me.id) : leads.filter((l) => regionFilter === "All" || l.region === regionFilter);
  const vContacts = contacts.filter((c) => acctOK(acct(c.accountId)));
  const vActivities = activities.filter((t) => !t.accountId ? !isBD : acctOK(acct(t.accountId)));
  const vQuotes = quotes.filter((q) => acctOK(acct(q.accountId)));
  const vAircraft = aircraft.filter((x) => acctOK(acct(x.accountId)));
  const vAog = aogCases.filter((x) => acctOK(acct(x.accountId)));

  const pendingRoleOf = (q) => q.status === "Pending Approval" ? q.chain[q.approvals.filter((a) => a.decision === "Approved").length] : null;
  const myApprovalQueue = quotes.filter((q) => pendingRoleOf(q) === me.role);

  /* ---------- mutations ---------- */
  const guard = (fn) => (...args) => { if (!canEdit) return; fn(...args); };

  const upsert = (key, item) => {
    if (key === "deals") {
      const prev = data.deals.find((x) => x.id === item.id);
      const stageChanged = !prev || prev.stage !== item.stage;
      item = {
        ...item, lastTouch: today(),
        stageHistory: stageChanged ? [...(item.stageHistory || prev?.stageHistory || []), { stage: item.stage, date: today() }] : (item.stageHistory || prev?.stageHistory || []),
      };
      const list = data.deals;
      const exists = list.some((x) => x.id === item.id);
      persist({ ...data, deals: exists ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item] });
      if (item.stage === "Meeting Held" && (!prev || prev.stage !== "Meeting Held")) setModal({ type: "meetingNote", dealId: item.id });
      else setModal(null);
      return;
    }
    const list = data[key];
    const exists = list.some((x) => x.id === item.id);
    persist({ ...data, [key]: exists ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item] });
    setModal(null);
  };
  const remove = guard((key, id) => {
    if (!window.confirm("Delete this record?")) return;
    let next = { ...data, [key]: data[key].filter((x) => x.id !== id) };
    if (key === "accounts") next = { ...next, deals: next.deals.filter((d) => d.accountId !== id), contacts: next.contacts.filter((c) => c.accountId !== id), interactions: next.interactions.filter((i) => i.accountId !== id), quotes: next.quotes.filter((q) => q.accountId !== id) };
    persist(next);
  });
  const setStage = guard((dealId, stage) => {
    const prev = deals.find((d) => d.id === dealId);
    persist({
      ...data,
      deals: deals.map((d) => d.id === dealId ? {
        ...d, stage,
        prob: settings.stageProb?.[stage] ?? STAGE_PROB[stage] ?? d.prob,
        forecastCat: STAGE_FCAT[stage] || d.forecastCat,
        closedAt: (stage === "Won" || stage === "Lost") ? (d.closedAt || today()) : "",
        lastTouch: today(),
        stageHistory: (prev && prev.stage === stage) ? (d.stageHistory || []) : [...(d.stageHistory || []), { stage, date: today() }],
      } : d),
    });
    if (stage === "Lost") setModal({ type: "lostReason", dealId });
    else if (stage === "Meeting Held" && prev && prev.stage !== "Meeting Held") setModal({ type: "meetingNote", dealId });
  });
  const toggleTask = guard((id) => persist({ ...data, activities: activities.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) }));
  /* Collection is a finance event — only the Area Director confirms it. Commission matures here. */
  const toggleCollected = (dealId) => {
    if (!isAdmin && !canProcessPayouts) return;
    persist({ ...data, deals: deals.map((d) => (d.id === dealId ? { ...d, collectedAt: d.collectedAt ? "" : today() } : d)) });
  };
  /* Cross-territory agreement — arranged by the Area Director between two BDs on one deal */
  const setAgreement = (dealId, agreement) => {
    if (!isAdmin) return;
    persist({ ...data, deals: deals.map((d) => (d.id === dealId ? { ...d, agreement } : d)) });
  };
  const recordPayout = (payout) => {
    if (!canProcessPayouts) return;
    persist({ ...data, payouts: [...payouts, { id: uid(), ...payout }] });
  };
  const setLeadStatus = guard((id, status) => persist({ ...data, leads: leads.map((l) => (l.id === id ? { ...l, status } : l)) }));
  const setLeadRank = guard((id, rank) => persist({ ...data, leads: leads.map((l) => (l.id === id ? { ...l, rank } : l)) }));

  const convertLead = guard((lead) => {
    const account = accounts.find((a) => a.id === lead.accountId);
    if (!account) return;
    let newContacts = contacts;
    if (!lead.contactId && lead.contactName) {
      newContacts = [...contacts, { id: uid(), name: lead.contactName, title: lead.title || "", accountId: account.id, email: "", phone: "", notes: `From lead conversion.` }];
    }
    const opp = {
      id: uid(), name: `${PRODUCTS[lead.product]?.short || lead.product} — ${account.name}`, accountId: account.id, ownerId: lead.ownerId || me.id,
      lines: [{ product: lead.product, value: Number(lead.est) || 0 }],
      stage: "Contacted", prob: 20, forecastCat: "Pipeline", closeDate: "", notes: lead.notes || "", createdAt: today(), closedAt: "", lastTouch: today(), meetingNotes: [], agreement: null,
    };
    persist({
      ...data, contacts: newContacts, deals: [...deals, opp],
      leads: leads.map((l) => (l.id === lead.id ? { ...l, status: "Converted" } : l)),
    });
    setTab("pipeline");
  });

  /* ---------- quote workflow ---------- */
  const updateQuote = (id, patch) => persist({ ...data, quotes: quotes.map((q) => (q.id === id ? { ...q, ...patch } : q)) });

  const submitQuote = guard((q) => {
    if (!q.rfqDate) { alert("RFQ received date is mandatory before a quote can be submitted."); return; }
    const term = q.paymentTerms || "Cash on Order";
    const chain = chainForQuote(Number(q.discountPct) || 0, term, thresholds, termsMatrix);
    if (chain.length === 0) {
      updateQuote(q.id, { status: "Approved", chain: [], approvals: [{ role: "Auto", decision: "Approved", byName: "System", date: today(), comment: `Discount ${q.discountPct}% within standard discretion (≤${thresholds.ad}%) and terms "${term}" require no approval.` }] });
    } else {
      updateQuote(q.id, { status: "Pending Approval", chain, approvals: [] });
      notifyApprover(chain[0], q);
    }
  });

  const decideQuote = (q, decision) => {
    if (pendingRoleOf(q) !== me.role) return;
    let comment = "";
    if (decision === "Rejected") comment = window.prompt("Reason for rejection (shared with the owner):", "") || "";
    const approvals = [...q.approvals, { role: me.role, decision, byName: me.name, date: today(), comment }];
    if (decision === "Rejected") {
      updateQuote(q.id, { approvals, status: "Rejected" });
    } else {
      const approvedCount = approvals.filter((a) => a.decision === "Approved").length;
      const stillPending = approvedCount < q.chain.length;
      updateQuote(q.id, { approvals, status: stillPending ? "Pending Approval" : "Approved" });
      if (stillPending) notifyApprover(q.chain[approvedCount], { ...q, approvals });
    }
  };

  /* Oracle-style CRM<->CPQ sync: quote status drives the linked opportunity and order hand-off */
  const setQuoteStatus = (qid, status) => {
    if (!canEdit) return;
    const q = quotes.find((x) => x.id === qid);
    if (!q) return;
    let next = { ...data, quotes: quotes.map((x) => (x.id === qid ? { ...x, status, sentAt: status === "Sent" ? today() : x.sentAt } : x)) };
    if (q.oppId) {
      next = {
        ...next,
        deals: next.deals.map((d) => {
          if (d.id !== q.oppId) return d;
          if (status === "Sent" && STAGES.indexOf(d.stage) < STAGES.indexOf("Quote / RFQ")) {
            return { ...d, stage: "Quote / RFQ", prob: settings.stageProb?.["Quote / RFQ"] ?? STAGE_PROB["Quote / RFQ"], forecastCat: STAGE_FCAT["Quote / RFQ"] };
          }
          if (status === "Accepted") {
            const byLine = {};
            (q.lines || []).forEach((l) => {
              const item = catalog.find((p) => p.id === l.itemId);
              const pl = item?.productLine || "Oshino Lamps";
              byLine[pl] = (byLine[pl] || 0) + (Number(l.qty) || 0) * (Number(l.unitPrice) || 0) * (1 - (Number(q.discountPct) || 0) / 100);
            });
            return { ...d, stage: "Won", prob: 100, forecastCat: "Closed", closedAt: today(), lines: Object.entries(byLine).map(([product, value]) => ({ product, value: Math.round(value) })) };
          }
          return d;
        }),
      };
    }
    if (status === "Accepted") {
      next = { ...next, activities: [...next.activities, { id: uid(), text: `Raise sales order for ${q.number} — ${acct(q.accountId)?.name || ""} (order-to-cash hand-off)`, accountId: q.accountId, due: today(), done: false }] };
    }
    persist(next);
  };

  const signOut = () => persist({ ...data, settings: { ...settings, currentUserId: "" } });
  const resetAll = async () => {
    if (!isAdmin) return;
    if (!window.confirm("Reset the CRM to the starter dataset? All changes will be lost.")) return;
    await persist(SEED);
  };

  const tabs = [
    ["dashboard", "Dashboard", LayoutDashboard],
    ["leads", "Leads", UserPlus],
    ["pipeline", "Opportunities", Target],
    ["quotes", `Quotes${myApprovalQueue.length ? ` (${myApprovalQueue.length})` : ""}`, FileText],
    ["products", "Products", Package],
    ["accounts", "Accounts", Building2],
    ["contacts", "Contacts", Users],
    ["actions", "Actions", CheckSquare],
    ["forecast", "Forecast", TrendingUp],
    ["insights", "Insights", BarChart3],
    ["commissions", "Commissions", DollarSign],
    ["a360", "Aircraft 360", Radar],
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", background: C.bg, minHeight: "100vh", color: C.ink }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; width: 100%; max-width: 100vw; overflow-x: hidden; -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
        #root { width: 100%; max-width: 100vw; overflow-x: hidden; }
        img, svg { max-width: 100%; }
        input, select, textarea, button { max-width: 100%; font-family: inherit; }
        select:focus, input:focus, textarea:focus, button:focus-visible { outline: 2px solid ${C.blue}; outline-offset: 1px; }
        table { border-collapse: collapse; width: 100%; }
        th { text-align: left; font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: ${C.sub}; padding: 8px 10px; border-bottom: 1px solid ${C.line}; white-space: nowrap; }
        td { padding: 10px; border-bottom: 1px solid ${C.line}; font-size: 14px; vertical-align: top; }
        select:disabled { opacity: 0.7; cursor: not-allowed; }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
        /* Prevent iOS Safari's auto-zoom when focusing a form field smaller than 16px */
        @media (max-width: 640px) {
          input, select, textarea { font-size: 16px !important; }
          .bai-header-title { font-size: 14px !important; }
          .bai-header-sub { display: none; }
          .bai-main { padding: 14px 10px 50px !important; }
          th, td { padding: 7px 8px !important; }
        }
      `}</style>

      <header style={{ background: C.blueDeep, color: "#fff", padding: "14px 20px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Plane size={22} style={{ transform: "rotate(-45deg)" }} />
            <div>
              <div className="bai-header-title" style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.02em" }}>BAI Africa CRM</div>
              <div className="bai-header-sub" style={{ fontSize: 11, opacity: 0.75, letterSpacing: "0.08em", textTransform: "uppercase" }}>Banner Aircraft International · Africa Area</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, flexWrap: "wrap" }}>
            <span style={{ opacity: 0.8 }}>{saveState}</span>
            {myApprovalQueue.length > 0 && (
              <button onClick={() => setTab("quotes")} style={{ background: C.amber, border: "none", color: "#fff", borderRadius: 4, padding: "6px 9px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
                {myApprovalQueue.length} awaiting your approval
              </button>
            )}
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", borderRadius: 4, padding: "5px 9px" }}>
              {canEdit ? null : <Eye size={12} />}
              <strong>{me.name}</strong>
              <Tag color={roleColorMap[me.role] || C.faint}>{me.role}</Tag>
            </span>
            {isBD ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, border: "1px solid rgba(255,255,255,0.35)", borderRadius: 4, padding: "5px 9px" }}>
                <Lock size={12} /> My accounts{me.region ? ` · ${me.region}` : ""}
              </span>
            ) : (
              <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} style={{ ...inputStyle, width: "auto", padding: "6px 8px", fontSize: 12 }}>
                <option>All</option>
                {REGIONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            )}
            {isAdmin && (
              <button onClick={() => setModal({ type: "team" })} title="Users & roles" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.35)", color: "#fff", borderRadius: 4, padding: "6px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                <Settings size={13} /> Users
              </button>
            )}
            {isAdmin && (
              <button onClick={resetAll} title="Reset to starter data" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.35)", color: "#fff", borderRadius: 4, padding: "6px 8px", cursor: "pointer", fontSize: 12 }}>
                <RotateCcw size={13} />
              </button>
            )}
            <button onClick={signOut} title="Switch user" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.35)", color: "#fff", borderRadius: 4, padding: "6px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
              <LogOut size={13} /> Switch
            </button>
          </div>
        </div>
      </header>

      {!canEdit && (
        <div style={{ background: C.amberBg, borderBottom: `1px solid ${C.line}`, padding: "8px 20px", fontSize: 12, color: C.amber, textAlign: "center", fontWeight: 600 }}>
          <Eye size={12} style={{ verticalAlign: "-2px", marginRight: 5 }} />
          View-only access — {me.role} can review all data{isApproverRole ? " and approve or reject quotes pending at their level" : ""}.
        </div>
      )}

      <nav style={{ background: C.surface, borderBottom: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", overflowX: "auto" }}>
          {tabs.map(([key, label, Icon]) => (
            <button key={key} onClick={() => setTab(key)} style={{ background: "none", border: "none", cursor: "pointer", padding: "12px 13px", fontSize: 13, fontWeight: 600, fontFamily: "inherit", color: tab === key ? C.blue : C.sub, borderBottom: tab === key ? `2px solid ${C.blue}` : "2px solid transparent", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
      </nav>

      <main className="bai-main" style={{ maxWidth: 1180, margin: "0 auto", padding: "20px 16px 60px", width: "100%" }}>
        {tab === "dashboard" && <Dashboard deals={vDeals} leads={vLeads} activities={vActivities} quotes={vQuotes} accounts={vAccounts} acct={acct} userById={userById} setTab={setTab} />}
        {tab === "leads" && <Leads leads={vLeads} acct={acct} canEdit={canEdit} setStatus={setLeadStatus} setRank={setLeadRank} convert={convertLead} onAdd={() => setModal({ type: "lead" })} onEdit={(l) => setModal({ type: "lead", item: l })} onDelete={(id) => remove("leads", id)} />}
        {tab === "pipeline" && <Pipeline deals={vDeals} quotes={quotes} acct={acct} userById={userById} canEdit={canEdit} isAdmin={isAdmin} canProcessPayouts={canProcessPayouts} toggleCollected={toggleCollected} onAgreement={(d) => setModal({ type: "agreement", dealId: d.id })} setStage={setStage} onAdd={() => setModal({ type: "deal" })} onEdit={(d) => setModal({ type: "deal", item: d })} onDelete={(id) => remove("deals", id)} onQuote={(d) => setModal({ type: "quote", preset: { accountId: d.accountId, oppId: d.id } })} />}
        {tab === "quotes" && <Quotes quotes={vQuotes} me={me} canEdit={canEdit} thresholds={thresholds} isAdmin={isAdmin} acct={acct} userById={userById} itemById={itemById} pendingRoleOf={pendingRoleOf} decideQuote={decideQuote} submitQuote={submitQuote} setQuoteStatus={setQuoteStatus} termsMatrix={termsMatrix} onTermsMatrix={(m) => isAdmin && persist({ ...data, settings: { ...settings, termsMatrix: m } })} onAdd={() => setModal({ type: "quote" })} onEdit={(q) => setModal({ type: "quote", item: q })} onDelete={(id) => remove("quotes", id)} updateQuote={updateQuote} onThresholds={(th) => isAdmin && persist({ ...data, settings: { ...settings, thresholds: th } })} />}
        {tab === "products" && <Products catalog={catalog} isAdmin={canEditCatalog} onAdd={() => setModal({ type: "product" })} onEdit={(p) => setModal({ type: "product", item: p })} onDelete={(id) => remove("catalog", id)} />}
        {tab === "accounts" && <Accounts accounts={vAccounts} deals={deals} interactions={interactions} userById={userById} canEdit={canEdit} isAdmin={isAdmin} onAdd={() => setModal({ type: "account" })} onEdit={(a) => setModal({ type: "account", item: a })} onDelete={(id) => remove("accounts", id)} onLog={(a) => setModal({ type: "interaction", account: a })} onReg={(a) => setModal({ type: "reg", account: a })} />}
        {tab === "contacts" && <Contacts contacts={vContacts} acct={acct} canEdit={canEdit} onAdd={() => setModal({ type: "contact" })} onEdit={(c) => setModal({ type: "contact", item: c })} onDelete={(id) => remove("contacts", id)} />}
        {tab === "actions" && <Actions activities={vActivities} acct={acct} canEdit={canEdit} toggle={toggleTask} onAdd={() => setModal({ type: "activity" })} onDelete={(id) => remove("activities", id)} />}
        {tab === "forecast" && <Forecast deals={vDeals} accounts={vAccounts} settings={settings} isAdmin={isAdmin} userById={userById} users={users} isBD={isBD} me={me} onQuota={(q) => isAdmin && persist({ ...data, settings: { ...settings, monthlyQuota: q } })} onStageProb={(sp) => isAdmin && persist({ ...data, settings: { ...settings, stageProb: sp } })} onQuotaPlan={(annualTarget, repQuotas) => isAdmin && persist({ ...data, settings: { ...settings, annualTarget, repQuotas } })} />}
        {tab === "insights" && <Insights deals={vDeals} accounts={vAccounts} quotes={vQuotes} catalog={catalog} acct={acct} userById={userById} users={users} me={me} isBD={isBD} isAdmin={isAdmin} roleOf={roleOf} payouts={payouts} />}
        {tab === "commissions" && <Commissions deals={deals} users={users} me={me} isBD={isBD} isAdmin={isAdmin} canProcessPayouts={canProcessPayouts} payouts={payouts} roleOf={roleOf} onRecordPayout={(owner, defaultAmount) => setModal({ type: "payout", owner, defaultAmount })} />}
        {tab === "a360" && <Aircraft360 accounts={vAccounts} allAccounts={accounts} aircraft={vAircraft} aogCases={vAog} catalog={catalog} deals={vDeals} acct={acct} userById={userById} canEdit={canEdit} isAdmin={isAdmin} isBD={isBD} industryContacts={industryContacts} onAddAircraft={(preset) => setModal({ type: "aircraft", preset })} onEditAircraft={(x) => setModal({ type: "aircraft", item: x })} onDeleteAircraft={(id) => remove("aircraft", id)} onAddAog={() => setModal({ type: "aog" })} onEditAog={(x) => setModal({ type: "aog", item: x })} onDeleteAog={(id) => remove("aogCases", id)} setAogStatus={(id, status) => canEdit && persist({ ...data, aogCases: aogCases.map((c) => (c.id === id ? { ...c, status, closedAt: status === "Closed" ? today() : "" } : c)) })} onAddIndustry={() => setModal({ type: "industryContact" })} onEditIndustry={(x) => setModal({ type: "industryContact", item: x })} onDeleteIndustry={(id) => remove("industryContacts", id)} />}
      </main>

      {canEdit && modal?.type === "deal" && <DealForm item={modal.item} accounts={isBD ? accounts.filter((a) => a.ownerId === me.id) : accounts} owners={owners} me={me} lockOwner={isBD} roleOf={roleOf} stageProb={settings.stageProb} onSave={(d) => upsert("deals", d)} onClose={() => setModal(null)} />}
      {canEdit && modal?.type === "quote" && <QuoteForm item={modal.item} preset={modal.preset} accounts={isBD ? accounts.filter((a) => a.ownerId === me.id) : accounts} deals={deals} contacts={contacts} quotes={quotes} catalog={catalog} me={me} thresholds={thresholds} termsMatrix={termsMatrix} quoteCount={quotes.length} onSave={(q) => upsert("quotes", q)} onClose={() => setModal(null)} />}
      {canEditCatalog && modal?.type === "product" && <ProductForm item={modal.item} onSave={(p) => upsert("catalog", p)} onClose={() => setModal(null)} />}
      {(isAdmin || (canEdit && modal?.item)) && modal?.type === "account" && <AccountForm item={modal.item} owners={owners} me={me} lockOwner={isBD} onSave={(a) => upsert("accounts", a)} onClose={() => setModal(null)} />}
      {canEdit && modal?.type === "contact" && <ContactForm item={modal.item} accounts={isBD ? accounts.filter((a) => a.ownerId === me.id) : accounts} onSave={(c) => upsert("contacts", c)} onClose={() => setModal(null)} />}
      {canEdit && modal?.type === "activity" && <ActivityForm accounts={isBD ? accounts.filter((a) => a.ownerId === me.id) : accounts} onSave={(t) => upsert("activities", t)} onClose={() => setModal(null)} />}
      {canEdit && modal?.type === "lead" && <LeadForm item={modal.item} accounts={isBD ? accounts.filter((a) => a.ownerId === me.id) : accounts} contacts={contacts} onSave={(l) => upsert("leads", { ...l, ownerId: l.ownerId || me.id })} onClose={() => setModal(null)} />}
      {canEdit && modal?.type === "interaction" && <InteractionForm account={modal.account} onSave={(i) => upsert("interactions", i)} onClose={() => setModal(null)} />}
      {canEdit && modal?.type === "aircraft" && <AircraftForm item={modal.item} preset={modal.preset} accounts={isBD ? accounts.filter((a) => a.ownerId === me.id) : accounts} onSave={(x) => upsert("aircraft", x)} onClose={() => setModal(null)} />}
      {canEdit && modal?.type === "aog" && <AogForm item={modal.item} accounts={isBD ? accounts.filter((a) => a.ownerId === me.id) : accounts} me={me} onSave={(x) => upsert("aogCases", x)} onClose={() => setModal(null)} />}
      {isAdmin && modal?.type === "industryContact" && <IndustryContactForm item={modal.item} onSave={(x) => upsert("industryContacts", x)} onClose={() => setModal(null)} />}
      {canEdit && modal?.type === "meetingNote" && <MeetingNoteForm onSave={(note) => { persist({ ...data, deals: deals.map((d) => (d.id === modal.dealId ? { ...d, meetingNotes: [...(d.meetingNotes || []), note] } : d)) }); setModal(null); }} onClose={() => setModal(null)} />}
      {isAdmin && modal?.type === "agreement" && <AgreementForm deal={deals.find((d) => d.id === modal.dealId)} bds={users.filter((u) => u.role === "Territory Manager (BD)")} onSave={(agr) => { setAgreement(modal.dealId, agr); setModal(null); }} onClose={() => setModal(null)} />}
      {canProcessPayouts && modal?.type === "payout" && <PayoutForm owner={modal.owner} defaultAmount={modal.defaultAmount} onSave={(p) => { recordPayout(p); setModal(null); }} onClose={() => setModal(null)} />}
      {canEdit && modal?.type === "lostReason" && <LostReasonForm onSave={(reason, note) => { persist({ ...data, deals: deals.map((d) => (d.id === modal.dealId ? { ...d, lossReason: reason, lossNote: note } : d)) }); setModal(null); }} onClose={() => setModal(null)} />}
      {canEdit && modal?.type === "reg" && <RegForm account={modal.account} onSave={(reg) => upsert("accounts", { ...modal.account, reg })} onClose={() => setModal(null)} />}
      {isAdmin && modal?.type === "team" && <UsersForm users={users} onSave={(newUsers) => { persist({ ...data, users: newUsers }); setModal(null); }} onClose={() => setModal(null)} />}
    </div>
  );
}

/* ---------------------------- Dashboard ---------------------------- */

function Dashboard({ deals, leads, activities, quotes, accounts, acct, userById, setTab }) {
  const open = deals.filter((d) => d.stage !== "Won" && d.stage !== "Lost");
  const won = deals.filter((d) => d.stage === "Won");
  const totals = {
    open: open.reduce((s, d) => s + dealValue(d), 0),
    weighted: open.reduce((s, d) => s + dealWeighted(d), 0),
    forecastCat: open.filter((d) => d.forecastCat === "Forecast").reduce((s, d) => s + dealValue(d), 0),
    commMatured: won.filter((d) => d.collectedAt).reduce((s, d) => s + dealCommission(d, userById ? userById(d.ownerId)?.role : undefined), 0),
    commPending: won.filter((d) => !d.collectedAt).reduce((s, d) => s + dealCommission(d, userById ? userById(d.ownerId)?.role : undefined), 0),
  };
  const pendingQuotes = quotes.filter((q) => q.status === "Pending Approval");
  const openLeads = leads.filter((l) => l.status !== "Converted" && l.status !== "Retired");
  const overdue = activities.filter((t) => !t.done && t.due && t.due < today());
  const nextActions = activities.filter((t) => !t.done).sort((a, b) => (a.due || "9999").localeCompare(b.due || "9999")).slice(0, 5);

  const stageAgg = STAGES.filter((s) => s !== "Lost").map((s) => {
    const list = deals.filter((d) => d.stage === s);
    return { stage: s, count: list.length, value: list.reduce((sum, d) => sum + dealValue(d), 0) };
  });
  const maxVal = Math.max(...stageAgg.map((s) => s.value), 1);

  const kpi = (label, value, note, color, onClick) => (
    <Card style={{ padding: "14px 16px", flex: "1 1 180px", cursor: onClick ? "pointer" : "default" }}>
      <div onClick={onClick}>
        <div style={{ fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", color: C.sub, marginBottom: 6 }}>{label}</div>
        <div style={{ fontSize: 23, fontWeight: 700, color: color || C.ink, fontVariantNumeric: "tabular-nums" }}>{value}</div>
        {note && <div style={{ fontSize: 12, color: C.faint, marginTop: 2 }}>{note}</div>}
      </div>
    </Card>
  );

  return (
    <div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        {kpi("Open pipeline", fmt(totals.open), `${open.length} opportunities · ${openLeads.length} open leads`)}
        {kpi("Weighted pipeline", fmt(totals.weighted), "By win probability")}
        {kpi("Quotes in approval", pendingQuotes.length, pendingQuotes.length ? fmt(pendingQuotes.reduce((s, q) => s + quoteNet(q), 0)) + " net value" : "None pending", C.amber, () => setTab("quotes"))}
        {kpi("Matured commission", fmt(totals.commMatured), totals.commPending > 0 ? `${fmt(totals.commPending)} accrued, awaiting collection` : "Matures upon collection", C.green)}
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
        <Card style={{ padding: 16, flex: "2 1 380px" }}>
          <SectionTitle>Pipeline by stage</SectionTitle>
          {stageAgg.map((s) => (
            <div key={s.stage} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 100, fontSize: 12, color: C.sub, flexShrink: 0 }}>{s.stage}</div>
              <div style={{ flex: 1, background: C.bg, borderRadius: 3, height: 20 }}>
                <div style={{ width: `${(s.value / maxVal) * 100}%`, minWidth: s.value > 0 ? 4 : 0, height: "100%", background: stageColor[s.stage], borderRadius: 3, transition: "width .3s" }} />
              </div>
              <div style={{ width: 115, fontSize: 12, textAlign: "right", fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
                {s.count > 0 ? `${fmt(s.value)} · ${s.count}` : "—"}
              </div>
            </div>
          ))}
        </Card>

        <Card style={{ padding: 16, flex: "1 1 280px" }}>
          <SectionTitle right={overdue.length > 0 && <span style={{ fontSize: 12, color: C.red, fontWeight: 600 }}>{overdue.length} overdue</span>}>Next actions</SectionTitle>
          {nextActions.length === 0 && <div style={{ fontSize: 13, color: C.faint }}>No open actions.</div>}
          {nextActions.map((t) => (
            <div key={t.id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${C.bg}` }}>
              <div style={{ fontSize: 13 }}>{t.text}</div>
              <div style={{ fontSize: 11, color: t.due && t.due < today() ? C.red : C.faint, marginTop: 2 }}>
                {t.due ? `Due ${t.due}` : "No date"}{t.accountId && acct(t.accountId) ? ` · ${acct(t.accountId).name}` : ""}
              </div>
            </div>
          ))}
          <button onClick={() => setTab("actions")} style={{ background: "none", border: "none", color: C.blue, fontSize: 12, fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "inherit" }}>View all actions →</button>
        </Card>
      </div>

      {/* Radar: hygiene, registrations, reorders */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 16 }}>
        <Card style={{ padding: 16, flex: "1 1 260px" }}>
          <SectionTitle><span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><AlertTriangle size={13} color={C.red} /> Stale deals ({">"}{STALE_DAYS}d)</span></SectionTitle>
          {(() => {
            const stale = open.filter((d) => d.lastTouch && daysBetween(d.lastTouch, today()) > STALE_DAYS).sort((a, b) => daysBetween(b.lastTouch, today()) - daysBetween(a.lastTouch, today())).slice(0, 5);
            if (stale.length === 0) return <div style={{ fontSize: 13, color: C.green, fontWeight: 600 }}>Pipeline is clean — every open deal touched inside {STALE_DAYS} days.</div>;
            return stale.map((d) => (
              <div key={d.id} style={{ fontSize: 12, marginBottom: 7 }}>
                <strong>{d.name}</strong> — {acct(d.accountId)?.name}
                <div style={{ fontSize: 11, color: C.red }}>{daysBetween(d.lastTouch, today())} days idle · {fmt(dealValue(d))}</div>
              </div>
            ));
          })()}
        </Card>
        <Card style={{ padding: 16, flex: "1 1 260px" }}>
          <SectionTitle><span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><ShieldCheck size={13} color={C.red} /> Collections overdue</span></SectionTitle>
          {(() => {
            const overdue = won.filter((d) => !d.collectedAt).map((d) => {
              const linkedQ = quotes.find((q) => q.oppId === d.id && q.status === "Accepted");
              const expected = expectedCollectionDate(d, linkedQ);
              return { d, expected, days: expected ? daysBetween(expected, today()) : -1 };
            }).filter((x) => x.days > 0).sort((a, b) => b.days - a.days);
            if (overdue.length === 0) return <div style={{ fontSize: 13, color: C.green, fontWeight: 600 }}>No overdue collections.</div>;
            return overdue.slice(0, 5).map(({ d, days }) => (
              <div key={d.id} style={{ fontSize: 12, marginBottom: 7 }}>
                <strong>{acct(d.accountId)?.name}</strong> — {d.name}
                <div style={{ fontSize: 11, color: C.red }}>{days}d overdue · {fmt(dealValue(d))} · {userById ? userById(d.ownerId)?.name : ""}</div>
              </div>
            ));
          })()}
        </Card>
        <Card style={{ padding: 16, flex: "1 1 260px" }}>
          <SectionTitle><span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><ClipboardCheck size={13} color={C.amber} /> Vendor registrations</span></SectionTitle>
          {(() => {
            const regs = accounts.filter((a) => a.reg && !["Not started", "PVL awarded"].includes(a.reg.status));
            const awarded = accounts.filter((a) => a.reg?.status === "PVL awarded").length;
            if (regs.length === 0) return <div style={{ fontSize: 13, color: C.faint }}>No registrations in progress.{awarded ? ` ${awarded} awarded.` : ""}</div>;
            return regs.slice(0, 5).map((a) => (
              <div key={a.id} style={{ fontSize: 12, marginBottom: 7 }}>
                <strong>{a.name}</strong> <Tag color={regColor[a.reg.status]}>{a.reg.status}</Tag>
                <div style={{ fontSize: 11, color: C.faint }}>{a.reg.expected ? `Expected award: ${a.reg.expected}` : "No target date set"}</div>
              </div>
            ));
          })()}
        </Card>
        <Card style={{ padding: 16, flex: "1 1 260px" }}>
          <SectionTitle><span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><RefreshCw size={13} color={C.teal} /> Reorder radar</span></SectionTitle>
          {(() => {
            const suggestions = [];
            accounts.forEach((a) => {
              REORDER_LINES.forEach((line) => {
                const wonDates = deals.filter((d) => d.accountId === a.id && d.stage === "Won" && d.closedAt && (d.lines || []).some((l) => l.product === line)).map((d) => d.closedAt).sort();
                if (wonDates.length) {
                  const last = wonDates[wonDates.length - 1];
                  const days = daysBetween(last, today());
                  if (days > REORDER_DAYS) suggestions.push({ a, line, days });
                }
              });
            });
            suggestions.sort((x, y) => y.days - x.days);
            if (suggestions.length === 0) return <div style={{ fontSize: 13, color: C.faint }}>Populates as consumable orders close Won — flags accounts {">"}6 months since their last lamp, belt or ULB order.</div>;
            return suggestions.slice(0, 5).map((s, i) => (
              <div key={i} style={{ fontSize: 12, marginBottom: 7 }}>
                <strong>{s.a.name}</strong> — {PRODUCTS[s.line]?.short}
                <div style={{ fontSize: 11, color: C.teal }}>Last order {Math.round(s.days / 30)} months ago — time to call.</div>
              </div>
            ));
          })()}
        </Card>
      </div>

      <div style={{ marginTop: 16, background: C.amberBg, border: `1px solid ${C.line}`, borderRadius: 6, padding: "12px 16px", fontSize: 13 }}>
        <strong style={{ color: C.amber }}>On the calendar:</strong>&nbsp; Aviation Africa Summit — Nairobi, September 2026 · AFRAA 58th AGA — Libreville, November 2026
      </div>
    </div>
  );
}

/* ------------------------------ Quotes ----------------------------- */

function Quotes({ quotes, me, canEdit, thresholds, isAdmin, acct, userById, itemById, pendingRoleOf, decideQuote, submitQuote, setQuoteStatus, termsMatrix, onTermsMatrix, onAdd, onEdit, onDelete, updateQuote, onThresholds }) {
  const [docQ, setDocQ] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [showTh, setShowTh] = useState(false);
  const [thDraft, setThDraft] = useState(thresholds);
  const [tmDraft, setTmDraft] = useState(termsMatrix);

  const mine = quotes.filter((q) => pendingRoleOf(q) === me.role);
  const rest = quotes.filter((q) => pendingRoleOf(q) !== me.role);
  const ordered = [...mine, ...rest];

  const chainDisplay = (q) => {
    const approvedRoles = q.approvals.filter((a) => a.decision === "Approved").map((a) => a.role);
    const rejected = q.approvals.find((a) => a.decision === "Rejected");
    return (
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
        {q.chain.length === 0 && <span style={{ fontSize: 11, color: C.faint }}>Auto (within discretion)</span>}
        {q.chain.map((role, i) => {
          const done = approvedRoles.includes(role);
          const isRejected = rejected?.role === role;
          const isPending = q.status === "Pending Approval" && pendingRoleOf(q) === role;
          const bg = isRejected ? C.red : done ? C.green : isPending ? C.amber : C.faint;
          return (
            <span key={role} style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
              {i > 0 && <span style={{ color: C.faint, fontSize: 10 }}>→</span>}
              <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: bg, borderRadius: 3, padding: "2px 6px", whiteSpace: "nowrap" }}>
                {done && <Check size={9} style={{ verticalAlign: "-1px", marginRight: 2 }} />}{role === "Territory Manager (BD)" ? "BD" : role}
              </span>
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: C.sub }}>
          Approvals: discount ≤{thresholds.ad}% auto · &gt;{thresholds.ad}% AD · &gt;{thresholds.coo}% +COO · &gt;{thresholds.ceo}% +CEO · &gt;{thresholds.president}% +President. Payment terms escalate separately (credit = risk) — the deeper requirement sets the chain.
          {isAdmin && <button onClick={() => { setThDraft(thresholds); setTmDraft(termsMatrix); setShowTh(!showTh); }} style={{ background: "none", border: "none", color: C.blue, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginLeft: 6 }}>{showTh ? "Hide" : "Edit thresholds"}</button>}
        </div>
        {canEdit && <Btn onClick={onAdd}><Plus size={14} /> New quote</Btn>}
      </div>

      {isAdmin && showTh && (
        <Card style={{ padding: 14, marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            {APPROVAL_LEVELS.map((l) => (
              <Field key={l.key} label={`${l.role} above (%)`}>
                <input type="number" min="0" max="100" style={{ ...inputStyle, width: 90 }} value={thDraft[l.key]} onChange={(e) => setThDraft({ ...thDraft, [l.key]: Number(e.target.value) })} />
              </Field>
            ))}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.sub, margin: "6px 0" }}>Payment terms approval matrix</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            {PAYMENT_TERMS.map((t) => (
              <Field key={t} label={t}>
                <select style={{ ...inputStyle, width: 150 }} value={tmDraft[t] || "None (auto)"} onChange={(e) => setTmDraft({ ...tmDraft, [t]: e.target.value })}>
                  {TERMS_LEVEL_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
            ))}
            <div style={{ marginBottom: 12 }}><Btn small onClick={() => { onThresholds(thDraft); onTermsMatrix(tmDraft); setShowTh(false); }}>Save matrix</Btn></div>
          </div>
          <div style={{ fontSize: 11, color: C.faint }}>Applies to newly submitted quotes. The chain runs sequentially to the deepest level required by either the discount or the payment terms.</div>
        </Card>
      )}

      {mine.length > 0 && (
        <div style={{ background: C.amberBg, border: `1px solid ${C.line}`, borderRadius: 6, padding: "10px 14px", marginBottom: 14, fontSize: 13, fontWeight: 600, color: C.amber }}>
          {mine.length} quote{mine.length > 1 ? "s" : ""} awaiting your approval as {me.role} — shown first below.
        </div>
      )}

      <Card style={{ overflowX: "auto" }}>
        <table>
          <thead><tr><th></th><th>Quote</th><th>Account</th><th>Owner</th><th>List value</th><th>Discount</th><th>Net value</th><th>Terms</th><th>Approval chain</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {ordered.length === 0 && <tr><td colSpan={11} style={{ color: C.faint, textAlign: "center", padding: 24 }}>No quotes in view. Build one from the catalog.</td></tr>}
            {ordered.map((q) => {
              const sub = quoteSubtotal(q);
              const net = quoteNet(q);
              const isExp = expanded === q.id;
              const myTurn = pendingRoleOf(q) === me.role;
              const isOwnerish = canEdit;
              return (
                <React.Fragment key={q.id}>
                  <tr style={myTurn ? { background: C.amberBg } : undefined}>
                    <td style={{ width: 30 }}>
                      <IconBtn onClick={() => setExpanded(isExp ? null : q.id)}>{isExp ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</IconBtn>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{q.number}</div>
                      <div style={{ fontSize: 11, color: C.faint }}>{q.createdAt}</div>
                      {q.rfqDate && q.sentAt && <div style={{ fontSize: 10, color: daysBetween(q.rfqDate, q.sentAt) <= 2 ? C.green : C.amber, fontWeight: 700 }}>RFQ→quote: {daysBetween(q.rfqDate, q.sentAt)}d</div>}
                      {q.rfqDate && !q.sentAt && q.status !== "Accepted" && q.status !== "Declined" && <div style={{ fontSize: 10, color: daysBetween(q.rfqDate, today()) > 3 ? C.red : C.faint }}>RFQ open {daysBetween(q.rfqDate, today())}d</div>}
                    </td>
                    <td>{acct(q.accountId)?.name || "—"}</td>
                    <td style={{ fontSize: 13 }}>{userById(q.ownerId)?.name || "—"}</td>
                    <td style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(sub)}</td>
                    <td style={{ fontVariantNumeric: "tabular-nums", fontWeight: 700, color: q.discountPct > thresholds.ad ? C.amber : C.ink }}>{q.discountPct}%</td>
                    <td style={{ fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>{fmt(net)}</td>
                    <td style={{ fontSize: 12, color: (q.paymentTerms || "").startsWith("Net") ? C.amber : C.sub, fontWeight: 600, whiteSpace: "nowrap" }}>{q.paymentTerms || "Cash on Order"}</td>
                    <td>{chainDisplay(q)}</td>
                    <td><Tag color={quoteStatusColor[q.status]}>{q.status}</Tag></td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {myTurn && (
                        <>
                          <Btn small kind="green" onClick={() => decideQuote(q, "Approved")}><Check size={12} /> Approve</Btn>{" "}
                          <Btn small kind="danger" onClick={() => decideQuote(q, "Rejected")}>Reject</Btn>
                        </>
                      )}
                      {isOwnerish && q.status === "Draft" && (
                        <>
                          <Btn small onClick={() => submitQuote(q)}><Send size={12} /> Submit</Btn>{" "}
                          <IconBtn onClick={() => onEdit(q)}><Pencil size={14} /></IconBtn>
                          <IconBtn onClick={() => onDelete(q.id)} color={C.red}><Trash2 size={14} /></IconBtn>
                        </>
                      )}
                      {isOwnerish && q.status === "Rejected" && (
                        <Btn small kind="ghost" onClick={() => updateQuote(q.id, { status: "Draft", chain: [], approvals: [] })}>Revise</Btn>
                      )}
                      {isOwnerish && q.status === "Approved" && (
                        <Btn small onClick={() => setQuoteStatus(q.id, "Sent")}><Send size={12} /> Mark sent</Btn>
                      )}
                      {isOwnerish && q.status === "Sent" && (
                        <>
                          <Btn small kind="green" onClick={() => setQuoteStatus(q.id, "Accepted")}>Accepted</Btn>{" "}
                          <Btn small kind="danger" onClick={() => setQuoteStatus(q.id, "Declined")}>Declined</Btn>
                        </>
                      )}
                      {["Approved", "Sent", "Accepted"].includes(q.status) && (
                        <IconBtn title="Quote document" onClick={() => setDocQ(q)} color={C.blue}><Copy size={14} /></IconBtn>
                      )}
                    </td>
                  </tr>
                  {isExp && (
                    <tr>
                      <td colSpan={11} style={{ background: C.bg }}>
                        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", padding: "4px 6px" }}>
                          <div style={{ flex: "2 1 320px" }}>
                            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.sub, marginBottom: 6 }}>Line items</div>
                            {(q.lines || []).map((l, i) => {
                              const item = itemById(l.itemId);
                              return (
                                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4, gap: 10 }}>
                                  <span>{item?.name || "Unknown item"} <span style={{ color: C.faint, fontSize: 11 }}>({item?.productLine ? PRODUCTS[item.productLine]?.short : "—"})</span></span>
                                  <span style={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{l.qty} × {fmt2(l.unitPrice)} = <strong>{fmt(l.qty * l.unitPrice)}</strong></span>
                                </div>
                              );
                            })}
                            <div style={{ borderTop: `1px solid ${C.line}`, marginTop: 6, paddingTop: 6, fontSize: 13, display: "flex", justifyContent: "space-between" }}>
                              <span>Subtotal {fmt(sub)} · Discount −{fmt(sub - net)} ({q.discountPct}%)</span>
                              <strong>Net {fmt(net)}</strong>
                            </div>
                            <div style={{ fontSize: 12, color: C.teal, marginTop: 4 }}>Commission on net: {fmt(quoteCommission(q, itemById))}</div>
                            {q.notes && <div style={{ fontSize: 12, color: C.sub, marginTop: 6 }}>{q.notes}</div>}
                          </div>
                          <div style={{ flex: "1 1 240px" }}>
                            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.sub, marginBottom: 6 }}>Approval log</div>
                            {q.approvals.length === 0 && <div style={{ fontSize: 12, color: C.faint }}>No decisions yet.</div>}
                            {q.approvals.map((a, i) => (
                              <div key={i} style={{ fontSize: 12, marginBottom: 6 }}>
                                <strong style={{ color: a.decision === "Approved" ? C.green : C.red }}>{a.decision}</strong> — {a.role} ({a.byName}), {a.date}
                                {a.comment && <div style={{ color: C.sub, marginTop: 1 }}>"{a.comment}"</div>}
                              </div>
                            ))}
                            {q.status === "Pending Approval" && <div style={{ fontSize: 12, color: C.amber, fontWeight: 600 }}>Awaiting: {pendingRoleOf(q)}</div>}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </Card>

      {docQ && (
        <QuoteDocModal q={docQ} acct={acct} userById={userById} itemById={itemById} onClose={() => setDocQ(null)} />
      )}
    </div>
  );
}

/* ------------------- native PDF generation (no libs) ---------------- */

const PDF_REPL = { "\u2014": "-", "\u2013": "-", "\u00B7": "|", "\u2022": "*", "\u2248": "~", "\u20AC": "EUR ", "\u2192": "->", "\u00D7": "x", "\u2264": "<=", "\u2265": ">=", "\u2019": "'", "\u2018": "'", "\u201C": '"', "\u201D": '"', "\u00A0": " ", "\u00E9": "e", "\u00E8": "e", "\u00C9": "E" };
const pdfAscii = (s) => String(s ?? "").split("").map((ch) => (ch.charCodeAt(0) < 127 ? ch : (PDF_REPL[ch] ?? "?"))).join("");
const pdfEsc = (s) => pdfAscii(s).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
const pdfWrap = (s, max) => {
  const words = pdfAscii(s).split(" ");
  const out = []; let cur = "";
  words.forEach((w) => { if ((cur + " " + w).trim().length > max) { if (cur.trim()) out.push(cur.trim()); cur = w; } else cur += " " + w; });
  if (cur.trim()) out.push(cur.trim());
  return out.length ? out : [""];
};

/* Aviation-industry standard terms & conditions of sale */
const quoteTerms = (term, incoterm) => [
  `1. VALIDITY: This quotation is valid for 30 days from date of issue. All offers are subject to prior sale and stock availability at time of order.`,
  `2. PRICES: All prices are in US Dollars, exclusive of taxes, duties, bank charges and freight unless otherwise stated.`,
  `3. DELIVERY: ${incoterm}, Incoterms 2020. Quoted lead times are estimates from receipt of purchase order and are not guaranteed.`,
  `4. PAYMENT: ${term}. Overdue balances may accrue interest at 1.5% per month or the maximum permitted by law.`,
  `5. CERTIFICATION & TRACEABILITY: Material is supplied with FAA 8130-3, EASA Form 1, or Certificate of Conformance as applicable, with full back-to-birth or last-operator trace where stated.`,
  `6. WARRANTY: Manufacturer's warranty is passed through to Buyer (Anjou Aeronautique products: 36 months). Repaired units are warranted per the repair station's teardown report.`,
  `7. RETURNS: No returns accepted without prior written RMA authorization. Returned material must be in original condition with certification intact; a restocking fee may apply.`,
  `8. EXPORT CONTROL: Sale is subject to U.S. Export Administration Regulations (EAR) and, where applicable, ITAR. Buyer is responsible for end-use and end-user compliance and shall not re-export contrary to U.S. law.`,
  `9. AOG SUPPORT: 24/7/365 AOG desk — sales@banner.aero / +1 (855) 822-6637.`,
  `10. GOVERNING LAW: This quotation and any resulting order are governed by the laws of the State of Florida, USA. Banner Aircraft International standard conditions of sale apply.`,
];

function buildQuotePdf({ q, a, owner, itemById, sub, net, term, validUntil }) {
  const PW = 612, PH = 792, MARGIN = 36, RIGHT = PW - MARGIN; // US Letter — unchanged from the original quote format
  const FOOTER_Y = 52, CONTENT_FLOOR = 66;
  const NAVY = "0.047 0.208 0.341", TEAL = "0.243 0.788 0.690", INK = "0.082 0.141 0.184", GRAY = "0.353 0.420 0.471", RED = "0.651 0.227 0.227", LINE = "0.855 0.886 0.914";
  const incoterm = q.incoterm || "EXW Hollywood, FL";

  const pages = [];
  let curOps = [];
  let y = PH;

  const R = (x, yy, w, h, c) => curOps.push(`${c} rg ${x} ${yy} ${w} ${h} re f`);
  const L = (x1, y1, x2, y2, c, wd = 0.8) => curOps.push(`${c} RG ${wd} w ${x1} ${y1} m ${x2} ${y2} l S`);
  const T = (x, yy, s, size, bold, c) => curOps.push(`BT /${bold ? "F2" : "F1"} ${size} Tf ${c} rg 1 0 0 1 ${x} ${yy} Tm (${pdfEsc(s)}) Tj ET`);
  const TR = (right, yy, s, size, bold, c) => T(right - pdfAscii(s).length * size * 0.5, yy, s, size, bold, c);

  const drawLineTableHeader = () => {
    T(MARGIN, y, "PART NUMBER", 6.5, true, GRAY); T(128, y, "DESCRIPTION", 6.5, true, GRAY);
    TR(352, y, "CD", 6.5, true, GRAY); TR(384, y, "QTY", 6.5, true, GRAY); TR(416, y, "UOM", 6.5, true, GRAY);
    TR(470, y, "LEAD TIME", 6.5, true, GRAY); TR(522, y, "UNIT USD", 6.5, true, GRAY); TR(RIGHT, y, "EXT USD", 6.5, true, GRAY);
    L(MARGIN, y - 4, RIGHT, y - 4, NAVY, 1.3); y -= 16;
  };

  const drawFullLetterhead = () => {
    y = PH;
    R(0, y - 66, PW, 66, NAVY);
    T(MARGIN, y - 28, "BANNER AIRCRAFT INTERNATIONAL", 14, true, "1 1 1");
    T(MARGIN, y - 43, "A I R W O R T H I N E S S   S U P P O R T   E X P E R T S", 6.5, false, TEAL);
    T(MARGIN, y - 55, "2252 Hayes St, Hollywood, FL 33020, USA | sales@banner.aero | +1 (855) 822-6637", 6.5, false, "0.75 0.83 0.89");
    TR(RIGHT, y - 30, "QUOTATION", 15, true, "1 1 1");
    TR(RIGHT, y - 45, q.number, 10, true, TEAL);
    TR(RIGHT, y - 57, `Date: ${q.createdAt}  Valid until: ${validUntil}`, 7, false, "0.75 0.83 0.89");
    y -= 88;

    const meta = [
      ["TO", `${a?.name || "-"}${a?.country ? ", " + a.country : ""}`],
      ["ATTENTION", q.attention || "-"],
      ["YOUR REF / RFQ", q.customerRef || "-"],
      ["DELIVERY", `${incoterm} (Incoterms 2020)`],
      ["PAYMENT TERMS", term],
      ["PREPARED BY", `${owner?.name || "-"}, Africa Area`],
    ];
    meta.forEach(([k, v]) => { T(MARGIN, y, k, 6.5, true, GRAY); T(130, y, v, 9, k === "TO", INK); y -= 13; });

    y -= 4;
    R(MARGIN, y - 5, 540, 15, "0.905 0.953 0.929");
    T(42, y - 1, "All material supplied with FAA 8130-3 / EASA Form 1 dual release or Certificate of Conformance as applicable, with full traceability.", 7, true, "0.145 0.431 0.306");
    y -= 24;
    drawLineTableHeader();
  };

  const drawContinuationHeader = () => {
    y = PH;
    R(0, y - 30, PW, 30, NAVY); y -= 14;
    T(MARGIN, y, `${q.number} - ${a?.name || ""} (continued)`, 9.5, true, "1 1 1");
    y -= 22;
    drawLineTableHeader();
  };

  const finalizePage = () => { pages.push(curOps); };
  const newPage = () => { finalizePage(); curOps = []; drawContinuationHeader(); };
  const ensureSpace = (needed) => { if (y - needed < CONTENT_FLOOR) newPage(); };

  drawFullLetterhead();

  (q.lines || []).forEach((l) => {
    const it = itemById(l.itemId);
    const descLines = pdfWrap(it?.name || "Item", 40);
    const rowHeight = Math.max(descLines.length * 9.5, 10) + 8;
    ensureSpace(rowHeight);
    T(MARGIN, y, it?.pn || "-", 7.5, true, INK);
    descLines.forEach((dl, di) => T(128, y - di * 9.5, dl, 8, false, INK));
    TR(352, y, l.cond || "NE", 8, false, INK);
    TR(384, y, String(l.qty), 8, false, INK);
    TR(416, y, it?.unit || "EA", 8, false, INK);
    TR(470, y, l.leadTime || it?.lead || "-", 7.5, false, INK);
    TR(522, y, fmt2(l.unitPrice).replace("$", ""), 8, false, INK);
    TR(RIGHT, y, fmt(l.qty * l.unitPrice).replace("$", ""), 8, true, INK);
    y -= rowHeight;
    L(MARGIN, y + 5, RIGHT, y + 5, LINE, 0.5);
  });

  // Totals + T&Cs travel together as one block, kept on the same page as a unit —
  // if there isn't room left, they start a fresh page rather than splitting awkwardly.
  const approvedBy = (q.approvals || []).filter((x) => x.decision === "Approved" && x.role !== "Auto");
  const tcWrapped = [];
  quoteTerms(term, incoterm).forEach((clause) => { pdfWrap(clause, 134).forEach((ln) => tcWrapped.push(ln)); });
  const authLine = approvedBy.length ? "Authorised: " + approvedBy.map((x) => `${x.byName} (${x.role}, ${x.date})`).join(" | ") : null;
  const totalsBlockHeight = 6 + 12 + 5 + 12 + 12 + 16; // subtotal, discount, rule, total, legend, spacing
  const tcBlockHeight = 14 + tcWrapped.length * 7.4 + (authLine ? 10 : 0);
  ensureSpace(totalsBlockHeight + tcBlockHeight);

  y -= 6;
  TR(500, y, "Subtotal", 8.5, false, GRAY); TR(RIGHT, y, fmt(sub).replace("$", ""), 8.5, false, INK); y -= 12;
  TR(500, y, `Discount (${q.discountPct}%)`, 8.5, false, GRAY); TR(RIGHT, y, "-" + fmt(sub - net).replace("$", ""), 8.5, false, RED); y -= 5;
  L(450, y, RIGHT, y, NAVY, 1.1); y -= 12;
  TR(500, y, "TOTAL (USD)", 10.5, true, INK); TR(RIGHT, y, fmt(net).replace("$", ""), 10.5, true, INK); y -= 12;
  T(MARGIN, y, pdfAscii(COND_LEGEND), 6, false, GRAY); y -= 16;

  // T&Cs — bottom-anchored on whichever page they land on, same as before
  const tcTop = Math.max(y, FOOTER_Y + 8 + tcBlockHeight);
  L(MARGIN, tcTop + 8, RIGHT, tcTop + 8, LINE, 0.6);
  T(MARGIN, tcTop, "TERMS AND CONDITIONS OF SALE", 6.8, true, NAVY);
  let yy = tcTop - 11;
  tcWrapped.forEach((ln) => { T(MARGIN, yy, ln, 6, false, GRAY); yy -= 7.4; });
  if (authLine) { yy -= 2; T(MARGIN, yy, authLine, 6, true, GRAY); }

  finalizePage();

  // ---- two-pass footer: only now do we know the total page count, so every
  // page gets an accurate "Page X of Y" rather than a hardcoded "Page 1 of 1". ----
  const numPages = pages.length;
  pages.forEach((ops, i) => {
    ops.push(`${LINE} RG 0.8 w ${MARGIN} ${FOOTER_Y} m ${RIGHT} ${FOOTER_Y} l S`);
    ops.push(`BT /F1 6.5 Tf ${GRAY} rg 1 0 0 1 ${MARGIN} 40 Tm (${pdfEsc("Banner Aircraft International | www.banner.aero | ASA member | ISO 9001")}) Tj ET`);
    const label = `${q.number} | Page ${i + 1} of ${numPages}`;
    const rx = RIGHT - pdfAscii(label).length * 6.5 * 0.5;
    ops.push(`BT /F1 6.5 Tf ${GRAY} rg 1 0 0 1 ${rx} 40 Tm (${pdfEsc(label)}) Tj ET`);
  });

  // ---- assemble the N-page PDF ----
  const fontsObjIndex = 2 + numPages * 2 + 1;
  const kids = Array.from({ length: numPages }, (_, i) => `${3 + i * 2} 0 R`).join(" ");
  const objs = [];
  objs.push("<</Type/Catalog/Pages 2 0 R>>");
  objs.push(`<</Type/Pages/Kids[${kids}]/Count ${numPages}>>`);
  pages.forEach((ops, i) => {
    const pageObjNum = 3 + i * 2;
    const streamObjNum = pageObjNum + 1;
    objs[pageObjNum - 1] = `<</Type/Page/Parent 2 0 R/MediaBox[0 0 ${PW} ${PH}]/Resources<</Font<</F1 ${fontsObjIndex} 0 R/F2 ${fontsObjIndex + 1} 0 R>>>>/Contents ${streamObjNum} 0 R>>`;
    const stream = ops.join("\n");
    objs[streamObjNum - 1] = `<</Length ${stream.length}>>\nstream\n${stream}\nendstream`;
  });
  objs[fontsObjIndex - 1] = "<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>";
  objs[fontsObjIndex] = "<</Type/Font/Subtype/Type1/BaseFont/Helvetica-Bold>>";

  let pdf = "%PDF-1.4\n";
  const offsets = [];
  objs.forEach((o, i) => { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const xrefPos = pdf.length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((off) => { pdf += String(off).padStart(10, "0") + " 00000 n \n"; });
  pdf += `trailer\n<</Size ${objs.length + 1}/Root 1 0 R>>\nstartxref\n${xrefPos}\n%%EOF`;
  return pdf;
}


function buildReportPdf({ title, classification, sections, distribution, preparedBy, data, genDate, period, dateFrom, dateTo, commissionRows, stageTracking, invoiceAging, repDetail, productDetail, accountDetail, aircraftDetail, rawMatrix }) {
  // A4 page in points: 595.28 x 841.89 (vs US Letter 612 x 792 used by the quote PDF).
  const PW = 595.28, PH = 841.89, MARGIN = 34, RIGHT = PW - MARGIN;
  const FOOTER_Y = 40, CONTENT_FLOOR = 56; // below this, a section must break to a new page rather than be clipped
  const NAVY = "0.047 0.208 0.341", TEAL = "0.243 0.788 0.690", INK = "0.082 0.141 0.184", GRAY = "0.353 0.420 0.471", LINE = "0.855 0.886 0.914";
  const CLASS_RGB = { Public: "0.145 0.431 0.306", Internal: "0.078 0.325 0.549", Confidential: "0.722 0.447 0.055", Restricted: "0.651 0.227 0.227" };
  const classRgb = CLASS_RGB[classification] || GRAY;

  // ---- multi-page assembly: every section renders through ensureSpace(), so a
  // long table starts a new page instead of being silently cut off. ----
  const pages = [];
  let curOps = [];
  let pageNum = 1;
  let y = PH;

  const R = (x, yy, w, h, c) => curOps.push(`${c} rg ${x} ${yy} ${w} ${h} re f`);
  const L = (x1, y1, x2, y2, c, wd = 0.8) => curOps.push(`${c} RG ${wd} w ${x1} ${y1} m ${x2} ${y2} l S`);
  const T = (x, yy, s, size, bold, c) => curOps.push(`BT /${bold ? "F2" : "F1"} ${size} Tf ${c} rg 1 0 0 1 ${x} ${yy} Tm (${pdfEsc(s)}) Tj ET`);
  const TR = (right, yy, s, size, bold, c) => T(right - pdfAscii(s).length * size * 0.5, yy, s, size, bold, c);

  const drawFooter = () => {
    L(MARGIN, FOOTER_Y, RIGHT, FOOTER_Y, LINE);
    R(0, 0, PW, 24, classRgb);
    T(MARGIN, 7, `${classification.toUpperCase()} - Banner Aircraft International - Africa Area`, 7.5, true, "1 1 1");
    TR(RIGHT, 7, `Page ${pageNum} - Generated ${genDate} - A4`, 7.5, false, "1 1 1");
  };

  const finalizePage = () => { drawFooter(); pages.push(curOps); };

  const drawFullLetterhead = () => {
    y = PH;
    R(0, y - 60, PW, 60, NAVY); y -= 22;
    T(MARGIN, y, "BANNER AIRCRAFT INTERNATIONAL", 13, true, "1 1 1"); y -= 12;
    T(MARGIN, y, "AFRICA BUSINESS DEVELOPMENT", 6.5, false, TEAL); y -= 18;
    T(MARGIN, y, pdfAscii(title), 15, true, "1 1 1");
    y = PH - 60 - 4;
    R(0, y - 13, PW, 13, classRgb);
    T(PW / 2 - pdfAscii(classification).length * 3.2, y - 9, `${classification.toUpperCase()} - NOT FOR DISTRIBUTION OUTSIDE THE LIST BELOW`, 7.5, true, "1 1 1");
    y -= 24;
    const meta = [["PREPARED BY", preparedBy.name], ["GENERATED", genDate], ["PERIOD", period], ["DISTRIBUTION", distribution.map((u) => u.name).join(", ") || "-"]];
    meta.forEach(([k, v]) => { T(MARGIN, y, k, 6.5, false, GRAY); T(140, y, pdfAscii(v), 9, true, INK); y -= 12.5; });
    L(MARGIN, y - 2, RIGHT, y - 2, LINE); y -= 16;
  };

  const drawContinuationHeader = () => {
    y = PH;
    R(0, y - 30, PW, 30, NAVY); y -= 14;
    T(MARGIN, y, pdfAscii(title) + " (continued)", 10, true, "1 1 1");
    TR(RIGHT, y, classification.toUpperCase(), 8.5, true, "1 1 1");
    y -= 22;
  };

  const newPage = () => { finalizePage(); curOps = []; pageNum += 1; drawContinuationHeader(); };
  const ensureSpace = (needed) => { if (y - needed < CONTENT_FLOOR) newPage(); };

  drawFullLetterhead();

  // ---- section-drawing primitives ----
  const secTitle = (s) => { ensureSpace(14); T(MARGIN, y, s.toUpperCase(), 9, true, NAVY); y -= 12; };
  const kvRow = (label, value, size = 8.5) => { ensureSpace(10.5); T(MARGIN, y, label, size, false, GRAY); TR(RIGHT, y, value, size, true, INK); y -= 10.5; };
  const barRow = (label, value, max, colorRgb) => {
    ensureSpace(11);
    T(MARGIN, y, pdfAscii(label).slice(0, 42), 8, false, INK);
    const barX = 280, barMaxW = RIGHT - barX - 70;
    R(barX, y - 6.5, max ? (value / max) * barMaxW : 0, 7.5, colorRgb);
    TR(RIGHT, y, fmt(value).replace("$", ""), 8, false, INK);
    y -= 11;
  };

  const rangedMonths = data.allMonths.filter((m) => monthInRange(m, dateFrom, dateTo));
  const rangedMonthlyTotals = data.monthlyTotals.filter((m) => monthInRange(m.month, dateFrom, dateTo));
  const rangedRevenueTotal = rangedMonthlyTotals.reduce((s, m) => s + m.value, 0);
  const rangedFunnel = filterFunnel(dateFrom, dateTo);
  const monthlyTableMonths = [...new Set([...rangedMonths, ...rangedFunnel.months])].sort((a, b) => monthKey(a) - monthKey(b));

  if (sections.includes("kpis")) {
    secTitle("Executive KPIs");
    kvRow("Win rate", data.winRate === null ? "-" : `${data.winRate.toFixed(0)}%`);
    kvRow("Avg deal size (won)", data.avgSize === null ? "-" : fmt(data.avgSize));
    kvRow("Avg sales cycle", data.avgCycle === null ? "-" : `${Math.round(data.avgCycle)} days`);
    kvRow("RFQ to quote turnaround", data.avgRfq === null ? "-" : `${data.avgRfq.toFixed(1)} days`);
    y -= 5;
  }

  if (sections.includes("revenue") && rangedMonthlyTotals.length) {
    ensureSpace(45);
    secTitle(`Historic invoiced revenue - ${fmt(rangedRevenueTotal)} in range`);
    const max = Math.max(...rangedMonthlyTotals.map((m) => m.value), 1);
    let bx = MARGIN;
    const bw = Math.min(9, (RIGHT - MARGIN) / rangedMonthlyTotals.length - 1.5);
    rangedMonthlyTotals.forEach((m) => {
      const h = Math.max((m.value / max) * 32, m.value > 0 ? 1 : 0);
      R(bx, y - 32, bw, h, TEAL);
      bx += bw + 1.5;
    });
    y -= 40;
  }

  if (sections.includes("funnel")) {
    ensureSpace(70);
    secTitle("BD funnel - RFQ to Quote to Sales Order to Invoice");
    T(MARGIN, y, "Scope note: invoiced total in this export matches a single account's history - confirm scope before external use.", 6.5, false, "0.722 0.447 0.055");
    y -= 10;
    const rfq = rangedFunnel.rfqUniquePN.reduce((a, b) => a + b, 0);
    const quoted = rangedFunnel.quotedUniquePN.reduce((a, b) => a + b, 0);
    const so = rangedFunnel.totalSOCount.reduce((a, b) => a + b, 0);
    const soVal = rangedFunnel.totalSOValue.reduce((a, b) => a + b, 0);
    const quotedVal = rangedFunnel.totalQuotesValue.reduce((a, b) => a + b, 0);
    kvRow("RFQ lines (unique PN)", String(rfq));
    kvRow("Quoted", `${quoted} (${rfq ? ((quoted / rfq) * 100).toFixed(0) : 0}% of RFQ)`);
    kvRow("Total quoted value", fmt(quotedVal));
    kvRow("Sales orders raised", String(so));
    kvRow("Sales order value", `${fmt(soVal)} (${quotedVal ? ((soVal / quotedVal) * 100).toFixed(1) : 0}% of quoted)`);
    y -= 5;
  }

  if (sections.includes("monthlyDetail") && monthlyTableMonths.length) {
    secTitle("Monthly tracking");
    const cols = [["Month", MARGIN, "left"], ["Invoiced", 160, "right"], ["RFQ", 240, "right"], ["Quoted", 290, "right"], ["Quoted $", 350, "right"], ["SO#", 430, "right"], ["SO $", 470, "right"]];
    cols.forEach(([label, x]) => T(x, y, label.toUpperCase(), 6.5, true, GRAY));
    y -= 3; L(MARGIN, y, RIGHT, y, NAVY, 1); y -= 9;
    monthlyTableMonths.forEach((m) => {
      ensureSpace(9.5);
      const rev = rangedMonthlyTotals.find((x) => x.month === m)?.value || 0;
      const fi = rangedFunnel.months.indexOf(m);
      const rfq = fi === -1 ? 0 : rangedFunnel.rfqUniquePN[fi];
      const quoted = fi === -1 ? 0 : rangedFunnel.quotedUniquePN[fi];
      const quotedVal = fi === -1 ? 0 : rangedFunnel.totalQuotesValue[fi];
      const so = fi === -1 ? 0 : rangedFunnel.totalSOCount[fi];
      const soVal = fi === -1 ? 0 : rangedFunnel.totalSOValue[fi];
      T(MARGIN, y, formatMonth(m), 7.5, true, INK);
      TR(230, y, rev ? fmt(rev).replace("$", "") : "-", 7.5, false, INK);
      TR(285, y, rfq ? String(rfq) : "-", 7.5, false, INK);
      TR(340, y, quoted ? String(quoted) : "-", 7.5, false, INK);
      TR(420, y, quotedVal ? fmt(quotedVal).replace("$", "") : "-", 7.5, false, INK);
      TR(465, y, so ? String(so) : "-", 7.5, false, INK);
      TR(RIGHT, y, soVal ? fmt(soVal).replace("$", "") : "-", 7.5, false, INK);
      y -= 9.5;
    });
    y -= 6;
  }

  // ---- Raw invoice matrix: chunked into blocks of 6 months so columns stay
  // readable in portrait; every account and every month appears somewhere,
  // nothing is cut for space (that's the whole point of this section). ----
  if (sections.includes("rawMatrix") && rawMatrix && rawMatrix.rows.length) {
    ensureSpace(20);
    secTitle(`Raw invoice data - account x month - ${fmt(rawMatrix.grandTotal)} total, ${rawMatrix.rows.length} accounts`);
    T(MARGIN, y, "Exact figures from the invoice export - every account, every month in range, no summarizing.", 6.5, false, GRAY);
    y -= 10;
    const CHUNK = 6;
    for (let c0 = 0; c0 < rawMatrix.months.length; c0 += CHUNK) {
      const chunkMonths = rawMatrix.months.slice(c0, c0 + CHUNK);
      ensureSpace(14);
      T(MARGIN, y, "ACCOUNT", 6.5, true, GRAY);
      TR(170, y, "TOTAL", 6.5, true, GRAY);
      const colW = (RIGHT - 190) / chunkMonths.length;
      chunkMonths.forEach((m, i) => TR(190 + colW * (i + 1), y, formatMonth(m), 6.5, true, GRAY));
      y -= 3; L(MARGIN, y, RIGHT, y, NAVY, 1); y -= 8.5;
      rawMatrix.rows.forEach((r) => {
        ensureSpace(8.5);
        T(MARGIN, y, pdfAscii(r.name).slice(0, 26), 7, false, INK);
        TR(170, y, fmt(r.total).replace("$", ""), 7, true, INK);
        chunkMonths.forEach((m, i) => {
          const idx = rawMatrix.months.indexOf(m);
          const v = r.values[idx] || 0;
          TR(190 + colW * (i + 1), y, v ? fmt(v).replace("$", "") : "-", 6.8, false, v ? INK : "0.780 0.816 0.847");
        });
        y -= 8.5;
      });
      y -= 8;
      if (c0 + CHUNK < rawMatrix.months.length) ensureSpace(14); // next chunk gets its own header block
    }
    y -= 4;
  }

  if (sections.includes("stageTracking") && stageTracking && stageTracking.months.length) {
    ensureSpace(20);
    secTitle("Sales stage tracking by month");
    T(MARGIN, y, "Deals predating this feature carry a single baseline entry, not a full transition history.", 6.5, false, GRAY);
    y -= 10;
    stageTracking.months.forEach((m) => {
      ensureSpace(9);
      const cells = STAGES.map((st) => {
        const c = stageTracking.rows[m]?.[st];
        return c ? `${st.slice(0, 4)}:${c.count}` : "";
      }).filter(Boolean).join("  ");
      T(MARGIN, y, formatMonth(m), 7.5, true, INK);
      T(90, y, cells, 6.8, false, GRAY);
      y -= 9;
    });
    y -= 6;
  }

  if (sections.includes("invoiceAging") && invoiceAging) {
    ensureSpace(35);
    secTitle(`Invoice collection & aging - ${fmt(invoiceAging.totalOutstanding)} outstanding`);
    let bx = MARGIN;
    AGING_BUCKETS.forEach((b) => {
      T(bx, y, fmt(invoiceAging.buckets[b].value).replace("$", ""), 9, true, b === "Current" ? "0.145 0.431 0.306" : b === "90+ days" ? "0.651 0.227 0.227" : "0.722 0.447 0.055");
      T(bx, y - 9, `${b} (${invoiceAging.buckets[b].count})`, 6.5, false, GRAY);
      bx += 100;
    });
    y -= 24;
    invoiceAging.lines.forEach((l) => {
      ensureSpace(9.5);
      T(MARGIN, y, pdfAscii(l.name).slice(0, 34), 7.5, false, INK);
      TR(360, y, fmt(l.value).replace("$", ""), 7.5, false, INK);
      T(370, y, l.terms, 6.8, false, GRAY);
      TR(RIGHT, y, l.bucket, 7.5, true, l.daysOverdue > 0 ? "0.651 0.227 0.227" : "0.145 0.431 0.306");
      y -= 9.5;
    });
    y -= 6;
  }

  const detailTable = (label, cols, rows, rowFn) => {
    if (!rows || rows.length === 0) return;
    ensureSpace(20);
    secTitle(label);
    let cx = MARGIN;
    const widths = cols.map((c) => c.w);
    cols.forEach((c, i) => { (c.align === "right" ? TR(cx + widths[i], y, c.h, 6.5, true, GRAY) : T(cx, y, c.h, 6.5, true, GRAY)); cx += widths[i]; });
    y -= 3; L(MARGIN, y, RIGHT, y, NAVY, 1); y -= 8.5;
    rows.forEach((row) => {
      ensureSpace(8.5);
      let cx2 = MARGIN;
      const vals = rowFn(row);
      cols.forEach((c, i) => {
        if (c.align === "right") TR(cx2 + widths[i], y, vals[i], 7, false, INK);
        else T(cx2, y, pdfAscii(String(vals[i])).slice(0, Math.floor(widths[i] / 3.6)), 7, i === 0, INK);
        cx2 += widths[i];
      });
      y -= 8.5;
    });
    y -= 5;
  };

  if (sections.includes("repDetail") && repDetail && repDetail.length) {
    detailTable("Detailed breakdown - per rep",
      [{ h: "Rep", w: 110 }, { h: "Open #/$", w: 90, align: "right" }, { h: "Weighted", w: 70, align: "right" }, { h: "Quotes #/$", w: 90, align: "right" }, { h: "Won #/$", w: 90, align: "right" }, { h: "Payable", w: 82, align: "right" }],
      repDetail,
      (r) => [r.name, `${r.openCount}/${fmt(r.openValue).replace("$", "")}`, fmt(r.weighted).replace("$", ""), `${r.quotesCount}/${fmt(r.quotesValue).replace("$", "")}`, `${r.wonCount}/${fmt(r.wonValue).replace("$", "")}`, fmt(r.payableComm).replace("$", "")]
    );
  }

  if (sections.includes("productDetail") && productDetail && productDetail.length) {
    detailTable("Detailed breakdown - per product line",
      [{ h: "Product line", w: 140 }, { h: "Items", w: 60, align: "right" }, { h: "Open #/$", w: 120, align: "right" }, { h: "Quoted #/$", w: 120, align: "right" }, { h: "Won #/$", w: 96, align: "right" }],
      productDetail,
      (r) => [r.label, String(r.catalogItems), `${r.openCount}/${fmt(r.openValue).replace("$", "")}`, `${r.quotesCount}/${fmt(r.quotesValue).replace("$", "")}`, `${r.wonCount}/${fmt(r.wonValue).replace("$", "")}`]
    );
  }

  if (sections.includes("accountDetail") && accountDetail && accountDetail.length) {
    detailTable(`Detailed breakdown - per airline / account (${accountDetail.length})`,
      [{ h: "Account", w: 110 }, { h: "Tier", w: 45 }, { h: "Owner", w: 85 }, { h: "Fleet", w: 40, align: "right" }, { h: "Invoiced", w: 70, align: "right" }, { h: "Open $", w: 70, align: "right" }, { h: "Won", w: 40, align: "right" }, { h: "Reg. status", w: 76 }],
      accountDetail,
      (r) => [r.name, r.tier.replace("Tier ", "T"), r.owner, r.fleetSize || "-", r.invoiced ? fmt(r.invoiced).replace("$", "") : "-", r.openValue ? fmt(r.openValue).replace("$", "") : "-", r.wonCount || "-", r.regStatus]
    );
  }

  if (sections.includes("aircraftDetail") && aircraftDetail && aircraftDetail.length) {
    detailTable("Detailed breakdown - per aircraft model",
      [{ h: "Model", w: 130 }, { h: "OEM", w: 110 }, { h: "Tails", w: 60, align: "right" }, { h: "Operators", w: 80, align: "right" }, { h: "Open pipeline", w: 90, align: "right" }, { h: "Engaged", w: 70, align: "right" }],
      aircraftDetail,
      (r) => [r.label, r.oem, String(r.tails), String(r.operators), r.openPipeline ? fmt(r.openPipeline).replace("$", "") : "-", `${r.engagedCount}/${r.operators}`]
    );
  }

  const barSection = (label, rows) => {
    if (!rows || rows.length === 0) return;
    ensureSpace(20);
    secTitle(label);
    const max = Math.max(...rows.map((r) => r.value ?? r.revenue?.total ?? 0), 1);
    rows.forEach((r) => barRow(r.label || r.name, r.value ?? r.revenue?.total ?? 0, max, NAVY));
    y -= 5;
  };

  if (sections.includes("topAccounts")) barSection("Top accounts by invoiced revenue", data.topAccountsByRevenue);
  if (sections.includes("region")) barSection("Open pipeline by region", data.byRegion);
  if (sections.includes("product")) barSection("Open pipeline by product line", data.byProduct);
  if (sections.includes("owner")) barSection("Open pipeline by owner", data.byOwner);
  if (sections.includes("loss")) barSection("Lost deal reasons", data.byLoss);
  if (sections.includes("commission") && commissionRows && commissionRows.length) {
    ensureSpace(20);
    secTitle("Commission summary - matured, by rep");
    const max = Math.max(...commissionRows.map((r) => r.maturedAll), 1);
    commissionRows.forEach((r) => barRow(`${r.name} (payable ${fmt(r.payable)})`, r.maturedAll, max, NAVY));
  }

  finalizePage(); // push whatever's left on the current page

  // ---- assemble a proper N-page PDF: Pages/Kids lists every page, each with
  // its own content stream, all sharing the same two font resources. ----
  const numPages = pages.length;
  const fontsObjIndex = 2 + numPages * 2 + 1; // 1 catalog + 1 pages-node + (page+stream) pairs, then F1
  const kids = Array.from({ length: numPages }, (_, i) => `${3 + i * 2} 0 R`).join(" ");

  const objs = [];
  objs.push("<</Type/Catalog/Pages 2 0 R>>"); // 1
  objs.push(`<</Type/Pages/Kids[${kids}]/Count ${numPages}>>`); // 2
  pages.forEach((ops, i) => {
    const pageObjNum = 3 + i * 2;
    const streamObjNum = pageObjNum + 1;
    objs[pageObjNum - 1] = `<</Type/Page/Parent 2 0 R/MediaBox[0 0 ${PW} ${PH}]/Resources<</Font<</F1 ${fontsObjIndex} 0 R/F2 ${fontsObjIndex + 1} 0 R>>>>/Contents ${streamObjNum} 0 R>>`;
    const stream = ops.join("\n");
    objs[streamObjNum - 1] = `<</Length ${stream.length}>>\nstream\n${stream}\nendstream`;
  });
  objs[fontsObjIndex - 1] = "<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>";
  objs[fontsObjIndex] = "<</Type/Font/Subtype/Type1/BaseFont/Helvetica-Bold>>";

  let pdf = "%PDF-1.4\n";
  const offsets = [];
  objs.forEach((o, i) => { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const xrefPos = pdf.length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((off) => { pdf += String(off).padStart(10, "0") + " 00000 n \n"; });
  pdf += `trailer\n<</Size ${objs.length + 1}/Root 1 0 R>>\nstartxref\n${xrefPos}\n%%EOF`;
  return pdf;
}



function QuoteDocModal({ q, acct, userById, itemById, onClose }) {
  const a = acct(q.accountId);
  const owner = userById(q.ownerId);
  const sub = quoteSubtotal(q);
  const net = quoteNet(q);
  const disc = sub - net;
  const term = q.paymentTerms || "Cash on Order";
  const incoterm = q.incoterm || "EXW Hollywood, FL";
  const approvedBy = (q.approvals || []).filter((x) => x.decision === "Approved" && x.role !== "Auto");
  const validUntil = (() => { const d = new Date(q.createdAt || today()); d.setDate(d.getDate() + 30); return d.toISOString().slice(0, 10); })();

  const downloadPdf = () => {
    try {
      const pdf = buildQuotePdf({ q, a, owner, itemById, sub, net, term, validUntil });
      const bytes = new Uint8Array(pdf.length);
      for (let i = 0; i < pdf.length; i++) bytes[i] = pdf.charCodeAt(i) & 0xff;
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const el = document.createElement("a");
      el.href = url;
      el.download = `${q.number}_Banner_Quotation.pdf`;
      document.body.appendChild(el);
      el.click();
      document.body.removeChild(el);
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch (e) { console.error("PDF generation failed", e); }
  };

  const th = { textAlign: "left", fontSize: 9, letterSpacing: "0.07em", textTransform: "uppercase", color: "#5A6B78", padding: "5px 6px", borderBottom: "2px solid #0C3557", whiteSpace: "nowrap" };
  const td = { padding: "6px", borderBottom: "1px solid #E4E9EE", fontSize: 11.5, verticalAlign: "top" };
  const metaLabel = { fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: "#5A6B78" };
  const metaVal = { fontSize: 12, fontWeight: 600, color: "#15242F" };

  return (
    <Modal title={`Quotation — ${q.number}`} onClose={onClose} wide>
      <div style={{ border: "1px solid #DDE3E9", borderRadius: 6, overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column", minHeight: 640 }}>
        {/* letterhead */}
        <div style={{ background: "#0C3557", color: "#fff", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Plane size={24} style={{ transform: "rotate(-45deg)", color: "#3EC9B0" }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.05em" }}>BANNER AIRCRAFT INTERNATIONAL</div>
              <div style={{ fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "#3EC9B0" }}>Airworthiness Support Experts</div>
              <div style={{ fontSize: 9, color: "#BFD3E4", marginTop: 2 }}>2252 Hayes St, Hollywood, FL 33020, USA · sales@banner.aero · +1 (855) 822-6637</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: "0.06em" }}>QUOTATION</div>
            <div style={{ fontSize: 12, color: "#3EC9B0", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{q.number}</div>
            <div style={{ fontSize: 10, color: "#BFD3E4" }}>Date {q.createdAt} · Valid until {validUntil}</div>
          </div>
        </div>

        {/* reference block */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, padding: "12px 18px", borderBottom: "1px solid #E4E9EE" }}>
          <div><div style={metaLabel}>To</div><div style={metaVal}>{a?.name || "—"}{a?.country ? `, ${a.country}` : ""}</div></div>
          <div><div style={metaLabel}>Attention</div><div style={metaVal}>{q.attention || "—"}</div></div>
          <div><div style={metaLabel}>Your ref / RFQ</div><div style={metaVal}>{q.customerRef || "—"}</div></div>
          <div><div style={metaLabel}>Delivery</div><div style={metaVal}>{incoterm}</div></div>
          <div><div style={metaLabel}>Payment terms</div><div style={{ ...metaVal, color: "#B8720F" }}>{term}</div></div>
        </div>

        {/* certification banner */}
        <div style={{ background: "#E7F3ED", padding: "7px 18px", fontSize: 10.5, fontWeight: 700, color: "#256E4E" }}>
          All material supplied with FAA 8130-3 / EASA Form 1 dual release or Certificate of Conformance as applicable, with full traceability.
        </div>

        {/* line items — aviation columns */}
        <div style={{ padding: "4px 18px 0", overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead><tr>
              <th style={th}>Part Number</th><th style={th}>Description</th><th style={th}>CD</th>
              <th style={{ ...th, textAlign: "right" }}>Qty</th><th style={th}>UOM</th><th style={th}>Lead Time</th>
              <th style={{ ...th, textAlign: "right" }}>Unit USD</th><th style={{ ...th, textAlign: "right" }}>Ext USD</th>
            </tr></thead>
            <tbody>
              {(q.lines || []).map((l, i) => {
                const it = itemById(l.itemId);
                return (
                  <tr key={i}>
                    <td style={{ ...td, fontFamily: "ui-monospace, monospace", fontWeight: 700, whiteSpace: "nowrap" }}>{it?.pn || "—"}</td>
                    <td style={td}>
                      <div>{it?.name || "Item"}</div>
                      <div style={{ fontSize: 9.5, color: "#8CA0AE" }}>{it?.productLine}</div>
                    </td>
                    <td style={td}>{l.cond || "NE"}</td>
                    <td style={{ ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{l.qty}</td>
                    <td style={td}>{it?.unit || "EA"}</td>
                    <td style={{ ...td, whiteSpace: "nowrap" }}>{l.leadTime || it?.lead || "—"}</td>
                    <td style={{ ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt2(l.unitPrice)}</td>
                    <td style={{ ...td, textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>{fmt(l.qty * l.unitPrice)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* totals + legend */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "8px 18px", gap: 12, flexWrap: "wrap" }}>
          <div style={{ fontSize: 9, color: "#8CA0AE", maxWidth: 300 }}>{COND_LEGEND}</div>
          <div style={{ width: 250 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "2px 0" }}><span style={{ color: "#5A6B78" }}>Subtotal</span><span style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(sub)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "2px 0" }}><span style={{ color: "#5A6B78" }}>Discount ({q.discountPct}%)</span><span style={{ fontVariantNumeric: "tabular-nums", color: "#A63A3A" }}>−{fmt(disc)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14.5, fontWeight: 800, padding: "5px 0", borderTop: "2px solid #0C3557", marginTop: 3 }}><span>Total (USD)</span><span style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(net)}</span></div>
          </div>
        </div>

        {/* T&Cs — pinned to the bottom of the sheet */}
        <div style={{ padding: "10px 18px 12px", marginTop: "auto", borderTop: "1px solid #E4E9EE" }}>
          <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.08em", color: "#0C3557", marginBottom: 4 }}>TERMS AND CONDITIONS OF SALE</div>
          {quoteTerms(term, incoterm).map((t, i) => (
            <div key={i} style={{ fontSize: 9.5, color: "#5A6B78", lineHeight: 1.45, marginBottom: 2 }}>{t}</div>
          ))}
          {approvedBy.length > 0 && (
            <div style={{ fontSize: 9.5, color: "#5A6B78", marginTop: 5 }}><strong>Authorised:</strong> {approvedBy.map((x) => `${x.byName} (${x.role}, ${x.date})`).join(" · ")}</div>
          )}
        </div>
        <div style={{ background: "#F4F6F8", borderTop: "1px solid #E4E9EE", padding: "9px 18px", fontSize: 10, color: "#5A6B78", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
          <span>Banner Aircraft International · www.banner.aero · ASA member · ISO 9001</span>
          <span>{q.number} · Page 1 of 1</span>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, gap: 8, flexWrap: "wrap" }}>
        <div style={{ fontSize: 11, color: C.faint }}>Final document — approved quotes are issued as PDF only. Internal commission figures are excluded.</div>
        <Btn onClick={downloadPdf}><Download size={14} /> Download PDF</Btn>
      </div>
    </Modal>
  );
}

/* ----------------------------- Products ---------------------------- */

function Products({ catalog, isAdmin, onAdd, onEdit, onDelete }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 13, color: C.sub }}>Real Banner portfolio from official materials and banner.aero. Novega ULBs carry published USD pricing; other lines are POA — the live stock catalogue sits behind the customer portal (store.banner.aero), so enter quoted prices per line. Tooling & Calibration commission rate is TBC with BAI.</div>
        {isAdmin && <Btn onClick={onAdd}><Plus size={14} /> New item</Btn>}
      </div>
      {Object.keys(PRODUCTS).map((line) => {
        const items = catalog.filter((p) => p.productLine === line);
        if (items.length === 0) return null;
        return (
          <div key={line} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: C.teal, marginBottom: 8 }}>
              {line}
            </div>
            <Card style={{ overflowX: "auto" }}>
              <table>
                <thead><tr><th>Part No.</th><th>Description</th><th>UOM</th><th>Lead time</th><th>List price</th>{isAdmin && <th></th>}</tr></thead>
                <tbody>
                  {items.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 700, fontFamily: "ui-monospace, monospace", fontSize: 13, whiteSpace: "nowrap" }}>{p.pn || "—"}</td>
                      <td style={{ fontWeight: 600 }}>{p.name}</td>
                      <td style={{ fontSize: 13, color: C.sub }}>{p.unit}</td>
                      <td style={{ fontSize: 13, color: C.sub }}>{p.lead || "—"}</td>
                      <td style={{ fontVariantNumeric: "tabular-nums" }}>{p.listPrice > 0 ? fmt2(p.listPrice) : <span style={{ color: C.faint }}>POA — quoted per RFQ</span>}</td>
                      {isAdmin && (
                        <td style={{ whiteSpace: "nowrap" }}>
                          <IconBtn onClick={() => onEdit(p)}><Pencil size={14} /></IconBtn>
                          <IconBtn onClick={() => onDelete(p.id)} color={C.red}><Trash2 size={14} /></IconBtn>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------ Leads ------------------------------ */

function Leads({ leads, acct, canEdit, setStatus, setRank, convert, onAdd, onEdit, onDelete }) {
  const sorted = [...leads].sort((a, b) => LEAD_STATUSES.indexOf(a.status) - LEAD_STATUSES.indexOf(b.status));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 13, color: C.sub }}>Oracle lead progression: Unqualified → Qualified → Convert (creates account, contact & opportunity). Dead leads are Retired. Rank by heat: Hot / Warm / Cool.</div>
        {canEdit && <Btn onClick={onAdd}><Plus size={14} /> New lead</Btn>}
      </div>
      <Card style={{ overflowX: "auto" }}>
        <table>
          <thead><tr><th>Company</th><th>Contact</th><th>Source</th><th>Region</th><th>Product interest</th><th>Est. value</th><th>Rank</th><th>Status</th>{canEdit && <th></th>}</tr></thead>
          <tbody>
            {sorted.length === 0 && <tr><td colSpan={9} style={{ color: C.faint, textAlign: "center", padding: 24 }}>No leads in view.</td></tr>}
            {sorted.map((l) => (
              <tr key={l.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{acct(l.accountId)?.name || l.company || "—"}</div>
                  {l.notes && <div style={{ fontSize: 12, color: C.faint, marginTop: 2 }}>{l.notes}</div>}
                </td>
                <td style={{ fontSize: 13 }}>{l.contactName || "—"}{l.title ? <div style={{ fontSize: 11, color: C.faint }}>{l.title}</div> : null}</td>
                <td style={{ fontSize: 12, color: C.sub }}>{l.source}</td>
                <td style={{ fontSize: 12, color: C.sub }}>{acct(l.accountId)?.region || l.region || "—"}</td>
                <td style={{ fontSize: 12, color: C.sub }}>{PRODUCTS[l.product]?.short || l.product}</td>
                <td style={{ fontVariantNumeric: "tabular-nums" }}>{l.est ? fmt(l.est) : "—"}</td>
                <td>
                  {canEdit ? (
                    <select value={l.rank || "Warm"} onChange={(e) => setRank(l.id, e.target.value)} style={{ ...inputStyle, width: "auto", fontSize: 12, padding: "4px 6px", borderColor: rankColor[l.rank || "Warm"], color: rankColor[l.rank || "Warm"], fontWeight: 600 }}>
                      {LEAD_RANKS.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  ) : <Tag color={rankColor[l.rank || "Warm"]}>{l.rank || "Warm"}</Tag>}
                </td>
                <td>
                  {canEdit ? (
                    <select value={l.status} onChange={(e) => setStatus(l.id, e.target.value)} disabled={l.status === "Converted"} style={{ ...inputStyle, width: "auto", fontSize: 12, padding: "4px 6px", borderColor: leadColor[l.status], color: leadColor[l.status], fontWeight: 600 }}>
                      {LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  ) : <Tag color={leadColor[l.status]}>{l.status}</Tag>}
                </td>
                {canEdit && (
                  <td style={{ whiteSpace: "nowrap" }}>
                    {l.status === "Qualified" && <Btn small kind="green" onClick={() => convert(l)}>Convert <ArrowRight size={12} /></Btn>}
                    <IconBtn onClick={() => onEdit(l)}><Pencil size={14} /></IconBtn>
                    <IconBtn onClick={() => onDelete(l.id)} color={C.red}><Trash2 size={14} /></IconBtn>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* --------------------------- Opportunities ------------------------- */

function Pipeline({ deals, quotes, acct, userById, canEdit, isAdmin, canProcessPayouts, toggleCollected, onAgreement, setStage, onAdd, onEdit, onDelete, onQuote }) {
  const [stageFilter, setStageFilter] = useState("All");
  const [fcatFilter, setFcatFilter] = useState("All");

  const list = deals
    .filter((d) => (stageFilter === "All" ? true : d.stage === stageFilter))
    .filter((d) => (fcatFilter === "All" ? true : d.forecastCat === fcatFilter))
    .sort((a, b) => STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <Filter size={14} color={C.sub} />
          <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} style={{ ...inputStyle, width: "auto", fontSize: 12, padding: "6px 8px" }}>
            <option>All</option>{STAGES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={fcatFilter} onChange={(e) => setFcatFilter(e.target.value)} style={{ ...inputStyle, width: "auto", fontSize: 12, padding: "6px 8px" }}>
            <option>All</option>{FORECAST_CATS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>
        {canEdit && <Btn onClick={onAdd}><Plus size={14} /> New opportunity</Btn>}
      </div>

      <Card style={{ overflowX: "auto" }}>
        <table>
          <thead><tr><th>Opportunity</th><th>Account</th><th>Revenue lines</th><th>Value</th><th>Win %</th><th>Commission</th><th>Stage</th><th>Forecast</th><th>Close</th>{canEdit && <th></th>}</tr></thead>
          <tbody>
            {list.length === 0 && <tr><td colSpan={10} style={{ color: C.faint, textAlign: "center", padding: 24 }}>No opportunities in view.</td></tr>}
            {list.map((d) => (
              <tr key={d.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>{userById(d.ownerId)?.name || "Unassigned"}</div>
                  {d.stage !== "Won" && d.stage !== "Lost" && d.lastTouch && daysBetween(d.lastTouch, today()) > STALE_DAYS && (
                    <div style={{ fontSize: 10, color: C.red, fontWeight: 700, marginTop: 3, display: "flex", alignItems: "center", gap: 3 }}><AlertTriangle size={10} /> Stale — {daysBetween(d.lastTouch, today())}d since last touch</div>
                  )}
                  {d.stage === "Lost" && d.lossReason && (
                    <div style={{ fontSize: 10, color: C.faint, marginTop: 3 }}>Lost: {d.lossReason}</div>
                  )}
                  {d.stage === "Won" && (() => {
                    const canToggle = isAdmin || canProcessPayouts;
                    const linkedQ = quotes.find((q) => q.oppId === d.id && q.status === "Accepted");
                    const expected = expectedCollectionDate(d, linkedQ);
                    const overdue = !d.collectedAt && expected && daysBetween(expected, today()) > 0;
                    return (
                      <div style={{ marginTop: 3 }}>
                        {d.collectedAt ? (
                          <span onClick={() => canToggle && toggleCollected(d.id)} style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: C.green, borderRadius: 3, padding: "1px 6px", cursor: canToggle ? "pointer" : "default" }} title={canToggle ? "Tap to un-mark" : ""}>Collected {d.collectedAt}</span>
                        ) : overdue ? (
                          canToggle ? (
                            <button onClick={() => toggleCollected(d.id)} style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: C.red, border: "none", borderRadius: 3, padding: "1px 6px", cursor: "pointer", fontFamily: "inherit" }}>Overdue {daysBetween(expected, today())}d — mark collected</button>
                          ) : (
                            <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: C.red, borderRadius: 3, padding: "1px 6px" }}>Overdue {daysBetween(expected, today())}d</span>
                          )
                        ) : canToggle ? (
                          <button onClick={() => toggleCollected(d.id)} style={{ fontSize: 10, fontWeight: 700, color: C.amber, background: C.amberBg, border: `1px solid ${C.amber}`, borderRadius: 3, padding: "1px 6px", cursor: "pointer", fontFamily: "inherit" }}>Awaiting collection{expected ? ` — due ${expected}` : ""} — mark collected</button>
                        ) : (
                          <span style={{ fontSize: 10, fontWeight: 700, color: C.amber, background: C.amberBg, borderRadius: 3, padding: "1px 6px" }}>Awaiting collection{expected ? ` — due ${expected}` : ""}</span>
                        )}
                      </div>
                    );
                  })()}
                  {d.agreement?.assistBDId && (
                    <div style={{ fontSize: 10, color: C.blue, marginTop: 3 }}><Handshake size={10} style={{ verticalAlign: "-1px" }} /> Split {d.agreement.splitPct}% with {userById(d.agreement.assistBDId)?.name}</div>
                  )}
                  {quotes.filter((q) => q.oppId === d.id).map((q) => (
                    <div key={q.id} style={{ fontSize: 10, marginTop: 3 }}>
                      <span style={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: 3, padding: "1px 5px", color: quoteStatusColor[q.status], fontWeight: 700 }}>{q.number} · {q.status}</span>
                    </div>
                  ))}
                </td>
                <td>{acct(d.accountId)?.name || "—"}</td>
                <td>
                  {(d.lines || []).map((l, i) => (
                    <div key={i} style={{ fontSize: 12, color: C.sub, whiteSpace: "nowrap" }}>{PRODUCTS[l.product]?.short || l.product} · {fmt(l.value)}</div>
                  ))}
                </td>
                <td style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{fmt(dealValue(d))}</td>
                <td style={{ fontVariantNumeric: "tabular-nums", fontSize: 13 }}>{d.prob ?? STAGE_PROB[d.stage]}%</td>
                <td style={{ fontVariantNumeric: "tabular-nums", color: C.teal }}>{fmt(dealCommission(d, userById(d.ownerId)?.role))}</td>
                <td>
                  <select value={d.stage} onChange={(e) => setStage(d.id, e.target.value)} disabled={!canEdit} style={{ ...inputStyle, width: "auto", fontSize: 12, padding: "4px 6px", borderColor: stageColor[d.stage], color: stageColor[d.stage], fontWeight: 600 }}>
                    {STAGES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td><Tag color={fcatColor[d.forecastCat]}>{d.forecastCat}</Tag></td>
                <td style={{ fontSize: 12, color: C.sub }}>{d.closeDate || "—"}</td>
                {canEdit && (
                  <td style={{ whiteSpace: "nowrap" }}>
                    {d.stage !== "Won" && d.stage !== "Lost" && <IconBtn title="Create quote (CPQ)" onClick={() => onQuote(d)} color={C.blue}><FileText size={14} /></IconBtn>}
                    {isAdmin && <IconBtn title="Cross-territory agreement" onClick={() => onAgreement(d)} color={C.blue}><Handshake size={14} /></IconBtn>}
                    <IconBtn onClick={() => onEdit(d)}><Pencil size={14} /></IconBtn>
                    <IconBtn onClick={() => onDelete(d.id)} color={C.red}><Trash2 size={14} /></IconBtn>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ----------------------------- Accounts ---------------------------- */

function Accounts({ accounts, deals, interactions, userById, canEdit, isAdmin, onAdd, onEdit, onDelete, onLog, onReg }) {
  const [open, setOpen] = useState(null);
  const byTier = TIERS.map((t) => [t, accounts.filter((a) => a.tier === t)]);
  const iconFor = { Call: Phone, Email: Mail, Meeting: CalendarDays, WhatsApp: MessageSquare, Note: Pencil };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 12, color: C.faint }}>{!isAdmin && "New accounts and territory (re)assignment are Area Director-only. You can edit details on accounts you own."}</div>
        {isAdmin && <Btn onClick={onAdd}><Plus size={14} /> New account</Btn>}
      </div>
      {byTier.map(([tier, list]) => list.length > 0 && (
        <div key={tier} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: tierColor[tier], marginBottom: 8 }}>{tier} · {list.length} accounts</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
            {list.map((a) => {
              const aDeals = deals.filter((d) => d.accountId === a.id && d.stage !== "Lost");
              const aVal = aDeals.reduce((s, d) => s + dealValue(d), 0);
              const aInts = interactions.filter((i) => i.accountId === a.id).sort((x, y) => (y.date || "").localeCompare(x.date || ""));
              const isOpen = open === a.id;
              return (
                <div key={a.id} style={{ background: C.surface, border: `1px solid ${C.line}`, borderLeft: `3px solid ${tierColor[a.tier]}`, borderRadius: 6, padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{a.name}</div>
                      <div style={{ fontSize: 12, color: C.faint }}>{a.country} · {a.region}</div>
                      <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>Owner: {userById(a.ownerId)?.name || "Unassigned"}</div>
                    </div>
                    {canEdit && (
                      <div style={{ display: "flex" }}>
                        <IconBtn onClick={() => onEdit(a)}><Pencil size={13} /></IconBtn>
                        <IconBtn onClick={() => onDelete(a.id)} color={C.red}><Trash2 size={13} /></IconBtn>
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: C.sub, marginTop: 8 }}>
                    {aDeals.length > 0 ? <>Pipeline: <strong style={{ color: C.ink }}>{fmt(aVal)}</strong> · {aDeals.length} opp{aDeals.length > 1 ? "s" : ""}</> : "No open opportunities"}
                    {aInts.length > 0 && <> · {aInts.length} touch{aInts.length > 1 ? "es" : ""}</>}
                  </div>
                  {a.webCustomer && (
                    <div style={{ marginTop: 5 }}><Tag color={C.teal}>Banner customer — banner.aero</Tag></div>
                  )}
                  {a.revenue && a.revenue.total > 0 && (
                    <div style={{ fontSize: 11, color: C.green, fontWeight: 700, marginTop: 5 }}>
                      <DollarSign size={11} style={{ verticalAlign: "-2px", marginRight: 2 }} />
                      Invoiced (19mo): {fmt(a.revenue.total)}{a.revenue.lastActive ? ` — last active ${formatMonth(a.revenue.lastActive)}` : ""}
                    </div>
                  )}
                  {(a.fleet || []).length > 0 && (
                    <div style={{ fontSize: 11, color: C.sub, marginTop: 5 }}>
                      <Plane size={11} style={{ verticalAlign: "-2px", marginRight: 4, color: C.blue }} />
                      Fleet: <strong>{a.fleet.reduce((s, f) => s + (Number(f.count) || 0), 0)}</strong> a/c — {a.fleet.map((f) => f.type).slice(0, 3).join(", ")}{a.fleet.length > 3 ? ` +${a.fleet.length - 3}` : ""}
                    </div>
                  )}
                  {a.reg && a.reg.status !== "Not started" && (
                    <div style={{ marginTop: 6 }}>
                      <Tag color={regColor[a.reg.status]}>Reg: {a.reg.status}</Tag>
                      {a.reg.expected && a.reg.status !== "PVL awarded" && <span style={{ fontSize: 10, color: C.faint, marginLeft: 6 }}>ETA {a.reg.expected}</span>}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    {canEdit && <button onClick={() => onReg(a)} style={{ background: "none", border: "none", color: C.amber, fontSize: 12, cursor: "pointer", padding: 0, fontFamily: "inherit", fontWeight: 600 }}>Registration</button>}
                    {canEdit && <button onClick={() => onLog(a)} style={{ background: "none", border: "none", color: C.teal, fontSize: 12, cursor: "pointer", padding: 0, fontFamily: "inherit", fontWeight: 600 }}>+ Log touch</button>}
                    <button onClick={() => setOpen(isOpen ? null : a.id)} style={{ background: "none", border: "none", color: C.blue, fontSize: 12, cursor: "pointer", padding: 0, fontFamily: "inherit", fontWeight: 600 }}>
                      {isOpen ? "Hide detail" : "Detail"}
                    </button>
                  </div>
                  {isOpen && (
                    <div style={{ marginTop: 8, background: C.bg, borderRadius: 4, padding: 8 }}>
                      {a.notes && <div style={{ fontSize: 12, color: C.sub, marginBottom: 8 }}>{a.notes}</div>}
                      {aInts.length === 0 && <div style={{ fontSize: 12, color: C.faint }}>No interactions logged yet.</div>}
                      {aInts.slice(0, 6).map((i) => {
                        const Ic = iconFor[i.type] || Pencil;
                        return (
                          <div key={i.id} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                            <Ic size={13} color={C.teal} style={{ marginTop: 2, flexShrink: 0 }} />
                            <div>
                              <div style={{ fontSize: 12 }}>{i.summary}</div>
                              <div style={{ fontSize: 10, color: C.faint }}>{i.type} · {i.date}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------- Contacts ---------------------------- */

function Contacts({ contacts, acct, canEdit, onAdd, onEdit, onDelete }) {
  return (
    <div>
      {canEdit && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
          <Btn onClick={onAdd}><Plus size={14} /> New contact</Btn>
        </div>
      )}
      <Card style={{ overflowX: "auto" }}>
        <table>
          <thead><tr><th>Name</th><th>Title</th><th>Account</th><th>Email</th><th>Phone</th><th>Notes</th>{canEdit && <th></th>}</tr></thead>
          <tbody>
            {contacts.length === 0 && <tr><td colSpan={7} style={{ color: C.faint, textAlign: "center", padding: 24 }}>No contacts in view.</td></tr>}
            {contacts.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td style={{ fontSize: 13, color: C.sub }}>{c.title}</td>
                <td>{acct(c.accountId)?.name || "—"}</td>
                <td style={{ fontSize: 13 }}>{c.email || "—"}</td>
                <td style={{ fontSize: 13 }}>{c.phone || "—"}</td>
                <td style={{ fontSize: 12, color: C.faint, maxWidth: 220 }}>{c.notes}</td>
                {canEdit && (
                  <td style={{ whiteSpace: "nowrap" }}>
                    <IconBtn onClick={() => onEdit(c)}><Pencil size={14} /></IconBtn>
                    <IconBtn onClick={() => onDelete(c.id)} color={C.red}><Trash2 size={14} /></IconBtn>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ------------------------------ Actions ---------------------------- */

function Actions({ activities, acct, canEdit, toggle, onAdd, onDelete }) {
  const sorted = [...activities].sort((a, b) => (a.done - b.done) || (a.due || "9999").localeCompare(b.due || "9999"));
  return (
    <div>
      {canEdit && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
          <Btn onClick={onAdd}><Plus size={14} /> New action</Btn>
        </div>
      )}
      <Card style={{ padding: 8 }}>
        {sorted.length === 0 && <div style={{ color: C.faint, textAlign: "center", padding: 24, fontSize: 13 }}>Nothing here.</div>}
        {sorted.map((t) => (
          <div key={t.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 8px", borderBottom: `1px solid ${C.bg}` }}>
            <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} disabled={!canEdit} style={{ marginTop: 3, width: 16, height: 16, accentColor: C.green, cursor: canEdit ? "pointer" : "not-allowed" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, textDecoration: t.done ? "line-through" : "none", color: t.done ? C.faint : C.ink }}>{t.text}</div>
              <div style={{ fontSize: 11, color: !t.done && t.due && t.due < today() ? C.red : C.faint, marginTop: 2 }}>
                {t.due ? `Due ${t.due}` : "No date"}{t.accountId && acct(t.accountId) ? ` · ${acct(t.accountId).name}` : ""}
              </div>
            </div>
            {canEdit && <IconBtn onClick={() => onDelete(t.id)} color={C.red}><Trash2 size={14} /></IconBtn>}
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ------------------------------ Forecast --------------------------- */

function Forecast({ deals, accounts, settings, isAdmin, onQuota, onStageProb, onQuotaPlan, userById, users, isBD, me }) {
  const stageProb = settings.stageProb || STAGE_PROB;
  const [showStageProb, setShowStageProb] = useState(false);
  const [stageProbDraft, setStageProbDraft] = useState(stageProb);
  /* Quarter list draws from three sources so past quarters show up too:
     deal target-close dates, deal actual-close dates, and every month with
     real invoiced history on any account in view. */
  const quarterSortKey = (q) => { const [ql, y] = q.split(" "); return Number(y) * 4 + Number(ql.replace("Q", "")); };
  const historicalQuarters = [...new Set((accounts || []).flatMap((a) => Object.keys(a.revenue?.monthly || {}))).values()].map(monthToQuarter);
  const quarters = [...new Set([
    ...deals.map((d) => quarterOf(d.closeDate)),
    ...deals.map((d) => quarterOf(d.closedAt)),
    ...historicalQuarters,
  ])].filter((q) => q !== "No date").sort((a, b) => quarterSortKey(a) - quarterSortKey(b));
  const currentQuarter = quarterOf(today());
  const [quarter, setQuarter] = useState(quarters.includes(currentQuarter) ? currentQuarter : (quarters[quarters.length - 1] || ""));
  const [quotaDraft, setQuotaDraft] = useState(settings.monthlyQuota);

  /* Real historical revenue for the selected quarter — actual invoiced dollars,
     independent of whatever deal records do or don't exist for that period. */
  const qActualMonths = monthsInQuarter(quarter);
  const actualInvoiced = (accounts || []).reduce((s, a) => s + qActualMonths.reduce((s2, m) => s2 + (a.revenue?.monthly?.[m] || 0), 0), 0);
  const isPastQuarter = quarterSortKey(quarter) < quarterSortKey(currentQuarter);

  const qDeals = deals.filter((d) => quarterOf(d.closeDate) === quarter);
  const byCat = FORECAST_CATS.map((cat) => {
    const list = qDeals.filter((d) => d.forecastCat === cat);
    return { cat, count: list.length, value: list.reduce((s, d) => s + dealValue(d), 0), comm: list.reduce((s, d) => s + dealCommission(d, userById(d.ownerId)?.role), 0) };
  });
  const qMonths = monthsInQuarter(quarter);
  const byMonth = qMonths.map((m) => {
    const list = qDeals.filter((d) => d.closeDate && d.closeDate.slice(5, 7) + "-" + d.closeDate.slice(0, 4) === m);
    const catBreak = FORECAST_CATS.map((cat) => {
      const catList = list.filter((d) => d.forecastCat === cat);
      return { cat, count: catList.length, value: catList.reduce((s, d) => s + dealValue(d), 0) };
    });
    const actual = (accounts || []).reduce((s, a) => s + (a.revenue?.monthly?.[m] || 0), 0);
    return { month: m, count: list.length, value: list.reduce((s, d) => s + dealValue(d), 0), weighted: list.reduce((s, d) => s + dealWeighted(d, stageProb), 0), catBreak, actual };
  });

  const allReps = (users || []).filter((u) => OWNER_ROLES.includes(u.role));
  const reps = allReps.filter((u) => !isBD || u.id === me.id);
  const annualTarget = Number(settings.annualTarget) || 3500000;
  const repQuotaOverrides = settings.repQuotas || {};

  /* Default annual quota per rep = 25% over their historic invoiced achievement
     (real billed revenue on accounts they own). Reps with no invoice history yet
     fall back to an even split of the annual target, so a brand-new rep still
     has something sensible to be measured against. */
  const historicAchievement = (rep) => (accounts || []).filter((a) => a.ownerId === rep.id).reduce((s, a) => s + (a.revenue?.total || 0), 0);
  const isAreaDirector = (rep) => rep.role === "Area Director";

  /* Finishing the year: 30% over the trailing two quarters' actual achievement
     (the two quarters immediately before whichever is "current" today), used
     as an alternative planning basis to the full-history +25% figure. This is
     a combined target for the two remaining quarters, so per-quarter it's /2. */
  const trailingTwoQuarters = () => {
    const [ql, y] = currentQuarter.split(" ");
    const qn = Number(ql.replace("Q", ""));
    const prev1 = qn === 1 ? `Q4 ${Number(y) - 1}` : `Q${qn - 1} ${y}`;
    const [pl2, py2] = prev1.split(" ");
    const qn2 = Number(pl2.replace("Q", ""));
    const prev2 = qn2 === 1 ? `Q4 ${Number(py2) - 1}` : `Q${qn2 - 1} ${py2}`;
    return [prev2, prev1];
  };
  const trailingTwoQMonths = trailingTwoQuarters().flatMap(monthsInQuarter);
  const trailingTwoQAchievement = (rep) => (accounts || []).filter((a) => a.ownerId === rep.id)
    .reduce((s, a) => s + trailingTwoQMonths.reduce((s2, m) => s2 + (a.revenue?.monthly?.[m] || 0), 0), 0);
  const finishYearTarget = (rep) => trailingTwoQAchievement(rep) * 1.30;

  /* The Area Director carries no personal growth-inflated target — his line is
     simply whatever his unassigned-accounts book has actually achieved, carried
     forward flat. His real accountability is the grand total across the team. */
  const defaultAnnualQuota = (rep) => {
    if (isAreaDirector(rep)) return historicAchievement(rep);
    const hist = historicAchievement(rep);
    return hist > 0 ? hist * 1.25 : (allReps.length ? annualTarget / allReps.length : 0);
  };
  const annualQuotaFor = (rep) => Number(repQuotaOverrides[rep.id]) || defaultAnnualQuota(rep);
  const repQuarterlyQuota = (rep) => annualQuotaFor(rep) / 4;

  const [showQuotaPlan, setShowQuotaPlan] = useState(false);
  const [targetDraft, setTargetDraft] = useState(annualTarget);
  const [quotaOverrideDraft, setQuotaOverrideDraft] = useState(() => {
    const d = {}; allReps.forEach((r) => { d[r.id] = repQuotaOverrides[r.id] ?? Math.round(defaultAnnualQuota(r)); });
    return d;
  });

  const quarterQuota = reps.reduce((s, r) => s + repQuarterlyQuota(r), 0);
  const evenRepQuota = reps.length ? quarterQuota / reps.length : 0; // still used as a display fallback where no rep is selected

  const byRep = reps.map((r) => {
    const mine = qDeals.filter((d) => d.ownerId === r.id);
    const won = mine.filter((d) => d.forecastCat === "Closed");
    const forecastCat = mine.filter((d) => d.forecastCat === "Forecast");
    const upsideCat = mine.filter((d) => d.forecastCat === "Upside");
    const pipelineCat = mine.filter((d) => d.forecastCat === "Pipeline");
    const value = mine.reduce((s, d) => s + dealValue(d), 0);
    const weighted = mine.reduce((s, d) => s + dealWeighted(d, stageProb), 0);
    const closedVal = won.reduce((s, d) => s + dealValue(d), 0);
    const forecastVal_ = forecastCat.reduce((s, d) => s + dealValue(d), 0);
    const upsideVal = upsideCat.reduce((s, d) => s + dealValue(d), 0);
    const repQQuota = repQuarterlyQuota(r);
    // Real invoiced revenue for accounts this rep owns, for the selected quarter —
    // independent of deal records, so historical quarters still populate even
    // when there's no CRM deal history reaching that far back.
    const myAccounts = (accounts || []).filter((a) => a.ownerId === r.id);
    const actualInvoiced = myAccounts.reduce((s, a) => s + qActualMonths.reduce((s2, m) => s2 + (a.revenue?.monthly?.[m] || 0), 0), 0);
    const variance = actualInvoiced - closedVal;
    // Coverage computed two ways: forecast-basis (what the pipeline says) and
    // actual-basis (real billed revenue) — for a historical quarter the forecast
    // basis is usually 0 (no deal records reach that far back), so relying on it
    // alone would show 0% coverage even when the rep actually hit their number.
    const covForecast = repQQuota > 0 ? ((closedVal + forecastVal_) / repQQuota) * 100 : 0;
    const covActual = repQQuota > 0 ? (actualInvoiced / repQQuota) * 100 : 0;
    const cov = covForecast; // kept for any other code still reading the old field name
    return { r, count: mine.length, value, weighted, closedVal, forecastVal: forecastVal_, upsideVal, pipelineCount: pipelineCat.length, cov, covForecast, covActual, actualInvoiced, variance, repQQuota };
  }).sort((a, b) => (b.value || b.actualInvoiced) - (a.value || a.actualInvoiced));
  const forecastVal = byCat.find((c) => c.cat === "Forecast")?.value || 0;
  const closed = byCat.find((c) => c.cat === "Closed")?.value || 0;
  const upside = byCat.find((c) => c.cat === "Upside")?.value || 0;
  const coverage = quarterQuota > 0 ? ((forecastVal + closed) / quarterQuota) * 100 : 0;
  const coverageBest = quarterQuota > 0 ? ((forecastVal + closed + upside) / quarterQuota) * 100 : 0;

  return (
    <div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16, alignItems: "flex-end" }}>
        <Field label="Forecast period">
          <select style={{ ...inputStyle, width: "auto" }} value={quarter} onChange={(e) => setQuarter(e.target.value)}>
            {quarters.length === 0 && <option value="">No dated opportunities</option>}
            {quarters.map((q) => (
              <option key={q} value={q}>{q}{q === currentQuarter ? " — current" : quarterSortKey(q) < quarterSortKey(currentQuarter) ? " — historical" : ""}</option>
            ))}
          </select>
        </Field>
        <Field label="Annual company target">
          <div style={{ ...inputStyle, background: C.bg, width: 140 }}>{fmt(annualTarget)}</div>
        </Field>
        {isAdmin && (
          <Btn small kind="ghost" onClick={() => { setTargetDraft(annualTarget); const d = {}; allReps.forEach((r) => { d[r.id] = repQuotaOverrides[r.id] ?? Math.round(defaultAnnualQuota(r)); }); setQuotaOverrideDraft(d); setShowQuotaPlan(!showQuotaPlan); }}>
            {showQuotaPlan ? "Hide" : "Edit"} quota plan
          </Btn>
        )}
        {isAdmin && (
          <Btn small kind="ghost" onClick={() => { setStageProbDraft(stageProb); setShowStageProb(!showStageProb); }}>
            {showStageProb ? "Hide" : "Edit"} stage probabilities
          </Btn>
        )}
      </div>

      {isAdmin && showQuotaPlan && (
        <Card style={{ padding: 16, marginBottom: 16, borderLeft: `3px solid ${C.green}` }}>
          <SectionTitle>Annual quota plan</SectionTitle>
          <div style={{ fontSize: 12, color: C.sub, marginBottom: 10 }}>
            Default per-rep quota is 25% over their historic invoiced achievement (real billed revenue on accounts they own). Override any rep's number directly — it's saved as an explicit figure and won't drift if their historic achievement changes later.
          </div>
          <Field label="Annual company target (USD)">
            <input type="number" style={{ ...inputStyle, width: 160 }} value={targetDraft} onChange={(e) => setTargetDraft(e.target.value)} />
          </Field>
          <div style={{ fontSize: 11, color: C.faint, marginBottom: 8 }}>
            "Finish-year" is an alternative basis: 30% over the trailing two quarters ({trailingTwoQuarters().join(" + ")}) actual achievement, as a combined target for the two quarters remaining this year — use it instead of the full-history +25% figure if that's the more realistic planning basis right now.
          </div>
          <Card style={{ overflowX: "auto" }}>
            <table>
              <thead><tr><th>Rep</th><th>Historic achievement</th><th>Default (+25% all-time)</th><th>Finish-year (+30%, trailing 2Q)</th><th>Quota override (annual)</th><th>Quarterly</th></tr></thead>
              <tbody>
                {allReps.filter((r) => !isAreaDirector(r)).map((r) => {
                  const hist = historicAchievement(r);
                  const def = defaultAnnualQuota(r);
                  const fy = finishYearTarget(r);
                  return (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600 }}>{r.name}</td>
                      <td style={{ fontVariantNumeric: "tabular-nums" }}>{hist ? fmt(hist) : "—"}</td>
                      <td style={{ fontVariantNumeric: "tabular-nums", color: C.sub }}>{fmt(def)}</td>
                      <td style={{ fontVariantNumeric: "tabular-nums", color: C.teal }}>{fy ? fmt(fy) + " (combined)" : "—"}</td>
                      <td><input type="number" style={{ ...inputStyle, width: 130 }} value={quotaOverrideDraft[r.id] ?? Math.round(def)} onChange={(e) => setQuotaOverrideDraft({ ...quotaOverrideDraft, [r.id]: e.target.value })} /></td>
                      <td style={{ fontVariantNumeric: "tabular-nums", color: C.faint }}>{fmt((Number(quotaOverrideDraft[r.id]) || def) / 4)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>

          {allReps.filter(isAreaDirector).map((r) => (
            <Card key={r.id} style={{ padding: "10px 14px", marginTop: 10, background: C.bg, border: `1px dashed ${C.faint}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: C.sub }}>Area Director — not a personal target</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <div style={{ fontSize: 13 }}>
                  <strong>{r.name}</strong> — unassigned accounts (interim coverage), carried forward flat, no growth applied
                </div>
                <div style={{ fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>{fmt(historicAchievement(r))}</div>
              </div>
            </Card>
          ))}

          <Card style={{ padding: "12px 16px", marginTop: 10, background: C.blueDeep, color: "#fff" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.8 }}>Total — the Area Director's number</div>
            <div style={{ display: "flex", gap: 24, marginTop: 6, flexWrap: "wrap" }}>
              <div><div style={{ fontSize: 20, fontWeight: 800 }}>{fmt(allReps.reduce((s, r) => s + (Number(quotaOverrideDraft[r.id]) || defaultAnnualQuota(r)), 0))}</div><div style={{ fontSize: 10.5, opacity: 0.75 }}>Team quota total (annual)</div></div>
              <div><div style={{ fontSize: 20, fontWeight: 800 }}>{fmt(annualTarget)}</div><div style={{ fontSize: 10.5, opacity: 0.75 }}>Company target</div></div>
            </div>
          </Card>
          {(() => {
            const totalQuota = allReps.reduce((s, r) => s + (Number(quotaOverrideDraft[r.id]) || defaultAnnualQuota(r)), 0);
            const gap = (Number(targetDraft) || 0) - totalQuota;
            return Math.abs(gap) > 1 ? (
              <div style={{ fontSize: 12, color: C.amber, marginTop: 8 }}>Sum of rep quotas ({fmt(totalQuota)}) is {gap > 0 ? fmt(gap) + " below" : fmt(-gap) + " above"} the annual target ({fmt(Number(targetDraft) || 0)}) — that's expected when growth is calculated bottom-up per rep rather than divided top-down; adjust individual overrides if you want the two to match exactly.</div>
            ) : (
              <div style={{ fontSize: 12, color: C.green, marginTop: 8 }}>Sum of rep quotas matches the annual target.</div>
            );
          })()}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
            <Btn small onClick={() => { onQuotaPlan(Number(targetDraft) || 0, quotaOverrideDraft); setShowQuotaPlan(false); }}>Save quota plan</Btn>
          </div>
        </Card>
      )}

      {isAdmin && showStageProb && (
        <Card style={{ padding: 16, marginBottom: 16, borderLeft: `3px solid ${C.blue}` }}>
          <SectionTitle>Stage win-probabilities</SectionTitle>
          <div style={{ fontSize: 12, color: C.sub, marginBottom: 10 }}>
            Used to compute every deal's Weighted pipeline figure — set here once, applied automatically the next time a deal moves stage (existing deals keep whatever probability they were already assigned).
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {STAGES.filter((s) => s !== "Won" && s !== "Lost").map((s) => (
              <Field key={s} label={s}>
                <input type="number" min="0" max="100" style={{ ...inputStyle, width: 80 }} value={stageProbDraft[s]} onChange={(e) => setStageProbDraft({ ...stageProbDraft, [s]: Number(e.target.value) || 0 })} />
              </Field>
            ))}
            <div style={{ marginBottom: 12 }}>
              <Btn small onClick={() => { onStageProb(stageProbDraft); setShowStageProb(false); }}>Save probabilities</Btn>
            </div>
          </div>
          <div style={{ fontSize: 11, color: C.faint }}>Won is always 100%, Lost is always 0% — not editable, since those are certainties by definition.</div>
        </Card>
      )}

      <Card style={{ padding: 16, marginBottom: 16 }}>
        <SectionTitle>Quota coverage — {quarter || "select a period"} (quarterly quota {fmt(quarterQuota)})</SectionTitle>
        <div style={{ background: C.bg, borderRadius: 4, height: 26, position: "relative", overflow: "hidden" }}>
          <div style={{ width: `${Math.min(coverageBest, 100)}%`, height: "100%", background: "#BFD3E4", position: "absolute" }} />
          <div style={{ width: `${Math.min(coverage, 100)}%`, height: "100%", background: coverage >= 100 ? C.green : C.blue, position: "absolute", transition: "width .3s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.sub, marginTop: 6 }}>
          <span>Closed + Forecast: <strong style={{ color: C.ink }}>{fmt(closed + forecastVal)}</strong> ({coverage.toFixed(0)}%)</span>
          <span>incl. Upside: {fmt(closed + forecastVal + upside)} ({coverageBest.toFixed(0)}%)</span>
        </div>
      </Card>

      <Card style={{ padding: 16, marginBottom: 16, borderLeft: `3px solid ${C.green}` }}>
        <SectionTitle>Actual invoiced (real) — {quarter || "select a period"}</SectionTitle>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.green }}>{fmt(actualInvoiced)}</div>
        <div style={{ fontSize: 12, color: C.faint, marginTop: 4 }}>
          {isPastQuarter
            ? "This is billed revenue from the invoice history, not a projection — the authoritative figure for a closed quarter."
            : actualInvoiced > 0
            ? "Billed so far this quarter, from the invoice history. Will keep updating as invoices land."
            : "No invoiced revenue recorded yet for this quarter."}
        </div>
      </Card>

      <Card style={{ overflowX: "auto" }}>
        <table>
          <thead><tr><th>Forecast category</th><th>Opportunities</th><th>Revenue</th><th>Commission</th></tr></thead>
          <tbody>
            {byCat.map((c) => (
              <tr key={c.cat}>
                <td><Tag color={fcatColor[c.cat]}>{c.cat}</Tag></td>
                <td>{c.count || "—"}</td>
                <td style={{ fontVariantNumeric: "tabular-nums" }}>{c.count ? fmt(c.value) : "—"}</td>
                <td style={{ fontVariantNumeric: "tabular-nums", color: C.teal }}>{c.count ? fmt(c.comm) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div style={{ marginTop: 20, marginBottom: 8, fontSize: 13, fontWeight: 700, color: C.ink }}>Monthly breakdown within {quarter || "select a period"}</div>
      <div style={{ fontSize: 11, color: C.faint, marginBottom: 10 }}>Splits the quarter's opportunities by the month of their expected close date, so you can see which month is carrying the quarter.</div>
      <Card style={{ overflowX: "auto", marginBottom: 20 }}>
        <table>
          <thead><tr><th>Month</th><th>Opportunities</th><th>Pipeline</th><th>Upside</th><th>Forecast</th><th>Closed</th><th>Total</th><th>Weighted</th><th>Actual invoiced</th></tr></thead>
          <tbody>
            {byMonth.length === 0 && <tr><td colSpan={9} style={{ color: C.faint, textAlign: "center", padding: 20 }}>Select a quarter to see its monthly split.</td></tr>}
            {byMonth.map((m) => (
              <tr key={m.month}>
                <td style={{ fontWeight: 600 }}>{formatMonth(m.month)}</td>
                <td>{m.count || "—"}</td>
                {["Pipeline", "Upside", "Forecast", "Closed"].map((cat) => {
                  const c = m.catBreak.find((x) => x.cat === cat);
                  return <td key={cat} style={{ fontVariantNumeric: "tabular-nums", color: fcatColor[cat] }}>{c && c.count ? fmt(c.value) : "—"}</td>;
                })}
                <td style={{ fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>{m.count ? fmt(m.value) : "—"}</td>
                <td style={{ fontVariantNumeric: "tabular-nums", color: C.sub }}>{m.count ? fmt(m.weighted) : "—"}</td>
                <td style={{ fontVariantNumeric: "tabular-nums", color: C.green, fontWeight: m.actual ? 700 : 400 }}>{m.actual ? fmt(m.actual) : "—"}</td>
              </tr>
            ))}
            {byMonth.length > 0 && (
              <tr style={{ borderTop: `2px solid ${C.blueDeep}`, fontWeight: 700 }}>
                <td>Quarter total</td>
                <td>{byMonth.reduce((s, m) => s + m.count, 0)}</td>
                {["Pipeline", "Upside", "Forecast", "Closed"].map((cat) => (
                  <td key={cat} style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(byMonth.reduce((s, m) => s + (m.catBreak.find((x) => x.cat === cat)?.value || 0), 0))}</td>
                ))}
                <td style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(byMonth.reduce((s, m) => s + m.value, 0))}</td>
                <td style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(byMonth.reduce((s, m) => s + m.weighted, 0))}</td>
                <td style={{ fontVariantNumeric: "tabular-nums", color: C.green }}>{fmt(byMonth.reduce((s, m) => s + m.actual, 0))}</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <div style={{ marginTop: 20, marginBottom: 8, fontSize: 13, fontWeight: 700, color: C.ink }}>Forecast by rep — {quarter || "select a period"}</div>
      <div style={{ fontSize: 11, color: C.faint, marginBottom: 10 }}>
        Quota coverage per rep is measured against their individual annual quota (25% over historic invoiced achievement by default, or an admin override), divided by 4 for the quarter — shown two ways: Coverage (forecast) uses the CRM's deal records (Closed + Forecast category), which reads low or zero for historical quarters with no matching deal history; Coverage (actual) uses real invoiced revenue instead, so it stays meaningful even for periods before any deal existed. "Closed (deals)" is what the CRM's deal records show as Won; "Actual invoiced" is real billed revenue from the invoice history for accounts this rep owns — the two should reconcile, and "Match" flags it when they don't (e.g. a deal marked Won that hasn't actually been invoiced yet, or invoiced revenue with no matching deal record).
      </div>
      <Card style={{ overflowX: "auto" }}>
        <table>
          <thead><tr><th>Rep</th><th>Open deals</th><th>Pipeline (unweighted)</th><th>Weighted</th><th>Upside</th><th>Forecast</th><th>Closed (deals)</th><th>Actual invoiced</th><th>Match</th><th>Coverage (forecast)</th><th>Coverage (actual)</th></tr></thead>
          <tbody>
            {byRep.length === 0 && <tr><td colSpan={11} style={{ color: C.faint, textAlign: "center", padding: 20 }}>No reps in view.</td></tr>}
            {byRep.map(({ r, count, value, weighted, closedVal, forecastVal, upsideVal, covForecast, covActual, actualInvoiced, variance }) => (
              <tr key={r.id} style={isAreaDirector(r) ? { background: C.bg } : undefined}>
                <td>
                  <div style={{ fontWeight: 600 }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: C.faint }}>{isAreaDirector(r) ? "Unassigned accounts (interim) — not a personal target" : (r.region || "All territories")}</div>
                </td>
                <td>{count}</td>
                <td style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(value)}</td>
                <td style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{fmt(weighted)}</td>
                <td style={{ fontVariantNumeric: "tabular-nums", color: C.amber }}>{upsideVal ? fmt(upsideVal) : "—"}</td>
                <td style={{ fontVariantNumeric: "tabular-nums", color: C.blue, fontWeight: 600 }}>{forecastVal ? fmt(forecastVal) : "—"}</td>
                <td style={{ fontVariantNumeric: "tabular-nums", color: C.green, fontWeight: 700 }}>{closedVal ? fmt(closedVal) : "—"}</td>
                <td style={{ fontVariantNumeric: "tabular-nums", color: C.green, fontWeight: 700 }}>{actualInvoiced ? fmt(actualInvoiced) : "—"}</td>
                <td>
                  {!closedVal && !actualInvoiced ? (
                    <span style={{ color: C.faint }}>—</span>
                  ) : Math.abs(variance) < 1 ? (
                    <Tag color={C.green}>Matches</Tag>
                  ) : (
                    <Tag color={C.amber}>{variance > 0 ? "+" : ""}{fmt(variance)}</Tag>
                  )}
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 60, height: 8, background: C.bg, borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: `${Math.min(covForecast, 100)}%`, height: "100%", background: covForecast >= 100 ? C.green : C.blue }} />
                    </div>
                    <span style={{ fontSize: 12, fontVariantNumeric: "tabular-nums", color: covForecast >= 100 ? C.green : C.sub, fontWeight: 600 }}>{covForecast.toFixed(0)}%</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 60, height: 8, background: C.bg, borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: `${Math.min(covActual, 100)}%`, height: "100%", background: covActual >= 100 ? C.green : C.teal }} />
                    </div>
                    <span style={{ fontSize: 12, fontVariantNumeric: "tabular-nums", color: covActual >= 100 ? C.green : C.sub, fontWeight: 600 }}>{covActual.toFixed(0)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ------------------------------ Insights --------------------------- */

function Insights({ deals, accounts, quotes, catalog, acct, userById, users, me, isBD, isAdmin, roleOf, payouts }) {
  const [iview, setIview] = useState("overview");
  const MONTH_ORDER = ["01","02","03","04","05","06","07","08","09","10","11","12"];
  const allMonths = [...new Set(accounts.flatMap((a) => Object.keys(a.revenue?.monthly || {})))]
    .sort((a, b) => { const [ma, ya] = a.split("-"); const [mb, yb] = b.split("-"); return ya === yb ? MONTH_ORDER.indexOf(ma) - MONTH_ORDER.indexOf(mb) : Number(ya) - Number(yb); });
  const monthlyTotals = allMonths.map((m) => ({ month: m, value: accounts.reduce((s, a) => s + (a.revenue?.monthly?.[m] || 0), 0) }));
  const topAccountsByRevenue = accounts.filter((a) => a.revenue?.total > 0).sort((a, b) => b.revenue.total - a.revenue.total).slice(0, 8);
  const totalInvoiced = accounts.reduce((s, a) => s + (a.revenue?.total || 0), 0);
  const closedDeals = deals.filter((d) => d.stage === "Won" || d.stage === "Lost");
  const won = deals.filter((d) => d.stage === "Won");
  const open = deals.filter((d) => d.stage !== "Won" && d.stage !== "Lost");
  const winRate = closedDeals.length ? (won.length / closedDeals.length) * 100 : null;
  const avgSize = won.length ? won.reduce((s, d) => s + dealValue(d), 0) / won.length : null;
  const cycles = won.filter((d) => d.createdAt && d.closedAt).map((d) => (new Date(d.closedAt) - new Date(d.createdAt)) / 86400000);
  const avgCycle = cycles.length ? cycles.reduce((a, b) => a + b, 0) / cycles.length : null;
  const rfqTimes = (quotes || []).filter((q) => q.rfqDate && q.sentAt).map((q) => daysBetween(q.rfqDate, q.sentAt));
  const avgRfq = rfqTimes.length ? rfqTimes.reduce((a, b) => a + b, 0) / rfqTimes.length : null;
  const lossAgg = {};
  deals.filter((d) => d.stage === "Lost" && d.lossReason).forEach((d) => { lossAgg[d.lossReason] = (lossAgg[d.lossReason] || 0) + dealValue(d); });
  const byLoss = Object.entries(lossAgg).map(([label, value]) => ({ label, value }));

  const byRegion = REGIONS.map((r) => {
    const list = open.filter((d) => acct(d.accountId)?.region === r);
    return { label: r, value: list.reduce((s, d) => s + dealValue(d), 0), count: list.length };
  }).filter((x) => x.count > 0);

  const byProduct = Object.keys(PRODUCTS).map((p) => {
    let value = 0, count = 0;
    open.forEach((d) => (d.lines || []).forEach((l) => { if (l.product === p) { value += Number(l.value) || 0; count++; } }));
    return { label: PRODUCTS[p].short, value, count };
  }).filter((x) => x.count > 0);

  const ownersAgg = {};
  open.forEach((d) => {
    const name = userById(d.ownerId)?.name || "Unassigned";
    ownersAgg[name] = (ownersAgg[name] || 0) + dealValue(d);
  });
  const byOwner = Object.entries(ownersAgg).map(([label, value]) => ({ label, value }));

  const BarBlock = ({ title, rows, color }) => {
    const max = Math.max(...rows.map((r) => r.value), 1);
    return (
      <Card style={{ padding: 16, flex: "1 1 300px" }}>
        <SectionTitle>{title}</SectionTitle>
        {rows.length === 0 && <div style={{ fontSize: 13, color: C.faint }}>No open pipeline.</div>}
        {rows.map((r) => (
          <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 110, fontSize: 12, color: C.sub, flexShrink: 0 }}>{r.label}</div>
            <div style={{ flex: 1, background: C.bg, borderRadius: 3, height: 18 }}>
              <div style={{ width: `${(r.value / max) * 100}%`, minWidth: 4, height: "100%", background: color, borderRadius: 3 }} />
            </div>
            <div style={{ width: 90, fontSize: 12, textAlign: "right", fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{fmt(r.value)}</div>
          </div>
        ))}
      </Card>
    );
  };

  const kpi = (label, value, note) => (
    <Card style={{ padding: "14px 16px", flex: "1 1 180px" }}>
      <div style={{ fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", color: C.sub, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 23, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{value}</div>
      {note && <div style={{ fontSize: 12, color: C.faint, marginTop: 2 }}>{note}</div>}
    </Card>
  );

  const IPill = ({ id, label }) => (
    <button onClick={() => setIview(id)} style={{ background: iview === id ? C.blueDeep : C.surface, color: iview === id ? "#fff" : C.sub, border: `1px solid ${iview === id ? C.blueDeep : C.line}`, borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{label}</button>
  );

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        <IPill id="overview" label="Overview" />
        <IPill id="report" label="Generate Report" />
      </div>

      {iview === "report" && (
        <ReportBuilder
          data={{ deals, accounts, quotes, catalog, acct, userById, allMonths, monthlyTotals, topAccountsByRevenue, totalInvoiced, byRegion, byProduct, byOwner, byLoss, winRate, avgSize, avgCycle, avgRfq, closedDeals, won }}
          users={users} me={me} isBD={isBD} isAdmin={isAdmin} roleOf={roleOf} payouts={payouts}
        />
      )}

      {iview === "overview" && <div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        {kpi("Win rate", winRate === null ? "—" : `${winRate.toFixed(0)}%`, `${won.length} won / ${closedDeals.length} closed`)}
        {kpi("Avg deal size (won)", avgSize === null ? "—" : fmt(avgSize), "Closed-won only")}
        {kpi("Avg sales cycle", avgCycle === null ? "—" : `${Math.round(avgCycle)} days`, "Created → closed")}
        {kpi("RFQ → quote", avgRfq === null ? "—" : `${avgRfq.toFixed(1)} days`, `${rfqTimes.length} quotes measured`)}
        {kpi("Accounts in view", accounts.length, "Current scope")}
      </div>

      {allMonths.length > 0 && (
        <Card style={{ padding: 16, marginBottom: 16 }}>
          <SectionTitle>Historic invoiced revenue — {fmt(totalInvoiced)} total, {formatMonth(allMonths[0])} to {formatMonth(allMonths[allMonths.length - 1])}</SectionTitle>
          <div style={{ fontSize: 11, color: C.faint, marginBottom: 10 }}>From Banner's actual invoicing history, reconciled into account records — this is billed revenue, not pipeline estimate.</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 90, overflowX: "auto", paddingBottom: 2 }}>
            {(() => {
              const max = Math.max(...monthlyTotals.map((m) => m.value), 1);
              return monthlyTotals.map((m) => (
                <div key={m.month} title={`${formatMonth(m.month)}: ${fmt(m.value)}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "0 0 22px" }}>
                  <div style={{ width: 14, height: Math.max((m.value / max) * 74, m.value > 0 ? 3 : 0), background: m.value > 0 ? C.teal : C.bg, borderRadius: "2px 2px 0 0" }} />
                  <div style={{ fontSize: 8, color: C.faint, marginTop: 3, writingMode: "vertical-rl", transform: "rotate(180deg)", height: 30 }}>{formatMonth(m.month)}</div>
                </div>
              ));
            })()}
          </div>
        </Card>
      )}

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <BarBlock title="Open pipeline by region" rows={byRegion} color={C.blue} />
        <BarBlock title="Open pipeline by product line" rows={byProduct} color={C.teal} />
        <BarBlock title="Open pipeline by owner" rows={byOwner} color={C.amber} />
        <BarBlock title="Lost revenue by reason" rows={byLoss} color={C.red} />
        {topAccountsByRevenue.length > 0 && (
          <BarBlock title="Top accounts by invoiced revenue (all-time)" rows={topAccountsByRevenue.map((a) => ({ label: a.name, value: a.revenue.total }))} color={C.green} />
        )}
      </div>
      </div>}
    </div>
  );
}

/* ---------------------------- Report Builder ------------------------ */

function ReportBuilder({ data, users, me, isBD, isAdmin, roleOf, payouts }) {
  const myCeiling = maxClassFor(me.role);
  const availableSections = REPORT_SECTIONS.filter((s) => {
    if (classRank(s.minClass) > classRank(myCeiling)) return false;
    if (s.roles && !s.roles.includes(me.role)) return false;
    return true;
  });
  const [selected, setSelected] = useState(new Set(availableSections.filter((s) => s.minClass === "Public" || s.id === "kpis").map((s) => s.id)));
  const [classification, setClassification] = useState(isBD ? "Internal" : "Internal");
  const [distribution, setDistribution] = useState(new Set(me.id ? [me.id] : []));
  const [title, setTitle] = useState("Africa Business Development Report");
  const [preview, setPreview] = useState(false);

  // Date range for time-series sections (revenue trend, funnel, monthly tracking).
  const allAvailableMonths = [...new Set([...data.allMonths, ...FUNNEL_SEED.months])].sort((a, b) => monthKey(a) - monthKey(b));
  const [dateFrom, setDateFrom] = useState(allAvailableMonths[0] || "");
  const [dateTo, setDateTo] = useState(allAvailableMonths[allAvailableMonths.length - 1] || "");

  const toggleSection = (id) => setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleDist = (id) => setDistribution((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  // Distribution list is itself access-controlled: you can't distribute a
  // report to someone whose role ceiling is below the chosen classification.
  const eligibleRecipients = users.filter((u) => classRank(maxClassFor(u.role)) >= classRank(classification));

  const setClass = (c) => {
    if (classRank(c) > classRank(myCeiling)) return; // can't exceed your own ceiling
    setClassification(c);
    // drop any selected sections that now exceed the new (lower) classification, and any ineligible recipients
    setSelected((prev) => new Set([...prev].filter((id) => {
      const s = REPORT_SECTIONS.find((x) => x.id === id);
      return s && classRank(s.minClass) <= classRank(c);
    })));
    setDistribution((prev) => new Set([...prev].filter((id) => classRank(maxClassFor(users.find((u) => u.id === id)?.role)) >= classRank(c))));
  };

  const canGenerate = selected.size > 0 && distribution.size > 0;

  return (
    <div>
      <div style={{ fontSize: 13, color: C.sub, marginBottom: 16 }}>
        Build a distributable report from live CRM data. Available sections and the maximum classification level are capped by your role ({me.role} → up to <strong>{myCeiling}</strong>).
      </div>

      <Card style={{ padding: 16, marginBottom: 16 }}>
        <SectionTitle>Report title</SectionTitle>
        <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} />
      </Card>

      <Card style={{ padding: 16, marginBottom: 16 }}>
        <SectionTitle>Reporting period</SectionTitle>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <Field label="From" flex>
            <select style={inputStyle} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}>
              {allAvailableMonths.map((m) => <option key={m} value={m} disabled={monthKey(m) > monthKey(dateTo)}>{formatMonth(m)}</option>)}
            </select>
          </Field>
          <Field label="To" flex>
            <select style={inputStyle} value={dateTo} onChange={(e) => setDateTo(e.target.value)}>
              {allAvailableMonths.map((m) => <option key={m} value={m} disabled={monthKey(m) < monthKey(dateFrom)}>{formatMonth(m)}</option>)}
            </select>
          </Field>
          <Btn small kind="ghost" onClick={() => { setDateFrom(allAvailableMonths[0] || ""); setDateTo(allAvailableMonths[allAvailableMonths.length - 1] || ""); }}>Full range</Btn>
        </div>
        <div style={{ fontSize: 11, color: C.faint, marginTop: 6 }}>Applies to the revenue trend, BD funnel, and monthly tracking sections. KPI, pipeline and loss-reason sections reflect the CRM's current live state regardless of this range.</div>
      </Card>

      <Card style={{ padding: 16, marginBottom: 16 }}>
        <SectionTitle>Classification</SectionTitle>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CLASSIFICATIONS.map((c) => {
            const allowed = classRank(c) <= classRank(myCeiling);
            return (
              <button key={c} disabled={!allowed} onClick={() => setClass(c)}
                style={{
                  background: classification === c ? CLASS_COLOR[c] : "#fff", color: classification === c ? "#fff" : allowed ? CLASS_COLOR[c] : C.faint,
                  border: `1.5px solid ${allowed ? CLASS_COLOR[c] : C.line}`, borderRadius: 5, padding: "7px 14px", fontSize: 12.5, fontWeight: 700,
                  cursor: allowed ? "pointer" : "not-allowed", fontFamily: "inherit", opacity: allowed ? 1 : 0.5,
                }}>
                {c}{!allowed && " 🔒"}
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: C.faint, marginTop: 8 }}>
          Higher classifications unlock more sensitive sections (named commission figures, individual rep performance) but also restrict who the report may be distributed to below.
        </div>
      </Card>

      <Card style={{ padding: 16, marginBottom: 16 }}>
        <SectionTitle>Sections to include</SectionTitle>
        {REPORT_SECTIONS.map((s) => {
          const unlocked = availableSections.some((a) => a.id === s.id) && classRank(s.minClass) <= classRank(classification);
          return (
            <label key={s.id} style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 0", fontSize: 13, color: unlocked ? C.ink : C.faint, cursor: unlocked ? "pointer" : "not-allowed" }}>
              <input type="checkbox" disabled={!unlocked} checked={selected.has(s.id)} onChange={() => toggleSection(s.id)} />
              {s.label}
              <Tag color={CLASS_COLOR[s.minClass]}>{s.minClass}+</Tag>
              {!unlocked && <span style={{ fontSize: 11 }}>— raise classification{s.roles ? " / role-restricted" : ""} to include</span>}
            </label>
          );
        })}
      </Card>

      <Card style={{ padding: 16, marginBottom: 16 }}>
        <SectionTitle>Distribution list</SectionTitle>
        <div style={{ fontSize: 11, color: C.faint, marginBottom: 8 }}>Only people whose role ceiling meets or exceeds "{classification}" are eligible recipients.</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {eligibleRecipients.map((u) => (
            <label key={u.id} style={{ display: "flex", alignItems: "center", gap: 6, border: `1px solid ${distribution.has(u.id) ? C.blue : C.line}`, background: distribution.has(u.id) ? C.bg : "#fff", borderRadius: 5, padding: "5px 10px", fontSize: 12.5, cursor: "pointer" }}>
              <input type="checkbox" checked={distribution.has(u.id)} onChange={() => toggleDist(u.id)} />
              {u.name} <span style={{ color: C.faint }}>({u.role})</span>
            </label>
          ))}
        </div>
        {eligibleRecipients.length < users.length && (
          <div style={{ fontSize: 11, color: C.amber, marginTop: 8 }}>{users.length - eligibleRecipients.length} user(s) hidden — their role ceiling is below "{classification}".</div>
        )}
      </Card>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Btn onClick={() => canGenerate && setPreview(true)} disabled={!canGenerate}>Generate report</Btn>
      </div>

      {preview && (
        <ReportDocModal
          title={title} classification={classification} sections={[...selected]}
          distribution={[...distribution].map((id) => users.find((u) => u.id === id)).filter(Boolean)}
          preparedBy={me} data={data} users={users} roleOf={roleOf} payouts={payouts}
          dateFrom={dateFrom} dateTo={dateTo}
          onClose={() => setPreview(false)}
        />
      )}
    </div>
  );
}


function computeCommissionSummary(data, users, roleOf, payouts) {
  const owners = users.filter((u) => OWNER_ROLES.includes(u.role));
  const q = quarterOf(today());
  return owners.map((o) => {
    const relevant = data.deals.filter((d) => d.ownerId === o.id || (d.agreement && d.agreement.assistBDId === o.id));
    const won = relevant.filter((d) => d.stage === "Won");
    const collected = won.filter((d) => d.collectedAt);
    const shareOf = (d) => commissionShare(d, o.id, roleOf);
    const maturedAll = collected.reduce((s, d) => s + shareOf(d), 0);
    const paid = payouts.filter((p) => p.ownerId === o.id).reduce((s, p) => s + (Number(p.amount) || 0), 0);
    return { name: o.name, maturedAll, payable: Math.max(0, maturedAll - paid) };
  }).filter((r) => r.maturedAll > 0);
}

function ReportDocModal({ title, classification, sections, distribution, preparedBy, data, users, roleOf, payouts, dateFrom, dateTo, onClose }) {
  const genDate = today();
  const period = dateFrom && dateTo ? `${formatMonth(dateFrom)} to ${formatMonth(dateTo)}` : (data.allMonths.length ? `${formatMonth(data.allMonths[0])} to ${formatMonth(data.allMonths[data.allMonths.length - 1])}` : "Current pipeline snapshot");
  const commissionRows = sections.includes("commission") ? computeCommissionSummary(data, users, roleOf, payouts) : [];

  // Filter time-series sections down to the chosen range without touching the parent's full-range data.
  const rangedMonths = data.allMonths.filter((m) => monthInRange(m, dateFrom, dateTo));
  const rangedMonthlyTotals = data.monthlyTotals.filter((m) => monthInRange(m.month, dateFrom, dateTo));
  const rangedRevenueTotal = rangedMonthlyTotals.reduce((s, m) => s + m.value, 0);
  const rangedFunnel = filterFunnel(dateFrom, dateTo);
  const monthlyTableMonths = [...new Set([...rangedMonths, ...rangedFunnel.months])].sort((a, b) => monthKey(a) - monthKey(b));
  const stageTracking = sections.includes("stageTracking") ? buildStageTracking(data.deals, dateFrom, dateTo) : null;
  const invoiceAging = sections.includes("invoiceAging") ? buildInvoiceAging(data.deals, data.quotes) : null;
  const repDetail = sections.includes("repDetail") ? buildRepDetail(data.deals, data.quotes, users, roleOf, payouts) : null;
  const productDetail = sections.includes("productDetail") ? buildProductDetail(data.deals, data.quotes, data.catalog) : null;
  const accountDetail = sections.includes("accountDetail") ? buildAccountDetail(data.accounts, data.deals, data.userById) : null;
  const aircraftDetail = sections.includes("aircraftDetail") ? buildAircraftDetail(data.accounts, data.deals) : null;
  const rawMatrix = sections.includes("rawMatrix") ? buildRawMatrix(data.accounts, dateFrom, dateTo) : null;

  const downloadPdf = () => {
    try {
      const pdf = buildReportPdf({ title, classification, sections, distribution, preparedBy, data, genDate, period, dateFrom, dateTo, commissionRows, stageTracking, invoiceAging, repDetail, productDetail, accountDetail, aircraftDetail, rawMatrix });
      const bytes = new Uint8Array(pdf.length);
      for (let i = 0; i < pdf.length; i++) bytes[i] = pdf.charCodeAt(i) & 0xff;
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const el = document.createElement("a");
      el.href = url;
      el.download = `${title.replace(/[^a-z0-9]+/gi, "_")}_${genDate}.pdf`;
      document.body.appendChild(el);
      el.click();
      document.body.removeChild(el);
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch (e) { console.error("Report PDF generation failed", e); }
  };

  const SecTitle = ({ children }) => <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "#0C3557", margin: "16px 0 8px" }}>{children}</div>;
  const barRow = (label, value, max, color) => (
    <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
      <div style={{ width: 130, fontSize: 11.5, color: "#5A6B78", flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, background: "#F4F6F8", borderRadius: 3, height: 14 }}><div style={{ width: `${max ? (value / max) * 100 : 0}%`, minWidth: value > 0 ? 3 : 0, height: "100%", background: color, borderRadius: 3 }} /></div>
      <div style={{ width: 80, fontSize: 11.5, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(value)}</div>
    </div>
  );

  return (
    <Modal title={`Report preview — ${title}`} onClose={onClose} wide>
      <div style={{ border: "1px solid #DDE3E9", borderRadius: 6, overflow: "hidden", background: "#fff" }}>
        <div style={{ background: "#0C3557", color: "#fff", padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Plane size={22} style={{ transform: "rotate(-45deg)", color: "#3EC9B0" }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 800 }}>BANNER AIRCRAFT INTERNATIONAL</div>
              <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#3EC9B0" }}>Africa Business Development</div>
            </div>
          </div>
          <div style={{ fontSize: 19, fontWeight: 800, marginTop: 12 }}>{title}</div>
        </div>
        <div style={{ background: CLASS_COLOR[classification], color: "#fff", padding: "6px 20px", fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textAlign: "center" }}>
          {classification.toUpperCase()} — NOT FOR DISTRIBUTION OUTSIDE THE LIST BELOW
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 10, padding: "14px 20px", borderBottom: "1px solid #E4E9EE" }}>
          <div><div style={{ fontSize: 9, color: "#5A6B78", textTransform: "uppercase" }}>Prepared by</div><div style={{ fontWeight: 600 }}>{preparedBy.name}</div></div>
          <div><div style={{ fontSize: 9, color: "#5A6B78", textTransform: "uppercase" }}>Generated</div><div style={{ fontWeight: 600 }}>{genDate}</div></div>
          <div><div style={{ fontSize: 9, color: "#5A6B78", textTransform: "uppercase" }}>Period</div><div style={{ fontWeight: 600 }}>{period}</div></div>
          <div><div style={{ fontSize: 9, color: "#5A6B78", textTransform: "uppercase" }}>Distribution</div><div style={{ fontWeight: 600 }}>{distribution.map((u) => u.name).join(", ") || "—"}</div></div>
        </div>

        <div style={{ padding: "4px 20px 16px" }}>
          {sections.includes("kpis") && (
            <>
              <SecTitle>Executive KPIs</SecTitle>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                {[["Win rate", data.winRate === null ? "—" : `${data.winRate.toFixed(0)}%`], ["Avg deal size", data.avgSize === null ? "—" : fmt(data.avgSize)], ["Avg cycle", data.avgCycle === null ? "—" : `${Math.round(data.avgCycle)}d`], ["RFQ→quote", data.avgRfq === null ? "—" : `${data.avgRfq.toFixed(1)}d`]].map(([l, v]) => (
                  <div key={l} style={{ minWidth: 100 }}><div style={{ fontSize: 18, fontWeight: 800 }}>{v}</div><div style={{ fontSize: 10, color: "#5A6B78", textTransform: "uppercase" }}>{l}</div></div>
                ))}
              </div>
            </>
          )}

          {sections.includes("revenue") && rangedMonthlyTotals.length > 0 && (
            <>
              <SecTitle>Historic invoiced revenue — {fmt(rangedRevenueTotal)} in range ({period})</SecTitle>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 60 }}>
                {(() => { const max = Math.max(...rangedMonthlyTotals.map((m) => m.value), 1); return rangedMonthlyTotals.map((m) => (
                  <div key={m.month} title={`${formatMonth(m.month)}: ${fmt(m.value)}`} style={{ width: 10, height: Math.max((m.value / max) * 50, m.value > 0 ? 2 : 0), background: "#0E6E6E", borderRadius: "1px 1px 0 0" }} />
                )); })()}
              </div>
            </>
          )}

          {sections.includes("funnel") && (
            <>
              <SecTitle>BD funnel — RFQ → Quote → Sales Order → Invoice</SecTitle>
              <div style={{ fontSize: 10.5, color: "#B8720F", marginBottom: 6 }}>Scope note: this funnel export's invoiced total matches a single account's invoice history — confirm whether it represents one account or the full territory before presenting externally.</div>
              {(() => {
                const rfq = rangedFunnel.rfqUniquePN.reduce((a, b) => a + b, 0);
                const quoted = rangedFunnel.quotedUniquePN.reduce((a, b) => a + b, 0);
                const so = rangedFunnel.totalSOCount.reduce((a, b) => a + b, 0);
                const soVal = rangedFunnel.totalSOValue.reduce((a, b) => a + b, 0);
                const quotedVal = rangedFunnel.totalQuotesValue.reduce((a, b) => a + b, 0);
                return (
                  <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                    <div><div style={{ fontSize: 16, fontWeight: 800 }}>{rfq}</div><div style={{ fontSize: 10, color: "#5A6B78" }}>RFQ lines (unique PN)</div></div>
                    <div><div style={{ fontSize: 16, fontWeight: 800 }}>{quoted}</div><div style={{ fontSize: 10, color: "#5A6B78" }}>Quoted ({rfq ? ((quoted / rfq) * 100).toFixed(0) : 0}% of RFQ)</div></div>
                    <div><div style={{ fontSize: 16, fontWeight: 800 }}>{fmt(quotedVal)}</div><div style={{ fontSize: 10, color: "#5A6B78" }}>Total quoted value</div></div>
                    <div><div style={{ fontSize: 16, fontWeight: 800 }}>{so}</div><div style={{ fontSize: 10, color: "#5A6B78" }}>Sales orders raised</div></div>
                    <div><div style={{ fontSize: 16, fontWeight: 800 }}>{fmt(soVal)}</div><div style={{ fontSize: 10, color: "#5A6B78" }}>SO value ({quotedVal ? ((soVal / quotedVal) * 100).toFixed(1) : 0}% of quoted)</div></div>
                  </div>
                );
              })()}
            </>
          )}

          {sections.includes("monthlyDetail") && monthlyTableMonths.length > 0 && (
            <>
              <SecTitle>Monthly tracking — {period}</SecTitle>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #0C3557" }}>
                    {["Month", "Invoiced", "RFQ lines", "Quoted", "Quoted value", "SO count", "SO value"].map((h) => (
                      <th key={h} style={{ textAlign: h === "Month" ? "left" : "right", padding: "4px 6px", fontSize: 9.5, textTransform: "uppercase", color: "#5A6B78" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monthlyTableMonths.map((m) => {
                    const rev = rangedMonthlyTotals.find((x) => x.month === m)?.value || 0;
                    const fi = rangedFunnel.months.indexOf(m);
                    const row = fi === -1 ? { rfq: 0, quoted: 0, quotedVal: 0, so: 0, soVal: 0 } : {
                      rfq: rangedFunnel.rfqUniquePN[fi], quoted: rangedFunnel.quotedUniquePN[fi],
                      quotedVal: rangedFunnel.totalQuotesValue[fi], so: rangedFunnel.totalSOCount[fi], soVal: rangedFunnel.totalSOValue[fi],
                    };
                    return (
                      <tr key={m} style={{ borderBottom: "1px solid #E4E9EE" }}>
                        <td style={{ padding: "3px 6px", fontWeight: 600 }}>{formatMonth(m)}</td>
                        <td style={{ padding: "3px 6px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{rev ? fmt(rev) : "—"}</td>
                        <td style={{ padding: "3px 6px", textAlign: "right" }}>{row.rfq || "—"}</td>
                        <td style={{ padding: "3px 6px", textAlign: "right" }}>{row.quoted || "—"}</td>
                        <td style={{ padding: "3px 6px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{row.quotedVal ? fmt(row.quotedVal) : "—"}</td>
                        <td style={{ padding: "3px 6px", textAlign: "right" }}>{row.so || "—"}</td>
                        <td style={{ padding: "3px 6px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{row.soVal ? fmt(row.soVal) : "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}

          {sections.includes("stageTracking") && stageTracking && stageTracking.months.length > 0 && (
            <>
              <SecTitle>Sales stage tracking by month</SecTitle>
              <div style={{ fontSize: 10, color: "#8CA0AE", marginBottom: 6 }}>Deals predating this feature carry a single baseline entry rather than a full transition history.</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5 }}>
                <thead><tr style={{ borderBottom: "2px solid #0C3557" }}>
                  <th style={{ textAlign: "left", padding: "3px 5px", fontSize: 9, color: "#5A6B78" }}>Month</th>
                  {STAGES.map((st) => <th key={st} style={{ textAlign: "right", padding: "3px 5px", fontSize: 8.5, color: "#5A6B78" }}>{st}</th>)}
                </tr></thead>
                <tbody>
                  {stageTracking.months.map((m) => (
                    <tr key={m} style={{ borderBottom: "1px solid #E4E9EE" }}>
                      <td style={{ padding: "3px 5px", fontWeight: 600 }}>{formatMonth(m)}</td>
                      {STAGES.map((st) => {
                        const cell = stageTracking.rows[m]?.[st];
                        return <td key={st} style={{ padding: "3px 5px", textAlign: "right" }}>{cell ? `${cell.count} · ${fmt(cell.value)}` : "—"}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {sections.includes("invoiceAging") && invoiceAging && (
            <>
              <SecTitle>Invoice collection & aging — {fmt(invoiceAging.totalOutstanding)} outstanding</SecTitle>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 8 }}>
                {AGING_BUCKETS.map((b) => (
                  <div key={b} style={{ minWidth: 90 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: b === "Current" ? "#256E4E" : b === "90+ days" ? "#A63A3A" : "#B8720F" }}>{fmt(invoiceAging.buckets[b].value)}</div>
                    <div style={{ fontSize: 9.5, color: "#5A6B78" }}>{b} ({invoiceAging.buckets[b].count})</div>
                  </div>
                ))}
              </div>
              {invoiceAging.lines.length > 0 && (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5 }}>
                  <thead><tr style={{ borderBottom: "2px solid #0C3557" }}>
                    <th style={{ textAlign: "left", padding: "3px 5px", fontSize: 9, color: "#5A6B78" }}>Deal</th>
                    <th style={{ textAlign: "right", padding: "3px 5px", fontSize: 9, color: "#5A6B78" }}>Value</th>
                    <th style={{ textAlign: "left", padding: "3px 5px", fontSize: 9, color: "#5A6B78" }}>Terms</th>
                    <th style={{ textAlign: "right", padding: "3px 5px", fontSize: 9, color: "#5A6B78" }}>Aging</th>
                  </tr></thead>
                  <tbody>
                    {invoiceAging.lines.slice(0, 12).map((l, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #E4E9EE" }}>
                        <td style={{ padding: "3px 5px" }}>{l.name}</td>
                        <td style={{ padding: "3px 5px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(l.value)}</td>
                        <td style={{ padding: "3px 5px", fontSize: 10 }}>{l.terms}</td>
                        <td style={{ padding: "3px 5px", textAlign: "right", fontWeight: 700, color: l.daysOverdue > 0 ? "#A63A3A" : "#256E4E" }}>{l.bucket}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {sections.includes("repDetail") && repDetail && repDetail.length > 0 && (
            <>
              <SecTitle>Detailed breakdown — per rep</SecTitle>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5 }}>
                <thead><tr style={{ borderBottom: "2px solid #0C3557" }}>
                  {["Rep", "Region", "Open (#/$)", "Weighted", "Quotes (#/$)", "Won (#/$)", "Comm. matured", "Comm. payable"].map((h) => (
                    <th key={h} style={{ textAlign: h === "Rep" || h === "Region" ? "left" : "right", padding: "4px 5px", fontSize: 9, color: "#5A6B78" }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {repDetail.map((r) => (
                    <tr key={r.name} style={{ borderBottom: "1px solid #E4E9EE" }}>
                      <td style={{ padding: "3px 5px", fontWeight: 600 }}>{r.name}</td>
                      <td style={{ padding: "3px 5px", fontSize: 10, color: "#5A6B78" }}>{r.region}</td>
                      <td style={{ padding: "3px 5px", textAlign: "right" }}>{r.openCount} / {fmt(r.openValue)}</td>
                      <td style={{ padding: "3px 5px", textAlign: "right" }}>{fmt(r.weighted)}</td>
                      <td style={{ padding: "3px 5px", textAlign: "right" }}>{r.quotesCount} / {fmt(r.quotesValue)}</td>
                      <td style={{ padding: "3px 5px", textAlign: "right" }}>{r.wonCount} / {fmt(r.wonValue)}</td>
                      <td style={{ padding: "3px 5px", textAlign: "right", color: "#256E4E" }}>{fmt(r.maturedComm)}</td>
                      <td style={{ padding: "3px 5px", textAlign: "right", color: "#B8720F" }}>{fmt(r.payableComm)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {sections.includes("productDetail") && productDetail && productDetail.length > 0 && (
            <>
              <SecTitle>Detailed breakdown — per product line</SecTitle>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5 }}>
                <thead><tr style={{ borderBottom: "2px solid #0C3557" }}>
                  {["Product line", "Catalog items", "Open pipeline (#/$)", "Quoted (#/$)", "Won (#/$)"].map((h) => (
                    <th key={h} style={{ textAlign: h === "Product line" ? "left" : "right", padding: "4px 5px", fontSize: 9, color: "#5A6B78" }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {productDetail.map((r) => (
                    <tr key={r.label} style={{ borderBottom: "1px solid #E4E9EE" }}>
                      <td style={{ padding: "3px 5px", fontWeight: 600 }}>{r.label}</td>
                      <td style={{ padding: "3px 5px", textAlign: "right" }}>{r.catalogItems}</td>
                      <td style={{ padding: "3px 5px", textAlign: "right" }}>{r.openCount} / {fmt(r.openValue)}</td>
                      <td style={{ padding: "3px 5px", textAlign: "right" }}>{r.quotesCount} / {fmt(r.quotesValue)}</td>
                      <td style={{ padding: "3px 5px", textAlign: "right" }}>{r.wonCount} / {fmt(r.wonValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {sections.includes("accountDetail") && accountDetail && accountDetail.length > 0 && (
            <>
              <SecTitle>Detailed breakdown — per airline / account ({accountDetail.length} accounts)</SecTitle>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                <thead><tr style={{ borderBottom: "2px solid #0C3557" }}>
                  {["Account", "Region", "Tier", "Owner", "Fleet", "Invoiced", "Last active", "Open pipeline", "Won", "Registration"].map((h) => (
                    <th key={h} style={{ textAlign: ["Account", "Region", "Owner", "Registration"].includes(h) ? "left" : "right", padding: "3px 4px", fontSize: 8.5, color: "#5A6B78" }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {accountDetail.map((a) => (
                    <tr key={a.name} style={{ borderBottom: "1px solid #E4E9EE" }}>
                      <td style={{ padding: "3px 4px", fontWeight: 600 }}>{a.name}</td>
                      <td style={{ padding: "3px 4px", fontSize: 9.5, color: "#5A6B78" }}>{a.region}</td>
                      <td style={{ padding: "3px 4px" }}><Tag color={tierColor[a.tier]}>{a.tier}</Tag></td>
                      <td style={{ padding: "3px 4px", fontSize: 9.5 }}>{a.owner}</td>
                      <td style={{ padding: "3px 4px", textAlign: "right" }}>{a.fleetSize || "—"}</td>
                      <td style={{ padding: "3px 4px", textAlign: "right", fontWeight: a.invoiced ? 700 : 400 }}>{a.invoiced ? fmt(a.invoiced) : "—"}</td>
                      <td style={{ padding: "3px 4px", fontSize: 9.5 }}>{formatMonth(a.lastActive)}</td>
                      <td style={{ padding: "3px 4px", textAlign: "right" }}>{a.openValue ? fmt(a.openValue) : "—"}</td>
                      <td style={{ padding: "3px 4px", textAlign: "right" }}>{a.wonCount || "—"}</td>
                      <td style={{ padding: "3px 4px", fontSize: 9.5 }}>{a.regStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {sections.includes("aircraftDetail") && aircraftDetail && aircraftDetail.length > 0 && (
            <>
              <SecTitle>Detailed breakdown — per aircraft model</SecTitle>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5 }}>
                <thead><tr style={{ borderBottom: "2px solid #0C3557" }}>
                  {["Model", "OEM", "Tails in territory", "Operators", "Open pipeline on operators", "Engaged"].map((h) => (
                    <th key={h} style={{ textAlign: h === "Model" || h === "OEM" ? "left" : "right", padding: "4px 5px", fontSize: 9, color: "#5A6B78" }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {aircraftDetail.map((r) => (
                    <tr key={r.label} style={{ borderBottom: "1px solid #E4E9EE" }}>
                      <td style={{ padding: "3px 5px", fontWeight: 600 }}>{r.label}</td>
                      <td style={{ padding: "3px 5px", fontSize: 10, color: "#5A6B78" }}>{r.oem}</td>
                      <td style={{ padding: "3px 5px", textAlign: "right", fontWeight: 700 }}>{r.tails}</td>
                      <td style={{ padding: "3px 5px", textAlign: "right" }}>{r.operators}</td>
                      <td style={{ padding: "3px 5px", textAlign: "right" }}>{r.openPipeline ? fmt(r.openPipeline) : "—"}</td>
                      <td style={{ padding: "3px 5px", textAlign: "right" }}>{r.engagedCount}/{r.operators}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {sections.includes("rawMatrix") && rawMatrix && rawMatrix.rows.length > 0 && (
            <>
              <SecTitle>Raw invoice data — account × month — {fmt(rawMatrix.grandTotal)} total, {rawMatrix.rows.length} accounts</SecTitle>
              <div style={{ fontSize: 10.5, color: "#5A6B78", marginBottom: 6 }}>Exact figures from the invoice export — no rounding to a top-N list, no aggregation. Scroll horizontally for the full month range.</div>
              <div style={{ overflowX: "auto", border: "1px solid #E4E9EE", borderRadius: 4 }}>
                <table style={{ width: "max-content", minWidth: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #0C3557" }}>
                      <th style={{ position: "sticky", left: 0, background: "#fff", textAlign: "left", padding: "4px 8px", fontSize: 9, color: "#5A6B78", whiteSpace: "nowrap" }}>Account</th>
                      <th style={{ textAlign: "right", padding: "4px 6px", fontSize: 9, color: "#5A6B78", whiteSpace: "nowrap" }}>Total</th>
                      {rawMatrix.months.map((m) => <th key={m} style={{ textAlign: "right", padding: "4px 6px", fontSize: 9, color: "#5A6B78", whiteSpace: "nowrap" }}>{formatMonth(m)}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {rawMatrix.rows.map((r) => (
                      <tr key={r.name} style={{ borderBottom: "1px solid #E4E9EE" }}>
                        <td style={{ position: "sticky", left: 0, background: "#fff", padding: "3px 8px", fontWeight: 600, whiteSpace: "nowrap" }}>{r.name}</td>
                        <td style={{ padding: "3px 6px", textAlign: "right", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{fmt(r.total)}</td>
                        {r.values.map((v, i) => <td key={i} style={{ padding: "3px 6px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: v ? "#15242F" : "#C7D0D8" }}>{v ? fmt(v).replace("$", "") : "·"}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {sections.includes("topAccounts") && data.topAccountsByRevenue.length > 0 && (
            <>
              <SecTitle>Top accounts by invoiced revenue</SecTitle>
              {(() => { const max = Math.max(...data.topAccountsByRevenue.map((a) => a.revenue.total)); return data.topAccountsByRevenue.map((a) => barRow(a.name, a.revenue.total, max, "#256E4E")); })()}
            </>
          )}

          {sections.includes("region") && data.byRegion.length > 0 && (
            <>
              <SecTitle>Open pipeline by region</SecTitle>
              {(() => { const max = Math.max(...data.byRegion.map((r) => r.value)); return data.byRegion.map((r) => barRow(r.label, r.value, max, "#14538C")); })()}
            </>
          )}

          {sections.includes("product") && data.byProduct.length > 0 && (
            <>
              <SecTitle>Open pipeline by product line</SecTitle>
              {(() => { const max = Math.max(...data.byProduct.map((r) => r.value)); return data.byProduct.map((r) => barRow(r.label, r.value, max, "#0E6E6E")); })()}
            </>
          )}

          {sections.includes("owner") && data.byOwner.length > 0 && (
            <>
              <SecTitle>Open pipeline by owner</SecTitle>
              {(() => { const max = Math.max(...data.byOwner.map((r) => r.value)); return data.byOwner.map((r) => barRow(r.label, r.value, max, "#B8720F")); })()}
            </>
          )}

          {sections.includes("loss") && data.byLoss.length > 0 && (
            <>
              <SecTitle>Lost deal reasons</SecTitle>
              {(() => { const max = Math.max(...data.byLoss.map((r) => r.value)); return data.byLoss.map((r) => barRow(r.label, r.value, max, "#A63A3A")); })()}
            </>
          )}

          {sections.includes("commission") && (
            <>
              <SecTitle>Commission summary — matured, by rep</SecTitle>
              {commissionRows.length === 0 ? (
                <div style={{ fontSize: 11.5, color: "#5A6B78" }}>No matured commission recorded yet.</div>
              ) : (() => { const max = Math.max(...commissionRows.map((r) => r.maturedAll)); return commissionRows.map((r) => barRow(`${r.name} (payable ${fmt(r.payable)})`, r.maturedAll, max, "#0C3557")); })()}
            </>
          )}
        </div>

        <div style={{ background: CLASS_COLOR[classification], color: "#fff", padding: "6px 20px", fontSize: 10.5, fontWeight: 700, textAlign: "center" }}>
          {classification.toUpperCase()} · Banner Aircraft International — Africa Area · Generated {genDate}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
        <div style={{ fontSize: 11, color: C.faint }}>Distribution list and classification are recorded on the document itself.</div>
        <Btn onClick={downloadPdf}><Download size={14} /> Download PDF</Btn>
      </div>
    </Modal>
  );
}


/* ---------------------------- Aircraft 360 -------------------------- */

function Aircraft360({ accounts, allAccounts, aircraft, aogCases, catalog, deals, acct, userById, canEdit, isAdmin, isBD, industryContacts, onAddAircraft, onEditAircraft, onDeleteAircraft, onAddAog, onEditAog, onDeleteAog, setAogStatus, onAddIndustry, onEditIndustry, onDeleteIndustry }) {
  const [sub, setSub] = useState("fleet");
  const [q, setQ] = useState("");
  const [ataOpen, setAtaOpen] = useState(null);
  const openDeals = deals.filter((d) => d.stage !== "Won" && d.stage !== "Lost");

  const [selModel, setSelModel] = useState("737NG");
  const subs = [
    ["fleet", "Fleet Intelligence"], ["model", "Model 360"], ["registry", "Aircraft Registry"], ["ata", "ATA Browser"],
    ["parts", "Parts Intelligence"], ["pma", "PMA Directory"], ["oem", "OEM Directory"],
    ["mro", "MRO Directory"], ["suppliers", "Suppliers"], ["aog", "AOG Desk"], ["heat", "Sales Heat Map"],
    ...(!isBD ? [["industry", "Industry Network"]] : []),
  ];
  const relColor = { "Personal Contact": C.teal, "Personal — Family Friend": C.amber, "Business Contact": C.blue, "Competitive Intel": C.red };

  const Pill = ({ id, label }) => (
    <button onClick={() => setSub(id)} style={{ background: sub === id ? C.blueDeep : C.surface, color: sub === id ? "#fff" : C.sub, border: `1px solid ${sub === id ? C.blueDeep : C.line}`, borderRadius: 20, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>{label}</button>
  );

  /* per-account fleet intel */
  const fleetRows = accounts.filter((a) => (a.fleet || []).length > 0).map((a) => {
    const size = a.fleet.reduce((s, f) => s + (Number(f.count) || 0), 0);
    const suggested = [...new Set(a.fleet.flatMap((f) => fleetSuggest(f.type)))];
    const activeLines = new Set();
    deals.filter((d) => d.accountId === a.id && d.stage !== "Lost").forEach((d) => (d.lines || []).forEach((l) => activeLines.add(l.product)));
    const gaps = suggested.filter((s) => !activeLines.has(s));
    return { a, size, suggested, activeLines: [...activeLines], gaps };
  }).sort((x, y) => y.size - x.size);

  const partsFiltered = catalog.filter((p) => {
    if (!q.trim()) return true;
    const hay = `${p.pn} ${p.name} ${p.productLine} ATA${p.ata || ""} ${p.pma ? "PMA" : ""}`.toLowerCase();
    return q.toLowerCase().split(" ").every((w) => hay.includes(w));
  });

  return (
    <div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {subs.map(([id, label]) => <Pill key={id} id={id} label={label} />)}
      </div>

      {sub === "fleet" && (
        <div>
          <div style={{ fontSize: 12, color: C.amber, background: C.amberBg, borderRadius: 4, padding: "8px 12px", marginBottom: 12, fontWeight: 600 }}>
            African Fleet Database — indicative compositions from public sources (2025). Verify counts with the operator before customer-facing use; refine via the Registry.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 12 }}>
            {fleetRows.map(({ a, size, suggested, activeLines, gaps }) => (
              <Card key={a.id} style={{ padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: C.sub }}><strong style={{ color: C.ink, fontSize: 16 }}>{size}</strong> a/c</div>
                </div>
                <div style={{ fontSize: 11, color: C.faint, marginBottom: 8 }}>{a.country} · {a.fleet.length} families · Owner: {userById(a.ownerId)?.name || "—"}</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                  {a.fleet.map((f, i) => (
                    <span key={i} style={{ fontSize: 11, background: C.bg, border: `1px solid ${C.line}`, borderRadius: 3, padding: "2px 6px" }}>
                      <strong>{f.type}</strong> ×{f.count}{f.engine ? <span style={{ color: C.faint }}> · {f.engine}</span> : null}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: C.sub }}>
                  Banner coverage: <strong style={{ color: activeLines.length ? C.green : C.faint }}>{activeLines.length}</strong>/{suggested.length} suggested lines active
                </div>
                {gaps.length > 0 && (
                  <div style={{ fontSize: 11, color: C.teal, marginTop: 4 }}>
                    <strong>Opportunity:</strong> {gaps.map((g) => PRODUCTS[g]?.short || g).join(", ")}
                  </div>
                )}
              </Card>
            ))}
            {fleetRows.length === 0 && <div style={{ fontSize: 13, color: C.faint }}>No fleet data in view — add aircraft in the Registry or fleet mixes on accounts.</div>}
          </div>
        </div>
      )}

      {sub === "model" && (() => {
        const def = FAMILY_DEFS.find((d) => d.id === selModel) || FAMILY_DEFS[0];
        const re = new RegExp(def.re, "i");
        const ops = accounts.map((a) => ({
          a,
          tails: (a.fleet || []).filter((f) => re.test(f.type)).reduce((s, f) => s + (Number(f.count) || 0), 0),
          types: (a.fleet || []).filter((f) => re.test(f.type)),
        })).filter((x) => x.tails > 0).sort((x, y) => y.tails - x.tails);
        const totalTails = ops.reduce((s, o) => s + o.tails, 0);
        const regTails = aircraft.filter((x) => re.test(x.type || ""));
        const lines = [...(def.vogt ? ["Vogt PMA Parts"] : []), "Oshino Lamps", "Anjou Seat Belts", "Novega ULBs", "Repair Management"];
        const fitItems = catalog.filter((p) => lines.includes(p.productLine));
        const opIds = new Set(ops.map((o) => o.a.id));
        const openOnOps = openDeals.filter((d) => opIds.has(d.accountId));
        const engaged = new Set([...openOnOps.map((d) => d.accountId), ...deals.filter((d) => d.stage === "Won" && opIds.has(d.accountId)).map((d) => d.accountId)]);
        const uncovered = ops.filter((o) => !engaged.has(o.a.id));
        return (
          <div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
              {FAMILY_DEFS.map((d) => (
                <button key={d.id} onClick={() => setSelModel(d.id)} style={{ background: selModel === d.id ? C.teal : C.surface, color: selModel === d.id ? "#fff" : C.sub, border: `1px solid ${selModel === d.id ? C.teal : C.line}`, borderRadius: 4, padding: "5px 9px", fontSize: 11.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{d.label}</button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 14 }}>
              <Card style={{ padding: 16, flex: "2 1 340px" }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{def.label} <span style={{ fontSize: 12, fontWeight: 600, color: C.faint }}>· {def.oem}</span></div>
                <div style={{ fontSize: 12.5, color: C.sub, marginTop: 4 }}><strong>Engines:</strong> {def.engines}</div>
                <div style={{ fontSize: 12.5, color: C.sub, marginTop: 3 }}><strong>Banner fit:</strong> {lines.map((l) => PRODUCTS[l]?.short).join(" · ")}{def.vogt ? " — incl. Vogt lav-system PMAs (ATA 38)" : ""}</div>
                <div style={{ display: "flex", gap: 22, marginTop: 12 }}>
                  <div><div style={{ fontSize: 22, fontWeight: 800, color: C.blue }}>{totalTails}</div><div style={{ fontSize: 10.5, color: C.faint, textTransform: "uppercase", letterSpacing: "0.05em" }}>Tails in territory*</div></div>
                  <div><div style={{ fontSize: 22, fontWeight: 800 }}>{ops.length}</div><div style={{ fontSize: 10.5, color: C.faint, textTransform: "uppercase", letterSpacing: "0.05em" }}>Operators in book</div></div>
                  <div><div style={{ fontSize: 22, fontWeight: 800, color: C.teal }}>{fmt(openOnOps.reduce((s, d) => s + dealValue(d), 0))}</div><div style={{ fontSize: 10.5, color: C.faint, textTransform: "uppercase", letterSpacing: "0.05em" }}>Open pipeline on operators</div></div>
                  <div><div style={{ fontSize: 22, fontWeight: 800 }}>{regTails.length}</div><div style={{ fontSize: 10.5, color: C.faint, textTransform: "uppercase", letterSpacing: "0.05em" }}>Registry tails</div></div>
                </div>
                <div style={{ fontSize: 10, color: C.faint, marginTop: 8 }}>*Indicative fleet counts — verify with operators; refine tail-by-tail in the Registry.</div>
              </Card>
              {uncovered.length > 0 && (
                <Card style={{ padding: 16, flex: "1 1 240px", borderLeft: `3px solid ${C.teal}` }}>
                  <SectionTitle>Campaign hint</SectionTitle>
                  <div style={{ fontSize: 12.5, color: C.sub }}>
                    {uncovered.length} {def.label} operator{uncovered.length > 1 ? "s" : ""} with <strong>no Banner engagement yet</strong>:
                  </div>
                  {uncovered.slice(0, 5).map((o) => (
                    <div key={o.a.id} style={{ fontSize: 12, marginTop: 5 }}><strong>{o.a.name}</strong> — {o.tails} tails · {userById(o.a.ownerId)?.name || "unassigned"}</div>
                  ))}
                </Card>
              )}
            </div>

            <Card style={{ overflowX: "auto", marginBottom: 14 }}>
              <table>
                <thead><tr><th>Operator</th><th>Tails</th><th>Variants / engines</th><th>Owner</th><th>Open pipeline</th><th>Status</th></tr></thead>
                <tbody>
                  {ops.length === 0 && <tr><td colSpan={6} style={{ color: C.faint, textAlign: "center", padding: 20 }}>No {def.label} operators in view.</td></tr>}
                  {ops.map(({ a, tails, types }) => {
                    const openV = openDeals.filter((d) => d.accountId === a.id).reduce((s, d) => s + dealValue(d), 0);
                    return (
                      <tr key={a.id}>
                        <td style={{ fontWeight: 600 }}>{a.name}<div style={{ fontSize: 10.5, color: C.faint }}>{a.country}</div></td>
                        <td style={{ fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>{tails}</td>
                        <td style={{ fontSize: 12, color: C.sub }}>{types.map((t) => `${t.type}${t.engine ? ` (${t.engine})` : ""}`).join(", ")}</td>
                        <td style={{ fontSize: 13 }}>{userById(a.ownerId)?.name || "—"}</td>
                        <td style={{ fontVariantNumeric: "tabular-nums" }}>{openV ? fmt(openV) : <span style={{ color: C.faint }}>—</span>}</td>
                        <td>{engaged.has(a.id) ? <Tag color={C.green}>Engaged</Tag> : <Tag color={C.amber}>Opportunity</Tag>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>

            <Card style={{ overflowX: "auto" }}>
              <div style={{ padding: "12px 14px 0", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.sub }}>Applicable Banner catalogue — {def.label}</div>
              <table>
                <thead><tr><th>Part No.</th><th>Description</th><th>Line</th><th>ATA</th><th>PMA</th><th>List</th></tr></thead>
                <tbody>
                  {fitItems.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontFamily: "ui-monospace, monospace", fontWeight: 700, whiteSpace: "nowrap" }}>{p.pn}</td>
                      <td>{p.name}</td>
                      <td style={{ fontSize: 12, color: C.sub, whiteSpace: "nowrap" }}>{PRODUCTS[p.productLine]?.short}</td>
                      <td style={{ fontVariantNumeric: "tabular-nums" }}>{p.ata ? p.ata : "Multi"}</td>
                      <td>{p.pma ? <Tag color={C.teal}>PMA</Tag> : <span style={{ color: C.faint }}>—</span>}</td>
                      <td style={{ fontVariantNumeric: "tabular-nums" }}>{p.listPrice > 0 ? fmt2(p.listPrice) : <span style={{ color: C.faint }}>POA</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        );
      })()}

      {sub === "registry" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontSize: 13, color: C.sub }}>Tail-level registry — build it as BDs confirm registrations, MSNs and configurations.</div>
            {canEdit && <Btn onClick={() => onAddAircraft()}><Plus size={14} /> Add aircraft</Btn>}
          </div>
          <Card style={{ overflowX: "auto" }}>
            <table>
              <thead><tr><th>Operator</th><th>Type</th><th>Registration</th><th>MSN</th><th>Delivery</th><th>Engine</th><th>Status</th><th>Notes</th>{canEdit && <th></th>}</tr></thead>
              <tbody>
                {aircraft.length === 0 && <tr><td colSpan={9} style={{ color: C.faint, textAlign: "center", padding: 24 }}>Registry is empty in this view.</td></tr>}
                {aircraft.map((x) => (
                  <tr key={x.id}>
                    <td style={{ fontWeight: 600 }}>{acct(x.accountId)?.name || "—"}</td>
                    <td>{x.type}</td>
                    <td style={{ fontFamily: "ui-monospace, monospace", fontWeight: 700 }}>{x.reg || "—"}</td>
                    <td style={{ fontVariantNumeric: "tabular-nums" }}>{x.msn || "—"}</td>
                    <td>{x.deliveryYear || "—"}</td>
                    <td style={{ fontSize: 13, color: C.sub }}>{x.engine || "—"}</td>
                    <td><Tag color={x.status === "Active" ? C.green : x.status === "Stored" ? C.faint : C.amber}>{x.status || "Active"}</Tag></td>
                    <td style={{ fontSize: 12, color: C.faint, maxWidth: 200 }}>{x.notes}</td>
                    {canEdit && (
                      <td style={{ whiteSpace: "nowrap" }}>
                        <IconBtn onClick={() => onEditAircraft(x)}><Pencil size={14} /></IconBtn>
                        <IconBtn onClick={() => onDeleteAircraft(x.id)} color={C.red}><Trash2 size={14} /></IconBtn>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {sub === "ata" && (
        <div>
          <div style={{ fontSize: 13, color: C.sub, marginBottom: 12 }}>ATA chapter reference mapped to Banner's portfolio. Repair Management covers components across chapters via the 400+ shop network.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
            {ATA_CHAPTERS.map((c) => {
              const items = catalog.filter((p) => p.ata === c.ch);
              const covered = (c.banner || []).length > 0;
              const isOpen = ataOpen === c.ch;
              return (
                <div key={c.ch} style={{ background: C.surface, border: `1px solid ${C.line}`, borderLeft: `3px solid ${covered ? C.teal : C.line}`, borderRadius: 6, padding: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div><span style={{ fontWeight: 800, color: covered ? C.teal : C.faint, fontVariantNumeric: "tabular-nums" }}>ATA {c.ch}</span> <span style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</span></div>
                    {items.length > 0 && <button onClick={() => setAtaOpen(isOpen ? null : c.ch)} style={{ background: "none", border: "none", color: C.blue, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{items.length} items {isOpen ? "▴" : "▾"}</button>}
                  </div>
                  <div style={{ fontSize: 11, color: covered ? C.sub : C.faint, marginTop: 3 }}>
                    {covered ? `Banner: ${c.banner.map((b) => PRODUCTS[b]?.short || b).join(", ")}` : "No dedicated line — Repair Mgmt on request"}
                  </div>
                  {isOpen && items.map((p) => (
                    <div key={p.id} style={{ fontSize: 11, marginTop: 5, paddingTop: 5, borderTop: `1px solid ${C.bg}` }}>
                      <span style={{ fontFamily: "ui-monospace, monospace", fontWeight: 700 }}>{p.pn}</span> {p.name}{p.pma && <Tag color={C.teal}>PMA</Tag>}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(sub === "parts" || sub === "pma") && (
        <div>
          {sub === "parts" && (
            <div style={{ position: "relative", marginBottom: 12, maxWidth: 420 }}>
              <Search size={14} style={{ position: "absolute", left: 10, top: 11, color: C.faint }} />
              <input style={{ ...inputStyle, paddingLeft: 32 }} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search PN, description, line, ATA, PMA…" />
            </div>
          )}
          {sub === "pma" && (
            <div style={{ fontSize: 13, color: C.sub, marginBottom: 12 }}>FAA-PMA / STC approved alternatives distributed by Banner — the lessor-friendly cost story. Vogt Aero: 130+ PMA/STC/OOP parts (full list on request from Vogt).</div>
          )}
          <Card style={{ overflowX: "auto" }}>
            <table>
              <thead><tr><th>Part No.</th><th>Description</th><th>Line</th><th>ATA</th><th>UOM</th><th>Lead</th><th>PMA</th><th>List</th></tr></thead>
              <tbody>
                {(sub === "pma" ? catalog.filter((p) => p.pma) : partsFiltered).map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: "ui-monospace, monospace", fontWeight: 700, whiteSpace: "nowrap" }}>{p.pn}</td>
                    <td>{p.name}</td>
                    <td style={{ fontSize: 12, color: C.sub, whiteSpace: "nowrap" }}>{PRODUCTS[p.productLine]?.short}</td>
                    <td style={{ fontVariantNumeric: "tabular-nums" }}>{p.ata ? p.ata : "Multi"}</td>
                    <td style={{ fontSize: 12 }}>{p.unit}</td>
                    <td style={{ fontSize: 12, color: C.sub }}>{p.lead || "—"}</td>
                    <td>{p.pma ? <Tag color={C.teal}>PMA</Tag> : <span style={{ color: C.faint }}>—</span>}</td>
                    <td style={{ fontVariantNumeric: "tabular-nums" }}>{p.listPrice > 0 ? fmt2(p.listPrice) : <span style={{ color: C.faint }}>POA</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {sub === "oem" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
          {OEM_DIRECTORY.map((o) => (
            <Card key={o.name} style={{ padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Factory size={15} color={C.blue} />
                <div style={{ fontWeight: 700 }}>{o.name}</div>
              </div>
              <div style={{ fontSize: 11, color: C.teal, fontWeight: 700, marginTop: 3 }}>{o.role}</div>
              <div style={{ fontSize: 12, color: C.sub, marginTop: 4 }}>{o.scope}</div>
            </Card>
          ))}
        </div>
      )}

      {sub === "mro" && (
        <Card style={{ overflowX: "auto" }}>
          <table>
            <thead><tr><th>MRO</th><th>Base</th><th>Notes</th><th>CRM account</th><th>Owner</th></tr></thead>
            <tbody>
              {MRO_DIRECTORY.map((m) => {
                const a = m.accountId ? allAccounts.find((x) => x.id === m.accountId) : null;
                return (
                  <tr key={m.name}>
                    <td style={{ fontWeight: 600 }}><Wrench size={13} style={{ verticalAlign: "-2px", marginRight: 5, color: C.teal }} />{m.name}</td>
                    <td style={{ fontSize: 13 }}>{m.base}</td>
                    <td style={{ fontSize: 12, color: C.sub }}>{m.note}</td>
                    <td>{a ? <Tag color={tierColor[a.tier]}>{a.tier}</Tag> : <span style={{ color: C.faint, fontSize: 12 }}>Not in book</span>}</td>
                    <td style={{ fontSize: 13 }}>{a ? (userById(a.ownerId)?.name || "—") : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {sub === "suppliers" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
          {SUPPLIER_CONTACTS.map((s, i) => (
            <Card key={i} style={{ padding: 14 }}>
              <div style={{ fontSize: 11, color: C.teal, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.company}</div>
              <div style={{ fontWeight: 700, marginTop: 2 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: C.sub }}>{s.title}</div>
              <div style={{ fontSize: 12, marginTop: 6 }}>{s.email && <div>{s.email}</div>}{s.phone && <div style={{ color: C.sub }}>{s.phone}</div>}</div>
            </Card>
          ))}
        </div>
      )}

      {sub === "industry" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontSize: 12, color: C.faint, maxWidth: 560 }}>
              Relationships that don't belong to any customer account — OEM/industry executives, advisors, and competitive intelligence. Visible to the Area Director and executives only.
            </div>
            {isAdmin && <Btn onClick={onAddIndustry}><Plus size={14} /> Add contact</Btn>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 10 }}>
            {industryContacts.length === 0 && <div style={{ fontSize: 13, color: C.faint }}>No industry contacts recorded yet.</div>}
            {industryContacts.map((c) => (
              <Card key={c.id} style={{ padding: 14, borderLeft: `3px solid ${relColor[c.relationship] || C.faint}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: C.sub }}>{c.title}</div>
                    <div style={{ fontSize: 11.5, color: C.faint, marginTop: 1 }}>{c.company}</div>
                  </div>
                  <Tag color={relColor[c.relationship] || C.faint}>{c.relationship}</Tag>
                </div>
                {c.notes && <div style={{ fontSize: 12, color: C.sub, marginTop: 8, lineHeight: 1.5 }}>{c.notes}</div>}
                {isAdmin && (
                  <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                    <IconBtn onClick={() => onEditIndustry(c)}><Pencil size={14} /></IconBtn>
                    <IconBtn onClick={() => onDeleteIndustry(c.id)} color={C.red}><Trash2 size={14} /></IconBtn>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {sub === "aog" && (
        <div>
          <div style={{ background: C.blueDeep, color: "#fff", borderRadius: 6, padding: "12px 16px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}><Flame size={15} color="#F0A050" /> Banner AOG Desk — 24/7/365</div>
              <div style={{ fontSize: 12, color: "#BFD3E4", marginTop: 2 }}>sales@banner.aero · +1 (855) 822-6637 · Response commitment: immediate</div>
            </div>
            {canEdit && <Btn kind="amber" onClick={onAddAog}><Plus size={14} /> Log AOG case</Btn>}
          </div>
          <Card style={{ overflowX: "auto" }}>
            <table>
              <thead><tr><th>Case</th><th>Operator</th><th>Aircraft</th><th>Part / need</th><th>Opened</th><th>Status</th>{canEdit && <th></th>}</tr></thead>
              <tbody>
                {aogCases.length === 0 && <tr><td colSpan={7} style={{ color: C.faint, textAlign: "center", padding: 24 }}>No AOG cases logged. May it stay that way — but when the call comes, log it here so response time is on record.</td></tr>}
                {[...aogCases].sort((x, y) => (x.status === "Closed") - (y.status === "Closed")).map((cse) => (
                  <tr key={cse.id} style={cse.status === "Open" ? { background: C.redBg } : undefined}>
                    <td style={{ fontWeight: 700 }}>{cse.number}<div style={{ fontSize: 10, color: C.faint }}>{cse.status !== "Closed" ? `${daysBetween(cse.openedAt, today())}d open` : `closed ${cse.closedAt}`}</div></td>
                    <td>{acct(cse.accountId)?.name || "—"}</td>
                    <td style={{ fontSize: 13 }}>{cse.acType}{cse.reg ? ` · ${cse.reg}` : ""}</td>
                    <td style={{ fontSize: 13 }}>{cse.need}</td>
                    <td style={{ fontSize: 12, color: C.sub }}>{cse.openedAt}</td>
                    <td>
                      {canEdit ? (
                        <select value={cse.status} onChange={(e) => setAogStatus(cse.id, e.target.value)} style={{ ...inputStyle, width: "auto", fontSize: 12, padding: "4px 6px", borderColor: aogColor[cse.status], color: aogColor[cse.status], fontWeight: 700 }}>
                          {AOG_STATUSES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      ) : <Tag color={aogColor[cse.status]}>{cse.status}</Tag>}
                    </td>
                    {canEdit && (
                      <td style={{ whiteSpace: "nowrap" }}>
                        <IconBtn onClick={() => onEditAog(cse)}><Pencil size={14} /></IconBtn>
                        <IconBtn onClick={() => onDeleteAog(cse.id)} color={C.red}><Trash2 size={14} /></IconBtn>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {sub === "heat" && (() => {
        const regions = [...new Set(accounts.map((a) => a.region))].filter(Boolean);
        const lines = Object.keys(PRODUCTS);
        const cell = {};
        let max = 1;
        openDeals.forEach((d) => {
          const r = acct(d.accountId)?.region;
          if (!r) return;
          (d.lines || []).forEach((l) => {
            const k = r + "|" + l.product;
            cell[k] = (cell[k] || 0) + (Number(l.value) || 0);
            if (cell[k] > max) max = cell[k];
          });
        });
        return (
          <div>
            <div style={{ fontSize: 13, color: C.sub, marginBottom: 12 }}>Open pipeline heat by territory × product line — where the money is, and where the white space is.</div>
            <Card style={{ overflowX: "auto", padding: 8 }}>
              <table>
                <thead><tr><th><Grid3X3 size={13} /></th>{lines.map((l) => <th key={l} style={{ textAlign: "center" }}>{PRODUCTS[l].short}</th>)}</tr></thead>
                <tbody>
                  {regions.map((r) => (
                    <tr key={r}>
                      <td style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" }}>{r}</td>
                      {lines.map((l) => {
                        const v = cell[r + "|" + l] || 0;
                        const alpha = v ? 0.15 + 0.75 * (v / max) : 0;
                        return (
                          <td key={l} style={{ textAlign: "center", background: v ? `rgba(20,83,140,${alpha})` : C.bg, color: alpha > 0.5 ? "#fff" : C.ink, fontVariantNumeric: "tabular-nums", fontSize: 12, fontWeight: v ? 700 : 400, minWidth: 78 }}>
                            {v ? "$" + (v >= 1000 ? Math.round(v / 1000) + "k" : v) : "·"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <div style={{ fontSize: 11, color: C.faint, marginTop: 8 }}>Empty cells are white space — cross-reference with Fleet Intelligence gaps to pick the next campaign.</div>
          </div>
        );
      })()}
    </div>
  );
}

function AircraftForm({ item, preset, accounts, onSave, onClose }) {
  const [f, setF] = useState(item || { id: uid(), accountId: preset?.accountId || accounts[0]?.id || "", type: "", reg: "", msn: "", deliveryYear: "", engine: "", status: "Active", notes: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <Modal title={item ? "Edit aircraft" : "Add aircraft"} onClose={onClose}>
      <Field label="Operator"><select style={inputStyle} value={f.accountId} onChange={set("accountId")}>{accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></Field>
      <div style={{ display: "flex", gap: 10 }}>
        <Field label="Type" flex><input style={inputStyle} value={f.type} onChange={set("type")} placeholder="e.g. B737-800" /></Field>
        <Field label="Registration" flex><input style={inputStyle} value={f.reg} onChange={set("reg")} placeholder="e.g. 5Y-KZA" /></Field>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Field label="MSN" flex><input style={inputStyle} value={f.msn} onChange={set("msn")} /></Field>
        <Field label="Delivery year" flex><input style={inputStyle} value={f.deliveryYear} onChange={set("deliveryYear")} /></Field>
        <Field label="Engine" flex><input style={inputStyle} value={f.engine} onChange={set("engine")} placeholder="CFM56-7B" /></Field>
      </div>
      <Field label="Status"><select style={inputStyle} value={f.status} onChange={set("status")}><option>Active</option><option>Stored</option><option>On order</option><option>Retired</option></select></Field>
      <Field label="Notes"><textarea style={{ ...inputStyle, minHeight: 50 }} value={f.notes} onChange={set("notes")} /></Field>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Btn kind="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={() => f.type.trim() && onSave(f)}>Save aircraft</Btn>
      </div>
    </Modal>
  );
}

function IndustryContactForm({ item, onSave, onClose }) {
  const [f, setF] = useState(item || { id: uid(), name: "", title: "", company: "", relationship: "Business Contact", notes: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <Modal title={item ? "Edit industry contact" : "Add industry contact"} onClose={onClose}>
      <div style={{ display: "flex", gap: 10 }}>
        <Field label="Name" flex><input style={inputStyle} value={f.name} onChange={set("name")} /></Field>
        <Field label="Title" flex><input style={inputStyle} value={f.title} onChange={set("title")} /></Field>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Field label="Company" flex><input style={inputStyle} value={f.company} onChange={set("company")} placeholder="e.g. The Boeing Company" /></Field>
        <Field label="Relationship" flex>
          <select style={inputStyle} value={f.relationship} onChange={set("relationship")}>
            <option>Personal Contact</option>
            <option>Personal — Family Friend</option>
            <option>Business Contact</option>
            <option>Competitive Intel</option>
          </select>
        </Field>
      </div>
      <Field label="Notes"><textarea style={{ ...inputStyle, minHeight: 80 }} value={f.notes} onChange={set("notes")} placeholder="Background, BD relevance, entry angle…" /></Field>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Btn kind="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={() => f.name.trim() && onSave(f)}>Save contact</Btn>
      </div>
    </Modal>
  );
}

function AogForm({ item, accounts, me, onSave, onClose }) {
  const [f, setF] = useState(item || { id: uid(), number: `AOG-${today().replace(/-/g, "").slice(2)}-${Math.floor(Math.random() * 90 + 10)}`, accountId: accounts[0]?.id || "", acType: "", reg: "", need: "", status: "Open", openedAt: today(), closedAt: "", notes: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <Modal title={item ? `Edit ${f.number}` : `Log AOG case ${f.number}`} onClose={onClose}>
      <Field label="Operator"><select style={inputStyle} value={f.accountId} onChange={set("accountId")}>{accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></Field>
      <div style={{ display: "flex", gap: 10 }}>
        <Field label="Aircraft type" flex><input style={inputStyle} value={f.acType} onChange={set("acType")} placeholder="B737-800" /></Field>
        <Field label="Registration" flex><input style={inputStyle} value={f.reg} onChange={set("reg")} /></Field>
      </div>
      <Field label="Part / need"><input style={inputStyle} value={f.need} onChange={set("need")} placeholder="e.g. Sealed beam landing light — 2 off, ship NBO" /></Field>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Btn kind="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={() => f.need.trim() && onSave(f)}>Save case</Btn>
      </div>
    </Modal>
  );
}

/* ---------------------------- Commissions -------------------------- */

function Commissions({ deals, users, me, isBD, isAdmin, canProcessPayouts, payouts, roleOf, onRecordPayout }) {
  const owners = users.filter((u) => OWNER_ROLES.includes(u.role) && (!isBD || u.id === me.id));
  const q = quarterOf(today());

  const rows = owners.map((o) => {
    const relevant = deals.filter((d) => d.ownerId === o.id || (d.agreement && d.agreement.assistBDId === o.id));
    const open = relevant.filter((d) => d.stage !== "Won" && d.stage !== "Lost");
    const won = relevant.filter((d) => d.stage === "Won");
    const collected = won.filter((d) => d.collectedAt);
    const shareOf = (d) => commissionShare(d, o.id, roleOf);
    const maturedAll = collected.reduce((s, d) => s + shareOf(d), 0);
    const paid = payouts.filter((p) => p.ownerId === o.id).reduce((s, p) => s + (Number(p.amount) || 0), 0);
    return {
      o,
      pipeComm: open.reduce((s, d) => s + shareOf(d) * ((d.prob ?? STAGE_PROB[d.stage] ?? 0) / 100), 0),
      fcatComm: open.filter((d) => d.forecastCat === "Forecast").reduce((s, d) => s + shareOf(d), 0),
      pendingColl: won.filter((d) => !d.collectedAt).reduce((s, d) => s + shareOf(d), 0),
      maturedQ: collected.filter((d) => quarterOf(d.collectedAt) === q).reduce((s, d) => s + shareOf(d), 0),
      maturedAll, paid, payable: Math.max(0, maturedAll - paid),
      openCount: open.length, wonCount: won.length, collCount: collected.length,
    };
  }).sort((a, b) => b.pipeComm - a.pipeComm);

  /* Area Director's 1% territory override — every deal, whole territory. Not visible to BDs (compensation privacy). */
  const overrideRows = !isBD && (() => {
    const openAll = deals.filter((d) => d.stage !== "Won" && d.stage !== "Lost");
    const wonAll = deals.filter((d) => d.stage === "Won");
    const collectedAll = wonAll.filter((d) => d.collectedAt);
    return {
      weighted: openAll.reduce((s, d) => s + dealOverrideCommission(d) * ((d.prob ?? STAGE_PROB[d.stage] ?? 0) / 100), 0),
      pending: wonAll.filter((d) => !d.collectedAt).reduce((s, d) => s + dealOverrideCommission(d), 0),
      maturedQ: collectedAll.filter((d) => quarterOf(d.collectedAt) === q).reduce((s, d) => s + dealOverrideCommission(d), 0),
      maturedAll: collectedAll.reduce((s, d) => s + dealOverrideCommission(d), 0),
    };
  })();

  return (
    <div>
      <div style={{ fontSize: 13, color: C.sub, marginBottom: 14 }}>
        <strong>Owner-based commission:</strong> Territory Managers earn {(BDM_RATE * 100).toFixed(0)}% of gross deal value on deals they own. The Area Director earns {(AD_DIRECT_RATE * 100).toFixed(0)}% direct on deals they personally register, plus a {(AD_OVERRIDE_RATE * 100).toFixed(0)}% override on every deal across the whole territory. <strong>Commission matures upon collection</strong> — accrued on Won, payable once the Area Director or Finance confirms the customer's payment was received. {isBD ? "You see your own statement only." : "Visible to Area Director and executives."}
      </div>

      {overrideRows && (
        <Card style={{ padding: 14, marginBottom: 16, borderLeft: `3px solid ${C.amber}` }}>
          <SectionTitle>Area Director territory override — {(AD_OVERRIDE_RATE * 100).toFixed(0)}% of every deal</SectionTitle>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginTop: 6 }}>
            <div><div style={{ fontSize: 18, fontWeight: 800 }}>{fmt(overrideRows.weighted)}</div><div style={{ fontSize: 10.5, color: C.faint, textTransform: "uppercase" }}>Weighted pipeline</div></div>
            <div><div style={{ fontSize: 18, fontWeight: 800, color: C.amber }}>{fmt(overrideRows.pending)}</div><div style={{ fontSize: 10.5, color: C.faint, textTransform: "uppercase" }}>Accrued, awaiting collection</div></div>
            <div><div style={{ fontSize: 18, fontWeight: 800, color: C.green }}>{fmt(overrideRows.maturedQ)}</div><div style={{ fontSize: 10.5, color: C.faint, textTransform: "uppercase" }}>Matured — {q}</div></div>
            <div><div style={{ fontSize: 18, fontWeight: 800, color: C.green }}>{fmt(overrideRows.maturedAll)}</div><div style={{ fontSize: 10.5, color: C.faint, textTransform: "uppercase" }}>Matured — all time</div></div>
          </div>
        </Card>
      )}

      <Card style={{ overflowX: "auto" }}>
        <table>
          <thead><tr><th>Owner</th><th>Open deals</th><th>Weighted pipeline</th><th>Forecast-category</th><th>Accrued — awaiting collection</th><th>Matured — {q}</th><th>Matured — all time</th><th>Paid to date</th><th>Payable now</th>{canProcessPayouts && <th></th>}</tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={10} style={{ color: C.faint, textAlign: "center", padding: 24 }}>No owners in view.</td></tr>}
            {rows.map((r) => (
              <tr key={r.o.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{r.o.name}</div>
                  <div style={{ fontSize: 11, color: C.faint }}>{r.o.role === "Area Director" ? "Direct only — override shown above" : (r.o.region || "All territories")}</div>
                </td>
                <td>{r.openCount}</td>
                <td style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(r.pipeComm)}</td>
                <td style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{fmt(r.fcatComm)}</td>
                <td style={{ fontVariantNumeric: "tabular-nums", color: C.amber, fontWeight: 700 }}>{fmt(r.pendingColl)} <span style={{ color: C.faint, fontSize: 11, fontWeight: 400 }}>({r.wonCount - r.collCount} deals)</span></td>
                <td style={{ fontVariantNumeric: "tabular-nums", color: C.green, fontWeight: 700 }}>{fmt(r.maturedQ)}</td>
                <td style={{ fontVariantNumeric: "tabular-nums", color: C.green }}>{fmt(r.maturedAll)} <span style={{ color: C.faint, fontSize: 11 }}>({r.collCount} collected)</span></td>
                <td style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(r.paid)}</td>
                <td style={{ fontVariantNumeric: "tabular-nums", color: r.payable > 0 ? C.amber : C.faint, fontWeight: r.payable > 0 ? 700 : 400 }}>{fmt(r.payable)}</td>
                {canProcessPayouts && (
                  <td>{r.payable > 0 && <Btn small onClick={() => onRecordPayout(r.o, r.payable)}>Record payout</Btn>}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div style={{ fontSize: 11, color: C.faint, marginTop: 10 }}>
        Weighted pipeline applies win probability; Forecast-category is the unweighted value of deals you would defend in a forecast call. Accrued commission becomes Matured on the date collection is confirmed. Cross-territory agreements split a deal's direct commission between the owning and assisting BD automatically. Payable = Matured minus payouts already recorded by Finance. All figures are indicative — the payroll calculation on actual collections remains authoritative.
      </div>
    </div>
  );
}

function MeetingNoteForm({ onSave, onClose }) {
  const [f, setF] = useState({ date: today(), venue: "", attendees: "", orgResponsibility: "", issues: "", leadershipNeeded: false, leadershipNote: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <Modal title="Meeting brief" onClose={onClose}>
      <div style={{ fontSize: 12, color: C.sub, marginBottom: 12 }}>Stage moved to Meeting Held — capture the brief while it's fresh.</div>
      <div style={{ display: "flex", gap: 10 }}>
        <Field label="Date" flex><input type="date" style={inputStyle} value={f.date} onChange={set("date")} /></Field>
        <Field label="Venue" flex><input style={inputStyle} value={f.venue} onChange={set("venue")} placeholder="e.g. KQ HQ, Nairobi" /></Field>
      </div>
      <Field label="Who was in attendance"><textarea style={{ ...inputStyle, minHeight: 45 }} value={f.attendees} onChange={set("attendees")} placeholder="Names & titles, both sides" /></Field>
      <Field label="Responsibility within our org"><input style={inputStyle} value={f.orgResponsibility} onChange={set("orgResponsibility")} placeholder="Who owns the follow-up" /></Field>
      <Field label="Issue(s) for discussion"><textarea style={{ ...inputStyle, minHeight: 55 }} value={f.issues} onChange={set("issues")} /></Field>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0" }}>
        <input type="checkbox" checked={f.leadershipNeeded} onChange={(e) => setF({ ...f, leadershipNeeded: e.target.checked })} id="ldr" />
        <label htmlFor="ldr" style={{ fontSize: 13, fontWeight: 600 }}>Leadership involvement needed?</label>
      </div>
      {f.leadershipNeeded && <Field label="Detail"><input style={inputStyle} value={f.leadershipNote} onChange={set("leadershipNote")} placeholder="What's needed from leadership" /></Field>}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Btn kind="ghost" onClick={onClose}>Skip</Btn>
        <Btn onClick={() => onSave(f)}>Save brief</Btn>
      </div>
    </Modal>
  );
}

function AgreementForm({ deal, bds, onSave, onClose }) {
  const otherBDs = bds.filter((b) => b.id !== deal?.ownerId);
  const [f, setF] = useState(deal?.agreement || { assistBDId: otherBDs[0]?.id || "", splitPct: 20, notes: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <Modal title={`Cross-territory agreement — ${deal?.name || ""}`} onClose={onClose}>
      <div style={{ fontSize: 12, color: C.sub, marginBottom: 12 }}>Arranges a split of the deal owner's direct commission with an assisting BD from another territory. The Area Director's override is unaffected.</div>
      <Field label="Assisting BD">
        <select style={inputStyle} value={f.assistBDId} onChange={set("assistBDId")}>{otherBDs.map((b) => <option key={b.id} value={b.id}>{b.name}{b.region ? ` — ${b.region}` : ""}</option>)}</select>
      </Field>
      <Field label="Split to assisting BD (% of owner's direct commission)"><input type="number" min="0" max="100" style={inputStyle} value={f.splitPct} onChange={set("splitPct")} /></Field>
      <Field label="Notes"><textarea style={{ ...inputStyle, minHeight: 50 }} value={f.notes} onChange={set("notes")} placeholder="e.g. Air Peace introduction sourced by Isaac, account owned by Zelealem" /></Field>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        {deal?.agreement && <Btn kind="danger" onClick={() => onSave(null)}>Remove agreement</Btn>}
        <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
          <Btn kind="ghost" onClick={onClose}>Cancel</Btn>
          <Btn onClick={() => onSave({ assistBDId: f.assistBDId, splitPct: Number(f.splitPct) || 0, notes: f.notes, createdAt: today() })}>Save agreement</Btn>
        </div>
      </div>
    </Modal>
  );
}

function PayoutForm({ owner, defaultAmount, onSave, onClose }) {
  const [f, setF] = useState({ ownerId: owner.id, amount: Math.round(defaultAmount || 0), date: today(), note: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <Modal title={`Record payout — ${owner.name}`} onClose={onClose}>
      <div style={{ fontSize: 12, color: C.sub, marginBottom: 12 }}>Logs commission paid out to staff. Reduces their outstanding payable in the statement.</div>
      <div style={{ display: "flex", gap: 10 }}>
        <Field label="Amount (USD)" flex><input type="number" style={inputStyle} value={f.amount} onChange={set("amount")} /></Field>
        <Field label="Date" flex><input type="date" style={inputStyle} value={f.date} onChange={set("date")} /></Field>
      </div>
      <Field label="Note"><input style={inputStyle} value={f.note} onChange={set("note")} placeholder="e.g. July payroll run" /></Field>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Btn kind="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={() => onSave({ ...f, amount: Number(f.amount) || 0 })}>Save payout</Btn>
      </div>
    </Modal>
  );
}

function LostReasonForm({ onSave, onClose }) {
  const [reason, setReason] = useState("Price");
  const [note, setNote] = useState("");
  return (
    <Modal title="Why was this deal lost?" onClose={onClose}>
      <div style={{ fontSize: 12, color: C.sub, marginBottom: 12 }}>Capturing the reason feeds the win/loss analysis in Insights — thirty seconds now buys strategy later.</div>
      <Field label="Primary reason">
        <select style={inputStyle} value={reason} onChange={(e) => setReason(e.target.value)}>{LOSS_REASONS.map((r) => <option key={r}>{r}</option>)}</select>
      </Field>
      <Field label="Detail (optional)"><textarea style={{ ...inputStyle, minHeight: 50 }} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. OEM matched our price with 60-day terms" /></Field>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Btn kind="ghost" onClick={onClose}>Skip</Btn>
        <Btn onClick={() => onSave(reason, note)}>Save reason</Btn>
      </div>
    </Modal>
  );
}

function RegForm({ account, onSave, onClose }) {
  const [f, setF] = useState(account.reg || { status: "Not started", submitted: "", expected: "", expiry: "", notes: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <Modal title={`Vendor registration — ${account.name}`} onClose={onClose}>
      <Field label="Status">
        <select style={inputStyle} value={f.status} onChange={set("status")}>{REG_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
      </Field>
      <div style={{ display: "flex", gap: 10 }}>
        <Field label="Docs submitted" flex><input type="date" style={inputStyle} value={f.submitted} onChange={set("submitted")} /></Field>
        <Field label="Expected award" flex><input type="date" style={inputStyle} value={f.expected} onChange={set("expected")} /></Field>
      </div>
      <Field label="Approval expiry (if awarded)"><input type="date" style={inputStyle} value={f.expiry} onChange={set("expiry")} /></Field>
      <Field label="Notes"><textarea style={{ ...inputStyle, minHeight: 55 }} value={f.notes} onChange={set("notes")} placeholder="e.g. Register Vogt PMA and Oshino under separate procurement committees" /></Field>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Btn kind="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={() => onSave(f)}>Save registration</Btn>
      </div>
    </Modal>
  );
}

/* ------------------------------- Forms ----------------------------- */

function QuoteForm({ item, preset, accounts, deals, contacts, quotes, catalog, me, thresholds, termsMatrix, quoteCount, onSave, onClose }) {
  const year = new Date().getFullYear();
  const [f, setF] = useState(item || {
    id: uid(), number: `Q-${year}-${String(quoteCount + 1).padStart(3, "0")}`, accountId: preset?.accountId || accounts[0]?.id || "", oppId: preset?.oppId || "", ownerId: me.id,
    lines: [{ itemId: catalog[0]?.id || "", qty: 1, unitPrice: catalog[0]?.listPrice || 0, cond: "NE", leadTime: catalog[0]?.lead || "" }],
    discountPct: 0, paymentTerms: "Cash on Order", incoterm: "EXW Hollywood, FL", attention: "", customerRef: "", status: "Draft", chain: [], approvals: [], createdAt: today(), rfqDate: "", sentAt: "", notes: "",
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const itemById = (id) => catalog.find((p) => p.id === id);

  const tierPrice = (it, qty) => (it?.bulkQty && Number(qty) >= it.bulkQty && it.bulkPrice) ? it.bulkPrice : (it?.listPrice ?? 0);
  const setLine = (i, k, v) => {
    setF({
      ...f,
      lines: f.lines.map((l, idx) => {
        if (idx !== i) return l;
        const next = { ...l, [k]: v };
        if (k === "itemId") {
          const it = itemById(v);
          next.unitPrice = tierPrice(it, next.qty);
          next.leadTime = it?.lead || next.leadTime || "";
        }
        if (k === "qty") {
          const it = itemById(next.itemId);
          // pricing engine: snap to the correct tier unless the rep typed a custom price
          const standard = [it?.listPrice, it?.bulkPrice].filter((x) => x !== undefined);
          if (it && (standard.includes(Number(l.unitPrice)) || Number(l.unitPrice) === 0)) {
            next.unitPrice = tierPrice(it, v);
          }
        }
        return next;
      }),
    });
  };
  const addLine = () => setF({ ...f, lines: [...f.lines, { itemId: catalog[0]?.id || "", qty: 1, unitPrice: catalog[0]?.listPrice || 0, cond: "NE", leadTime: catalog[0]?.lead || "" }] });
  const delLine = (i) => setF({ ...f, lines: f.lines.filter((_, idx) => idx !== i) });

  const sub = quoteSubtotal(f);
  const pct = Number(f.discountPct) || 0;
  const net = sub * (1 - pct / 100);
  const term = f.paymentTerms || "Cash on Order";
  const chain = chainForQuote(pct, term, thresholds, termsMatrix);
  const dD = discountDepth(pct, thresholds);
  const tD = termsDepth(term, termsMatrix);
  const accountDeals = deals.filter((d) => d.accountId === f.accountId && d.stage !== "Won" && d.stage !== "Lost");
  const pastOrders = (quotes || []).filter((q) => q.accountId === f.accountId && q.status === "Accepted" && q.id !== f.id).sort((a, b) => (b.sentAt || b.createdAt).localeCompare(a.sentAt || a.createdAt));
  const useAsTemplate = (pq) => setF({ ...f, lines: pq.lines.map((l) => ({ ...l })), notes: f.notes ? f.notes : `Repeat order — referencing ${pq.number}.` });

  return (
    <Modal title={item ? `Edit quote ${f.number}` : `New quote ${f.number}`} onClose={onClose} wide>
      <div style={{ display: "flex", gap: 10 }}>
        <Field label="Account" flex>
          <select style={inputStyle} value={f.accountId} onChange={(e) => setF({ ...f, accountId: e.target.value, oppId: "" })}>{accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
        </Field>
        <Field label="Link opportunity (optional)" flex>
          <select style={inputStyle} value={f.oppId} onChange={set("oppId")}>
            <option value="">None</option>
            {accountDeals.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </Field>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Field label="Attention (contact)" flex>
          <select style={inputStyle} value={f.attention || ""} onChange={set("attention")}>
            <option value="">—</option>
            {(contacts || []).filter((c) => c.accountId === f.accountId).map((c) => <option key={c.id} value={c.name}>{c.name}{c.title ? ` — ${c.title}` : ""}</option>)}
          </select>
        </Field>
        <Field label="Customer ref / RFQ no." flex><input style={inputStyle} value={f.customerRef || ""} onChange={set("customerRef")} placeholder="e.g. KQ-RFQ-2026-0412" /></Field>
        <Field label="Delivery (Incoterms 2020)" flex>
          <select style={inputStyle} value={f.incoterm || INCOTERMS[0]} onChange={set("incoterm")}>{INCOTERMS.map((t) => <option key={t}>{t}</option>)}</select>
        </Field>
      </div>

      {pastOrders.length > 0 && (
        <div style={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: 4, padding: "10px 12px", marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.sub, marginBottom: 6 }}>Past orders for this account — reference for repeat business</div>
          {pastOrders.slice(0, 4).map((pq) => (
            <div key={pq.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, padding: "4px 0", borderBottom: `1px solid ${C.surface}` }}>
              <div>
                <strong>{pq.number}</strong> · {pq.sentAt || pq.createdAt} · {pq.lines.length} line{pq.lines.length > 1 ? "s" : ""} · {fmt(quoteNet(pq))}
                <span style={{ color: C.faint }}> — {pq.lines.map((l) => catalog.find((p) => p.id === l.itemId)?.name).filter(Boolean).slice(0, 2).join(", ")}{pq.lines.length > 2 ? "…" : ""}</span>
              </div>
              <button onClick={() => useAsTemplate(pq)} style={{ background: "none", border: `1px solid ${C.teal}`, color: C.teal, borderRadius: 4, padding: "3px 8px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>Use as template</button>
            </div>
          ))}
        </div>
      )}

      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: C.sub, marginBottom: 6 }}>Line items (from catalog)</div>
      {f.lines.map((l, i) => {
        const it = itemById(l.itemId);
        return (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center", flexWrap: "wrap" }}>
            <select style={{ ...inputStyle, flex: "3 1 220px" }} value={l.itemId} onChange={(e) => setLine(i, "itemId", e.target.value)}>
              {Object.keys(PRODUCTS).map((line) => (
                <optgroup key={line} label={line}>
                  {catalog.filter((p) => p.productLine === line).map((p) => <option key={p.id} value={p.id}>{p.pn ? `[${p.pn}] ` : ""}{p.name} — {p.listPrice > 0 ? fmt2(p.listPrice) : "POA"}</option>)}
                </optgroup>
              ))}
            </select>
            <select style={{ ...inputStyle, flex: "0 1 70px" }} value={l.cond || "NE"} onChange={(e) => setLine(i, "cond", e.target.value)} title="Condition code">
              {COND_CODES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input type="number" min="1" style={{ ...inputStyle, flex: "1 1 60px" }} value={l.qty} onChange={(e) => setLine(i, "qty", e.target.value)} placeholder="Qty" />
            <input style={{ ...inputStyle, flex: "1 1 85px" }} value={l.leadTime || ""} onChange={(e) => setLine(i, "leadTime", e.target.value)} placeholder="Lead time" title="Lead time" />
            <input type="number" step="0.01" style={{ ...inputStyle, flex: "1 1 95px" }} value={l.unitPrice} onChange={(e) => setLine(i, "unitPrice", e.target.value)} placeholder="Unit $" />
            <div style={{ width: 85, fontSize: 13, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt((Number(l.qty) || 0) * (Number(l.unitPrice) || 0))}</div>
            {f.lines.length > 1 && <IconBtn onClick={() => delLine(i)} color={C.red}><Trash2 size={14} /></IconBtn>}
            {it?.bulkQty && (
              <div style={{ width: "100%", fontSize: 11, color: Number(l.qty) >= it.bulkQty ? C.green : C.sub, fontWeight: Number(l.qty) >= it.bulkQty ? 600 : 400 }}>
                Volume tier: {fmt2(it.bulkPrice)} at {it.bulkQty}+ units{Number(l.qty) >= it.bulkQty ? " — applied automatically" : ""}
              </div>
            )}
            {it && it.listPrice > 0 && Number(l.unitPrice) !== it.listPrice && Number(l.unitPrice) !== it.bulkPrice && <div style={{ width: "100%", fontSize: 11, color: C.amber }}>Unit price differs from list ({fmt2(it.listPrice)}{it.bulkQty ? ` / ${fmt2(it.bulkPrice)} @${it.bulkQty}+` : ""}). Use the discount field for approved discounting; line price changes bypass the workflow.</div>}
          </div>
        );
      })}
      <button onClick={addLine} style={{ background: "none", border: "none", color: C.blue, fontSize: 12, fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "inherit", marginBottom: 12 }}>+ Add line</button>

      {[...new Set(f.lines.map((l) => itemById(l.itemId)?.productLine).filter(Boolean))].map((pl) => GUIDANCE[pl] && (
        <div key={pl} style={{ background: C.greenBg, borderRadius: 4, padding: "8px 10px", fontSize: 12, color: C.ink, marginBottom: 8 }}>
          <strong style={{ color: C.green }}>Guided selling — {pl}:</strong> {GUIDANCE[pl]}
        </div>
      ))}

      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
        <Field label="Discount (%)">
          <input type="number" min="0" max="60" style={{ ...inputStyle, width: 100 }} value={f.discountPct} onChange={set("discountPct")} />
        </Field>
        <Field label="Payment terms">
          <select style={{ ...inputStyle, width: 170 }} value={term} onChange={set("paymentTerms")}>
            {PAYMENT_TERMS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="RFQ received (mandatory)">
          <input type="date" required style={{ ...inputStyle, width: 150, borderColor: f.rfqDate ? C.line : C.red }} value={f.rfqDate || ""} onChange={set("rfqDate")} />
          {!f.rfqDate && <div style={{ fontSize: 10.5, color: C.red, marginTop: 3 }}>Required before this quote can be submitted for approval.</div>}
        </Field>
        <div style={{ marginBottom: 12, fontSize: 13 }}>
          Subtotal <strong>{fmt(sub)}</strong> · Discount −{fmt(sub - net)} · Net <strong style={{ fontSize: 15 }}>{fmt(net)}</strong>
        </div>
      </div>

      <div style={{ background: C.bg, borderRadius: 4, padding: "10px 12px", marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.sub, marginBottom: 6 }}>Approval required</div>
        <div style={{ fontSize: 12, color: C.sub, marginBottom: 6 }}>
          Discount {pct}%: {dD === 0 ? "no approval" : `through ${APPROVAL_LEVELS[dD - 1].role}`} · Terms "{term}": {tD === 0 ? "no approval" : `through ${APPROVAL_LEVELS[tD - 1].role}`} — deepest requirement sets the chain.
        </div>
        {chain.length === 0 ? (
          <div style={{ fontSize: 13, color: C.green, fontWeight: 600 }}><Check size={13} style={{ verticalAlign: "-2px" }} /> Within standard discretion — auto-approves on submit.</div>
        ) : (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            {chain.map((role, i) => (
              <span key={role} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                {i > 0 && <span style={{ color: C.faint }}>→</span>}
                <Tag color={roleColorMap[role]}>{role}</Tag>
              </span>
            ))}
          </div>
        )}
      </div>

      <Field label="Notes / justification for approvers"><textarea style={{ ...inputStyle, minHeight: 55 }} value={f.notes} onChange={set("notes")} placeholder="e.g. Volume commitment; matches competitor offer at Ethiopian MRO" /></Field>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Btn kind="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={() => {
          if (!f.rfqDate) { alert("RFQ received date is mandatory."); return; }
          if (f.lines.length) onSave({ ...f, discountPct: pct, lines: f.lines.map((l) => ({ ...l, qty: Number(l.qty) || 0, unitPrice: Number(l.unitPrice) || 0 })) });
        }}>Save draft</Btn>
      </div>
      <div style={{ fontSize: 11, color: C.faint, marginTop: 8 }}>Saved as Draft — submit it from the Quotes table to start the approval chain.</div>
    </Modal>
  );
}

function ProductForm({ item, onSave, onClose }) {
  const [f, setF] = useState(item || { id: uid(), productLine: "Oshino Lamps", pn: "", name: "", unit: "EA", listPrice: 0, lead: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <Modal title={item ? "Edit catalog item" : "New catalog item"} onClose={onClose}>
      <Field label="Product line"><select style={inputStyle} value={f.productLine} onChange={set("productLine")}>{Object.keys(PRODUCTS).map((p) => <option key={p}>{p}</option>)}</select></Field>
      <div style={{ display: "flex", gap: 10 }}>
        <Field label="Part number" flex><input style={inputStyle} value={f.pn || ""} onChange={set("pn")} placeholder="e.g. VA-2540-T01" /></Field>
        <Field label="UOM" flex><input style={inputStyle} value={f.unit} onChange={set("unit")} placeholder="EA / KIT / EVT" /></Field>
      </div>
      <Field label="Description"><input style={inputStyle} value={f.name} onChange={set("name")} placeholder="e.g. Hot Water Tank Assy (OEM 8921110G5)" /></Field>
      <div style={{ display: "flex", gap: 10 }}>
        <Field label="Standard lead time" flex><input style={inputStyle} value={f.lead || ""} onChange={set("lead")} placeholder="Stock / 2-3 wks / Per T/A" /></Field>
        <Field label="List price (USD)" flex><input type="number" step="0.01" style={inputStyle} value={f.listPrice} onChange={set("listPrice")} /></Field>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Btn kind="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={() => f.name.trim() && onSave({ ...f, listPrice: Number(f.listPrice) || 0 })}>Save item</Btn>
      </div>
    </Modal>
  );
}

function DealForm({ item, accounts, owners, me, lockOwner, roleOf, stageProb, onSave, onClose }) {
  const [f, setF] = useState(item || {
    id: uid(), name: "", accountId: accounts[0]?.id || "", ownerId: me.id,
    lines: [{ product: "Oshino Lamps", value: 0 }],
    stage: "Prospect", prob: 10, forecastCat: "Pipeline", closeDate: "", notes: "", createdAt: today(), closedAt: "",
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const setStageLocal = (e) => {
    const stage = e.target.value;
    setF({ ...f, stage, prob: stageProb?.[stage] ?? STAGE_PROB[stage] ?? f.prob, forecastCat: STAGE_FCAT[stage] || f.forecastCat, closedAt: (stage === "Won" || stage === "Lost") ? (f.closedAt || today()) : "" });
  };
  const setLine = (i, k, v) => setF({ ...f, lines: f.lines.map((l, idx) => (idx === i ? { ...l, [k]: v } : l)) });
  const addLine = () => setF({ ...f, lines: [...f.lines, { product: "Oshino Lamps", value: 0 }] });
  const delLine = (i) => setF({ ...f, lines: f.lines.filter((_, idx) => idx !== i) });
  const total = f.lines.reduce((s, l) => s + (Number(l.value) || 0), 0);
  const ownerRole = (roleOf && roleOf(f.ownerId)) || "Territory Manager (BD)";
  const directRate = ownerRole === "Area Director" ? AD_DIRECT_RATE : BDM_RATE;
  const comm = total * directRate;
  const override = total * AD_OVERRIDE_RATE;

  return (
    <Modal title={item ? "Edit opportunity" : "New opportunity"} onClose={onClose} wide>
      <Field label="Opportunity name"><input style={inputStyle} value={f.name} onChange={set("name")} placeholder="e.g. PMA parts evaluation" /></Field>
      <div style={{ display: "flex", gap: 10 }}>
        <Field label="Account" flex>
          <select style={inputStyle} value={f.accountId} onChange={set("accountId")}>{accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
        </Field>
        <Field label="Owner" flex>
          <select style={inputStyle} value={f.ownerId} onChange={set("ownerId")} disabled={lockOwner}>{owners.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select>
        </Field>
      </div>

      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: C.sub, marginBottom: 6 }}>Revenue lines</div>
      {f.lines.map((l, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
          <select style={{ ...inputStyle, flex: 2 }} value={l.product} onChange={(e) => setLine(i, "product", e.target.value)}>
            {Object.keys(PRODUCTS).map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <input type="number" style={{ ...inputStyle, flex: 1 }} value={l.value} onChange={(e) => setLine(i, "value", e.target.value)} placeholder="USD" />
          {f.lines.length > 1 && <IconBtn onClick={() => delLine(i)} color={C.red}><Trash2 size={14} /></IconBtn>}
        </div>
      ))}
      <button onClick={addLine} style={{ background: "none", border: "none", color: C.blue, fontSize: 12, fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "inherit", marginBottom: 10 }}>+ Add product line</button>
      <div style={{ fontSize: 12, color: C.teal, marginBottom: 12 }}>
        Total {fmt(total)} · {ownerRole} direct commission ({(directRate * 100).toFixed(0)}%) <strong>{fmt(comm)}</strong>
        {ownerRole !== "Area Director" && <span style={{ color: C.faint }}> · +1% Area Director territory override {fmt(override)}</span>}
        {f.agreement?.assistBDId && <span style={{ color: C.amber }}> · Cross-territory split active — see Pipeline</span>}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <Field label="Stage" flex>
          <select style={inputStyle} value={f.stage} onChange={setStageLocal}>{STAGES.map((s) => <option key={s}>{s}</option>)}</select>
        </Field>
        <Field label="Win %" flex><input type="number" min="0" max="100" style={inputStyle} value={f.prob} onChange={(e) => setF({ ...f, prob: Number(e.target.value) })} /></Field>
        <Field label="Forecast category" flex>
          <select style={inputStyle} value={f.forecastCat} onChange={set("forecastCat")}>{FORECAST_CATS.map((c) => <option key={c}>{c}</option>)}</select>
        </Field>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Field label="Target close" flex><input type="date" style={inputStyle} value={f.closeDate} onChange={set("closeDate")} /></Field>
        <Field label="Created" flex><input type="date" style={inputStyle} value={f.createdAt} onChange={set("createdAt")} /></Field>
      </div>
      <Field label="Notes"><textarea style={{ ...inputStyle, minHeight: 60 }} value={f.notes} onChange={set("notes")} /></Field>
      {(f.meetingNotes || []).length > 0 && (
        <div style={{ marginTop: 4, marginBottom: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.sub, marginBottom: 6 }}>Meeting brief history</div>
          {f.meetingNotes.map((n, i) => (
            <div key={i} style={{ fontSize: 12, background: C.bg, borderRadius: 4, padding: "8px 10px", marginBottom: 6 }}>
              <strong>{n.date}</strong> · {n.venue} — Attendees: {n.attendees} · Owner: {n.orgResponsibility}
              <div style={{ color: C.sub, marginTop: 2 }}>Issue: {n.issues}</div>
              {n.leadershipNeeded && <div style={{ color: C.amber, fontWeight: 700, marginTop: 2 }}>⚠ Leadership involvement requested</div>}
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Btn kind="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={() => f.name.trim() && onSave({ ...f, lines: f.lines.map((l) => ({ ...l, value: Number(l.value) || 0 })) })}>Save opportunity</Btn>
      </div>
    </Modal>
  );
}

function LeadForm({ item, accounts, contacts, onSave, onClose }) {
  const [f, setF] = useState(item || { id: uid(), accountId: accounts[0]?.id || "", contactId: "", contactName: "", title: "", source: "Referral", product: "Oshino Lamps", est: 0, status: "Unqualified", rank: "Warm", notes: "", createdAt: today() });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const acctContacts = contacts.filter((c) => c.accountId === f.accountId);
  const selectedAccount = accounts.find((a) => a.id === f.accountId);
  return (
    <Modal title={item ? "Edit lead" : "New lead"} onClose={onClose}>
      <Field label="Airline / company">
        <select style={inputStyle} value={f.accountId} onChange={(e) => setF({ ...f, accountId: e.target.value, contactId: "" })}>
          {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </Field>
      <div style={{ fontSize: 11, color: C.faint, marginTop: -8, marginBottom: 10 }}>
        Don't see the airline? Only the Area Director can add a new account — ask them to create it first, then log this lead against it.{selectedAccount ? ` Region: ${selectedAccount.region}.` : ""}
      </div>
      <Field label="Contact">
        <select style={inputStyle} value={f.contactId} onChange={set("contactId")}>
          <option value="">— New / not listed (type below) —</option>
          {acctContacts.map((c) => <option key={c.id} value={c.id}>{c.name}{c.title ? ` — ${c.title}` : ""}</option>)}
        </select>
      </Field>
      {!f.contactId && (
        <div style={{ display: "flex", gap: 10 }}>
          <Field label="New contact name" flex><input style={inputStyle} value={f.contactName} onChange={set("contactName")} /></Field>
          <Field label="Title" flex><input style={inputStyle} value={f.title} onChange={set("title")} /></Field>
        </div>
      )}
      <div style={{ display: "flex", gap: 10 }}>
        <Field label="Source" flex><select style={inputStyle} value={f.source} onChange={set("source")}>{LEAD_SOURCES.map((s) => <option key={s}>{s}</option>)}</select></Field>
        <Field label="Rank" flex><select style={inputStyle} value={f.rank || "Warm"} onChange={set("rank")}>{LEAD_RANKS.map((r) => <option key={r}>{r}</option>)}</select></Field>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Field label="Product interest" flex><select style={inputStyle} value={f.product} onChange={set("product")}>{Object.keys(PRODUCTS).map((p) => <option key={p}>{p}</option>)}</select></Field>
        <Field label="Est. value (USD)" flex><input type="number" style={inputStyle} value={f.est} onChange={set("est")} /></Field>
      </div>
      <Field label="Notes"><textarea style={{ ...inputStyle, minHeight: 50 }} value={f.notes} onChange={set("notes")} /></Field>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Btn kind="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={() => f.accountId && onSave({ ...f, est: Number(f.est) || 0 })}>Save lead</Btn>
      </div>
    </Modal>
  );
}

function AccountForm({ item, owners, me, lockOwner, onSave, onClose }) {
  const [f, setF] = useState(item || { id: uid(), name: "", tier: "Tier 2", region: "East Africa", country: "", ownerId: me.id, notes: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <Modal title={item ? "Edit account" : "New account"} onClose={onClose}>
      <Field label="Airline / organisation"><input style={inputStyle} value={f.name} onChange={set("name")} /></Field>
      <div style={{ display: "flex", gap: 10 }}>
        <Field label="Tier" flex><select style={inputStyle} value={f.tier} onChange={set("tier")}>{TIERS.map((t) => <option key={t}>{t}</option>)}</select></Field>
        <Field label="Region" flex>
          <select style={inputStyle} value={f.region} onChange={set("region")}>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select>
        </Field>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Field label="Country" flex><input style={inputStyle} value={f.country} onChange={set("country")} /></Field>
        <Field label="Owner" flex><select style={inputStyle} value={f.ownerId} onChange={set("ownerId")} disabled={lockOwner}>{owners.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select></Field>
      </div>
      <Field label="Notes"><textarea style={{ ...inputStyle, minHeight: 60 }} value={f.notes} onChange={set("notes")} /></Field>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Btn kind="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={() => f.name.trim() && onSave(f)}>Save account</Btn>
      </div>
    </Modal>
  );
}

function ContactForm({ item, accounts, onSave, onClose }) {
  const [f, setF] = useState(item || { id: uid(), name: "", title: "", accountId: accounts[0]?.id || "", email: "", phone: "", notes: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <Modal title={item ? "Edit contact" : "New contact"} onClose={onClose}>
      <Field label="Name"><input style={inputStyle} value={f.name} onChange={set("name")} /></Field>
      <Field label="Title"><input style={inputStyle} value={f.title} onChange={set("title")} /></Field>
      <Field label="Account"><select style={inputStyle} value={f.accountId} onChange={set("accountId")}>{accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></Field>
      <div style={{ display: "flex", gap: 10 }}>
        <Field label="Email" flex><input style={inputStyle} value={f.email} onChange={set("email")} /></Field>
        <Field label="Phone" flex><input style={inputStyle} value={f.phone} onChange={set("phone")} /></Field>
      </div>
      <Field label="Notes"><textarea style={{ ...inputStyle, minHeight: 50 }} value={f.notes} onChange={set("notes")} /></Field>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Btn kind="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={() => f.name.trim() && onSave(f)}>Save contact</Btn>
      </div>
    </Modal>
  );
}

function ActivityForm({ accounts, onSave, onClose }) {
  const [f, setF] = useState({ id: uid(), text: "", accountId: "", due: "", done: false });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <Modal title="New action" onClose={onClose}>
      <Field label="What needs doing"><input style={inputStyle} value={f.text} onChange={set("text")} placeholder="e.g. Follow up on RFQ with Jambojet" /></Field>
      <div style={{ display: "flex", gap: 10 }}>
        <Field label="Linked account (optional)" flex>
          <select style={inputStyle} value={f.accountId} onChange={set("accountId")}>
            <option value="">None</option>{accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </Field>
        <Field label="Due date" flex><input type="date" style={inputStyle} value={f.due} onChange={set("due")} /></Field>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Btn kind="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={() => f.text.trim() && onSave(f)}>Save action</Btn>
      </div>
    </Modal>
  );
}

function InteractionForm({ account, onSave, onClose }) {
  const [f, setF] = useState({ id: uid(), accountId: account.id, type: "Call", date: today(), summary: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <Modal title={`Log touch — ${account.name}`} onClose={onClose}>
      <div style={{ display: "flex", gap: 10 }}>
        <Field label="Type" flex><select style={inputStyle} value={f.type} onChange={set("type")}>{INTERACTION_TYPES.map((t) => <option key={t}>{t}</option>)}</select></Field>
        <Field label="Date" flex><input type="date" style={inputStyle} value={f.date} onChange={set("date")} /></Field>
      </div>
      <Field label="Summary"><textarea style={{ ...inputStyle, minHeight: 60 }} value={f.summary} onChange={set("summary")} placeholder="e.g. Call with CTO — asked for Oshino cross-reference list" /></Field>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Btn kind="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={() => f.summary.trim() && onSave(f)}>Log it</Btn>
      </div>
    </Modal>
  );
}

function UsersForm({ users, onSave, onClose }) {
  const [list, setList] = useState(users);
  const blank = { name: "", email: "", role: "Territory Manager (BD)", region: "East Africa", reportsTo: list.find((u) => u.role === "Area Director")?.id || "", pin: "1234" };
  const [draft, setDraft] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const admin = list.find((u) => u.role === "Area Director");

  const startEdit = (u) => { setEditingId(u.id); setDraft({ name: u.name, email: u.email || "", role: u.role, region: u.region || "", reportsTo: u.reportsTo || "", pin: u.pin || "1234" }); };
  const cancelEdit = () => { setEditingId(null); setDraft(blank); };

  const save = () => {
    if (!draft.name.trim()) return;
    const email = draft.email.trim() || emailOf(draft.name);
    const region = draft.role === "Territory Manager (BD)" ? draft.region : "";
    const pin = /^\d{4}$/.test(draft.pin) ? draft.pin : "1234";
    if (editingId) {
      setList(list.map((u) => (u.id === editingId ? { ...u, name: draft.name.trim(), email, role: draft.role, region, reportsTo: draft.role === "Area Director" ? "" : draft.reportsTo, pin } : u)));
    } else {
      setList([...list, { id: uid(), name: draft.name.trim(), email, role: draft.role, region, reportsTo: draft.role === "Area Director" ? "" : draft.reportsTo, pin }]);
    }
    cancelEdit();
  };

  const remove = (id) => {
    setList(list.filter((u) => u.id !== id).map((u) => (u.reportsTo === id ? { ...u, reportsTo: admin?.id || "" } : u)));
    if (editingId === id) cancelEdit();
  };

  const nameOf = (id) => list.find((u) => u.id === id)?.name || "—";

  return (
    <Modal title="Users, roles & reporting lines" onClose={onClose} wide>
      <div style={{ fontSize: 12, color: C.sub, marginBottom: 12 }}>
        Role determines access automatically: BDs are locked to their territory's accounts; COO/CEO/President see everything read-only and approve quotes at their matrix level; Analyst &amp; Operations can update the catalog; Finance processes payouts. Reporting line is organizational only — it doesn't change access, but drives things like escalation context and org charts.
      </div>
      {list.map((u) => (
        <div key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.bg}`, gap: 8, flexWrap: "wrap" }}>
          <div style={{ minWidth: 0 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</span>
            {u.region && <span style={{ fontSize: 12, color: C.faint, marginLeft: 8 }}>{u.region}</span>}
            <div style={{ fontSize: 11, color: C.faint }}>
              {u.email || emailOf(u.name)}{u.reportsTo ? <> · reports to <strong>{nameOf(u.reportsTo)}</strong></> : u.role === "Area Director" ? " · top of reporting line" : ""}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <Tag color={roleColorMap[u.role] || C.faint}>{u.role}</Tag>
            <IconBtn onClick={() => startEdit(u)}><Pencil size={14} /></IconBtn>
            {list.length > 1 && u.role !== "Area Director" && <IconBtn onClick={() => remove(u.id)} color={C.red}><Trash2 size={14} /></IconBtn>}
          </div>
        </div>
      ))}

      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.sub, marginTop: 16, marginBottom: 8 }}>
        {editingId ? "Edit user" : "Create user"}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input style={{ ...inputStyle, flex: "2 1 160px" }} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Full name" />
        <input style={{ ...inputStyle, flex: "2 1 200px" }} value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} placeholder={draft.name ? emailOf(draft.name) : "email@banner.aero (auto if blank)"} />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
        <select style={{ ...inputStyle, flex: "1 1 170px" }} value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} disabled={editingId === admin?.id}>
          {ROLE_NAMES.filter((r) => r !== "Area Director" || editingId === admin?.id).map((r) => <option key={r}>{r}</option>)}
        </select>
        {draft.role === "Territory Manager (BD)" && (
          <select style={{ ...inputStyle, flex: "1 1 140px" }} value={draft.region} onChange={(e) => setDraft({ ...draft, region: e.target.value })}>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select>
        )}
        {draft.role !== "Area Director" && (
          <select style={{ ...inputStyle, flex: "1 1 160px" }} value={draft.reportsTo} onChange={(e) => setDraft({ ...draft, reportsTo: e.target.value })}>
            <option value="">Reports to…</option>
            {list.filter((u) => u.id !== editingId).map((u) => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
          </select>
        )}
        <input type="password" inputMode="numeric" maxLength={4} style={{ ...inputStyle, flex: "0 1 80px" }} placeholder="PIN" value={draft.pin} onChange={(e) => setDraft({ ...draft, pin: e.target.value.replace(/\D/g, "") })} />
        <Btn small onClick={save}>{editingId ? "Save changes" : "Create user"}</Btn>
        {editingId && <Btn small kind="ghost" onClick={cancelEdit}>Cancel edit</Btn>}
      </div>
      <div style={{ fontSize: 11, color: C.faint, marginTop: 4 }}>PIN gates sign-in on the landing page (4 digits, defaults to 1234 if left blank/invalid).</div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
        <Btn kind="ghost" onClick={onClose}>Close without saving</Btn>
        <Btn onClick={() => onSave(list)}>Save all changes</Btn>
      </div>
    </Modal>
  );
}
