# Guide Administrateur B2B / RH - EmotionsCare

## 🎯 Bienvenue dans votre console d'administration

Ce guide est destiné aux **Responsables RH**, **Managers** et **Administrateurs B2B** qui gèrent le déploiement d'EmotionsCare dans leur organisation.

---

## 🔑 Principes Clés de l'Administration

### Votre rôle d'administrateur

En tant qu'admin, vous pouvez :
- ✅ **Gérer les invitations** et accès collaborateurs
- ✅ **Consulter les statistiques agrégées** de l'équipe
- ✅ **Exporter des rapports** anonymisés
- ✅ **Configurer les paramètres** de l'organisation
- ✅ **Gérer les équipements** (casques VR, capteurs)

### Ce que vous NE pouvez PAS faire

❌ **Accéder aux données individuelles** des collaborateurs :
- Pas de lecture des journaux personnels
- Pas de consultation des résultats d'évaluations individuels
- Pas de visualisation des sessions VR individuelles
- Pas de tracking individuel de l'activité

**🔒 Principe RGPD** : Toutes les données affichées sont **agrégées** et **anonymisées**. La plateforme garantit qu'aucune donnée individuelle nominative n'est accessible aux administrateurs.

---

## 📱 Accès à la Console Admin

### Première connexion

1. Vous avez reçu un email **"Activation compte Admin EmotionsCare"**
2. Cliquez sur le lien d'activation
3. Créez votre mot de passe admin (min 14 caractères + 2FA obligatoire)
4. Scannez le QR code avec Google Authenticator
5. Sauvegardez les codes de récupération
6. Accédez à **`/app/rh`** (Dashboard RH)

**Badge admin** : Vous verrez le badge **🎓 Admin RH** dans le header.

### Dashboard RH - Vue d'ensemble

Votre tableau de bord affiche :
- 📊 **Métriques d'organisation** : KPIs globaux
- 📈 **Tendances hebdomadaires** : évolution du bien-être collectif
- 👥 **Taux d'engagement** : % de collaborateurs actifs
- 🏆 **Objectifs d'équipe** : suivi des cibles
- ⚠️ **Alertes** : signaux faibles détectés (anonymes)

---

## 👥 Gestion des Collaborateurs

### Inviter des collaborateurs

#### Invitation individuelle

1. Allez dans **"👥 Collaborateurs"**
2. Cliquez sur **"➕ Inviter"**
3. Renseignez :
   - **Email professionnel**
   - **Prénom** (optionnel, le collaborateur peut le modifier)
   - **Département** (ex: Marketing, IT, Finance)
   - **Équipe** (optionnel, pour regroupements)
4. Cliquez sur **"📧 Envoyer l'invitation"**

**Statut** : L'invitation passe en **"En attente"** jusqu'à activation par le collaborateur.

#### Invitation en masse (CSV)

1. Allez dans **"👥 Collaborateurs"**
2. Cliquez sur **"📤 Import CSV"**
3. Téléchargez le **modèle CSV** fourni
4. Remplissez le fichier :
   ```csv
   email,prenom,departement,equipe
   jean.dupont@company.com,Jean,IT,Dev Team
   marie.martin@company.com,Marie,RH,Admin
   ```
5. Uploadez le fichier
6. Vérifiez l'aperçu (détection des doublons)
7. Cliquez sur **"✅ Valider et envoyer"**

**Limite** : 500 invitations par batch.

### Suivi des invitations

Dans l'onglet **"Invitations"** :
- **En attente** : invitations envoyées mais pas encore acceptées
- **Acceptées** : collaborateurs actifs
- **Expirées** : invitations non utilisées après 30 jours
- **Relances** : bouton pour renvoyer l'invitation

**💡 Bonne pratique** : Relancez après 7 jours pour maximiser le taux d'adoption.

### Gestion des comptes actifs

#### Vue liste des collaborateurs

