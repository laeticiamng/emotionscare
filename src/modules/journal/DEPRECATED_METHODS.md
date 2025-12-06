# Méthodes Deprecated du Journal Service

**Status** : ⚠️ AVERTISSEMENT - Méthodes dépréciées mais encore utilisées
**Date** : 15 novembre 2025
**Migration Target** : v2.0.0

---

## 📋 Résumé

Le `journalService` contient **5 méthodes deprecated** qui sont **encore utilisées** dans 4 fichiers. Ces méthodes doivent être remplacées progressivement.

---

## 🔴 Méthodes Deprecated

### 1. `saveEntry()` - PRIORITÉ HAUTE

**Statut** : Deprecated
**Problème** : API legacy avec champs `content`, `type`, `tone`, `ephemeral` non supportés
**Alternative** : `createTextEntry()` ou `createVoiceEntry()`

**Utilisé dans** :
- `src/modules/breath/logging.ts:71`
- `src/modules/flash-glow/journal.ts:128`
- `src/modules/flash-glow/__tests__/journal.test.ts` (tests)
- `src/modules/journal/useJournalMachine.ts:48` et `86`

**Migration** :
```typescript
// AVANT (deprecated)
await journalService.saveEntry({
  type: 'text',
  content: 'Mon texte',
  tone: 'neutral',
});

// APRÈS (recommandé)
await journalService.createTextEntry({
  text: 'Mon texte',
  tags: [],
});
```

---

### 2. `getEntries()` - PRIORITÉ MOYENNE

**Statut** : Deprecated
**Problème** : Retourne des champs legacy (`content`, `type`, `tone`, `ephemeral`)
**Alternative** : `getAllNotes()`

**Utilisé dans** :
- `src/modules/journal/useJournalMachine.ts:60` et `96`

**Migration** :
```typescript
// AVANT (deprecated)
const entries = await journalService.getEntries();

// APRÈS (recommandé)
const entries = await journalService.getAllNotes();
```

---

### 3. `processVoiceEntry()` - PRIORITÉ CRITIQUE ⚠️

**Statut** : Deprecated + **STUB**
**Problème** : **Retourne TOUJOURS des valeurs hardcodées** :
```typescript
{
  content: "Voice entry transcribed",  // ❌ PAS DE VRAIE TRANSCRIPTION
  summary: "Voice note",
  tone: 'neutral'
}
```

**Alternative** : Utiliser Whisper AI dans l'Edge Function
**Utilisé dans** :
- `src/modules/journal/useJournalMachine.ts:46`

**Migration nécessaire** :
```typescript
// AVANT (stub qui ne fait rien !)
const result = await journalService.processVoiceEntry(audioBlob);
// result = { content: "Voice entry transcribed", ... } ❌

// APRÈS (vraie transcription avec Whisper)
const transcription = await whisperService.transcribe(audioBlob);
await journalService.createVoiceEntry(transcription.text, tags);
```

**⚠️ BUG UTILISATEUR** : Les utilisateurs pensent que leur voix est transcrite, mais c'est un placeholder !

---

### 4. `processTextEntry()` - PRIORITÉ HAUTE ⚠️

**Statut** : Deprecated + **STUB**
**Problème** : **Aucune vraie analyse de sentiment** :
```typescript
{
  content: text,
  summary: text.substring(0, 47) + '...',  // Simple truncate
  tone: 'neutral'  // ❌ TOUJOURS 'neutral'
}
```

**Alternative** : Utiliser OpenAI pour analyse de sentiment
**Utilisé dans** :
- `src/modules/journal/useJournalMachine.ts:84`

**Migration nécessaire** :
```typescript
// AVANT (pas d'analyse réelle)
const result = await journalService.processTextEntry(text);
// result.tone = 'neutral' toujours ❌

// APRÈS (vraie analyse avec OpenAI)
const analysis = await openaiService.analyzeSentiment(text);
await journalService.createTextEntry({
  text,
  tags: analysis.suggestedTags,
});
```

**⚠️ BUG UTILISATEUR** : L'analyse de sentiment n'est jamais faite !

---

### 5. `burnEntry()` - PRIORITÉ BASSE

**Statut** : Deprecated
**Problème** : Concept d'entrées "éphémères" abandonné
**Alternative** : `archiveNote()`

**Utilisé dans** :
- `src/modules/journal/useJournalMachine.ts:186`

**Migration** :
```typescript
// AVANT
await journalService.burnEntry(entryId);

// APRÈS
await journalService.archiveNote(entryId);
```

---

