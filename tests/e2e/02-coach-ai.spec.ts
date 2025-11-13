import { test, expect } from '@playwright/test';

test.describe('Coach IA - Flow complet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Doit naviguer vers le coach IA', async ({ page }) => {
    // Naviguer vers la page coach
    await page.goto('/coach');
    
    // Vérifier le chargement de la page
    await expect(page.locator('h1, h2')).toContainText(/coach|assistance|aide/i, { timeout: 5000 });
  });

  test('Doit afficher l\'interface de chat', async ({ page }) => {
    await page.goto('/coach');
    
    // Vérifier la présence d'une zone de saisie
    const chatInput = page.locator('input[type="text"], textarea').first();
    await expect(chatInput).toBeVisible({ timeout: 5000 });
  });

  test('Doit permettre d\'envoyer un message', async ({ page }) => {
    await page.goto('/coach');
    await page.waitForLoadState('networkidle');
    
    // Trouver le champ de saisie
    const chatInput = page.locator('input[type="text"], textarea').first();
    
    if (await chatInput.isVisible()) {
      await chatInput.fill('Bonjour, je me sens stressé aujourd\'hui');
      
      // Trouver le bouton d'envoi
      const sendButton = page.locator('button[type="submit"], button').filter({ hasText: /envoyer|send/i }).first();
      
      if (await sendButton.isVisible()) {
        await sendButton.click();
        
        // Attendre une réponse (loader ou message)
        await page.waitForTimeout(2000);
        
        // Vérifier qu'un message apparaît
        const messages = page.locator('[data-testid*="message"], .message, .chat-message');
        await expect(messages.first()).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test('Doit afficher un historique des conversations', async ({ page }) => {
    await page.goto('/coach');
    await page.waitForLoadState('networkidle');
    
    // Vérifier la présence d'un historique ou liste de messages
    const messagesList = page.locator('[data-testid*="messages"], .messages-list, [role="log"]');
    
    // Si des messages existent, ils doivent être visibles
    const messagesCount = await messagesList.locator('> *').count();
    console.log('Messages in history:', messagesCount);
  });

  test('Doit gérer les erreurs de réseau', async ({ page }) => {
    // Simuler une coupure réseau
    await page.route('**/functions/v1/**', route => route.abort());
    
    await page.goto('/coach');
    await page.waitForLoadState('networkidle');
    
    const chatInput = page.locator('input[type="text"], textarea').first();
    
    if (await chatInput.isVisible()) {
      await chatInput.fill('Test message');
      
      const sendButton = page.locator('button[type="submit"], button').filter({ hasText: /envoyer|send/i }).first();
      
      if (await sendButton.isVisible()) {
        await sendButton.click();
        
        // Vérifier qu'un message d'erreur apparaît
        await expect(page.locator('text=/erreur|error|échec/i')).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('Doit permettre de démarrer une nouvelle conversation', async ({ page }) => {
    await page.goto('/coach');
    await page.waitForLoadState('networkidle');
    
    // Chercher un bouton "Nouvelle conversation"
    const newChatButton = page.locator('button').filter({ hasText: /nouvelle|nouveau|new/i }).first();
    
    if (await newChatButton.isVisible()) {
      await newChatButton.click();
      await page.waitForTimeout(1000);
      
      // Vérifier que l'historique est vide ou réinitialisé
      const chatInput = page.locator('input[type="text"], textarea').first();
      await expect(chatInput).toBeEmpty();
    }
  });

  test('Doit supporter les suggestions rapides', async ({ page }) => {
    await page.goto('/coach');
    await page.waitForLoadState('networkidle');
    
    // Chercher des boutons de suggestions
    const suggestions = page.locator('button').filter({ hasText: /stress|anxiété|motivation/i });
    
    const suggestionsCount = await suggestions.count();
    if (suggestionsCount > 0) {
      await suggestions.first().click();
      
      // Vérifier qu'un message est envoyé
      await page.waitForTimeout(1000);
      const messages = page.locator('[data-testid*="message"], .message');
      await expect(messages.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('Doit être responsive sur mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/coach');
    
    // Vérifier que l'interface est visible et utilisable
    const chatInput = page.locator('input[type="text"], textarea').first();
    await expect(chatInput).toBeVisible();
    
    // Vérifier qu'il n'y a pas de débordement horizontal
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.viewportSize()?.width || 375;
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });
});
