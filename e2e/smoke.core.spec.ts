import { expect, test } from "@playwright/test";

const AUTH_TOKEN_ENDPOINT = "**/auth/v1/token?grant_type=password";
const AUTH_USER_ENDPOINT = "**/auth/v1/user**";
const FEATURE_FLAGS_ENDPOINT = "**/me/feature_flags";
const SUPABASE_REST_ENDPOINT = "**/rest/v1/**";
const SUPABASE_FUNCTIONS_ENDPOINT = "**/functions/v1/**";

test.describe("Smoke marketing & auth flows", () => {
  test("home page renders the marketing CTA", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("page-root")).toBeVisible();
    const trialCta = page.getByRole("link", { name: /Essai gratuit 30 jours/i });
    await expect(trialCta).toBeVisible();
  });

  test("B2C login shows an error before succeeding", async ({ page }) => {
    let loginAttempts = 0;

    await page.route(AUTH_TOKEN_ENDPOINT, async route => {
      loginAttempts += 1;
      const requestBody = route.request().postDataJSON() as { email?: string } | undefined;
      const email = typeof requestBody?.email === "string" ? requestBody.email : "b2c@example.com";

      if (loginAttempts === 1) {
        await route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({
            error: "invalid_grant",
            error_description: "Invalid login credentials",
          }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          access_token: "mock-access",
          refresh_token: "mock-refresh",
          expires_in: 3600,
          token_type: "bearer",
          user: { id: "user-b2c", email },
          session: {
            access_token: "mock-access",
            refresh_token: "mock-refresh",
            expires_in: 3600,
            token_type: "bearer",
            user: { id: "user-b2c", email },
          },
        }),
      });
    });

    await page.route(AUTH_USER_ENDPOINT, async route => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            user: {
              id: "user-b2c",
              email: "b2c@example.com",
              user_metadata: { segment: "b2c" },
            },
          }),
        });
        return;
      }
      await route.continue();
    });

    await page.route(FEATURE_FLAGS_ENDPOINT, async route => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ flags: { FF_DASHBOARD: true } }),
      });
    });

    await page.route(SUPABASE_REST_ENDPOINT, async route => {
      const method = route.request().method();
      if (method === "GET") {
        await route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
        return;
      }
      await route.fulfill({ status: 204, body: "" });
    });

    await page.route(SUPABASE_FUNCTIONS_ENDPOINT, async route => {
      await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
    });

    await page.goto("/login?segment=b2c");

    await page.getByLabel("Email").fill("b2c@example.com");
    const passwordField = page.getByLabel("Mot de passe");

    await passwordField.fill("wrong-password");
    await page.getByRole("button", { name: "Se connecter" }).click();

    const feedback = page.getByRole("alert");
    await expect(feedback).toContainText("Email ou mot de passe incorrect");

    await passwordField.fill("super-secret");
    await page.getByRole("button", { name: "Se connecter" }).click();

    await expect(feedback).toContainText("Connexion réussie");
  });

  test("error boundary fallback is displayed when a module crashes", async ({ page }) => {
    await page.goto("/dev/error-boundary");

    await page.getByTestId("trigger-error").click();

    const errorView = page.getByTestId("error-view");
    await expect(errorView).toBeVisible();
    await expect(errorView).toContainText("500");
  });
});