### 6. `cleanupEphemeralEntries()` - PRIORITÉ BASSE

**Statut** : Deprecated (no-op)
**Problème** : Fonction vide qui ne fait rien
**Alternative** : Supprimer l'appel

**Utilisé dans** :
- `src/modules/journal/useJournalMachine.ts:191`

**Migration** :
```typescript
// AVANT
journalService.cleanupEphemeralEntries(); // Ne fait rien

// APRÈS
// Supprimer complètement l'appel
```

---

## 🛠️ Plan de Migration

### Phase 1 : Corrections Urgentes (Cette semaine)
- [x] Documenter les méthodes deprecated
- [ ] Ajouter console.warn() dans chaque méthode deprecated
- [ ] Créer issues GitHub pour chaque migration

### Phase 2 : Implémentations Réelles (Semaine 2-3)
- [ ] Implémenter vraie transcription vocale (Whisper AI)
- [ ] Implémenter vraie analyse de sentiment (OpenAI)
- [ ] Créer Edge Functions dédiées

### Phase 3 : Migration Code (Semaine 4)
- [ ] Migrer `useJournalMachine.ts`
- [ ] Migrer `breath/logging.ts`
- [ ] Migrer `flash-glow/journal.ts`
- [ ] Mettre à jour tests

### Phase 4 : Suppression (v2.0.0)
- [ ] Supprimer méthodes deprecated
- [ ] Breaking change release
- [ ] Migration guide pour utilisateurs

---

## 📊 Impact Utilisateur

| Méthode | Impact | Utilisateurs Affectés | Risque |
|---------|--------|----------------------|--------|
| `processVoiceEntry()` | 🔴 **CRITIQUE** | Tous les utilisateurs vocaux | **Haute priorité** - Aucune transcription réelle |
| `processTextEntry()` | 🔴 **HAUT** | Tous les utilisateurs texte | **Haute priorité** - Aucune analyse sentiment |
| `saveEntry()` | 🟡 **MOYEN** | Multiples modules | **Moyenne priorité** - Fonctionne mais API legacy |
| `getEntries()` | 🟡 **MOYEN** | useJournalMachine | **Moyenne priorité** - Retourne champs legacy |
| `burnEntry()` | 🟢 **BAS** | useJournalMachine | **Basse priorité** - Fonctionne (archivage) |
| `cleanupEphemeralEntries()` | 🟢 **BAS** | useJournalMachine | **Basse priorité** - No-op |

---

## 🔧 Services à Créer

### 1. Whisper Transcription Service

```typescript
// src/services/whisper.ts
export class WhisperService {
  async transcribe(audioBlob: Blob, lang: string = 'fr'): Promise<{
    text: string;
    confidence: number;
    duration: number;
  }> {
    const formData = new FormData();
    formData.append('file', audioBlob);
    formData.append('model', 'whisper-1');
    formData.append('language', lang);

    const response = await fetch('/api/whisper/transcribe', {
      method: 'POST',
      body: formData,
    });

    return response.json();
  }
}
```

### 2. Sentiment Analysis Service

```typescript
// src/services/sentiment.ts
export class SentimentAnalysisService {
  async analyze(text: string): Promise<{
    tone: 'positive' | 'neutral' | 'negative';
    confidence: number;
    emotions: string[];
    suggestedTags: string[];
  }> {
    const response = await fetch('/api/sentiment/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    return response.json();
  }
}
```

---

## ✅ Checklist Migration

### Pour Développeurs

- [ ] Lire ce document
- [ ] Vérifier si votre code utilise une méthode deprecated
- [ ] Créer une issue pour migrer votre code
- [ ] Tester la nouvelle implémentation
- [ ] Soumettre PR avec migration

### Pour QA

- [ ] Tester transcription vocale (Whisper)
- [ ] Tester analyse de sentiment (OpenAI)
- [ ] Vérifier que les nouveaux services fonctionnent
- [ ] Comparer résultats avant/après

---

## 📞 Support

**Questions** : Slack #emotionscare-dev
**Issues** : GitHub Issues avec tag `journal-migration`
**Documentation** : `/docs/journal-migration.md`

---

## 🚨 Action Immédiate Requise

**Développeurs** : NE PAS utiliser `processVoiceEntry()` et `processTextEntry()` dans nouveau code. Elles retournent des stubs !

**Product** : Informer les utilisateurs que les fonctionnalités vocale/sentiment seront améliorées prochainement.

---

**Dernière mise à jour** : 15 novembre 2025
**Auteur** : Claude AI Audit System
**Version** : 1.0.0
