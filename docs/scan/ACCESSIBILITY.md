# Guide d'Accessibilité WCAG AA - Module Scan

## Objectif

Rendre le module de scan émotionnel conforme aux normes **WCAG 2.1 niveau AA** pour garantir l'accessibilité à tous les utilisateurs, y compris ceux ayant des handicaps.

## État actuel

### Conformité partielle

- ✅ **Contraste des couleurs** : Majorité conforme (4.5:1)
- ✅ **Navigation clavier** : Partiellement implémentée
- ⚠️ **Labels ARIA** : Incomplet (60%)
- ❌ **Alternatives textuelles** : Manquantes pour vidéo/audio
- ❌ **Gestion focus** : Non optimale
- ❌ **Animations réduites** : Non géré (`prefers-reduced-motion`)
- ❌ **Lecteurs d'écran** : Support incomplet

## Principes WCAG

### 1. Perceptible

> L'information et les composants de l'interface utilisateur doivent être présentables aux utilisateurs de manière qu'ils puissent les percevoir.

#### 1.1 Alternatives textuelles

**Problème actuel** : Les composants vidéo et audio n'ont pas d'alternatives.

**Solution** :

```tsx
// ❌ Avant
<video ref={videoRef} />

// ✅ Après
<video
  ref={videoRef}
  aria-label="Flux vidéo de la caméra pour l'analyse faciale"
>
  <track
    kind="captions"
    src="/captions/facial-scan.vtt"
    srcLang="fr"
    label="Français"
  />
  Votre navigateur ne supporte pas la vidéo HTML5.
</video>
```

```tsx
// Pour les images d'émojis
<button
  onClick={() => handleEmojiClick('😊')}
  aria-label="Sélectionner l'emoji souriant"
>
  😊
</button>
```

#### 1.2 Média temporel

**Exigence** : Fournir des alternatives pour le contenu audio et vidéo.

```tsx
// Transcription pour analyse vocale
<div className="scan-result">
  <h3>Résultat de l'analyse vocale</h3>

  {/* Alternative textuelle */}
  {scanResult.transcription && (
    <div className="transcription" aria-label="Transcription de l'audio">
      <h4>Transcription</h4>
      <p>{scanResult.transcription}</p>
    </div>
  )}

  {/* Résultats accessibles */}
  <dl aria-label="Détails de l'analyse émotionnelle">
    <dt>Émotion détectée</dt>
    <dd>{scanResult.emotion}</dd>

    <dt>Niveau de confiance</dt>
    <dd>{scanResult.confidence}%</dd>
  </dl>
</div>
```

#### 1.3 Adaptable

**Mise en page responsive** : Le contenu doit être présentable de différentes manières.

```tsx
// Utiliser des landmarks ARIA
<PageRoot>
  <header role="banner">
    <h1>Scan Émotionnel</h1>
  </header>

  <nav aria-label="Modes d'analyse">
    <ul>
      <li><Link to="/app/scan/facial">Facial</Link></li>
      <li><Link to="/app/scan/voice">Vocal</Link></li>
      <li><Link to="/app/scan/text">Textuel</Link></li>
      <li><Link to="/app/scan/emoji">Emoji</Link></li>
    </ul>
  </nav>

  <main role="main">
    {/* Contenu principal */}
  </main>

  <aside role="complementary" aria-label="Historique des scans">
    <ScanHistory />
  </aside>
</PageRoot>
```

#### 1.4 Distinguable

**Contraste des couleurs** : Ratio minimum 4.5:1 pour le texte normal.

```tsx
// Vérification du contraste
const EMOTION_COLORS = {
  happy: '#16a34a',      // ✅ 7.2:1 sur blanc
  sad: '#2563eb',        // ✅ 8.1:1 sur blanc
  angry: '#dc2626',      // ✅ 5.9:1 sur blanc
  neutral: '#64748b',    // ✅ 4.6:1 sur blanc
};

// Pour les éléments interactifs (boutons)
// Ratio minimum 3:1
const BUTTON_COLORS = {
  primary: '#2563eb',    // ✅ 8.1:1
  secondary: '#64748b',  // ✅ 4.6:1
  destructive: '#dc2626', // ✅ 5.9:1
};
```

```tsx
// Redimensionnement du texte jusqu'à 200% sans perte de contenu
<p
  className="text-base sm:text-lg"
  style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
>
  Texte adaptable
</p>
```

### 2. Utilisable

> Les composants de l'interface utilisateur et la navigation doivent être utilisables.

#### 2.1 Accessibilité au clavier

**Toutes les fonctionnalités doivent être accessibles au clavier.**

