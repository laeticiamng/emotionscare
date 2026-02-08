

# Audit complet et plan de remediation des modules non fonctionnels

---

## Etat des lieux

Le registre contient **~200 routes** pour **~150 composants**. Apres analyse du code source, voici la classification des modules par fonctionnalite reelle :

### Modules fonctionnels (aucune action requise) : ~25

Scanner, Musique, Coach IA, Journal, Respiration, Meditation, Flash Glow, Bubble Beat, Boss Grit, Ambition Arcade, Bounce Back, Story Synth, Mood Mixer, Screen Silk, VR Galaxy, VR Breath, Nyvee, Leaderboard, Weekly Bars, Entraide, Buddies, Dashboard, Profil, Parametres, Premium.

### Modules partiellement fonctionnels (UI OK, backend simule) : ~12

| Module | Route | Probleme |
|--------|-------|----------|
| Hume AI Realtime | `/app/hume-ai` | Edge function existe mais retourne des mocks si cle API absente. 2 tabs sur 3 desactives (Face, Prosody). UI fonctionnelle pour le texte. |
| Wearables | `/app/wearables` | Edge function `wearables-sync` existe. UI complete avec graphiques. Donnees mock pour tendances. Fonctionnel en mode demo. |
| Brain Viewer | `/app/brain-viewer` | Composants 3D complets (BrainViewer3D, BrainControls, EmotionOverlayPanel). Depend de hooks `useBrainData` et `useEmotionOverlay`. Visuellement impressionnant mais sans donnees reelles. |
| Context Lens | `/app/context-lens` | Delegue a `ContextLensDashboard` dans `src/features/context-lens`. Fonctionne si le feature existe. |
| Voice Analysis | `/app/voice-analysis` | Utilise `useHumeWebSocket`. Doublon fonctionnel du scan vocal dans `/app/scan`. |
| Workshops | `/app/workshops` | UI complete avec inscription, donnees mock localStorage. |
| Webinars | `/app/webinars` | UI complete avec inscription, donnees mock localStorage. |
| Integrations | `/app/integrations` | UI avec toggles, aucune integration reelle (Google Cal, Spotify, Slack, Notion). |
| Themes | `/app/themes` | Fonctionnel en local (localStorage) mais ne s'applique pas globalement. |
| Customization | `/app/customization` | UI avec switches, aucune persistance reelle. |
| Widgets | `/app/widgets` | Fonctionnel en localStorage. |
| Export PDF/CSV | `/app/export/pdf`, `/app/export/csv` | UI presente, aucun export reel. |

### Modules dev-only (a masquer pour les beta-testeurs) : ~6

| Module | Route | Raison |
|--------|-------|--------|
| API Keys | `/app/api-keys` | Outil developpeur, pas un module utilisateur |
| Webhooks | `/app/webhooks` | Outil developpeur |
| K6 Analytics | `/k6-analytics` | Monitoring interne |
| System Health | `/system-health` | Monitoring interne |
| Public API | `/app/api-docs` | Documentation technique |
| Test Accounts | `/dev/test-accounts` | Dev uniquement |

### Routes dupliquees a consolider : ~15

| Doublon | Route canonique |
|---------|----------------|
| `/app/communaute` | `/app/entraide` |
| `/app/social-cocon` | `/app/entraide` |
| `/app/feed` | `/app/entraide` |
| `/app/community` | `/app/entraide` |
| `/app/friends` | `/app/buddies` |
| `/app/groups` | `/app/entraide` |
| `/app/voice-analysis` | `/app/scan` (vocal) |
| `/app/auras` | `/app/leaderboard` |
| `/app/particulier` | `/app/home` |
| `/app/particulier/mood` | `/app/scan` |

---

## Probleme de fond

Le vrai probleme n'est pas que les modules sont "non fonctionnels" -- la plupart ont une UI complete. Le probleme est :

1. **Les modules experimentaux sont accessibles** sans avertissement clair
2. **Les doublons creent de la confusion** (5 chemins vers la communaute)
3. **Les outils dev sont melanges** avec les modules utilisateur
4. **Aucune hierarchie** : tout est au meme niveau dans le registre

---

## Plan d'action en 3 phases

### Phase 1 : Masquer les modules non pertinents pour les beta-testeurs

**Fichier : `src/routerV2/registry.ts`**

Ajouter un champ `status` aux routes non fonctionnelles ou dev-only :

Routes a marquer `hidden: true` (retirer du registre utilisateur) :
- `/app/api-keys` (dev-only)
- `/app/webhooks` (dev-only)  
- `/k6-analytics` (monitoring)
- `/system-health` (monitoring)
- `/app/api-docs` (dev-only)
- `/dev/test-accounts` (dev-only)
- `/app/voice-analysis` (doublon de scan vocal)
- `/app/auras` (doublon de leaderboard)

