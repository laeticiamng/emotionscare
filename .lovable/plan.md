
# Audit visuel marketing et branding premium -- Round 2

## Bilan post-corrections precedentes

Les corrections P1-P7 du round precedent ont ete partiellement appliquees. Le hero, les stats, le CTA final et les feature cards utilisent desormais le vouvoiement. Cependant, **plusieurs problemes subsistent** et de nouveaux points ont ete identifies lors de cet audit visuel live.

**Score actuel : 8/10** -- En progression, mais 4 corrections restantes pour atteindre le niveau "premium irreprochable".

---

## Problemes identifies

### P1 -- HAUTE : Showcase Section -- tutoiement residuel (incoherence de ton)

La correction P3 du round precedent a harmonise le vouvoiement dans `AppleFeatureSection` et `AppleCTASection`, mais **`AppleShowcaseSection.tsx` contient encore du tutoiement** dans les 3 sous-features :

- Ligne 141 : "Interromps une crise en cours" (imperatif familier)
- Ligne 142 : "Recupere en 3 minutes" (imperatif familier)  
- Ligne 143 : "Force **ton** cerveau a couper" (tutoiement explicite)

Ces textes contrastent avec le vouvoiement utilise partout ailleurs et cassent la coherence du registre professionnel.

**Correction** : Reformuler en mode descriptif neutre ou imperatif formel :
- "Interrompre une crise en cours" ou "Stoppez une crise en cours"
- "Recuperez en 3 minutes"
- "Coupez le mental instantanement"

**Fichier** : `src/components/home/AppleShowcaseSection.tsx` (lignes 141-143)

### P2 -- MOYENNE : Couleurs hardcodees massives dans les composants secondaires

130 occurrences de couleurs Tailwind hardcodees (`from-amber-500`, `from-emerald-500`, `from-blue-500`, `from-indigo-500`, etc.) existent dans 15 fichiers du dossier `src/components/home/`. Les composants les plus touches :
- `OnboardingGuide.tsx` (4 gradients hardcodes)
- `QuickStartModules.tsx` (4 gradients hardcodes)
- `ActionButtons.tsx` (5 gradients hardcodes)
- `EnrichedHeroSection.tsx` (2 gradients hardcodes)

Bien que ces composants ne soient pas sur la homepage Apple actuelle (ils appartiennent a l'ancienne homepage), ils restent dans le codebase et pourraient etre utilises ailleurs.

**Correction** : Non prioritaire pour la publication. A traiter dans un sprint de dette technique dedie. Les composants de la homepage Apple (`AppleFeatureSection`, `AppleShowcaseSection`, etc.) utilisent deja les tokens semantiques (`from-primary to-accent`).

### P3 -- BASSE : Cookie banner couvre le scroll indicator du hero

Le cookie consent banner en bas de page masque l'indicateur de scroll anime du hero. L'utilisateur ne voit pas l'invitation a scroller tant qu'il n'a pas interagi avec la banniere.

**Correction** : Ajouter un `mb-20` ou `bottom-24` au scroll indicator pour le placer au-dessus de la zone du cookie banner. Ou accepter ce compromis temporaire car le banner disparait apres interaction.

**Fichier** : `src/components/home/AppleHeroSection.tsx` (ligne 198, classe `bottom-8` -> `bottom-24`)

### P4 -- BASSE : Logo texte seul -- manque un symbole visuel

Le header affiche "EmotionsCare" en texte brut sans icone ni symbole. Le footer utilise un coeur (Heart icon) a cote du nom. Cette incoherence reduit la reconnaissance de marque.

**Correction** : Ajouter l'icone Heart avant "EmotionsCare" dans le header, comme dans le footer.

**Fichier** : `src/components/home/AppleHomePage.tsx` (ligne 57, ajouter `<Heart className="h-5 w-5 text-primary" />` avant le texte)

---

## Resume des corrections par priorite

| Priorite | Correction | Fichier | Impact |
|----------|-----------|---------|--------|
| P1 Haute | Showcase : corriger tutoiement residuel (3 textes) | `AppleShowcaseSection.tsx` L141-143 | Coherence de ton |
| P2 Moyenne | Couleurs hardcodees (130 occurrences / 15 fichiers) | Multiple fichiers home/ | Dette technique (non bloquant) |
| P3 Basse | Scroll indicator masque par cookie banner | `AppleHeroSection.tsx` L198 | UX mineure |
| P4 Basse | Logo header sans icone Heart (incoherent avec footer) | `AppleHomePage.tsx` L57 | Branding |

---

## Details techniques d'implementation

### Correction P1 -- Tutoiement residuel Showcase
Dans `src/components/home/AppleShowcaseSection.tsx`, lignes 141-143, remplacer :
```text
{ title: "Stop", desc: "Interromps une crise en cours" }
{ title: "Reset", desc: "Récupère en 3 minutes" }
{ title: "Night", desc: "Force ton cerveau à couper" }
```
Par :
```text
{ title: "Stop", desc: "Stoppez une crise en cours" }
{ title: "Reset", desc: "Récupérez en 3 minutes" }
{ title: "Night", desc: "Coupez le mental instantanément" }
```

### Correction P3 -- Scroll indicator
Dans `src/components/home/AppleHeroSection.tsx`, ligne 198, changer `bottom-8` en `bottom-24`.

### Correction P4 -- Logo header
Dans `src/components/home/AppleHomePage.tsx`, ligne 53-58, ajouter l'import `Heart` depuis lucide-react et inserer `<Heart className="h-5 w-5 text-primary" />` dans le Link du logo.
