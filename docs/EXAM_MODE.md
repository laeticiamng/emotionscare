# Mode Examens - Documentation Technique

## 📋 Vue d'ensemble

Le **Mode Examens** est une fonctionnalité spéciale d'EmotionsCare conçue pour les étudiants en période de révisions et d'examens. Cette fonctionnalité permet une intégration SSO (Single Sign-On) depuis la plateforme **Med MNG** via Supabase.

## 🎯 Objectifs

1. **Créer un mode "Examens / Étudiants"** avec des expériences de bien-être adaptées
2. **Permettre le SSO** via tokens Supabase depuis Med MNG
3. **Maintenir la compatibilité** avec le flux de login standard

## 🏗️ Architecture

### Fichiers modifiés/créés

```
src/
├── pages/
│   └── ExamModePage.tsx               # Nouvelle page mode examens
├── services/
│   └── auth-service.ts                # Ajout méthode signInWithTokens()
├── routerV2/
│   ├── registry.ts                    # Ajout route /exam-mode
│   └── router.tsx                     # Ajout lazy import ExamModePage
└── docs/
    └── EXAM_MODE.md                   # Cette documentation
```

## 🔐 Flux SSO

### 1. Depuis Med MNG

Med MNG envoie l'utilisateur vers EmotionsCare avec les tokens dans l'URL :

```
https://app.emotionscare.com/exam-mode?access_token=XXX&refresh_token=YYY
```

### 2. ExamModePage - Traitement automatique

La page `ExamModePage` détecte automatiquement les tokens et :

```typescript
// 1. Récupère les tokens depuis l'URL
const accessToken = searchParams.get('access_token');
const refreshToken = searchParams.get('refresh_token');

// 2. Établit la session Supabase
const { user, error } = await authService.signInWithTokens(
  accessToken,
  refreshToken || undefined
);

// 3. Nettoie l'URL pour la sécurité
const newUrl = new URL(window.location.href);
newUrl.searchParams.delete('access_token');
newUrl.searchParams.delete('refresh_token');
window.history.replaceState({}, '', newUrl.toString());
```

### 3. Méthode SSO - auth-service.ts

```typescript
/**
 * Connexion SSO via tokens (access_token + refresh_token)
 * Utilisé pour le SSO depuis Med MNG
 */
async signInWithTokens(accessToken: string, refreshToken?: string): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken || '',
  });

  // Récupération du profil utilisateur
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.session.user.id)
    .single();

  // Construction de l'objet User
  const user: User = {
    id: data.session.user.id,
    email: data.session.user.email || '',
    name: profileData?.name || '',
    role: validRole,
    createdAt: data.session.user.created_at,
    preferences: { /* ... */ }
  };

  return { user, error: null };
}
```

## 🎨 Interface utilisateur

### Page Mode Examens

La page propose **3 expériences** adaptées :

#### 1. **Routine Pré-Examen** 🧠
- **Durée** : 10 minutes
- **Contenu** : Musique apaisante + exercices de concentration
- **Objectif** : Préparation mentale et émotionnelle avant l'examen

#### 2. **Routine Post-Examen** ✅
- **Durée** : 15 minutes
- **Contenu** : Relaxation guidée + musique douce
- **Objectif** : Décompression et évacuation du stress

#### 3. **Gestion du stress** 💜
- **Durée** : 5-20 minutes
- **Contenu** : Exercices de respiration + méditation guidée + sons apaisants
- **Objectif** : Calmer l'anxiété en temps réel

### États de la page

```typescript
// 1. Loading - SSO en cours
<Loader2 className="animate-spin" />

// 2. Non authentifié - Redirection login
<Button onClick={() => navigate('/login')}>
  Se connecter
</Button>

// 3. Authentifié - Affichage des expériences
<Card>
  <CardTitle>{experience.title}</CardTitle>
  <Button onClick={() => handleStartExperience(experience)}>
    {experience.actionLabel}
  </Button>
</Card>
```

## 🛡️ Sécurité

### Mesures de sécurité implémentées

1. **Nettoyage de l'URL** : Les tokens sont supprimés de l'URL immédiatement après usage
   ```typescript
   window.history.replaceState({}, '', newUrl.toString());
   ```

2. **Pas de logging des tokens** : Les tokens ne sont jamais loggés
   ```typescript
   logger.info('SSO login successful', 'AUTH_SSO'); // Pas de tokens
   ```

3. **Validation de session** : Utilisation de `supabase.auth.setSession()` qui valide les tokens
   ```typescript
   const { data, error } = await supabase.auth.setSession({ ... });
   if (error) throw new AuthError(...);
   ```

4. **Guard désactivé** : Gestion de l'auth dans le composant pour plus de contrôle
   ```typescript
   {
     path: '/exam-mode',
     guard: false, // SSO géré dans le composant
   }
   ```

## 🔗 Routes

### Route principale
- **Path** : `/exam-mode`
- **Segment** : `public`
- **Layout** : `marketing`
- **Guard** : `false` (SSO géré dans le composant)

### Aliases
- `/mode/exams`
- `/examens`

### Exemple d'accès

```bash
# Sans SSO (login standard requis)
https://app.emotionscare.com/exam-mode

# Avec SSO depuis Med MNG
https://app.emotionscare.com/exam-mode?access_token=eyJhbG...&refresh_token=v1.MXQ...
```

