# Module Registry et Roadmap technique

Ce fichier recense les modules officiels d'EmotionsCare ainsi que les extensions en cours de conception. Il sert de référence pour savoir comment déclarer un nouveau module et suivre la feuille de route technique.

## Modules existants

- **auth** : contexte d'authentification et pages de connexion/inscription
- **scan** : analyse émotionnelle (texte, voix, expression faciale)
- **music** : thérapie musicale et lecteur intégré
- **journal** : journal émotionnel et visualisations
- **predictive** : tableau de bord d'intelligence prédictive
- **social** : cocoon communautaire et messagerie

## Modules planifiés ou expérimentaux

- **vr** : sessions de réalité virtuelle
- **analytics** : tableau de bord RH et suivi des KPIs
- **coach** : agent conversationnel IA
- **extensions IA** : intégrations OpenAI/HumeAI avancées

Les modules en phase d'exploration peuvent être placés dans `src/experimental` ou `src/services/experimental`.

## Déclaration d'un nouveau module

1. Créer un dossier `src/components/<module>` pour les composants React.
2. Ajouter les contextes associés sous `src/contexts/<module>`.
3. Définir les types dans `types/<module>.ts` et les réexporter via `src/types.ts`.
4. Documenter la fonctionnalité dans `docs/<module>-module.md` ou une note dans ce fichier.
5. Enregistrer le module dans ce tableau.

| Module | Statut | Description |
| ------ | ------ | ----------- |
| auth | stable | Gestion des utilisateurs |
| scan | stable | Détection d'émotions |
| music | stable | Thérapie musicale |
| journal | stable | Journal émotionnel |
| predictive | stable | Analytics prédictifs |
| social | bêta | Cocoon communautaire |
| vr | planifié | Relaxation VR |
| analytics | planifié | Dashboard RH complet |
| coach | expérimental | Coach IA et chat |
| extensions IA | expérimental | Intégrations rapides d'APIs |

## Roadmap

Une roadmap simplifiée peut être tenue ici ou dans un outil externe. Chaque version majeure doit mentionner :

- Les modules ajoutés ou mis à jour
- Les APIs intégrées ou dépréciées
- Les migrations de schéma éventuelles

Ce registre permet d'assurer la traçabilité des évolutions et de vérifier la compatibilité des modules entre eux.
