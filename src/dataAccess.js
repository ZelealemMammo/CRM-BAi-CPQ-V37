import { supabase } from "./supabaseClient";

/**
 * INTEGRATION PATTERN — read this before wiring the rest of App.jsx.
 *
 * Today, the whole app reads/writes ONE JSON blob via window.storage.get/set.
 * That pattern is gone once you're on Supabase: each table is its own
 * resource, RLS decides what you can see, and updates are row-level, not
 * whole-document. This file shows the shape for every table the app uses.
 * It deliberately mirrors the field names already used in the CRM's JS
 * objects (camelCase) and converts to/from Postgres's snake_case at the edge,
 * so the rest of your component code barely has to change.
 *
 * This is a STARTER — it covers accounts, deals, and quotes end-to-end as a
 * worked example. Contacts / leads / catalog / activities / aircraft /
 * aog_cases / payouts follow the exact same shape; ask to have them
 * generated the same way once this pattern is confirmed to fit.
 */

const toCamel = (row) => {
  if (!row) return row;
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    out[k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())] = v;
  }
  return out;
};
const toSnake = (obj) => {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase())] = v;
  }
  return out;
};

// ---------------------------------------------------------------------------
// Accounts
// ---------------------------------------------------------------------------
export async function fetchAccounts() {
  const { data, error } = await supabase.from("accounts").select("*").order("name");
  if (error) throw error;
  return data.map(toCamel); // RLS already returned only what this user may see
}

export async function createAccount(account) {
  // No client-side isAdmin check needed — RLS rejects the insert outright
  // for non-Area-Director users. This call either succeeds or throws.
  const { data, error } = await supabase.from("accounts").insert(toSnake(account)).select().single();
  if (error) throw error;
  return toCamel(data);
}

export async function updateAccount(id, patch) {
  const { data, error } = await supabase.from("accounts").update(toSnake(patch)).eq("id", id).select().single();
  if (error) throw error;
  return toCamel(data);
}

export async function deleteAccount(id) {
  const { error } = await supabase.from("accounts").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Deals
// ---------------------------------------------------------------------------
export async function fetchDeals() {
  const { data, error } = await supabase.from("deals").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(toCamel);
}

export async function upsertDeal(deal) {
  const row = toSnake({ ...deal, lastTouch: new Date().toISOString().slice(0, 10) });
  const { data, error } = await supabase.from("deals").upsert(row).select().single();
  if (error) throw error;
  return toCamel(data);
}

export async function setDealStage(id, stage, extra = {}) {
  const { data, error } = await supabase
    .from("deals")
    .update(toSnake({ stage, lastTouch: new Date().toISOString().slice(0, 10), ...extra }))
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return toCamel(data);
}

// ---------------------------------------------------------------------------
// Quotes — approval decisions go through the server-side RPC, NOT a direct
// table update, so the sequencing/permission check happens in the database
// (see decide_quote() in 01_schema_and_rls.sql) and can't be spoofed.
// ---------------------------------------------------------------------------
export async function fetchQuotes() {
  const { data, error } = await supabase.from("quotes").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(toCamel);
}

export async function upsertQuote(quote) {
  const { data, error } = await supabase.from("quotes").upsert(toSnake(quote)).select().single();
  if (error) throw error;
  return toCamel(data);
}

export async function decideQuote(quoteId, decision, comment = "") {
  const { data, error } = await supabase.rpc("decide_quote", {
    quote_id: quoteId,
    decision,
    comment,
  });
  if (error) throw error; // e.g. "It is not your turn to approve this quote"
  return toCamel(data);
}

// ---------------------------------------------------------------------------
// Realtime — optional, but this is what makes the CRM feel "live": when the
// Area Director approves a quote, the BD's screen updates without a refresh.
// ---------------------------------------------------------------------------
export function subscribeToQuotes(onChange) {
  const channel = supabase
    .channel("quotes-changes")
    .on("postgres_changes", { event: "*", schema: "public", table: "quotes" }, (payload) => onChange(payload))
    .subscribe();
  return () => supabase.removeChannel(channel);
}
