# Audit technique internationalisation (i18n) & gestion multilingue

Ce document fait l'inventaire de la prise en charge actuelle des langues dans EmotionsCare et propose un plan d'optimisation complet.

## 1. État actuel de l'application

- La majorité des composants React intègrent directement des chaînes en français. Exemple : `ChatMessageItem.tsx` définit la locale française pour `date-fns`.
- Les fonctions serverless Supabase fixent elles aussi le français dans les prompts envoyés à OpenAI ou dans la transcription audio.
- Aucune structure de fichiers de traduction n'est présente (`/i18n` ou `/locales` manquant).
- Les dates et heures sont formatées en `fr-FR` via `Intl` ou `toLocaleDateString`.
- Les paramètres `language` transmis aux fonctions supabase ne sont pas exploités pour sélectionner une traduction.

## 2. Points de blocage identifiés

- **Textes statiques** : tout le contenu des pages est hardcodé en français, ce qui complique l'ajout d'autres langues.
- **Formats et timezone** : de nombreux appels `toLocaleDateString('fr-FR')` et `Intl.DateTimeFormat('fr-FR')` limitent la personnalisation.
- **API vocales** : la reconnaissance et la transcription imposent `fr-FR` (`useVoiceCommands.tsx` et `voice-to-text`), empêchant l'usage dans une autre langue.
- **Prompts IA** : plusieurs appels aux APIs OpenAI précisent « Réponds toujours en français », rendant toute réponse internationale impossible sans modification du prompt.

## 3. Recommandations de structuration

1. **Fichiers de traductions** :
   - Créer un dossier `/i18n` ou `/locales` avec des fichiers JSON par langue (`en.json`, `fr.json`, `es.json`, …).
   - Organiser les clés par modules (auth, dashboard, notifications…) pour faciliter la maintenance.
   - Ajouter une fonction de fallback vers la langue par défaut lorsque la clé n'existe pas.
2. **Librairie i18n** :
   - Intégrer `react-i18next` pour React côté client et `i18next` côté functions afin de mutualiser la logique de chargement.
   - Prévoir un stockage CDN ou base de données pour pouvoir mettre à jour les traductions sans re-déploiement.
3. **Détection et persistance** :
   - Implémenter un `LocaleService` vérifiant successivement :
     1. la préférence enregistrée en base pour l’utilisateur connecté ;
     2. la langue du navigateur (`navigator.language`) ;
     3. la région détectée via l’adresse IP.
   - Sauvegarder le choix de langue (backend + cookie) et permettre un changement “à la volée” dans l’interface.
4. **Service de dates/nombres** :
   - Centraliser les formats via un `DateTimeService` utilisant `Intl.DateTimeFormat` et `Intl.NumberFormat` en fonction de la locale sélectionnée.
   - Ajouter la gestion du fuseau horaire et de la devise.
5. **APIs Supabase** :
   - Faire transiter le paramètre `language` vers les prompts et récupérer les textes localisés depuis `/i18n`.
   - Prévoir un champ `language` pour chaque notification stockée en base.
6. **Historisation et qualité** :
   - Mettre en place un système de versionnage des fichiers de traduction (dépôt Git ou champ `version` en base).
   - Surveiller automatiquement les clés manquantes et générer un rapport dans le dashboard admin.

## 4. Conformité RGPD & localisation

- Décliner les politiques de confidentialité et de consentement par région/langue via `LegalService`.
- Utiliser des modèles distincts pour le texte légal (CNIL pour la France, GDPR anglais, etc.).
- Conserver la trace de l’acceptation de ces textes par langue et par version.

## 5. Suggestions premium et plan d’évolution

1. **Traduction assistée par IA** :
   - Environnement de staging où les nouvelles clés sont automatiquement pré‑traduites par OpenAI ou DeepL pour accélérer les releases.
   - Possibilité de réviser/valider manuellement via un dashboard avant passage en production.
2. **Qualité automatisée** :
   - Script de vérification détectant les clés orphelines, les doublons et les incohérences de contexte.
   - Rapport d’utilisation par langue pour prioriser les efforts de traduction.
3. **Extensibilité API** :
   - Exposer un endpoint `/api/translations` pour récupérer toutes les clés d’une locale, avec cache CDN.
   - Prévoir un plugin pour brancher facilement d’autres services de traduction professionnels.
4. **Tests multilingues** :
   - Ajouter des suites de tests automatisés sur chaque langue supportée (affichage, formats, notifications).
   - Simuler différentes locales lors des tests end‑to‑end pour valider l’intégration complète.

## 6. Schéma d’API recommandé

```text
LocaleService
├── getCurrentLocale(): string
├── setLocale(lang: string): void
├── detectBrowserLocale(): string
└── loadTranslations(lang: string): Promise<Messages>

TranslationService
├── t(key: string, vars?: Record<string, unknown>): string
├── fetchFromExternal(lang: string): Promise<void>
└── version: string
```

## 7. Checklist de mise en œuvre

- [ ] Création des fichiers `/i18n/{lang}.json` avec les chaînes existantes.
- [ ] Intégration `react-i18next` et migration progressive des composants.
- [ ] Ajout d’un `LocaleService` pour gérer la détection et le stockage.
- [ ] Refactorisation des fonctions Supabase pour accepter le paramètre `language` et renvoyer les contenus localisés.
- [ ] Mise à jour des appels `toLocaleDateString` et `Intl` pour utiliser la locale dynamique.
- [ ] Ajout de tests unitaires et E2E par langue.

---

Ce plan doit permettre à EmotionsCare de devenir réellement multilingue, tout en garantissant performance et conformité légale.
