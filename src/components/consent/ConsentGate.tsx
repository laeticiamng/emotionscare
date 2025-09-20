'use client';

import { useState } from 'react';

import { useConsent } from '@/features/clinical-optin/ConsentProvider';

interface ConsentGateProps {
  children: React.ReactNode;
}

export function ConsentGate({ children }: ConsentGateProps) {
  const { clinicalAccepted, setClinicalAccepted } = useConsent();
  const [pending, setPending] = useState(false);

  if (clinicalAccepted) {
    return <>{children}</>;
  }

  const handleDecision = (accepted: boolean) => {
    setPending(true);
    setTimeout(() => {
      setClinicalAccepted(accepted);
      setPending(false);
    }, 10);
  };

  return (
    <section className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6 py-16 text-slate-900">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">Activation douce</p>
        <h1 className="text-3xl font-semibold">Partager ton ressenti ?</h1>
      </header>
      <p className="text-base leading-relaxed text-slate-700">
        Ces expériences s&apos;ajustent selon ton ressenti émotionnel. Tu peux accepter pour recevoir des
        retours personnalisés, ou continuer sans instrumentation clinique.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() => handleDecision(true)}
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-900/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          J&apos;accepte volontiers
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => handleDecision(false)}
          className="rounded-full border border-slate-400 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Peut-être plus tard
        </button>
      </div>
      <footer className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
        Ton choix est réversible dans les paramètres. Aucune valeur chiffrée ne sera affichée.
      </footer>
    </section>
  );
}

export default ConsentGate;
