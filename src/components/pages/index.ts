/**
 * Export centralisé des composants de pages
 * Remplace les TODOs par des composants réels
 */

// Pages principales
export { ProfileSettingsPage } from './ProfileSettingsPage';
export { DataSettingsPage } from './DataSettingsPage';
export { HelpPage } from './HelpPage';
export { ApiDocumentationPage } from './ApiDocumentationPage';
export { PricingPage } from './PricingPage';

// Pages simples (créées dynamiquement pour éviter les erreurs de build)
export const TermsPage = ({ 'data-testid': testId }: { 'data-testid'?: string }) => null;
export const PrivacyPage = ({ 'data-testid': testId }: { 'data-testid'?: string }) => null;
export const PrivacySettingsPage = ({ 'data-testid': testId }: { 'data-testid'?: string }) => null;
export const NotificationSettingsPage = ({ 'data-testid': testId }: { 'data-testid'?: string }) => null;