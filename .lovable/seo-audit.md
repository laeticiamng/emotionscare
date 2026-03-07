# 🔍 AUDIT SEO + GEO — EmotionsCare
> Date : 7 mars 2026 | Auditeur : Lovable AI (niveau cabinet senior)
> Domaine : https://emotionscare.com
> Stack : React 18 + Vite SPA + Supabase

---

## 1. RÉSUMÉ EXÉCUTIF

| Critère | Score |
|---------|-------|
| **SEO Technique** | 13/20 |
| **SEO On-Page / Contenu** | 11/20 |
| **GEO (Visibilité IA)** | 14/20 |
| **Verdict Global** | **12,5/20** |

### Justification des scores

**SEO Technique (13/20)** — Les fondations sont en place (usePageSEO unifié, sitemap, robots.txt, OG image, canonical, JSON-LD). Mais : SPA sans SSR = tout le contenu dépend de JS, pas de `<main>` sémantique sur la homepage, pas de hreflang, pas de gestion des trailing slashes, pas de vrai fil d'Ariane visible côté UI.

**SEO On-Page (11/20)** — Les title/meta sont présents sur la plupart des pages, mais les textes sont encore trop génériques sur certaines pages clés (Home hero trop court, Features listing sans paragraphes rédactionnels, Pricing sans FAQ intégrée, About sans blocs GEO). Absence de pages Use Cases, Sécurité, Compare.

**GEO (14/20)** — Excellente base avec llms.txt, JSON-LD riche, Organisation schema, HowTo schema. Mais : terminologie interne résiduelle, manque de blocs "En bref" / "Pour qui" sur les pages marketing, FAQ pas assez spécifique au cœur de métier soignant.

---

### 10 problèmes les plus critiques

1. **SPA sans SSR/prerendering** — Google peut exécuter le JS mais avec délai ; les crawlers IA (GPTBot, PerplexityBot) ne l'exécutent PAS → contenu principal invisible pour eux
2. **Homepage sans `<main>` sémantique** — `AppleHomePage.tsx` n'a pas de balise `<main>`, juste des `<section>` directes
3. **AboutPage utilisait "Dr" pour Laeticia Motongane** — ✅ CORRIGÉ dans cet audit
4. **index.html référençait "Nyvée" dans les OG tags** — ✅ CORRIGÉ dans cet audit
5. **FAQPage utilisait `<Helmet>` en doublon de `usePageSEO`** — ✅ CORRIGÉ dans cet audit
6. **ScannerEmotionnelPage sans aucun SEO** — ✅ CORRIGÉ dans cet audit
7. **StorePage sans usePageSEO** — ✅ CORRIGÉ dans cet audit
8. **MedicalWebPage schema dans index.html** — Risqué sans validation médicale formelle → ✅ CORRIGÉ (remplacé par WebPage)
9. **Aucune page Use Cases, Security, Compare** — Manque de contenu pilier pour SEO non-brand et GEO
10. **Pas de blog / centre de ressources** — Zéro contenu d'acquisition SEO non-brand

### 10 gains les plus rapides

1. ✅ Supprimer "Dr" de AboutPage (FAIT)
2. ✅ Nettoyer "Nyvée" des OG tags index.html (FAIT)
3. ✅ Migrer FAQPage JSON-LD dans usePageSEO (FAIT)
4. ✅ Ajouter usePageSEO à ScannerEmotionnelPage (FAIT)
5. ✅ Ajouter usePageSEO à StorePage (FAIT)
6. ✅ Remplacer MedicalWebPage par WebPage (FAIT)
7. Ajouter `<main id="main-content">` à AppleHomePage
8. Ajouter un bloc "En bref" visible en haut de la homepage
9. Enrichir les meta descriptions des pages légales avec des mots-clés spécifiques
10. Ajouter le lien `/legal/licenses` dans le footer

---

## 2. TABLEAU DES PROBLÈMES

