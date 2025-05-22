# Redirection automatique sur session expirée

Le contexte `AuthContext` s'appuie désormais sur `supabase.auth.onAuthStateChange` pour détecter toute expiration ou invalidation de session. Lorsqu'aucune session n'est active, l'état `isAuthenticated` passe à `false` et la route protégée active redirige l'utilisateur vers la page de connexion adaptée.

Chaque redirection déclenchée pour cause de session manquante est journalisée via `logSessionRedirect` (fichier `src/utils/securityLogs.ts`). Le log contient l'identifiant utilisateur lorsqu'il est disponible, la route visée et un horodatage.

Les composants `ProtectedRoute` appellent également `logSessionRedirect` lorsqu'un accès protégé est tenté sans session valide.