Colonnes affichées :
- **Email** : adresse professionnelle
- **Prénom** : si fourni
- **Statut** : 🟢 Actif / 🟠 Inactif (7j sans connexion) / 🔴 Compte désactivé
- **Dernière connexion** : date de la dernière activité
- **Taux d'utilisation** : % d'engagement sur 30j (faible/moyen/élevé)

**Tri & Filtres** :
- Par département
- Par équipe
- Par statut
- Par taux d'utilisation

#### Actions individuelles

Pour chaque collaborateur :
- **Voir le profil** : infos générales (pas de données personnelles)
- **Réinitialiser mot de passe** : si demande du collaborateur
- **Désactiver le compte** : suspendre l'accès temporairement
- **Supprimer le compte** : suppression définitive (RGPD)

**⚠️ Important** : La suppression entraîne la suppression de **toutes** les données du collaborateur dans les 30 jours (conformité RGPD).

### Gestion des équipes

#### Créer une équipe

1. Allez dans **"🏆 Équipes"**
2. Cliquez sur **"➕ Nouvelle équipe"**
3. Renseignez :
   - **Nom de l'équipe** (ex: "Équipe Marketing Digital")
   - **Description** (optionnelle)
   - **Manager** (sélection dans la liste)
   - **Département** rattaché
4. Ajoutez des **membres** via recherche par email
5. Cliquez sur **"💾 Créer l'équipe"**

**Hiérarchie** : Organisation > Département > Équipe > Membres.

#### Statistiques par équipe

Pour chaque équipe, vous pouvez consulter :
- 📊 **Taux d'engagement** : % de membres actifs
- 💓 **Cohérence moyenne** : score moyen de l'équipe
- 📈 **Tendance bien-être** : évolution sur 4 semaines
- 🎯 **Objectifs collectifs** : progression vers les cibles

**🔒 Anonymisation** : Si une équipe a moins de **5 membres**, les statistiques ne sont **pas affichées** pour préserver l'anonymat.

---

## 📊 Analytics & Rapports

### Métriques d'Organisation

#### KPIs Principaux

**Bien-être Collectif**
- **Cohérence cardiaque moyenne** : score agrégé de tous les collaborateurs actifs
- **Index de stress HRV** : indicateur de stress collectif (0-100, plus bas = mieux)
- **Score mindfulness** : présence mentale moyenne de l'organisation

**Engagement**
- **Taux d'utilisation** : % de collaborateurs ayant utilisé l'app cette semaine
- **Sessions moyennes/personne** : nombre moyen de sessions (respiration, VR, journal)
- **Durée moyenne/personne** : temps passé sur la plateforme par semaine

**Activité Physique (MVPA)**
- **MVPA moyen organisation** : minutes d'activité modérée à vigoureuse par semaine
- **% atteignant l'objectif OMS** : combien atteignent 150 min/semaine

#### Graphiques Temporels

**Évolution sur 12 mois** :
- Cohérence cardiaque
- Index de stress
- Taux d'engagement
- MVPA moyen

**Comparaison périodes** : Comparez mois N vs mois N-1, ou trimestre vs trimestre.

### Rapports Prédéfinis

#### Rapport Mensuel Global

**Contenu** :
- Résumé exécutif (1 page)
- KPIs principaux (évolution)
- Top 3 tendances positives
- Top 3 signaux d'alerte (anonymes)
- Recommandations RH

**Format** : PDF professionnel, exportable en un clic.

#### Rapport Bien-être par Département

**Filtres** :
- Sélectionner le département (Marketing, IT, Finance, etc.)
- Période (1 mois, 3 mois, 6 mois, 12 mois)

**Contenu** :
- Cohérence moyenne du département
- Comparaison avec la moyenne organisation
- Tendances spécifiques
- Recommandations ciblées

**🔒 Anonymisation** : Départements < 10 personnes = données masquées.

#### Rapport d'Engagement

**Indicateurs** :
- Taux d'adoption (% ayant créé un compte)
- Taux d'activation (% ayant utilisé au moins 1 fonctionnalité)
- Taux de rétention (% toujours actifs après 30j)
- Fonctionnalités les plus utilisées

**Export** : CSV pour analyse complémentaire (ex: Excel, Power BI).

