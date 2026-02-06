

# Audit critique pre-publication -- Round final

## Score actuel : 9.2/10 -- Objectif : 9.7/10

Les rounds precedents ont corrige les problemes majeurs (header/footer sur /features, donnees fictives "des milliers d'utilisateurs", faux temoignage, hover glow, tokens hardcodes). Cet audit final se concentre sur les dernieres incoherences detectees.

---

## SYNTHESE UNIQUE

| # | Probleme | Gravite | Cause | Solution | Temps |
|---|---------|---------|-------|----------|-------|
| C1 | "Support 24/7" affiche dans le CTA final -- pas de support 24/7 reel | P0 | Texte marketing copie sans verification | Remplacer par "Made in France" ou "Approche scientifique" |  1 min |
| C2 | "30 jours d'essai gratuit. Aucune carte bancaire requise." -- offre non confirmee | P1 | Texte marketing non valide | Remplacer par "Gratuit pour commencer. Sans engagement." | 1 min |
| C3 | Dead code : 6+ composants homepage obsoletes avec donnees fictives (10K+, 95%, ISO 27001) | P1 | Accumulation de versions precedentes | Supprimer les fichiers non utilises | 5 min |
| C4 | "Certifie ISO 27001" dans les anciens composants (non acquis) | P0 (si affiche) | Donnee marketing fausse | Fichiers a supprimer (dead code, non affiches actuellement) | Inclus dans C3 |
| C5 | Font preload warning (inter-var.woff2 preloaded but not used) | P2 | Lien preload dans index.html sans utilisation | Retirer le preload ou s'assurer que la font est utilisee | 1 min |

---

## BLOC A -- Corrections obligatoires

### C1 -- "Support 24/7" faux dans AppleCTASection (P0)

**Fichier** : `src/components/home/AppleCTASection.tsx`, ligne 119-121

Le trust badge "Support 24/7" est affiche en bas du CTA final. La plateforme n'a pas de support 24/7 en place. C'est une affirmation mensongere.

**Correction** : Remplacer par "Made in France" (factuel et coherent avec le hero).

```
// Avant (ligne 119-121)
<span className="flex items-center gap-2">
  <div className="w-2 h-2 bg-accent rounded-full" />
  Support 24/7
</span>

// Apres
<span className="flex items-center gap-2">
  <div className="w-2 h-2 bg-accent rounded-full" />
  Made in France
</span>
```

### C2 -- "30 jours d'essai gratuit" non confirme (P1)

**Fichier** : `src/components/home/AppleCTASection.tsx`, lignes 58-61

La mention "30 jours d'essai gratuit. Aucune carte bancaire requise." engage contractuellement sans que l'offre soit definie. En phase de lancement, il vaut mieux une formulation souple.

**Correction** : Remplacer par "Gratuit pour commencer. Sans engagement. Annulez quand vous voulez."

### C3 -- Nettoyage dead code : composants homepage obsoletes (P1)

Les composants suivants ne sont PAS utilises par la homepage Apple active mais contiennent des donnees fictives (10K+ utilisateurs, 95% satisfaction, ISO 27001) qui pourraient etre accidentellement reutilises :

- `src/components/home/OptimizedHeroSection.tsx` (10K+, 95%, 24/7, 50+)
- `src/components/home/CtaSection.tsx` (ISO 27001, Support 24/7)
- `src/components/home/HeroSection.tsx` (10K+, 95%)
- `src/components/home/OptimizedFeaturesSection.tsx` (ISO 27001)
- `src/components/home/FeaturesSection.tsx` (ISO 27001)
- `src/components/home/TrustBadges.tsx` ("Certifie")

**Correction** : Ces fichiers sont du dead code. Ils doivent etre supprimes pour eviter toute reutilisation accidentelle de donnees fictives et pour reduire la taille du bundle. Avant suppression, verifier qu'aucune route ou import ne les reference.

---

## BLOC B -- Verifications confirmees OK

Les elements suivants ont ete audites et sont conformes :

- **Navigation** : MarketingLayout fonctionne sur /features, /login, /signup, /legal/* -- header et footer presents partout
- **Homepage Apple** : Hero clair en 3 secondes, CTA visible, badges factuels (Approche scientifique, Donnees protegees, Made in France)
- **Feature cards** : Statistiques factuelles (180s, 6 protocoles, 0 donnees vendues, 4 protocoles co-construits)
- **Stats section** : 4 protocoles, 3min, 100% RGPD, 24/7 disponibilite (plateforme accessible = OK)
- **Footer** : Liens sociaux desactives (spans non cliquables), liens legaux fonctionnels
- **Hover glow** : Corrige (opacity via Tailwind, pas de style inline)
- **Tokens** : `bg-green-500` au lieu de `bg-emerald-500` (corrige)
- **Tutoiement** : CommunityEngagement corrige en "vous"
- **Securite** : RLS actives, pas de secrets en frontend, CORS configure
- **RGPD** : Cookie banner, pages legales, infrastructure GDPR
- **Console** : Aucune erreur applicative (seulement des warnings Lovable postMessage et manifest CORS -- normaux en mode preview)
- **Mobile** : Hero responsive, header hamburger, CTA accessible, spacing correct

---

## BLOC C -- Tickets "Ready-to-ship"

| # | Titre | Priorite | Fichier(s) | Fix exact | Definition of Done |
|---|-------|----------|------------|-----------|-------------------|
| C1 | Remplacer "Support 24/7" par "Made in France" | P0 | `AppleCTASection.tsx` L119-121 | Changer le texte du trust badge | Le CTA final n'affiche aucune promesse non tenue |
| C2 | Reformuler l'offre d'essai gratuit | P1 | `AppleCTASection.tsx` L58-61 | "Gratuit pour commencer. Sans engagement." | Aucun engagement contractuel non defini |
| C3 | Supprimer les composants homepage obsoletes | P1 | 6 fichiers | Supprimer les fichiers apres verification d'imports | 0 composant avec donnees fictives dans le repo |

---

## Verdict pre-publication

**Apres application de C1 et C2 : READY TO PUBLISH = OUI**

C3 (nettoyage dead code) est fortement recommande mais non bloquant car ces composants ne sont pas affiches sur les pages actives.

Les 2 corrections bloquantes (C1 + C2) sont des changements de texte dans un seul fichier, realisables en moins de 2 minutes.

