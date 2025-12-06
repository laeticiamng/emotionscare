#!/usr/bin/env bash

###############################################################################
# Script d'ajout automatique de usePageSEO sur pages prioritaires
# Usage: bash scripts/add-seo-batch.sh
###############################################################################

set -e

echo "🔍 Ajout automatique de usePageSEO sur 40 pages prioritaires..."
echo ""

# Compteurs
SUCCESS=0
SKIPPED=0
ERRORS=0

# Fonction pour ajouter usePageSEO à une page
add_seo_to_page() {
  local file="$1"
  local title="$2"
  local description="$3"
  local category="$4"

  if [ ! -f "$file" ]; then
    echo "⚠️  SKIP: $file (fichier inexistant)"
    ((SKIPPED++))
    return
  fi

  # Vérifier si usePageSEO est déjà présent
  if grep -q "usePageSEO" "$file"; then
    echo "⏭️  SKIP: $file (SEO déjà présent)"
    ((SKIPPED++))
    return
  fi

  # Backup
  cp "$file" "${file}.bak"

  # Ajouter l'import après les autres imports React
  if grep -q "import.*from 'react'" "$file"; then
    sed -i.tmp "/import.*from 'react'/a\\
import { usePageSEO } from '@/hooks/usePageSEO';
" "$file"
  else
    # Ajouter en début de fichier après les commentaires
    sed -i.tmp "1a\\
import { usePageSEO } from '@/hooks/usePageSEO';
" "$file"
  fi

  # Ajouter l'appel usePageSEO au début du composant
  # Rechercher la première ligne après la déclaration du composant
  sed -i.tmp "/^const.*=.*=>.*{$/a\\
  usePageSEO({\\
    title: '$title',\\
    description: '$description',\\
    keywords: '$(echo $category | tr '[:upper:]' '[:lower:]'), émotions, bien-être, EmotionsCare'\\
  });\\
" "$file"

  rm -f "${file}.tmp"
  echo "✅ $file ($category)"
  ((SUCCESS++))
}

echo "📦 Catégorie: B2B Dashboards"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

add_seo_to_page "src/pages/B2BDashboardPage.tsx" \
  "Tableau de bord Manager" \
  "Pilotez le bien-être de vos équipes avec des indicateurs temps réel et des insights actionnables." \
  "B2B Dashboard"

add_seo_to_page "src/pages/B2BEmployeeDashboardPage.tsx" \
  "Tableau de bord Collaborateur" \
  "Suivez votre bien-être au travail et accédez aux ressources EmotionsCare de votre entreprise." \
  "B2B Employee"

add_seo_to_page "src/pages/B2BAnalyticsPage.tsx" \
  "Analytics RH" \
  "Analyses approfondies du bien-être organisationnel avec visualisations et rapports exportables." \
  "B2B Analytics"

add_seo_to_page "src/pages/B2BTeamManagementPage.tsx" \
  "Gestion d'équipe" \
  "Gérez vos collaborateurs, leurs accès et suivez l'engagement aux programmes de bien-être." \
  "B2B Team Management"

add_seo_to_page "src/pages/B2BReportsPage.tsx" \
  "Rapports RH" \
  "Générez des rapports détaillés sur le bien-être organisationnel et les tendances émotionnelles." \
  "B2B Reports"

echo ""
echo "📦 Catégorie: Settings & Profile"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

add_seo_to_page "src/pages/SettingsPage.tsx" \
  "Paramètres" \
  "Personnalisez votre expérience EmotionsCare : notifications, confidentialité, langue et plus." \
  "Settings"

add_seo_to_page "src/pages/B2CProfilePage.tsx" \
  "Mon Profil" \
  "Gérez vos informations personnelles, avatar et préférences de compte EmotionsCare." \
  "Profile"

add_seo_to_page "src/pages/AccountPage.tsx" \
  "Mon Compte" \
  "Gérez votre compte EmotionsCare : sécurité, abonnement et données personnelles." \
  "Account"

