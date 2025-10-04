# 🌐 Module 9 - Audit Complet : Social (SocialCocon)

**Date:** 2025-01-XX  
**Statut:** ✅ **AUDIT COMPLET - 100%**  
**Criticité:** 🔴 HAUTE (données personnelles + interactions sociales)

---

## 📋 Vue d'ensemble

### Description
Module de réseau social interne permettant aux utilisateurs de :
- Créer et partager des posts
- Commenter et réagir aux publications
- Recevoir des notifications
- Rejoindre des espaces privés ("cercles")

### Chemins principaux
- `/app/social-cocon` (B2C)
- `/b2b/social-cocon` (B2B)
- `/app/community` (orchestration)

---

## 1. ✅ Architecture & Code

### Contexte principal
**Fichier:** `src/contexts/SocialCoconContext.tsx`

```typescript
interface SocialCoconContextType {
  posts: SocialPost[];
  addPost: (content: string, userId: string) => void;
  likePost: (postId: string, userId: string) => void;
  addComment: (postId: string, content: string, userId: string) => void;
  getNotifications: (userId: string) => SocialNotification[];
}
```

**✅ Points forts:**
- Architecture React Context bien structurée
- Types stricts dans `src/types/social.ts`
- Provider centralisé et réutilisable
- Hook `useSocialCocon()` exporté

**⚠️ Points d'attention:**
- Persistance localStorage uniquement (pas de Supabase)
- Pas de validation du contenu avant création
- Notifications en mémoire non persistées
- Pas de pagination pour les posts

### Composants
- ✅ `B2CSocialCoconPage.tsx` - Interface utilisateur B2C
- ✅ `B2BSocialCoconPage.tsx` - Interface B2B
- ✅ `RedirectToSocialCocon.tsx` - Redirection

### Orchestrateur
**Fichier:** `src/features/orchestration/socialCocon.orchestrator.ts`

```typescript
export const socialCoconOrchestrator: Orchestrator<SocialCoconLevels> = ({ 
  mspssLevel, 
  consented 
}) => {
  // Logique d'orchestration basée sur score MSPSS
}
```

**✅ Tests unitaires:** `socialCocon.orchestrator.spec.ts` (6 tests ✅)

---

## 2. ✅ Tests E2E

**Fichier:** `e2e/social-cocon.spec.ts`

### Couverture actuelle
```typescript
✅ Test 1: "promotes shared breaks and highlights private rooms"
  - Vérifie affichage pauses partagées
  - Valide présence boutons "Proposer le créneau"
  - Contrôle espaces privés ("Cercle")
  - Vérifie absence de chiffres dans UI
```

**✅ Points forts:**
- Test orchestration localStorage
- Mock des appels API (`session_text_logs`)
- Vérification accessibilité (roles ARIA)

**⚠️ Manques identifiés:**

### Tests E2E à ajouter (Priorité HAUTE)
```typescript
// ❌ Manquant - À ajouter
test('user can create a post', async ({ page }) => {
  // 1. Login
  // 2. Naviguer vers /app/social-cocon
  // 3. Créer un post
  // 4. Vérifier apparition dans le feed
});

test('user can like and comment on posts', async ({ page }) => {
  // 1. Like un post
  // 2. Ajouter un commentaire
  // 3. Vérifier notifications
});

test('content moderation filters profanity', async ({ page }) => {
  // 1. Tenter de créer post avec contenu inapproprié
  // 2. Vérifier rejet ou modération
});

test('posts are isolated by organization in B2B', async ({ page }) => {
  // 1. User org A ne voit pas posts org B
});
```

---

## 3. 🔒 Sécurité & Modération

### État actuel: ⚠️ **INSUFFISANT**

#### 3.1 Absence de modération IA

**Problème critique:**
```typescript
// src/contexts/SocialCoconContext.tsx:34
const addPost = (content: string, userId: string) => {
  const newPost: SocialPost = {
    id: Date.now().toString(),
    userId,
    content, // ❌ Aucune validation/modération
    createdAt: new Date().toISOString(),
    comments: [],
    reactions: []
  };
  setPosts(prev => [newPost, ...prev]);
};
```

**❌ Risques:**
- Spam et contenu inapproprié
- Harcèlement entre utilisateurs
- Partage d'informations sensibles
- Pas de détection de langage toxique

**✅ Solution recommandée:**

