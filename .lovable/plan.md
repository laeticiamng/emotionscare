
# Audit multi-roles pre-publication - Corrections prioritaires

## Resultats de l'audit

### Ce qui fonctionne
- Homepage : design premium Apple-style, message clair en 3 secondes
- Signup/Login : formulaires fonctionnels, validation visible
- Dashboard /app/home : 5 actions prioritaires, comprehension immediate
- 30+ modules fonctionnels (Scan, Breath, Journal, Coach, Music, VR, Jeux, etc.)
- Catalogue /app/modules : filtres, recherche, categories, section "Recommandes"
- Pages legales : presentes et accessibles
- Pricing : page structuree

### Corrections identifiees (classees par priorite)

---

## P0 - Bugs techniques bloquants

### 1. preloadCritical.ts : MP3 charge comme font
Lignes 29-35 : le code charge `CRITICAL_ASSETS[0]` (qui est `/audio/default-ambient.mp3`) avec `as = 'font'` et `type = 'font/woff2'`. Cela cause le warning console "preloaded but not used". La logique de preload font est residuelle apres la suppression de inter-var.woff2.

**Correction** : Supprimer le bloc de preload font dans `preloadCriticalResources()`, ou le remplacer par un preload audio correct.

### 2. ModulesDashboard.tsx : double definition de `cn`
Ligne 744 definit `function cn(...)` localement alors que `cn` de `@/lib/utils` est deja importe (ligne 34 `import { routes } from '@/lib/routes'` — mais en fait `cn` n'est PAS importe). La fonction locale est une version simplifiee qui ne gere pas `tailwind-merge`. Cela peut causer des conflits de classes CSS.

**Correction** : Remplacer la definition locale par l'import de `cn` depuis `@/lib/utils`.

---

## P1 - Securite (CISO/DPO)

### 3. RLS policies "always true"
Le linter Supabase detecte 2 policies avec `USING (true)` ou `WITH CHECK (true)` sur des operations INSERT/UPDATE/DELETE. Cela permet potentiellement a tout utilisateur authentifie de modifier des donnees.

**Correction** : Identifier et corriger ces policies via Cloud > Run SQL. (Hors scope code front — signaler uniquement.)

### 4. 52 fichiers avec `@ts-nocheck` dans src/pages/
Le standard release-grade exige zero `@ts-nocheck`. 52 fichiers dans les pages desactivent le typage TypeScript. Le risque est la regression silencieuse.

**Correction** : Documenter dans le README comme dette technique connue. La correction complete de 52 fichiers depasse le scope d'un seul commit.

---

## P2 - Marketing / Conversion (CMO)

### 5. Aucun probleme majeur identifie
- Homepage : H1 clair ("Gerez votre stress en 3 minutes"), CTA "Essayer gratuitement" visible
- Features page : modules presentes avec categories
- Pricing : structure lisible

---

## Plan de corrections (3 fichiers)

### Fichier 1 : `src/lib/performance/preloadCritical.ts`
- Supprimer le bloc de preload font residuel (lignes 28-35) qui charge un MP3 comme font
- Le remplacer par un commentaire ou un vrai preload audio

### Fichier 2 : `src/pages/ModulesDashboard.tsx`
- Supprimer la definition locale de `cn` (ligne 744-746)
- Ajouter l'import de `cn` depuis `@/lib/utils` en haut du fichier

### Fichier 3 : `README.md`
- Ajouter une section "Dette technique connue" mentionnant les 52 fichiers `@ts-nocheck` et les 2 RLS policies a corriger
- Mettre a jour la version en v2.9

Total : 3 fichiers a modifier. Corrections ciblees sur les bugs techniques reels detectes lors de l'audit.
