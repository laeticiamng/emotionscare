

## Publication et mesure Lighthouse

### Publication

Pour publier l'app, cliquez sur le bouton **Publish** en haut a droite de l'editeur (icone web), puis cliquez sur **Update** dans la boite de dialogue.

### Mesure Lighthouse

Une fois publie sur `https://emotions-care.lovable.app`, vous pouvez mesurer les scores Lighthouse de deux facons :

**Option 1 -- Chrome DevTools (recommande)**
1. Ouvrir `https://emotions-care.lovable.app` dans Chrome
2. F12 → onglet **Lighthouse**
3. Cocher Performance + Accessibility + Best Practices + SEO
4. Selectionner Desktop puis Mobile
5. Cliquer **Analyze page load**

**Option 2 -- PageSpeed Insights**
1. Aller sur [pagespeed.web.dev](https://pagespeed.web.dev)
2. Entrer `https://emotions-care.lovable.app`
3. Les resultats incluent les Core Web Vitals reels (CrUX) + les scores de laboratoire

### Ce que je peux faire

Je ne peux pas publier l'app a votre place (l'action "Update" dans le dialogue de publication est manuelle). Une fois publiee, je peux naviguer sur l'URL de production avec le navigateur integre et executer un profiling de performance pour identifier les goulots d'etranglement restants.

### Prochaine etape suggeree

Publiez l'app, puis dites-moi "Profil de performance sur la production" et je lancerai un audit depuis le navigateur integre sur l'URL publiee.