```typescript
// À créer: src/services/moderation/contentModerationService.ts
import { OpenAI } from 'openai';

interface ModerationResult {
  allowed: boolean;
  flagged: boolean;
  categories: string[];
  sanitized: string;
}

export const moderateContent = async (
  content: string
): Promise<ModerationResult> => {
  // 1. Modération OpenAI
  const moderation = await openai.moderations.create({
    input: content
  });
  
  // 2. Filtrage mots-clés personnalisés
  const customFiltered = applyCustomFilters(content);
  
  // 3. Sanitisation HTML
  const sanitized = sanitizeHtml(customFiltered);
  
  return {
    allowed: !moderation.results[0].flagged,
    flagged: moderation.results[0].flagged,
    categories: moderation.results[0].categories,
    sanitized
  };
};
```

**Migration du contexte:**
```typescript
const addPost = async (content: string, userId: string) => {
  // ✅ Modération avant création
  const moderation = await moderateContent(content);
  
  if (!moderation.allowed) {
    toast.error('Contenu non autorisé (langage inapproprié détecté)');
    return;
  }
  
  const newPost: SocialPost = {
    id: Date.now().toString(),
    userId,
    content: moderation.sanitized, // ✅ Contenu modéré
    createdAt: new Date().toISOString(),
    flagged: moderation.flagged, // ✅ Marqueur modération
    comments: [],
    reactions: []
  };
  
  // ✅ Sauvegarder en DB avec RLS
  await supabase.from('social_posts').insert(newPost);
};
```

#### 3.2 Absence de RLS Supabase

**Problème:** Posts stockés en localStorage → **Aucune sécurité**

**✅ Migration Supabase recommandée:**

```sql
-- Table: public.social_posts
CREATE TABLE public.social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  org_id UUID REFERENCES orgs(id), -- Pour isolation B2B
  content TEXT NOT NULL,
  flagged BOOLEAN DEFAULT false,
  moderation_score JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Utilisateurs voient leurs posts + posts de leur org
CREATE POLICY "Users view own org posts"
ON public.social_posts FOR SELECT
USING (
  auth.uid() = user_id 
  OR org_id IN (
    SELECT org_id FROM org_memberships 
    WHERE user_id = auth.uid()
  )
);

-- RLS: Utilisateurs créent leurs posts
CREATE POLICY "Users create own posts"
ON public.social_posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS: Utilisateurs modifient uniquement leurs posts
CREATE POLICY "Users update own posts"
ON public.social_posts FOR UPDATE
USING (auth.uid() = user_id);

-- RLS: Utilisateurs suppriment uniquement leurs posts
CREATE POLICY "Users delete own posts"
ON public.social_posts FOR DELETE
USING (auth.uid() = user_id);

-- Table: public.social_comments
CREATE TABLE public.social_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS pour comments (similaire)
ALTER TABLE public.social_comments ENABLE ROW LEVEL SECURITY;

-- Table: public.social_reactions
CREATE TABLE public.social_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  type TEXT NOT NULL CHECK (type IN ('like', 'love', 'support')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id) -- Un utilisateur = 1 réaction par post
);

ALTER TABLE public.social_reactions ENABLE ROW LEVEL SECURITY;
```

---

## 4. 🔐 RGPD & Anonymisation

### État actuel: ⚠️ **INSUFFISANT**

#### 4.1 Données personnelles exposées

**Problème:**
```typescript
// Types actuels (src/types/social.ts)
interface SocialPost {
  id: string;
  userId: string; // ❌ User ID exposé directement
  content: string;
  createdAt: string;
  comments: SocialComment[];
  reactions: Reaction[];
}
```

**❌ Risques RGPD:**
- User IDs exposés dans frontend
- Pas de pseudonymisation
- Historique complet accessible
- Pas de procédure de suppression

#### 4.2 Solutions RGPD

**✅ Pseudonymisation:**
```typescript
interface SocialPost {
  id: string;
  userId: string; // Interne uniquement (RLS)
  authorPseudo: string; // ✅ "User_ABC123" affiché
  content: string;
  anonymized: boolean; // ✅ Flag anonymisation
  createdAt: string;
  // ...
}

// Service de pseudonymisation
const getPseudonym = (userId: string): string => {
  const hash = crypto.createHash('sha256').update(userId).digest('hex');
  return `User_${hash.substring(0, 8)}`;
};
```

**✅ Droit à l'effacement:**
```typescript
// Edge function: supabase/functions/delete-user-social-data/index.ts
export const deleteUserSocialData = async (userId: string) => {
  // 1. Anonymiser les posts (pas de suppression immédiate)
  await supabase
    .from('social_posts')
    .update({ 
      content: '[Message supprimé]',
      anonymized: true,
      user_id: '00000000-0000-0000-0000-000000000000'
    })
    .eq('user_id', userId);
  
  // 2. Supprimer réactions
  await supabase
    .from('social_reactions')
    .delete()
    .eq('user_id', userId);
  
  // 3. Supprimer commentaires après 30 jours
  // (conserver temporairement pour contexte conversations)
};
```

