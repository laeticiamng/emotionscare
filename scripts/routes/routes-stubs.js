#!/usr/bin/env node

/**
 * Générateur de stubs pour les pages manquantes
 * Crée des composants minimaux avec data-testid="page-root"
 */

const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = path.join(__dirname, 'ROUTES_MANIFEST.json');
const PAGES_DIR = path.join(__dirname, '../../src/pages');

console.log('🏗️ ROUTES STUBS - Génération des pages manquantes');
console.log('================================================\n');

// Charger le manifeste
let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  console.log(`📋 Manifeste chargé: ${manifest.routes.length} routes`);
} catch (error) {
  console.error('❌ Erreur lors du chargement du manifeste:', error.message);
  process.exit(1);
}

// Template de page stub
const createPageStub = (componentName, routePath, segment) => {
  const pageName = routePath === '/' ? 'Accueil' : 
                   routePath.split('/').pop().replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return `import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

/**
 * ${componentName} - Page générée automatiquement
 * Route: ${routePath}
 * Segment: ${segment}
 */
const ${componentName}: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6" data-testid="page-root">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-4">
            ${pageName}
          </h1>
          <p className="text-muted-foreground">
            Page en cours de développement
          </p>
        </motion.div>

        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <Construction className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Page en Construction</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Cette page sera bientôt disponible avec toutes ses fonctionnalités.
            </p>
            <div className="text-xs text-muted-foreground">
              Route: <code className="bg-muted px-2 py-1 rounded">${routePath}</code>
            </div>
            <div className="text-xs text-muted-foreground">
              Composant: <code className="bg-muted px-2 py-1 rounded">${componentName}</code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ${componentName};
`;
};

// Vérifier et créer les pages manquantes
let createdCount = 0;
let skippedCount = 0;

for (const route of manifest.routes) {
  const componentFile = path.join(PAGES_DIR, `${route.component}.tsx`);
  
  if (!fs.existsSync(componentFile)) {
    console.log(`🔨 Création: ${route.component}.tsx`);
    
    const stubContent = createPageStub(route.component, route.path, route.segment);
    fs.writeFileSync(componentFile, stubContent, 'utf8');
    createdCount++;
  } else {
    skippedCount++;
  }
}

console.log(`\n📊 RÉSULTATS:`);
console.log(`✅ Pages créées: ${createdCount}`);
console.log(`⏭️ Pages existantes: ${skippedCount}`);
console.log(`📁 Total traité: ${manifest.routes.length}`);

if (createdCount > 0) {
  console.log(`\n🎯 Les stubs créés incluent:`);
  console.log(`   - data-testid="page-root" pour les tests E2E`);
  console.log(`   - Structure basique avec Card et animations`);
  console.log(`   - Informations de débogage (route, composant)`);
  console.log(`   - Design cohérent avec le système`);
}

console.log(`\n✅ TERMINÉ - Toutes les pages requises existent maintenant`);