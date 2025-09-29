import NyveeFlowController from '@/features/nyvee/NyveeFlowController';
import { Stai6OrchestrationProvider } from '@/features/orchestration/useStai6Orchestration';

const NyveePage = () => {
  return (
    <Stai6OrchestrationProvider>
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 py-12">
        <header className="space-y-2 text-indigo-100">
          <h1 className="text-3xl font-semibold tracking-tight text-indigo-50">Nyvée</h1>
          <p className="text-sm text-indigo-200/90">
            Ce cocon se referme en douceur. Partage ton ressenti, puis laisse Nyvée te proposer la prochaine étape.
          </p>
        </header>
        <NyveeFlowController profile="silent_anchor" />
      </main>
    </Stai6OrchestrationProvider>
  );
};

export default NyveePage;
