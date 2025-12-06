# Intégration B2C dans EmotionsCare

## Vue d'ensemble

Ce document détaille l'intégration du mode B2C (Particulier) dans la plateforme EmotionsCare, initialement B2B uniquement.

## Architecture

### Modèle de données

```
organizations (B2B uniquement)
├── id
├── name
├── plan
└── metadata

user_roles (multi-tenant)
├── id
├── user_id → auth.users
├── role (enum: b2c_user, b2b_employee, b2b_rh, admin)
└── organization_id → organizations (nullable)

profiles (étendu)
├── id
├── user_id
├── organization_id (nullable)
├── theme_pref
└── metadata

moods (B2C/B2B)
├── id
├── user_id
├── valence (-1 à 1)
├── arousal (-1 à 1)
├── note
├── tags
└── context

session_presets (globaux)
├── id
├── name
├── tags
├── engine (suno, musicgen, other)
└── cfg_json

music_sessions (B2C/B2B)
├── id
├── user_id
├── preset_id
├── status
├── artifact_url
└── metadata

immersive_sessions (B2C/B2B)
├── id
├── user_id
├── type (vr, ambilight, audio)
├── params_json
└── outcome_text

b2b_aggregates (RH uniquement)
├── id
├── organization_id
├── period
├── user_count (≥5, k-anonymat)
└── text_summary
```

### Feature Flags

| Flag                       | B2C | B2B Employee | B2B RH | Admin |
|---------------------------|-----|--------------|--------|-------|
| `FF_B2C_PORTAL`           | ✅  | ❌           | ❌     | ✅    |
| `FF_MUSIC_THERAPY`        | ✅  | ✅           | ❌     | ✅    |
| `FF_VR`                   | ✅  | ✅           | ❌     | ✅    |
| `FF_COACHING_AI`          | ✅  | ✅           | ❌     | ✅    |
| `FF_IMMERSIVE_SESSIONS`   | ✅  | ✅           | ❌     | ✅    |
| `FF_B2B_ANALYTICS`        | ❌  | ❌           | ✅     | ✅    |

## Routing

```
/                                  → ModeSelectionPage
/auth/login?mode=b2c              → Login B2C
/auth/login?mode=b2b              → Login B2B
/app/particulier                   → B2CDashboardPage (protégé: b2c_user)
/app/particulier/mood             → B2CMoodPage
/app/particulier/music            → B2CMusicPage
/app/particulier/immersive        → B2CImmersivePage
/app/entreprise/rh                → B2BRHDashboard (protégé: b2b_rh)
/app/entreprise/moi               → B2BEmployeeDashboard (protégé: b2b_employee)
```

## Services

### moodService
```typescript
createMood(input: CreateMoodInput): Promise<Mood>
getUserMoods(limit, offset): Promise<Mood[]>
getMoodStats(days): Promise<Stats>
deleteMood(id): Promise<void>
```

### musicService
```typescript
getActivePresets(): Promise<MusicPreset[]>
createMusicSession(input): Promise<MusicSession>
getMusicSession(id): Promise<MusicSession>
getUserMusicSessions(limit): Promise<MusicSession[]>
updateSessionStatus(id, status, url): Promise<void>
```

### immersiveService
```typescript
createSession(input): Promise<ImmersiveSession>
endSession(id, outcome): Promise<void>
getSession(id): Promise<ImmersiveSession>
getUserSessions(limit): Promise<ImmersiveSession[]>
getSessionStats(): Promise<Stats>
```

## Sécurité

### RLS Policies

Toutes les tables sensibles utilisent RLS avec les principes suivants:

1. **Isolation utilisateur**: `user_id = auth.uid()`
2. **Security Definer Functions**: Pour éviter la récursion RLS
   - `has_role(_user_id, _role)`
   - `get_user_organization(_user_id)`
3. **K-Anonymat**: Les agrégats B2B nécessitent `user_count ≥ 5`

### Exemples de policies

