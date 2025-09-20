# Communauté – Sécurité & Modération douce

Ce document résume la posture de sécurité pour la page `/app/community`.

## Lexique sensible surveillé

Les expressions suivantes déclenchent un auto-signalement silencieux (`community:auto-flag`) vers Sentry :

- « suicide »
- « me faire mal » (et variantes)
- « violence grave »
- « danger immédiat »
- « harcèlement »

Le contenu exact n’est jamais envoyé. Seule la longueur du message et le motif sont tracés.

## Processus de signalement utilisateur

1. L’usager clique sur **« Signaler doucement »** depuis une carte du feed.
2. Il sélectionne une raison et, s’il le souhaite, ajoute un message libre.
3. Un événement `community:report` est envoyé à Sentry (sans texte brut).
4. L’équipe de veille traite le ticket en priorisant les cas « danger immédiat ».

## Posture de réponse

- Toujours remercier le partage et inviter à l’écoute active.
- Proposer des formulations non directives (« Je suis là si tu veux parler »).
- Rediriger vers Social Cocon en rappelant les garde-fous lorsque la solitude est élevée.
- Préférer la co-construction plutôt que les conseils catégoriques.
