import { ff } from "@/lib/flags/ff";
import ScoresV2Panel from "./ScoresV2Panel";
import { PageHeader, Card } from "@/COMPONENTS.reg";

function LegacyScoresPanel() {
  return (
    <section aria-label="Scores V1">
      <PageHeader title="Scores" subtitle="Historique des sessions" />
      <Card>
        <p>Scores internes legacy.</p>
      </Card>
    </section>
  );
}

export default function ScoresPage() {
  const useV2 = ff?.("scores-v2") ?? false;

  return (
    <main>
      {useV2 ? (
        <ScoresV2Panel />
      ) : (
        <LegacyScoresPanel />
      )}
    </main>
  );
}
