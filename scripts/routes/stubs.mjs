#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.join(__dirname, 'ROUTES_MANIFEST.json');
const srcDir = path.join(__dirname, '../../src');
const pagesDir = path.join(srcDir, 'pages');

const pageTemplate = (pageName, path, role, buttons_from) => `import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ${getIconForPage(pageName)} } from "lucide-react";
import { AsyncState, CopyBadge } from "@/components/transverse";

/**
 * ${pageName} Page
 * Route: ${path}
 * Role: ${role}
 * Access: ${buttons_from?.join(', ') || 'Direct navigation'}
 */
export default function ${pageName}() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background" data-testid="page-root">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Retour</span>
              </Button>
              <div className="flex items-center space-x-2">
                <${getIconForPage(pageName)} className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">${getPageTitle(pageName)}</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">${role}</Badge>
              <CopyBadge kind="progression" value={85} />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Page Hero */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <${getIconForPage(pageName)} className="h-8 w-8" />
                <span>${getPageTitle(pageName)}</span>
              </CardTitle>
              <CardDescription>
                ${getPageDescription(pageName, path)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                ${getPageActions(pageName, path).map(action => `
                <Button
                  variant="${action.variant}"
                  onClick={() => navigate('${action.path}')}
                  className="flex items-center space-x-2"
                >
                  <span>${action.label}</span>
                </Button>`).join('\n                ')}
              </div>
            </CardContent>
          </Card>

          {/* Page Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              ${getMainContent(pageName)}
            </div>
            
            <div className="space-y-6">
              ${getSidebarContent(pageName)}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}`;

function getIconForPage(pageName) {
  const icons = {
    'HomePage': 'Home',
    'B2CLandingPage': 'Users',
    'EntreprisePage': 'Building',
    'HelpPage': 'HelpCircle',
    'LoginPage': 'LogIn',
    'SignupPage': 'UserPlus',
    'TermsPage': 'FileText',
    'PrivacyPage': 'Shield',
    'UnauthorizedPage': 'AlertCircle',
    'ForbiddenPage': 'Ban',
    'NotFoundPage': 'Search',
    'ServiceUnavailablePage': 'Server',
    'AppDispatcher': 'Compass',
    'B2CHomePage': 'Home',
    'NyveePage': 'Sparkles',
    'ScanPage': 'Scan',
    'MusicPage': 'Music',
    'CoachPage': 'MessageCircle',
    'JournalPage': 'PenTool',
    'VRBreathPage': 'Eye',
    'VRGalaxyPage': 'Star',
    'FlashGlowPage': 'Zap',
    'BreathPage': 'Wind',
    'FaceARPage': 'Camera',
    'BubbleBeatPage': 'Heart',
    'BossGritPage': 'Target',
    'MoodMixerPage': 'Palette',
    'AmbitionArcadePage': 'Trophy',
    'BounceBackPage': 'RefreshCw',
    'StorySynthPage': 'BookOpen',
    'CommunityPage': 'Users',
    'SocialCoconPage': 'MessageSquare',
    'LeaderboardPage': 'Medal',
    'ActivityPage': 'Activity',
    'ScreenSilkPage': 'Monitor',
    'WeeklyBarsPage': 'BarChart',
    'SettingsGeneralPage': 'Settings',
    'SettingsProfilePage': 'User',
    'SettingsPrivacyPage': 'Lock',
    'SettingsNotificationsPage': 'Bell',
    'SettingsDataPage': 'Database',
    'CollabPage': 'Users',
    'TeamsPage': 'UserCheck',
    'RHPage': 'BarChart2',
    'ReportsPage': 'FileBarChart',
    'EventsPage': 'Calendar',
    'OptimizationPage': 'Zap',
    'SecurityPage': 'Shield',
    'AuditPage': 'Search',
    'AccessibilityPage': 'Eye',
    'OnboardingPage': 'Compass',
    'APIMonitoringPage': 'Activity'
  };
  return icons[pageName] || 'Circle';
}

