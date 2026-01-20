#!/usr/bin/env tsx
import { mkdir, writeFile, readdir, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { ROUTES_REGISTRY as ROUTES_MANIFEST } from '../src/routerV2/registry';
interface RouteManifestEntry { path: string; component: string; module?: string; auth?: boolean | string; role?: string; }

interface SyncResult {
  success: boolean;
  created: string[];
  existing: string[];
  errors: string[];
}

async function ensureDirectoryExists(filePath: string): Promise<void> {
  const dir = dirname(filePath);
  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    console.warn(`Warning: Could not create directory ${dir}:`, error);
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

function generatePageStub(route: RouteManifestEntry): string {
  const isProtected = route.auth !== 'public';
  const protectedWrapper = isProtected ? `
import { ProtectedRoute } from '@/guards';` : '';

  const componentContent = `import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';${protectedWrapper}

const ${route.component}: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">${route.component}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">${route.module}</Badge>
                  <Badge variant="${route.auth === 'public' ? 'secondary' : 'default'}">${route.auth}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-12 space-y-4">
                <h2 className="text-xl font-semibold">Page en construction</h2>
                <p className="text-muted-foreground">
                  Cette page fait partie du module <strong>${route.module}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  Route: <code className="bg-muted px-2 py-1 rounded">${route.path}</code>
                </p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="font-medium">Chemin:</dt>
                        <dd><code>${route.path}</code></dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Module:</dt>
                        <dd>${route.module}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Auth:</dt>
                        <dd>${route.auth}</dd>
                      </div>
                      ${route.role ? `<div className="flex justify-between">
                        <dt className="font-medium">Rôle:</dt>
                        <dd>${route.role}</dd>
                      </div>` : ''}
                    </dl>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Statut</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>En développement</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Route configurée</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Tests E2E prêts</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ${route.component};`;

  return isProtected ? `${componentContent}

// Version protégée pour l'export
export const Protected${route.component} = () => (
  <ProtectedRoute${route.role ? ` requiredRole="${route.role}"` : ''}>
    <${route.component} />
  </ProtectedRoute>
);` : componentContent;
}

async function syncRoutes(): Promise<SyncResult> {
  console.log('🔄 Synchronisation des routes...\n');
  
  const result: SyncResult = {
    success: true,
    created: [],
    existing: [],
    errors: []
  };
  
  const pagesDir = join(process.cwd(), 'src', 'pages');
  
  // S'assurer que le répertoire pages existe
  await ensureDirectoryExists(join(pagesDir, 'temp'));
  
  for (const route of ROUTES_MANIFEST) {
    const fileName = `${route.component}.tsx`;
    const filePath = join(pagesDir, fileName);
    
    try {
      const exists = await fileExists(filePath);
      
      if (exists) {
        result.existing.push(fileName);
        console.log(`✅ Existe déjà: ${fileName}`);
      } else {
        const stub = generatePageStub(route);
        await writeFile(filePath, stub, 'utf-8');
        result.created.push(fileName);
        console.log(`🆕 Créé: ${fileName}`);
      }
    } catch (error) {
      const errorMsg = `Erreur pour ${fileName}: ${error}`;
      result.errors.push(errorMsg);
      result.success = false;
      console.error(`❌ ${errorMsg}`);
    }
  }
  
  return result;
}

async function main() {
  try {
    const result = await syncRoutes();
    
    console.log('\n📊 Résumé de la synchronisation:');
    console.log(`Fichiers créés: ${result.created.length}`);
    console.log(`Fichiers existants: ${result.existing.length}`);
    console.log(`Erreurs: ${result.errors.length}`);
    
    if (result.created.length > 0) {
      console.log('\n🆕 Nouveaux fichiers créés:');
      result.created.forEach(file => console.log(`  - ${file}`));
    }
    
    if (result.errors.length > 0) {
      console.log('\n❌ Erreurs:');
      result.errors.forEach(error => console.log(`  - ${error}`));
      process.exit(1);
    }
    
    console.log('\n✅ Synchronisation terminée avec succès!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Erreur lors de la synchronisation:', error);
    process.exit(1);
  }
}

if (import.meta.main) {
  main();
}

export { syncRoutes, type SyncResult };