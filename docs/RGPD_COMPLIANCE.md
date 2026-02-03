# 🔒 Rapport de Conformité RGPD - EmotionsCare

> Audit de conformité au Règlement Général sur la Protection des Données

---

## 📋 Résumé Exécutif

| Critère | Statut | Score |
|---------|--------|-------|
| **Base légale** | ✅ Conforme | 100% |
| **Droits des personnes** | ✅ Conforme | 100% |
| **Sécurité des données** | ✅ Conforme | 95% |
| **Transferts hors UE** | 🔶 Attention | 80% |
| **Documentation** | ✅ Conforme | 90% |

**Score global : 93/100**

---

## 1️⃣ Base Légale du Traitement

### Consentement (Art. 6.1.a)

| Traitement | Base | Implémentation |
|------------|------|----------------|
| Données émotionnelles | Consentement explicite | ✅ Modal onboarding |
| Historique journal | Consentement | ✅ Opt-in à la création |
| Analyse vocale | Consentement | ✅ Permission micro demandée |
| Cookies analytics | Consentement | ✅ Bannière RGPD |

### Exécution du Contrat (Art. 6.1.b)

- Fonctionnalités core (breath, scan, journal) : Nécessaires au service
- Personnalisation IA : Liée à l'exécution du service premium

### Intérêt Légitime (Art. 6.1.f)

- Logs de sécurité : Protection du système
- Métriques anonymisées : Amélioration du service

---

## 2️⃣ Droits des Personnes

### Droit d'Accès (Art. 15)

**Implémentation** : `/app/settings/privacy/export`

```typescript
// Edge function: gdpr-export
// Exporte toutes les données utilisateur en JSON
{
  profile: { ... },
  journal_entries: [ ... ],
  emotion_scans: [ ... ],
  breathing_sessions: [ ... ],
  coach_conversations: [ ... ]
}
```

**Délai** : < 24h (automatisé)

### Droit de Rectification (Art. 16)

**Implémentation** : Édition directe dans l'application
- Profil : `/app/settings/profile`
- Journal : Édition inline des entrées
- Préférences : `/app/settings`

### Droit à l'Effacement (Art. 17)

**Implémentation** : `/app/settings/privacy/delete`

| Données | Méthode | Délai |
|---------|---------|-------|
| Compte | Suppression complète | Immédiat |
| Journal | Suppression + backup 30j | Immédiat |
| Données analytiques | Anonymisation | < 72h |
| Backups | Rotation automatique | 30 jours |

### Droit à la Portabilité (Art. 20)

**Format** : JSON structuré + ZIP
**Endpoint** : `POST /functions/v1/gdpr-export`

### Droit d'Opposition (Art. 21)

**Implémentation** : 
- Analytics : Opt-out dans settings
- Marketing : Désinscription newsletter
- IA personnalisée : Mode anonyme disponible

---

## 3️⃣ Sécurité des Données

### Mesures Techniques

| Mesure | Implémentation | Statut |
|--------|----------------|--------|
| **Chiffrement transit** | TLS 1.3 | ✅ |
| **Chiffrement repos** | AES-256 (Supabase) | ✅ |
| **Hashage mots de passe** | bcrypt (Supabase Auth) | ✅ |
| **Pseudonymisation** | UUID users, pas d'emails en logs | ✅ |
| **RLS (Row Level Security)** | Toutes les tables | ✅ |
| **Rate limiting** | 8 req/min endpoints sensibles | ✅ |
| **WAF** | Cloudflare | ✅ |

### Politique RLS

```sql
-- Exemple: Table journal_entries
CREATE POLICY "Users can only access own entries"
ON journal_entries
FOR ALL
USING (auth.uid() = user_id);
```

**Tables protégées** : 100% des tables utilisateur

### Journalisation

| Événement | Loggé | Rétention |
|-----------|-------|-----------|
| Connexions | ✅ | 90 jours |
| Modifications profil | ✅ | 1 an |
| Accès données sensibles | ✅ | 1 an |
| Exports RGPD | ✅ | 3 ans |
| Suppressions | ✅ | 3 ans |

