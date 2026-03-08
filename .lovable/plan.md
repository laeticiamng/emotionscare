

## Plan : Finaliser les 8 actions SEO/GEO de l'audit

Analyse des écarts constatés dans le code actuel :

| Action audit | État actuel | À faire |
|---|---|---|
| 1. JSON-LD @graph complet | Déjà complet dans `index.html` (Organization, WebApp, WebSite, WebPage, HowTo) | Rien |
| 2. Canonical explicite | `usePageSEO` utilise `window.location.pathname` en fallback → risque preview domain | Forcer `BASE_URL` dans le fallback |
| 3. hreflang | Déjà implémenté dans `usePageSEO` | Rien |
| 4. og:locale | Déjà présent (`fr_FR`) dans `usePageSEO` + `index.html` | Rien |
| 5. Sitemap | Contient `/login` et `/signup` (noindex) | Retirer les auth pages |
| 6. noscript fallback SEO | `index.html` (root) n'a aucun `<noscript>` avec contenu SEO | Ajouter bloc noscript riche |
| 7. robots.txt AI bots | Manque `ClaudeBot` | Ajouter `ClaudeBot` |
| 8. Blocs GEO citables | `GeoSummarySection` existe déjà | Rien |

**+ 1 bug OG image :** `HomePage.tsx` et `UnifiedHomePage.tsx` référencent `/og-image.svg` au lieu de `/og-image.png` (le fichier réel).

---

### Modifications prévues

**1. `src/hooks/usePageSEO.ts` (ligne 59)**
Remplacer le fallback canonical dynamique par un fallback basé sur `BASE_URL` + `pathname` nettoyé (sans query params ni preview domain) :
```ts
const canonicalUrl = canonical ?? `${BASE_URL}${window.location.pathname.replace(/\/$/, '') || '/'}`;
```
Pas de changement fonctionnel majeur puisque `BASE_URL` est déjà hardcodé, mais on nettoie le trailing slash.

**2. `index.html` (body, avant `<div id="root">`)**
Ajouter un `<noscript>` avec du contenu SEO structuré pour les crawlers sans JS :
```html
<noscript>
  <h1>EmotionsCare — Régulation émotionnelle pour soignants en 3 minutes</h1>
  <p>Première plateforme française de régulation émotionnelle pour soignants et étudiants en santé. Protocoles de 2 à 5 minutes basés sur les neurosciences.</p>
  <ul>
    <li>Pour qui : soignants, étudiants en médecine et IFSI</li>
    <li>Durée : exercices de 2-5 minutes</li>
    <li>Objectif : régulation du stress, prévention du burn-out</li>
    <li>Accès : plateforme web gratuite</li>
  </ul>
  <p>Visitez <a href="https://emotionscare.com">emotionscare.com</a></p>
</noscript>
```

**3. `public/robots.txt`**
Ajouter le bloc `ClaudeBot` manquant (entre les blocs Anthropic-AI et PerplexityBot).

**4. `public/sitemap.xml`**
Supprimer les entrées `/login` et `/signup` (pages noindex, pas leur place dans un sitemap).

**5. `src/components/home/HomePage.tsx` + `src/pages/unified/UnifiedHomePage.tsx`**
Corriger `ogImage: '/og-image.svg'` → `'/og-image.png'` et supprimer `twitterImage: '/twitter-card.svg'` (inexistant, le hook utilise déjà ogImage en fallback).

---

Estimation : ~30 min. 5 fichiers, corrections ciblées, aucun risque de régression.

