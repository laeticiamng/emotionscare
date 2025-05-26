
#!/usr/bin/env node

/**
 * Audit des éléments backend non connectés au frontend
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Audit Backend-Frontend Gap...');

// Analyser les services backend
function analyzeBackendServices() {
  const services = [];
  const servicesDir = 'services';
  
  if (fs.existsSync(servicesDir)) {
    const serviceDirs = fs.readdirSync(servicesDir).filter(item => {
      return fs.statSync(path.join(servicesDir, item)).isDirectory();
    });
    
    serviceDirs.forEach(serviceDir => {
      const servicePath = path.join(servicesDir, serviceDir);
      const service = {
        name: serviceDir,
        path: servicePath,
        handlers: [],
        endpoints: [],
        tests: []
      };
      
      // Analyser les handlers
      const handlersDir = path.join(servicePath, 'handlers');
      if (fs.existsSync(handlersDir)) {
        const handlers = fs.readdirSync(handlersDir).filter(f => f.endsWith('.ts'));
        service.handlers = handlers.map(h => ({
          name: h,
          path: path.join(handlersDir, h)
        }));
      }
      
      // Analyser index.ts pour les endpoints
      const indexPath = path.join(servicePath, 'index.ts');
      if (fs.existsSync(indexPath)) {
        try {
          const content = fs.readFileSync(indexPath, 'utf8');
          const routes = content.match(/app\.(get|post|put|delete|patch)\(['"`]([^'"`]+)['"`]/g);
          if (routes) {
            service.endpoints = routes.map(route => {
              const match = route.match(/app\.(get|post|put|delete|patch)\(['"`]([^'"`]+)['"`]/);
              return {
                method: match[1].toUpperCase(),
                path: match[2],
                fullRoute: route
              };
            });
          }
        } catch (error) {
          console.warn(`Erreur lecture ${indexPath}:`, error.message);
        }
      }
      
      // Analyser les tests
      const testsDir = path.join(servicePath, 'tests');
      if (fs.existsSync(testsDir)) {
        const tests = fs.readdirSync(testsDir).filter(f => f.endsWith('.test.ts'));
        service.tests = tests;
      }
      
      services.push(service);
    });
  }
  
  return services;
}

// Analyser les appels API frontend
function analyzeFrontendAPICalls() {
  const apiCalls = [];
  
  function scanForAPICalls(dir) {
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          scanForAPICalls(fullPath);
        } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts'))) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            
            // Chercher fetch, axios, supabase calls
            const fetchMatches = content.match(/fetch\(['"`]([^'"`]+)['"`]/g);
            const axiosMatches = content.match(/(axios\.(get|post|put|delete|patch)\(['"`]([^'"`]+)['"`]|axios\(['"`]([^'"`]+)['"`])/g);
            const supabaseMatches = content.match(/supabase\.from\(['"`]([^'"`]+)['"`]/g);
            
            if (fetchMatches) {
              fetchMatches.forEach(match => {
                const url = match.match(/fetch\(['"`]([^'"`]+)['"`]/)[1];
                apiCalls.push({ type: 'fetch', url, file: fullPath });
              });
            }
            
            if (axiosMatches) {
              axiosMatches.forEach(match => {
                const url = match.includes('axios(') 
                  ? match.match(/axios\(['"`]([^'"`]+)['"`]/)[1]
                  : match.match(/axios\.(get|post|put|delete|patch)\(['"`]([^'"`]+)['"`]/)[2];
                apiCalls.push({ type: 'axios', url, file: fullPath });
              });
            }
            
            if (supabaseMatches) {
              supabaseMatches.forEach(match => {
                const table = match.match(/supabase\.from\(['"`]([^'"`]+)['"`]/)[1];
                apiCalls.push({ type: 'supabase', table, file: fullPath });
              });
            }
          } catch (error) {
            console.warn(`Erreur lecture ${fullPath}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.warn(`Impossible de lire le dossier: ${dir}`);
    }
  }
  
  scanForAPICalls('src');
  return apiCalls;
}

// Analyser les migrations DB
function analyzeDatabaseMigrations() {
  const migrations = [];
  const migrationsDirs = ['migrations', 'database/sql'];
  
  migrationsDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql'));
      files.forEach(file => {
        const content = fs.readFileSync(path.join(dir, file), 'utf8');
        
        // Extraire les noms de tables
        const tableMatches = content.match(/CREATE TABLE\s+(\w+)/gi);
        if (tableMatches) {
          tableMatches.forEach(match => {
            const tableName = match.match(/CREATE TABLE\s+(\w+)/i)[1];
            migrations.push({
              file,
              tableName,
              type: 'CREATE_TABLE'
            });
          });
        }
      });
    }
  });
  
  return migrations;
}

// Exécuter l'audit
async function runBackendAudit() {
  const results = {
    timestamp: new Date().toISOString(),
    backendServices: analyzeBackendServices(),
    frontendAPICalls: analyzeFrontendAPICalls(),
    databaseMigrations: analyzeDatabaseMigrations(),
    gaps: {}
  };
  
  // Identifier les gaps
  const frontendEndpoints = results.frontendAPICalls.map(call => call.url || call.table);
  const backendEndpoints = results.backendServices.flatMap(service => 
    service.endpoints.map(ep => ep.path)
  );
  
  results.gaps = {
    unusedBackendServices: results.backendServices.filter(service =>
      service.endpoints.length > 0 && 
      !service.endpoints.some(ep => frontendEndpoints.some(fe => fe.includes(ep.path)))
    ),
    missingBackendEndpoints: frontendEndpoints.filter(fe =>
      !backendEndpoints.some(be => fe.includes(be)) && 
      !fe.startsWith('http') && 
      fe !== 'undefined'
    ),
    unusedTables: results.databaseMigrations.filter(migration =>
      !results.frontendAPICalls.some(call => call.table === migration.tableName)
    ),
    untestedServices: results.backendServices.filter(service => 
      service.handlers.length > 0 && service.tests.length === 0
    )
  };
  
  // Sauvegarder le rapport
  if (!fs.existsSync('reports')) {
    fs.mkdirSync('reports');
  }
  
  fs.writeFileSync(
    'reports/backend-frontend-gap.json',
    JSON.stringify(results, null, 2)
  );
  
  // Afficher le résumé
  console.log('\n📊 Résultats de l\'audit Backend-Frontend:');
  console.log(`🔧 Services backend: ${results.backendServices.length}`);
  console.log(`📡 Appels API frontend: ${results.frontendAPICalls.length}`);
  console.log(`🗄️ Tables de migration: ${results.databaseMigrations.length}`);
  
  console.log('\n⚠️ Gaps identifiés:');
  console.log(`🔸 Services backend inutilisés: ${results.gaps.unusedBackendServices.length}`);
  console.log(`🔸 Endpoints manquants: ${results.gaps.missingBackendEndpoints.length}`);
  console.log(`🔸 Tables non utilisées: ${results.gaps.unusedTables.length}`);
  console.log(`🔸 Services non testés: ${results.gaps.untestedServices.length}`);
  
  console.log('\n📄 Rapport détaillé sauvegardé: reports/backend-frontend-gap.json');
  
  return results;
}

if (require.main === module) {
  runBackendAudit().catch(console.error);
}

module.exports = { runBackendAudit };
