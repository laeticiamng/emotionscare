import { test, expect } from "@playwright/test";

test.describe("Journal Settings E2E", () => {
  test.beforeEach(async ({ page }) => {
    // Note: Remplacer par la vraie route une fois intégrée
    await page.goto("/settings/journal");
  });

  test("devrait afficher la page de paramètres du journal", async ({ page }) => {
    await expect(page.getByText("Paramètres du Journal")).toBeVisible();
    await expect(
      page.getByText("Personnalisez votre expérience d'écriture")
    ).toBeVisible();
  });

  test("devrait naviguer entre les onglets", async ({ page }) => {
    // Vérifier onglet Général actif par défaut
    await expect(page.getByText("Suggestions d'écriture")).toBeVisible();

    // Cliquer sur onglet Rappels
    await page.getByRole("tab", { name: /Rappels/i }).click();
    await expect(page.getByText("Mes rappels")).toBeVisible();

    // Retour à Général
    await page.getByRole("tab", { name: /Général/i }).click();
    await expect(page.getByText("Suggestions d'écriture")).toBeVisible();
  });

  test("devrait activer/désactiver les suggestions", async ({ page }) => {
    const toggle = page.getByLabel("Afficher les suggestions");
    
    // Vérifier l'état initial
    const isChecked = await toggle.isChecked();
    
    // Toggle
    await toggle.click();
    await expect(toggle).toHaveAttribute(
      "aria-checked",
      isChecked ? "false" : "true"
    );

    // Si désactivé, les options doivent disparaître
    if (isChecked) {
      await expect(page.getByText("Catégorie préférée")).not.toBeVisible();
    }
  });

  test("devrait changer la catégorie de prompts", async ({ page }) => {
    // S'assurer que les suggestions sont activées
    const toggle = page.getByLabel("Afficher les suggestions");
    if (!(await toggle.isChecked())) {
      await toggle.click();
    }

    // Ouvrir le select
    await page.getByLabel("Catégorie préférée").click();

    // Sélectionner Gratitude
    await page.getByText("Gratitude", { exact: true }).click();

    // Vérifier que la sélection a été faite
    await expect(page.getByLabel("Catégorie préférée")).toContainText(
      "Gratitude"
    );
  });

  test("devrait créer un nouveau rappel", async ({ page }) => {
    // Aller dans l'onglet Rappels
    await page.getByRole("tab", { name: /Rappels/i }).click();

    // Cliquer sur Nouveau rappel
    await page.getByRole("button", { name: /Nouveau rappel/i }).click();

    // Vérifier que le dialog s'ouvre
    await expect(page.getByText("Nouveau rappel")).toBeVisible();

    // Remplir le formulaire
    await page.getByLabel(/Heure/i).fill("10:00");
    
    // Sélectionner des jours (exemple: Lun, Mer, Ven)
    await page.getByText("Lun").click();
    await page.getByText("Mer").click();
    await page.getByText("Ven").click();

    // Message personnalisé (optionnel)
    const messageInput = page.getByLabel(/Message personnalisé/i);
    if (await messageInput.isVisible()) {
      await messageInput.fill("N'oublie pas d'écrire !");
    }

    // Soumettre
    await page.getByRole("button", { name: /Créer le rappel/i }).click();

    // Vérifier que le rappel apparaît dans la liste
    await expect(page.getByText("10:00")).toBeVisible();
  });

  test("devrait modifier un rappel existant", async ({ page }) => {
    // Aller dans l'onglet Rappels
    await page.getByRole("tab", { name: /Rappels/i }).click();

    // Supposons qu'il y a au moins un rappel
    const editButton = page.getByRole("button", { name: /Modifier/i }).first();
    await editButton.click();

    // Vérifier que le dialog s'ouvre
    await expect(page.getByText("Modifier le rappel")).toBeVisible();

    // Modifier l'heure
    await page.getByLabel(/Heure/i).fill("14:30");

    // Soumettre
    await page.getByRole("button", { name: /Modifier/i }).click();

    // Vérifier la mise à jour
    await expect(page.getByText("14:30")).toBeVisible();
  });

  test("devrait activer/désactiver un rappel", async ({ page }) => {
    // Aller dans l'onglet Rappels
    await page.getByRole("tab", { name: /Rappels/i }).click();

    // Trouver le premier switch de rappel
    const reminderSwitch = page
      .getByRole("switch", { name: /Activer\/Désactiver le rappel/i })
      .first();

    const isChecked = await reminderSwitch.isChecked();

    // Toggle
    await reminderSwitch.click();

    // Vérifier le changement d'état
    await expect(reminderSwitch).toHaveAttribute(
      "aria-checked",
      isChecked ? "false" : "true"
    );
  });

  test("devrait supprimer un rappel", async ({ page }) => {
    // Aller dans l'onglet Rappels
    await page.getByRole("tab", { name: /Rappels/i }).click();

    // Compter le nombre de rappels avant suppression
    const remindersBefore = await page
      .getByRole("button", { name: /Supprimer/i })
      .count();

    if (remindersBefore > 0) {
      // Supprimer le premier rappel
      const deleteButton = page
        .getByRole("button", { name: /Supprimer/i })
        .first();
      await deleteButton.click();

      // Attendre que le nombre de rappels diminue
      await expect(
        page.getByRole("button", { name: /Supprimer/i })
      ).toHaveCount(remindersBefore - 1);
    }
  });

  test("devrait afficher le message vide si aucun rappel", async ({ page }) => {
    // Aller dans l'onglet Rappels
    await page.getByRole("tab", { name: /Rappels/i }).click();

    // Supprimer tous les rappels si présents
    let deleteButtons = await page
      .getByRole("button", { name: /Supprimer/i })
      .count();
    
    while (deleteButtons > 0) {
      await page.getByRole("button", { name: /Supprimer/i }).first().click();
      await page.waitForTimeout(500);
      deleteButtons = await page
        .getByRole("button", { name: /Supprimer/i })
        .count();
    }

    // Vérifier le message vide
    await expect(page.getByText("Aucun rappel configuré")).toBeVisible();
    await expect(
      page.getByText(/Créez un rappel pour maintenir/)
    ).toBeVisible();
  });

  test("devrait persister les paramètres après rechargement", async ({
    page,
  }) => {
    // Désactiver les suggestions
    const toggle = page.getByLabel("Afficher les suggestions");
    if (await toggle.isChecked()) {
      await toggle.click();
    }

    // Recharger la page
    await page.reload();

    // Vérifier que le paramètre est persisté
    await expect(toggle).not.toBeChecked();
  });
});
