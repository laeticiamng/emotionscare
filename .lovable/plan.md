

# Plan : Retirer tous les faux temoignages

## Fichiers concernes et actions

### 1. `src/components/home/SocialProofSection.tsx`
- Contient 3 faux temoignages (Sarah M. CHU Amiens, Julie L. EHPAD, Thomas R. etudiant medecine)
- **Action** : Retirer les 3 temoignages. Conserver uniquement le bloc fondatrice (Laeticia Motongane) et transformer la section en "A propos de la fondatrice" sans faux temoignages. Retirer le badge "Temoignages" et le titre "Ils prennent soin d'eux".

### 2. `src/components/home/SocialProofBar.tsx`
- Genere de fausses notifications live ("Marie de Paris vient de s'inscrire", "Thomas de Lyon a termine une session", etc.)
- **Action** : Supprimer ce composant entierement. Verifier s'il est importe quelque part et retirer l'import.

### 3. `src/components/onboarding/WelcomeSection.tsx`
- 3 faux temoignages (Marie L., Thomas D., Sophie R.) + fausses stats (50K+ utilisateurs, 2M+ emotions, note 4.8)
- **Action** : Retirer le carousel de temoignages et les fausses stats. Garder le reste du welcome (video, features, CTA).

### 4. `src/components/premium/TrialBadge.tsx`
- 3 faux temoignages (Marie L., Thomas B., Sophie M.) dans un carousel
- **Action** : Retirer le tableau TESTIMONIALS, le state `currentTestimonial`, le useEffect de rotation, et le bloc JSX du carousel.

### 5. `src/pages/b2b/B2BEntreprisePage.tsx`
- 3 faux temoignages B2B (Dr. Sophie Martin CHU Lyon, Marc Dubois Clinique Saint-Joseph, Pr. Claire Lefevre Strasbourg)
- **Action** : Retirer le tableau `testimonials` et la section TEMOIGNAGES du JSX.

### 6. `src/components/home/CommunityEngagement.tsx`
- Fausses stats (25K+ personnes, 150K+ crises, 5M+ resets, 500K+ nuits)
- **Action** : Retirer ces fausses statistiques.

## Resultat
Plus aucun faux temoignage ni fausse notification de preuve sociale dans la plateforme. Les sections conservees sont la fondatrice, les vraies fonctionnalites, et les CTA.

