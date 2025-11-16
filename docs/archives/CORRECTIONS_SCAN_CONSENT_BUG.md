# ✅ CORRECTIONS - Bug Dialogue de Consentement

## 🐛 PROBLÈME IDENTIFIÉ

L'utilisateur cliquait sur les boutons du dialogue de consentement et voyait des clés i18n non traduites :
- `consent.title` au lieu du titre
- `consent.body` au lieu de la description
- `consent.accept` au lieu de "J'accepte"
- `consent.decline` au lieu de "Refuser"

**Cause** : Namespace `consent` manquant dans le système i18n.

## 🔧 CORRECTIONS APPLIQUÉES

### 1. Création des fichiers de traduction
- ✅ `src/lib/i18n/locales/fr/consent.ts` (français)
- ✅ `src/lib/i18n/locales/en/consent.ts` (anglais)

### 2. Traductions ajoutées
```typescript
{
  title: 'Consentement de participation',
  body: 'Nous collectons des données anonymes...',
  accept: 'J\'accepte',
  decline: 'Refuser',
  more: 'En savoir plus',
  revoked: 'Consentement révoqué',
  error: 'Erreur lors du chargement...',
  update_error: 'Erreur lors de la mise à jour...',
  granted: 'Consentement accordé',
  declined: 'Consentement refusé',
  mustConsent: {
    title: 'Consentement requis',
    description: 'Vous devez accepter...',
  }
}
```

### 3. Intégration dans le système i18n
- ✅ Import des fichiers `consent` dans `src/providers/i18n/resources.ts`
- ✅ Ajout de `'consent'` dans la liste des namespaces
- ✅ Enregistrement des ressources FR et EN

## 📋 FICHIERS MODIFIÉS

1. **Créés** :
   - `src/lib/i18n/locales/fr/consent.ts`
   - `src/lib/i18n/locales/en/consent.ts`

2. **Modifiés** :
   - `src/providers/i18n/resources.ts`

## 🎯 RÉSULTAT

- Dialogue de consentement maintenant traduit correctement ✅
- Plus de clés i18n brutes affichées ✅
- Support français et anglais ✅

## 🔍 PROBLÈMES SECONDAIRES DÉTECTÉS

Dans les network requests, j'ai aussi identifié :
1. ⚠️ `/me/feature_flags` retourne du HTML au lieu de JSON
2. ⚠️ Erreur 400 sur `journal_entries` : colonne `is_voice` n'existe pas

Ces problèmes nécessitent des corrections backend séparées.
