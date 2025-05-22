
# Document QA - Expérience Post-Login Particulier

Ce document liste les points de vérification pour assurer une expérience post-login fluide, rassurante et premium pour les utilisateurs particuliers.

## Transition Login → Dashboard

### Animation et feedback
- [ ] L'animation de transition apparaît immédiatement après la validation du login
- [ ] Le message "Connexion réussie" s'affiche clairement
- [ ] Le prénom de l'utilisateur s'affiche dans le message de bienvenue (si disponible)
- [ ] La barre de progression avance de manière fluide
- [ ] Les étapes s'enchaînent sans accroc (succès → bienvenue → chargement)
- [ ] Absence de flash blanc ou de "saut" visuel pendant la transition
- [ ] L'animation se termine proprement avant l'affichage du dashboard

### Personnalisation
- [ ] Le message de bienvenue contient le prénom de l'utilisateur
- [ ] Les textes de chargement sont informatifs et rassurants
- [ ] L'expérience est cohérente avec l'identité visuelle

## Chargement du Dashboard

### Comportement visuel
- [ ] Un loader est visible pendant le chargement des données du dashboard
- [ ] Apparition séquencée des différents modules (effet cascade)
- [ ] Aucun module n'apparaît incomplet ou partiellement chargé
- [ ] Animation subtile lors de l'apparition de chaque module
- [ ] Notification toast de bienvenue après le chargement complet

### Gestion des erreurs
- [ ] Message d'erreur empathique et humain en cas d'échec de chargement
- [ ] Bouton "Réessayer" visible et fonctionnel
- [ ] Absence de message d'erreur technique ou de code d'erreur
- [ ] Retour visuel immédiat lors des actions de l'utilisateur

## Responsive & Accessibilité

### Test responsive
- [ ] Mobile (320px-428px) : vérifier que les animations et transitions fonctionnent
- [ ] Tablette (768px-1024px) : vérifier l'affichage des modules en grille
- [ ] Desktop (>1024px) : vérifier l'espacement et les proportions

### Accessibilité
- [ ] Navigation au clavier possible (tabindex correct)
- [ ] Les éléments animés respectent la préférence `prefers-reduced-motion`
- [ ] Textes alternatifs pour les éléments visuels
- [ ] Contraste suffisant sur tous les textes et éléments interactifs
- [ ] Support des lecteurs d'écran (ARIA roles et labels)

## Test multi-navigateurs

- [ ] Chrome (dernière version)
- [ ] Firefox (dernière version)
- [ ] Safari (dernière version)
- [ ] Edge (dernière version)
- [ ] Safari mobile iOS (dernière version)
- [ ] Chrome Android (dernière version)

## Points d'attention particuliers

- [ ] Vérifier que le dashboard ne se charge pas plusieurs fois (double-rendu React)
- [ ] Vérifier que les animations fonctionnent correctement avec le mode sombre
- [ ] Tester le comportement lorsque la connexion Internet est lente
- [ ] S'assurer que les animations ne consomment pas trop de ressources CPU/GPU
- [ ] Vérifier que les animations ne causent pas de décalage de mise en page (layout shift)

## Procédure de test

1. Se déconnecter complètement (vider les cookies et le localStorage)
2. Accéder à la page d'accueil
3. Cliquer sur "Je suis un particulier"
4. Se connecter avec un compte de test
5. Observer la transition et chronométrer sa durée (idéal : 3-5 secondes)
6. Vérifier l'apparition progressive des modules sur le dashboard
7. Répéter sur différents appareils et navigateurs

## Résolution des problèmes courants

- **Flash blanc** : Vérifier les styles CSS de base et l'implémentation de l'AnimatePresence
- **Saccades** : Optimiser les animations pour utiliser uniquement opacity et transform
- **Non-affichage** : Vérifier les conditions dans useEffect et les états initiaux
- **Retard excessif** : Ajuster les délais dans les timeouts
