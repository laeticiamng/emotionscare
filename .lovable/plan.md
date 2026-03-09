

# AUDIT BETA-TESTEUR NON TECHNIQUE — EmotionsCare

---

## RESUME EXECUTIF

**Ce que comprend un novice en arrivant :**
La homepage est claire sur l'essentiel : c'est un outil de gestion du stress pour soignants, avec des exercices courts. Le hero "Gérez votre stress en 3 minutes" fonctionne. La sous-ligne "pensés pour les soignants" positionne correctement. La promesse "gratuit pour commencer" rassure.

**Ce qu'il ne comprend PAS :**
1. La page est trop longue (9+ sections) — un novice décroche bien avant la fin
2. La section "Institutions & Recherche" avec son jargon (MBI-HSS, k-anonymat, CHSCT) terrorise un visiteur B2C lambda
3. Le chat flottant "Nyvee" en bas à droite apparait sans contexte — on ne sait pas ce que c'est ni pourquoi il est la
4. L'announcement banner "Essayez un exercice de respiration en 2 minutes" est redondant avec le hero
5. "Comment ca marche" scrolle vers "En bref" au lieu de la section "Comment ca marche" elle-meme

**5 PLUS GROS FREINS :**

1. **Surcharge de sections sur la homepage** — 9 sections avant le footer, beaucoup de repetition ("2-5 minutes", "gratuit", "pour soignants" repetes 6+ fois). Le visiteur ressent un discours marketing tourne en boucle plutot qu'une demonstration concrete.

2. **Section Institutionnelle sur la page B2C** — Un soignant individuel qui voit "k-anonymat", "CHSCT-ready", "Export recherche" pense qu'il n'est pas au bon endroit. Cette section detruit la simplicite du message B2C.

3. **Le bouton "Comment ca marche" dans le hero scrolle vers la mauvaise section** — Il cible `#geo-summary-heading` (la section "En bref") au lieu de la section "Comment ca marche" avec les 3 etapes. Friction immediate.

4. **Repetition de CTA identiques** — "Essayer gratuitement" / "Commencer gratuitement" apparait au moins 5 fois sur la meme page sans variation de proposition. Le visiteur finit par ignorer ces boutons.

5. **Aucune preuve sociale reelle** — Pas de nombre d'utilisateurs, pas de temoignages reels, pas de logos partenaires. La section "Social Proof" ne contient que des principes generiques. Un novice se demande : "Est-ce que quelqu'un utilise vraiment ca ?"

**5 PRIORITES ABSOLUES :**

1. Reduire la homepage a 5-6 sections maximum (Hero > Comment ca marche > Modules > Social Proof > CTA)
2. Supprimer la section Institutionnelle de la homepage B2C (la deplacer vers /b2b)
3. Fixer le scroll du bouton "Comment ca marche" vers la bonne section
4. Varier les CTA — chaque section devrait avoir un angle different
5. Ajouter au moins un element de preuve sociale concret (meme "En cours de lancement" est plus honnete que rien)

---

## TABLEAU D'AUDIT COMPLET