### Rapports Personnalisés

#### Créer un rapport custom

1. Allez dans **"📊 Rapports"**
2. Cliquez sur **"🛠️ Créer un rapport personnalisé"**
3. Sélectionnez les **métriques** :
   - Cohérence cardiaque
   - Stress HRV
   - MVPA
   - Taux d'utilisation
   - etc.
4. Choisissez les **filtres** :
   - Département(s)
   - Équipe(s)
   - Période
5. Définissez la **fréquence** d'export :
   - Ponctuel
   - Hebdomadaire (tous les lundis)
   - Mensuel (1er du mois)
6. Cliquez sur **"📅 Planifier le rapport"**

**Envoi** : Le rapport est envoyé par email aux destinataires configurés (max 5 emails).

### Exporter les données

#### Export agrégé (CSV/Excel)

1. Allez dans **"📥 Exports"**
2. Sélectionnez le type de données :
   - Métriques hebdomadaires organisation
   - Statistiques par département
   - Taux d'engagement par période
3. Choisissez la période
4. Format : CSV ou Excel (.xlsx)
5. Cliquez sur **"⬇️ Télécharger"**

**⚠️ Important** : Les exports ne contiennent **aucune** donnée individuelle nominative, uniquement des agrégats.

#### API pour intégration BI

Si votre organisation utilise des outils BI (Power BI, Tableau, Looker) :
1. Allez dans **"⚙️ Paramètres > API"**
2. Générez une **clé API** sécurisée
3. Consultez la **documentation API** fournie
4. Intégrez les endpoints dans votre outil BI

**Endpoints disponibles** :
- `GET /api/v1/org/metrics` : métriques globales
- `GET /api/v1/org/departments` : stats par département
- `GET /api/v1/org/trends` : tendances temporelles

**Rate limit** : 100 requêtes/heure.

---

## 🎯 Gestion des Objectifs Collectifs

### Définir des objectifs d'organisation

1. Allez dans **"🎯 Objectifs"**
2. Cliquez sur **"➕ Nouvel objectif collectif"**
3. Renseignez :
   - **Nom** (ex: "Améliorer la cohérence cardiaque moyenne")
   - **Métrique cible** : Cohérence cardiaque
   - **Valeur cible** : 75% (actuellement à 68%)
   - **Échéance** : 31/03/2025
   - **Description** : Contexte et importance
4. Cliquez sur **"🚀 Lancer l'objectif"**

**Visibilité** : L'objectif est affiché sur le dashboard de **tous les collaborateurs** (opt-in, ils peuvent le masquer).

### Suivre les objectifs

**Dashboard Objectifs** affiche :
- **Progression** : % d'atteinte (ex: "72% → Objectif 75%")
- **Tendance** : évolution semaine après semaine
- **Prévision** : estimation d'atteinte à l'échéance (IA)
- **Actions recommandées** : suggestions RH pour accélérer

**Exemple d'action recommandée** :
> "🎯 Pour atteindre 75% de cohérence, encouragez 20% de collaborateurs supplémentaires à faire 1 session/jour. Communication interne suggérée : 'Challenge bien-être de mars'."

### Campagnes & Challenges

#### Lancer un challenge collectif

1. Allez dans **"🏆 Challenges"**
2. Cliquez sur **"➕ Nouveau challenge"**
3. Type de challenge :
   - **Respiration** : "30 jours de cohérence cardiaque"
   - **MVPA** : "150 min d'activité physique par semaine"
   - **Journal** : "7 jours d'écriture émotionnelle"
4. Paramètres :
   - Durée (7, 14, 30 jours)
   - Récompenses (badges, points)
   - Communication (email de lancement, rappels)
5. Cliquez sur **"🚀 Lancer le challenge"**

**Gamification** :
- **Classement anonyme** : Top 10 des participants (pseudonymes)
- **Badges** : décernés automatiquement à l'atteinte des paliers
- **Résultats collectifs** : "L'équipe a cumulé 15 000 minutes de respiration !"

---

