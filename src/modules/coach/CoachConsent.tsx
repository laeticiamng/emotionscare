// @ts-nocheck
import { useId, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

interface CoachConsentProps {
  onAccept: () => void;
}

export function CoachConsent({ onAccept }: CoachConsentProps) {
  const checkboxId = useId();
  const titleId = useId();
  const descriptionId = useId();
  const [checked, setChecked] = useState(false);

  const focusTrapProps = useMemo(() => ({ tabIndex: -1 }), []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div
        {...focusTrapProps}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl outline-none dark:bg-slate-900"
      >
        <h2 id={titleId} className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Bienvenue dans le Coach IA
        </h2>
        <p id={descriptionId} className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Le Coach ne remplace pas un professionnel de santé. Il offre des pistes courtes et bienveillantes pour t’aider à
          traverser un moment. En cas d’urgence, contacte immédiatement le 112 ou une personne de confiance.
        </p>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          En continuant, tu confirmes avoir lu notre <Link to="/privacy" className="underline">charte Confidentialité &amp; Aide</Link> et tu acceptes que tes échanges soient anonymisés pour l’amélioration du service.
        </p>
        <label className="mt-6 flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
          <input
            id={checkboxId}
            type="checkbox"
            className="h-4 w-4"
            checked={checked}
            onChange={event => setChecked(event.target.checked)}
          />
          <span>Je comprends et j’accepte ces conditions.</span>
        </label>
        <button
          type="button"
          className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900"
          onClick={onAccept}
          disabled={!checked}
        >
          Commencer la conversation
        </button>
      </div>
    </div>
  );
}
