

# Suppression du faux témoignage

## Problème
Les lignes 172-177 de `AppleHeroSection.tsx` contiennent un témoignage fictif :
- "Ce qui m'a manqué pendant mes gardes de nuit..."
- "— Dr. Sarah M., infirmière urgentiste"

Ce texte est inventé. Il viole la politique d'intégrité des données factuelles du projet : aucune citation, note, ou nom fictif ne doit figurer sur la plateforme.

## Correction
Supprimer le `blockquote` et le paragraphe d'attribution (lignes 172-177). Conserver les 3 badges de crédibilité ("Approche scientifique", "Données protégées", "Made in France") qui sont factuels.

## Détail technique
**Fichier** : `src/components/home/AppleHeroSection.tsx`

Supprimer les lignes 172-177 :
```text
<blockquote className="text-base italic text-muted-foreground max-w-lg mx-auto mb-6">
  « Ce qui m'a manqué pendant mes gardes de nuit. Enfin un outil qui comprend notre réalité. »
</blockquote>
<p className="text-sm font-medium text-foreground/70 mb-8">
  — Dr. Sarah M., infirmière urgentiste
</p>
```

Le reste de la section (badges + structure) reste inchangé.
