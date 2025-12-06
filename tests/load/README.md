# 🚀 Tests de Charge K6 - Edge Functions RGPD

## Installation K6

### macOS
```bash
brew install k6
```

### Windows
```bash
choco install k6
```

### Linux
```bash
# Debian/Ubuntu
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6

# Fedora/CentOS
sudo dnf install https://dl.k6.io/rpm/repo.rpm
sudo dnf install k6
```

### Docker
```bash
docker pull grafana/k6:latest
```

## Exécution des Tests

### Test Standard (100 utilisateurs, 14 minutes)
```bash
k6 run tests/load/k6-edge-functions-rgpd.js
```

### Test Personnalisé
```bash
# 50 utilisateurs pendant 2 minutes
k6 run --vus 50 --duration 2m tests/load/k6-edge-functions-rgpd.js

# 200 utilisateurs pendant 5 minutes
k6 run --vus 200 --duration 5m tests/load/k6-edge-functions-rgpd.js

# Test rapide (10 utilisateurs, 30 secondes)
k6 run --vus 10 --duration 30s tests/load/k6-edge-functions-rgpd.js
```

### Test avec Variables d'Environnement
```bash
# Spécifier l'URL Supabase
k6 run --env VITE_SUPABASE_URL=https://your-project.supabase.co \
       --env VITE_SUPABASE_PUBLISHABLE_KEY=your_key \
       tests/load/k6-edge-functions-rgpd.js
```

### Test avec Docker
```bash
docker run --rm -i grafana/k6:latest run - <tests/load/k6-edge-functions-rgpd.js
```

## Scénarios de Test

Le fichier contient 3 scénarios de test :

### 1. Montée Progressive (ramp_up)
- **Début** : 0 min
- **Durée** : 14 min
- **Description** : Montée progressive de 0 à 100 utilisateurs

| Étape | Durée | Cible | Description |
|-------|-------|-------|-------------|
| 1 | 2 min | 20 VUs | Montée initiale |
| 2 | 3 min | 50 VUs | Charge moyenne |
| 3 | 2 min | 100 VUs | Charge nominale |
| 4 | 5 min | 100 VUs | Maintien |
| 5 | 2 min | 0 VUs | Descente |

### 2. Test de Pic (spike_test)
- **Début** : 15 min
- **Durée** : 2 min
- **Description** : Pic soudain à 200 utilisateurs

### 3. Test de Stress (stress_test)
- **Début** : 20 min
- **Durée** : 10 min
- **Description** : Montée jusqu'à 300 utilisateurs pour trouver les limites

## Métriques et Seuils

### Seuils de Performance (SLAs)
- ✅ **P95** : 95% des requêtes < 2 secondes
- ✅ **P99** : 99% des requêtes < 5 secondes
- ✅ **Taux d'erreur HTTP** : < 5%
- ✅ **Taux d'erreur métier** : < 10%
- ✅ **Temps de réponse P95** : < 3 secondes

### Métriques Collectées
- `http_reqs` : Nombre total de requêtes HTTP
- `http_req_duration` : Durée des requêtes
- `http_req_failed` : Taux d'échec des requêtes
- `errors` : Taux d'erreurs métier
- `response_time` : Temps de réponse personnalisé
- `successful_requests` : Compteur de succès
- `failed_requests` : Compteur d'échecs

## Distribution des Requêtes

Les tests simulent un usage réaliste avec la distribution suivante :

| Edge Function | % d'utilisation | Description |
|---------------|-----------------|-------------|
| `compliance-audit/latest` | 40% | Consultation dernier audit |
| `compliance-audit/history` | 20% | Consultation historique |
| `gdpr-alert-detector` | 25% | Détection d'alertes |
| `dsar-handler` | 15% | Création/consultation DSAR |

## Rapports et Résultats

### Rapport Console
Les résultats s'affichent automatiquement à la fin :
```
✨ Résumé des Tests de Charge RGPD
==================================================

📊 Requêtes HTTP:
  Total: 12450
  Réussies: 11823
  Échouées: 627
  Taux d'erreur: 5.04%

⏱️  Temps de réponse:
  Moyenne: 245.32ms
  Médiane: 198.50ms
  P95: 1876.23ms
  P99: 4523.11ms
  Max: 8901.45ms

🎯 Seuils de performance:
  ✅ p(95)<2000
  ✅ p(99)<5000
  ❌ rate<0.05
```