add_seo_to_page "src/pages/B2CNotificationsPage.tsx" \
  "Notifications" \
  "Configurez vos préférences de notifications et alertes de bien-être personnalisées." \
  "Notifications"

echo ""
echo "📦 Catégorie: VR & Immersive"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

add_seo_to_page "src/pages/B2CVRHomePage.tsx" \
  "Expériences VR" \
  "Découvrez nos expériences de réalité virtuelle pour la relaxation et la gestion émotionnelle." \
  "VR Home"

add_seo_to_page "src/pages/B2CVRNebulaPage.tsx" \
  "Nebula VR - Méditation Spatiale" \
  "Méditez dans des environnements cosmiques immersifs avec guidage adaptatif." \
  "VR Nebula"

add_seo_to_page "src/pages/B2CVRDomePage.tsx" \
  "Dome VR - Sanctuaire Zen" \
  "Relaxez-vous dans un dôme apaisant avec visualisations 360° et musique binaural." \
  "VR Dome"

add_seo_to_page "src/pages/B2CNyveeCoconPage.tsx" \
  "Nyvee Cocon - Refuge Émotionnel" \
  "Créez votre cocon de bien-être personnalisé avec ambiances et exercices sur-mesure." \
  "Nyvee Cocon"

echo ""
echo "📦 Catégorie: Store & Premium"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

add_seo_to_page "src/pages/B2CStorePage.tsx" \
  "Boutique EmotionsCare" \
  "Découvrez nos contenus premium, modules exclusifs et accessoires de bien-être." \
  "Store"

add_seo_to_page "src/pages/B2CPremiumPage.tsx" \
  "Premium - Débloquez tout le potentiel" \
  "Accédez aux fonctionnalités avancées : coaching IA illimité, VR exclusive, analytics pro." \
  "Premium"

add_seo_to_page "src/pages/B2CSubscriptionPage.tsx" \
  "Abonnements" \
  "Choisissez la formule qui vous convient : Gratuit, Premium ou Entreprise." \
  "Subscription"

echo ""
echo "📦 Catégorie: Assessment & Scan"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

add_seo_to_page "src/pages/B2CScanFacePage.tsx" \
  "Scan Facial - Détection Émotionnelle" \
  "Analysez vos émotions en temps réel via reconnaissance faciale avancée." \
  "Face Scan"

add_seo_to_page "src/pages/B2CScanVoicePage.tsx" \
  "Scan Vocal - Analyse Émotionnelle" \
  "Détectez votre état émotionnel par l'analyse de votre voix avec IA." \
  "Voice Scan"

add_seo_to_page "src/pages/B2CAssessmentPage.tsx" \
  "Évaluation Bien-être" \
  "Évaluez votre état émotionnel global avec notre questionnaire scientifique validé." \
  "Assessment"

add_seo_to_page "src/pages/B2CEmotionCheckPage.tsx" \
  "Check-in Émotionnel" \
  "Enregistrez rapidement votre état émotionnel du moment et suivez votre évolution." \
  "Emotion Check"

echo ""
echo "📦 Catégorie: Music & Audio"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

add_seo_to_page "src/pages/B2CMusicLibraryPage.tsx" \
  "Bibliothèque Musicale" \
  "Explorez notre collection de musiques thérapeutiques et playlists bien-être personnalisées." \
  "Music Library"

add_seo_to_page "src/pages/B2CAudioTherapyPage.tsx" \
  "Thérapie Audio" \
  "Séances audio guidées pour relaxation, sommeil et gestion du stress." \
  "Audio Therapy"

add_seo_to_page "src/pages/B2CBinauralPage.tsx" \
  "Sons Binauraux" \
  "Rééquilibrez votre cerveau avec nos sons binauraux scientifiquement calibrés." \
  "Binaural"

