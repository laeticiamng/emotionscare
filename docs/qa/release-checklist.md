# ✅ Checklist QA — Release Candidate EmotionsCare

> À valider **avant chaque mise en production**. Chaque section doit être signée par le responsable QA.

---

## 1. Desktop (1366×768)

- [ ] Hero : badge + titre + CTAs visibles above-the-fold
- [ ] Navigation : toutes les routes publiques accessibles (/, /pricing, /help)
- [ ] Tunnel : signup → login → /pricing → clic Pro → redirection Stripe checkout
- [ ] Dashboard : chargement < 3s, aucun crash
- [ ] Settings : libellés « Pro » (aucune mention « Premium »)

## 2. Mobile (390×844)

- [ ] Signup : formulaire scrollable jusqu'au bouton « Créer mon compte »
- [ ] Cookie banner : aucun champ masqué sous le banner
- [ ] Fermeture banner : pas de saut de layout (CLS < 0.1)
- [ ] Pricing : plans lisibles, CTA accessible
- [ ] Navigation mobile : menu hamburger fonctionnel

## 3. Tunnel d'achat complet

- [ ] Inscription avec email + mot de passe valide
- [ ] Connexion avec identifiants créés
- [ ] Affichage /pricing avec plan Pro à 14,90€/mois
- [ ] Clic « Passer à Pro » → appel edge function `create-checkout`
- [ ] Redirection Stripe checkout avec bon price ID
- [ ] Utilisateur non connecté → redirection vers /signup

## 4. Console & réseau

- [ ] Console : 0 erreur rouge (hors warnings tiers acceptés)
- [ ] Réseau : aucune requête vers `placeholder.supabase.co`
- [ ] Pas de `console.log` de debug en production
- [ ] Pas de clé API exposée dans le code source

## 5. Performance (Lighthouse ≥ 90)

- [ ] Performance score ≥ 90
- [ ] Accessibility score ≥ 90
- [ ] Best Practices score ≥ 90
- [ ] SEO score ≥ 90
- [ ] PWA : icône < 50 KB, manifest.json valide
- [ ] FCP < 2s sur connexion 4G simulée
- [ ] Bundle JS initial < 200 KB (gzip)

## 6. RGPD & sécurité

- [ ] Suppression de compte : bouton accessible dans /settings
- [ ] Suppression : confirmation requise avant exécution
- [ ] Suppression : données utilisateur effacées (profil, sessions, journal)
- [ ] Consentement cookies : banner affiché au premier visit
- [ ] Consentement : choix sauvegardé et respecté
- [ ] RLS Supabase : aucun accès croisé entre utilisateurs

## 7. Tests automatisés

- [ ] Tests unitaires : `npm test` — 0 échec
- [ ] Couverture ≥ 40 % lignes
- [ ] Tests E2E : `pnpm e2e` — 0 échec sur 3 runs consécutifs
- [ ] Pas de test `skip` ou `todo` non documenté

---

**Validé par :** _______________  
**Date :** _______________  
**Version :** _______________
