

# AUDIT DEFINITIF PRE-PRODUCTION - EmotionsCare

## PORTEE DE L'INTERVENTION

Cet audit couvre l'integralite de la plateforme observable : homepage, inscription, connexion, onboarding, scanner emotionnel, pages legales, tarifs, contact, FAQ, aide, a propos, footer, navigation, securite applicative, conformite RGPD et parcours utilisateur de bout en bout.

L'implementation des correctifs sera structuree en phases prioritaires.

---

## 1. RESUME EXECUTIF

**Verdict global : NON PUBLIABLE EN L'ETAT — OUI SOUS CONDITIONS (corrections P0/P1)**

**Note globale : 13,5/20 — Prometteuse mais pas production-grade**

La plateforme a un design premium de type Apple qui inspire confiance visuellement. La proposition de valeur est claire (soignants, 3 minutes, stress). Mais de nombreux problemes de coherence, fonctionnalites annoncees non implementees, frictions UX et manques legaux empechent une mise en production serieuse.

### Top 5 risques avant production
1. **FAQ mentionne Google/Apple sign-in** — non presente sur signup/login. Promesse non tenue = perte de confiance immediate
2. **Bouton "Commencer le protocole"** sur resultats du scanner — ne mene nulle part (pas de `onClick`). Promesse centrale cassee
3. **CGU trop maigres** — Pas de clause de mediation, droit applicable incomplet, pas de SIRET visible sur CGU
4. **Onboarding generique** — ne mentionne pas les soignants, parle de "bien-etre mental" generique. Deconnecte du positionnement
5. **37 modules annonces dans le footer** — impossible a verifier, cree une suspicion de feature-washing

### Top 5 forces reelles
1. Hero impactante avec proposition de valeur claire en moins de 3 secondes
2. Scanner emotionnel fluide, bien concu, avec recommandation de protocole pertinente
3. Accessibilite WCAG AA bien implementee (skip links, aria, roles, keyboard)
4. Pages legales completes (CGU, Confidentialite, Cookies, Mentions, CGV)
5. Architecture securite solide (RLS, auth Supabase, sanitisation XSS, pas de secrets exposes)

---

## 2. TABLEAU SCORE GLOBAL

```text
Dimension                    | Note | Observation                                      | Criticite   | Decision
-----------------------------|------|--------------------------------------------------|-------------|------------------
Comprehension produit        | 16   | Proposition claire, eyebrow + hero solides       | -           | Pret
Landing / Accueil            | 15   | Apple-style premium, mais 37 modules flou        | Majeur      | Corriger avant
Onboarding                   | 11   | Generique, deconnecte du positionnement soignant | Critique    | Refaire
Navigation                   | 14   | Coherente mais trop de liens footer              | Mineur      | Ajuster
Clarte UX                    | 13   | Bon sur pages cles, flou sur app dashboard       | Majeur      | Corriger
Copywriting                  | 14   | Hero excellent, onboarding/FAQ incoherents       | Critique    | Harmoniser
Credibilite / confiance      | 12   | Pas de temoignages, preuves sociales absentes    | Critique    | Ajouter
Fonctionnalite principale    | 14   | Scanner excellent, protocole non lie              | Bloquant    | Connecter
Parcours utilisateur         | 12   | Signup→Onboarding OK, post-onboarding flou       | Critique    | Clarifier
Bugs / QA                    | 13   | Bouton mort, FAQ mensongere                      | Bloquant    | Corriger
Securite preproduction       | 16   | RLS, auth solide, TEST_MODE off                  | Mineur      | Verifier cron
Conformite go-live           | 12   | CGU insuffisantes, cookies OK, SIRET absent CGU  | Critique    | Completer
```

---

## 3. PROBLEMES P0 — BLOQUANTS PRODUCTION

### P0-1. Bouton "Commencer le protocole" mort
- **Ou** : `ScannerEmotionnelPage.tsx` ligne 297-299
- **Probleme** : `<Button>` sans `onClick`. L'utilisateur termine le scan, recoit une recommandation, clique... et rien ne se passe
- **Impact** : La promesse centrale de la plateforme est rompue. L'utilisateur perd confiance immediatement
- **Correction** : Ajouter navigation vers le protocole recommande (`/app/breath`, `/app/protocols/stop`, etc.)

### P0-2. FAQ affirme Google/Apple sign-in inexistants
- **Ou** : `FAQPage.tsx` ligne 53 — "vous inscrire avec votre email ou via Google/Apple"
- **Probleme** : `SocialAuthButtons` existe mais n'est importe dans aucune page de login/signup
- **Impact** : Information mensongere visible publiquement. Destruction de confiance
- **Correction** : Soit integrer `SocialAuthButtons` dans login/signup, soit corriger le texte FAQ

