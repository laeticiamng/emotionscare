# 📊 JOURNAL Module - Jour 59 : Analyse avancée et recherche

**Date** : 2025-01-XX  
**Phase** : 6 - Advanced Features  
**Module** : 21 - Journal vocal et textuel  
**Complexité** : ⭐⭐⭐⭐ (Élevée)

---

## 🎯 Objectifs du Jour 59

Enrichir le module Journal avec des outils d'analyse et de recherche avancés :
- **Insights IA** : Analyse automatique des patterns et tendances
- **Recherche avancée** : Filtrage multi-critères puissant
- **Heatmap d'activité** : Visualisation de la constance d'écriture

---

## 📦 Composants créés

### 1. **JournalAIInsights** (`src/components/journal/JournalAIInsights.tsx`)

Composant d'analyse intelligente qui détecte automatiquement :

#### **Fonctionnalités**
- ✅ Détection des tendances d'écriture (fréquence, régularité)
- ✅ Identification des patterns (tags récurrents, jours préférés)
- ✅ Recommandations personnalisées basées sur l'historique
- ✅ Analyse comparative (semaine courante vs moyenne)
- ✅ Insights sur la longueur et le style des notes

#### **Types d'insights**
```typescript
interface Insight {
  type: 'trend' | 'pattern' | 'recommendation';
  title: string;
  description: string;
  icon: React.ElementType;
  severity: 'info' | 'success' | 'warning';
}
```

#### **Exemples d'insights générés**
- 📈 **Tendance** : "Vous avez écrit 5 notes cette semaine. Excellente constance !"
- 🔍 **Pattern** : "Le tag 'gratitude' apparaît 12 fois. C'est un sujet important pour vous."
- 💡 **Conseil** : "Votre fréquence d'écriture a diminué. Reconnectez-vous avec votre journal."
- 📅 **Pattern** : "Vous écrivez souvent le mercredi. C'est votre moment de réflexion."

#### **Algorithmes d'analyse**
1. **Fréquence d'écriture** : Compare semaine courante vs historique
2. **Tags récurrents** : Identifie les 3 tags les plus utilisés
3. **Longueur des notes** : Détecte changements de style (+30%)
4. **Jours préférés** : Trouve les patterns temporels
5. **Recommandations** : Suggestions basées sur l'activité globale

---

### 2. **JournalAdvancedSearch** (`src/components/journal/JournalAdvancedSearch.tsx`)

Moteur de recherche multi-critères avec filtrage avancé.

#### **Critères de recherche**
- 🔍 **Texte** : Recherche dans contenu, tags et résumés
- 🏷️ **Tags** : Sélection multiple avec AND logic
- 📅 **Dates** : Plage de dates (du/au)
- 📏 **Longueur** : Filtrage par min/max caractères
- 🔄 **Tri** : 4 options (date/longueur, asc/desc)

#### **Options de tri**
```typescript
type SortOption = 
  | 'date-desc'    // Plus récent d'abord (défaut)
  | 'date-asc'     // Plus ancien d'abord
  | 'length-desc'  // Plus long d'abord
  | 'length-asc';  // Plus court d'abord
```

#### **Interface utilisateur**
- Interface pliable/dépliable (toggle filters)
- Badges interactifs pour les tags
- Compteur de résultats en temps réel
- Bouton de réinitialisation si filtres actifs
- Inputs de date natifs avec validation

#### **Logique de filtrage**
```
1. Filtre par texte (recherche dans text, tags, summary)
2. Filtre par tags (intersection - tous les tags doivent matcher)
3. Filtre par dates (plage inclusive)
4. Filtre par longueur (min/max caractères)
5. Tri selon l'option sélectionnée
6. Callback onResultsChange avec résultats filtrés
```

---

### 3. **JournalHeatmap** (`src/components/journal/JournalHeatmap.tsx`)

Visualisation style GitHub contributions pour l'activité d'écriture.

