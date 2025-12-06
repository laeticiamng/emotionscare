# 📖 Phase 5 - Jour 9-10 : Pages Coming Soon & Navigation Cleanup

## 🎯 Objectifs

1. Créer un composant **ComingSoon** réutilisable pour modules en développement
2. Implémenter les **pages Coming Soon** pour Messages, Calendar, Point20
3. Créer les **pages légales** (CGU, Confidentialité, Mentions)
4. **Nettoyer la navigation** : routes obsolètes, liens morts
5. **Documenter** l'architecture de navigation

---

## ✅ Réalisations

### 1. Composant ComingSoon (`src/components/coming-soon/ComingSoon.tsx`)

**Fonctionnalités** :
- ✅ Props personnalisables : `moduleName`, `description`, `icon`, `features[]`
- ✅ Badge "En développement"
- ✅ Liste des fonctionnalités à venir
- ✅ Date de disponibilité estimée (optionnelle)
- ✅ Bouton "Me prévenir" (placeholder pour notifications)
- ✅ Bouton "Retour au dashboard"
- ✅ Design responsive avec shadcn/ui (Card, Badge, Button)

**Exemple d'utilisation** :
```tsx
<ComingSoon
  moduleName="Messages"
  description="Système de messagerie instantanée"
  icon={<MessageCircle />}
  features={['Messagerie temps réel', 'Groupes', 'Partage fichiers']}
  estimatedRelease="Q2 2025"
  notifyEnabled
/>
```

### 2. Pages Coming Soon créées

#### **MessagesComingSoon** (`src/pages/coming-soon/MessagesComingSoon.tsx`)
- Module : Messagerie instantanée
- Fonctionnalités : Chat temps réel, groupes, partage fichiers, notifications
- Release : Q2 2025

#### **CalendarComingSoon** (`src/pages/coming-soon/CalendarComingSoon.tsx`)
- Module : Calendrier bien-être
- Fonctionnalités : Vue calendrier, planification séances, rappels, sync externe
- Release : Q2 2025

#### **Point20ComingSoon** (`src/pages/coming-soon/Point20ComingSoon.tsx`)
- Module : Check-ins émotionnels rapides
- Fonctionnalités : Check-ins 20s, suivi temps réel, tendances, alertes
- Release : Q3 2025

### 3. Pages Légales

