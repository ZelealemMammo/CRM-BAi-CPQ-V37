import React, { useEffect, useState } from "react";
import { Plane } from "lucide-react";
import { signInWithGoogle, signOut, getAuthUser, getMyProfile, onAuthChange } from "./auth";

/**
 * Drop-in replacement for the old "Select your profile" tap-any-name screen.
 * Real identity now comes from Google; role comes from the `profiles` table,
 * which only the Area Director can write to (enforced by RLS, not by this
 * component — this component just reflects what the server allows).
 *
 * Usage in App.jsx:
 *   const { user, profile, loading } = useAuth();
 *   if (loading) return <Loading />;
 *   if (!user) return <SignInScreen />;
 *   if (!profile || profile.role === "Pending") return <PendingAccess profile={profile} onSignOut={signOut} />;
 *   // ...render the CRM with `profile` standing in for the old `me` object
 */

export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub;
    (async () => {
      const u = await getAuthUser();
      setUser(u);
      if (u) setProfile(await getMyProfile());
      setLoading(false);
      unsub = onAuthChange(async (nextUser) => {
        setUser(nextUser);
        setProfile(nextUser ? await getMyProfile() : null);
      });
    })();
    return () => unsub && unsub();
  }, []);

  return { user, profile, loading };
}

const C = { blueDeep: "#0C3557", teal: "#0E6E6E", red: "#A63A3A", faint: "rgba(255,255,255,0.6)" };

export function SignInScreen() {
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const go = async () => {
    setErr("");
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      setErr(e.message || "Sign-in failed.");
      setBusy(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: C.blueDeep, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420, textAlign: "center", color: "#fff" }}>
        <Plane size={30} style={{ transform: "rotate(-45deg)" }} />
        <div style={{ fontSize: 20, fontWeight: 700, marginTop: 8 }}>BAI Africa CRM</div>
        <div style={{ fontSize: 12, opacity: 0.75, letterSpacing: "0.05em", marginTop: 4, marginBottom: 28 }}>
          Sign in with your Banner Aircraft International account
        </div>

        <button
          onClick={go}
          disabled={busy}
          style={{
            display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", color: "#1f1f1f",
            border: "none", borderRadius: 6, padding: "11px 22px", fontSize: 14, fontWeight: 600,
            cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1, fontFamily: "inherit",
          }}
        >
          <GoogleG /> {busy ? "Opening Google…" : "Sign in with Google"}
        </button>

        {err && <div style={{ color: "#FFB4B4", fontSize: 12, marginTop: 14 }}>{err}</div>}

        <div style={{ fontSize: 11, color: C.faint, marginTop: 28, lineHeight: 1.6 }}>
          Access is restricted to @banner.aero accounts and is enforced by the
          database, not by this screen. New sign-ins are placed in a pending
          state until the Area Director assigns a role.
        </div>
      </div>
    </div>
  );
}

export function PendingAccess({ profile, onSignOut }) {
  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: C.blueDeep, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420, textAlign: "center", color: "#fff" }}>
        <Plane size={30} style={{ transform: "rotate(-45deg)" }} />
        <div style={{ fontSize: 18, fontWeight: 700, marginTop: 8 }}>Access pending</div>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 10, lineHeight: 1.6 }}>
          Signed in as <strong>{profile?.email}</strong>. Your account has been created but
          not yet assigned a role. Ask the Area Director to set it in Users &amp; Roles —
          you'll get access automatically as soon as they do, no re-login needed.
        </div>
        <button
          onClick={onSignOut}
          style={{ marginTop: 20, background: "none", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: 6, padding: "8px 16px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.6 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.6 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z" />
      <path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.4l-6.3-5.3C29.4 35 26.8 36 24 36c-5.3 0-9.9-3.4-11.6-8.1l-6.6 5.1C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.4 5.4-6.3 6.8l6.3 5.3C39.6 36.6 44 30.9 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}