| Priorité | Problème | Impact | Observation | Correction | Difficulté | Pages |
|----------|----------|--------|-------------|------------|------------|-------|
| **P0** | SPA sans prerendering | Crawlabilité IA = 0 pour le contenu dynamique | GPTBot, PerplexityBot, Claude-Web ne rendent pas le JS | Implémenter prerendering via Prerender.io ou Rendertron | L | Toutes |
| **P0** | Pas de `<main>` sur homepage | Sémantique HTML pauvre | `AppleHomePage.tsx` : `<div>` racine | Wrapper `<main id="main-content">` | S | `/` |
| **P0** | ~~"Dr" dans AboutPage~~ | Déontologie médicale | ✅ Corrigé | — | — | `/about` |
| **P0** | ~~"Nyvée" dans OG tags~~ | Terminologie interne exposée | ✅ Corrigé | — | — | `index.html` |
| **P0** | ~~MedicalWebPage schema~~ | Schema trompeur sans validation | ✅ Remplacé par WebPage | — | — | `index.html` |
| **P1** | Pas de page Use Cases | SEO non-brand = 0 | Aucune page ciblant "gestion stress infirmier", "burn-out médecin" | Créer `/use-cases` | M | [[À CRÉER]] |
| **P1** | Pas de page Sécurité | Trust signal manquant pour GEO | Les IA cherchent les pages sécurité/conformité | Créer `/security` | M | [[À CRÉER]] |
| **P1** | FAQ trop générique | Pas de questions spécifiques soignants | Questions de type "comment créer un compte" = 0 valeur SEO | Réécrire FAQ avec questions métier | M | `/faq` |
| **P1** | Pas de fil d'Ariane visible | JSON-LD BreadcrumbList existe mais pas rendu | Dissonance entre schema et UI | Ajouter composant Breadcrumb visible | S | Toutes marketing |
| **P1** | Pas de hreflang | Site FR uniquement, pas déclaré | Confusion possible pour Google | Ajouter `<link rel="alternate" hreflang="fr" />` | S | Toutes |
| **P1** | Footer manque `/legal/licenses` | Page orpheline | Licences pas dans le footer | Ajouter au footer | S | Footer |
| **P1** | HomeB2CPage meta trop "IA généraliste" | Positionnement dilué | "Votre Compagnon de Bien-Être Émotionnel IA" ≠ positionnement soignants | Réécrire title/description | S | `/b2c` |
| **P2** | Pages légales dupliquées | Confusion crawl | `SalesPage.tsx` + `SalesTermsPage.tsx`, `PrivacyPage.tsx` × 3 | Consolider, redirect 301 | M | `/legal/*` |
| **P2** | `routes-manifest.json` obsolète | Fichier mort indexable | Présent dans public/ mais non utilisé | Supprimer | S | `public/` |
| **P2** | Images sans alt systématique | A11y + SEO image | Pas vérifié exhaustivement | Audit a11y ciblé | M | Toutes |
| **P2** | Pas de blog/ressources | SEO non-brand long terme = 0 | Aucun contenu éditorial | Évaluer ROI avant création | L | [[À CRÉER]] |

---

## 3. TABLEAU PAR PAGE

### 3.1 Homepage (`/`)

| Élément | Actuel | Recommandé |
|---------|--------|------------|
| **Rôle** | Page pilier, conversion signup | ✅ Correct |
| **Mot-clé principal** | "gestion stress soignants" | "régulation émotionnelle soignants" |
| **Intention** | Navigationnelle + transactionnelle | ✅ |
| **Title** | `EmotionsCare - Gestion du stress pour soignants en 3 minutes` | `EmotionsCare — Régulation émotionnelle pour soignants en 3 minutes` |
| **Meta description** | ✅ Bon | ✅ |
| **H1** | `Gérez votre stress en 3 minutes. Concrètement.` | ✅ Bon, impactant |
| **Contenu manquant** | Bloc "En bref", bloc "Pour qui", bloc "Comment ça marche" | Ajouter 3 blocs GEO |
| **CTA** | "Commencer gratuitement" | ✅ Bon |
| **Schema** | Organization + WebApplication + WebSite + HowTo | ✅ Riche |
| **Maillage** | → Features, Pricing, Signup | Ajouter → Use Cases, FAQ, About |

### 3.2 Features (`/features`)

