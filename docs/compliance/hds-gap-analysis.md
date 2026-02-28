# Analyse d'écart HDS — EmotionsCare

> **Date** : 28/02/2026  
> **Statut** : En cours d'évaluation  
> **Auteur** : Équipe technique EmotionsCare

---

## 1. Objectif

Évaluer la conformité de la plateforme EmotionsCare vis-à-vis du référentiel **Hébergement de Données de Santé (HDS)** tel que défini par l'ASIP Santé / ANS.

## 2. Périmètre

| Composant | Hébergeur actuel | Données traitées |
|-----------|-----------------|------------------|
| Base de données (PostgreSQL) | Supabase (AWS eu-central-1) | Profils utilisateurs, entrées journal, scores émotionnels |
| Edge Functions | Supabase Edge (Deno Deploy) | Traitement IA, scoring, DSAR |
| APIs tierces | OpenAI (US), Hume AI (US) | Analyse émotionnelle, coaching IA |
| Frontend | Lovable Cloud / Vercel | Aucune donnée de santé stockée côté client |
| Stockage fichiers | Supabase Storage (AWS) | Exports PDF, avatars |

## 3. Les 6 exigences HDS et statut

### 3.1. Mise à disposition et maintien en condition opérationnelle de l'infrastructure
- **Statut** : ⚠️ Partiel  
- **Constat** : Infrastructure managée par Supabase. Pas de contrôle direct sur la maintenance.
- **Action** : Vérifier la certification HDS de Supabase ou envisager un hébergeur HDS certifié (OVHcloud, Scaleway).

### 3.2. Mise à disposition et maintien en condition opérationnelle de la plateforme d'hébergement
- **Statut** : ⚠️ Partiel  
- **Constat** : Supabase fournit PostgreSQL managé avec backups automatiques.
- **Action** : Obtenir le DPA de Supabase et vérifier les garanties de disponibilité.

### 3.3. Administration et exploitation du système d'information
- **Statut** : ✅ Conforme  
- **Constat** : RLS activé sur toutes les tables sensibles. Audit trail via `admin_changelog`.
- **Action** : Documenter les procédures d'exploitation.

### 3.4. Sauvegarde externalisée
- **Statut** : ⚠️ À vérifier  
- **Constat** : Backups Supabase automatiques (PITR). Pas de sauvegarde externalisée indépendante.
- **Action** : Mettre en place une sauvegarde externalisée hors Supabase.

### 3.5. Hébergement physique
- **Statut** : ❌ Non conforme  
- **Constat** : Supabase héberge sur AWS eu-central-1 (Francfort). Pas de certification HDS connue.
- **Action** : Migrer vers un hébergeur HDS certifié si les données sont qualifiées "données de santé".

### 3.6. Infogérance
- **Statut** : ⚠️ Partiel  
- **Constat** : Infogérance assurée par Supabase. Contrat standard, pas spécifique HDS.
- **Action** : Négocier un contrat HDS ou migrer.

## 4. Décision clé : les données sont-elles des "données de santé" ?

| Type de donnée | Qualification | Justification |
|---------------|--------------|---------------|
| Scores émotionnels (PANAS, auto-évaluation) | ⚠️ Zone grise | Auto-déclaratif, non diagnostique, mais potentiellement qualifiable |
| Entrées journal (texte libre) | ⚠️ Zone grise | Peut contenir des informations de santé mentale |
| Analyses IA (coaching) | 🔶 Probablement non-HDS | Contenu généré, non diagnostique |
| Profil utilisateur (nom, email) | ❌ Non HDS | Données personnelles classiques (RGPD standard) |

**Recommandation** : Adopter une approche **conservatrice** — traiter les scores émotionnels et journaux comme données sensibles nécessitant un niveau de protection élevé, même si la qualification HDS formelle reste à confirmer juridiquement.

## 5. Plan d'action

| # | Action | Priorité | Responsable | Échéance |
|---|--------|----------|-------------|----------|
| 1 | Consultation juridique sur la qualification HDS | P0 | Direction | S+2 |
| 2 | Obtenir DPA Supabase + certificats ISO 27001 | P0 | Tech Lead | S+1 |
| 3 | Évaluer hébergeurs HDS certifiés (OVHcloud, Scaleway) | P1 | Infra | S+4 |
| 4 | Chiffrement at-rest vérifié sur toutes les tables sensibles | P0 | DBA | S+1 |
| 5 | Mettre en place sauvegarde externalisée | P1 | Infra | S+4 |
| 6 | Documenter procédures d'exploitation | P1 | Tech Lead | S+3 |