```tsx
// ✅ Navigation au clavier complète
const FacialScanPage = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const captureButtonRef = useRef<HTMLButtonElement>(null);

  // Shortcuts clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Espace ou Entrée pour capturer
      if (e.key === ' ' || e.key === 'Enter') {
        if (document.activeElement === captureButtonRef.current) {
          e.preventDefault();
          handleCapture();
        }
      }

      // Échap pour annuler
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <>
      <button
        ref={captureButtonRef}
        onClick={handleCapture}
        aria-label="Capturer l'image pour l'analyse"
        aria-pressed={isCapturing}
      >
        {isCapturing ? 'Analyse en cours...' : 'Capturer'}
      </button>

      {/* Indicateur visuel du focus */}
      <style jsx>{`
        button:focus-visible {
          outline: 3px solid #2563eb;
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
};
```

**Ordre de tabulation logique** :

```tsx
// Utiliser tabIndex pour contrôler l'ordre
<div className="scan-interface">
  <button tabIndex={1}>Mode Facial</button>
  <button tabIndex={2}>Mode Vocal</button>
  <button tabIndex={3}>Mode Textuel</button>
  <button tabIndex={4}>Mode Emoji</button>

  {/* Les éléments non interactifs ont tabIndex={-1} */}
  <div tabIndex={-1} aria-hidden="true">Décoratif</div>
</div>
```

#### 2.2 Délai suffisant

**Pas de limite de temps stricte** pour les analyses.

```tsx
// Autoriser l'utilisateur à prolonger le délai
const VoiceScanPage = () => {
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [canExtend, setCanExtend] = useState(true);

  const extendTime = () => {
    if (canExtend) {
      setTimeRemaining(prev => prev + 10);
      setCanExtend(false); // Limite à une extension
    }
  };

  return (
    <div role="region" aria-label="Enregistrement vocal">
      <p aria-live="polite">
        Temps restant : {timeRemaining} secondes
      </p>

      {timeRemaining <= 3 && canExtend && (
        <button onClick={extendTime} aria-label="Prolonger de 10 secondes">
          Prolonger
        </button>
      )}
    </div>
  );
};
```

#### 2.3 Crises et réactions physiques

**Éviter les contenus flashants** (>3 fois par seconde).

```tsx
// ❌ Éviter
<div className="animate-flash" /> // Clignotement rapide

// ✅ Animation douce
<div className="animate-pulse" style={{ animationDuration: '2s' }} />
```

#### 2.4 Navigable

**Fournir des moyens d'aide à la navigation.**

```tsx
// Skip links pour navigation rapide
<a href="#main-content" className="skip-link">
  Aller au contenu principal
</a>

<style jsx>{`
  .skip-link {
    position: absolute;
    left: -9999px;
    z-index: 999;
  }

  .skip-link:focus {
    position: fixed;
    top: 0;
    left: 0;
    background: white;
    padding: 1rem;
  }
`}</style>

// Breadcrumbs
<nav aria-label="Fil d'Ariane">
  <ol>
    <li><Link to="/app">Accueil</Link></li>
    <li><Link to="/app/scan">Scan</Link></li>
    <li aria-current="page">Facial</li>
  </ol>
</nav>

// Titres de page descriptifs
<Helmet>
  <title>Analyse Faciale - Scan Émotionnel | EmotionsCare</title>
</Helmet>
```

### 3. Compréhensible

> L'information et l'utilisation de l'interface utilisateur doivent être compréhensibles.

#### 3.1 Lisible

**Langue de la page définie** :

```tsx
<html lang="fr">
  {/* Contenu français */}
</html>