### P0-3. Onboarding generique, deconnecte du positionnement
- **Ou** : `OnboardingPage.tsx`
- **Probleme** : Aucune mention des soignants, etudiants en sante, burn-out. Parle de "bien-etre mental" generique, "confiance en soi", "relations sociales" — qui n'est pas le coeur de la proposition
- **Impact** : L'utilisateur qui s'est inscrit pour le positionnement soignant se retrouve dans un onboarding generique. Rupture de coherence totale avec le hero "Gerez votre stress en 3 minutes"
- **Correction** : Reorienter les objectifs vers : gestion du stress professionnel, prevention du burn-out, recuperation entre gardes, gestion des emotions apres situations difficiles

---

## 4. PROBLEMES P1 — CRITIQUES

### P1-1. Aucune preuve sociale / temoignage
- Pas un seul temoignage, pas de nombre d'utilisateurs, pas de logo de partenaire
- "Basee sur les neurosciences" sans citation ni reference
- **Correction** : Ajouter section temoignages avec au minimum 3 citations (meme beta-testeurs). Ajouter "Creee par Dr Laeticia Motongane" visible sur la homepage, pas seulement sur /about

### P1-2. "37 modules" non verifiable
- Le footer dit "Fonctionnalites (37 modules)" — aucune page ne les liste clairement
- Cree une impression de feature-washing ou de produit inacheve
- **Correction** : Soit lister les 37 modules sur /features avec statut clair, soit retirer le chiffre

### P1-3. CGU juridiquement insuffisantes
- Pas de clause de mediation de la consommation (obligatoire en France)
- Pas de SIRET visible dans les CGU (present dans Mentions Legales mais pas CGU)
- Pas de clause de droit de retractation dans les CGU (seulement sur pricing)
- Section 8 "Limitation de responsabilite" trop vague juridiquement
- **Correction** : Completer avec mediateur, SIRET, retractation, loi applicable Art. L612-1 Code conso

### P1-4. Incoherence plan Gratuit vs Pro
- Le plan Gratuit liste "3 protocoles par jour (Stop, Reset, Respirez)" — mais la page scanner recommande aussi "Night" qui n'est pas dans le plan gratuit
- Le scanner ne verifie pas le plan de l'utilisateur avant de recommander
- **Correction** : Ajouter indication "Pro" sur recommandations premium, ou ajuster la logique

### P1-5. Post-onboarding : le dashboard n'oriente pas
- Apres onboarding, l'utilisateur arrive sur `/app/home` sans guidage clair
- Pas de premier pas guide, pas de "Faire votre premier scan"
- **Correction** : Ajouter un bloc "Welcome back" ou "Premier pas" sur le dashboard

---

## 5. PROBLEMES P2 — AMELIORATIONS FORTE VALEUR

### P2-1. Checkout Stripe ouvre en nouvelle fenetre
- `window.open(data.url, '_blank')` — comportement surprenant pour un paiement, souvent bloque par popup blockers
- **Correction** : `window.location.href = data.url` pour une redirection standard

### P2-2. Absence de page /features fonctionnelle
- Le header navigue vers `/features` mais le contenu est inconnu
- **Correction** : Creer une page features structuree ou rediriger vers la section homepage

### P2-3. Reseaux sociaux dans le footer non verifiables
- Twitter, LinkedIn, Instagram, YouTube listes — existent-ils reellement ?
- Liens morts = destruction de credibilite immediate
- **Correction** : Verifier existence de chaque reseau, retirer ceux qui n'existent pas

### P2-4. Cookie Banner dupliquee
- Deux implementations : `CookieBanner.tsx` et `CookieConsent.tsx` + `CookieConsent` dans `ui/`
- Source de confusion et potentiel double affichage
- **Correction** : Supprimer les doublons, garder uniquement `CookieBanner` du providers

### P2-5. Mentions Legales : date "30 aout 2025"
- `MentionsPage.tsx` ligne 144 — "mises a jour le 30 aout 2025" (dans le passe)
- Incoherent avec les autres pages legales datees "1 mars 2026"
- **Correction** : Harmoniser toutes les dates legales

---

## 6. PROBLEMES P3 — FINITION

