import Link from 'next/link';

const CARDS = [
  {
    href: '/b2b/reports',
    title: 'Rapports mensuels',
    description: 'Consulter un récit de trois phrases et une action douce, prêt à imprimer.',
    href: '/b2b/rh',
    title: 'Heatmap RH textuelle',
    description: 'Visualiser le climat d’équipe sans chiffres, avec redirection vers les rapports détaillés.',
  },
  {
    href: '/b2b/teams',
    title: 'Gestion des équipes',
    description: 'Inviter, rôler et suivre vos membres sans exposer leurs données sensibles.',
  },
  {
    href: '/b2b/events',
    title: 'Événements d’équipe',
    description: 'Planifier des temps collectifs, orchestrer les rappels opt-in et suivre les réponses.',
  },
  {
    href: '/b2b/optimisation',
    title: 'Optimisations suggérées',
    description: 'Recevoir des pistes textuelles issues des agrégats anonymisés pour ajuster vos actions.',
  },
  {
    href: '/b2b/security',
    title: 'Sécurité & sessions',
    description: 'Superviser les rôles, déclencher une rotation de clés et consulter les sessions actives.',
  },
  {
    href: '/b2b/audit',
    title: 'Journal d’audit',
    description: 'Filtrer les événements et générer un export CSV signé sans PII.',
  },
  {
    href: '/b2b/help-center',
    title: 'Centre d’aide',
    description: 'Consulter la FAQ B2B, contacter le support et partager un retour sécurisé.',
  },
];

export default function B2BHubPage() {
  return (
    <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
      {CARDS.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          role="listitem"
          className="group flex h-full flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900 group-hover:text-slate-950">{card.title}</h2>
            <p className="text-sm text-slate-600">{card.description}</p>
          </div>
          <span className="mt-4 text-sm font-medium text-slate-700 group-hover:text-slate-900">Explorer →</span>
        </Link>
      ))}
    </div>
  );
}
