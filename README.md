# BAI Africa CRM — v37 (full source)

**v37** — Landing page refined: editorial serif display, burnished-gold
aviation accent, ICAO coverage strip as the signature element. Two-column
structure preserved. All landing styling is scoped to the pre-sign-in
branch; the global palette used everywhere else in the app is unchanged.

**v16–v36** covered incremental additions culminating in v36's Industry
Network module (relationship contacts not tied to a customer account),
exposed as an Aircraft 360 sub-tab visible to the Area Director and execs
but not to BDs.


Single-page CRM + CPQ + Aircraft 360 for Banner Aircraft International, Africa Area.

## Stack (actual)
- React 18 + Vite (plain JSX, NOT Next.js)
- Styling: inline styles + minimal CSS (NOT Tailwind / NOT shadcn/ui — note for integrators)
- Icons: lucide-react
- Persistence: `window.storage` abstraction -> localStorage shim in src/App.jsx
  (swap this one object for Supabase/API calls to go multi-user with real auth)

## Structure
- `src/App.jsx` — entire application (~5,300 lines, sectioned with comments):
  constants & role/approval/commission matrices -> Aircraft 360 reference data
  -> seed data (real Banner catalog, 46-account book, BD team, fleets) ->
  storage migrations v1..v15 -> App shell -> Dashboard / Leads / Pipeline /
  Quotes(CPQ) / Products / Accounts / Contacts / Actions / Forecast /
  Insights / Commissions / Aircraft 360 -> forms -> native PDF quote generator
- `src/main.jsx`, `index.html`, `vite.config.js`, `package.json`

## Domain model (state object, persisted as JSON)
users, settings{thresholds, termsMatrix, monthlyQuota}, catalog, quotes,
leads, accounts, contacts, deals, activities, interactions, aircraft,
aogCases, payouts

## Roles & governance (v15)
- **Area Director** — full admin: creates/assigns accounts, sets approval &
  payment-terms matrices, arranges cross-territory agreements, confirms
  collections, sees the territory-wide 1% override.
- **Territory Manager (BD)** — scoped to owned accounts only; creates leads
  (against existing accounts only) and contacts within their book; earns 3%
  direct commission on deals they own.
- **COO / CEO / President** — view-all, approve discounts/terms at their
  matrix level.
- **Analyst / Operations** — view-all; both can update the product catalog
  and pricing.
- **Finance** — tracks collections, records commission payouts to staff.

## Business rules implemented
- Role-based access with owner-scoped lead/account/contact creation
- CPQ: real catalog w/ PNs, condition codes, volume tiers, guided selling,
  repeat-order "use as template" from past accepted quotes
- Approval chains: discount thresholds × payment-terms matrix (union,
  sequential), with mailto-based escalation notification to the next
  approver (true server-side email requires a backend)
- Commission: flat owner-based model — BDM 3% of gross deal value; Area
  Director 2% direct + 1% territory-wide override on every deal; matures on
  collection; cross-territory agreements split a deal's direct commission
  between two BDs
- Collection aging computed from the accepted quote's actual payment terms;
  overdue flagged on Pipeline and Dashboard
- Meeting-Held stage transition pops a structured brief (date, venue,
  attendees, org responsibility, issues, leadership-involvement flag)
- Aviation-standard quotation PDF (native generator, industry T&Cs,
  bottom-anchored terms)
- Vendor registration tracker, RFQ SLA (now mandatory field), stale-deal &
  reorder radar, win/loss reasons
- Aircraft 360: Fleet Intelligence, Model 360, Aircraft Registry, ATA
  Browser, Parts/PMA Intelligence, OEM/MRO/Supplier directories, AOG Desk,
  Sales Heat Map — fleet data is indicative pending operator verification

## Run
```
npm install && npm run dev
```

## Deploy
Vercel/Netlify auto-detect Vite. Data is per-browser localStorage until a
backend (e.g. Supabase, discussed separately) is added — required before
rolling this out to the full BD team, since there is currently no
server-side enforcement of the role/scoping rules above.
