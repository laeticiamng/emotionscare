

# Plan : Rendre les 5 fonctionnalites visibles depuis la page d'accueil

## Constat

Les 5 fonctionnalites demandees **existent deja** dans le codebase :

| Fonctionnalite | Page existante | Route |
|---|---|---|
| MBI-HSS Burnout Assessment (22 items, radar chart, 3 subscales) | `BurnoutAssessmentPage.tsx` | `/app/assess/burnout` |
| Team Wellbeing Dashboard (heatmap, alerts, aggregate scores) | `TeamWellbeingDashboard.tsx` | `/b2b/team-wellbeing` |
| Interventions Library (searchable cards, evidence badges, scheduling) | `InterventionsLibraryPage.tsx` | `/b2b/interventions` |
| Research Export (anonymized datasets, GDPR consent) | `ResearchExportPage.tsx` | `/b2b/research-export` |
| Institutional Report (CHSCT-ready QVT reports) | `InstitutionalReportPage.tsx` | `/b2b/institutional-report` |

La page d'accueil (`AppleHomePage.tsx`) ne mentionne aucune de ces fonctionnalites. Elle est structuree :
Hero > Announcement > HowItWorks > GeoSummary > Features > Showcase > ModulesHighlight > SocialProof > CTA > Footer

## Ce qui sera implemente

### 1. Nouvelle section homepage : `InstitutionalFeaturesSection.tsx`

Section dediee positionnee entre `ModulesHighlightSection` et `SocialProofSection`, qui presente les 5 fonctionnalites B2B/cliniques avec :

- Titre : "Outils cliniques et institutionnels"
- Sous-titre : "Pour les cadres de sante, les institutions et la recherche"
- 5 cartes avec icone, titre, description courte, badge (ex: "MBI-HSS valide", "CHSCT-ready", "RGPD"), et bouton CTA vers la page correspondante
- Style coherent avec l'esthetique verte/chaleureuse existante (gradients primary/accent)
- Auth-aware : redirige vers la page si authentifie, vers `/signup` sinon

Les 5 cartes :
1. **Evaluation Burnout MBI-HSS** — "Questionnaire valide scientifiquement, 22 items, 3 sous-echelles, radar chart" → `/app/assess/burnout`
2. **Dashboard equipe** — "Score collectif anonymise, heatmap shifts/semaines, alertes seuils" → `/b2b/team-wellbeing`
3. **Bibliotheque d'interventions** — "Pratiques basees sur les preuves, niveaux d'evidence, planification equipe" → `/b2b/interventions`
4. **Export recherche** — "Jeux de donnees anonymises, k-anonymat, consentement RGPD" → `/b2b/research-export`
5. **Rapports institutionnels** — "Rapports QVT prets pour le CHSCT, indicateurs et recommandations" → `/b2b/institutional-report`

### 2. Integration dans `AppleHomePage.tsx`

- Import lazy de `InstitutionalFeaturesSection`
- Insertion entre `ModulesHighlightSection` et `SocialProofSection` avec `Suspense`

### 3. Enrichissement de `ModulesHighlightSection.tsx`

- Ajouter une carte "Evaluation Burnout" dans la grille Bento existante (modules B2C) pour donner de la visibilite a l'outil MBI-HSS directement dans la section modules individuels

Aucune modification de base de donnees, aucune nouvelle route, aucun nouveau backend requis.

