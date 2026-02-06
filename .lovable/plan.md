

# Audit critique multi-perspectives -- Plan de corrections pre-publication

## Synthese de l'audit

### CEO -- Audit strategique
- **Positionnement clair** : "Pour ceux qui prennent soin des autres" -- bien visible sur la landing page
- **Homepage** : Le hero "Revolutionnez votre bien-etre emotionnel" est visible en 3 secondes, les CTAs (Se connecter / Essai gratuit) sont presents
- **Risque** : Le mot "emotionnel" pourrait creer une confusion ("coaching vague"). Une sous-ligne plus explicite ("Pour soignants et etudiants en sante") est deja presente via le badge mais pourrait etre plus visible
- **Pas de correction bloquante**

### CISO -- Audit cybersecurite
**9 politiques RLS referençant encore `auth.users`** (CRITIQUE) :
Les erreurs `permission denied for table users` persistent dans les logs. Les tables concernees :
1. `Digital Medicine` -- politique SELECT/INSERT/UPDATE/DELETE
2. `abonnement_biovida` -- politique SELECT/INSERT/UPDATE/DELETE
3. `abonnement_fiches` -- politique SELECT/INSERT
4. `biovida_analyses` -- 4 politiques (SELECT/INSERT/UPDATE/DELETE)
5. `notification_filter_templates` -- politique SELECT

**Erreur `http_post`** : Persistante mais non bloquante (clause EXCEPTION WHEN OTHERS)

**1967 fichiers avec `@ts-nocheck`** : Risque de qualite mais non bloquant pour publication

### DPO -- Audit RGPD
- Bandeau cookie fonctionnel avec Parametrer/Refuser/Accepter
- Liens CGU et Politique de Confidentialite presents sur la page signup
- Mention RGPD visible ("Champs obligatoires conformement au RGPD")
- **OK pour publication**

### CDO -- Audit data
- Les colonnes critiques (`valence`, `preferred_activities`, `specialty`) sont presentes
- Feature flags tous actives dans `src/core/flags.ts`
- **OK pour publication**

### COO -- Audit organisationnel
- Routes canoniques fonctionnelles
- Gamification corrigee (subscription sur `user_challenges_progress`)
- **OK pour publication**

### Head of Design -- Audit UX
- Landing page style Apple, minimaliste et lisible
- Navigation responsive avec menu hamburger mobile
- CTA "Essai gratuit" visible en permanence dans le header
- Bandeau cookie ne bloque plus les interactions (pointer-events fix)
- **OK pour publication**

### Beta testeur
- Homepage comprhensible en 3 secondes : titre + sous-titre + CTA
- Signup fonctionnel avec validation mot de passe
- Login fonctionnel
- Zero erreurs console au chargement
- **OK pour publication**

---

## Corrections indispensables (1 seule action)

### Migration SQL : Corriger les 9 RLS policies restantes

Remplacement des jointures `auth.users` par `public.profiles` dans les politiques RLS des tables :
- `Digital Medicine`
- `abonnement_biovida`
- `abonnement_fiches`
- `biovida_analyses`
- `notification_filter_templates`

Chaque politique sera recree avec un pattern securise :

```text
AVANT :  EXISTS (SELECT 1 FROM auth.users WHERE users.id = auth.uid() AND users.email = table.email)
APRES :  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.email = table.email)
```

### Detail technique de la migration

```text
Pour chaque table concernee :
1. DROP POLICY existante referençant auth.users
2. CREATE POLICY nouvelle utilisant public.profiles
3. Pattern identique : jointure sur profiles.id = auth.uid() ET profiles.email = table.email
```

Les 9 politiques seront corrigees dans une seule migration SQL.

---

## Post-correction : Plateforme prete a publier

Apres cette correction, les 7 perspectives de l'audit seront resolues :
- Zero erreur `permission denied for table users` dans les logs
- Toutes les fonctionnalites accessibles
- Conformite RGPD respectee
- UX lisible en 3 secondes

**Action manuelle requise** : Configurer les Redirect URLs Supabase Auth vers `https://emotions-care.lovable.app`