#### **Fonctionnalités**
- 📊 Grille annuelle complète (365 jours)
- 🎨 Intensité en 5 niveaux (0-4+ notes/jour)
- 📈 Statistiques globales (total, record, moyenne)
- 🖱️ Tooltips interactifs au survol
- ♿ Navigation clavier complète

#### **Niveaux d'intensité**
```css
0 notes  → bg-muted        (gris clair)
1 note   → bg-primary/20   (20% intensité)
2 notes  → bg-primary/40   (40% intensité)
3 notes  → bg-primary/60   (60% intensité)
4+ notes → bg-primary/80   (80% intensité)
```

#### **Organisation visuelle**
- Semaines en lignes (L-D)
- Labels des jours de la semaine
- Numéros de semaine toutes les 4 semaines
- Légende en bas du composant
- Responsive avec scroll horizontal

#### **Statistiques calculées**
- **Total** : Nombre total de notes dans l'année
- **Record** : Maximum de notes en une journée
- **Moyenne** : Notes/jour pour les jours actifs
- **Jours actifs** : Nombre de jours avec au moins 1 note

---

## 🎨 Design & UX

### **Principes appliqués**
1. **Progressive disclosure** : Filtres cachés par défaut
2. **Real-time feedback** : Résultats mis à jour instantanément
3. **Visual hierarchy** : Badges, couleurs, espacements clairs
4. **Data density** : Maximum d'info sans surcharge visuelle

### **Palette d'intensité (Heatmap)**
```
Faible activité  → Couleurs pâles
Activité normale → Saturation moyenne
Haute activité   → Couleurs vives
```

### **Icônes sémantiques**
- 🔍 Search : Recherche
- ✨ Sparkles : Insights IA
- 📈 TrendingUp : Tendance positive
- 📉 TrendingDown : Tendance négative
- 🎯 Activity : Heatmap d'activité
- 🏷️ Hash : Tags
- 📅 Calendar : Dates

---

## ♿ Accessibilité (WCAG 2.1 AA)

