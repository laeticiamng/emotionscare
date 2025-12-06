# 🚨 ROTATION DE SÉCURITÉ REQUISE - ACTION IMMÉDIATE

**Date**: 18 Novembre 2025
**Priorité**: 🔴 CRITIQUE
**Status**: ⚠️ EN ATTENTE D'ACTION MANUELLE

---

## ⚠️ TOKENS EXPOSÉS DÉTECTÉS

Les tokens suivants ont été hardcodés dans le code source et **DOIVENT ÊTRE RÉVOQUÉS ET RÉGÉNÉRÉS IMMÉDIATEMENT**.

### 1. Token Supabase Anon Key 🔴 CRITIQUE

**Token exposé** (maintenant retiré du code):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU
```

**Project ID**: `yaincoxihiqdksxgrsrk`
**URL**: `https://yaincoxihiqdksxgrsrk.supabase.co`

**Impact**:
- Token visible dans tous les bundles frontend déployés
- Token visible dans l'historique Git
- Accès potentiel non autorisé à votre base de données Supabase

---

## 🔧 ÉTAPES DE RÉGÉNÉRATION (À FAIRE MAINTENANT)

### Étape 1: Accéder à Supabase Dashboard

1. Connexion à [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionner le projet `yaincoxihiqdksxgrsrk`
3. Aller dans **Settings** → **API**

### Étape 2: Régénérer l'Anon Key

⚠️ **ATTENTION**: Cette action invalide l'ancienne clé. Tous les clients utilisant l'ancienne clé perdront l'accès.

1. Dans la section **Project API keys**
2. Cliquer sur **Reset** ou **Regenerate** pour la clé `anon` (public)
3. **Copier** la nouvelle clé générée

### Étape 3: Mettre à Jour les Variables d'Environnement

#### Pour le développement local (`.env.local`):
```bash
VITE_SUPABASE_URL=https://yaincoxihiqdksxgrsrk.supabase.co
VITE_SUPABASE_ANON_KEY=<NOUVELLE_CLE_ICI>
```

#### Pour la production (Vercel/Netlify/autre):

**Vercel:**
```bash
vercel env add VITE_SUPABASE_URL
# Entrer: https://yaincoxihiqdksxgrsrk.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY
# Entrer: <NOUVELLE_CLE>
```

**Netlify:**
1. Aller dans **Site settings** → **Environment variables**
2. Mettre à jour `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`

**GitHub Actions (Secrets):**
1. Aller dans **Settings** → **Secrets and variables** → **Actions**
2. Mettre à jour `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`

### Étape 4: Vérifier l'Historique Git (Optionnel mais Recommandé)

⚠️ **Le token est toujours visible dans l'historique Git**

Options:
1. **Option Simple**: Ne rien faire (le token est révoqué donc inoffensif)
2. **Option Avancée**: Nettoyer l'historique avec `git filter-repo` ou BFG Repo-Cleaner

**Si vous choisissez l'option avancée** (⚠️ destructif):
```bash
# Sauvegarder d'abord !
git clone --mirror <url> backup-repo

# Utiliser BFG Repo-Cleaner
bfg --replace-text secrets.txt
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

**Fichier `secrets.txt`:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU==>***REMOVED***
https://yaincoxihiqdksxgrsrk.supabase.co==>***REMOVED***
```

### Étape 5: Redéployer

Après avoir mis à jour les variables d'environnement:

```bash
# Rebuild et redéploiement
npm run build

# Vercel
vercel --prod

# Ou tout autre service
```

---

## ✅ CHECKLIST DE VÉRIFICATION

- [ ] Token Supabase `anon` régénéré dans le dashboard
- [ ] Nouvelle clé ajoutée à `.env.local`
- [ ] Variables d'environnement mises à jour en production (Vercel/Netlify/etc.)
- [ ] Variables d'environnement mises à jour dans GitHub Actions Secrets
- [ ] Build local réussi avec nouvelles variables (`npm run build`)
- [ ] Déploiement en production avec nouvelles variables
- [ ] Application testée et fonctionnelle
- [ ] (Optionnel) Historique Git nettoyé

---

## 🔍 VÉRIFICATIONS POST-ROTATION

### Test 1: Variables Chargées Correctement

```bash
# En développement
npm run dev

# Vérifier dans la console du navigateur:
# [SYSTEM] EmotionsCare Environment
# supabase: ✅
```

### Test 2: Connexion Supabase Fonctionne

1. Ouvrir l'application
2. Se connecter ou créer un compte
3. Vérifier qu'il n'y a pas d'erreur d'authentification

### Test 3: Ancienne Clé Invalide

Essayer d'utiliser l'ancienne clé devrait donner une erreur `401 Unauthorized`.

---

## 📊 MONITORING POST-ROTATION

### Dans Supabase Dashboard:

1. **Logs** → **API Logs**: Vérifier les appels avec la nouvelle clé
2. **Auth** → **Users**: S'assurer que les nouvelles connexions fonctionnent
3. **Database** → **Query Statistics**: Vérifier l'activité normale

### Dans Sentry (si configuré):

Surveiller les erreurs liées à:
- `VITE_SUPABASE_ANON_KEY`
- Authentication failures
- Connection errors

---

## 🛡️ MESURES PRÉVENTIVES POUR L'AVENIR

### 1. Valider les Variables d'Environnement au Build

Fichier `.github/workflows/ci.yml` (déjà en place):
```yaml
- name: Check Environment Variables
  run: npm run check:env
```

### 2. Pre-commit Hook

Fichier `.husky/pre-commit`:
```bash
#!/bin/sh
# Vérifier qu'aucun secret n'est commité
if git diff --cached | grep -E "(eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+|sk-[a-zA-Z0-9]{20,})"; then
  echo "❌ Secrets detected in commit!"
  exit 1
fi
```

### 3. Scanner de Secrets

Ajouter `gitleaks` ou `truffleHog`:
```bash
# .github/workflows/security.yml
- name: Gitleaks
  uses: gitleaks/gitleaks-action@v2
```

---

## 📝 RÉSUMÉ DES CHANGEMENTS APPLIQUÉS

### Fichiers Modifiés:

1. **`src/lib/env.ts`** (lignes 20-26)
   - ❌ Retiré: URL Supabase hardcodée
   - ❌ Retiré: Token JWT hardcodé
   - ✅ Utilise uniquement les variables d'environnement

2. **`src/lib/security/apiClient.ts`** (lignes 13-18)
   - ❌ Retiré: URL hardcodée
   - ✅ Construit l'URL depuis `VITE_SUPABASE_URL`
   - ✅ Lance une erreur si la variable n'est pas définie

### Comportement Actuel:

- ✅ **Développement**: Nécessite `.env.local` avec les bonnes variables
- ✅ **Production**: Nécessite variables d'environnement configurées
- ✅ **Sécurité**: Plus de secrets dans le code source
- ⚠️ **Build**: Échouera si `VITE_SUPABASE_URL` ou `VITE_SUPABASE_ANON_KEY` manquent

---

## ❓ FAQ

**Q: L'application ne démarre plus en local !**
R: Créez un fichier `.env.local` avec les variables requises (voir Étape 3)

**Q: Le build échoue en CI/CD !**
R: Mettez à jour les secrets dans GitHub Actions / Vercel / Netlify

**Q: Les utilisateurs existants vont-ils perdre leur session ?**
R: Non, le token `anon` est pour l'accès public. Les sessions utilisateur utilisent des tokens différents.

**Q: Dois-je vraiment nettoyer l'historique Git ?**
R: Non si vous avez révoqué le token. Recommandé mais pas obligatoire.

**Q: Combien de temps avant que l'ancien token expire ?**
R: Le token était valide jusqu'en 2058, mais la révocation l'invalide immédiatement.

---

## 📞 CONTACTS D'URGENCE

- **Supabase Support**: https://supabase.com/support
- **Documentation Supabase**: https://supabase.com/docs

---

**⚠️ NE PAS IGNORER CE DOCUMENT**

La rotation des tokens est **CRITIQUE** pour la sécurité de votre application et des données utilisateurs.

**Temps estimé**: 15-30 minutes
**Impact si non fait**: Risque d'accès non autorisé à la base de données

---

*Document généré automatiquement le 18 novembre 2025*
*Audit de sécurité Phase 1 - EmotionsCare*
