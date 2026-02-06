
# Audit pre-publication -- Corrections indispensables

## Etat actuel confirme par test live

- **Homepage** : fonctionnelle, design Apple-style, chargement OK
- **Trigger signup** : `handle_new_user_settings()` corrige (`ON CONFLICT DO NOTHING`) -- CONFIRME en base
- **ConsentBanner.tsx** : corrige avec `pointer-events-none` -- OK
- **MAIS CookieBanner.tsx** : PAS corrige -- c'est celui-ci qui est charge dans le RootProvider et qui **bloque le bouton signup**

## Erreurs DB actives (logs Supabase)

1. `column mood_entries.valence does not exist` -- requetes front qui selectent `*` puis tentent d'utiliser `valence` dans les types TS
2. `column user_preferences.preferred_activities does not exist` -- meme probleme, le code reference une colonne qui n'existe pas dans la table

---

## Corrections a appliquer (3 fichiers)

### 1. CookieBanner.tsx -- Fix pointer-events (CRITIQUE)

Le `CookieBanner` dans `src/components/cookies/CookieBanner.tsx` (ligne 83) utilise `fixed bottom-0 z-50` SANS `pointer-events-none`. C'est ce composant qui est injecte dans le RootProvider via `src/providers/index.tsx` (ligne 68). Il masque physiquement le bouton "Creer mon compte" sur la page signup.

**Correction** : Ajouter `pointer-events-none` sur le wrapper `motion.div` et `pointer-events-auto` sur le contenu interne, identique au fix deja applique sur `ConsentBanner.tsx`.

Ligne 83 : remplacer
```
className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t shadow-lg"
```
par
```
className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
```
Et envelopper le contenu interne (le `<div className="container...">`) dans un `<div className="pointer-events-auto p-4 bg-background/95 backdrop-blur-sm border-t shadow-lg">`.

### 2. Colonnes DB manquantes -- Migration SQL

Ajouter les colonnes manquantes pour eliminer les erreurs 500 repetees dans les logs :

```sql
-- Ajouter la colonne valence a mood_entries
ALTER TABLE public.mood_entries
  ADD COLUMN IF NOT EXISTS valence numeric DEFAULT 50;

-- Ajouter la colonne preferred_activities a user_preferences  
ALTER TABLE public.user_preferences
  ADD COLUMN IF NOT EXISTS preferred_activities text[] DEFAULT '{}';
```

Ces colonnes sont referencees par le code frontend (via `select('*')` et typage TS) mais n'existent pas dans le schema reel.

### 3. Signup error handling -- Pattern 500

Verifier que le `authErrorService.ts` gere bien le cas `Database error` (deja fait dans la derniere iteration -- juste verification).

---

## Section technique

| Fichier | Modification | Priorite |
|---------|-------------|----------|
| `src/components/cookies/CookieBanner.tsx` | pointer-events-none sur wrapper + pointer-events-auto sur contenu | P0 |
| Migration SQL | ADD COLUMN `mood_entries.valence`, `user_preferences.preferred_activities` | P1 |

## Ce qui est deja OK (pas besoin de toucher)

- Trigger `handle_new_user_settings()` : corrige, confirme en base
- ConsentBanner.tsx : corrige avec pointer-events
- SignupPage.tsx : pb-28 + autoComplete ajoutes
- authErrorService.ts : pattern database_error ajoute
- 4 triggers (audit_profile_changes, security_event_trigger, log_security_audit, handle_new_profile, log_role_changes) : tous corriges

## Actions manuelles post-publication

1. Desactiver "Confirm email" dans Supabase Dashboard > Auth > Email
2. Ajouter `https://emotions-care.lovable.app` comme Site URL et Redirect URL dans Authentication > URL Configuration
