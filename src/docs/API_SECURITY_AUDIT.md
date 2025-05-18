# Audit de sécurisation des endpoints API

Cette analyse résume l'exposition des différentes fonctions Supabase hébergées dans `supabase/functions` et identifie les principaux risques de sécurité observés.

## Points observés

1. **Absence d'authentification**
   - Les fonctions sont servies via `serve` sans aucune vérification de jeton ou de session utilisateur.
   - Exemple : `supabase/functions/analyze-emotion/index.ts` n'effectue aucune validation d'identité avant d'appeler l'API OpenAI.

2. **CORS ouvert**
   - Toutes les fonctions définissent `Access-Control-Allow-Origin: *`, autorisant n'importe quel domaine à envoyer des requêtes.
   - Cette configuration facilite la consommation non autorisée des endpoints et l'exploitation potentielle des clés API côté serveur.

3. **Clés et privilèges étendus**
   - Certaines fonctions utilisent la `SUPABASE_SERVICE_ROLE_KEY` (ex. `send-invitation`). Sans restriction d'accès, un attaquant pourrait créer des invitations ou modifier des données sensibles.
   - Les clés OpenAI et autres services sont appelées depuis ces endpoints sans quota spécifique, exposant l'application à des coûts indésirables en cas d'abus.

4. **Validation d'entrée limitée**
   - Plusieurs endpoints acceptent des paramètres tels que `user_id`, `email` ou du contenu arbitraire sans contrôle approfondi.
   - Cela ouvre la porte à des abus (spam d'e-mails dans `send-invitation`, injections de données ou usages excessifs).

## Risques principaux

- **Abus d'API et surcoûts** : faute d'authentification, toute personne connaissant l'URL peut appeler librement les fonctions et consommer les crédits OpenAI ou manipuler la base Supabase.
- **Fuite ou modification de données** : l'utilisation de la clé `service_role` permet des opérations privilégiées. Sans contrôles, les données stockées peuvent être créées ou modifiées par des tiers non authentifiés.
- **Attaques par cross-site request** : les CORS permissifs permettent d'appeler les endpoints depuis n'importe quel site. Associé à l'absence d'authentification, cela renforce le risque d'automatisation de requêtes malveillantes.
- **Injection ou dépassement de capacité** : le contenu utilisateur est directement injecté dans des prompts ou stocké en base sans filtrage, pouvant entraîner des réponses IA non désirées ou un stockage massif de données non validées.

## Recommandations

1. **Mettre en place une authentification**
   - Vérifier les jetons Supabase ou un autre mécanisme avant de traiter la requête.
   - Restreindre l'usage de la clé `service_role` aux fonctions véritablement internes.
2. **Restreindre CORS**
   - Limiter `Access-Control-Allow-Origin` aux domaines de confiance (ex. votre frontend officiel).
3. **Valider et filtrer les entrées**
   - S'assurer que les paramètres (emails, IDs, contenus) respectent un format attendu et refuser ceux qui ne sont pas valides.
4. **Suivre et limiter l'usage**
   - Implémenter un suivi des appels par utilisateur et fixer des quotas pour éviter le spam et les coûts inattendus.

En durcissant ces points, l'application réduira fortement sa surface d'attaque et protègera mieux ses ressources et données.
