# 🧪 Guide d'Exécution des Tests - EmotionsCare

## ✅ Étape 1 : Installation des Dépendances

```bash
# Installer Playwright et axe-core si pas déjà fait
npm install -D @playwright/test @axe-core/playwright

# Installer les navigateurs nécessaires
npx playwright install

# Vérifier l'installation
npx playwright --version
```

## 🚀 Étape 2 : Lancer le Serveur de Développement

Dans un terminal séparé :

```bash
npm run dev
```

Attendre que le serveur démarre sur `http://localhost:5173`

## 🧪 Étape 3 : Exécuter les Tests E2E

### Option A : Tous les tests E2E (Recommandé)
```bash
npm run test:e2e
```

### Option B : Tests E2E avec interface visuelle
```bash
npx playwright test --ui
```

### Option C : Test GDPRMonitoringPage uniquement
```bash
npx playwright test tests/e2e/gdpr-monitoring.spec.ts
```

### Option D : Tests d'accessibilité uniquement
```bash
npx playwright test tests/e2e/gdpr-monitoring.spec.ts -g "accessibilité"
```

## 🔗 Étape 4 : Exécuter les Tests d'Intégration

### Tests Edge Functions RGPD
```bash
npx playwright test tests/integration/edge-functions-rgpd.spec.ts
```

### Avec logs détaillés
```bash
DEBUG=pw:api npx playwright test tests/integration/edge-functions-rgpd.spec.ts
```

## 📊 Étape 5 : Voir les Résultats

### Rapport HTML
```bash
npx playwright show-report
```

### Résultats dans le terminal
Les résultats s'affichent automatiquement après l'exécution

### Structure du rapport
```
playwright-report/
├── index.html          # Rapport principal
├── trace.zip           # Traces des tests (en cas d'échec)
└── screenshots/        # Screenshots des échecs
```

## 🎯 Tests Spécifiques à GDPRMonitoringPage

### Test 1 : Chargement de la page
```bash
npx playwright test -g "charge sans erreur"
```

### Test 2 : Navigation entre onglets
```bash
npx playwright test -g "onglets sont accessibles"
```

### Test 3 : Aucune erreur 404
```bash
npx playwright test -g "Aucune erreur 404"
```

### Test 4 : Accessibilité WCAG AA
```bash
npx playwright test -g "WCAG AA"
```

### Test 5 : Navigation clavier
```bash
npx playwright test -g "Navigation au clavier"
```

### Test 6 : Responsive
```bash
npx playwright test -g "Responsive"
```

## 📱 Tests Multi-Navigateurs

### Chromium uniquement
```bash
npx playwright test --project=chromium
```

### Firefox uniquement
```bash
npx playwright test --project=firefox
```

### Tous les navigateurs desktop
```bash
npx playwright test --project=chromium --project=firefox --project=webkit
```

### Mobile
```bash
npx playwright test --project="Mobile Chrome" --project="Mobile Safari"
```

## 🐛 Mode Debug

### Debug interactif
```bash
npx playwright test --debug
```

### Debug avec pause
```bash
PWDEBUG=1 npx playwright test tests/e2e/gdpr-monitoring.spec.ts
```

### Ralentir l'exécution (utile pour observer)
```bash
npx playwright test --slow-mo=1000
```

## 📋 Checklist de Validation

Après exécution, vérifier :

### ✅ Tests E2E GDPRMonitoringPage
- [ ] La page charge sans erreur
- [ ] Tous les onglets sont accessibles
- [ ] Aucune erreur 404 réseau
- [ ] Labels ARIA présents
- [ ] Navigation clavier fonctionnelle
- [ ] Contraste couleurs WCAG AA
- [ ] 0 violations accessibilité critiques
- [ ] Formulaires avec labels
- [ ] Images avec alt
- [ ] Structure HTML sémantique
- [ ] Performance < 3s
- [ ] États de chargement accessibles
- [ ] Responsive mobile OK
- [ ] Responsive tablette OK

### ✅ Tests Intégration Edge Functions
- [ ] compliance-audit/latest OK
- [ ] compliance-audit/history OK
- [ ] compliance-audit/run OK
- [ ] gdpr-alert-detector (export) OK
- [ ] gdpr-alert-detector (deletion) OK
- [ ] gdpr-alert-detector validation types OK
- [ ] dsar-handler (create) OK
- [ ] dsar-handler (status) OK
- [ ] dsar-handler (list) OK
- [ ] Scénario complet Audit→Alerte→DSAR OK
- [ ] Performance < 10s par fonction
- [ ] Sécurité : rejet payloads malformés
- [ ] Sécurité : protection injections

## 📈 Métriques Attendues

### Tests E2E
- **Durée totale** : ~2-5 minutes
- **Taux de succès** : 100%
- **Violations accessibilité critiques** : 0
- **Temps de chargement page** : < 3s

### Tests Intégration
- **Durée totale** : ~1-3 minutes
- **Taux de succès** : ≥ 95% (certains tests peuvent nécessiter auth admin)
- **Temps de réponse Edge Functions** : < 10s chacune
- **Performance DSAR** : < 30s

## 🚨 En Cas d'Échec

### Tests E2E échouent
1. Vérifier que le serveur dev tourne (`http://localhost:5173`)
2. Vérifier que GDPRMonitoringPage est accessible manuellement
3. Lancer avec `--debug` pour voir les étapes
4. Consulter `playwright-report/index.html`

### Tests Intégration échouent
1. Vérifier les variables d'environnement Supabase
2. Vérifier que les Edge Functions sont déployées
3. Vérifier l'authentification si nécessaire
4. Consulter les logs avec `DEBUG=pw:api`

### Violations accessibilité
1. Ouvrir le rapport HTML
2. Identifier les violations spécifiques
3. Fixer les problèmes (labels, contraste, etc.)
4. Re-tester

## 🔄 Intégration CI/CD

### GitHub Actions (automatique)
Les tests sont lancés automatiquement sur chaque push/PR.

### Vérifier le statut CI
1. Aller sur l'onglet Actions de GitHub
2. Vérifier le workflow "Tests E2E"
3. Télécharger les rapports en cas d'échec

## 📞 Support

### Problèmes connus
- **Timeout** : Augmenter `timeout` dans `playwright.config.ts`
- **404 sur privacy_policies** : Tables créées, attendre propagation
- **Auth required** : Certains tests nécessitent un utilisateur admin

### Logs utiles
```bash
# Logs Supabase
supabase logs

# Logs Edge Functions
supabase functions logs <function-name>

# Logs réseau Playwright
DEBUG=pw:api npx playwright test
```

---

**Commandes Rapides** :
```bash
# Quick test complet
npm run test:e2e && npx playwright test tests/integration/

# Rapport immédiat
npx playwright show-report

# Debug rapide
npx playwright test --debug tests/e2e/gdpr-monitoring.spec.ts
```

**Prochain Audit** : Après correction des violations détectées  
**Dernière mise à jour** : 2025-11-10