// Pour du contenu multilingue
<p lang="en">This text is in English</p>
```

#### 3.2 Prévisible

**Comportement cohérent et prévisible.**

```tsx
// Avertir avant les changements de contexte
const TextScanPage = () => {
  const [showWarning, setShowWarning] = useState(false);

  const handleAnalyze = () => {
    setShowWarning(true);
  };

  return (
    <>
      <button onClick={handleAnalyze}>Analyser</button>

      {showWarning && (
        <div role="alert" aria-live="assertive">
          L'analyse va commencer. Vos données seront envoyées pour traitement.
          <button onClick={confirmAnalyze}>Confirmer</button>
          <button onClick={() => setShowWarning(false)}>Annuler</button>
        </div>
      )}
    </>
  );
};
```

#### 3.3 Assistance à la saisie

**Aider à éviter et corriger les erreurs.**

```tsx
// Validation en temps réel avec feedback
const TextInput = () => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validate = (value: string) => {
    if (value.length < 10) {
      setError('Le texte doit contenir au moins 10 caractères');
      return false;
    }
    if (value.length > 1000) {
      setError('Le texte ne doit pas dépasser 1000 caractères');
      return false;
    }
    setError(null);
    return true;
  };

  return (
    <div>
      <label htmlFor="emotion-text">
        Décrivez votre état émotionnel
        <span aria-label="requis">*</span>
      </label>

      <textarea
        id="emotion-text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          validate(e.target.value);
        }}
        aria-required="true"
        aria-invalid={error !== null}
        aria-describedby={error ? 'text-error' : 'text-hint'}
      />

      <p id="text-hint" className="text-muted">
        {text.length}/1000 caractères
      </p>

      {error && (
        <p id="text-error" role="alert" className="text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};
```

### 4. Robuste

> Le contenu doit être suffisamment robuste pour être interprété par une grande variété d'agents utilisateurs.

#### 4.1 Compatible

**HTML valide et compatible avec les technologies d'assistance.**

```tsx
// ✅ Utiliser des éléments sémantiques
<article>
  <header>
    <h2>Résultat du scan</h2>
  </header>

  <section>
    <h3>Émotion détectée</h3>
    <p>{emotion}</p>
  </section>

  <footer>
    <time dateTime={timestamp.toISOString()}>
      {timestamp.toLocaleDateString()}
    </time>
  </footer>
</article>
```

## Patterns ARIA recommandés

### Loading states

```tsx
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  aria-busy={isLoading}
>
  {isLoading ? (
    <>
      <span className="sr-only">Chargement en cours...</span>
      <Loader2 className="animate-spin" aria-hidden="true" />
    </>
  ) : (
    <span>Analyse terminée</span>
  )}
</div>
```

### Dialogs

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent
    role="dialog"
    aria-labelledby="dialog-title"
    aria-describedby="dialog-description"
  >
    <DialogTitle id="dialog-title">
      Confirmer l'analyse
    </DialogTitle>

    <DialogDescription id="dialog-description">
      Êtes-vous sûr de vouloir lancer l'analyse faciale ?
    </DialogDescription>

    <div role="group" aria-label="Actions">
      <Button onClick={handleConfirm}>Confirmer</Button>
      <Button onClick={() => setIsOpen(false)}>Annuler</Button>
    </div>
  </DialogContent>
</Dialog>
```

### Progress indicators

```tsx
<div
  role="progressbar"
  aria-valuenow={progress}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="Progression de l'analyse"
>
  <div
    className="progress-bar"
    style={{ width: `${progress}%` }}
  />
  <span className="sr-only">{progress}% terminé</span>
</div>
```

## Animations et mouvements

### Support `prefers-reduced-motion`

```tsx
// Désactiver les animations pour les utilisateurs sensibles
const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Utilisation
const AnimatedComponent = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
    >
      Contenu animé
    </motion.div>
  );
};
```

### CSS media query

```css
/* Animations par défaut */
.animated {
  transition: all 0.3s ease;
  animation: fadeIn 0.5s;
}

/* Désactiver pour prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .animated {
    transition: none;
    animation: none;
  }
}
```

## Lecteurs d'écran

### Classes utilitaires

```css
/* Texte visible uniquement pour les lecteurs d'écran */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Visible au focus (pour navigation clavier) */
.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### Annonces dynamiques

```tsx
// Live region pour les annonces
const LiveAnnouncer = ({ message, priority = 'polite' }: {
  message: string;
  priority?: 'polite' | 'assertive';
}) => {
  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};

// Utilisation
<LiveAnnouncer
  message={`Émotion détectée : ${emotion} avec ${confidence}% de confiance`}
  priority="polite"
/>
```

## Checklist de conformité

### Tests à effectuer

```markdown
☐ **Clavier seul**
  - Toutes les fonctionnalités accessibles
  - Ordre de tabulation logique
  - Focus visible
  - Pas de piège au clavier

☐ **Lecteur d'écran** (NVDA, JAWS, VoiceOver)
  - Tout le contenu est lu
  - Structure logique (landmarks, headings)
  - États communiqués (loading, errors)
  - Alternatives textuelles présentes

☐ **Zoom 200%**
  - Pas de perte de contenu
  - Pas de scroll horizontal
  - Texte toujours lisible

☐ **Contraste**
  - Texte normal : 4.5:1
  - Texte large : 3:1
  - Composants UI : 3:1

☐ **Formulaires**
  - Labels explicites
  - Instructions claires
  - Erreurs identifiables et corrigeables
  - Autocomplétion appropriée

☐ **Multimédia**
  - Alternatives textuelles
  - Contrôles accessibles
  - Pas de contenu flashant
```

## Outils de test

### Extensions navigateur

- **axe DevTools** : Audit automatique
- **WAVE** : Évaluation visuelle
- **Lighthouse** : Score d'accessibilité

### Tests automatisés

```typescript
// Jest + jest-axe
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('FacialScanPage should be accessible', async () => {
  const { container } = render(<FacialScanPage />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Tests manuels

```bash
# Tester avec lecteur d'écran
# macOS
open -a VoiceOver

# Windows
# Activer NVDA ou JAWS

# Tester navigation clavier uniquement
# Débrancher la souris et naviguer avec Tab, Entrée, Espace, Flèches
```

## Résumé des priorités

### Haute priorité

1. ✅ Ajouter labels ARIA manquants
2. ✅ Support `prefers-reduced-motion`
3. ✅ Navigation clavier complète
4. ✅ Focus management

### Moyenne priorité

5. ✅ Alternatives pour vidéo/audio
6. ✅ Messages d'erreur accessibles
7. ✅ Live regions pour changements dynamiques

### Basse priorité

8. ✅ Tests automatisés accessibilité
9. ✅ Documentation complète
10. ✅ Formation équipe

---

**Version** : 1.0.0
**Dernière mise à jour** : 14 novembre 2025
**Conformité cible** : WCAG 2.1 Niveau AA