| Priorite | Page / Zone | Probleme observe | Ce que ressent un novice | Impact UX/conversion | Recommandation | Faisable maintenant ? |
|----------|------------|------------------|--------------------------|----------------------|----------------|----------------------|
| P0 | Hero > "Comment ca marche" | Le bouton scrolle vers "En bref" (`#geo-summary-heading`) au lieu de "Comment ca marche" (`#how-it-works-heading`) | "Ca ne marche pas comme prevu, le bouton m'emmene pas au bon endroit" | Perte de confiance immediate | Changer le target scroll vers `#how-it-works-heading` | Oui |
| P0 | Homepage > Section Institutionnelle | Jargon B2B (MBI-HSS, k-anonymat, CHSCT, export recherche) visible par un visiteur B2C | "C'est pas pour moi, c'est pour des hopitaux, je suis au mauvais endroit" | Abandon massif des individuels | Supprimer cette section de la homepage, la garder uniquement sur /b2b | Oui |
| P1 | Homepage > Longueur | 9 sections + footer = scroll interminable. Hero > HowItWorks > GeoSummary > Features > Showcase > Modules > Institutional > SocialProof > CTA | "Ce site n'en finit pas, je ne sais plus ou cliquer" | Fatigue de scroll, taux de rebond | Supprimer GeoSummary (redondant avec Hero+HowItWorks) et Institutional. Garder 6 sections max | Oui |
| P1 | Homepage > Repetitions | "2-5 minutes" repete 4 fois, "gratuit" 5 fois, "pour soignants" 6 fois sur la meme page | "J'ai compris, arretez de me le dire" | Effet marketing creux, perte de credibilite | Chaque section doit apporter une info NOUVELLE. Supprimer les doublons | Oui |
| P1 | Homepage > Social Proof | Aucun chiffre reel, aucun temoignage, aucun logo. Section "Pourquoi nous faire confiance" = 3 principes generiques | "Personne n'utilise ce truc" | Pas de preuve sociale = pas de conversion | Remplacer par "Plateforme en lancement — soyez parmi les premiers" ou ajouter vrais metriques | Oui (copy) |
| P1 | Hero > Badge "Cree par une medecin" | Le badge dit "Cree par une medecin 🇫🇷" mais la fondatrice a le titre "Medecin · Fondatrice" — incoherence potentielle avec la regle sur le titre | Un novice ne voit pas le probleme, mais c'est un risque deontologique | Conformite | Verifier avec la fondatrice | Non (decision humaine) |
| P2 | Homepage > Announcement Banner | "Nouveau : Essayez un exercice de respiration en 2 minutes" — redondant avec le hero qui dit deja la meme chose | "Ca fait double emploi" | Bruit visuel inutile | Supprimer ou changer le message pour quelque chose de vraiment nouveau | Oui |
| P2 | Homepage > Showcase section | L'animation de respiration est jolie mais le texte en dessous ("Pause d'urgence", "Recharge mentale", "Sas sommeil") est noyé dans le fond sombre | "C'est beau mais je ne lis pas les details" | Information perdue | OK tel quel — c'est un element de demo, pas d'info critique | Non |
| P2 | Footer > Lien "Ecosysteme" | Pointe vers `president-cockpit-hq.lovable.app` — un lien Lovable interne qui n'a rien a faire dans un footer public | "C'est quoi ce lien bizarre ?" | Perte de credibilite, confusion | Supprimer ce lien | Oui |
| P2 | Footer > "Aide & Support" | Le lien /help existe dans le footer ET dans le header | Pas de probleme direct mais redondance | Mineur | Garder dans le header uniquement si le footer a deja "Contact" et "FAQ" | Oui |
| P2 | Signup > Formulaire | 6 champs (nom, email, mdp, confirmation mdp, CGU, privacy) avant de pouvoir cliquer — lourd pour "30 secondes" | "Ca prend pas 30 secondes ca" | Friction d'inscription | Le nom est deja facultatif — le rendre plus explicitement optionnel ou le deplacer post-inscription | Oui (copy) |
| P2 | Signup > Indicateur mdp | Les regles de mot de passe (8 chars, maj, min, chiffre) n'apparaissent qu'apres avoir commence a taper | Un novice pourrait soumettre et se faire rejeter | Friction moderee | Afficher les regles toujours visibles des le depart | Oui |
| P2 | Login > Icone Zap | Le bouton "Se connecter" a une icone eclair (Zap) — semble incongruent pour une app de bien-etre | "Pourquoi un eclair pour se connecter a un outil de relaxation ?" | Dissonance de marque subtile | Remplacer Zap par ArrowRight ou Heart | Oui |
| P3 | Header > "Commencer" | Le CTA header dit "Commencer" tandis que le hero dit "Commencer gratuitement" | Leger mais noté — le "gratuitement" rassure | Mineur | Ajouter "gratuitement" au header CTA aussi | Oui |
| P3 | Homepage > Chat Nyvee | Bulle chat flottante sans explication — on ne sait pas si c'est un bot, un humain, le coach IA | "C'est quoi ce truc en bas ?" | Confusion legere | Ajouter un tooltip ou un label "Coach IA" visible | Oui |
| P3 | Pricing > Plan "Etablissement" | "Sur devis" sans aucun indicateur de prix ni de fourchette | Un RH ne sait pas si c'est 100€ ou 10 000€/mois | Frein B2B | Ajouter "A partir de X€/utilisateur/mois" ou "Contactez-nous" avec un lien direct | Decision humaine |

