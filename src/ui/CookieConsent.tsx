"use client";
import React from "react";
const KEY = "cookie_consent_v1";

export function hasConsent(kind: "analytics" | "functional" | "marketing" = "functional") {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return !!parsed[kind];
  } catch { return false; }
}

export function CookieConsent() {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => { if (!localStorage.getItem(KEY)) setVisible(true); }, []);
  if (!visible) return null;
  const acceptAll = () => { localStorage.setItem(KEY, JSON.stringify({ functional: true, analytics: true, marketing: false })); setVisible(false); };
  const essentialsOnly = () => { localStorage.setItem(KEY, JSON.stringify({ functional: true, analytics: false, marketing: false })); setVisible(false); };
  return (
    <div role="dialog" aria-label="Consentement cookies" style={{ position: "fixed", insetInline: 16, bottom: 16, background: "var(--card)", padding: 12, borderRadius: 12 }}>
      <p>On utilise des cookies pour améliorer ton expérience. Tu peux accepter tout ou seulement l’essentiel.</p>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={essentialsOnly}>Essentiels uniquement</button>
        <button onClick={acceptAll}>Tout accepter</button>
        <a href="/legal/privacy">En savoir plus</a>
      </div>
    </div>
  );
}
