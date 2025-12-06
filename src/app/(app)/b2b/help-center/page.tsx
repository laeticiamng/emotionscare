import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Centre d’aide B2B — EmotionsCare',
  robots: {
    index: false,
    follow: false,
  },
};

const FAQ_ITEMS = [
  {
    question: 'Comment sont gérées les invitations ?',
    answer:
      'Chaque invitation est hachée (SHA-256) avant stockage. Les jetons ne sont jamais persistés en clair et expirent automatiquement.',
  },
  {
    question: 'Puis-je exporter les journaux ?',
    answer:
      'Oui. L’export CSV ne contient que les colonnes autorisées (horodatage, événement, cible, résumé textuel) et est signé via Storage privé.',
  },
  {
    question: 'Comment signaler un incident ?',
    answer:
      'Utilisez le formulaire ci-dessous. Les incidents critiques déclenchent un suivi prioritaire et un audit textuel associé.',
  },
];

export default function HelpCenterPage() {
  return (
    <section className="flex flex-col gap-8 p-6">
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Centre d’aide B2B</h2>
        <p className="text-sm text-slate-600">
          Retrouvez les informations clés et contactez le support sécurisé dédié aux organisations.
        </p>
      </div>

      <div className="space-y-4">
        {FAQ_ITEMS.map((item) => (
          <article key={item.question} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{item.question}</h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">{item.answer}</p>
          </article>
        ))}
      </div>

      <form
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        action="https://formspree.io/f/xwkgrbay"
        method="POST"
      >
        <fieldset className="space-y-3">
          <legend className="text-lg font-semibold text-slate-900">Contacter le support dédié</legend>
          <label className="block text-sm font-medium text-slate-700" htmlFor="topic">
            Sujet
            <input
              id="topic"
              name="topic"
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              placeholder="Rotation de clés, audit, optimisation…"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700" htmlFor="message">
            Message
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              placeholder="Décrivez la demande sans inclure d’informations personnelles."
            />
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Envoyer le message
          </button>
        </fieldset>
        <p className="mt-3 text-xs text-slate-500">
          Le support répond sous 24 heures ouvrées. Les informations transmises sont utilisées uniquement pour le suivi incident.
        </p>
      </form>
    </section>
  );
}
