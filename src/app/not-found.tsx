import { Button, Card } from "@/COMPONENTS.reg";
export default function NotFound() {
  return (
    <main aria-label="Page introuvable">
      <Card>
        <h1>Page introuvable</h1>
        <p>La page demandée n’existe pas.</p>
        <Button href="/">Revenir à l’accueil</Button>
      </Card>
    </main>
  );
}