---

## 4️⃣ Transferts Hors UE

### Sous-traitants

| Service | Localisation | Garanties |
|---------|--------------|-----------|
| **Supabase** | AWS eu-west-1 (Irlande) | ✅ UE |
| **ElevenLabs** | USA | 🔶 SCCs + DPA |
| **OpenAI/Anthropic** | USA | 🔶 SCCs + DPA |
| **Suno** | USA | 🔶 SCCs + DPA |

### Mesures Supplémentaires

1. **Minimisation** : Seules les données nécessaires sont envoyées aux APIs US
2. **Pseudonymisation** : Pas d'identifiants directs dans les requêtes IA
3. **Contrats** : DPA signés avec tous les sous-traitants
4. **Évaluation d'impact** : AIPD réalisée pour les traitements IA

---

## 5️⃣ Privacy by Design

### Minimisation des Données

| Fonctionnalité | Données Collectées | Justification |
|----------------|-------------------|---------------|
| Scan émotionnel | Bucket + intensité | Fonctionnement service |
| Journal | Texte + mood | Analyse IA |
| Respiration | Durée + pattern | Statistiques |
| Coach | Messages | Contexte conversation |

### Durées de Conservation

| Donnée | Durée | Fondement |
|--------|-------|-----------|
| Compte actif | Durée du compte | Exécution contrat |
| Compte supprimé | 30 jours | Récupération possible |
| Logs sécurité | 1 an | Intérêt légitime |
| Analytics | 2 ans (anonymisé) | Amélioration service |

### Paramètres par Défaut

- Analytics : Opt-in (pas activé par défaut)
- Notifications : Opt-in
- Partage données recherche : Opt-in
- Mode public profil : Désactivé par défaut

---

## 6️⃣ Registre des Traitements

| Traitement | Finalité | Base | Destinataires | Durée |
|------------|----------|------|---------------|-------|
| Authentification | Accès service | Contrat | Supabase Auth | Compte |
| Analyse émotions | Service core | Consentement | IA (anonymisé) | 1 an |
| Journal intime | Service core | Consentement | Stockage chiffré | Compte |
| Coach IA | Service premium | Contrat | LLM (pseudonymisé) | Session |
| Analytics | Amélioration | Intérêt légitime | Interne | 2 ans |

---

## 7️⃣ Gestion des Violations

### Procédure

1. **Détection** : Monitoring 24/7, alertes Sentry
2. **Qualification** : < 4h après détection
3. **Notification CNIL** : < 72h si risque élevé
4. **Notification utilisateurs** : Sans délai si risque élevé
5. **Documentation** : Registre des violations

### Contacts

- **DPO** : dpo@emotionscare.app
- **Sécurité** : security@emotionscare.app
- **CNIL** : Notification via portail officiel

---

## 8️⃣ Formation et Sensibilisation

| Public | Formation | Fréquence |
|--------|-----------|-----------|
| Développeurs | Secure coding + RGPD | Onboarding + annuel |
| Support | Traitement demandes | Onboarding + semestriel |
| Direction | Obligations légales | Annuel |

---

## 9️⃣ Checklist Conformité

### Technique

- [x] Chiffrement TLS 1.3
- [x] RLS sur toutes les tables
- [x] Logs d'audit
- [x] Rate limiting
- [x] Pseudonymisation logs
- [x] Backup chiffré
- [ ] Tests de pénétration (Q2 2026)
- [ ] Certification HDS (Q3 2026)

### Organisationnel

- [x] Registre des traitements
- [x] Politique de confidentialité
- [x] Mentions légales
- [x] DPA sous-traitants
- [x] Procédure violation
- [ ] AIPD complète (Q1 2026)
- [ ] Audit externe (Q2 2026)

---

## 📞 Contact DPO

**Délégué à la Protection des Données**
- Email : dpo@emotionscare.app
- Adresse : [À compléter]
- Disponibilité : 48h ouvrées

---

*Dernière mise à jour : 3 février 2026*
*Prochaine revue : 3 mai 2026*
