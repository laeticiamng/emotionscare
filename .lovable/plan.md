
Objectif: “compléter tout ce qu’il manque” = finaliser le chantier SEO + GEO en production-grade sur la base des manques constatés dans le code actuel.

Hypothèses bloquantes à valider en exécution:
- Domaine canonique cible = https://emotionscare.com (et non emotions-care.lovable.app).
- Langues indexées en prod = FR (EN option [[À CONFIRMER]]).

Plan d’implémentation (ordre strict):

1) Stabiliser la couche SEO unique (P0)
- Conserver une seule stratégie par page: `usePageSEO` (supprimer les doublons `SeoHead`/`Helmet` quand coexistence).
- Corriger `usePageSEO` pour ne plus supprimer tous les JSON-LD du head (aujourd’hui il efface aussi ceux injectés ailleurs).
- Harmoniser title/description/canonical/OG/Twitter.
Fichiers clés: `src/hooks/usePageSEO.ts`, `src/pages/HelpPage.tsx`, `src/components/seo/*`, `src/lib/seo/*`.

2) Corriger les pages réellement routées (P0)
- Appliquer SEO complet sur les pages publiques actives qui en manquent: `UnifiedLoginPage`, `PrivacyPolicyPage`, `SalesTermsPage`, `LicensesPage`, et vérifier `About/Features/Pricing/Contact/FAQ/Home`.
- Vérifier l’incohérence route home: `/` sert `components/home/HomePage` (AppleHomePage), pas `UnifiedHomePage`; reporter les optimisations copy/SEO sur la vraie home active.
- Noindex explicite pour login/signup.
Fichiers: `src/pages/*.tsx`, `src/pages/legal/*.tsx`, `src/components/home/*`.

3) Sitemap/robots/llms industrialisés (P0)
- Générer `public/sitemap.xml` automatiquement depuis `routerV2/registry` (uniquement routes publiques indexables, exclure `:params`, `/app`, `/admin`, `/dev`, aliases techniques).
- Aligner `robots.txt` (Googlebot/Bingbot/OAI-SearchBot autorisés, zones privées bloquées).
- Corriger `.well-known/llms.txt` (contenu réel ou redirection 301), retirer lien cassé `llms-full.txt` ou créer le fichier.
Fichiers: `public/sitemap.xml`, `public/robots.txt`, `public/.well-known/llms.txt`, `public/llms.txt`, nouveau script `scripts/generate-sitemap.ts`.

4) Corriger les signaux de confiance et assets SEO (P1)
- Créer un vrai `og-image.png` 1200x630 (actuellement référencé mais absent).
- Uniformiser références OG image (`.svg` vs `.png`) entre `index.html`, pages, social tags.
- Nettoyer promesses non prouvables/terminologie interne restante (ex: “Nyvée”) sur pages marketing actives.
Fichiers: `public/og-image.png` [[À CRÉER]], `index.html`, pages marketing.

5) Architecture de liens internes + anti-friction crawl (P1)
- Corriger liens footer public qui pointent vers des routes privées/non canoniques.
- Ajouter maillage contextuel Home ↔ Features ↔ Pricing ↔ FAQ ↔ Contact ↔ Legal.
- Vérifier qu’aucune page publique indexable n’est orpheline.
Fichiers: `src/components/home/Footer.tsx`, `src/components/layout/Footer.tsx`, sections CTA/pages marketing.

6) JSON-LD GEO propre par type de page (P1)
- Home: Organization + WebSite + SoftwareApplication.
- FAQ: FAQPage (déjà partiel, à fiabiliser sans conflit script).
- Pricing: Product/Offer (sans fausse donnée).
- About/Contact/Legal: WebPage + BreadcrumbList.
- Exclure tout schéma non visible/non vérifiable.
Fichiers: pages marketing + utilitaire schema centralisé [[À CRÉER]].

7) Nettoyage dette SEO à risque (P2)
- Traiter les pages legacy non routées ou doublons légaux (`PrivacyPage` vs `PrivacyPolicyPage`, `SalesPage` vs `SalesTermsPage`) pour éviter incohérences éditoriales.
- Mettre à jour `public/routes-manifest.json` obsolète ou le retirer s’il n’est pas utilisé.
- Supprimer `@ts-nocheck` des composants SEO restants.
Fichiers: `src/pages/legal/*`, `public/routes-manifest.json`, `src/components/seo/PageSEO.tsx`, `src/lib/seo/SeoHead.tsx`.

Critères d’acceptation
- 100% des pages publiques prioritaires ont title/meta/canonical/OG cohérents.
- Sitemap généré automatiquement sans routes privées/dynamiques.
- robots + llms accessibles et sans lien cassé.
- Aucun conflit SEO hook/helmet.
- OG image valide en partage social.
- Contrôle manuel E2E: Home → Features → Pricing → Signup/Login → FAQ → Contact → Legal + test mobile.

Découpage d’exécution recommandé
- Lot 1 (aujourd’hui): points 1,2,3.
- Lot 2 (semaine): points 4,5,6.
- Lot 3 (mois): point 7 + monitoring Search Console/Bing.
