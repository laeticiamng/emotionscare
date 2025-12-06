# Distribution des Pages en Groupes d'Analyse

## Vue d'ensemble

Ce système permet de **répartir automatiquement toutes les pages du repository en groupes d'analyse équilibrés**, garantissant une couverture complète sans doublons ni oublis.

## Pourquoi ?

- **Couverture complète** : Chaque page est analysée une seule fois
- **Pas de doublons** : Aucune page n'apparaît dans plusieurs groupes
- **Pas d'oublis** : Toutes les pages sont incluses dans la répartition
- **Travail parallèle** : L'équipe ou l'IA peut travailler sur plusieurs groupes simultanément sans recoupement

## Fichiers générés

### `pages-distribution.json`

Fichier JSON contenant la répartition complète avec :

```json
{
  "metadata": {
    "totalPages": 216,
    "numberOfGroups": 10,
    "averagePagesPerGroup": 21.6,
    "generatedAt": "2025-11-17T07:22:41.000Z"
  },
  "groups": [
    {
      "groupId": 1,
      "groupName": "Groupe 1",
      "totalPages": 22,
      "pages": [
        "src/components/HomePage.tsx",
        ...
      ]
    },
    ...
  ],
  "verification": {
    "allPagesIncluded": true,
    "noDuplicates": true,
    "groupSizesBalanced": true
  }
}
```

## Scripts disponibles

### 1. Générer la distribution

```bash
bash scripts/distribute-pages.sh
```

**Ce que fait le script :**
- Détecte automatiquement toutes les pages (`*Page.tsx` et `*page.tsx`)
- Exclut les fichiers de test (`*.test.tsx`, `*.e2e.test.tsx`, `*.spec.tsx`)
- Divise les pages en 10 groupes équilibrés
- Génère le fichier `pages-distribution.json`
- Affiche un résumé de la distribution

**Configuration :** Modifiez la constante `NUMBER_OF_GROUPS` dans le script pour changer le nombre de groupes (par défaut : 10).

### 2. Valider la distribution

```bash
bash scripts/validate-distribution.sh
```

**Critères de validation :**
1. ✅ Toutes les pages présentes sont incluses
2. ✅ Aucun fichier n'apparaît deux fois
3. ✅ Aucun fichier n'est oublié
4. ✅ Les groupes ont une taille quasi-identique (différence max : 5 pages)
5. ✅ Le JSON est bien formé et exploitable

## Résultats de la distribution actuelle

### Statistiques

- **Total de pages détectées :** 216
- **Nombre de groupes :** 10
- **Moyenne par groupe :** 21.6 pages

### Répartition des groupes

| Groupe    | Nombre de pages |
|-----------|-----------------|
| Groupe 1  | 22 pages        |
| Groupe 2  | 22 pages        |
| Groupe 3  | 22 pages        |
| Groupe 4  | 22 pages        |
| Groupe 5  | 22 pages        |
| Groupe 6  | 22 pages        |
| Groupe 7  | 22 pages        |
| Groupe 8  | 22 pages        |
| Groupe 9  | 22 pages        |
| Groupe 10 | 18 pages        |

### Vérification

- ✅ **Toutes les pages incluses**
- ✅ **Aucun doublon**
- ✅ **Groupes équilibrés** (différence max : 4 pages)

## Utilisation pour l'audit

### 1. Audit manuel par groupe

```bash
# Consulter les pages du Groupe 1
cat pages-distribution.json | jq '.groups[0].pages[]'

# Consulter les pages d'un groupe spécifique (ex: Groupe 5)
cat pages-distribution.json | jq '.groups[4].pages[]'
```

### 2. Audit automatisé

```javascript
// Exemple d'utilisation en Node.js
const distribution = require('./pages-distribution.json');

// Analyser le Groupe 1
const group1 = distribution.groups.find(g => g.groupId === 1);
console.log(`Analyse de ${group1.groupName} (${group1.totalPages} pages)`);

for (const page of group1.pages) {
  // Votre logique d'analyse ici
  console.log(`Analyse de ${page}...`);
}
```

### 3. Répartition du travail en équipe

Chaque membre de l'équipe peut se voir attribuer un ou plusieurs groupes pour l'analyse :

- **Analyste 1** : Groupes 1-2 (44 pages)
- **Analyste 2** : Groupes 3-4 (44 pages)
- **Analyste 3** : Groupes 5-6 (44 pages)
- **Analyste 4** : Groupes 7-8 (44 pages)
- **Analyste 5** : Groupes 9-10 (40 pages)

## Régénération

Pour régénérer la distribution (par exemple, après l'ajout de nouvelles pages) :

```bash
# Régénérer la distribution
bash scripts/distribute-pages.sh

# Valider la nouvelle distribution
bash scripts/validate-distribution.sh
```

## Pages incluses

Le script détecte automatiquement :

- **Pages frontend React** : `src/**/*Page.tsx` et `src/**/*page.tsx`
- **Exclusions** : Fichiers de test (`*.test.tsx`, `*.e2e.test.tsx`, `*.spec.tsx`)

**Nombre total de pages détectées :** 216

## Modification du nombre de groupes

Pour changer le nombre de groupes, éditez le fichier `scripts/distribute-pages.sh` :

```bash
# Ligne 6
NUMBER_OF_GROUPS=10  # Changez cette valeur
```

Puis régénérez la distribution :

```bash
bash scripts/distribute-pages.sh
```

## Structure des fichiers

```
emotionscare/
├── scripts/
│   ├── distribute-pages.sh        # Script de génération
│   ├── distribute-pages-analysis.ts  # Version TypeScript (alternative)
│   ├── distribute-pages-analysis.mjs # Version JS module (alternative)
│   └── validate-distribution.sh   # Script de validation
├── pages-distribution.json        # Fichier généré avec la répartition
└── PAGES_DISTRIBUTION.md         # Cette documentation
```

## Critères de réussite ✅

- [x] Tous les fichiers/pages présents sont inclus (216/216)
- [x] Aucun fichier n'apparaît deux fois (0 doublons)
- [x] Aucun fichier n'est oublié (216 pages trouvées = 216 pages dans les groupes)
- [x] Les groupes ont une taille quasi-identique (différence max : 4 pages)
- [x] Le JSON généré est exploitable directement (format JSON valide avec métadonnées)

## Support

Pour toute question ou problème, consultez les logs de génération ou exécutez le script de validation :

```bash
bash scripts/validate-distribution.sh
```