## 🛠️ Configuration de l'Organisation

### Informations générales

1. Allez dans **"⚙️ Paramètres > Organisation"**
2. Modifiez :
   - **Nom de l'organisation** (affiché aux collaborateurs)
   - **Logo** (max 2 MB, PNG/JPG)
   - **Secteur d'activité** (Tech, Santé, Finance, etc.)
   - **Nombre de collaborateurs** (mis à jour automatiquement)
   - **Contact RH principal** (email et téléphone)

### Notifications & Communications

#### Emails automatiques

Configurez les emails envoyés aux collaborateurs :
- ✅ **Email de bienvenue** : à l'activation du compte
- ✅ **Rappels d'utilisation** : si inactif depuis 7 jours
- ✅ **Résumé hebdomadaire** : synthèse de la semaine
- ✅ **Alertes objectifs** : progression vers les cibles

**Personnalisation** : Modifiez le ton et le contenu via l'éditeur intégré.

#### Notifications push

- ✅ **Rappels sessions** : 10h, 14h, 16h (paramétrable)
- ✅ **Nouveaux contenus** : webinaires, articles
- ✅ **Challenges** : début/fin de challenges collectifs

**Fréquence** : Les collaborateurs peuvent ajuster individuellement dans leurs paramètres.

### Intégrations tierces

#### Connexion SIRH

Synchronisez EmotionsCare avec votre SIRH (Workday, SAP SuccessFactors, BambooHR) :
1. Allez dans **"⚙️ Paramètres > Intégrations"**
2. Sélectionnez votre SIRH
3. Fournissez les credentials API (chiffrés)
4. Mappez les champs :
   - Email professionnel ↔ Email SIRH
   - Département ↔ Department
   - Manager ↔ Supervisor
5. Activez la synchronisation (quotidienne ou hebdomadaire)

**Bénéfice** : Arrivées/départs automatiques, pas de gestion manuelle.

#### SSO (Single Sign-On)

Activez l'authentification via votre SSO d'entreprise :
- **SAML 2.0** (Okta, Azure AD, Google Workspace)
- **OAuth 2.0** (Microsoft, Google)

**Configuration** : Suivez le guide dédié fourni dans l'app (documentation technique).

### Gestion des équipements

#### Casques VR

Si votre organisation a investi dans des casques VR :
1. Allez dans **"🥽 Équipements > Casques VR"**
2. Cliquez sur **"➕ Ajouter un casque"**
3. Renseignez :
   - **Identifiant** : ex "VR-001"
   - **Modèle** : Oculus Quest 2, Pico 4, etc.
   - **Localisation** : Salle de repos, Bureau 3.12, etc.
   - **État** : Disponible / En maintenance
4. Cliquez sur **"💾 Enregistrer"**

**Réservation** : Les collaborateurs peuvent réserver un créneau via l'app.

#### Capteurs HRV

Si vous distribuez des capteurs de variabilité cardiaque :
1. **Équipements > Capteurs HRV**
2. **"➕ Ajouter un capteur"**
3. Renseignez le serial number et assignez à un collaborateur

**Synchronisation** : Les données remontent automatiquement dans EmotionsCare.

---

## ⚠️ Alertes & Signaux Faibles

### Comment fonctionnent les alertes ?

L'IA d'EmotionsCare détecte des **signaux faibles** collectifs (pas individuels) :
- **Baisse significative** de la cohérence cardiaque moyenne (-15% en 2 semaines)
- **Hausse du stress** collectif (+20% index HRV en 1 semaine)
- **Chute de l'engagement** (-30% d'utilisation sur 1 mois)
- **Département en difficulté** : écart > 20% vs moyenne organisation

### Consulter les alertes

1. Allez dans **"⚠️ Alertes"** (badge rouge si nouvelles)
2. Visualisez les alertes actives :
   - **Criticité** : 🔴 Élevée / 🟠 Moyenne / 🟡 Faible
   - **Périmètre** : Organisation / Département / Équipe
   - **Métrique concernée** : Cohérence, Stress, Engagement, etc.
   - **Évolution** : graphique des 4 dernières semaines
   - **Recommandations** : actions RH suggérées

