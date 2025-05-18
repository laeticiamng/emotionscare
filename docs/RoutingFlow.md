# Flux d'accès principal

```mermaid
flowchart TD
    A[Accueil /] -->|Particulier| B[/b2c/login]
    A -->|Entreprise| C[/b2b/selection]
    C -->|Collaborateur| D[/b2b/user/login]
    C -->|Administration| E[/b2b/admin/login]
    B --> F[Dashboard B2C]
    D --> G[Dashboard B2B User]
    E --> H[Dashboard B2B Admin]
```

La page d'accueil reste toujours accessible publiquement. Les tableaux de bord sont protégés via `ProtectedRoute` selon le rôle de l'utilisateur.
