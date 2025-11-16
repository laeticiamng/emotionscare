# ⚡ GUIDE TEST RAPIDE - Une fois l'app chargée

## 🚀 Tests en 10 minutes (Critical Path)

### 1. Page d'accueil (30s)
```
✓ Ouvrir /
✓ Hero s'affiche
✓ Cliquer "Commencer"
```

### 2. Login/Register (2min)
```
✓ Aller /b2c/login
✓ Tester avec email invalide → erreur
✓ S'inscrire /b2c/register
✓ Vérifier validation email
✓ Login avec nouveau compte
✓ Redirection vers dashboard
```

### 3. Dashboard B2C (1min)
```
✓ Widgets chargent
✓ Pas d'erreur 403
✓ Stats s'affichent
✓ Navigation sidebar
```

### 4. Module Scan (1min)
```
✓ Aller /b2c/scan
✓ Permissions caméra
✓ Scan fonctionne
✓ Résultats s'affichent
```

### 5. AI Coach (2min)
```
✓ Aller /b2c/ai-coach
✓ Envoyer message
✓ Réponse IA arrive
✓ Historique sauvegarde
```

### 6. Settings (1min)
```
✓ Éditer profil
✓ Changer avatar
✓ Sauvegarder
✓ Toast confirmation
```

### 7. Logout (30s)
```
✓ Cliquer logout
✓ Redirection login
✓ Session cleared
```

### 8. B2B Admin (2min)
```
✓ Login /b2b/admin/login
✓ Dashboard admin
✓ Voir teams
✓ Accès reports
```

---

## 🔥 Tests Critiques Sécurité (5min)

### RLS Check
```sql
-- User A login
-- Try to access User B data
-- Should get 403 or empty
```

### Input Validation
```
✓ Email: test@test → REJECT
✓ Password: 123 → REJECT (too short)
✓ XSS: <script>alert(1)</script> → SANITIZED
```

### Authentication
```
✓ Access /dashboard without auth → redirect /login
✓ Session timeout after 24h
✓ Refresh token works
```

---

## 📊 Tests Performance (2min)

```
✓ Homepage < 3s load
✓ Dashboard < 2s load
✓ No console errors
✓ No 404 requests
✓ Images load lazy
```

---

## ♿ Tests Accessibilité (1min)

```
✓ Tab navigation fonctionne
✓ Skip links présent
✓ Focus visible
✓ ARIA labels corrects
```

---

## ✅ Si TOUS ces tests passent

**L'application est à ~80% fonctionnelle**

Ensuite, passer aux tests approfondis de l'audit complet.
