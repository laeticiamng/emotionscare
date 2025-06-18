Titre

Stabiliser complètement la suite de tests : alias, polyfills JSDOM, mocks Supabase, dépendances Playwright

Contexte

Le PR #254 règle une partie des erreurs mais la CI échoue encore ; localement, npm test et npx playwright test plantent avant même le run complet (Erreur 01 côté Codex).
Les logs montrent principalement :
• alias @/ non résolu dans Vitest et Playwright
• dépendances manquantes : edge-test-kit, std/server (Deno), modules Playwright system (libatk-1.0-0 …)
• polyfills absents (ResizeObserver, matchMedia, crypto.randomUUID, fetch, etc.)
• mocks DB incomplets : db.deleteFrom est undefined
• supabase edge-functions toujours sans authorizeRole pour certaines routes

Objectif

Que :
• npm run lint, npm test et npx playwright test passent à 100 % sur la CI et en local
• les edge-functions supabase soient toutes protégées par authorizeRole(...)
• plus aucune erreur « module not found » ni « ECONNREFUSED » pendant les tests

Tâches à faire
1. Alias & Paths
• Ajouter tsconfig-paths (devDep)
• Dans vitest.config.ts, section resolve.alias, mapper '@/' → path.resolve(__dirname,'src')
• Dans playwright.config.ts, charger ts-node/register et tsconfig-paths/register en require au tout début (ou compiler le fichier .ts → .mjs)
2. Polyfills & Setup Tests
• Dans test/setupTests.ts (déjà créé) :

global.ResizeObserver = class { observe(){} unobserve(){} disconnect(){} };
window.matchMedia = q => ({matches:false, media:q, addListener(){}, removeListener(){}, addEventListener(){}, removeEventListener(){}, dispatchEvent() {return false;}});
global.crypto ??= { randomUUID: ()=>'00000000-0000-4000-8000-000000000000' } as Crypto;
import 'whatwg-fetch'; // Headers, Response, Request, fetch


• Mock global fetch et les appels Supabase (ex : vi.mock('@supabase/supabase-js', ()=>({ createClient: ()=>({ auth:{...}, from:()=>({select:()=>({})}) }) })).

3. DB / Kysely mock
• Dans tests/__mocks__/db.ts exporter une implémentation minimale où deleteFrom() renvoie {execute: vi.fn()}
• Utiliser vi.mock('@/database', ()=> import('./__mocks__/db')) dans setupTests.ts
4. Supabase Edge Functions
• Vérifier/patcher les fichiers .ts suivants :
functions/analyze-journal, process-emotion-gamification, enhanced-emotion-analyze, coach-ai → importer authorizeRole et appeler avant toute logique.
• Ajouter les rôles manquants repérés par le test E2E (user, org, etc.).
5. Dépendances manquantes
• Ajouter dans package.json (dev) :

"edge-test-kit": "^0.6.0",
"playwright": "^1.41.0",
"ts-node": "^10.9.1",
"whatwg-fetch": "^3.6.2",
"tsconfig-paths": "^4.2.0"


• Script post-install : "playwright install --with-deps" (résout l’erreur apt).

6. CI / lint
• Activer l’option --max-warnings=0 ou corriger les parsing-errors : typiquement fichiers .ts sans isolatedModules.
• S’assurer que la version Node utilisée par Codex ≥ 18.

Validation manuelle rapide

rm -rf node_modules && npm i
npm run lint          # doit renvoyer 0 erreur
npm test              # Vitest: 100 % passing
npx playwright test   # E2E OK (peut être slow en CI >3 min)

Remarques
• Tous les imports Deno (std/server, std/bytes) dans supabase/functions/** doivent être ignorés ou moqués côté Vitest (non exécutés dans Node).
• On laisse la résolution des messages d’avertissement ExperimentalWarning: Custom ESM Loaders pour un futur ticket.
