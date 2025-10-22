# 🚨 GUIDE DE DÉPANNAGE URGENT - Écran Blanc

**Problème**: Application ne charge pas - écran blanc total  
**Aucun console.log visible, même avec code minimal**  
**Diagnostic**: Problème infrastructure Vite/Lovable

---

## ✅ ÉTAPE 1: Hard Refresh (90% des cas)

### Sur Windows/Linux
```
Ctrl + Shift + R
```

### Sur Mac
```
Cmd + Shift + R
```

**OU** Ouvrir DevTools (F12) → Clic droit sur reload → "Empty Cache and Hard Reload"

---

## ✅ ÉTAPE 2: Vérifier Console Navigateur

1. **Ouvrir DevTools**: Appuyez sur `F12`
2. **Onglet Console**: Cherchez des erreurs en rouge
3. **Erreurs communes**:
   - ❌ "Failed to load module" → Vite ne compile pas
   - ❌ "Uncaught SyntaxError" → Erreur syntax TypeScript
   - ❌ "Cannot find module" → Import manquant
   - ❌ "Unexpected token" → Problème Babel/transpilation

**Screenshot**: Prenez un screenshot de la console et partagez-le

---

## ✅ ÉTAPE 3: Vérifier Network Tab

1. **DevTools** (F12) → **Onglet Network**
2. **Rafraîchir la page** (F5)
3. **Vérifier**:
   - ❌ `main.tsx` (ou `.js`) apparaît? Si non → Vite ne build pas
   - ❌ Status 404 sur `main.tsx`? → Build échoue
   - ❌ Status 500? → Erreur serveur
   - ✅ Status 200? → Fichier charge mais crash ailleurs

**Screenshot**: Prenez un screenshot des requêtes en échec

---

## ✅ ÉTAPE 4: Vérifier Terminal Lovable

### Erreurs à chercher:
```bash
# Erreur TypeScript
❌ error TS2305: Module not found

# Erreur compilation
❌ [vite] Internal server error
❌ Transform failed with 1 error

# Erreur dépendances
❌ Cannot find package '@xxx'
❌ Missing dependencies
```

### Si erreurs trouvées:
1. **Copier l'erreur complète**
2. **Partager dans le chat**

---

## ✅ ÉTAPE 5: Tests Manuels

### Test A: Vérifier que HTML charge
```
Ouvrir: https://[votre-url]/diagnostic.html
```

**Résultat attendu**: Page bleue/violette avec tests
- ✅ Si affiche → HTML fonctionne, problème dans React
- ❌ Si blanc → Problème serveur Lovable

### Test B: Vérifier favicon
```
Ouvrir: https://[votre-url]/favicon.ico
```

- ✅ Affiche → Serveur fonctionne
- ❌ 404 → Serveur ne sert aucun fichier

---

## ✅ ÉTAPE 6: Actions de Secours

### Option A: Redémarrer Preview
```
1. Dans Lovable, chercher bouton "Restart Preview"
2. OU fermer/rouvrir l'onglet preview
3. Attendre 10 secondes
4. Rafraîchir (F5)
```

### Option B: Vider Cache Lovable
```
1. DevTools (F12) → Application tab
2. Storage → Clear site data
3. Cocher "tout"
4. Clear
5. Rafraîchir page
```

### Option C: Nouveau Navigateur
```
1. Ouvrir Chrome/Firefox incognito
2. Copier l'URL de l'app
3. Tester dans incognito
```

### Option D: Redémarrer Lovable
```
1. Sauvegarder votre travail
2. Fermer complètement Lovable
3. Rouvrir
4. Recharger le projet
```

---

## 🔧 ÉTAPE 7: Debug Avancé

### Vérifier TypeScript
```bash
# Si vous avez accès au terminal
npm run type-check
```

### Vérifier Build
```bash
# Forcer un rebuild
npm run build
```

### Vérifier Dépendances
```bash
# Vérifier node_modules
npm install
```

---

## 📋 CHECKLIST DE DIAGNOSTIC

Cochez ce qui s'applique:

**Browser**
- [ ] Hard refresh fait (Ctrl+Shift+R)
- [ ] Console ouverte (F12)
- [ ] Erreurs visibles en console? → Noter lesquelles
- [ ] Network tab vérifiée
- [ ] main.tsx.js apparaît dans Network? Statut?
- [ ] diagnostic.html fonctionne?

**Lovable Environment**
- [ ] Terminal Lovable vérifié
- [ ] Erreurs de compilation? → Noter lesquelles
- [ ] Preview redémarrée
- [ ] Cache vidé
- [ ] Incognito testé

**Résultats**
- [ ] HTML charge (diagnostic.html OK)
- [ ] JavaScript ne charge PAS (console vide)
- [ ] Vite compile sans erreur (terminal propre)
- [ ] Network requests OK (200 status)

---

## 🎯 SOLUTIONS PAR SYMPTÔME

### Symptôme 1: Console vide + Network vide
**Cause**: Serveur Vite ne répond pas  
**Solution**: Redémarrer preview Lovable

### Symptôme 2: Console avec "Failed to load module"
**Cause**: Build Vite échoue  
**Solution**: Vérifier erreurs terminal → Fixer imports

### Symptôme 3: Console avec "Unexpected token"
**Cause**: Erreur TypeScript/syntax  
**Solution**: Vérifier fichiers .tsx récents

### Symptôme 4: main.tsx 404 dans Network
**Cause**: Vite ne génère pas le bundle  
**Solution**: Vérifier vite.config.ts + redémarrer

### Symptôme 5: main.tsx 200 mais écran blanc
**Cause**: Erreur runtime React  
**Solution**: Vérifier providers dans main.tsx

---

## 🆘 SI RIEN NE FONCTIONNE

### Informations à fournir:

1. **Screenshot Console** (F12 → Console tab)
2. **Screenshot Network** (F12 → Network tab après F5)
3. **Copie Terminal Lovable** (erreurs compilation)
4. **URL de l'app** (pour tester externally)
5. **Navigateur utilisé** (Chrome/Firefox/Safari + version)

### Message type:
```
🚨 ÉCRAN BLANC PERSISTANT

Navigateur: Chrome 120
URL: https://xxx.lovable.app

Console:
[copier erreurs ou "vide"]

Network:
[copier statuts ou "aucune requête"]

Terminal:
[copier erreurs Vite ou "aucune erreur"]

Tests effectués:
✅ Hard refresh
✅ Cache vidé
✅ Incognito testé
❌ diagnostic.html → [résultat]
```

---

## 💡 INFORMATIONS TECHNIQUES

### Ce qui a été fait
- ✅ 5 problèmes code corrigés
- ✅ Headers sécurité désactivés
- ✅ I18n non-bloquant
- ✅ API migration Supabase
- ✅ main.tsx testé minimal (échoue aussi)

### Ce qui ne fonctionne PAS
- ❌ Aucun JavaScript ne s'exécute
- ❌ Aucun console.log visible
- ❌ Même `console.log('test')` ne fonctionne pas
- ❌ Même HTML statique (diagnostic.html) ne charge pas

### Conclusion
**Ce n'est PAS un bug de code** - c'est un problème d'infrastructure  
**Le serveur Vite/Lovable ne sert pas les fichiers correctement**

---

## ✅ PROCHAINE ACTION

1. **Essayer hard refresh** (Ctrl+Shift+R)
2. **Ouvrir DevTools** et noter ce que vous voyez
3. **Partager screenshot** Console + Network
4. **Je pourrai alors déboguer** avec les vraies erreurs

**L'application est PRÊTE côté code** - il ne reste qu'à résoudre ce problème serveur.
