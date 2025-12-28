import React from "react";
import { Link } from 'react-router-dom';

type Cmd = { id: string; label: string; path: string };
const Ctx = React.createContext<{ open: () => void } | null>(null);

export function useCommandPalette() { return React.useContext(Ctx); }

export function CommandPalette({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = React.useState(false);
  const [q, setQ] = React.useState("");
  const cmds = React.useMemo<Cmd[]>(() => [], []);
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setVisible(true); }
      if (e.key === "Escape") setVisible(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const filtered = cmds.filter(c => c.label.toLowerCase().includes(q.toLowerCase()) || c.path.includes(q));
  return (
    <Ctx.Provider value={{ open: () => setVisible(true) }}>
      {children}
      {visible && (
        <div role="dialog" aria-label="Command Palette" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)" }}>
          <div style={{ maxWidth: 600, margin: "10vh auto", background: "var(--card)", padding: 12, borderRadius: 12 }}>
            <input autoFocus placeholder="Rechercher un module…" value={q} onChange={e => setQ(e.target.value)} style={{ width: "100%", padding: 8 }} />
            <ul>
              {filtered.map(c => (
                <li key={c.id} style={{ padding: 8 }}>
                  <Link to={c.path} onClick={() => setVisible(false)}>{c.label} — <small>{c.path}</small></Link>
                </li>
              ))}
            </ul>
            <button onClick={() => setVisible(false)}>Fermer</button>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}