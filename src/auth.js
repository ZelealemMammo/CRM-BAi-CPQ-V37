import { supabase } from "./supabaseClient";

/**
 * Auth flow for BAI Africa CRM.
 *
 * Domain restriction is enforced in TWO layers, deliberately redundant:
 *   1. Server-side (authoritative): the `handle_new_user` trigger in
 *      01_schema_and_rls.sql rejects any non-@banner.aero email at the
 *      database level — this is the layer that actually can't be bypassed.
 *   2. Client-side (UX only): signInWithGoogle() below passes a login hint
 *      and hd= (hosted domain) param so Google's account picker itself
 *      narrows to banner.aero accounts and gives a fast, friendly error
 *      if someone picks a personal Gmail. This layer is just politeness —
 *      never trust it alone.
 *
 * New sign-ins land with role='Pending' (see schema) and see a "waiting for
 * access" screen until the Area Director assigns them a real role from the
 * Users & Roles panel — that assignment is itself protected by the
 * "profiles: admin assigns roles" RLS policy.
 */

const BANNER_DOMAIN = "banner.aero";

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
      queryParams: {
        hd: BANNER_DOMAIN, // restricts Google's account chooser to this Workspace domain
        prompt: "select_account",
      },
    },
  });
  if (error) throw error;
}

export async function signOut() {
  await supabase.auth.signOut();
}

/** Returns the current session's Supabase auth user, or null if signed out. */
export async function getAuthUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}

/**
 * Fetches (or waits for) the caller's profile row. Because the trigger that
 * creates the profile runs server-side on first sign-in, there can be a
 * brief race on a brand-new account — this retries a few times before
 * giving up, rather than surfacing a false "no profile" error.
 */
export async function getMyProfile(retries = 3) {
  for (let i = 0; i < retries; i++) {
    const { data, error } = await supabase.from("profiles").select("*").single();
    if (data) return data;
    if (error && i === retries - 1) throw error;
    await new Promise((r) => setTimeout(r, 400));
  }
  return null;
}

/** Client-side pre-check, for a fast error message before even opening the
 *  Google popup — NOT a substitute for the server-side trigger. */
export function looksLikeBannerEmail(email) {
  return typeof email === "string" && email.toLowerCase().endsWith("@" + BANNER_DOMAIN);
}

/** Subscribes to sign-in/sign-out events; call the returned function to unsubscribe. */
export function onAuthChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  return () => data.subscription.unsubscribe();
}
