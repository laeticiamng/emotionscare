import { CoachView } from '@/modules/coach/CoachView';
import { useFlags } from '@/core/flags';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function CoachUnavailableNotice() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-12 dark:bg-slate-950">
      <Card className="max-w-lg border border-slate-200 bg-white/80 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Coach IA en préparation
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          L’espace de coaching sécurisé sera activé après validation complète. Tu peux explorer les autres pratiques en
          attendant.
        </CardContent>
      </Card>
    </main>
  );
}

export default function CoachPage() {
  const { flags } = useFlags();

  if (!flags.FF_COACH) {
    return <CoachUnavailableNotice />;
  }

  return (
    <main className="flex flex-1 flex-col bg-slate-50 dark:bg-slate-950">
      <CoachView />
    </main>
  );
}