### Rapport JSON
Un fichier `summary.json` est généré automatiquement avec tous les détails.

### Rapport HTML (avec K6 Cloud)
```bash
# Envoyer les résultats à K6 Cloud
k6 login cloud
k6 run --out cloud tests/load/k6-edge-functions-rgpd.js
```

## Analyse des Résultats

### Statuts à Vérifier

#### ✅ Succès
- Tous les seuils sont verts
- Taux d'erreur < 5%
- P95 < 2 secondes

#### ⚠️ Performance Dégradée
- Certains seuils sont jaunes
- Taux d'erreur entre 5-10%
- P95 entre 2-5 secondes

#### ❌ Échec
- Seuils rouges
- Taux d'erreur > 10%
- P95 > 5 secondes

### Actions Correctives

Si les tests échouent :

1. **Taux d'erreur élevé**
   - Vérifier les logs Supabase
   - Vérifier les Edge Functions
   - Augmenter les limites de rate limiting

2. **Temps de réponse élevé**
   - Optimiser les requêtes SQL
   - Ajouter des index
   - Augmenter les ressources serveur

3. **Erreurs sous charge**
   - Vérifier les connexions DB
   - Vérifier les timeouts
   - Augmenter les quotas Supabase

## Tests Continus (CI/CD)

### GitHub Actions
```yaml
name: Load Tests

on:
  schedule:
    - cron: '0 2 * * 0'  # Chaque dimanche à 2h
  workflow_dispatch:

jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install K6
        run: |
          sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
          echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update
          sudo apt-get install k6
      
      - name: Run Load Tests
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.VITE_SUPABASE_PUBLISHABLE_KEY }}
        run: k6 run tests/load/k6-edge-functions-rgpd.js
      
      - name: Upload Results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: k6-results
          path: summary.json
```

## Monitoring en Temps Réel

### Grafana + InfluxDB
```bash
# Lancer InfluxDB
docker run -d -p 8086:8086 influxdb:2.0

# Exécuter K6 avec output InfluxDB
k6 run --out influxdb=http://localhost:8086/k6 tests/load/k6-edge-functions-rgpd.js
```

### Datadog
```bash
k6 run --out datadog tests/load/k6-edge-functions-rgpd.js
```

### New Relic
```bash
k6 run --out newrelic tests/load/k6-edge-functions-rgpd.js
```

## Bonnes Pratiques

### ✅ Faire
- Lancer les tests hors production si possible
- Prévenir l'équipe avant les tests
- Augmenter progressivement la charge
- Monitorer les métriques serveur pendant les tests
- Documenter les résultats

### ❌ Ne pas faire
- Lancer des tests en production sans prévenir
- Ignorer les alertes pendant les tests
- Tester avec des données réelles sensibles
- Dépasser les limites connues du serveur
- Oublier de nettoyer les données de test

## Support

### Problèmes Connus
- **Erreurs 429** : Rate limiting atteint, réduire le nombre de VUs
- **Timeouts** : Augmenter les timeouts dans le script
- **Connexions refusées** : Vérifier les limites Supabase

### Documentation
- [K6 Documentation](https://k6.io/docs/)
- [K6 Examples](https://k6.io/docs/examples/)
- [Supabase Limits](https://supabase.com/docs/guides/platform/going-into-prod#resource-management)

---

**Commandes Rapides** :
```bash
# Test rapide (30s)
k6 run --vus 10 --duration 30s tests/load/k6-edge-functions-rgpd.js

# Test standard (14min)
k6 run tests/load/k6-edge-functions-rgpd.js

# Test stress (10min, 300 VUs)
k6 run --vus 300 --duration 10m tests/load/k6-edge-functions-rgpd.js

# Avec output JSON
k6 run --out json=results.json tests/load/k6-edge-functions-rgpd.js
```

**Dernière mise à jour** : 2025-11-10
