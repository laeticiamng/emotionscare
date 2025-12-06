# 🔐 Exécution du script CORS en mode test

## 📋 Prérequis

```bash
# Vérifier que le script est exécutable
chmod +x scripts/apply-cors-to-edge-functions.sh

# Vérifier la présence du helper CORS
ls -la supabase/functions/_shared/cors.ts
```

## 🧪 Phase 1 : Dry-run (Preview)

```bash
# Preview des changements sans modification
./scripts/apply-cors-to-edge-functions.sh --dry-run
```

**Attendu :**
- Liste de ~120 fonctions à modifier
- Affichage des transformations prévues
- Aucune modification fichier

## ✅ Phase 2 : Mode Test avec Régression

```bash
# Application + tests de régression automatiques
./scripts/apply-cors-to-edge-functions.sh --test
```

**Tests exécutés automatiquement :**

1. **Test TypeScript** : Vérification syntaxe et typage
   ```bash
   npx tsc --noEmit supabase/functions/*/index.ts
   ```

2. **Test CORS Security** : Détection de wildcards `*`
   ```bash
   grep -r "Access-Control-Allow-Origin.*\*" supabase/functions/
   ```
   ✅ Aucun wildcard ne doit être trouvé

3. **Test Backup Integrity** : Vérification des backups créés
   ```bash
   ls -la supabase/functions/.backups-cors-*/
   ```

## 🚀 Phase 3 : Application Production

```bash
# Application finale (si tests OK)
./scripts/apply-cors-to-edge-functions.sh
```

**Résultat attendu :**
```
✅ 120 Edge Functions modifiées
✅ Backup créé dans supabase/functions/.backups-cors-2025-XX-XX/
✅ CORS liste blanche appliquée (*.emotionscare.ai, *.lovable.app)
✅ Tests de régression PASSED
```

## 🔄 Rollback si problème

```bash
# Restaurer depuis le backup
BACKUP_DIR="supabase/functions/.backups-cors-$(date +%Y-%m-%d)"
cp -r $BACKUP_DIR/* supabase/functions/
```

## 📊 Validation E2E après déploiement

```bash
# Lancer tests Playwright CORS
npm run test:e2e -- tests/e2e/edge-functions-cors.spec.ts
```

**Tests E2E validant :**
- ✅ Domaines autorisés (*.emotionscare.ai)
- ✅ Domaines dev (*.lovable.app)
- ❌ Domaines bloqués (evil-attacker.com)
- ✅ Preflight OPTIONS correct
- ✅ Header `Vary: Origin` présent

## 📈 Monitoring post-déploiement

```bash
# Vérifier logs Supabase Edge Functions
supabase functions logs --project-ref yaincoxihiqdksxgrsrk

# Filtrer erreurs CORS
supabase functions logs | grep -i "cors\|origin"
```

**Dashboard API Monitoring :**
- Ouvrir https://app.emotionscare.ai/admin/api-monitoring
- Vérifier KPI "Rate Limited Requests" (devrait baisser)
- Surveiller alertes "CORS Blocked Attempts"

## 🎯 Checklist finale

- [ ] Dry-run exécuté et validé
- [ ] Mode test PASSED (3/3 tests)
- [ ] Backup créé et vérifié
- [ ] Application production exécutée
- [ ] Tests E2E Playwright CORS PASSED
- [ ] Logs Supabase vérifiés (pas d'erreur CORS)
- [ ] Dashboard monitoring OK (pas de pic rate limit)
- [ ] Domaines externes bloqués confirmés

## 🚨 En cas d'incident

1. **Rollback immédiat** depuis backup
2. **Vérifier** logs Supabase pour identifier fonction problématique
3. **Corriger** manuellement la fonction
4. **Re-tester** avec `--test` avant nouvelle application

## 📞 Support

- **Logs détaillés :** `./scripts/apply-cors-to-edge-functions.sh --test 2>&1 | tee cors-apply.log`
- **Dashboard monitoring :** `/admin/api-monitoring`
- **Tests E2E :** `npm run test:e2e -- --grep="CORS"`
