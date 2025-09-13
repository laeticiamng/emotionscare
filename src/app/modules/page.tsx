"use client";
import routes from "@/ROUTES.reg";
import { PageHeader, Card, Button, LoadingSpinner } from "@/COMPONENTS.reg";
import { ff } from "@/lib/flags/ff";

export default function ModulesIndexPage() {
  const mods = Object.values(routes)
    .filter(r => r.path?.startsWith?.("/modules/"))
    .filter(r => {
      const key = r.id as keyof ReturnType<typeof Object>;
      try { return ff && typeof ff === "function" ? ff(key as any) ?? true : true; } catch { return true; }
    });

  return (
    <main aria-label="Catalogue des modules">
      <PageHeader title="Modules" subtitle="Explore les expériences disponibles" />
      {!mods.length && <LoadingSpinner aria-label="Chargement" />}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
        {mods.map(m => (
          <Card key={m.id}>
            <h2>{m.component.replace(/Page$/, "")}</h2>
            <p>Accéder au module {m.id}</p>
            <Button href={m.path} data-ui="primary-cta">Ouvrir</Button>
          </Card>
        ))}
      </div>
    </main>
  );
}
