# Audit du module SocialCocon

Ce rapport dresse l'état actuel du module SocialCocon et propose une base technique
pour centraliser la logique du réseau social interne.

## Constat actuel

- Les pages `B2BUserCocon` et `B2BAdminSocialCocon` présentent un exemple de contenu
  statique sans persistance.
- Aucun contexte ou provider n'encapsule les interactions sociales.
- Les types relatifs aux posts ou commentaires ne sont pas regroupés.

## Implémentation minimale

Un `SocialCoconContext` est introduit sous `src/contexts` avec les hooks
`useSocialCocon`, `addPost`, `likePost`, `addComment` et `getNotifications`.
Les données sont stockées localement (localStorage) pour illustrer la
persistance en attendant l'intégration à Supabase ou à une API dédiée.
Les types stricts sont définis dans `src/types/social.ts`.

```
SocialCoconProvider
  └─ exposes posts, addPost, likePost, addComment, getNotifications
```

Ce provider pourra être injecté au niveau du layout général pour rendre ces
fonctionnalités accessibles dans l'ensemble de l'application.

## RGPD et évolutions prévues

- Les entités `SocialPost` possèdent un champ `anonymized` pour anticiper
  l'anonymisation automatique dans les contextes B2B.
- Le service de notifications expose les données par utilisateur pour
  faciliter le droit à l'export/suppression.
- Cette base est prête à accueillir une modération IA, des badges et une
  gamification plus avancée.

## Tests

Un test `socialCoconContextExports.test.ts` vérifie la présence des exports du
nouveau contexte. Des tests supplémentaires pourront valider les actions
(`addPost`, `likePost`, etc.) lorsqu'une librairie de test React sera ajoutée.
