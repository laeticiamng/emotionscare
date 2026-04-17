import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Boxes, Power } from 'lucide-react';
import { B2BGovernanceLayout } from '@/components/governance/B2BGovernanceLayout';
import { governanceService, type ModuleStatus } from '@/lib/governance';

const statusVariant: Record<ModuleStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  alpha: 'outline',
  beta: 'secondary',
  stable: 'default',
  deprecated: 'destructive',
  sunset: 'destructive',
};

export default function B2BGovernanceModulesPage() {
  const modulesQuery = useQuery({
    queryKey: ['b2b-governance', 'modules'],
    queryFn: () => governanceService.listModules(),
  });

  const modules = modulesQuery.data ?? [];

  return (
    <B2BGovernanceLayout
      title="Modules"
      description="État des modules disponibles pour vos collaborateurs (lecture seule)."
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Boxes className="h-4 w-4" />
            Catalogue ({modules.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {modulesQuery.isLoading && <p className="text-sm text-muted-foreground">Chargement…</p>}
          {!modulesQuery.isLoading && modules.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Aucun module enregistré.
            </p>
          )}
          <ul className="divide-y">
            {modules.map((m) => (
              <li key={m.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono">{m.module_key}</code>
                    <Badge variant={statusVariant[m.status]}>{m.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {m.display_name} · Rollout {m.rollout_percentage}%
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Power
                    className={`h-4 w-4 ${m.kill_switch_enabled ? 'text-destructive' : 'text-emerald-600'}`}
                    aria-label={m.kill_switch_enabled ? 'Indisponible' : 'Disponible'}
                  />
                  <span className="text-xs">
                    {m.kill_switch_enabled ? 'Indisponible' : 'Disponible'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </B2BGovernanceLayout>
  );
}
