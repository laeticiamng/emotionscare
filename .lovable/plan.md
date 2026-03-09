

# Plan : Dernière correction UX — Mobile menu CTA

## Constat

Toutes les corrections de l'audit beta-testeur sont déjà implémentées sauf **une** :

| Élément | Desktop | Mobile |
|---------|---------|--------|
| Header CTA (non auth) | ✅ "Essai gratuit" | ❌ "Commencer" |

Le bouton d'inscription dans le menu mobile (`SharedHeader.tsx` ligne 160) dit encore "Commencer" au lieu de "Essai gratuit", créant une incohérence avec le desktop.

## Vérification complète des corrections précédentes

| Fix planifié | Statut |
|---|---|
| Hero scroll → `#how-it-works-heading` | ✅ Fait |
| Suppression GeoSummary, Institutional, AnnouncementBanner | ✅ Fait |
| Footer : lien Ecosystème supprimé | ✅ Fait |
| SocialProof : titre "Pourquoi EmotionsCare" + mention lancement | ✅ Fait |
| Login : icône Zap → ArrowRight | ✅ Fait |
| Header desktop CTA : "Essai gratuit" | ✅ Fait |
| Header **mobile** CTA : "Essai gratuit" | ❌ Encore "Commencer" |

## Modification

**`src/components/layout/SharedHeader.tsx`** ligne 160 : changer "Commencer" en "Essai gratuit".

