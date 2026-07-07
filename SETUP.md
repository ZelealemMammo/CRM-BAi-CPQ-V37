# BAI Africa CRM — Real Access Control Setup

This turns the current browser-only role simulation into server-enforced
access control. Nobody — including a technically savvy rep — can query
data their role shouldn't see, because Postgres itself blocks it.

**What's in this package:**
- `01_schema_and_rls.sql` — the whole database + every access rule
- `supabaseClient.js` — client init
- `auth.js` — Google sign-in, banner.aero domain lock, session handling
- `SignInScreen.jsx` — replaces the old "tap any name" picker
- `dataAccess.js` — worked example of accounts/deals/quotes wired to Supabase
- this file

**What I can't do for you:** create your Supabase project or your Google
Cloud OAuth client — both require your own accounts. Everything below is
about 20–30 minutes, and you only do it once.

---

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) → New Project.
2. Note the **Project URL** and **anon public key** (Settings → API) —
   you'll paste these into a `.env` file in step 4.
3. Open the **SQL Editor**, paste in `01_schema_and_rls.sql`, run it.
   This creates every table, every RLS policy, and the approval RPC in one
   shot. If it errors partway through, drop the tables it created and
   re-run — it's written to run cleanly from empty.

## 2. Set up Google sign-in

1. In Supabase: **Authentication → Providers → Google** → enable it.
2. In [Google Cloud Console](https://console.cloud.google.com): create an
   OAuth 2.0 Client ID (type: Web application).
   - Authorized redirect URI: copy the callback URL Supabase shows you
     (looks like `https://<project>.supabase.co/auth/v1/callback`).
3. Paste the Google Client ID + Secret back into Supabase's Google provider
   settings. Save.
4. **If BAI runs Google Workspace on banner.aero:** as the Workspace admin,
   go to Admin Console → Security → API controls → App access control, and
   restrict this OAuth app to internal use only. This is what actually
   stops anyone outside your organization from even reaching the consent
   screen — belt-and-suspenders alongside the database trigger.

## 3. Confirm the domain restriction

Two independent layers block non-banner.aero accounts:
- **Database trigger** (`handle_new_user` in the SQL file) — rejects the
  signup outright. This is the one that actually matters.
- **Google account picker hint** (`hd=banner.aero` in `auth.js`) — just
  narrows the picker for a smoother experience; someone could still try a
  personal Gmail and would hit the database rejection instead.

Test this yourself with a non-banner.aero Google account before rolling out
— it should fail cleanly with an error, not silently succeed.

## 4. Wire the frontend

In the Vite project (`bai-crm/`):

```bash
npm install @supabase/supabase-js
```

Create `bai-crm/.env`:
```
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

Copy `supabaseClient.js`, `auth.js`, `SignInScreen.jsx`, and `dataAccess.js`
into `bai-crm/src/`.

In `App.jsx`, replace the sign-in block and the `window.storage` calls using
the pattern in `dataAccess.js`. The accounts/deals/quotes functions there
are a complete worked example — leads/contacts/catalog/activities/aircraft/
aog_cases/payouts follow the identical shape (fetch-all, upsert, delete).
Ask me to generate those once you've confirmed this pattern is what you
want, and I'll finish wiring the rest of the tabs the same way.

## 5. Seed your real data

Your current CRM's SEED object (in `App.jsx`, top of the file) already has
the real catalog, the 46-account book, and the BD team. I can convert that
into a `02_seed_data.sql` insert script on request — straightforward once
the schema above is confirmed to match what you need.

## 6. Bootstrap the first Area Director

The very first person to sign in lands as `role = 'Pending'` — including
you. Nobody can promote themselves, by design. To seed yourself as Area
Director, run this once in the Supabase SQL Editor after your first sign-in:

```sql
update public.profiles set role = 'Area Director' where email = 'your.name@banner.aero';
```

After that, every other role assignment happens through the app's Users &
Roles panel, which only your account can now use.

## 7. Roll out to the team

Send each BD/exec the app URL. First sign-in creates their profile in
`Pending`; you assign their real role and — for BDs — their region, from
Users & Roles. They get access immediately, no re-login required.

---

## What changes for people day-to-day

- **Sign-in** is now their real banner.aero Google account, not a tap-any-name
  picker.
- **A BD literally cannot query another BD's accounts, deals, or commission
  data** — not "the UI hides it," but the database returns nothing.
- **Approvals go through a database function**, not a direct row edit, so a
  quote can't be nudged into "Approved" by anyone except the correct next
  approver in sequence.
- **Everyone's data is now live and shared** — no more per-browser
  localStorage silos. Two BDs can work simultaneously and see each other's
  updates (via the realtime subscription pattern in `dataAccess.js`).