| Élément | Actuel | Recommandé |
|---------|--------|------------|
| **Rôle** | Showcase fonctionnalités | ✅ |
| **Mot-clé** | "fonctionnalités régulation émotionnelle" | "outils bien-être soignants" |
| **Title** | [[À VÉRIFIER]] | `Fonctionnalités EmotionsCare — 8 outils pour réguler le stress des soignants` |
| **Contenu manquant** | Paragraphes rédactionnels entre les sections, bloc comparaison | Textes enrichis sémantiquement |
| **CTA** | Absent en fin de page | Ajouter CTA vers /signup et /pricing |
| **Schema** | BreadcrumbList (auto) | Ajouter ItemList pour les fonctionnalités |

### 3.3 Pricing (`/pricing`)

| Élément | Actuel | Recommandé |
|---------|--------|------------|
| **Rôle** | Conversion | ✅ |
| **Mot-clé** | "tarif emotionscare" | "prix application bien-être soignants" |
| **Title** | `Tarifs - EmotionsCare | Plans pour soignants` | `Tarifs EmotionsCare — Gratuit pour commencer, Pro à 14,90€/mois` |
| **Contenu manquant** | FAQ pricing, comparaison plans détaillée, garanties | Ajouter section FAQ + garanties |
| **Schema** | BreadcrumbList | Ajouter Product/Offer pour chaque plan |

### 3.4 About (`/about`)

| Élément | Actuel | Recommandé |
|---------|--------|------------|
| **Rôle** | Trust, brand story | ✅ |
| **Mot-clé** | "emotionscare plateforme soignants" | ✅ |
| **Title** | ✅ Corrigé | `À propos d'EmotionsCare — Régulation émotionnelle pour soignants` |
| **Contenu manquant** | Bloc "Notre mission", bloc "L'équipe", bloc "Nos valeurs" | Enrichir avec GEO blocs |
| **Schema** | Organization (via includeOrganization) | ✅ |

### 3.5 Contact (`/contact`)

| Élément | Actuel | Recommandé |
|---------|--------|------------|
| **Rôle** | Support, leads B2B | ✅ |
| **Title** | `Contact | EmotionsCare - Nous contacter` | `Contactez EmotionsCare — Support & partenariats B2B` |
| **Contenu manquant** | Horaires de réponse, info B2B | Ajouter |
| **Schema** | BreadcrumbList | Ajouter ContactPoint |

### 3.6 FAQ (`/faq`)

| Élément | Actuel | Recommandé |
|---------|--------|------------|
| **Rôle** | Support, SEO longue traîne | ✅ |
| **Title** | ✅ Corrigé | `FAQ EmotionsCare — Questions fréquentes sur la régulation émotionnelle` |
| **Schema** | ✅ FAQPage (corrigé, via usePageSEO) | ✅ |
| **Contenu manquant** | Questions spécifiques métier soignant | Ajouter catégorie "Soignants & étudiants" |

### 3.7 Scanner (`/scanner`)

| Élément | Actuel | Recommandé |
|---------|--------|------------|
| **Rôle** | Acquisition, démonstration produit | ✅ |
| **Title** | ✅ Ajouté | `Scanner Émotionnel — Évaluez votre état en 60 secondes` |
| **Contenu manquant** | Texte introductif expliquant l'outil | Ajouter paragraphe pré-scan |

### 3.8 Pages légales (`/legal/*`)

| Page | SEO | Observation |
|------|-----|-------------|
| `/legal/mentions` | ✅ usePageSEO | OK |
| `/legal/terms` | ✅ usePageSEO | OK |
| `/legal/sales` | ✅ usePageSEO | OK |
| `/legal/privacy` | ✅ usePageSEO | OK |
| `/legal/cookies` | ✅ usePageSEO | OK |
| `/legal/licenses` | ✅ usePageSEO | Absent du footer → orpheline |
| `/privacy` (doublon) | usePageSEO | Route doublon de `/legal/privacy`, à redirect 301 |

### 3.9 Login/Signup

| Page | SEO | Observation |
|------|-----|-------------|
| `/login` | ✅ noIndex | Correct |
| `/signup` | ✅ noIndex | Correct |

---

## 4. BACKLOG LOVABLE-READY

