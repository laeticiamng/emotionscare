# Guide de Migration Rapide - Système de Scan

## 🚀 Guide Express (5 minutes)

### Étape 1: Ajouter le ScanProvider

```tsx
// src/App.tsx ou votre root component
import { ScanProvider } from '@/contexts/ScanContext';

function App() {
  return (
    <ScanProvider maxHistorySize={100}>
      {/* Votre app */}
    </ScanProvider>
  );
}
```

### Étape 2: Mettre à jour les imports dupliqués

Si vous utilisez ces fichiers, changez les imports:

```tsx
// ❌ Ancien
import { LiveVoiceScanner } from '@/components/scan/LiveVoiceScanner';
import { AudioProcessor } from '@/components/scan/AudioProcessor';

// ✅ Nouveau
import { LiveVoiceScanner } from '@/components/scan/live/LiveVoiceScanner';
import { AudioProcessor } from '@/components/scan/live/AudioProcessor';
```

### Étape 3: Utiliser les types unifiés

```tsx
// ❌ Ancien
import { EmotionResult } from '@/types/emotion';

// ✅ Nouveau
import { EmotionResult } from '@/types/emotion-unified';
```

### Étape 4: Envelopper les composants de scan

```tsx
import { ScanErrorBoundary } from '@/components/scan/ScanErrorBoundary';

function MyPage() {
  return (
    <ScanErrorBoundary>
      <EmotionScanner />
    </ScanErrorBoundary>
  );
}
```

---

## 📋 Checklist de Migration par Composant

### Pour chaque composant de scan existant:

- [ ] **Imports**
  - [ ] Changer vers `emotion-unified` pour les types
  - [ ] Utiliser `/live/` pour LiveVoiceScanner et AudioProcessor
  - [ ] Importer `useScanContext` si nécessaire

- [ ] **Gestion d'état**
  - [ ] Remplacer `useState` local par `useScanContext()`
  - [ ] Appeler `startScan()` au début
  - [ ] Appeler `completeScan()` à la fin

- [ ] **Gestion d'erreurs**
  - [ ] Remplacer les `try/catch` vides par `useRetry`
  - [ ] Envelopper dans `<ScanErrorBoundary>`
  - [ ] Afficher les messages d'erreur à l'utilisateur

- [ ] **Conversion de données**
  - [ ] Utiliser les converters (`humeToEmotionResult`, etc.)
  - [ ] Normaliser les résultats avec `normalizeEmotionResult`

- [ ] **Accessibilité**
  - [ ] Ajouter `aria-label` sur les boutons
  - [ ] Ajouter `aria-live` pour les updates dynamiques
  - [ ] Tester la navigation au clavier

---

## 🔧 Patterns de Migration

### Pattern 1: Scanner Simple avec État Local

**Avant:**

```tsx
function SimpleScanner() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const scan = async () => {
    setLoading(true);
    const data = await fetchScan();
    setResult(data);
    setLoading(false);
  };

  return <button onClick={scan}>Scan</button>;
}
```

**Après:**

```tsx
import { useScanContext } from '@/contexts/ScanContext';
import { useRetry } from '@/hooks/useRetry';

function SimpleScanner() {
  const { startScan, completeScan, currentScan, isScanning } = useScanContext();

  const { execute, error } = useRetry(async () => {
    await startScan({ mode: 'facial', duration: 3000 });
    const data = await fetchScan();
    completeScan(data);
  });

  return (
    <>
      <button onClick={execute} disabled={isScanning}>
        {isScanning ? 'Scan en cours...' : 'Démarrer'}
      </button>
      {error && <ErrorMessage error={error} />}
      {currentScan && <ResultDisplay result={currentScan} />}
    </>
  );
}
```

### Pattern 2: Scanner avec API Hume

**Avant:**

```tsx
function HumeScanner() {
  const scan = async (imageData) => {
    const response = await supabase.functions.invoke('hume-analyze', {
      body: { image: imageData }
    });
    // Traitement manuel...
  };
}
```

**Après:**

```tsx
import { useRetry } from '@/hooks/useRetry';
import { humeToEmotionResult } from '@/lib/scan/emotionConverters';

function HumeScanner() {
  const { execute, data, error } = useRetry(
    async (imageData) => {
      const response = await supabase.functions.invoke('hume-analyze', {
        body: { image: imageData }
      });

      // Conversion automatique
      return humeToEmotionResult(response.data);
    },
    { maxRetries: 3, backoff: 'exponential' }
  );

  return <ScannerUI onCapture={execute} result={data} error={error} />;
}
```

### Pattern 3: Scanner Multimodal

**Avant:**

```tsx
function MultimodalScanner() {
  const [facialResult, setFacialResult] = useState(null);
  const [voiceResult, setVoiceResult] = useState(null);
  // Logique de fusion manuelle...
}
```

