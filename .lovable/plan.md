

# Audit C-Suite Multi-Perspectives -- EmotionsCare

---

## BLOCAGE CRITIQUE No1 : Inscription impossible (500)

**Cause racine identifiee** (confirmee par test live et logs Supabase) :

Le trigger `audit_profile_changes()` sur la table `profiles` insere `TG_OP` (= `'INSERT'`) dans `admin_changelog.action_type`, mais le check constraint n'autorise que `['update', 'create', 'delete', 'correction']`.

Resultat : toute inscription plante avec `500 - Database error saving new user`.

**Correction** : Modifier la fonction `audit_profile_changes()` pour mapper `TG_OP` vers les valeurs autorisees (`INSERT` -> `create`, `UPDATE` -> `update`, `DELETE` -> `delete`).

```sql
-- Migration SQL a executer
CREATE OR REPLACE FUNCTION audit_profile_changes()
RETURNS trigger AS $$
BEGIN
  INSERT INTO admin_changelog (
    table_name, record_id, action_type,
    admin_user_id, old_value, new_value
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id::text, OLD.id::text),
    CASE TG_OP
      WHEN 'INSERT' THEN 'create'
      WHEN 'UPDATE' THEN 'update'
      WHEN 'DELETE' THEN 'delete'
      ELSE 'update'
    END,
    auth.uid(),
    CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

---

## Audit CEO -- Strategie

| Critere | Constat | Gravite |
|---------|---------|---------|
| Proposition de valeur | Claire : "bien-etre emotionnel pour soignants". Coherente avec le positionnement healthcare | OK |
| KPIs homepage | Stats factuelles (37 modules, 3 min/session, 100% RGPD, 24/7). Pas de faux chiffres | OK |
| Base utilisateurs | 6 comptes en base, dont 1 actif recemment | Attention |
| Inscription bloquee | 500 error -- stop business absolu | Critique |
| Volume de code vs usage | 733 tables, 467 fonctions DB, 250+ edge functions, 150+ pages pour 6 utilisateurs | Desequilibre majeur |
| Roadmap | Documentee dans docs/ROADMAP_2026.md mais priorites mal alignees (features vs stabilite) | A revoir |

**Recommandation CEO** : Geler tout developpement de features. Priorite absolue : fix signup, reduire la complexite, obtenir 50 vrais utilisateurs.

---

## Audit CTO -- Technique

| Critere | Constat | Gravite |
|---------|---------|---------|
| Performance Web Vitals | FCP: 5636ms (poor), LCP: 6836ms (poor), TTFB: 1718ms (needs-improvement) | Critique |
| Build size | 150+ pages, lazy loading partiel, bundle probablement > 2MB | Majeur |
| Dependencies | 130+ packages, dont beaucoup inutilises cote front (sharp, pg, fastify encore references) | Majeur |
| 733 tables DB | Massif pour le stade du produit. Maintenance impossible | Critique |
| Edge Functions | 250+ fonctions separees + 8 super-routers = redondance | Majeur |
| `@ts-nocheck` | Encore present dans `src/lib/env.ts` et potentiellement d'autres fichiers | Moyen |
| Triggers en cascade | 5 triggers sur auth.users + 7 sur profiles = chaine fragile (cause du bug signup) | Critique |
| Autocomplete manquant | Champs password sans `autocomplete="new-password"` | Mineur |

**Recommandation CTO** : Fix DB trigger immediat. Audit et suppression des triggers cascades non essentiels. Reduire les tables a < 100. Optimiser le bundle.

---

## Audit CPO -- Produit

| Critere | Constat | Gravite |
|---------|---------|---------|
| Onboarding | Impossible (signup casse) | Critique |
| Parcours premiere utilisation | Non testable | Bloquant |
| Homepage UX | Design Apple-style reussi, messaging clair | Bien |
| Password strength | Indicateur temps reel ajoute, validation 8+ chars | Bien |
| Cookie banner | Bloque potentiellement le CTA signup (overlay) | Moyen |
| Nombre de modules | 37+ annonces mais la plupart ne sont pas testables | Majeur |
| Coherence navigation | 150+ routes, navigation complexe pour un nouvel utilisateur | Majeur |

**Recommandation CPO** : Reduire le scope visible a 5 modules core fonctionnels. Les autres en "coming soon" avec feature flags.

---

## Audit CISO/RSSI -- Securite

| Critere | Constat | Gravite |
|---------|---------|---------|
| RLS | Active sur toutes les tables, 3 policies trop permissives (USING true sur non-SELECT) | Moyen |
| Secrets frontend | Anon key exposee dans `config.ts` ET `.env` (normal pour anon key) | OK |
| Function search_path | Certaines fonctions sans `SET search_path` (linter warning) | Moyen |
| Extensions public | Extensions dans le schema public au lieu d'un schema dedie | Mineur |
| CSP Headers | Configures dans `_headers`, incluant unsafe-inline pour scripts | Acceptable |
| Logger PII scrubbing | Implemente dans `logger.ts` avec filtrage des mots-cles sensibles | Bien |
| TEST_MODE | BYPASS_AUTH = false en prod. Correct | OK |
| Triggers SECURITY DEFINER | `audit_profile_changes` devrait utiliser `SET search_path = public` | Moyen |

**Recommandation CISO** : Corriger les 3 RLS policies permissives. Ajouter `SET search_path` aux fonctions flaggees.

---

## Audit DPO -- RGPD

| Critere | Constat | Gravite |
|---------|---------|---------|
| Consentement | Banners cookies + checkboxes CGU/Privacy au signup | Bien |
| Data export | Infrastructure GDPR (data-export, data-deletion edge functions) | Bien |
| Retention | `data-retention-processor` edge function presente | Bien |
| Droit a l'oubli | Page `/account-deletion` et edge function `purge_deleted_users` | Bien |
| Privacy policies | Table `privacy_policies` en base, requetee au chargement | Bien |
| Donnees en base | 733 tables = surface d'attaque enorme pour la conformite | Risque |

**Recommandation DPO** : Documenter quelles tables contiennent des donnees personnelles. Les 600+ tables superflues representent un risque RGPD car chaque table avec des donnees utilisateur doit etre couverte par l'export/suppression.

---

## Audit CDO -- Data

| Critere | Constat | Gravite |
|---------|---------|---------|
| Qualite KPIs | Stats homepage factuelles, pas de donnees gonflees | Bien |
| Pipeline analytics | `analytics_events` table presente, edge functions analytics | Partiel |
| 733 tables | Impossible de maintenir la gouvernance sur autant de tables | Critique |
| Sources de donnees | Supabase unique source (coherent) | Bien |

---

## Audit COO -- Operations

| Critere | Constat | Gravite |
|---------|---------|---------|
| CI/CD | Scripts de health check et audit presents | Bien |
| Monitoring | Web Vitals tracking, logger structure | Bien |
| Alerting | Edge functions pour alertes (Discord, Slack, email) | Bien |
| Automatisations | Cron monitoring, scheduled reports | Bien |
| Complexite operationnelle | 250+ edge functions a maintenir | Critique |

---

## Audit Head of Design -- UX

| Critere | Constat | Gravite |
|---------|---------|---------|
| Homepage | Apple-style, minimaliste, bien structure | Excellent |
| Hierarchie visuelle | Titres clairs, espacement genereux, gradient subtils | Bien |
| Mobile | Menu hamburger, responsive grid, tailles adaptatives | Bien |
| Signup form | Design soigne avec indicateur de force password | Bien |
| Cookie banner | Potentiellement intrusif sur mobile | Mineur |
| Accessibilite | Skip-to-content, aria-labels, focus management | Bien |

---

## Audit Beta Testeur

**Test en conditions reelles realise :**

1. Homepage : Chargement lent (6.8s LCP) mais design agreable. Message clair en 5 secondes.
2. Clic "Essai gratuit" -> page signup OK, formulaire clair.
3. Remplissage du formulaire -> indicateur de force password utile.
4. Soumission -> **ECHEC TOTAL** : erreur 500, message affiche en francais grace au fix authErrorService.
5. Impossible d'acceder au produit -> **test arrete**.

**Verdict beta testeur** : Le produit est inutilisable. Le blocage signup empeche toute evaluation.

---

## Plan de corrections (par priorite)

### P0 -- Immediat (fix signup)

1. **Corriger `audit_profile_changes()`** : Mapper `TG_OP` ('INSERT' -> 'create', 'UPDATE' -> 'update', 'DELETE' -> 'delete') pour respecter la check constraint de `admin_changelog`
2. **Ajouter `SET search_path = public`** a cette fonction
3. **Traduire l'erreur 500** dans `authErrorService.ts` : ajouter un pattern pour "Database error" -> message francais ("Erreur lors de la creation du compte. Veuillez reessayer.")

### P1 -- Court terme (UX signup)

4. **Ajouter `autocomplete="new-password"`** aux champs mot de passe du signup et `autocomplete="email"` au champ email
5. **Verifier que le cookie banner ne bloque pas** les CTAs sur mobile
6. **Gerer le cas `email_confirmed_at = null`** avec un message explicite apres inscription reussie

### P2 -- Performance

7. **Optimiser le bundle** : Identifier et supprimer les imports inutilises
8. **Ameliorer LCP/FCP** : Precharger les fonts, reduire le JavaScript initial

### Section technique -- Fichiers modifies

| Fichier/Ressource | Modification |
|---|---|
| Migration SQL (Supabase) | `CREATE OR REPLACE FUNCTION audit_profile_changes()` avec mapping TG_OP |
| `src/lib/auth/authErrorService.ts` | Ajouter pattern "database error" -> message francais |
| `src/pages/SignupPage.tsx` | Ajouter `autoComplete="new-password"` et `autoComplete="email"` |

