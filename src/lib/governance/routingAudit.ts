/**
 * Routing Governance — Audit statique du registre routerV2.
 * @module lib/governance/routingAudit
 */
import { ROUTES_REGISTRY } from '@/routerV2/registry';
import type { RouteMeta } from '@/routerV2/schema';
import type { AuditFinding, Severity } from './types';

export interface RoutingAuditReport {
  totalRoutes: number;
  visibleRoutes: number;
  hiddenRoutes: number;
  deprecatedRoutes: number;
  segmentDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
  duplicates: Array<{ path: string; count: number; names: string[] }>;
  orphanAliases: Array<{ alias: string; route: string }>;
  missingRedirects: Array<{ path: string; name: string }>;
  segmentMismatches: Array<{ path: string; segment: string; expected: string }>;
  unguardedSensitive: Array<{ path: string; name: string; segment: string }>;
  findings: AuditFinding[];
  score: number;
  computedAt: string;
}

/** Score = 100 - somme pondérée des findings (capé à 0). */
const severityWeight: Record<Severity, number> = {
  info: 0,
  low: 1,
  medium: 4,
  high: 10,
  critical: 25,
};

const expectedSegmentByPathPrefix: Array<{ prefix: string; segment: string }> = [
  { prefix: '/app', segment: 'consumer' },
  { prefix: '/b2c', segment: 'consumer' },
  { prefix: '/b2b/user', segment: 'employee' },
  { prefix: '/b2b/admin', segment: 'manager' },
  { prefix: '/b2b', segment: 'b2c' },
  { prefix: '/admin', segment: 'manager' },
];

const inferExpectedSegment = (path: string): string | null => {
  for (const { prefix, segment } of expectedSegmentByPathPrefix) {
    if (path === prefix || path.startsWith(`${prefix}/`)) return segment;
  }
  return null;
};

const isPublicPath = (path: string): boolean =>
  path === '/' || ['/', '/about', '/contact', '/pricing', '/login', '/signup', '/help'].includes(path);

export function runRoutingAudit(routes: readonly RouteMeta[] = ROUTES_REGISTRY): RoutingAuditReport {
  const findings: AuditFinding[] = [];
  const segmentDistribution: Record<string, number> = {};
  const statusDistribution: Record<string, number> = {};
  const pathBuckets = new Map<string, RouteMeta[]>();

  let visibleRoutes = 0;
  let hiddenRoutes = 0;
  let deprecatedRoutes = 0;

  for (const route of routes) {
    segmentDistribution[route.segment] = (segmentDistribution[route.segment] ?? 0) + 1;
    const status = route.status ?? 'stable';
    statusDistribution[status] = (statusDistribution[status] ?? 0) + 1;

    if (route.hidden) hiddenRoutes++;
    else visibleRoutes++;
    if (route.deprecated) deprecatedRoutes++;

    const bucket = pathBuckets.get(route.path) ?? [];
    bucket.push(route);
    pathBuckets.set(route.path, bucket);
  }

  // Doublons
  const duplicates: RoutingAuditReport['duplicates'] = [];
  for (const [path, list] of pathBuckets.entries()) {
    if (list.length > 1) {
      duplicates.push({ path, count: list.length, names: list.map((r) => r.name) });
      findings.push({
        id: `dup_${path}`,
        title: `Doublon de route: ${path}`,
        severity: 'high',
        category: 'duplicates',
        description: `${list.length} routes partagent le path ${path} (${list.map((r) => r.name).join(', ')}).`,
        remediation: 'Supprimer ou renommer un des doublons; utiliser un alias plutôt qu’une route distincte.',
        affected: list.map((r) => r.name),
      });
    }
  }

  // Deprecated sans redirectTo
  const missingRedirects: RoutingAuditReport['missingRedirects'] = [];
  for (const route of routes) {
    if (route.deprecated && !route.redirectTo) {
      missingRedirects.push({ path: route.path, name: route.name });
      findings.push({
        id: `deprecated_no_redirect_${route.name}`,
        title: `Route dépréciée sans redirection: ${route.path}`,
        severity: 'medium',
        category: 'deprecated',
        description: `La route "${route.name}" est marquée deprecated mais n'a pas de redirectTo, risque de 404.`,
        remediation: 'Ajouter un redirectTo vers la cible canonique ou marquer hidden:true.',
      });
    }
  }

  // Aliases pointant vers nulle part (heuristique : alias qui ressemblent à des paths)
  const knownPaths = new Set(routes.map((r) => r.path));
  const orphanAliases: RoutingAuditReport['orphanAliases'] = [];
  for (const route of routes) {
    if (!route.aliases) continue;
    for (const alias of route.aliases) {
      if (alias.startsWith('/') && knownPaths.has(alias)) {
        orphanAliases.push({ alias, route: route.name });
        findings.push({
          id: `alias_collision_${route.name}_${alias}`,
          title: `Alias entre en collision avec une route existante`,
          severity: 'medium',
          category: 'aliases',
          description: `L'alias "${alias}" de la route "${route.name}" est aussi le path d'une autre route.`,
          remediation: 'Renommer l’alias ou consolider les deux routes.',
        });
      }
    }
  }

  // Segments incohérents avec le path
  const segmentMismatches: RoutingAuditReport['segmentMismatches'] = [];
  for (const route of routes) {
    const expected = inferExpectedSegment(route.path);
    if (expected && expected !== route.segment && route.segment !== 'public') {
      segmentMismatches.push({ path: route.path, segment: route.segment, expected });
      findings.push({
        id: `segment_mismatch_${route.name}`,
        title: `Segment incohérent: ${route.path}`,
        severity: 'low',
        category: 'segments',
        description: `Path "${route.path}" suggère segment "${expected}", déclaré "${route.segment}".`,
        remediation: 'Aligner le segment avec la convention de path ou documenter l’exception.',
      });
    }
  }

  // Routes sensibles non gardées
  const unguardedSensitive: RoutingAuditReport['unguardedSensitive'] = [];
  for (const route of routes) {
    const isSensitive =
      route.path.startsWith('/admin') ||
      route.path.startsWith('/app') ||
      route.path.startsWith('/b2b/admin');
    const hasGuard = Boolean(route.guard) || Boolean(route.requireAuth) || Boolean(route.role) || (route.allowedRoles && route.allowedRoles.length > 0);
    if (isSensitive && !hasGuard && !route.deprecated && !isPublicPath(route.path)) {
      unguardedSensitive.push({ path: route.path, name: route.name, segment: route.segment });
      findings.push({
        id: `unguarded_${route.name}`,
        title: `Route sensible sans garde explicite: ${route.path}`,
        severity: 'high',
        category: 'security',
        description: `La route "${route.name}" est sensible mais n'a ni guard, requireAuth, role ou allowedRoles.`,
        remediation: 'Ajouter requireAuth:true et/ou allowedRoles approprié.',
      });
    }
  }

  // Score global
  const penalty = findings.reduce((acc, f) => acc + (severityWeight[f.severity] ?? 0), 0);
  const score = Math.max(0, Math.min(100, 100 - penalty));

  return {
    totalRoutes: routes.length,
    visibleRoutes,
    hiddenRoutes,
    deprecatedRoutes,
    segmentDistribution,
    statusDistribution,
    duplicates,
    orphanAliases,
    missingRedirects,
    segmentMismatches,
    unguardedSensitive,
    findings,
    score,
    computedAt: new Date().toISOString(),
  };
}
