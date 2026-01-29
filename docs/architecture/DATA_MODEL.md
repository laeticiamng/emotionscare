# Schéma des modèles de données

Ce document présente un aperçu des tables de la base PostgreSQL gérée via Supabase. Les modèles sont regroupés par fonctionnalité et les relations principales sont indiquées lorsqu'elles existent.

## Tables principales


### ai_generated_content
- **id** : identifiant primaire
- **identifier** : clé de référence
- **title** : titre du contenu
- **content** : données JSON générées par l'IA
- **content_type** : type de contenu (texte, image, etc.)

### badges
- **id** : identifiant primaire
- **user_id** : utilisateur récompensé
- **name** : nom du badge
- **description** : détails du badge
- **awarded_at** : date d'obtention

### buddies
- **id** : identifiant primaire
- **user_id** : utilisateur courant
- **buddy_user_id** : identifiant du partenaire
- **date** : date de création

### chat_conversations
- **id** : identifiant primaire
- **user_id** : propriétaire de la discussion
- **title** : titre de la conversation
- **last_message** : dernier message

### chat_messages
- **id** : identifiant primaire
- **conversation_id** : référence à `chat_conversations`
- **sender** : expéditeur
- **text** : contenu du message
- **timestamp** : date d'envoi

Relation : `conversation_id` → `chat_conversations.id`

### comments
- **id** : identifiant primaire
- **post_id** : référence à `posts`
- **user_id** : auteur du commentaire
- **content** : texte du commentaire
- **date** : date de création

Relation : `post_id` → `posts.id`

### Digital Medicine
Table simple stockant les inscriptions au programme « Digital Medicine ».

### ecos_situations_complete
Stockage du contenu complet d'une situation d'enseignement numérique.

### edn_items
- **id** : identifiant primaire
- **item_number** : numéro de l'élément
- **title** : titre
- **specialty** : spécialité
- **has_link** / **has_recommendation** : informations supplémentaires


### emotions
Journal des émotions d'un utilisateur (texte, score, audio, etc.).

### clinical_signals
Stockage des signaux cliniques émotionnels capturés par différents instruments.
- **id** : identifiant primaire
- **user_id** : utilisateur concerné
- **source_instrument** : source du signal (scan_camera, SAM, scan_sliders)
- **domain** : domaine du signal (emotional)
- **level** : niveau d'intensité (0-4)
- **window_type** : type de fenêtre temporelle (instant, session)
- **module_context** : contexte du module (scan, assess)
- **metadata** : données JSON (valence, arousal, emotion, confidence, summary)
- **created_at** : date de création
- **expires_at** : date d'expiration

Utilisé pour :
- Historique émotionnel personnel de chaque utilisateur
- Génération de micro-gestes personnalisés via IA
- Génération musicale basée sur l'historique émotionnel
- Analyse des tendances émotionnelles

### groups
- **id** : identifiant du groupe
- **name** : nom du groupe
- **topic** : thème du groupe
- **members** : liste d'identifiants des membres

### invitations
Gestion des invitations à la plateforme avec un statut (enum `invitation_status`).

### item_situation_relations
- **id** : identifiant
- **item_id** : référence vers `edn_items`
- **situation_id** : référence vers `starting_situations`

Relations :
- `item_id` → `edn_items.id`
- `situation_id` → `starting_situations.id`

### item_therapeutic_relations
- **id** : identifiant
- **item_id** : référence vers `edn_items`
- **therapeutic_id** : référence vers `therapeutic_classes`

Relations :
- `item_id` → `edn_items.id`
- `therapeutic_id` → `therapeutic_classes.id`

### journal_entries
Entrées du journal émotionnel d'un utilisateur avec feedback IA optionnel.

### medilinko_consultations
Historique des consultations Medilinko.

### notifications
Table dédiée aux notifications utilisateur.

### official_content_cache
Cache de contenu officiel par numéro d'élément ou de situation.

### official_content_cache new
Nouvelle version du cache avec identifiant générique.

### posts
Fil de publications utilisateur.

### profiles
Profil des utilisateurs (rôle, préférences, avatar...).

### rituals
Rituels programmés par l'utilisateur.

### starting_situations
Liste des situations de départ disponibles.

### therapeutic_classes
Catalogue de classes thérapeutiques.

### urge_gpt_queries
Historique des requêtes passées à UrgeGPT.

### urgegpt_protocols
Protocoles sauvegardés depuis UrgeGPT.

### urgent_protocols
Référentiel de protocoles d'urgence.

### user_favorite_flashcards
- **id** : identifiant
- **user_id** : utilisateur concerné
- **item_id** : référence vers `edn_items`

Relation : `item_id` → `edn_items.id`

## Enumérations
- **invitation_status** : `pending`, `accepted`, `expired`

Ce schéma est généré à partir du fichier `src/integrations/supabase/types.ts` et résume les tables ainsi que les principales clés étrangères utilisées dans la base Supabase du projet.
