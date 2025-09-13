"use client";
import { Button, Card } from "@/COMPONENTS.reg";
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <html><body>
      <main aria-label="Erreur">
        <Card>
          <h1>Oups…</h1>
          <p>Une erreur est survenue. {error?.digest && <em>({error.digest})</em>}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <Button onClick={() => reset()}>Réessayer</Button>
            <Button href="/">Retour à l’accueil</Button>
          </div>
        </Card>
      </main>
    </body></html>
  );
}
