# 🏠 Social Rooms & Cocon

Les espaces sociaux (B2C `/app/social-cocon`, B2B `/app/social`) offrent des lieux protégés. Voici les conventions UX/sécurité.

## 🌈 Types d'espaces (B2C)
| Type | Description | Règles |
| --- | --- | --- |
| `guided` | Animé par un hôte EmotionsCare (ex. « Cocon Sérénité »). | Modération en direct, messages pré-formatés, CTA ressources. |
| `semi-private` | Groupe restreint auto-géré. | 25 personnes max, rotation hebdo des modérateurs. |
| `private` | Cercle très fermé (amis, binômes). | Invitation obligatoire, historique effacé après 30 jours. |

- Affichage : badges `Shield`, `Eye`, `Lock` (`lucide-react`) + compteur anonymisé (`XX membres`).
- Animation d'entrée (framer-motion) doit respecter `prefers-reduced-motion`.
- CTA principal « Rejoindre » → animation douce puis état `✓ Membre`.

## 🏢 Social Cocon B2B
- Page `src/pages/B2BSocialCoconPage.tsx` : vitrine programmes & activités.
- Données utilisées : `teamActivities`, `wellnessPrograms`, `teamMetrics` (mock dev → à brancher sur Supabase).
- Règles :
  - Pas de données nominatives, uniquement équipes (`Dev`, `Marketing`, etc.).
  - Tags (`wellness`, `workshop`, `challenge`) centralisés pour filtrage futur.
  - Export CSV désactivé tant que min_n < 5.

## 🔐 Privacy & analytics
- `PageSEO` impose `noindex`.
- Aucun historique individuel n'est exposé (seules agrégations anonymes).
- Events Sentry : `social_cocon:join_space`, `social_cocon:guided_prompt`, `social_cocon:program_view` (pas de texte libre).

## ✅ Checklist avant merge
- [ ] Nouveau room → préciser type (`private`, `semi-private`, `guided`).
- [ ] Pas de texte libre persisté côté client (sauf modération). Utiliser store sécurisé si besoin.
- [ ] Boutons accessibles (`aria-label`, focus visible).
- [ ] QA mobile : animation de join, toasts, fallback reduced motion.

> _Coordonner toute évolution Social Rooms avec l'équipe Care + B2B pour valider la posture (ton, modération, analytics)._ 