**Exemple d'alerte** :
> 🟠 **Alerte Moyenne - Département IT**  
> **Baisse de cohérence cardiaque** : -18% en 2 semaines (de 72% à 59%)  
> **Contexte possible** : Projet de refonte infrastructure (charge élevée)  
> **Recommandation** : Organiser un webinaire "Gestion du stress en période de rush", proposer des sessions Flash Glow supplémentaires.

### Agir sur une alerte

Pour chaque alerte :
- **📋 Voir les détails** : graphiques, tendances, comparaisons
- **✉️ Communiquer** : envoyer un message ciblé au département concerné
- **🎯 Créer une action** : challenge, webinaire, formation
- **✅ Clôturer** : marquer comme traitée

**Historique** : Toutes les alertes passées sont archivées avec les actions menées.

---

## 📞 Support Admin

### Centre d'aide RH

- 📧 **Email prioritaire** : support-admin@emotionscare.app (réponse < 4h)
- 💬 **Chat dédié** : Lun-Ven, 8h-19h
- 📞 **Hotline urgence** : +33 1 XX XX XX XX (incidents critiques)

### Ressources pour RH

- 📚 **Base de connaissance** : [admin-help.emotionscare.app](https://admin-help.emotionscare.app)
- 🎥 **Webinaires RH** : formations mensuelles
- 👥 **Communauté RH** : échanges entre admins B2B

### Onboarding & Formation

Lors du déploiement initial, EmotionsCare propose :
- **Session de formation admin** (2h en visio)
- **Support à la communication interne** (templates emails, affiches)
- **Accompagnement personnalisé** pendant 3 mois

---

## ✅ Checklist : Déploiement Réussi

### Phase 1 : Préparation (Semaine -2)
- [ ] Configuration du compte organisation
- [ ] Import des collaborateurs (CSV ou SIRH)
- [ ] Configuration SSO (si applicable)
- [ ] Personnalisation des emails de bienvenue
- [ ] Préparation de la communication interne

### Phase 2 : Lancement (Semaine 0)
- [ ] Envoi des invitations en masse
- [ ] Email de lancement CEO/DRH
- [ ] Webinaire de présentation (optionnel)
- [ ] Support chat renforcé

### Phase 3 : Suivi (Semaines 1-4)
- [ ] Relance des non-activés (J+7)
- [ ] Monitoring du taux d'adoption
- [ ] Premier rapport mensuel
- [ ] Ajustements selon feedbacks

### Phase 4 : Optimisation (Mois 2-3)
- [ ] Lancement du 1er challenge collectif
- [ ] Analyse des tendances
- [ ] Formations avancées (VR, évaluations)
- [ ] Planification des objectifs long terme

---

## 🎉 Conseils pour Maximiser l'Impact

### 1. Communiquez régulièrement
**Fréquence recommandée** : 1 communication par mois minimum (newsletter, webinaire).

### 2. Soyez transparents sur l'anonymat
Rappelez que **les données individuelles sont strictement confidentielles**. Cela rassure et favorise l'adoption.

### 3. Gamifiez l'expérience
Lancez des **challenges** réguliers (ex: "Challenge cohérence de janvier"). La gamification booste l'engagement de +40%.

### 4. Montrez les résultats
Partagez les **statistiques agrégées positives** avec toute l'équipe (ex: "Cohérence moyenne +12% en 3 mois !").

### 5. Formez les managers
Les **managers de proximité** sont clés. Formez-les pour qu'ils encouragent l'utilisation (sans pression).

### 6. Intégrez dans la culture
Faites d'EmotionsCare un **outil du quotidien**, pas un gadget ponctuel. Intégrez-le dans les rituels d'équipe.

---

**Bon déploiement et bon pilotage du bien-être de vos équipes ! 🌟**

---

**Version** : 1.0 Admin  
**Dernière mise à jour** : Janvier 2025  
**Support Admin** : support-admin@emotionscare.app
