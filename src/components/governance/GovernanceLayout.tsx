import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Shield, Network, Database, Activity, Boxes, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface GovernanceLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

interface NavItem {
  to: string;
  label: string;
  icon: typeof Shield;
  end?: boolean;
}

const NAV: NavItem[] = [
  { to: '/admin/governance', label: "Vue d'ensemble", icon: Shield, end: true },
  { to: '/admin/governance/routing', label: 'Routing & Registre', icon: Network },
  { to: '/admin/governance/data', label: 'Données & RLS', icon: Database },
  { to: '/admin/governance/observability', label: 'Observabilité & SLO', icon: Activity },
  { to: '/admin/governance/modules', label: 'Modules & Flags', icon: Boxes },
];

export function GovernanceLayout({ children, title, description }: GovernanceLayoutProps) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{title} — Gouvernance EmotionsCare</title>
        {description && <meta name="description" content={description} />}
      </Helmet>
      <div className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/app/home" aria-label="Retour à l'accueil">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-semibold leading-tight">Gouvernance Plateforme</h1>
              <p className="text-xs text-muted-foreground">Cadre & contrôle de la plateforme EmotionsCare</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto grid grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
        <aside aria-label="Navigation gouvernance">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = item.end ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                    active
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main>
          <header className="mb-6">
            <h2 className="text-2xl font-bold">{title}</h2>
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}

export default GovernanceLayout;
