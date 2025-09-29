'use client';

import { ZeroNumberBoundary } from '@/components/a11y/ZeroNumberBoundary';

const copy = {
  title: 'Respiration sans mouvement',
  intro: 'Un cocon immobile pour respirer en toute sécurité. Aucune caméra ne bouge, seul ton souffle guide le tempo.',
  instruction: 'Allonge chaque sortie d’air et laisse la lumière rester stable autour de toi.',
  ctaVr: 'Revenir vers la version immersive',
  back: 'Explorer d’autres modules apaisants',
};

export default function VrBreath2DPage() {
  return (
    <ZeroNumberBoundary className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-12">
      <section className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 text-slate-100 shadow-lg transition-all duration-150 ease-out">
        <h1 className="text-3xl font-semibold">{copy.title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-200/80">{copy.intro}</p>
        <div className="mt-6 rounded-2xl bg-slate-900/60 p-4 text-sm text-slate-100/80">
          {copy.instruction}
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <a
            className="rounded-full bg-slate-100 px-5 py-2 font-semibold text-slate-900 transition-colors duration-150 ease-out hover:bg-slate-200"
            href="/app/vr-breath"
          >
            {copy.ctaVr}
          </a>
          <a
            className="rounded-full border border-slate-100/30 px-5 py-2 font-semibold text-slate-100 transition-colors duration-150 ease-out hover:bg-slate-100/10"
            href="/app/music"
          >
            {copy.back}
          </a>
        </div>
      </section>
    </ZeroNumberBoundary>
  );
}