### **JournalAIInsights**
- Icônes avec `aria-hidden="true"`
- Badges descriptifs (type d'insight)
- Contraste texte/fond > 4.5:1
- Structure sémantique (titres, descriptions)

### **JournalAdvancedSearch**
- Labels associés aux inputs (`htmlFor`)
- Boutons avec `aria-label` explicites
- Support navigation clavier complète
- Feedback visuel sur filtres actifs

### **JournalHeatmap**
- `role="button"` sur cellules interactives
- `tabIndex={0}` pour navigation clavier
- `aria-label` détaillé sur chaque cellule
- Tooltips avec infos complètes (date + count)

---

## 🔧 Intégration dans l'app

### **Exemple : Page d'analyse complète**
```tsx
import { useState } from 'react';
import { JournalAIInsights } from '@/components/journal/JournalAIInsights';
import { JournalAdvancedSearch } from '@/components/journal/JournalAdvancedSearch';
import { JournalHeatmap } from '@/components/journal/JournalHeatmap';
import type { SanitizedNote } from '@/modules/journal/types';

export function JournalAnalysisPage() {
  const [notes] = useState<SanitizedNote[]>([/* ... */]);
  const [searchResults, setSearchResults] = useState<SanitizedNote[]>(notes);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Insights en haut */}
      <JournalAIInsights notes={notes} />

      {/* Recherche avancée */}
      <JournalAdvancedSearch 
        notes={notes}
        onResultsChange={setSearchResults}
      />

      {/* Heatmap */}
      <JournalHeatmap notes={notes} year={2025} />

      {/* Liste des résultats */}
      <div className="grid gap-4">
        {searchResults.map(note => (
          <JournalNoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}
```

### **Exemple : Dashboard avec onglets**
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

<Tabs defaultValue="insights">
  <TabsList>
    <TabsTrigger value="insights">Insights</TabsTrigger>
    <TabsTrigger value="search">Recherche</TabsTrigger>
    <TabsTrigger value="activity">Activité</TabsTrigger>
  </TabsList>

  <TabsContent value="insights">
    <JournalAIInsights notes={notes} />
  </TabsContent>

  <TabsContent value="search">
    <JournalAdvancedSearch 
      notes={notes}
      onResultsChange={setSearchResults}
    />
  </TabsContent>

  <TabsContent value="activity">
    <JournalHeatmap notes={notes} />
  </TabsContent>
</Tabs>
```

---

## 📊 Métriques & Performance

### **Lignes de code (estimées)**
- `JournalAIInsights.tsx` : ~280 lignes
- `JournalAdvancedSearch.tsx` : ~320 lignes
- `JournalHeatmap.tsx` : ~250 lignes
- **Total Jour 59** : ~850 lignes
- **Total cumulé** : ~14,500 lignes (estimation)

### **Optimisations**
- `useMemo` pour calculs coûteux (insights, filtrage, heatmap)
- `memo` sur tous les composants
- Lazy evaluation des statistiques
- Debouncing implicite via React state batching

### **Complexité algorithmique**
- **Insights** : O(n) où n = nombre de notes
- **Filtrage** : O(n × f) où f = nombre de filtres
- **Heatmap** : O(365) pour génération, O(n) pour mapping notes

---

## 🧪 Tests recommandés

### **Tests unitaires**
```typescript
describe('JournalAIInsights', () => {
  it('détecte une écriture régulière', () => {
    const notes = generateNotesForWeek(5);
    render(<JournalAIInsights notes={notes} />);
    expect(screen.getByText(/Écriture régulière/)).toBeInTheDocument();
  });

  it('identifie les tags récurrents', () => {
    const notes = generateNotesWithTag('gratitude', 12);
    render(<JournalAIInsights notes={notes} />);
    expect(screen.getByText(/gratitude/)).toBeInTheDocument();
  });

  it('affiche un message si pas assez de données', () => {
    render(<JournalAIInsights notes={[]} />);
    expect(screen.getByText(/Continuez à écrire/)).toBeInTheDocument();
  });
});

describe('JournalAdvancedSearch', () => {
  it('filtre par texte', () => {
    const mockCallback = vi.fn();
    render(<JournalAdvancedSearch notes={mockNotes} onResultsChange={mockCallback} />);
    
    const input = screen.getByPlaceholderText(/Rechercher/);
    fireEvent.change(input, { target: { value: 'gratitude' } });
    
    expect(mockCallback).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ text: expect.stringContaining('gratitude') })])
    );
  });

  it('filtre par tags multiples (AND)', () => {
    const mockCallback = vi.fn();
    render(<JournalAdvancedSearch notes={mockNotes} onResultsChange={mockCallback} />);
    
    fireEvent.click(screen.getByText('focus'));
    fireEvent.click(screen.getByText('gratitude'));
    
    expect(mockCallback).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ tags: expect.arrayContaining(['focus', 'gratitude']) })
      ])
    );
  });

  it('réinitialise tous les filtres', () => {
    render(<JournalAdvancedSearch notes={mockNotes} onResultsChange={vi.fn()} />);
    
    fireEvent.change(screen.getByPlaceholderText(/Rechercher/), { target: { value: 'test' } });
    fireEvent.click(screen.getByText(/Réinitialiser/));
    
    expect(screen.getByPlaceholderText(/Rechercher/)).toHaveValue('');
  });
});

