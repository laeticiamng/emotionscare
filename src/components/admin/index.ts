/**
 * Barrel export pour les composants admin
 * Optimise les imports répétés à travers l'application
 */

// Composants d'audit et statistiques
export { AuditStatsDashboard } from './AuditStatsDashboard';
export { AdvancedAuditFilters } from './AdvancedAuditFilters';
export { MonthComparisonChart } from './MonthComparisonChart';
export { AuditReportExporter } from './AuditReportExporter';
export { RoleAuditLogsViewer } from './RoleAuditLogsViewer';

// Composants de sécurité et alertes
export { SecurityAlertsPanel } from './SecurityAlertsPanel';
export { SecurityTrendsDashboard } from './SecurityTrendsDashboard';
export { AlertSettingsManager } from './AlertSettingsManager';

// Composants de rapports
export { ReportManualTrigger } from './ReportManualTrigger';
export { ExcelExporter } from './ExcelExporter';

// Composants de gestion utilisateurs et rôles
export { AdvancedUserManagement } from './AdvancedUserManagement';
export { UserRolesManager } from './UserRolesManager';

// Autres composants admin
export { default as ApiUsageMonitor } from './ApiUsageMonitor';
export { GlobalConfigurationCenter } from './GlobalConfigurationCenter';
export { default as ProductionReadiness } from './ProductionReadiness';
export { default as PredictiveAnalyticsDashboard } from './PredictiveAnalyticsDashboard';
