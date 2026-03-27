// @ts-nocheck
/**
 * Registry Index — recompose ROUTES_REGISTRY from segment files
 * Split from the original 2751-line monolith for maintainability & build perf
 */
import type { RouteMeta } from '../schema';
import { PUBLIC_ROUTES } from './publicRegistry';
import { CONSUMER_ROUTES } from './consumerRegistry';
import { B2B_ROUTES } from './b2bRegistry';

export const ROUTES_REGISTRY: readonly RouteMeta[] = [
  ...PUBLIC_ROUTES,
  ...CONSUMER_ROUTES,
  ...B2B_ROUTES,
] as const;
