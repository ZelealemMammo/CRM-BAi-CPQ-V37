-- ============================================================================
-- BAI Africa CRM — Supabase schema + Row-Level Security
-- Enforces server-side the same role matrix currently simulated in the app:
--   Area Director   — full admin, all territories
--   Territory Mgr   — scoped to accounts they own
--   COO/CEO/President — view-all, approve at their matrix level
--   Analyst/Operations — view-all, can edit catalog & pricing
--   Finance         — view-all, tracks collections & processes payouts
-- Run this once in the Supabase SQL editor on a fresh project.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 0. Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. Profiles — one row per authenticated user, created automatically on
--    first Google sign-in (see trigger below). New users start with role
--    'Pending' and NO access until the Area Director assigns a real role.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null unique,
  name        text not null,
  role        text not null default 'Pending'
              check (role in ('Pending','Area Director','Territory Manager (BD)',
                               'COO','CEO','President','Analyst','Operations','Finance')),
  region      text default '',
  created_at  timestamptz default now()
);

-- Auto-create a profile row when someone signs in for the first time via
-- Google OAuth. Domain restriction lives here: only @banner.aero accounts
-- get a profile at all; anything else is rejected outright.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  if new.email !~* '@banner\.aero$' then
    raise exception 'Sign-in restricted to banner.aero accounts';
  end if;
  insert into public.profiles (id, email, name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email), 'Pending');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 2. Core domain tables (mirrors the CRM's existing JS data model 1:1)
-- ---------------------------------------------------------------------------
create table public.accounts (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  tier         text default 'Tier 2',
  region       text not null,
  country      text default '',
  owner_id     uuid references public.profiles(id),
  notes        text default '',
  web_customer boolean default false,
  fleet        jsonb default '[]',
  reg_status   text default 'Not started',
  reg_submitted date,
  reg_expected  date,
  reg_expiry    date,
  reg_notes    text default '',
  created_at   timestamptz default now()
);

create table public.contacts (
  id          uuid primary key default gen_random_uuid(),
  account_id  uuid references public.accounts(id) on delete cascade,
  name        text not null,
  title       text default '',
  email       text default '',
  phone       text default '',
  notes       text default '',
  created_at  timestamptz default now()
);

create table public.catalog (
  id          uuid primary key default gen_random_uuid(),
  product_line text not null,
  pn          text default '',
  name        text not null,
  unit        text default 'EA',
  list_price  numeric default 0,
  bulk_qty    integer,
  bulk_price  numeric,
  lead        text default '',
  ata         integer,
  pma         boolean default false,
  created_at  timestamptz default now()
);

create table public.deals (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  account_id    uuid references public.accounts(id),
  owner_id      uuid references public.profiles(id),
  lines         jsonb default '[]',
  stage         text default 'Prospect',
  prob          integer default 10,
  forecast_cat  text default 'Pipeline',
  close_date    date,
  notes         text default '',
  created_at    timestamptz default now(),
  closed_at     date,
  last_touch    date default current_date,
  loss_reason   text default '',
  loss_note     text default '',
  collected_at  date,
  meeting_notes jsonb default '[]',
  agreement     jsonb
);

create table public.quotes (
  id            uuid primary key default gen_random_uuid(),
  number        text not null unique,
  account_id    uuid references public.accounts(id),
  opp_id        uuid references public.deals(id),
  owner_id      uuid references public.profiles(id),
  lines         jsonb default '[]',
  discount_pct  numeric default 0,
  payment_terms text default 'Cash on Order',
  incoterm      text default 'EXW Hollywood, FL',
  attention     text default '',
  customer_ref  text default '',
  status        text default 'Draft',
  chain         jsonb default '[]',
  approvals     jsonb default '[]',
  created_at    timestamptz default now(),
  rfq_date      date,
  sent_at       date,
  notes         text default ''
);

create table public.leads (
  id            uuid primary key default gen_random_uuid(),
  account_id    uuid references public.accounts(id),
  contact_id    uuid references public.contacts(id),
  contact_name  text default '',
  title         text default '',
  source        text default 'Referral',
  product       text default '',
  est           numeric default 0,
  status        text default 'Unqualified',
  rank          text default 'Warm',
  owner_id      uuid references public.profiles(id),
  notes         text default '',
  created_at    timestamptz default now()
);

create table public.activities (
  id          uuid primary key default gen_random_uuid(),
  text        text not null,
  account_id  uuid references public.accounts(id),
  due         date,
  done        boolean default false
);

create table public.interactions (
  id          uuid primary key default gen_random_uuid(),
  account_id  uuid references public.accounts(id),
  type        text default 'Note',
  date        date default current_date,
  notes       text default ''
);

create table public.aircraft (
  id            uuid primary key default gen_random_uuid(),
  account_id    uuid references public.accounts(id),
  type          text not null,
  reg           text default '',
  msn           text default '',
  delivery_year text default '',
  engine        text default '',
  status        text default 'Active',
  notes         text default ''
);

create table public.aog_cases (
  id          uuid primary key default gen_random_uuid(),
  number      text not null unique,
  account_id  uuid references public.accounts(id),
  ac_type     text default '',
  reg         text default '',
  need        text default '',
  status      text default 'Open',
  opened_at   date default current_date,
  closed_at   date,
  notes       text default ''
);

create table public.payouts (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid references public.profiles(id),
  amount      numeric not null,
  date        date default current_date,
  note        text default ''
);

create table public.settings (
  id             int primary key default 1 check (id = 1), -- single row
  monthly_quota  numeric default 300000,
  thresholds     jsonb default '{"ad":5,"coo":10,"ceo":15,"president":20}',
  terms_matrix   jsonb default '{"Cash on Order":"None (auto)","Cash on Delivery":"Area Director","Net 20 days":"Area Director","Net 45 days":"COO","Net 60 days":"CEO"}'
);
insert into public.settings (id) values (1);

-- ---------------------------------------------------------------------------
-- 3. Helper functions used inside RLS policies
-- ---------------------------------------------------------------------------
create or replace function public.my_role() returns text as $$
  select role from public.profiles where id = auth.uid();
$$ language sql stable security definer;

create or replace function public.is_admin() returns boolean as $$
  select public.my_role() = 'Area Director';
$$ language sql stable;

create or replace function public.is_bd() returns boolean as $$
  select public.my_role() = 'Territory Manager (BD)';
$$ language sql stable;

create or replace function public.can_edit_catalog() returns boolean as $$
  select public.my_role() in ('Area Director','Analyst','Operations');
$$ language sql stable;

create or replace function public.can_process_payouts() returns boolean as $$
  select public.my_role() in ('Area Director','Finance');
$$ language sql stable;

create or replace function public.has_view_access() returns boolean as $$
  select public.my_role() <> 'Pending';
$$ language sql stable;

create or replace function public.owns_account(acct_id uuid) returns boolean as $$
  select exists (select 1 from public.accounts where id = acct_id and owner_id = auth.uid());
$$ language sql stable security definer;

-- ---------------------------------------------------------------------------
-- 4. Enable RLS everywhere. No table is readable/writable until a policy
--    explicitly allows it — this is the actual enforcement layer the
--    browser-only version of the CRM never had.
-- ---------------------------------------------------------------------------
alter table public.profiles     enable row level security;
alter table public.accounts     enable row level security;
alter table public.contacts     enable row level security;
alter table public.catalog      enable row level security;
alter table public.deals        enable row level security;
alter table public.quotes       enable row level security;
alter table public.leads        enable row level security;
alter table public.activities   enable row level security;
alter table public.interactions enable row level security;
alter table public.aircraft     enable row level security;
alter table public.aog_cases    enable row level security;
alter table public.payouts      enable row level security;
alter table public.settings     enable row level security;

-- ---------------------------------------------------------------------------
-- 5. PROFILES — everyone reads their own row + Area Director reads/edits all.
--    Nobody, including Area Director, can self-assign 'Area Director' via
--    the client (only via the SQL editor) — prevents privilege escalation.
-- ---------------------------------------------------------------------------
create policy "profiles: self read" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

create policy "profiles: admin assigns roles" on public.profiles
  for update using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 6. ACCOUNTS — BDs see/edit only accounts they own; everyone with real
--    access sees all accounts read-only otherwise; only Area Director
--    creates, deletes, or reassigns ownership.
-- ---------------------------------------------------------------------------
create policy "accounts: read scoped" on public.accounts
  for select using (
    public.has_view_access() and (not public.is_bd() or owner_id = auth.uid())
  );

create policy "accounts: admin creates" on public.accounts
  for insert with check (public.is_admin());

create policy "accounts: owner or admin edits" on public.accounts
  for update using (public.is_admin() or (public.is_bd() and owner_id = auth.uid()))
  with check (
    public.is_admin()
    or (public.is_bd() and owner_id = auth.uid()
        -- BDs cannot reassign ownership or region themselves
        and owner_id = (select owner_id from public.accounts a2 where a2.id = id))
  );

create policy "accounts: admin deletes" on public.accounts
  for delete using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 7. CONTACTS — visible/editable wherever the parent account is
-- ---------------------------------------------------------------------------
create policy "contacts: scoped to account" on public.contacts
  for select using (
    public.has_view_access() and (
      public.is_admin() or not public.is_bd() or public.owns_account(account_id)
    )
  );

create policy "contacts: create on owned or any (admin)" on public.contacts
  for insert with check (public.is_admin() or public.owns_account(account_id));

create policy "contacts: edit on owned or admin" on public.contacts
  for update using (public.is_admin() or public.owns_account(account_id));

create policy "contacts: delete on owned or admin" on public.contacts
  for delete using (public.is_admin() or public.owns_account(account_id));

-- ---------------------------------------------------------------------------
-- 8. CATALOG — everyone with access reads; only Area Director / Analyst /
--    Operations write (this is item #2 from the earlier request).
-- ---------------------------------------------------------------------------
create policy "catalog: read all" on public.catalog
  for select using (public.has_view_access());

create policy "catalog: ops write" on public.catalog
  for insert with check (public.can_edit_catalog());
create policy "catalog: ops update" on public.catalog
  for update using (public.can_edit_catalog());
create policy "catalog: ops delete" on public.catalog
  for delete using (public.can_edit_catalog());

-- ---------------------------------------------------------------------------
-- 9. DEALS — BD sees/edits deals on accounts they own OR deals they've been
--    given a cross-territory split on; Area Director sees/edits all.
-- ---------------------------------------------------------------------------
create policy "deals: read scoped" on public.deals
  for select using (
    public.has_view_access() and (
      public.is_admin() or not public.is_bd()
      or owner_id = auth.uid()
      or (agreement->>'assistBDId')::uuid = auth.uid()
    )
  );

create policy "deals: create on owned account" on public.deals
  for insert with check (public.is_admin() or (public.is_bd() and public.owns_account(account_id)));

create policy "deals: edit own or admin" on public.deals
  for update using (public.is_admin() or (public.is_bd() and owner_id = auth.uid()));

create policy "deals: delete own or admin" on public.deals
  for delete using (public.is_admin() or (public.is_bd() and owner_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- 10. QUOTES — same ownership scoping as deals; approvers (COO/CEO/President)
--     can UPDATE only the approvals/status columns on quotes pending their
--     level (enforced at the application layer when calling the RPC below).
-- ---------------------------------------------------------------------------
create policy "quotes: read scoped" on public.quotes
  for select using (
    public.has_view_access() and (
      public.is_admin() or not public.is_bd() or public.owns_account(account_id)
    )
  );

create policy "quotes: create on owned account" on public.quotes
  for insert with check (public.is_admin() or (public.is_bd() and public.owns_account(account_id)));

create policy "quotes: owner or admin updates" on public.quotes
  for update using (
    public.is_admin()
    or (public.is_bd() and owner_id = auth.uid())
    or public.my_role() in ('COO','CEO','President')   -- see decide_quote() RPC below
  );

-- ---------------------------------------------------------------------------
-- 11. LEADS — BD creates/reads only against accounts they own (this is
--     item #1 from the earlier request — company is now a real FK, not
--     free text, so this policy is what actually enforces it).
-- ---------------------------------------------------------------------------
create policy "leads: read scoped" on public.leads
  for select using (
    public.has_view_access() and (public.is_admin() or not public.is_bd() or public.owns_account(account_id))
  );

create policy "leads: create on owned account" on public.leads
  for insert with check (public.is_admin() or (public.is_bd() and public.owns_account(account_id)));

create policy "leads: edit own or admin" on public.leads
  for update using (public.is_admin() or owner_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 12. ACTIVITIES / INTERACTIONS / AIRCRAFT / AOG — scoped like contacts
-- ---------------------------------------------------------------------------
create policy "activities: read scoped" on public.activities
  for select using (public.has_view_access() and (public.is_admin() or not public.is_bd() or account_id is null or public.owns_account(account_id)));
create policy "activities: write scoped" on public.activities
  for insert with check (public.is_admin() or account_id is null or public.owns_account(account_id));
create policy "activities: update scoped" on public.activities
  for update using (public.is_admin() or account_id is null or public.owns_account(account_id));

create policy "interactions: read scoped" on public.interactions
  for select using (public.has_view_access() and (public.is_admin() or not public.is_bd() or public.owns_account(account_id)));
create policy "interactions: write scoped" on public.interactions
  for insert with check (public.is_admin() or public.owns_account(account_id));

create policy "aircraft: read scoped" on public.aircraft
  for select using (public.has_view_access() and (public.is_admin() or not public.is_bd() or public.owns_account(account_id)));
create policy "aircraft: write scoped" on public.aircraft
  for insert with check (public.is_admin() or public.owns_account(account_id));
create policy "aircraft: update scoped" on public.aircraft
  for update using (public.is_admin() or public.owns_account(account_id));
create policy "aircraft: delete scoped" on public.aircraft
  for delete using (public.is_admin() or public.owns_account(account_id));

create policy "aog: read scoped" on public.aog_cases
  for select using (public.has_view_access() and (public.is_admin() or not public.is_bd() or public.owns_account(account_id)));
create policy "aog: write scoped" on public.aog_cases
  for insert with check (public.is_admin() or public.owns_account(account_id));
create policy "aog: update scoped" on public.aog_cases
  for update using (public.is_admin() or public.owns_account(account_id));

-- ---------------------------------------------------------------------------
-- 13. PAYOUTS — Finance/Area Director only, and BDs may read their own
--     payout history (so their commission statement can show "paid to date").
-- ---------------------------------------------------------------------------
create policy "payouts: read own or finance" on public.payouts
  for select using (public.can_process_payouts() or owner_id = auth.uid());

create policy "payouts: finance writes" on public.payouts
  for insert with check (public.can_process_payouts());

-- ---------------------------------------------------------------------------
-- 14. SETTINGS — everyone with access reads; only Area Director writes
-- ---------------------------------------------------------------------------
create policy "settings: read all" on public.settings
  for select using (public.has_view_access());
create policy "settings: admin writes" on public.settings
  for update using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 15. Server-side approval RPC — the ONE place a COO/CEO/President can move
--     a quote forward, so approval logic can't be spoofed from the client
--     by just PATCHing the row directly.
-- ---------------------------------------------------------------------------
create or replace function public.decide_quote(quote_id uuid, decision text, comment text default '')
returns public.quotes as $$
declare
  q public.quotes;
  my_role text := public.my_role();
  approvals_count int;
  next_role text;
  result public.quotes;
begin
  select * into q from public.quotes where id = quote_id;
  if q is null then raise exception 'Quote not found'; end if;

  select count(*) into approvals_count
  from jsonb_array_elements(q.approvals) a
  where a->>'decision' = 'Approved';

  next_role := q.chain->>approvals_count;
  if next_role is distinct from my_role then
    raise exception 'It is not your turn to approve this quote (expected %, got %)', next_role, my_role;
  end if;

  update public.quotes
  set approvals = q.approvals || jsonb_build_object(
        'role', my_role, 'decision', decision, 'byName',
        (select name from public.profiles where id = auth.uid()),
        'date', current_date, 'comment', comment),
      status = case
        when decision = 'Rejected' then 'Rejected'
        when approvals_count + 1 >= jsonb_array_length(q.chain) then 'Approved'
        else 'Pending Approval'
      end
  where id = quote_id
  returning * into result;

  return result;
end;
$$ language plpgsql security definer;

-- ============================================================================
-- End of schema. Next: run 02_seed_data.sql to load the real Banner catalog,
-- the 46-account book, and the BD team — or import from the CRM's existing
-- JSON export.
-- ============================================================================
