

# Audit Technique Senior - EmotionsCare

## Severite Critique (P0) - A corriger immediatement

### 1. `onAuthStateChange` utilise un callback `async` - Risque de deadlock
**Fichier** : `src/contexts/AuthContext.tsx` ligne 108
**Probleme** : Le callback de `onAuthStateChange` est declare `async`. La documentation Supabase specifie explicitement que cela peut causer des deadlocks applicatifs.
**Correction** : Retirer le mot-cle `async` du callback. Si des appels asynchrones sont necessaires, les deferrer avec `setTimeout(fn, 0)`.

### 2. `signUp` sans `emailRedirectTo` dans AuthContext
**Fichier** : `src/contexts/AuthContext.tsx` lignes 141-166
**Probleme** : L'appel `supabase.auth.signUp()` n'inclut pas `emailRedirectTo`. Cela cause des echecs de confirmation d'email dans certains environnements (preview, production). Seule `UnifiedLoginPage.tsx` et `TestAccountsPage.tsx` l'incluent.
**Correction** : Ajouter `emailRedirectTo: window.location.origin + '/'` dans les options du signUp.

### 3. `getSession()` avant `onAuthStateChange` - Ordre incorrect
**Fichier** : `src/contexts/AuthContext.tsx` lignes 83-133
**Probleme** : `getInitialSession()` est appelee a la ligne 104, puis le listener est enregistre a la ligne 107. Si un evenement auth survient entre ces deux appels, il sera perdu. Le listener doit etre enregistre AVANT l'appel a `getSession()`.
**Correction** : Inverser l'ordre : enregistrer `onAuthStateChange` d'abord, puis appeler `getSession()`.

---

## Severite Haute (P1) - A corriger rapidement

### 4. 1975 fichiers avec `@ts-nocheck`
**Impact** : TypeScript strict est configure mais contourne massivement. Aucune garantie de type sur 95% du code. Les erreurs de type sont silencieuses en production.
**Correction immediate** : Ce volume est trop important pour une correction en un pass. Documenter la dette et planifier la suppression progressive. En priorite, retirer `@ts-nocheck` des fichiers critiques : `AuthContext.tsx`, `guards.tsx`, `routerV2/`, `providers/index.tsx`.

### 5. 62 fichiers utilisent `catch (error: any)`
**Impact** : Perte de type-safety dans la gestion d'erreurs. Masque les vrais types d'erreur et empeche le compilateur de detecter les problemes.
**Correction** : Remplacer par `catch (error: unknown)` et utiliser des type guards (`error instanceof Error`).

### 6. `providers/index.tsx` utilise `@ts-nocheck`
**Fichier** : `src/providers/index.tsx` ligne 1
**Impact** : Le point d'entree des providers (composant racine) n'a aucune verification de type. Un probleme de props dans ce fichier casserait silencieusement toute l'application.
**Correction** : Retirer `@ts-nocheck` et corriger les erreurs de type sous-jacentes.

---

## Severite Moyenne (P2) - A planifier

### 7. `console.log()` dans le code de production (724 occurrences dans 32 fichiers)
**Impact** : Fuite potentielle de donnees sensibles en production. Violation de la regle custom "Pas de console.log".
**Correction** : Remplacer par `logger.debug()` ou supprimer. La plupart sont dans des fichiers de test (acceptable) mais certains sont dans du code applicatif (`ImageUpload.example.tsx`).

### 8. Blocs `catch` vides (5 fichiers)
**Fichiers** : `MedicalDisclaimerDialog.tsx`, `SuggestionChip.tsx`, `EmotionTrendChart.tsx`, `ARExperienceSelector.tsx`, `useMoodMixerEnriched.ts`
**Impact** : Erreurs silencieusement avalees. Aucun diagnostic possible en cas de probleme.
**Correction** : Ajouter au minimum un `logger.warn()` dans chaque bloc catch.

### 9. Double import de logger/supabase via chaines de re-export
**Fichiers** : `src/lib/supabase.ts` re-exporte `src/lib/supabase-client.ts` qui re-exporte `src/integrations/supabase/client.ts`
**Impact** : 3 niveaux d'indirection pour un seul client. Confusion sur quel import utiliser. Tree-shaking potentiellement inefficace.
**Correction** : Standardiser sur un seul point d'import (`@/integrations/supabase/client`).

### 10. Structure de repertoires excessive
**Observation** : `src/` contient 30+ sous-repertoires dont plusieurs sont redondants : `utils/` vs `lib/`, `tests/` vs `test/` vs `__tests__/`, `ui/` vs `components/ui/`, `services/` vs `lib/services/`.
**Impact** : Violation de la regle "max 7 fichiers par dossier" dans l'autre sens - trop de dossiers au meme niveau. Difficulte de navigation.
**Correction** : Consolider progressivement selon l'architecture feature-first deja etablie.

---

## Corrections a implementer (scope de cette iteration)

Les 3 corrections P0 seront implementees car elles affectent directement la fiabilite de l'authentification :

### Fichier 1 : `src/contexts/AuthContext.tsx`

1. **Inverser l'ordre** : `onAuthStateChange` AVANT `getSession()`
2. **Retirer `async`** du callback `onAuthStateChange`
3. **Ajouter `emailRedirectTo`** dans `signUp()`

### Fichier 2 : `src/providers/index.tsx`

4. **Retirer `@ts-nocheck`** et corriger les erreurs de type

### Fichier 3 : Blocs catch vides (5 fichiers)

5. Ajouter `logger.warn()` minimal dans chaque bloc catch vide

---

## Hors scope (dette technique documentee)

| Element | Volume | Priorite |
|---------|--------|----------|
| `@ts-nocheck` a retirer | 1975 fichiers | Planification trimestrielle |
| `catch (error: any)` a typer | 62 fichiers | Sprint dedie |
| `console.log` a nettoyer | 32 fichiers | Sprint dedie |
| Structure repertoires | 30+ dossiers | Refactoring progressif |