---

## AMELIORATIONS PRIORITAIRES A IMPLEMENTER IMMEDIATEMENT

### 1. Fixer le scroll "Comment ca marche" (P0)
Dans `AppleHeroSection.tsx` ligne 167 : changer `#geo-summary-heading` en `#how-it-works-heading`.

### 2. Supprimer la section Institutionnelle de la homepage (P0)
Dans `AppleHomePage.tsx` : retirer l'import et le rendu de `InstitutionalFeaturesSection`. Cette section ne parle qu'aux RH/cadres et fait fuir les soignants individuels.

### 3. Supprimer la section GeoSummary de la homepage (P1)
Dans `AppleHomePage.tsx` : retirer `GeoSummarySection`. Son contenu ("En bref") est redondant a 90% avec Hero + HowItWorks. Cela ramene la page de 9 a 7 sections.

### 4. Supprimer l'announcement banner (P2)
Dans `AppleHomePage.tsx` : retirer le bloc `AnnouncementBanner`. Le message est redondant avec le hero.

### 5. Supprimer le lien "Ecosysteme" du footer (P2)
Dans `Footer.tsx` : retirer le lien vers `president-cockpit-hq.lovable.app`.

### 6. Varier les CTA (P1)
- Hero : "Commencer gratuitement" (garder)
- Features : pas de CTA (garder comme ca)
- Showcase : "Essayer cet exercice" (garder)
- Modules : "Decouvrir les modules" (garder)
- Social Proof : pas de CTA direct (ajouter un simple lien "En savoir plus sur notre approche")
- CTA finale : "Essayer gratuitement" (garder)

### 7. Rendre la Social Proof plus honnete (P1)
Remplacer le titre "Construite avec exigence" par "Pourquoi EmotionsCare" (plus direct). Ajouter une mention "Plateforme en cours de lancement — rejoignez les premiers utilisateurs" pour etre transparente plutot que de pretendre une credibilite non prouvee.

### 8. Login > Remplacer icone Zap (P2)
Dans `LoginPage.tsx` : remplacer `<Zap>` par `<ArrowRight>` sur le bouton de connexion.

### 9. Header CTA > Ajouter "gratuitement" (P3)
Dans `SharedHeader.tsx` : changer "Commencer" en "Essai gratuit" dans le bouton CTA.

---

## FICHIERS A MODIFIER

| Fichier | Modifications |
|---------|--------------|
| `src/components/home/AppleHeroSection.tsx` | Ligne 167 : `#geo-summary-heading` → `#how-it-works-heading` |
| `src/components/home/AppleHomePage.tsx` | Supprimer imports/renders de `GeoSummarySection`, `InstitutionalFeaturesSection`, `AnnouncementBanner` |
| `src/components/home/Footer.tsx` | Supprimer le lien "Ecosysteme" (lignes 169-179) |
| `src/components/home/SocialProofSection.tsx` | Titre "Construite avec exigence" → "Pourquoi EmotionsCare". Ajouter mention de lancement |
| `src/pages/LoginPage.tsx` | Remplacer `Zap` par `ArrowRight` dans le bouton submit |
| `src/components/layout/SharedHeader.tsx` | "Commencer" → "Essai gratuit" |

---

## CE QUI NE PEUT PAS ETRE FAIT AUTOMATIQUEMENT

- Ajout de vrais temoignages (necessite contenu reel)
- Ajout de vrais logos partenaires (necessite accords)
- Decision sur le prix "Etablissement" (decision business)
- Verification du titre "medecin" sur le badge hero (decision fondatrice)
- Ajout d'un nombre reel d'utilisateurs (necessite donnees)
- Test mobile complet (necessite interaction avec le preview)