- P3-1. `@ts-nocheck` sur FAQPage — signal de dette technique
- P3-2. Accents manquants dans le copywriting LoginPage ("Accedez a votre espace", "Retour a l'accueil")
- P3-3. Footer trop dense (10 liens "Plateforme" + 7 "Ressources" + 5 "Legal") — surcharge cognitive
- P3-4. `console.error` dans PricingPage ligne 224 — retirer avant production
- P3-5. `HomePage.tsx.unused` dans les pages — fichier mort a supprimer

---

## 7. SECURITE / GO-LIVE READINESS

```text
Element                      | Statut    | Action
-----------------------------|-----------|----------------------------------------
TEST_MODE.BYPASS_AUTH        | OK (false)| Aucune
RLS Supabase                 | OK        | Verifier toutes les tables manuellement
Secrets frontend             | OK        | Seuls VITE_* exposes (anon key)
XSS sanitisation             | OK        | DOMPurify + sanitizeInput en place
CORS                         | OK        | Configurable via env
Rate limiting                | OK        | Fastify rate-limit en place
Session management           | A verifier| Confirmer expiration token + refresh
RGPD export/deletion         | A verifier| Edge function gdpr-assistant existe, flux complet ?
Erreurs verboses             | Risque    | console.error en production a nettoyer
Cookie consent persistence   | A verifier| 2 implementations, lequel persiste ?
```

---

## 8. PLAN DE CORRECTIONS — IMPLEMENTATION

### Phase 1 : P0 Bloquants (a faire en premier)

**Tache 1** : Connecter le bouton "Commencer le protocole" du scanner aux protocoles reels
- Mapper chaque recommandation a une route existante
- Ajouter `onClick={() => navigate('/app/breath')}` ou equivalent

**Tache 2** : Corriger FAQ — retirer mention Google/Apple sign-in OU integrer `SocialAuthButtons` dans login/signup
- Option recommandee : corriger le texte FAQ (plus rapide, moins risque)

**Tache 3** : Refaire l'onboarding pour le positionnement soignant
- Remplacer les objectifs generiques par : "Gerer le stress entre deux gardes", "Prevenir l'epuisement professionnel", "Recuperer apres une situation difficile", "Mieux dormir malgre les horaires decales", "Gerer les emotions apres la perte d'un patient"
- Remplacer niveaux d'experience par : "Etudiant en sante", "Jeune diplome", "Professionnel experimente"
- Aligner les preferences sur le produit reel

### Phase 2 : P1 Critiques

**Tache 4** : Ajouter preuves sociales sur homepage
- Section temoignages (meme provisoire avec beta-testeurs)
- "Creee par Dr Laeticia Motongane, medecin" visible dans le hero ou juste en dessous
- Retirer "37 modules" du footer ou le justifier

**Tache 5** : Completer les CGU
- Ajouter clause mediation consommation
- Ajouter SIRET
- Ajouter clause retractation
- Renforcer limitation de responsabilite

**Tache 6** : Ajouter guidage post-onboarding sur dashboard
- Bloc "Premier pas" : "Faites votre premier scan emotionnel" avec CTA

**Tache 7** : Corriger logique recommandation scanner vs plan
- Badge "Pro" si le protocole recommande n'est pas dans le plan gratuit

### Phase 3 : P2 Ameliorations

**Tache 8** : Corriger checkout Stripe (`window.location.href` au lieu de `window.open`)
**Tache 9** : Harmoniser dates pages legales (toutes a "1 mars 2026")
**Tache 10** : Supprimer doublons CookieConsent
**Tache 11** : Corriger accents manquants sur LoginPage
**Tache 12** : Retirer `console.error`, `@ts-nocheck`, fichier `.unused`

---

## 9. VERDICT FINAL

La plateforme est **prometteuse mais pas prete**. Le design est premium, l'architecture technique est solide, la securite est correcte. Mais :

1. **La promesse centrale est cassee** : le scanner recommande un protocole avec un bouton qui ne fait rien
2. **L'onboarding trahit le positionnement** : un utilisateur soignant qui s'inscrit pour "gerer son stress en 3 minutes" se retrouve avec des objectifs de wellness generique
3. **Les preuves de credibilite sont absentes** : zero temoignage, zero preuve sociale, zero reference medicale visible

Si j'etais decideur externe : **je ne publierais pas aujourd'hui**. Les corrections P0 prennent 2-4 heures. Les P1 prennent 1-2 jours. Apres ces corrections, la plateforme serait publiable pour une beta ouverte.

**Les 3 corrections les plus rentables** :
1. Connecter le bouton "Commencer le protocole" (10 min, impact maximal)
2. Corriger la FAQ mensongere Google/Apple (5 min, elimine un risque legal)
3. Refaire l'onboarding soignant (2h, aligne tout le produit)