### Ticket 1 — Ajouter `<main>` sémantique à AppleHomePage
- **Priorité** : P0
- **Description** : Wrapper le contenu principal dans `<main id="main-content" role="main">` pour conformité sémantique HTML5
- **Pourquoi** : Google et les IA utilisent `<main>` pour identifier le contenu principal vs navigation/footer
- **Fichiers** : `src/components/home/AppleHomePage.tsx`
- **Routes** : `/`
- **Acceptance criteria** : `<main>` présent dans le DOM, skip link fonctionne
- **Tests** : Vérifier que le skip link `#main-content` scrolle correctement
- **Estimation** : S (15 min)

### Ticket 2 — Implémenter le prerendering pour crawlers IA
- **Priorité** : P0
- **Description** : Les crawlers IA (GPTBot, PerplexityBot, Claude-Web) ne rendent pas le JavaScript. Tout le contenu marketing est invisible pour eux. Implémenter une solution de prerendering (Prerender.io, Rendertron, ou `vite-plugin-prerender` pour les pages statiques).
- **Pourquoi** : Sans prerendering, le score GEO est plafonné car les IA ne voient que le `index.html` statique avec les meta tags mais pas le contenu réel des pages
- **Fichiers** : `vite.config.ts`, `_headers` ou config serveur
- **Routes** : `/`, `/features`, `/pricing`, `/about`, `/contact`, `/faq`, `/help`, `/scanner`, `/entreprise`, `/b2c`
- **Acceptance criteria** : `curl -A "GPTBot" https://emotionscare.com/features` retourne le HTML avec le contenu textuel complet
- **Tests** : Tester avec `curl` sans JS ; vérifier que le contenu principal est dans le HTML
- **Estimation** : L (4-8h)

### Ticket 3 — Créer la page Use Cases (`/use-cases`)
- **Priorité** : P1
- **Description** : Page pilier SEO non-brand ciblant les requêtes métier : "gestion stress infirmier", "burn-out étudiant médecine", "prévention épuisement professionnel soignant"
- **Pourquoi** : Zero page de contenu ciblant les requêtes non-brand. C'est le plus gros manque pour le SEO d'acquisition
- **Fichiers** : `src/pages/UseCasesPage.tsx` [[À CRÉER]], `src/routerV2/registry.ts`
- **Routes** : `/use-cases`
- **Acceptance criteria** : Page avec 3-4 cas d'usage détaillés, CTA vers signup, maillage vers features/pricing
- **Estimation** : M (2-3h)

### Ticket 4 — Créer la page Sécurité (`/security`)
- **Priorité** : P1
- **Description** : Page trust signal détaillant RGPD, HDS, chiffrement, politique de données. Les moteurs génératifs cherchent activement ces pages.
- **Pourquoi** : Les IA citent en priorité les plateformes qui affichent clairement leur politique de sécurité
- **Fichiers** : `src/pages/SecurityPage.tsx` [[À CRÉER]], `src/routerV2/registry.ts`
- **Routes** : `/security`
- **Acceptance criteria** : Page avec sections RGPD, chiffrement, hébergement, droits utilisateur
- **Estimation** : M (2h)

### Ticket 5 — Enrichir la FAQ avec questions métier soignant
- **Priorité** : P1
- **Description** : Ajouter une catégorie "Pour les soignants" avec des questions spécifiques : "EmotionsCare remplace-t-il un psychologue ?", "Peut-on utiliser EmotionsCare entre deux gardes ?", "Les données sont-elles visibles par mon employeur ?"
- **Pourquoi** : Les FAQ spécifiques au métier sont le meilleur contenu pour la citation IA (les IA adorent citer des réponses factuelles courtes)
- **Fichiers** : `src/pages/FAQPage.tsx`
- **Routes** : `/faq`
- **Acceptance criteria** : 5+ questions spécifiques soignants, réponses factuelles et citables
- **Estimation** : S (1h)

### Ticket 6 — Ajouter fil d'Ariane visible sur pages marketing
- **Priorité** : P1
- **Description** : Le JSON-LD BreadcrumbList existe déjà (généré par usePageSEO), mais aucun fil d'Ariane n'est visible dans l'UI. Créer un composant Breadcrumb réutilisable.
- **Pourquoi** : Google affiche les breadcrumbs dans les SERPs uniquement si schema + UI sont cohérents
- **Fichiers** : `src/components/ui/breadcrumb.tsx` [[À CRÉER]], pages marketing
- **Estimation** : S (1h)