**Après:**

```tsx
import { mergeEmotionResults } from '@/lib/scan/emotionConverters';

function MultimodalScanner() {
  const { completeScan } = useScanContext();

  const scanAll = async () => {
    const [facial, voice] = await Promise.all([
      scanFacial(),
      scanVoice()
    ]);

    // Fusion automatique avec poids
    const merged = mergeEmotionResults(
      [facial, voice],
      [0.6, 0.4] // 60% facial, 40% voice
    );

    completeScan(merged);
  };

  return <button onClick={scanAll}>Scan Complet</button>;
}
```

---

## 🐛 Problèmes Courants et Solutions

### Problème 1: Types incompatibles

**Erreur:**
```
Type 'number' is not assignable to type 'ConfidenceLevel | number'
```

**Solution:**
```tsx
// ❌ Avant
const confidence = result.confidence.overall; // Crash si confidence est number

// ✅ Après
const confidence = typeof result.confidence === 'number'
  ? result.confidence
  : result.confidence.overall;
```

### Problème 2: Context non disponible

**Erreur:**
```
Error: useScanContext must be used within a ScanProvider
```

**Solution:**
```tsx
// Ajouter ScanProvider dans votre root component
// OU utiliser le hook optionnel
import { useScanContextOptional } from '@/contexts/ScanContext';

const context = useScanContextOptional();
if (!context) {
  // Fallback si pas de provider
  return <div>Context non disponible</div>;
}
```

### Problème 3: Conversions d'anciennes données

**Problème:** Vous avez des données existantes dans un ancien format

**Solution:**
```tsx
import { legacyToEmotionResult } from '@/lib/scan/emotionConverters';

// Convertir automatiquement
const oldData = fetchOldData();
const normalized = legacyToEmotionResult(oldData);

// Maintenant compatible avec tous les nouveaux composants
```

---

## ✅ Tests de Migration

Après migration d'un composant, vérifiez:

### Fonctionnel
- [ ] Le scan démarre correctement
- [ ] La progression s'affiche
- [ ] Le résultat s'affiche correctement
- [ ] Les erreurs sont gérées (tester en coupant le réseau)
- [ ] Le retry fonctionne

### Accessibilité
- [ ] Navigation au clavier (Tab, Enter, Esc)
- [ ] Screen reader annonce les changements
- [ ] Focus visible sur tous les éléments interactifs
- [ ] Contraste des couleurs suffisant

### Performance
- [ ] Pas de re-renders inutiles
- [ ] Pas de memory leaks (tester en répétant l'action)
- [ ] Temps de chargement acceptable

### TypeScript
- [ ] Aucune erreur TypeScript
- [ ] Pas de `@ts-ignore` ou `@ts-nocheck`
- [ ] Autocomplétion fonctionne

---

## 📊 Tracking de Migration

Utilisez ce tableau pour tracker les composants migrés:

| Composant | État | Priorité | Notes |
|-----------|------|----------|-------|
| EmotionScanner | ⏳ À faire | 🔴 Haute | Utilisé partout |
| FacialEmotionScanner | ⏳ À faire | 🔴 Haute | Critique |
| VoiceEmotionScanner | ⏳ À faire | 🟠 Moyenne | Mocks à supprimer |
| TextEmotionScanner | ⏳ À faire | 🟠 Moyenne | Mocks à supprimer |
| EmotionScanEnhanced | ⏳ À faire | 🟠 Moyenne | Composant large |
| SamSliders | ✅ Complet | - | Déjà bien fait |
| CameraSampler | ✅ Complet | - | Déjà bien fait |
| UnifiedEmotionCheckin | ✅ Complet | - | Simple et efficace |

**Légende:**
- ✅ Migré et testé
- ⏳ En attente
- 🚧 En cours
- ❌ Problématique

---

## 🆘 Besoin d'Aide?

### Ressources
- [Documentation complète](./SCAN_IMPROVEMENTS.md)
- [Types unifiés](/src/types/emotion-unified.ts)
- [Exemples de code](/src/contexts/ScanContext.tsx)

### Questions fréquentes

**Q: Dois-je migrer tous les composants en même temps?**
A: Non, migrez progressivement. Commencez par les composants critiques.

**Q: Les anciens composants continueront-ils de fonctionner?**
A: Oui, mais ils ne bénéficieront pas des nouvelles features (retry, context, etc.)

**Q: Que faire avec les @ts-nocheck existants?**
A: Supprimez-les progressivement en corrigeant les erreurs TypeScript qui apparaissent.

**Q: Comment tester la migration?**
A: Utilisez la checklist ci-dessus et testez manuellement chaque fonctionnalité.

---

**Dernière mise à jour:** 2025-11-14
**Version:** 1.0.0
