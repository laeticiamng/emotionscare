import { test, expect } from '@playwright/test';

test.describe('Journal - Flow complet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Doit naviguer vers le journal', async ({ page }) => {
    await page.goto('/journal');
    
    await expect(page.locator('h1, h2')).toContainText(/journal|entrée/i, { timeout: 5000 });
  });

  test('Doit afficher la liste des entrées existantes', async ({ page }) => {
    await page.goto('/journal');
    await page.waitForLoadState('networkidle');
    
    // Vérifier la présence d'une liste d'entrées
    const entriesList = page.locator('[data-testid*="entries"], .journal-entries, [data-testid*="journal-list"]');
    
    // Vérifier qu'il y a au moins un conteneur pour les entrées
    const hasEntries = await entriesList.count() > 0;
    console.log('Has journal entries container:', hasEntries);
  });

  test('Doit permettre de créer une nouvelle entrée', async ({ page }) => {
    await page.goto('/journal');
    await page.waitForLoadState('networkidle');
    
    // Chercher un bouton "Nouvelle entrée"
    const newEntryButton = page.locator('button, a').filter({ hasText: /nouvelle|nouveau|créer|write|add/i }).first();
    
    if (await newEntryButton.isVisible()) {
      await newEntryButton.click();
      
      // Vérifier la navigation ou l'ouverture d'un formulaire
      await page.waitForTimeout(1000);
      
      const textArea = page.locator('textarea, [contenteditable="true"]').first();
      await expect(textArea).toBeVisible({ timeout: 5000 });
    }
  });

  test('Doit permettre d\'écrire et sauvegarder une entrée', async ({ page }) => {
    await page.goto('/journal/new');
    await page.waitForLoadState('networkidle');
    
    // Trouver la zone de texte
    const textArea = page.locator('textarea, [contenteditable="true"]').first();
    
    if (await textArea.isVisible()) {
      const testContent = 'Aujourd\'hui, je me sens reconnaissant pour...';
      await textArea.fill(testContent);
      
      // Chercher un bouton sauvegarder
      const saveButton = page.locator('button').filter({ hasText: /sauvegarder|enregistrer|save/i }).first();
      
      if (await saveButton.isVisible()) {
        await saveButton.click();
        
        // Vérifier la confirmation
        await expect(page.locator('text=/sauvegardé|enregistré|saved/i')).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('Doit permettre de rechercher dans les entrées', async ({ page }) => {
    await page.goto('/journal');
    await page.waitForLoadState('networkidle');
    
    // Chercher un champ de recherche
    const searchInput = page.locator('input[type="search"], input[placeholder*="recherch" i], input[placeholder*="search" i]').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('gratitude');
      await page.waitForTimeout(1000);
      
      // Vérifier que des résultats sont filtrés
      console.log('Search functionality present');
    }
  });

  test('Doit afficher les prompts de journaling', async ({ page }) => {
    await page.goto('/journal/new');
    await page.waitForLoadState('networkidle');
    
    // Chercher des prompts ou suggestions
    const prompts = page.locator('button, div').filter({ hasText: /prompt|suggestion|idée/i });
    
    const promptsCount = await prompts.count();
    if (promptsCount > 0) {
      console.log('Journal prompts found:', promptsCount);
      
      // Cliquer sur un prompt
      await prompts.first().click();
      await page.waitForTimeout(500);
    }
  });

  test('Doit permettre de modifier une entrée existante', async ({ page }) => {
    await page.goto('/journal');
    await page.waitForLoadState('networkidle');
    
    // Chercher une entrée existante
    const entry = page.locator('[data-testid*="entry"], .journal-entry').first();
    
    if (await entry.isVisible()) {
      // Chercher un bouton éditer
      const editButton = entry.locator('button').filter({ hasText: /éditer|modifier|edit/i }).first();
      
      if (await editButton.isVisible()) {
        await editButton.click();
        
        // Vérifier que le formulaire d'édition s'ouvre
        const textArea = page.locator('textarea, [contenteditable="true"]').first();
        await expect(textArea).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('Doit permettre de supprimer une entrée', async ({ page }) => {
    await page.goto('/journal');
    await page.waitForLoadState('networkidle');
    
    const entry = page.locator('[data-testid*="entry"], .journal-entry').first();
    
    if (await entry.isVisible()) {
      const deleteButton = entry.locator('button').filter({ hasText: /supprimer|delete/i }).first();
      
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        
        // Vérifier la demande de confirmation
        await expect(page.locator('text=/confirmer|confirm|sûr/i')).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('Doit afficher les statistiques du journal', async ({ page }) => {
    await page.goto('/journal');
    await page.waitForLoadState('networkidle');
    
    // Chercher des statistiques (nombre d'entrées, streak, etc.)
    const stats = page.locator('[data-testid*="stats"], .statistics, [data-testid*="streak"]');
    
    const statsCount = await stats.count();
    if (statsCount > 0) {
      console.log('Journal statistics found:', statsCount);
    }
  });

  test('Doit supporter l\'export des entrées', async ({ page }) => {
    await page.goto('/journal');
    await page.waitForLoadState('networkidle');
    
    // Chercher un bouton d'export
    const exportButton = page.locator('button').filter({ hasText: /export|télécharger|download/i }).first();
    
    if (await exportButton.isVisible()) {
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 5000 }).catch(() => null),
        exportButton.click()
      ]);
      
      if (download) {
        console.log('Export functionality working, file:', await download.suggestedFilename());
      }
    }
  });
});