```sql
-- Moods: owner only
CREATE POLICY "Users can manage their own moods"
  ON public.moods FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- B2B Aggregates: RH only with k-anonymat
CREATE POLICY "RH can view aggregates of their organization"
  ON public.b2b_aggregates FOR SELECT
  USING (
    public.has_role(auth.uid(), 'b2b_rh') 
    AND organization_id = public.get_user_organization(auth.uid())
    AND user_count >= 5
  );
```

## Hooks

### useFeatureFlags()
```typescript
const { flags, isEnabled } = useFeatureFlags();
if (isEnabled('FF_MUSIC_THERAPY')) {
  // Afficher le module musicothérapie
}
```

### useUserRole()
```typescript
const { primaryRole, hasRole, isB2C, isB2B, isRH, isAdmin } = useUserRole();
if (isB2C()) {
  // Logique spécifique B2C
}
```

## Tests

### Tests e2e requis

1. **B2C Journey**
   ```typescript
   test('B2C user can create mood and music session', async ({ page }) => {
     await page.goto('/auth/login?mode=b2c');
     await page.fill('[name=email]', 'b2c@test.com');
     await page.fill('[name=password]', 'password');
     await page.click('button[type=submit]');
     
     // Vérifier redirection vers dashboard B2C
     await expect(page).toHaveURL('/app/particulier');
     
     // Créer une humeur
     await page.click('text=Saisir mon humeur');
     await page.fill('[name=note]', 'Test mood');
     await page.click('button:has-text("Enregistrer")');
     
     // Créer une session musique
     await page.click('text=Musicothérapie');
     await page.click('button:has-text("Créer une session")').first();
     await expect(page.locator('text=Session créée')).toBeVisible();
   });
   ```

2. **RLS Enforcement**
   ```typescript
   test('User cannot access other users data', async ({ page, context }) => {
     // Login as user A
     await login(page, 'userA@test.com');
     const userAMoodId = await createMood(page);
     
     // Login as user B
     await context.clearCookies();
     await login(page, 'userB@test.com');
     
     // Tenter d'accéder aux données de A
     const response = await page.request.get(`/api/moods/${userAMoodId}`);
     expect(response.status()).toBe(403);
   });
   ```

3. **K-Anonymat RH**
   ```typescript
   test('RH can only view aggregates with n≥5', async ({ page }) => {
     await login(page, 'rh@company.com');
     await page.goto('/app/entreprise/rh');
     
     // Vérifier badge k-anonymat
     const smallTeamCard = page.locator('[data-team-size="3"]');
     await expect(smallTeamCard).toContainText('Données insuffisantes (n<5)');
     
     const bigTeamCard = page.locator('[data-team-size="10"]');
     await expect(bigTeamCard).not.toContainText('Données insuffisantes');
   });
   ```

## Checklist d'intégration

- [x] Migrations SQL créées
- [x] RLS policies appliquées
- [x] Security Definer functions créées
- [x] Services B2C implémentés (mood, music, immersive)
- [x] Hooks créés (useFeatureFlags, useUserRole)
- [x] Pages B2C créées (Dashboard, Mood, Music)
- [x] Page de sélection de mode créée
- [ ] Routes intégrées dans le router
- [ ] Tests e2e écrits
- [ ] Tests RLS validés
- [ ] Documentation mise à jour
- [ ] Edge Functions pour traitement musique (TODO)
- [ ] Gestion des presets initiaux (seed data)
- [ ] Theming B2C/B2B différencié
- [ ] Analytics et logging

## Prochaines étapes

1. **Edge Functions**
   - `process-music-session`: Génération musicale via Suno/Musicgen
   - `process-immersive-session`: Gestion des sessions VR/audio
   - `generate-b2b-aggregates`: Agrégation des données RH avec k-anonymat

2. **Seed Data**
   - Créer des presets musicaux par défaut
   - Initialiser les données de test

3. **UI/UX**
   - Personnalisation du thème B2C vs B2B
   - Animations et transitions
   - Page immersive VR complète

4. **Analytics**
   - Logs des parcours B2C
   - Métriques d'engagement
   - Rapports RH agrégés

## Contacts

- Architecture: Voir ticket initial
- Questions: Consulter ce document
- Issues: Créer un ticket avec label `b2c-integration`
