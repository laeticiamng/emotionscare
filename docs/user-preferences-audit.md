# Audit du module de préférences utilisateur

## Structure actuelle

- `src/contexts/UserPreferencesContext.tsx` expose les préférences mais un ancien `PreferencesContext` demeure.
- Les types `UserPreferences` et associés existaient à la fois dans `src/types/user.ts` et `src/types/preferences.ts`.
- Le contexte gère l'état en mémoire sans persistance automatique.

## Problèmes identifiés

1. **Duplication de types** entraînant des imports incohérents.
2. **Risque de contextes multiples** (`PreferencesContext` vs `UserPreferencesContext`).
3. **Couverture de test limitée** sur la logique de normalisation.
4. **Persistance minimale** des préférences côté client.

## Correctifs appliqués

- Centralisation des interfaces dans `src/types/preferences.ts`.
- Ajout d'`AccessibilityPreferences` et de la propriété `accessibility` dans `UserPreferences`.
- Mise à jour des imports et suppression des doublons dans `src/types/user.ts`.
- Création de tests unitaires basiques pour `normalizePreferences`.

## Recommandations

- Supprimer définitivement `PreferencesContext` pour éviter la divergence d'état.
- Ajouter une couche de persistance (localStorage ou Supabase) tout en respectant la RGPD.
- Étendre la couverture de test sur `updatePreferences` et la suppression des préférences.