### Ticket 7 — Ajouter hreflang fr + x-default
- **Priorité** : P1
- **Description** : Déclarer `<link rel="alternate" hreflang="fr" href="...">` et `hreflang="x-default"` dans usePageSEO
- **Pourquoi** : Clarifier à Google que le site est en français, éviter la confusion de langue
- **Fichiers** : `src/hooks/usePageSEO.ts`
- **Estimation** : S (30 min)

### Ticket 8 — Consolider les pages légales dupliquées
- **Priorité** : P2
- **Description** : Supprimer les fichiers legacy (`SalesPage.tsx` vs `SalesTermsPage.tsx`, `PrivacyPage.tsx` × 3) et mettre des redirects 301 dans le router
- **Pourquoi** : Éviter la confusion de crawl et le contenu dupliqué
- **Fichiers** : `src/pages/legal/*`, `src/routerV2/registry.ts`
- **Estimation** : M (1h)

### Ticket 9 — Supprimer `routes-manifest.json`
- **Priorité** : P2
- **Description** : Fichier mort dans `public/` qui peut être crawlé inutilement
- **Fichiers** : `public/routes-manifest.json`
- **Estimation** : S (5 min)

### Ticket 10 — Ajouter blocs GEO sur homepage
- **Priorité** : P1
- **Description** : Ajouter sous le hero : bloc "En bref" (résumé 2 phrases), bloc "Pour qui" (3 personas), bloc "Comment ça marche" (3 étapes). Ces blocs sont ce que les IA citent en priorité.
- **Pourquoi** : Les moteurs génératifs extraient les blocs structurés factuels pour leurs réponses
- **Fichiers** : `src/components/home/AppleHomePage.tsx` ou nouvelles sections
- **Estimation** : M (2h)

---

## 5. CODE / CONFIG

### 5.1 hreflang à ajouter dans usePageSEO

```typescript
// Dans usePageSEO, après upsertLink('canonical', ...)
upsertLink('alternate', canonicalUrl, { hreflang: 'fr' });
upsertLink('alternate', canonicalUrl, { hreflang: 'x-default' });
```

### 5.2 `<main>` pour AppleHomePage

```tsx
// Wrapper le contenu dans <main>
<main id="main-content" role="main">
  <AppleHeroSection />
  {/* ... sections ... */}
</main>
```

### 5.3 Bloc "En bref" GEO (suggestion)

```tsx
<section className="py-16 bg-muted/30">
  <div className="container max-w-4xl mx-auto text-center space-y-6">
    <h2 className="text-3xl font-bold">En bref</h2>
    <p className="text-lg text-muted-foreground leading-relaxed">
      EmotionsCare est une plateforme française de régulation émotionnelle 
      qui propose des protocoles de 2 à 5 minutes basés sur les neurosciences 
      (théorie polyvagale, cohérence cardiaque), spécifiquement conçus pour 
      les soignants et étudiants en santé confrontés au stress et au burn-out.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <div>
        <h3 className="font-semibold mb-2">🎯 Pour qui ?</h3>
        <p className="text-sm text-muted-foreground">
          Étudiants en médecine, infirmiers, aides-soignants, 
          et tout professionnel de santé exposé au stress.
        </p>
      </div>
      <div>
        <h3 className="font-semibold mb-2">⚡ Comment ?</h3>
        <p className="text-sm text-muted-foreground">
          Exercices guidés de 2-5 minutes : respiration, scan émotionnel IA, 
          musicothérapie adaptative, coach IA 24/7.
        </p>
      </div>
      <div>
        <h3 className="font-semibold mb-2">🔒 Confiance</h3>
        <p className="text-sm text-muted-foreground">
          Conforme RGPD, données chiffrées AES-256. 
          Gratuit pour commencer, sans engagement.
        </p>
      </div>
    </div>
  </div>
</section>
```

### 5.4 Questions FAQ métier soignant (à ajouter)