echo ""
echo "📦 Catégorie: Breathwork & Meditation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

add_seo_to_page "src/pages/B2CBreathworkPage.tsx" \
  "Cohérence Cardiaque" \
  "Exercices de respiration guidée pour réduire stress et anxiété instantanément." \
  "Breathwork"

add_seo_to_page "src/pages/B2CMeditationPage.tsx" \
  "Méditation Guidée" \
  "Méditez avec des sessions guidées adaptées à votre niveau et vos objectifs." \
  "Meditation"

add_seo_to_page "src/pages/B2CRelaxationPage.tsx" \
  "Relaxation Profonde" \
  "Techniques de relaxation progressive et visualisation pour détente complète." \
  "Relaxation"

echo ""
echo "📦 Catégorie: Journal & Emotions"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

add_seo_to_page "src/pages/B2CEmotionHistoryPage.tsx" \
  "Historique Émotionnel" \
  "Visualisez l'évolution de vos émotions au fil du temps avec graphiques et insights." \
  "Emotion History"

add_seo_to_page "src/pages/B2CEmotionTrackerPage.tsx" \
  "Suivi Émotionnel" \
  "Tracez quotidiennement vos émotions et identifiez patterns et déclencheurs." \
  "Emotion Tracker"

add_seo_to_page "src/pages/B2CReflectionPage.tsx" \
  "Journal de Réflexion" \
  "Écrivez et analysez vos pensées pour mieux comprendre vos émotions." \
  "Reflection Journal"

echo ""
echo "📦 Catégorie: Social & Community"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

add_seo_to_page "src/pages/B2CCommunityPage.tsx" \
  "Communauté EmotionsCare" \
  "Connectez-vous avec d'autres utilisateurs, partagez et progressez ensemble." \
  "Community"

add_seo_to_page "src/pages/B2CForumPage.tsx" \
  "Forum Bien-être" \
  "Discutez, posez vos questions et échangez conseils avec la communauté." \
  "Forum"

add_seo_to_page "src/pages/B2CGroupsPage.tsx" \
  "Groupes de Soutien" \
  "Rejoignez des groupes thématiques pour partager votre parcours de bien-être." \
  "Support Groups"

echo ""
echo "📦 Catégorie: Admin & System"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

add_seo_to_page "src/pages/AdminDashboardPage.tsx" \
  "Admin - Tableau de bord" \
  "Administration système EmotionsCare : utilisateurs, métriques et configuration." \
  "Admin Dashboard"

add_seo_to_page "src/pages/AdminUsersPage.tsx" \
  "Admin - Gestion Utilisateurs" \
  "Gérez les comptes utilisateurs, rôles et permissions système." \
  "Admin Users"

add_seo_to_page "src/pages/AdminAnalyticsPage.tsx" \
  "Admin - Analytics Plateforme" \
  "Métriques globales, performance et statistiques d'utilisation de la plateforme." \
  "Admin Analytics"

add_seo_to_page "src/pages/AdminSettingsPage.tsx" \
  "Admin - Configuration Système" \
  "Configurez les paramètres globaux, intégrations et fonctionnalités de la plateforme." \
  "Admin Settings"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Résumé:"
echo "   ✅ Succès: $SUCCESS pages"
echo "   ⏭️  Ignorées: $SKIPPED pages"
echo "   ❌ Erreurs: $ERRORS pages"
echo ""

if [ $SUCCESS -gt 0 ]; then
  echo "✅ SEO ajouté avec succès sur $SUCCESS pages!"
  echo ""
  echo "📝 Prochaines étapes:"
  echo "   1. Vérifier les modifications: git diff src/pages/"
  echo "   2. Tester le build: npm run build"
  echo "   3. Lancer les tests: npm run test"
  echo "   4. Restaurer si besoin: find src/pages -name '*.bak' -exec mv {} {}.tsx \\;"
else
  echo "⚠️  Aucune page modifiée."
fi

echo ""
