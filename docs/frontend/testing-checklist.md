
# Checklist de tests - EmotionsCare 1.0

## 🧪 Tests par type de composant

### Components Glow Experiences

#### FlashGlow Component
- [ ] **Fonctionnel**: Défi de respiration démarre et se termine
- [ ] **API**: POST /metrics/flash_glow envoie ΔRMSSD et PANAS-PA
- [ ] **A11y**: Animation max 3s, bouton skip accessible
- [ ] **Responsive**: Fonctionne sur mobile et desktop
- [ ] **Performance**: Pas de memory leaks sur animation

```typescript
// Test template
describe('FlashGlow', () => {
  it('should complete breathing challenge', async () => {
    const mockApi = jest.fn();
    render(<FlashGlow onComplete={mockApi} />);
    
    const startButton = screen.getByRole('button', { name: /commencer/i });
    await user.click(startButton);
    
    // Attendre fin animation
    await waitFor(() => {
      expect(mockApi).toHaveBeenCalledWith({
        delta_rmssd: expect.any(Number),
        panas_pa: expect.any(Number)
      });
    }, { timeout: 4000 });
  });

  it('should be accessible', async () => {
    const { container } = render(<FlashGlow />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

#### FaceFilterAR Component  
- [ ] **Camera**: Demande permission caméra
- [ ] **Fallback**: Mode no-cam avec description TTS
- [ ] **API**: POST /metrics/face_filter retourne Affect Balance
- [ ] **A11y**: Alternatives textuelles pour AR
- [ ] **Privacy**: Respecte privacy prefs cam=false

#### BubbleBeat Component
- [ ] **Bluetooth**: Connexion capteur HR
- [ ] **Simulation**: Mode démo si pas de capteur
- [ ] **API**: GET /me/heart_rate/live
- [ ] **A11y**: role="img" + aria-label BPM
- [ ] **Visual**: Bulles synchronisées avec BPM

#### VRGalaxy Component
- [ ] **WebXR**: Détection support VR
- [ ] **Fallback**: Version HTML5 si pas VR
- [ ] **API**: POST /metrics/vr_galaxy avec Synchrony & Coherence
- [ ] **A11y**: aria-label approprié
- [ ] **Performance**: Rendu 3D optimisé

### Dashboard Components

#### GlowGauge Component
- [ ] **Data**: GET /me/dashboard/weekly score 0-100
- [ ] **Visual**: Jauge SVG responsive
- [ ] **A11y**: role="status", aria-live="polite"
- [ ] **Loading**: État de chargement
- [ ] **Error**: Gestion erreurs API

```typescript
describe('GlowGauge', () => {
  it('should display glow score', async () => {
    mockApiResponse('/me/dashboard/weekly', { glow_score: 75 });
    
    render(<GlowGauge />);
    
    await waitFor(() => {
      expect(screen.getByText('75')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });
  });
});
```

#### WeeklyBars Component
- [ ] **Data**: ΔRMSSD + PANAS-PA sur 7 jours
- [ ] **Chart**: Barres accessibles avec description
- [ ] **A11y**: aria-describedby="history-chart"
- [ ] **Responsive**: Adaptation mobile
- [ ] **Interaction**: Navigation clavier sur barres

### Privacy Components

#### PrivacyToggle Component
- [ ] **Switches**: 6 toggles (cam, mic, hr, gps, social, nft)
- [ ] **API**: PATCH /me/privacy_prefs
- [ ] **A11y**: role="switch", états annoncés
- [ ] **Persistence**: Sauvegarde immédiate
- [ ] **Feedback**: Toast confirmation

#### DataExport Component
- [ ] **Job Creation**: POST /me/export → job_id
- [ ] **Polling**: GET /me/export/{job_id} jusqu'à completion
- [ ] **Download**: Lien téléchargement sécurisé
- [ ] **Verification**: Fichier non vide
- [ ] **UX**: Indicateur progression

#### AccountDeletion Component
- [ ] **Warning**: Modal confirmation claire
- [ ] **API**: POST /me/delete déclenche countdown
- [ ] **Status**: GET /me/delete/status info suppression
- [ ] **UX**: Countdown visible 30 jours
- [ ] **Security**: Double confirmation

## 🔄 Tests d'intégration

### User Journey Tests

#### Parcours B2C complet
```typescript
describe('B2C User Journey', () => {
  it('should complete full wellness journey', async () => {
    // 1. Login
    await loginAsB2CUser();
    
    // 2. Privacy setup  
    await setupPrivacyPreferences({ cam: true, mic: true });
    
    // 3. Flash Glow challenge
    await completeFlashGlow();
    
    // 4. View dashboard
    await checkDashboardMetrics();
    
    // 5. Journal entry
    await createJournalEntry();
    
    // 6. Music therapy
    await startMusicSession();
    
    // Vérifier cohérence données
    expect(await getDashboardScore()).toBeGreaterThan(0);
  });
});
```

#### Parcours B2B Admin
```typescript
describe('B2B Admin Journey', () => {
  it('should access org dashboard', async () => {
    await loginAsB2BAdmin();
    
    const orgDashboard = await screen.findByRole('main');
    expect(orgDashboard).toContainElement(
      screen.getByText(/heatmap vibes/i)
    );
    
    // Vérifier données anonymisées (min 5 users)
    const heatmapData = await getHeatmapData();
    expect(heatmapData.length).toBeGreaterThanOrEqual(5);
  });
});
```

## 📊 Tests de performance

### Benchmarks à respecter
- **Bundle size**: < 500kb gzipped
- **First paint**: < 1.5s 
- **TTI**: <3.5s
- **Memory usage**: < 50MB peak

### Tests automatisés
```typescript
describe('Performance', () => {
  it('should load dashboard within performance budget', async () => {
    const startTime = performance.now();
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
    
    const loadTime = performance.now() - startTime;
    expect(loadTime).toBeLessThan(1500); // < 1.5s
  });

  it('should not have memory leaks on navigation', async () => {
    const initialMemory = performance.memory?.usedJSHeapSize || 0;
    
    // Simulate navigation
    for (let i = 0; i < 10; i++) {
      render(<Dashboard />);
      cleanup();
    }
    
    const finalMemory = performance.memory?.usedJSHeapSize || 0;
    const memoryGrowth = finalMemory - initialMemory;
    
    expect(memoryGrowth).toBeLessThan(10 * 1024 * 1024); // < 10MB growth
  });
});
```

## 🌐 Tests cross-browser

### Configuration Playwright
```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
});
```

### Tests critiques cross-browser
```typescript
test.describe('Cross-browser compatibility', () => {
  test('Flash Glow works on all browsers', async ({ page, browserName }) => {
    await page.goto('/glow/flash');
    
    const startButton = page.getByRole('button', { name: /commencer/i });
    await startButton.click();
    
    // Attendre animation (timeout adapté par navigateur)
    const timeout = browserName === 'webkit' ? 5000 : 3000;
    await expect(page.getByText(/terminé/i)).toBeVisible({ timeout });
  });
});
```

## ✅ Checklist pre-production

### Code Quality
- [ ] ESLint: 0 erreurs, 0 warnings
- [ ] TypeScript: Compilation sans erreurs
- [ ] Tests: Coverage > 80%
- [ ] Bundle analyzer: Pas de duplicates

### Accessibility  
- [ ] axe-core: 0 violations
- [ ] Lighthouse a11y: Score > 95
- [ ] Manual keyboard testing: OK
- [ ] Screen reader testing: OK

### Performance
- [ ] Lighthouse performance: Score > 90
- [ ] Core Web Vitals: Tous verts
- [ ] Memory leaks: Vérifiés
- [ ] Network requests: Optimisées

### Security
- [ ] Pas de données sensibles en localStorage
- [ ] CSP headers configurés
- [ ] HTTPS forcé
- [ ] API tokens sécurisés

### Browser Support
- [ ] Chrome 90+: ✅
- [ ] Firefox 88+: ✅
- [ ] Safari 14+: ✅
- [ ] Edge 90+: ✅

### Mobile/Responsive
- [ ] iPhone SE (375px): ✅
- [ ] iPad (768px): ✅
- [ ] Desktop (1920px): ✅
- [ ] Touch interactions: ✅

### Final Validation
```bash
# Script de validation finale
npm run validate:production

# Incluant:
# - npm run lint
# - npm run type-check  
# - npm run test:coverage
# - npm run test:a11y
# - npm run test:e2e
# - npm run build
# - npm run analyze
```
