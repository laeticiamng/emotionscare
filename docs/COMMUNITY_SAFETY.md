# 🛡️ Communauté – Sécurité & modération douce

La page `/app/community` (et son alias `/app/communaute`) est livrée en production avec des garde-fous stricts. Ce guide rappelle les règles à suivre.

## 🔍 Détection & auto-signalement
- Lexique sensible surveillé (`community:auto-flag` → Sentry) :
  - « suicide », « me faire mal », « violence grave », « danger immédiat », « harcèlement ».
- L'auto-signalement envoie uniquement : identifiant hashé, motif, longueur du message (pas de texte brut).
- Les événements `community:report` (bouton « Signaler doucement ») suivent la même règle.

## 👂 Posture de réponse
1. Toujours remercier le partage (`Merci pour ta confiance…`).
2. Formulations non directives (« Je suis là si tu veux parler » plutôt que conseils imposés).
3. Rediriger vers **Social Cocon** (`routes.b2c.socialCocon()`) quand la solitude est évoquée.
4. Proposer des ressources d'urgence si le motif « danger immédiat » est détecté (CTA contextuel).

## 🔒 Privacy & données
- Pas de chiffres affichés (seule la tonalité est visible : « apaisée », « agitée »…).
- Les cartes du feed n'exposent que des métadonnées anonymes (timestamps arrondis, pas d'ID public).
- `PageSEO` force `noindex` pour cette page.
- Les analytics agrègent uniquement le volume (`community:message_posted`, `community:report_submitted`).

## 🧭 Flux modération
1. L'utilisateur clique « Signaler doucement » → modale avec raisons pré-remplies.
2. Un ticket Sentry `community:report` est créé (assigned à l'équipe care).
3. L'équipe suit la procédure :
   - `danger immédiat` → escalade support 24/7.
   - `harcèlement` → suspension préventive + message empathique.
4. Feedback discret à l'utilisateur (« Merci, nous veillons dessus »).

## ✅ Checklist avant merge (feature community)
- [ ] Les nouvelles cartes respectent la charte (pas de contenu chiffré, pas d'avatar externe).
- [ ] Les CTA critiques (report, contact) restent en `aria-label` explicites.
- [ ] Tests e2e/QA vérifient `community:auto-flag` + redirection Social Cocon.
- [ ] Documentation mise à jour (`docs/SOCIAL_ROOMS.md` si impact).

> _La communauté reste un espace de soutien léger. Toute fonctionnalité qui augmente la profondeur des échanges doit repasser par review Care + Privacy._