```typescript
{
  id: 'soignants',
  category: 'Soignants & Étudiants',
  icon: Heart,
  questions: [
    {
      q: 'EmotionsCare remplace-t-il un psychologue ou un psychiatre ?',
      a: 'Non. EmotionsCare est un outil de prévention et de régulation émotionnelle au quotidien. Il ne remplace en aucun cas un suivi psychologique ou psychiatrique. En cas de détresse, nous orientons vers les dispositifs d\'aide (3114, médecin traitant).'
    },
    {
      q: 'Peut-on utiliser EmotionsCare entre deux gardes à l\'hôpital ?',
      a: 'Oui, c\'est précisément le cas d\'usage principal. Les protocoles durent 2 à 5 minutes et ne nécessitent qu\'un smartphone. Pas besoin de casque, de lieu calme ni de matériel spécifique.'
    },
    {
      q: 'Mon employeur peut-il voir mes données EmotionsCare ?',
      a: 'Non. En mode B2B, seules des statistiques anonymisées et agrégées sont visibles par l\'établissement. Aucune donnée individuelle n\'est jamais partagée. Conformité RGPD stricte.'
    },
    {
      q: 'Les protocoles sont-ils validés scientifiquement ?',
      a: 'Les techniques utilisées (cohérence cardiaque, théorie polyvagale de Stephen Porges, neurosciences affectives de Jaak Panksepp) sont issues de la recherche publiée. EmotionsCare adapte ces protocoles pour une utilisation rapide en contexte hospitalier.'
    },
    {
      q: 'Puis-je utiliser EmotionsCare si je suis étudiant en IFSI ?',
      a: 'Oui. EmotionsCare a été conçu pour les étudiants en santé (médecine, IFSI, aides-soignants). Le plan gratuit donne accès aux protocoles essentiels sans abonnement.'
    },
  ],
}
```

---

## 6. CONTENU À PRODUIRE

| Page | Objectif | Angle | H1 | H2 principaux | CTA | Mot-clé principal | Effort |
|------|----------|-------|----|----|-----|----|----|
| `/use-cases` | SEO non-brand | Cas concrets par persona | "Cas d'usage : comment les soignants utilisent EmotionsCare" | "Étudiant en IFSI entre deux gardes", "Infirmière de nuit", "Cadre de santé & RPS", "Médecin urgentiste" | Commencer gratuitement | "gestion stress infirmier" | M |
| `/security` | Trust + GEO | Transparence sécurité | "Sécurité & confidentialité — Vos données sont protégées" | "Conformité RGPD", "Chiffrement", "Hébergement", "Vos droits" | Lire notre politique de confidentialité | "sécurité données santé" | M |
| `/compare` | SEO comparatif | Différenciation | "EmotionsCare vs applications de méditation" | "Pourquoi ce n'est pas une app de méditation", "Comparaison", "Pour qui" | Essayer gratuitement | "alternative headspace soignants" | M |
| Blog (optionnel) | SEO longue traîne | Éducation | Variable | Variable | Variable | Variable | L |

---

## 7. AUDIT SPÉCIFIQUE JS/SPA

### Problèmes constatés

| Problème | Impact | Gravité |
|----------|--------|---------|
| **100% du contenu est rendu côté client (CSR)** | Les crawlers IA qui n'exécutent pas JS ne voient que les `<meta>` et le JSON-LD de `index.html` | P0 |
| **`index.html` contient des JSON-LD riches** | Partiellement compensatoire : les IA voient Organization, WebApplication, HowTo | Atténuation |
| **Les `<meta>` sont manipulées via DOM (usePageSEO)** | Googlebot les voit (exécute JS) ; GPTBot probablement pas | P0 |
| **Les routes SPA ne génèrent pas de fichiers HTML distincts** | Normal pour Vite SPA, mais bloquant pour le prerendering | P0 |

### Recommandation prerendering

Option 1 (recommandée) : **`vite-plugin-prerender`** — Génère des fichiers HTML statiques au build pour les routes marketing critiques. Zéro changement serveur.

Option 2 : **Prerender.io** — Service SaaS qui intercepte les requêtes des bots et renvoie une version HTML pré-rendue. Plus simple mais payant.