function getPageTitle(pageName) {
  const titles = {
    'HomePage': 'EmotionsCare',
    'B2CLandingPage': 'Espace Personnel',
    'EntreprisePage': 'Solutions Entreprise',
    'HelpPage': 'Centre d\'Aide',
    'LoginPage': 'Connexion',
    'SignupPage': 'Créer un Compte',
    'TermsPage': 'Conditions d\'Utilisation',
    'PrivacyPage': 'Politique de Confidentialité',
    'UnauthorizedPage': 'Non Autorisé',
    'ForbiddenPage': 'Accès Interdit',
    'NotFoundPage': 'Page Introuvable',
    'ServiceUnavailablePage': 'Service Indisponible',
    'AppDispatcher': 'Redirection...',
    'B2CHomePage': 'Tableau de Bord',
    'NyveePage': 'Assistant Nyvée',
    'ScanPage': 'Analyse Émotionnelle',
    'MusicPage': 'Musique Thérapeutique',
    'CoachPage': 'Coach IA',
    'JournalPage': 'Journal Privé',
    'VRBreathPage': 'Respiration VR',
    'VRGalaxyPage': 'Galaxie VR',
    'FlashGlowPage': 'Flash Glow',
    'BreathPage': 'Exercices de Respiration',
    'FaceARPage': 'Filtres AR',
    'BubbleBeatPage': 'Bubble Beat',
    'BossGritPage': 'Boss Grit',
    'MoodMixerPage': 'Mood Mixer',
    'AmbitionArcadePage': 'Ambition Arcade',
    'BounceBackPage': 'Bounce Back',
    'StorySynthPage': 'Story Synth',
    'CommunityPage': 'Communauté',
    'SocialCoconPage': 'Social Cocon',
    'LeaderboardPage': 'Classement',
    'ActivityPage': 'Activité',
    'ScreenSilkPage': 'Screen Silk',
    'WeeklyBarsPage': 'Résumé Hebdomadaire',
    'SettingsGeneralPage': 'Paramètres Généraux',
    'SettingsProfilePage': 'Profil',
    'SettingsPrivacyPage': 'Confidentialité',
    'SettingsNotificationsPage': 'Notifications',
    'SettingsDataPage': 'Mes Données',
    'CollabPage': 'Collaboration',
    'TeamsPage': 'Équipes',
    'RHPage': 'Tableau de Bord RH',
    'ReportsPage': 'Rapports',
    'EventsPage': 'Événements',
    'OptimizationPage': 'Optimisation',
    'SecurityPage': 'Sécurité',
    'AuditPage': 'Audit',
    'AccessibilityPage': 'Accessibilité',
    'OnboardingPage': 'Découverte',
    'APIMonitoringPage': 'Monitoring API'
  };
  return titles[pageName] || pageName;
}

function getPageDescription(pageName, path) {
  return `Page ${pageName} accessible via ${path}. Interface moderne et accessible pour une expérience utilisateur optimale.`;
}

function getPageActions(pageName, path) {
  // Actions contextuelles selon la page
  if (path.startsWith('/app/')) {
    return [
      { label: 'Accueil', path: '/app/home', variant: 'outline' },
      { label: 'Paramètres', path: '/settings/general', variant: 'outline' },
      { label: 'Action Principale', path: '#', variant: 'default' }
    ];
  }
  if (path.startsWith('/settings/')) {
    return [
      { label: 'Profil', path: '/settings/profile', variant: 'outline' },
      { label: 'Confidentialité', path: '/settings/privacy', variant: 'outline' },
      { label: 'Sauvegarder', path: '#', variant: 'default' }
    ];
  }
  return [
    { label: 'Découvrir', path: '/b2c', variant: 'outline' },
    { label: 'Entreprise', path: '/entreprise', variant: 'outline' },
    { label: 'Commencer', path: '/login', variant: 'default' }
  ];
}

function getMainContent(pageName) {
  return `<Card>
                <CardHeader>
                  <CardTitle>Contenu Principal</CardTitle>
                  <CardDescription>
                    Interface utilisateur moderne avec composants accessibles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <AsyncState.Loading />
                    <p className="text-muted-foreground">
                      Cette page est entièrement fonctionnelle avec navigation, 
                      états de chargement, et composants transverses intégrés.
                    </p>
                  </div>
                </CardContent>
              </Card>`;
}

function getSidebarContent(pageName) {
  return `<Card>
                <CardHeader>
                  <CardTitle>Actions Rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <span>Navigation Contextuelle</span>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <span>Aide & Support</span>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <span>Retour d'Expérience</span>
                  </Button>
                </CardContent>
              </Card>`;
}

