import { ff } from "@/lib/flags/ff";
import ScoresV2Panel from "./ScoresV2Panel";
import { PageHeader, Card } from "@/COMPONENTS.reg";
import { flagActive } from "@/COMPONENTS.reg";

function LegacyScoresPanel() {
  return (
    <section aria-label="Scores V1">
      <PageHeader title="Scores" subtitle="Historique des sessions" />
      <Card>
        <p>Scores internes legacy.</p>
        {flagActive("scores-v2", { percent: 20, ff }) && (
          <p style={{ marginTop: 8 }}><a href="/modules/scores-v2">✨ Essayer la nouvelle page Scores (V2)</a></p>
        )}
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