Option 3 : **`_headers` + Cloudflare Workers** — Redirect conditionnel des bots vers une version statique. Plus complexe.

---

## 8. AUDIT GEO DÉTAILLÉ

### Ce que les IA peuvent actuellement comprendre (via index.html uniquement)

✅ Nom de la marque (EmotionsCare)
✅ Type de produit (WebApplication, HealthApplication)
✅ Description (meta description + JSON-LD)
✅ Prix (Gratuit, via Offer schema)
✅ Fonctionnalités (featureList)
✅ Contact (ContactPoint)
✅ Organisation (EMOTIONSCARE SASU, fondée en 2024)
✅ HowTo (4 étapes)
✅ llms.txt (documentation complète pour LLMs)

### Ce que les IA NE PEUVENT PAS comprendre

❌ Le contenu textuel des pages (Features, Pricing, About, FAQ) — car JS-rendered
❌ Les cas d'usage concrets (aucune page)
❌ Les limitations du produit (non documentées)
❌ La comparaison avec les concurrents (aucune page)
❌ Les preuves sociales (pas de témoignages vérifiables)
❌ Les FAQ spécifiques au métier soignant

### Résumés GEO (pour test de citation)

**1 phrase :** EmotionsCare est une plateforme française de régulation émotionnelle qui propose des protocoles de 2-5 minutes basés sur les neurosciences, conçus pour les soignants et étudiants en santé.

**2 phrases :** EmotionsCare est une plateforme française de régulation émotionnelle conçue pour les soignants et étudiants en santé confrontés au stress et au burn-out. Elle propose des protocoles de 2 à 5 minutes basés sur la théorie polyvagale et la cohérence cardiaque, avec un scan émotionnel IA, un coach virtuel 24/7 et de la musicothérapie adaptative.

**5 phrases :** EmotionsCare est la première plateforme française de régulation émotionnelle spécifiquement conçue pour les professionnels et étudiants en santé. Contrairement aux applications de méditation généralistes, elle propose des interventions rapides de 2 à 5 minutes qui agissent directement sur le système nerveux autonome via des protocoles validés scientifiquement (théorie polyvagale, cohérence cardiaque). La plateforme inclut un scan émotionnel par IA, un coach virtuel spécialisé disponible 24/7, de la musicothérapie adaptative et un journal émotionnel intelligent. Le modèle freemium permet de commencer gratuitement, avec un abonnement Pro à 14,90€/mois pour un accès complet. Une offre B2B permet aux établissements de santé de déployer la solution à l'échelle avec un tableau de bord anonymisé pour la prévention des risques psychosociaux.

---

## 9. SEO LOCAL / INTERNATIONAL

| Élément | Statut | Action |
|---------|--------|--------|
| Langue principale | FR | ✅ `<html lang="fr">` |
| hreflang | ❌ Absent | Ajouter `hreflang="fr"` + `x-default` |
| Variante EN | [[À CONFIRMER]] | Si i18n activé, ajouter hreflang en + routes /en/ |
| LocalBusiness schema | Non pertinent | Pas de présence physique → pas de LocalBusiness |
| geo.region | ❌ Absent | Optionnel, ajouter `<meta name="geo.region" content="FR">` |

---

## 10. MESURE / PILOTAGE

### Plan minimum à mettre en place

| Outil | Statut | Action |
|-------|--------|--------|
| Google Search Console | [[À CONFIRMER]] | Vérifier propriété + soumettre sitemap |
| Bing Webmaster Tools | [[À CONFIRMER]] | Inscrire + soumettre sitemap |
| Sitemap submit | ✅ Sitemap existe | Soumettre dans GSC + Bing |
| Suivi impressions/clics | Via GSC | Configurer alertes hebdomadaires |
| Suivi pages indexées | Via GSC | Vérifier que pages marketing sont indexées |
| Suivi brand vs non-brand | Via GSC | Filtrer les requêtes |
| Suivi citation IA | Manual | Tester régulièrement "qu'est-ce que EmotionsCare" dans ChatGPT, Perplexity, Copilot |
| Analytics front-end | Vercel Analytics installé | ✅ |

---

## 11. CHECKLIST PRÉ-PRODUCTION

