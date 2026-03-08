/**
 * Routes publiques - pages accessibles sans authentification
 * Segment: public, marketing, legal, store
 */
import { lazy } from 'react';

// Pages publiques
const HomePage = lazy(() => import('@/components/home/HomePage'));
const UnifiedLoginPage = lazy(() => import('@/pages/UnifiedLoginPage'));
const HomeB2CPage = lazy(() => import('@/pages/HomeB2CPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const HelpPage = lazy(() => import('@/pages/HelpPage'));
const DemoPage = lazy(() => import('@/pages/DemoPage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));
const FeaturesPage = lazy(() => import('@/pages/features/FeaturesPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const ExamModePage = lazy(() => import('@/pages/ExamModePage'));
const PricingPageWorking = lazy(() => import('@/pages/PricingPageWorking'));
const FAQPage = lazy(() => import('@/pages/FAQPage'));
const SupportPage = lazy(() => import('@/pages/SupportPage'));
const SupportChatbotPage = lazy(() => import('@/pages/SupportChatbotPage'));
const PublicAPIPage = lazy(() => import('@/pages/PublicAPIPage'));
const InstallPage = lazy(() => import('@/pages/InstallPage'));
const HowItAdaptsPage = lazy(() => import('@/pages/HowItAdaptsPage'));
const UseCasesPage = lazy(() => import('@/pages/UseCasesPage'));
const SecurityPage = lazy(() => import('@/pages/SecurityPage'));

// Pages légales
const MentionsLegalesPage = lazy(() => import('@/pages/legal/MentionsLegalesPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/legal/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('@/pages/legal/TermsPage'));
const SalesTermsPage = lazy(() => import('@/pages/legal/SalesTermsPage'));
const LicensesPage = lazy(() => import('@/pages/legal/LicensesPage'));
const CookiesPage = lazy(() => import('@/pages/legal/CookiesPage'));

// Store Shopify
const StorePage = lazy(() => import('@/pages/StorePage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));

// Pages système
const UnauthorizedPage = lazy(() => import('@/pages/errors/401/page'));
const ForbiddenPage = lazy(() => import('@/pages/errors/403/page'));
const UnifiedErrorPage = lazy(() => import('@/pages/errors/404/page'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));
const ServerErrorPage = lazy(() => import('@/pages/errors/500/page'));

// Composants de redirection
const RedirectToScan = lazy(() => import('@/pages/RedirectToScan'));
const RedirectToJournal = lazy(() => import('@/pages/RedirectToJournal'));
const RedirectToSocialCocon = lazy(() => import('@/components/redirects/RedirectToSocialCocon'));
const RedirectToEntreprise = lazy(() => import('@/pages/RedirectToEntreprise'));
const RedirectToMusic = lazy(() => import('@/components/redirects/RedirectToMusic'));

export const publicComponentMap = {
  // Public
  HomePage,
  HomeB2CPage,
  AboutPage,
  ContactPage,
  HelpPage,
  DemoPage,
  OnboardingPage,
  FeaturesPage,
  UnifiedLoginPage,
  SignupPage,
  ResetPasswordPage,
  ExamModePage,
  PricingPageWorking,
  PricingPageWorkingPage: PricingPageWorking,
  FAQPage,
  SupportPage,
  SupportChatbotPage,
  PublicAPIPage,
  InstallPage,
  HowItAdaptsPage,
  UseCasesPage,
  SecurityPage,

  // Legal
  MentionsLegalesPage,
  PrivacyPolicyPage,
  SalesTermsPage,
  LicensesPage,
  CookiesPage,
  TermsPage,
  PrivacyPage: PrivacyPolicyPage,
  LegalTermsPage: TermsPage,
  LegalPrivacyPage: PrivacyPolicyPage,
  LegalMentionsPage: MentionsLegalesPage,
  LegalSalesPage: SalesTermsPage,
  LegalCookiesPage: CookiesPage,

  // Store
  StorePage,
  ProductDetailPage,

  // Errors
  UnauthorizedPage,
  ForbiddenPage,
  UnifiedErrorPage,
  NotFoundPage,
  ServerErrorPage,

  // Redirects
  RedirectToScan,
  RedirectToScanPage: RedirectToScan,
  RedirectToJournal,
  RedirectToJournalPage: RedirectToJournal,
  RedirectToSocialCocon,
  RedirectToEntreprise,
  RedirectToEntreprisePage: RedirectToEntreprise,
  RedirectToMusic,
  UnifiedHomePage: HomePage,
} as const;
