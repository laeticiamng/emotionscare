#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎯 AUDIT UX COMPLET - EmotionsCare');
console.log('=====================================\n');

// Structure de l'application à analyser
const userJourneys = {
  'Visiteur anonyme': [
    '/ (HomePage)',
    '/choose-mode (Sélection du mode)',
    '/b2c/login (Connexion B2C)',
    '/b2b/selection (Sélection B2B)',
    '/b2b/user/login (Connexion User B2B)',
    '/b2b/admin/login (Connexion Admin B2B)'
  ],
  'Utilisateur B2C': [
    '/b2c/dashboard (Tableau de bord)',
    '/b2c/onboarding (Intégration)',
    '/b2c/profile (Profil)',
    '/b2c/emotions (Suivi émotionnel)',
    '/b2c/music (Musique adaptative)',
    '/b2c/community (Communauté)',
    '/b2c/challenges (Défis)'
  ],
  'Utilisateur B2B': [
    '/b2b/user/dashboard (Tableau de bord)',
    '/b2b/user/profile (Profil)',
    '/b2b/user/wellbeing (Bien-être)',
    '/b2b/user/team (Équipe)',
    '/b2b/user/resources (Ressources)'
  ],
  'Admin B2B': [
    '/b2b/admin/dashboard (Tableau de bord RH)',
    '/b2b/admin/overview (Vue globale)',
    '/b2b/admin/team-management (Gestion équipe)',
    '/b2b/admin/analytics (Analytiques)',
    '/b2b/admin/settings (Paramètres)'
  ]
};

const uxCriteria = {
  'Navigation et Architecture': {
    'Clarté des menus': 'La navigation est-elle intuitive ?',
    'Profondeur des pages': 'Règle des 3 clics respectée ?',
    'Cohérence des parcours': 'Les flux sont-ils logiques ?',
    'Breadcrumbs': 'L\'utilisateur sait-il où il est ?',
    'Retour en arrière': 'Peut-il facilement revenir ?'
  },
  'Interface et Interaction': {
    'Hiérarchie visuelle': 'Les éléments importants sont-ils mis en avant ?',
    'Lisibilité': 'Le contenu est-il facile à lire ?',
    'Affordances': 'Les éléments cliquables sont-ils évidents ?',
    'Feedback utilisateur': 'Les actions ont-elles un retour ?',
    'États de chargement': 'L\'attente est-elle gérée ?'
  },
  'Contenu et Communication': {
    'Clarté des messages': 'Le langage est-il accessible ?',
    'Aide contextuelle': 'L\'utilisateur a-t-il de l\'aide ?',
    'Messages d\'erreur': 'Sont-ils utiles et bienveillants ?',
    'Onboarding': 'L\'utilisateur comprend-il l\'app ?',
    'Vide et états': 'Les pages vides sont-elles accueillantes ?'
  },
  'Performance et Technique': {
    'Temps de chargement': 'Les pages se chargent-elles vite ?',
    'Responsive design': 'L\'expérience mobile est-elle optimale ?',
    'Accessibilité': 'L\'app est-elle accessible à tous ?',
    'Gestion d\'erreurs': 'Les erreurs sont-elles gracieuses ?',
    'Offline support': 'L\'app fonctionne-t-elle hors ligne ?'
  },
  'Émotion et Engagement': {
    'Personnalisation': 'L\'expérience est-elle personnalisée ?',
    'Gamification': 'Y a-t-il des éléments ludiques ?',
    'Empathie': 'L\'app comprend-elle l\'utilisateur ?',
    'Motivation': 'L\'utilisateur est-il encouragé ?',
    'Confiance': 'L\'utilisateur fait-il confiance à l\'app ?'
  }
};

// Analyse des fichiers sources
const srcDir = path.join(process.cwd(), 'src');
const componentsAnalysis = {
  totalComponents: 0,
  interactiveComponents: 0,
  accessibleComponents: 0,
  responsiveComponents: 0
};

function analyzeComponents(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      analyzeComponents(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      componentsAnalysis.totalComponents++;
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Vérification des éléments interactifs
        if (content.match(/onClick|onSubmit|onChange|Button|Input|Select/)) {
          componentsAnalysis.interactiveComponents++;
        }
        
        // Vérification de l'accessibilité
        if (content.match(/aria-|role=|alt=|htmlFor/)) {
          componentsAnalysis.accessibleComponents++;
        }
        
        // Vérification du responsive
        if (content.match(/md:|lg:|xl:|sm:|responsive/)) {
          componentsAnalysis.responsiveComponents++;
        }
      } catch (error) {
        console.log(`⚠️  Erreur lecture fichier: ${filePath}`);
      }
    }
  });
}

console.log('📊 ANALYSE DES PARCOURS UTILISATEUR');
console.log('==================================\n');

Object.entries(userJourneys).forEach(([userType, journey]) => {
  console.log(`👤 ${userType}:`);
  journey.forEach((page, index) => {
    console.log(`   ${index + 1}. ${page}`);
  });
  console.log('');
});

console.log('🔍 ANALYSE DES COMPOSANTS');
console.log('========================\n');

analyzeComponents(srcDir);

console.log(`📈 Statistiques des composants:`);
console.log(`   - Total composants: ${componentsAnalysis.totalComponents}`);
console.log(`   - Composants interactifs: ${componentsAnalysis.interactiveComponents} (${Math.round(componentsAnalysis.interactiveComponents/componentsAnalysis.totalComponents*100)}%)`);
console.log(`   - Composants accessibles: ${componentsAnalysis.accessibleComponents} (${Math.round(componentsAnalysis.accessibleComponents/componentsAnalysis.totalComponents*100)}%)`);
console.log(`   - Composants responsive: ${componentsAnalysis.responsiveComponents} (${Math.round(componentsAnalysis.responsiveComponents/componentsAnalysis.totalComponents*100)}%)`);
console.log('');

console.log('🎯 CRITÈRES UX À ÉVALUER');
console.log('========================\n');

Object.entries(uxCriteria).forEach(([category, criteria]) => {
  console.log(`📋 ${category}:`);
  Object.entries(criteria).forEach(([criterion, question]) => {
    console.log(`   ✓ ${criterion}: ${question}`);
  });
  console.log('');
});

// Génération du rapport
const reportData = {
  timestamp: new Date().toISOString(),
  userJourneys,
  uxCriteria,
  componentsAnalysis,
  recommendations: [
    'Créer un système de métriques UX en temps réel',
    'Implémenter des tests utilisateur automatisés',
    'Ajouter des heatmaps et analytics comportementales',
    'Développer un système de feedback utilisateur',
    'Optimiser les parcours de conversion',
    'Améliorer les micro-interactions',
    'Renforcer la personnalisation',
    'Créer des personas détaillés'
  ]
};

fs.writeFileSync(
  path.join(process.cwd(), 'reports', 'ux-audit-summary.json'),
  JSON.stringify(reportData, null, 2)
);

console.log('✅ Audit UX terminé ! Rapport sauvegardé dans reports/ux-audit-summary.json');
console.log('🎯 Prochaine étape: Ouvrir le tableau de bord UX à /ux-dashboard');