**✅ Export de données:**
```typescript
// GET /api/social/export
export const exportUserSocialData = async (userId: string) => {
  const posts = await supabase
    .from('social_posts')
    .select('*')
    .eq('user_id', userId);
  
  const comments = await supabase
    .from('social_comments')
    .select('*')
    .eq('user_id', userId);
  
  return {
    posts: posts.data,
    comments: comments.data,
    exported_at: new Date().toISOString()
  };
};
```

---

## 5. 📊 Performance & Scalabilité

### Problèmes actuels

**❌ Pas de pagination:**
```typescript
// Charge TOUS les posts en mémoire
const [posts, setPosts] = useState<SocialPost[]>([]);
```

**✅ Solution - Pagination infinie:**
```typescript
const useSocialPosts = (orgId?: string) => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const loadMore = async () => {
    const { data } = await supabase
      .from('social_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(page * 20, (page + 1) * 20 - 1);
    
    if (data.length < 20) setHasMore(false);
    setPosts(prev => [...prev, ...data]);
    setPage(p => p + 1);
  };
  
  return { posts, loadMore, hasMore };
};
```

**❌ Pas de cache:**
```typescript
// Chaque navigation recharge tous les posts
```

**✅ Solution - React Query:**
```typescript
import { useQuery } from '@tanstack/react-query';

const useSocialPosts = (orgId?: string) => {
  return useQuery({
    queryKey: ['social-posts', orgId],
    queryFn: () => fetchPosts(orgId),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false
  });
};
```

---

## 6. 📝 Checklist complète

### Architecture ✅ COMPLÉTÉ
- [x] Context SocialCoconContext créé
- [x] Types TypeScript stricts
- [x] Hook useSocialCocon exporté
- [x] Orchestrateur avec tests unitaires
- [x] Composants B2C et B2B

### Tests E2E ⚠️ PARTIEL (1/5)
- [x] Test orchestration UI (1 test)
- [ ] Test création de post
- [ ] Test likes et commentaires
- [ ] Test notifications
- [ ] Test isolation org B2B

### Sécurité ❌ À FAIRE
- [ ] Modération IA (OpenAI Moderations API)
- [ ] Migration Supabase avec RLS
- [ ] Filtres personnalisés anti-spam
- [ ] Sanitisation HTML (DOMPurify)
- [ ] Rate limiting (5 posts/minute)

### RGPD ❌ À FAIRE
- [ ] Pseudonymisation user IDs
- [ ] Procédure d'anonymisation
- [ ] Endpoint export de données
- [ ] Endpoint suppression de données
- [ ] Conservation limitée (12 mois)

### Performance ❌ À FAIRE
- [ ] Pagination infinie
- [ ] Cache React Query
- [ ] Lazy loading images
- [ ] Optimisation re-renders

---

## 7. 🎯 Plan d'action (Priorité)

### Phase 1 - Sécurité critique (4-6h)
1. ✅ Créer tables Supabase avec RLS
2. ✅ Implémenter modération IA
3. ✅ Migrer contexte vers Supabase
4. ✅ Tests E2E posts/comments

### Phase 2 - RGPD (2-3h)
5. ✅ Pseudonymisation
6. ✅ Endpoints export/suppression
7. ✅ Documentation conformité

### Phase 3 - Performance (2h)
8. ✅ Pagination
9. ✅ React Query cache
10. ✅ Optimisations

---

## 8. 📊 Métriques finales

| Critère | Avant | Après (cible) | Statut |
|---------|-------|---------------|--------|
| Tests E2E | 1 | 5 | ⚠️ 20% |
| Modération IA | ❌ | ✅ | ❌ 0% |
| RLS Supabase | ❌ | ✅ | ❌ 0% |
| RGPD | ❌ | ✅ | ❌ 0% |
| Performance | localStorage | Pagination + cache | ❌ 0% |

**Statut global Module 9:** ⚠️ **40% opérationnel** (architecture OK, sécurité KO)

---

## ✅ Conclusion

### Points forts
- ✅ Architecture React solide
- ✅ Orchestration bien testée
- ✅ Types TypeScript stricts

### Points critiques
- ❌ **Sécurité insuffisante** (pas de modération)
- ❌ **RGPD non conforme** (user IDs exposés)
- ❌ **Pas de persistance DB** (localStorage uniquement)

**Recommandation:** Module fonctionnel mais **non production-ready**. Nécessite 8-11h de développement pour sécuriser et conformer RGPD.

---

**Document généré:** 2025-01-XX  
**Auteur:** Audit technique EmotionsCare  
**Prochaine révision:** Post-corrections sécurité
