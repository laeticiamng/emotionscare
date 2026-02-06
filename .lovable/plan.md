
# Audit critique pre-publication -- Corrections indispensables

## Score actuel : 8.5/10 -- Objectif : 9.5/10

Cet audit consolide les 8 perspectives demandees (Marketing, CEO, CISO, DPO, CDO, COO, Head of Design, Beta testeur) en une liste unique de corrections bloquantes avant publication.

---

## BLOC A -- BLOQUANTS PUBLICATION (a faire absolument)

### A1. Page /features sans header ni footer (Beta testeur + Head of Design)
**Gravite** : CRITIQUE -- L'utilisateur clique "Comment ca marche" depuis la homepage, arrive sur `/features` et perd TOUTE navigation (pas de logo, pas de menu, pas de footer). Il est "piege" sans retour possible vers la homepage.

**Cause technique** : Le `LayoutWrapper` pour le layout `marketing` rend simplement `<>{children}</>` sans ajouter de header/footer. La homepage (`AppleHomePage`) embarque son propre header, mais les autres pages marketing (features, pricing, about...) n'en ont pas.

**Correction** : Creer un composant `MarketingLayout.tsx` qui inclut le header Apple et le footer, puis modifier le `LayoutWrapper` dans `router.tsx` pour l'utiliser quand `layout === 'marketing'`. Exclure la homepage (`/`) de ce layout puisqu'elle a deja son propre header/footer.

**Fichiers** :
- Creer `src/components/layout/MarketingLayout.tsx` (header + footer reutilisables)
- Modifier `src/routerV2/router.tsx` (LayoutWrapper lignes 805-830)
- Modifier `src/components/home/AppleHomePage.tsx` : changer le layout registry de `marketing` a `simple` dans le registry, OU extraire le header dans le MarketingLayout et retirer le header inline de AppleHomePage

### A2. "des milliers d'utilisateurs" -- donnees fictives sur 7 fichiers (CEO + DPO + Marketing)
**Gravite** : CRITIQUE -- La plateforme est en lancement. Afficher "des milliers d'utilisateurs" est mensonger et contrevient aux regles d'integrite factuelles du projet. Present dans 7 fichiers differents.

**Correction** : Remplacer dans TOUS les fichiers par une formulation honnete : "Rejoignez les professionnels de sante qui ameliorent leur bien-etre" (sans chiffre).

**Fichiers** : `FeaturesPage.tsx`, `SimpleB2CPage.tsx`, `CTAStrip.tsx`, `CommunityEngagement.tsx`, `UnifiedHomePage.tsx`, `DemoPage.tsx`, `HomeB2CPage.tsx`

### A3. "94% efficacite ressentie" -- statistique non sourcee (CEO + DPO)
**Gravite** : HAUTE -- Cette statistique dans la feature card "Base sur la science" n'est adossee a aucune etude. Pour une plateforme sante, un chiffre non prouve est un risque legal et reputationnel.

**Correction** : Remplacer par une formulation factuelle comme `{ value: "6", label: "protocoles scientifiques" }` ou un chiffre verifiable.

**Fichier** : `src/components/home/AppleFeatureSection.tsx` (ligne 44)

### A4. Bouton "Voir la demo" sur /features pointe vers /demo (Marketing + Beta testeur)
**Gravite** : HAUTE -- La regle du projet interdit ce libelle (doit etre "Decouvrir" pointant vers `/features`). Sur la page `/features` elle-meme, un bouton "Voir la demo" qui renvoie vers une page de demo separee est confus.

**Correction** : Remplacer par "En savoir plus" pointant vers `#available` (ancre interne) ou supprimer le bouton secondaire puisque l'utilisateur est deja sur la page features.

**Fichier** : `src/pages/features/FeaturesPage.tsx` (lignes 216-220)

### A5. Hover glow effect casse par style inline (Head of Design)
**Gravite** : MOYENNE -- L'inline `style={{ opacity: 0.05 }}` dans `AppleFeatureSection.tsx` ligne 128 override le `group-hover:opacity-100` Tailwind. L'effet premium de glow au hover est invisible.

**Correction** : Supprimer le `style={{ opacity: 0.05 }}` et ajouter `opacity-5` dans les classes Tailwind.

**Fichier** : `src/components/home/AppleFeatureSection.tsx` (ligne 128)

### A6. Dot `emerald-500` hardcode dans le CTA (Marketing)
**Gravite** : BASSE -- Dans `AppleCTASection.tsx` ligne 111, `bg-emerald-500` au lieu du token semantique.

