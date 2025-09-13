"use client";
import { useState } from "react";
import { ff } from "@/lib/flags/ff";
import { hasConsent } from "@/COMPONENTS.reg";

export default function AccountDataPage() {
  const [msg, setMsg] = useState<string>("");
  const exportEnabled = ff("data-export");
  const deleteEnabled = ff("data-delete");

  async function reqExport() {
    if (!exportEnabled) return setMsg("Export indisponible.");
    const res = await fetch("/api/data/export", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ scope: "all" }) });
    const json = await res.json();
    setMsg(`Export OK (${json.exportedAt})`);
  }

  async function reqDelete() {
    if (!deleteEnabled) return setMsg("Suppression indisponible.");
    if (!confirm("Confirmer la demande de suppression de tes données ?")) return;
    const res = await fetch("/api/data/delete", { method: "POST" });
    const json = await res.json();
    setMsg(json.message);
  }

  return (
    <main>
      <h1>Mes données</h1>
      <p>Analytics autorisés : {String(hasConsent("analytics"))}</p>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={reqExport} aria-disabled={!exportEnabled}>Exporter mes données</button>
        <button onClick={reqDelete} aria-disabled={!deleteEnabled}>Demander la suppression</button>
      </div>
      {msg && <p>{msg}</p>}
    </main>
  );
}