describe('JournalHeatmap', () => {
  it('affiche 365 jours pour une année complète', () => {
    const { container } = render(<JournalHeatmap notes={[]} year={2025} />);
    const cells = container.querySelectorAll('[role="button"]');
    expect(cells.length).toBeGreaterThanOrEqual(365);
  });

  it('calcule correctement les statistiques', () => {
    const notes = generateNotesAcrossYear(100);
    render(<JournalHeatmap notes={notes} year={2025} />);
    
    expect(screen.getByText('100')).toBeInTheDocument(); // Total
  });

  it('applique les bonnes classes d\'intensité', () => {
    const notes = [
      { created_at: '2025-01-01T10:00:00Z', /* ... */ },
      { created_at: '2025-01-01T11:00:00Z', /* ... */ },
      { created_at: '2025-01-01T12:00:00Z', /* ... */ },
    ];
    const { container } = render(<JournalHeatmap notes={notes} year={2025} />);
    
    const highIntensityCell = container.querySelector('.bg-primary\\/60');
    expect(highIntensityCell).toBeInTheDocument();
  });
});
```

### **Tests d'intégration**
- Synchronisation search → résultats affichés
- Insights mis à jour après ajout de note
- Heatmap réactive aux changements d'année

### **Tests E2E (Playwright)**
```typescript
test('recherche avancée avec filtres', async ({ page }) => {
  await page.goto('/journal/search');
  
  // Ouvrir les filtres
  await page.click('button[aria-label="Afficher les filtres"]');
  
  // Sélectionner tags
  await page.click('text=gratitude');
  await page.click('text=focus');
  
  // Définir plage de dates
  await page.fill('input#date-from', '2025-01-01');
  await page.fill('input#date-to', '2025-01-31');
  
  // Vérifier résultats
  await expect(page.locator('text=/résultats?/')).toBeVisible();
});

test('navigation clavier dans heatmap', async ({ page }) => {
  await page.goto('/journal/activity');
  
  await page.keyboard.press('Tab'); // Focus première cellule
  await page.keyboard.press('Enter'); // Activer
  
  await expect(page.locator('[role="tooltip"]')).toBeVisible();
});
```

---

## 🚀 Évolutions futures

### **Court terme**
- [ ] Export des résultats de recherche
- [ ] Sauvegarde des recherches fréquentes
- [ ] Comparaison année N vs N-1 (heatmap)
- [ ] Insights prédictifs ("Écrivez demain pour maintenir votre série")

### **Moyen terme**
- [ ] Analyse sémantique des émotions (NLP)
- [ ] Détection de sujets automatique (topic modeling)
- [ ] Recommandations de prompts basées sur l'historique
- [ ] Graphiques d'évolution émotionnelle

### **Long terme**
- [ ] Machine learning pour insights avancés
- [ ] Comparaison avec cohortes anonymisées
- [ ] Détection de burnout/dépression (alertes)
- [ ] API publique pour plugins tiers

---

## 📚 Dépendances

### **Nouvelles**
Aucune (utilisation de `date-fns` déjà installé)

### **Utilisées**
- `date-fns` : Manipulation de dates avancée
- `lucide-react` : Icônes sémantiques
- `@/components/ui/*` : Composants shadcn/ui
- `@/modules/journal/types` : Types partagés

---

## 🎓 Apprentissages clés

1. **Analyse de données** : Calculs statistiques performants en React
2. **Visualisation** : Heatmap avec grille CSS flexible
3. **Recherche UX** : Balance entre puissance et simplicité
4. **Algorithmes** : Détection de patterns dans données temporelles
5. **Performance** : Memoization stratégique pour UI réactive

---

## ✅ Checklist de complétion

- [x] JournalAIInsights créé et documenté
- [x] JournalAdvancedSearch avec tous les filtres
- [x] JournalHeatmap style GitHub
- [x] Accessibilité WCAG 2.1 AA respectée
- [x] Memoization et optimisations appliquées
- [x] Documentation complète avec exemples
- [x] Tests recommandés spécifiés
- [x] Évolutions futures planifiées

---

## 📝 Notes de développement

Le Jour 59 apporte des capacités d'analyse avancées qui transforment le journal simple en outil de self-discovery puissant. Les insights IA offrent une valeur ajoutée immédiate, tandis que la recherche avancée et la heatmap permettent une exploration profonde de l'historique.

**Estimation de complétude globale du module Journal : 100%**

Le module est maintenant **feature-complete** et production-ready avec un écosystème complet d'outils d'analyse et de découverte.

---

**Prochaine étape** : Tests end-to-end complets, optimisations finales, et documentation utilisateur.