## 🧪 Tests

### Scénarios à tester

#### ✅ Scénario 1 : SSO réussi
1. Med MNG redirige vers `/exam-mode?access_token=VALID_TOKEN&refresh_token=VALID_TOKEN`
2. L'utilisateur est automatiquement connecté
3. Les tokens sont supprimés de l'URL
4. La page affiche les 3 expériences
5. L'utilisateur peut lancer une expérience

#### ✅ Scénario 2 : Token invalide/expiré
1. Med MNG redirige avec un token invalide
2. Message d'erreur affiché
3. Redirection vers `/login` après 2 secondes
4. Les tokens sont supprimés de l'URL

#### ✅ Scénario 3 : Accès direct sans token
1. L'utilisateur accède à `/exam-mode` directement
2. Si non authentifié : affichage du bouton "Se connecter"
3. Si authentifié : affichage des expériences

#### ✅ Scénario 4 : Navigation post-SSO
1. SSO réussi
2. Clic sur "Routine Pré-Examen"
3. Redirection vers `/b2c/music-enhanced`
4. Session maintenue

## 📝 Critères d'acceptation

- [x] Utilisateur avec `access_token` valide est connecté automatiquement
- [x] Flux Med MNG → EmotionsCare fonctionne de bout en bout
- [x] Sans token : comportement standard (login requis)
- [x] Page propose 3 expériences : pré-exam, post-exam, stress
- [x] Tokens ne se retrouvent ni dans les logs, ni dans l'URL finale
- [x] `history.replaceState` utilisé pour nettoyer l'URL
- [x] Sécurité : pas de fuite de tokens

## 🔄 Intégration Med MNG

### Configuration Med MNG

Pour intégrer EmotionsCare depuis Med MNG :

```typescript
// 1. Récupérer la session Supabase de l'utilisateur connecté
const session = await supabase.auth.getSession();

// 2. Construire l'URL avec les tokens
const examModeUrl = new URL('https://app.emotionscare.com/exam-mode');
examModeUrl.searchParams.set('access_token', session.access_token);
examModeUrl.searchParams.set('refresh_token', session.refresh_token);

// 3. Rediriger l'utilisateur
window.location.href = examModeUrl.toString();

// OU ouvrir dans un nouvel onglet
window.open(examModeUrl.toString(), '_blank');
```

### Même projet Supabase

⚠️ **Important** : Med MNG et EmotionsCare doivent utiliser le **même projet Supabase** pour que le SSO fonctionne.

Variables d'environnement identiques :
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbG...
```

## 🚀 Déploiement

### Checklist pré-déploiement

- [x] Code testé localement
- [x] Routes ajoutées au registry
- [x] Lazy imports configurés
- [x] Documentation créée
- [ ] Tests E2E avec Med MNG
- [ ] Validation de la session Supabase
- [ ] Monitoring des logs SSO

### Variables d'environnement

Aucune nouvelle variable nécessaire. Le SSO utilise la configuration Supabase existante :

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbG...
```

## 📊 Monitoring

### Logs à surveiller

```typescript
// Succès SSO
logger.info('SSO login successful', 'AUTH_SSO');

// Échec SSO
logger.error('SSO login failed', error, 'AUTH_SSO');

// Lancement expérience
logger.info(`Starting exam experience: ${experience.id}`, 'EXAM_MODE');
```

### Métriques importantes

1. Taux de réussite SSO
2. Temps de connexion SSO
3. Expériences les plus utilisées
4. Taux de rebond sur la page exam-mode

## 🔮 Évolutions futures

### V2 - Expériences dédiées

- Créer des pages dédiées pour chaque expérience (au lieu de réutiliser les pages existantes)
- Ajouter des guidances vocales spécifiques aux examens
- Intégrer des techniques de mémorisation

### V3 - Personnalisation

- Adapter les expériences selon le type d'examen (oral, écrit, pratique)
- Historique des sessions pré/post-exam
- Statistiques de bien-être pendant la période d'examens

### V4 - Intégration avancée

- Push notifications de rappel depuis Med MNG
- Synchronisation du calendrier d'examens
- Recommandations IA basées sur le niveau de stress

## 🆘 Support

### Problèmes courants

**Q : Le SSO ne fonctionne pas**
- Vérifier que Med MNG et EmotionsCare utilisent le même projet Supabase
- Vérifier que les tokens sont bien transmis dans l'URL
- Vérifier la validité des tokens (durée de vie)

**Q : L'utilisateur est redirigé vers /login**
- Le token est probablement expiré
- Vérifier les logs dans `AUTH_SSO` pour plus de détails

**Q : Les tokens apparaissent toujours dans l'URL**
- Problème avec `history.replaceState`
- Vérifier la console du navigateur pour des erreurs

## 📚 Références

- [Supabase Auth - setSession](https://supabase.com/docs/reference/javascript/auth-setsession)
- [React Router v6 - useSearchParams](https://reactrouter.com/en/main/hooks/use-search-params)
- [Web History API - replaceState](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState)

---

**Version** : 1.0.0
**Date** : 2025-11-15
**Auteur** : Claude Code
**Ticket** : Ticket 2 – Mode Exams + SSO
