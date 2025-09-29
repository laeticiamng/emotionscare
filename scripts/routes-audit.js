
#!/usr/bin/env node

/**
 * Script d'audit des routes - Génère un rapport HTML détaillé
 * Usage: node scripts/routes-audit.js
 */

const fs = require('fs');
const path = require('path');

console.log('📊 ROUTES:AUDIT - Génération du rapport HTML...\n');

// Import du manifeste
const manifestPath = path.join(__dirname, '../src/routesManifest.ts');
const manifestContent = fs.readFileSync(manifestPath, 'utf8');
const routeMatches = manifestContent.match(/['"](\/[^'"]*)['"]/g);
const routes = routeMatches ? routeMatches.map(r => r.replace(/['"]/g, '')) : [];

// Génération du rapport HTML
const htmlReport = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Audit Routes EmotionsCare - ${new Date().toLocaleDateString()}</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
        .stat-number { font-size: 2em; font-weight: bold; color: #4f46e5; }
        .routes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px; }
        .route-card { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 4px solid #10b981; }
        .route-path { font-family: 'Monaco', monospace; font-size: 14px; color: #1f2937; font-weight: 600; }
        .route-category { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
        .category-measure { border-left-color: #f59e0b; }
        .category-immersive { border-left-color: #8b5cf6; }
        .category-ambition { border-left-color: #ef4444; }
        .category-user { border-left-color: #10b981; }
        .category-b2b { border-left-color: #3b82f6; }
        .timestamp { text-align: center; margin-top: 40px; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Audit Routes EmotionsCare</h1>
            <p>Rapport généré le ${new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
        </div>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">${routes.length}</div>
                <div>Routes totales</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">52</div>
                <div>Routes attendues</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${((routes.length / 52) * 100).toFixed(1)}%</div>
                <div>Complétude</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">5</div>
                <div>Catégories</div>
            </div>
        </div>

        <h2>📋 Inventaire des Routes</h2>
        <div class="routes-grid">
            ${routes.map(route => {
              let category = 'user';
              let categoryName = 'Espace Utilisateur';
              
              if (['/scan', '/music', '/flash-glow', '/boss-level-grit', '/mood-mixer', '/bounce-back-battle', '/breathwork', '/instant-glow'].includes(route)) {
                category = 'measure';
                categoryName = 'Mesure & Adaptation';
              } else if (['/vr', '/vr-galactique', '/screen-silk-break', '/story-synth-lab', '/ar-filters', '/bubble-beat'].includes(route)) {
                category = 'immersive';
                categoryName = 'Expériences Immersives';
              } else if (['/ambition-arcade', '/gamification', '/weekly-bars', '/heatmap-vibes'].includes(route)) {
                category = 'ambition';
                categoryName = 'Ambition & Progression';
              } else if (route.startsWith('/b2b')) {
                category = 'b2b';
                categoryName = 'Espace B2B';
              }
              
              return `
                <div class="route-card category-${category}">
                    <div class="route-category">${categoryName}</div>
                    <div class="route-path">${route}</div>
                </div>
              `;
            }).join('')}
        </div>

        <div class="timestamp">
            Rapport généré automatiquement par routes:audit
        </div>
    </div>
</body>
</html>
`;

// Sauvegarde du rapport
const reportsDir = path.join(__dirname, '../reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

const reportPath = path.join(reportsDir, `routes-audit-${Date.now()}.html`);
fs.writeFileSync(reportPath, htmlReport);

console.log(`✅ Rapport généré: ${reportPath}`);
console.log(`📊 ${routes.length}/52 routes auditées`);
console.log(`🌐 Ouvrir le rapport: file://${reportPath}`);

process.exit(0);