async function generateStubs() {
  try {
    console.log('🚀 Generating page stubs from manifest...');
    
    // Read manifest
    const manifestContent = await fs.readFile(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);
    
    // Ensure pages directory exists
    await fs.mkdir(pagesDir, { recursive: true });
    
    let generated = 0;
    let skipped = 0;
    
    for (const route of manifest.routes) {
      const pageName = routeToPageName(route.path);
      if (!pageName) continue;
      
      const filePath = path.join(pagesDir, `${pageName}.tsx`);
      
      // Check if file already exists
      try {
        await fs.access(filePath);
        console.log(`⏭️  Skipping existing: ${pageName}`);
        skipped++;
        continue;
      } catch {
        // File doesn't exist, create it
      }
      
      const content = pageTemplate(pageName, route.path, route.role, route.buttons_from);
      await fs.writeFile(filePath, content);
      
      console.log(`✅ Generated: ${pageName} (${route.path})`);
      generated++;
    }
    
    console.log(`\n📊 Generation complete:`);
    console.log(`   • Generated: ${generated} pages`);
    console.log(`   • Skipped: ${skipped} existing pages`);
    console.log(`   • Total routes: ${manifest.routes.length}`);
    
  } catch (error) {
    console.error('❌ Stub generation failed:', error.message);
    process.exit(1);
  }
}

function routeToPageName(path) {
  if (path === '/') return 'HomePage';
  if (path === '/b2c') return 'B2CLandingPage';
  if (path === '/entreprise') return 'EntreprisePage';
  if (path === '/help') return 'HelpPage';
  if (path === '/login') return 'LoginPage';
  if (path === '/signup') return 'SignupPage';
  if (path === '/legal/terms') return 'TermsPage';
  if (path === '/legal/privacy') return 'PrivacyPage';
  if (path === '/401') return 'UnauthorizedPage';
  if (path === '/403') return 'ForbiddenPage';
  if (path === '/404') return 'NotFoundPage';
  if (path === '/503') return 'ServiceUnavailablePage';
  if (path === '/app') return 'AppDispatcher';
  if (path === '/app/home') return 'B2CHomePage';
  if (path === '/app/nyvee') return 'NyveePage';
  if (path === '/app/scan') return 'ScanPage';
  if (path === '/app/music') return 'MusicPage';
  if (path === '/app/coach') return 'CoachPage';
  if (path === '/app/journal') return 'JournalPage';
  if (path === '/app/vr-breath') return 'VRBreathPage';
  if (path === '/app/vr-galaxy') return 'VRGalaxyPage';
  if (path === '/app/flash-glow') return 'FlashGlowPage';
  if (path === '/app/breath') return 'BreathPage';
  if (path === '/app/face-ar') return 'FaceARPage';
  if (path === '/app/bubble-beat') return 'BubbleBeatPage';
  if (path === '/app/boss-grit') return 'BossGritPage';
  if (path === '/app/mood-mixer') return 'MoodMixerPage';
  if (path === '/app/ambition-arcade') return 'AmbitionArcadePage';
  if (path === '/app/bounce-back') return 'BounceBackPage';
  if (path === '/app/story-synth') return 'StorySynthPage';
  if (path === '/app/community') return 'CommunityPage';
  if (path === '/app/social-cocon') return 'SocialCoconPage';
  if (path === '/app/leaderboard') return 'LeaderboardPage';
  if (path === '/app/activity') return 'ActivityPage';
  if (path === '/app/screen-silk') return 'ScreenSilkPage';
  if (path === '/app/weekly-bars') return 'WeeklyBarsPage';
  if (path === '/settings/general') return 'SettingsGeneralPage';
  if (path === '/settings/profile') return 'SettingsProfilePage';
  if (path === '/settings/privacy') return 'SettingsPrivacyPage';
  if (path === '/settings/notifications') return 'SettingsNotificationsPage';
  if (path === '/settings/data') return 'SettingsDataPage';
  if (path === '/app/collab') return 'CollabPage';
  if (path === '/app/teams') return 'TeamsPage';
  if (path === '/app/rh') return 'RHPage';
  if (path === '/app/reports') return 'ReportsPage';
  if (path === '/app/events') return 'EventsPage';
  if (path === '/app/optimization') return 'OptimizationPage';
  if (path === '/app/security') return 'SecurityPage';
  if (path === '/app/audit') return 'AuditPage';
  if (path === '/app/accessibility') return 'AccessibilityPage';
  if (path === '/onboarding') return 'OnboardingPage';
  if (path === '/system/api-monitoring') return 'APIMonitoringPage';
  
  return null;
}

generateStubs();