# 🧱 Registre UI & composants partagés

Le fichier `src/COMPONENTS.reg.ts` centralise les exports UI (composants purs, hooks UI, providers transverses). Ce guide explique comment le maintenir.

## 🎯 Objectifs
- Fournir un import unique pour les écrans marketing & app (`import { Button } from '@/COMPONENTS.reg'`).
- Garantir que seuls des éléments « UI pur » (pas de logique métier) y figurent.
- Générer automatiquement la documentation (`docs/UI_COMPONENTS_REGISTRY.md`).

## 🗂️ Structure actuelle
- Les exports sont groupés par famille :
  - **UI shadcn** (`Button`, `Card`, `Input`, `Textarea`, etc.).
  - **Animation** (`FadeIn`, `SlideIn`).
  - **Thème & i18n** (`ThemeProvider`, `useTheme`, `I18nProvider`, `t`).
  - **Hooks UI** (`usePrefetchOnHover`, `usePulseClock`, `useRaf`, `useTimer`).
  - **Feature flags** (`flagActive`, `inCohort`, etc.).
  - **Composants marketing** (`PageHeader`, `NavBar`, `Footer`, `GlowSurface`, `CookieConsent`).

## 🛠️ Génération du registre documentaire
1. Mettre à jour `src/COMPONENTS.reg.ts` (ajout/suppression d'exports).
2. Exécuter `npm run generate:ui-registry`.
3. Le script :
   - Analyse les exports.
   - Catégorise (`Composant UI`, `Hook`, `Provider`, etc.).
   - Génère `docs/UI_COMPONENTS_REGISTRY.md` (statistiques + tableau).
4. Committer **le fichier TS et le markdown généré**.

## ✅ Règles à respecter
- Pas d'exports métiers (ex: `useJournalStore`, `createSession`). Garder uniquement UI, theme, i18n, flags.
- Préférer les chemins relatifs à partir de `src/` (`@/` résout via Vite).
- Pour tout nouveau composant UI partagé :
  - Ajouter un export dans `src/components/ui/<component>.tsx`.
  - L'exposer via le registre (`COMPONENTS.reg.ts`).
  - Mettre à jour `docs/COMPONENTS_GUIDE.md` si une nouvelle catégorie apparaît.
- Pour retirer un composant, vérifier qu'aucune page ne l'importe encore (grep repo) avant suppression.

## 🔍 Exemple d'utilisation
```ts
import { Button, ThemeProvider, usePrefetchOnHover } from '@/COMPONENTS.reg';

function CTA() {
  usePrefetchOnHover('/signup');
  return (
    <ThemeProvider>
      <Button variant="primary">Commencer</Button>
    </ThemeProvider>
  );
}
```

## 📌 Checklist
- [ ] L'export est purement UI (pas de requête réseau, pas de store métier).
- [ ] `npm run generate:ui-registry` exécuté après modification.
- [ ] `docs/UI_COMPONENTS_REGISTRY.md` commit avec la mise à jour.

> _Pour un composant spécifique à une feature (Flash Glow, VR…), ne pas l'ajouter au registre global. Restez sur des imports locaux pour éviter de gonfler le bundle partagé._