Routes a marquer comme `deprecated: true` et rediriger :
- `/app/communaute` -> `/app/entraide`
- `/app/social-cocon` -> `/app/entraide`
- `/app/feed` -> `/app/entraide`
- `/app/friends` -> `/app/buddies`
- `/app/groups` -> `/app/entraide`
- `/app/particulier` -> `/app/home`
- `/app/particulier/mood` -> `/app/scan`

### Phase 2 : Rendre fonctionnels les modules partiels (priorite haute)

**2a. Hume AI (`HumeAIRealtimePage.tsx`)** -- Ameliorations :
- Ajouter un bouton retour vers `/app/home`
- Remplacer les tabs desactives (Face, Prosody) par un message "Mode textuel uniquement" au lieu de tabs grises
- L'edge function `hume-analysis` existe et fonctionne deja en mode mock -- c'est acceptable

**2b. Wearables (`WearablesPage.tsx`)** -- Ameliorations :
- Ajouter un bouton retour vers `/app/home`
- Remplacer `loadTrends()` qui genere des mocks aleatoires par un etat vide propre ("Connectez un appareil")
- La page est deja bien construite avec tabs et graphiques

**2c. Brain Viewer (`BrainViewerPage.tsx`)** -- Ameliorations :
- Le lien retour pointe vers `/app` au lieu de `/app/home` -- corriger
- Ce module est fonctionnel visuellement (3D, shortcuts clavier) -- le laisser tel quel

**2d. Workshops / Webinars** -- Ameliorations :
- Ajouter un bouton retour vers `/app/home`
- Les pages sont fonctionnelles en localStorage -- acceptable pour une beta

**2e. Integrations (`IntegrationsPage.tsx`)** -- Ameliorations :
- Ajouter un bouton retour
- Ajouter un message "Integrations disponibles prochainement" sous le titre
- Desactiver les toggles (actuellement ils ne font rien, ce qui est trompeur)

**2f. Themes / Customization / Widgets** -- Ameliorations :
- Ajouter boutons retour
- Themes fonctionne en localStorage -- acceptable
- Customization/Widgets : ajouter persistance localStorage (deja fait pour Widgets)

**2g. Export PDF/CSV** -- Ameliorations :
- Ajouter boutons retour
- Connecter le bouton "Exporter" a un vrai telechargement (generer un PDF/CSV basique avec les donnees utilisateur disponibles)

### Phase 3 : Ajouter les modules au catalogue ModulesDashboard

**Fichier : `src/pages/ModulesDashboard.tsx`**

Ajouter les modules manquants du catalogue :
- Meditation (absent du catalogue mais fonctionnel)
- Screen Silk (absent)
- Nyvee (absent)
- VR Breath (absent)
- Voice Journal (absent)
- Seuil (absent)
- Face AR (absent)

---

## Resume des fichiers a modifier

| Fichier | Modifications |
|---------|--------------|
| `src/routerV2/registry.ts` | Marquer ~8 routes `hidden`, ~7 routes `deprecated` |
| `src/pages/HumeAIRealtimePage.tsx` | Bouton retour + simplifier tabs + message clair |
| `src/pages/WearablesPage.tsx` | Bouton retour + supprimer mocks trends |
| `src/pages/BrainViewerPage.tsx` | Corriger lien retour `/app` -> `/app/home` |
| `src/pages/WorkshopsPage.tsx` | Bouton retour |
| `src/pages/WebinarsPage.tsx` | Bouton retour |
| `src/pages/IntegrationsPage.tsx` | Bouton retour + desactiver toggles + message "prochainement" |
| `src/pages/ThemesPage.tsx` | Bouton retour |
| `src/pages/CustomizationPage.tsx` | Bouton retour + persistance localStorage |
| `src/pages/WidgetsPage.tsx` | Bouton retour |
| `src/pages/ExportPDFPage.tsx` | Bouton retour |
| `src/pages/ExportCSVPage.tsx` | Bouton retour |
| `src/pages/ModulesDashboard.tsx` | Ajouter ~7 modules manquants au catalogue |
| `src/routerV2/schema.ts` | Ajouter `hidden?: boolean` au type `RouteMeta` |

Total : **14 fichiers a modifier**. Aucun fichier a creer, aucune migration DB.

La priorite absolue est la Phase 1 (masquer les modules dev/doublons) car c'est ce qui genere le plus de confusion pour les beta-testeurs.

