# JOUR 4 - Option 2 : Tests automatisés (2-3h)

**Objectif** : Valider les migrations in-memory → Supabase avec une couverture de tests complète.

---

## 🎯 Périmètre

### Phase 1 : Tests Journal (45 min)
- ✅ Tests unitaires `journal_voice` table
- ✅ Tests unitaires `journal_text` table
- ✅ Tests d'intégration API `/journal/voice` et `/journal/text`
- ✅ Tests RLS policies
- ✅ Tests edge functions handlers

### Phase 2 : Tests VR (1h)
- ✅ Tests unitaires `vr_nebula_sessions` table
- ✅ Tests unitaires `vr_dome_sessions` table
- ✅ Tests triggers SQL (calc_vr_nebula, calc_vr_dome)
- ✅ Tests d'intégration API VR
- ✅ Tests RLS policies VR

### Phase 3 : Tests Breath (45 min)
- ✅ Tests unitaires `breath_weekly_metrics` table
- ✅ Tests unitaires `breath_weekly_org_metrics` table
- ✅ Tests d'intégration API Breath
- ✅ Tests RLS policies Breath

---

## 📋 Plan d'exécution

1. **Préparation** (15 min)
   - Configuration environnement de test Supabase
   - Création base de données test isolée
   - Setup fixtures et données de test

2. **Phase 1 - Tests Journal** (45 min)
   - Tests unitaires DB
   - Tests handlers edge functions
   - Tests RLS policies
   - Tests end-to-end

3. **Phase 2 - Tests VR** (1h)
   - Tests unitaires DB
   - Tests triggers SQL
   - Tests handlers edge functions
   - Tests RLS policies
   - Tests end-to-end

4. **Phase 3 - Tests Breath** (45 min)
   - Tests unitaires DB
   - Tests handlers edge functions
   - Tests RLS policies
   - Tests end-to-end

5. **Intégration CI/CD** (15 min)
   - Ajout tests dans workflow GitHub Actions
   - Configuration pipeline de tests
   - Documentation

---

## ✅ Critères de succès

- [ ] Couverture de tests ≥ 90% pour les 3 services
- [ ] Tous les tests passent en local
- [ ] Tous les tests passent en CI/CD
- [ ] Tests RLS policies validés
- [ ] Documentation complète des tests
- [ ] Temps d'exécution < 5 minutes

---

## 🚀 Stack de tests

- **Framework** : Vitest
- **Supabase Testing** : @supabase/supabase-js + test helpers
- **Assertions** : expect (Vitest)
- **Coverage** : c8 / vitest coverage
- **CI/CD** : GitHub Actions

---

**Statut** : 🔄 EN COURS - Phase 1 (Tests Journal)
