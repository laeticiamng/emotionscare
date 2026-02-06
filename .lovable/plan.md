
# Audit critique pre-publication -- EmotionsCare

## BLOCAGE P0 : Inscription toujours cassee (500)

**Test live effectue** : POST `/auth/v1/signup` retourne `500 - "Database error saving new user"`.

**Cause racine confirmee** : Le trigger `handle_new_user_settings()` sur `auth.users` execute :
```sql
INSERT INTO public.user_settings (user_id) VALUES (NEW.id)
ON CONFLICT (user_id) DO NOTHING;
```
Mais la table `user_settings` n'a **pas** de contrainte unique sur `user_id` seul -- la contrainte est sur `(user_id, key)`. PostgreSQL rejette le `ON CONFLICT (user_id)` avec : `"there is no unique or exclusion constraint matching the ON CONFLICT specification"`.

**Correction** : Migration SQL pour ajouter une contrainte unique sur `user_id` OU modifier le trigger pour utiliser `ON CONFLICT DO NOTHING` (sans specifier de colonne).

---

## BLOCAGE P1 : Cookie banner masque le bouton "Creer mon compte"

Le cookie banner utilise `fixed bottom-0 z-50` et recouvre le bouton submit du formulaire d'inscription. L'utilisateur ne peut pas cliquer sur "Creer mon compte" tant qu'il n'a pas interagi avec le banner -- un probleme UX critique car :
- L'utilisateur ne comprend pas pourquoi le clic ne marche pas
- Sur mobile, le banner occupe encore plus d'espace ecran

**Correction** : Ajouter du padding-bottom au formulaire de signup quand le banner est visible, et s'assurer que le banner ne bloque pas les interactions.

---

## Resultats d'audit par role

### CEO -- Strategie
- Proposition de valeur claire ("bien-etre emotionnel pour soignants")
- **STOP BUSINESS** : inscription impossible = 0 croissance
- 6 comptes en base dont 1 actif -- priorite absolue : debloquer le signup

### CISO -- Securite
- 4 warnings du linter Supabase :
  1. Fonctions sans `SET search_path` (risque de detournement)
  2. Extensions dans le schema `public` (risque d'escalade)
  3. 2x RLS policies trop permissives (`USING(true)` sur INSERT/UPDATE/DELETE)
- Anon key correctement exposee (normal pour Supabase)
- `TEST_MODE.BYPASS_AUTH = false` en prod -- correct

### DPO -- RGPD
- Bandeau cookies conforme avec 3 niveaux (essentiels, fonctionnels, analytics)
- Edge functions GDPR presentes (export, deletion, retention)
- Risque : 733+ tables = surface de donnees personnelles non cartographiee

### CDO -- Data
- KPIs homepage factuels (pas de donnees gonflees)
- Pipeline analytics basique (`analytics_events` table)

### COO -- Operations
- Scripts de health check et monitoring presents
- Complexite operationnelle excessive (250+ edge functions)

### Head of Design -- UX
- Homepage Apple-style reussie, messaging clair
- **Bug UX critique** : cookie banner bloque le CTA signup
- Indicateur de force mot de passe : bien implemente
- Accessibilite : skip-links, aria-labels presents

### Beta testeur -- Test reel
1. Homepage : design agreable mais chargement lent (FCP 5.7s, LCP 6.8s)
2. Page signup : formulaire clair avec validation temps reel
3. Cookie banner bloque le bouton submit -- confusion utilisateur
4. Apres acceptation du banner : clic sur "Creer" -> erreur 500
5. Message d'erreur en francais ("Erreur lors de la creation du compte") -- traduction OK
6. **Produit inutilisable** : impossible de s'inscrire

---

## Plan de corrections (3 actions)

### 1. Migration SQL -- Fix trigger `handle_new_user_settings`

Modifier le trigger pour ne pas specifier de colonne dans `ON CONFLICT` :
```sql
CREATE OR REPLACE FUNCTION handle_new_user_settings()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

### 2. Fix cookie banner UX -- `src/components/cookies/CookieBanner.tsx`

Modifier le positionnement du banner pour qu'il n'empeche pas le clic sur les elements en dessous :
- Ajouter `pointer-events: none` sur le container fixe et `pointer-events: auto` uniquement sur le contenu du banner
- OU ajouter un padding-bottom dynamique au body quand le banner est visible

### 3. Fix signup page padding -- `src/pages/SignupPage.tsx`

Ajouter un `pb-24` (padding-bottom) au container du formulaire pour garantir que le bouton "Creer mon compte" est toujours visible au-dessus du cookie banner, meme sans scroll.

---

## Section technique

| Fichier/Ressource | Modification |
|---|---|
| Migration SQL (Supabase) | Fix `handle_new_user_settings()` : `ON CONFLICT DO NOTHING` + `SET search_path = public` |
| `src/components/cookies/CookieBanner.tsx` | Ajouter `pointer-events-none` sur le wrapper fixe |
| `src/pages/SignupPage.tsx` | Ajouter `pb-24` au container pour eviter le masquage par le banner |

## Action manuelle requise

- **Desactiver "Confirm email"** dans le [dashboard Supabase > Auth > Email](https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/auth/providers) pour permettre le test immediat
- **Configurer les Redirect URLs** : ajouter `https://emotions-care.lovable.app` dans Authentication > URL Configuration