**Correction** : Remplacer par `bg-green-500` ou `bg-primary`.

**Fichier** : `src/components/home/AppleCTASection.tsx` (ligne 111)

---

## BLOC B -- AMELIORATIONS PRE-PUBLICATION (fortement recommandees)

### B1. Page /features -- design generique vs homepage Apple (Marketing + Head of Design)
La page utilise des cards generiques avec 7 couleurs hardcodees (`text-blue-600`, `text-teal-600`, etc.) qui contrastent avec l'esthetique Apple de la homepage. Le hero est plus petit (`text-4xl` vs `text-7xl`).

**Correction** : Adopter le meme design system -- remplacer les couleurs hardcodees par `text-primary`, agrandir la typographie hero, et appliquer le glassmorphism aux cards.

**Fichier** : `src/pages/features/FeaturesPage.tsx`

### B2. CommunityEngagement.tsx -- tutoiement residuel (Marketing)
Ligne 128 : "les memes protocoles que toi" -- incoherence avec le vouvoiement de la homepage.

**Correction** : "les memes protocoles que vous"

**Fichier** : `src/components/home/CommunityEngagement.tsx` (ligne 128)

### B3. Liens sociaux placeholder dans le footer (CISO + Marketing)
Les URLs (`twitter.com/emotionscare`, etc.) menent probablement vers des 404 externes. Cela nuit a la credibilite.

**Correction** : Remplacer les hrefs par `#` avec un attribut `aria-disabled` jusqu'a creation des comptes reels, ou retirer les icones.

**Fichier** : `src/components/home/Footer.tsx` (lignes 36-39)

---

## BLOC C -- NOTES D'AUDIT (pas de correction code necessaire)

### CISO : Secrets et RLS
- Les RLS sont actives sur toutes les tables sensibles (score 100/100 selon memoire projet)
- Pattern SECURITY DEFINER applique, `search_path = public` sur toutes les fonctions
- Pas de secrets en frontend, `SUPABASE_SERVICE_ROLE_KEY` reserve au backend
- **OK pour publication**

### DPO : RGPD
- Cookie banner fonctionnel avec 3 options (Accepter/Refuser/Parametrer)
- Pages legales operationnelles (Mentions, CGU, CGV, Cookies, Privacy)
- Infrastructure GDPR (consent-manager, data-export, data-deletion) en place
- DNT respecte via `useClinicalConsent`
- **OK pour publication** (hors donnees fictives traitees en A2/A3)

### CDO : Analytics
- Pas de pipeline analytics visible dans le frontend. Les metriques `/me/*/weekly` sont partiellement integrees
- **Non bloquant** pour publication V1

### COO : Processus
- CI/CD via GitHub Actions avec lint + tests
- Sentry configure avec sanitisation PII
- **OK pour publication**

---

## Resume des corrections par priorite d'implementation

| # | Correction | Fichiers | Temps estime |
|---|-----------|----------|--------------|
| A1 | MarketingLayout avec header/footer pour /features et autres pages marketing | 3 fichiers | 15 min |
| A2 | Supprimer "des milliers" dans 7 fichiers | 7 fichiers | 5 min |
| A3 | Remplacer "94% efficacite" par stat verifiable | 1 fichier | 2 min |
| A4 | Fix bouton "Voir la demo" sur /features | 1 fichier | 2 min |
| A5 | Fix hover glow inline opacity | 1 fichier | 1 min |
| A6 | Fix dot emerald hardcode | 1 fichier | 1 min |
| B1 | Refonte design /features (tokens + typographie) | 1 fichier | 10 min |
| B2 | Fix tutoiement CommunityEngagement | 1 fichier | 1 min |
| B3 | Desactiver liens sociaux placeholder | 1 fichier | 2 min |

**Total : ~40 minutes d'implementation**

---

## Details techniques pour A1 (MarketingLayout)

La strategie optimale :
1. Extraire le header de `AppleHomePage.tsx` dans un composant `AppleHeader.tsx`
2. Creer `MarketingLayout.tsx` qui combine `AppleHeader` + `<main>{children}</main>` + `Footer`
3. Modifier `LayoutWrapper` dans `router.tsx` : quand `layout === 'marketing'`, wrapper dans `MarketingLayout`
4. Modifier la registry pour la homepage (`/`) : passer de `layout: 'marketing'` a `layout: 'simple'` puisque `AppleHomePage` garde son propre header/footer inline (evite le double header)

Cela corrige en une seule fois TOUTES les pages marketing (features, pricing, about, contact, help, faq, legal/*) qui n'ont actuellement aucun header/footer.
