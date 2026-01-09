/**
 * TIMECRAFT Hooks - Module de design du temps
 */

export { useTimeBlocks } from './useTimeBlocks';
export type { TimeBlock, CreateTimeBlockInput, TimeBlockStats, TimeBlockType } from './useTimeBlocks';

export { useTimeVersions } from './useTimeVersions';
export type { TimeVersion, CreateVersionInput } from './useTimeVersions';

export { useTimeInsights } from './useTimeInsights';
export type { TimeInsight } from './useTimeInsights';

export { useTimeEmotionCorrelation } from './useTimeEmotionCorrelation';

export { useOrgTimeAggregates } from './useOrgTimeAggregates';
export type { OrgTimeAggregate, OrgTimeScenario, DepartmentStats } from './useOrgTimeAggregates';
