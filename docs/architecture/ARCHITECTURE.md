# 📐 Architecture EmotionsCare

## 🎯 Vue d'ensemble

EmotionsCare est une plateforme de bien-être émotionnel combinant :
- **Modules digitaux** : Scan émotionnel, journal, musique thérapeutique, respiration
- **E-commerce** : Boutique Shopify avec produits physiques et digitaux premium
- **Double cible** : B2C (particuliers) et B2B (entreprises)

---

## 🗺️ Structure des routes

### Routes publiques
- `/` - **HomePage** : Salle des cartes vivantes (dashboard immersif avec tirage hebdomadaire)
- `/store` - **StorePage** : Boutique e-commerce Shopify
- `/store/product/:handle` - **ProductDetailPage** : Détail produit

### Routes B2C (particuliers) - `/app/*`
- `/app/dashboard` - **B2CDashboardPage** : Dashboard classique avec stats et widgets
- `/app/scan` - Scanner émotionnel (analyse faciale)
- `/app/journal` - Journal émotionnel
- `/app/music` - Musique thérapeutique adaptative
- `/app/breath` - Exercices de respiration guidée
- `/app/coach` - Coach IA (Nyvée)

### Routes B2B (entreprises) - `/b2b/*`
- `/b2b/dashboard` - Dashboard RH
- `/b2b/teams` - Gestion des équipes
- `/b2b/reports` - Rapports et analytics

---

## 🧩 Composants clés

### Navigation
- **`GlobalHeader`** : Header unifié sur toutes les pages
  - Logo EmotionsCare
  - Menu principal : Dashboard, Scan, Journal, Musique, Boutique
  - Panier (CartDrawer)
  - Profil utilisateur
  - Responsive avec navigation mobile

### E-commerce
- **`CartDrawer`** : Panier latéral avec gestion Zustand
- **`StorePage`** : Grille de produits Shopify
- **`ProductDetailPage`** : Fiche produit détaillée
- **`useCartStore`** : Store Zustand pour l'état du panier (localStorage persistant)

### Utilitaires
- **`formatPrice()`** : Formatage des prix avec symboles de devise
- **`createStorefrontCheckout()`** : Création de checkout via Storefront API

---

## 🎨 Design System

### Tokens sémantiques (HSL)
Définis dans `src/index.css` et `tailwind.config.ts` :

```css
--primary: 221.2 83.2% 53.3%      /* Bleu principal */
--secondary: 210 40% 96%           /* Gris clair */
--accent: 210 40% 96%              /* Accent */
--success: HSL valeur              /* Vert */
--warning: HSL valeur              /* Orange */
--error: HSL valeur                /* Rouge */
--info: HSL valeur                 /* Bleu info */
```

### Animations
- Utilisation de `framer-motion` pour les transitions fluides
- Respect de `prefers-reduced-motion`

---

## 💾 État global

### Zustand Stores
- **`useCartStore`** : Gestion du panier Shopify
  - `items[]` : Articles dans le panier
  - `addItem()`, `updateQuantity()`, `removeItem()`
  - `createCheckout()` : Génère l'URL de checkout Shopify

### Context
- **`DashboardStore`** : État du dashboard (tone, signals)
- **`RootProvider`** : Provider racine de l'app

---

## 🛒 Intégration Shopify

### Configuration
```typescript
// src/lib/shopify.ts
const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = 'emotions-care-fie94.myshopify.com';
const SHOPIFY_STOREFRONT_TOKEN = '6406b03d31d8714e59f5fda69a1ee568';
```

### Flux de checkout
1. Utilisateur ajoute produit au panier → `addItem()`
2. Panier persiste dans localStorage (Zustand)
3. Clic "Payer" → `createStorefrontCheckout(items)`
4. Génération URL Shopify avec `?channel=online_store`
5. Ouverture dans nouvel onglet → `window.open(checkoutUrl, '_blank')`

### Produits créés
12 produits premium (197€ à 1497€) :
- Formations (Gestion Émotionnelle, Masterclass Méditation)
- Abonnements (Premium 1 an, VIP Lifetime)
- Services (Coaching 10 séances, Bilan émotionnel)
- Physiques (Masque sommeil, Carnet premium, E-books)

---

## 📦 Modules principaux

### Scan émotionnel
- Analyse faciale temps réel (MediaPipe)
- Détection de 7 émotions basiques

### Journal
- Entrées vocales et textuelles
- Analyse de sentiment avec NLP

### Musique thérapeutique
- Génération adaptative via Suno API
- Presets basés sur l'humeur

### Respiration
- Exercices guidés (4-7-8, box breathing)
- Visualisations immersives

---

## 🔐 Sécurité & Database

### Supabase
- **Auth** : Authentification utilisateurs
- **RLS** : Politiques de sécurité par table
- **Edge Functions** : `shopify-webhook` pour activation automatique modules

### Migrations
Tables principales :
- `shopify_purchases` : Historique des achats
- `product_module_mapping` : Liaison produits ↔ modules
- `user_activated_modules` : Modules débloqués par utilisateur

---

## 🚀 Déploiement

### Build
```bash
npm run build
```

### Variables d'environnement
```env
VITE_SUPABASE_PROJECT_ID=yaincoxihiqdksxgrsrk
VITE_SUPABASE_PUBLISHABLE_KEY=***
VITE_SUPABASE_URL=https://yaincoxihiqdksxgrsrk.supabase.co
```

---

## 📝 Conventions de code

### Fichiers
- Composants : `PascalCase.tsx`
- Utilitaires : `kebab-case.ts`
- Pages : `PascalCase.tsx`

### Imports
```typescript
// 1. React & libs
import React from 'react';
import { motion } from 'framer-motion';

// 2. Components UI
import { Button } from '@/components/ui/button';

// 3. Features & hooks
import { useCartStore } from '@/stores/cartStore';

// 4. Types & utils
import type { ShopifyProduct } from '@/types/shopify';
```

### CSS
- **Toujours** utiliser les tokens sémantiques
- Pas de couleurs hardcodées (`text-white` ❌ → `text-foreground` ✅)
- Utiliser `hsl(var(--primary))` pour les couleurs

---

## 🎯 Roadmap

### Phase 1 ✅
- [x] Setup Shopify Storefront API
- [x] Création de 12 produits premium
- [x] Navigation globale unifiée
- [x] Formatage des prix
- [x] Intégration boutique sur HomePage

### Phase 2 🚧
- [ ] Génération images produits (AI)
- [ ] Webhook Shopify → activation modules
- [ ] Tests E2E du flux checkout
- [ ] Optimisation mobile

### Phase 3 📋
- [ ] Système de reviews produits
- [ ] Recommandations personnalisées
- [ ] Cross-selling intelligent
- [ ] Programme de fidélité

---

## 📚 Documentation

### Liens utiles
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Framer Motion](https://www.framer.com/motion/)
- [Supabase Docs](https://supabase.com/docs)

---

**Dernière mise à jour** : 2025-11-04  
**Maintainers** : EmotionsCare Team