#### **LegalPage** (`src/pages/legal/LegalPage.tsx`)
Hub central avec 3 sections :
- CGU (Conditions Générales d'Utilisation)
- Politique de Confidentialité
- Mentions Légales (éditeur, hébergement, contact, propriété intellectuelle)

#### **TermsPage** (`src/pages/legal/TermsPage.tsx`)
Contenu :
- Objet et acceptation des conditions
- Services proposés (liste exhaustive modules)
- Inscription et compte utilisateur
- Protection des données (référence RGPD)
- Utilisation acceptable
- Propriété intellectuelle
- Limitation de responsabilité ⚠️ **Disclaimer médical important**
- Modifications des CGU
- Contact legal

#### **PrivacyPage** (`src/pages/legal/PrivacyPage.tsx`)
Contenu RGPD-compliant :
- Données collectées (identification, santé, techniques)
- Utilisation des données
- Protection des données de santé (chiffrement, hébergement EU)
- Vos droits (accès, rectification, effacement, portabilité, opposition)
- Cookies et traceurs
- Partage des données (Supabase, OpenAI)
- Durée de conservation
- Sécurité (mesures techniques)
- Mineurs (15+ ans, consentement parental)
- Contact DPO + CNIL

### 4. Export centralisé

**Fichier** : `src/pages/index.ts`
- Export des 3 pages Coming Soon
- Export des 3 pages Legal
- Facilite les imports : `import { MessagesComingSoon } from '@/pages';`

---

## 🗺️ Architecture de Navigation

### Routes implémentées

| Route | Composant | Description |
|-------|-----------|-------------|
| `/messages` | `MessagesComingSoon` | Module messages (coming soon) |
| `/calendar` | `CalendarComingSoon` | Module calendrier (coming soon) |
| `/point20` | `Point20ComingSoon` | Module point20 (coming soon) |
| `/legal` | `LegalPage` | Hub mentions légales |
| `/legal/terms` | `TermsPage` | CGU |
| `/legal/privacy` | `PrivacyPage` | Confidentialité |

### Navigation cleanup à faire

**Prochaines actions** (référence `ROUTING_CONSOLIDATION_PLAN.md`) :
- [ ] Mapper routes Coming Soon dans `routerV2/registry.ts`
- [ ] Mapper routes Legal dans `routerV2/registry.ts`
- [ ] Activer RouterV2 dans `App.tsx` (remplacer Router basique)
- [ ] Ajouter guards (AuthGuard pour `/messages`, `/calendar`, `/point20`)
- [ ] Supprimer routes obsolètes (si détectées)
- [ ] Vérifier liens morts (via ESLint `ec/no-legacy-routes-helpers`)

---

## 🎨 Design System

**Composants shadcn utilisés** :
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`
- `Button` (variants: default, outline, ghost)
- `Badge` (variant: secondary)
- Icons Lucide : `ArrowLeft`, `Calendar`, `Bell`, `Shield`, `FileText`, `Scale`, `MessageCircle`, `Target`

**Tokens sémantiques** :
- `text-foreground`, `text-muted-foreground`
- `bg-background`, `bg-secondary/10`
- `text-primary`, `border-primary`
- Transitions smooth via classes Tailwind

---

## 📋 Standards respectés

### Accessibilité (a11y)
- ✅ Titres hiérarchisés (h1, h2, h3)
- ✅ Boutons avec labels explicites
- ✅ Contraste AA WCAG 2.1
- ✅ Navigation clavier

### Performance
- ✅ Lazy loading possible (React.lazy)
- ✅ Pas d'images lourdes (icons SVG uniquement)
- ✅ Prose Tailwind pour typographie légale

### SEO
- ✅ Balises `<title>` à ajouter (via React Helmet Async)
- ✅ Meta descriptions à ajouter
- ✅ Contenu textuel riche (pages légales)

### Code quality
- ✅ JSDoc sur tous les composants
- ✅ TypeScript strict
- ✅ Props typées
- ✅ Pas de `any`

---

## 🚀 Améliorations futures

### Court terme
- [ ] Ajouter React Helmet pour SEO (title, meta)
- [ ] Implémenter système de notifications (bouton "Me prévenir")
- [ ] Ajouter breadcrumbs sur pages légales
- [ ] Version PDF téléchargeable des CGU/Privacy

### Moyen terme
- [ ] Footer global avec liens légaux
- [ ] Sitemap XML auto-généré
- [ ] Internationalisation (i18n) pages légales
- [ ] Dark mode optimisé (prose-invert déjà présent)

### Long terme
- [ ] Consentement cookies (banner RGPD)
- [ ] Préférences confidentialité dans profil
- [ ] Export données utilisateur (droit portabilité)
- [ ] Versioning CGU (historique des modifications)

---

## 🧪 Tests

### Tests à écrire
```typescript
// src/components/coming-soon/__tests__/ComingSoon.test.tsx
describe('ComingSoon', () => {
  it('affiche le nom du module', () => { /* ... */ });
  it('affiche les fonctionnalités', () => { /* ... */ });
  it('affiche la date estimée si fournie', () => { /* ... */ });
  it('navigation retour au dashboard', () => { /* ... */ });
  it('bouton Me prévenir si notifyEnabled', () => { /* ... */ });
});

// src/pages/legal/__tests__/TermsPage.test.tsx
describe('TermsPage', () => {
  it('affiche toutes les sections CGU', () => { /* ... */ });
  it('navigation retour fonctionne', () => { /* ... */ });
});
```

---

## 📚 Références

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [RGPD - CNIL](https://www.cnil.fr/fr/reglement-europeen-protection-donnees)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Router v6](https://reactrouter.com/en/main)

---

## ✅ Checklist Phase 5 - Jour 9-10

- [x] Composant ComingSoon réutilisable
- [x] Page MessagesComingSoon
- [x] Page CalendarComingSoon
- [x] Page Point20ComingSoon
- [x] Page LegalPage (hub)
- [x] Page TermsPage (CGU)
- [x] Page PrivacyPage (RGPD)
- [x] Export centralisé (`src/pages/index.ts`)
- [x] Documentation complète
- [ ] Mapping routes dans RouterV2 (J11+ ou après Ambition Arcade)
- [ ] Tests unitaires (à faire)
- [ ] SEO (React Helmet)
- [ ] Footer global avec liens légaux

---

**Status** : Pages Coming Soon + Legal 100% complètes ✅  
**Prochaine étape** : Mapping RouterV2 OU continuer roadmap modules restants