### Crawl & Index
- [ ] Google Search Console activée et sitemap soumis
- [ ] Bing Webmaster Tools activé et sitemap soumis
- [ ] robots.txt testé (Google robots.txt tester)
- [ ] Sitemap.xml validé (xmlsitemaps.com/validator)
- [ ] Toutes les pages publiques retournent 200
- [ ] Redirections 301 pour les routes dupliquées

### Metadata
- [x] Title unique par page (<60 car)
- [x] Meta description unique par page (<160 car)
- [x] Canonical sur chaque page
- [x] noindex sur login/signup
- [ ] hreflang fr + x-default
- [x] OG tags complets (title, description, image, url)
- [x] Twitter Cards complets

### JSON-LD
- [x] Organization (index.html)
- [x] WebApplication (index.html)
- [x] WebSite + SearchAction (index.html)
- [x] HowTo (index.html)
- [x] FAQPage (FAQPage.tsx via usePageSEO)
- [x] BreadcrumbList (auto via usePageSEO)
- [ ] Product/Offer sur /pricing
- [ ] WebPage sur chaque page marketing

### Mobile & Performance
- [x] Viewport meta
- [x] Responsive design (Tailwind)
- [x] PWA manifest
- [x] Font preload (Inter)
- [x] Lazy loading des sections below-fold
- [ ] Core Web Vitals vérifiés (PageSpeed Insights)

### UX & Accessibilité
- [x] Skip links sur homepage
- [x] ARIA labels sur éléments interactifs
- [x] `role="contentinfo"` sur footer
- [ ] `<main>` sur homepage
- [ ] Fil d'Ariane visible
- [ ] Contraste WCAG AA vérifié

### Analytics & Monitoring
- [ ] Google Search Console
- [ ] Bing Webmaster Tools
- [ ] Alertes de désindexation
- [ ] Suivi positionnement brand

### Trust & Légal
- [x] Mentions légales
- [x] CGU
- [x] CGV
- [x] Politique de confidentialité
- [x] Politique cookies
- [x] Licences
- [x] Contact accessible

### Contenu & Liens
- [x] Footer avec maillage complet
- [ ] Lien /legal/licenses dans footer
- [ ] Page Use Cases
- [ ] Page Sécurité
- [x] FAQ avec structured data
- [x] llms.txt à jour

---

## 12. ACTIONS PRIORITAIRES

### 5 actions AUJOURD'HUI
1. ✅ Corriger "Dr" → "Laeticia Motongane, médecin" (FAIT)
2. ✅ Nettoyer "Nyvée" des OG tags (FAIT)
3. ✅ Corriger MedicalWebPage → WebPage (FAIT)
4. ✅ Ajouter SEO au ScannerEmotionnelPage et StorePage (FAIT)
5. Ajouter `<main>` à AppleHomePage (Ticket 1)

### 5 actions CETTE SEMAINE
1. Enrichir la FAQ avec questions métier soignant (Ticket 5)
2. Ajouter hreflang (Ticket 7)
3. Ajouter `/legal/licenses` au footer
4. Supprimer `routes-manifest.json` (Ticket 9)
5. Ajouter blocs GEO sur homepage (Ticket 10)

### 5 actions CE MOIS
1. Créer page Use Cases (Ticket 3)
2. Créer page Sécurité (Ticket 4)
3. Implémenter prerendering (Ticket 2)
4. Consolider pages légales dupliquées (Ticket 8)
5. Soumettre sitemap à GSC + Bing Webmaster Tools

### Version "Quick Wins Only"
Si vous voulez aller vite, faites uniquement :
1. ✅ Les 5 corrections P0 (DÉJÀ FAITES)
2. Ajouter `<main>` à AppleHomePage (5 min)
3. Enrichir FAQ avec 5 questions soignants (30 min)
4. Ajouter hreflang dans usePageSEO (15 min)
5. Supprimer `routes-manifest.json` (1 min)

---

> **Note** : Cet audit est basé sur l'analyse du code source. Certains éléments nécessitent une vérification en production (Core Web Vitals, indexation réelle GSC, rendu Googlebot). Les scores seront réévalués après implémentation des corrections P0 et P1.
