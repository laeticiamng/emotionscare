/**
 * Tests E2E - Gestion des Playlists
 *
 * Teste le workflow complet:
 * - Création playlist
 * - Ajout/suppression de pistes
 * - Réorganisation (drag & drop)
 * - Favoris
 * - Partage
 * - Suppression
 */

import { test, expect } from '@playwright/test';

// Mock data
const mockUser = {
  id: 'user-123',
  email: 'test@example.com'
};

const mockTracks = [
  {
    id: 'track-1',
    user_id: 'user-123',
    title: 'Méditation Profonde',
    artist: 'EmotionsCare AI',
    style: 'ambient, calm, meditative',
    duration: 180,
    url: 'https://cdn.example.com/meditation.mp3',
    cover_url: 'https://cdn.example.com/cover1.jpg',
    status: 'completed',
    created_at: new Date().toISOString()
  },
  {
    id: 'track-2',
    user_id: 'user-123',
    title: 'Concentration Focus',
    artist: 'EmotionsCare AI',
    style: 'minimal, focus',
    duration: 240,
    url: 'https://cdn.example.com/focus.mp3',
    cover_url: 'https://cdn.example.com/cover2.jpg',
    status: 'completed',
    created_at: new Date().toISOString()
  },
  {
    id: 'track-3',
    user_id: 'user-123',
    title: 'Relaxation Totale',
    artist: 'EmotionsCare AI',
    style: 'ambient, relaxing',
    duration: 300,
    url: 'https://cdn.example.com/relax.mp3',
    cover_url: 'https://cdn.example.com/cover3.jpg',
    status: 'completed',
    created_at: new Date().toISOString()
  }
];

const mockPlaylist = {
  id: 'playlist-1',
  user_id: 'user-123',
  name: 'Ma Playlist Zen',
  description: 'Musiques relaxantes pour méditation',
  is_public: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const mockPlaylistTracks = [
  {
    id: 'pt-1',
    playlist_id: 'playlist-1',
    generation_id: 'track-1',
    position: 0,
    added_at: new Date().toISOString()
  },
  {
    id: 'pt-2',
    playlist_id: 'playlist-1',
    generation_id: 'track-2',
    position: 1,
    added_at: new Date().toISOString()
  }
];

test.describe('Playlist Creation', () => {
  test.beforeEach(async ({ page }) => {
    // Mock auth
    await page.route('**/auth/v1/user', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ user: mockUser }),
        headers: { 'content-type': 'application/json' }
      });
    });

    // Mock existing playlists
    await page.route('**/rest/v1/music_playlists*', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          body: JSON.stringify([]),
          headers: { 'content-type': 'application/json' }
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/emotion-music');
  });

  test('should create a new playlist', async ({ page }) => {
    // Mock successful creation
    await page.route('**/rest/v1/music_playlists', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          body: JSON.stringify([mockPlaylist]),
          headers: { 'content-type': 'application/json' }
        });
      } else {
        await route.continue();
      }
    });

    // Click "Create Playlist" button
    const createButton = page.getByRole('button', { name: /créer.*playlist|nouvelle playlist/i });
    await createButton.click();

    // Modal/form should appear
    await expect(page.getByRole('dialog')).toBeVisible();

    // Fill in playlist name
    await page.fill('input[name="playlistName"]', 'Ma Playlist Zen');
    await page.fill('textarea[name="playlistDescription"]', 'Musiques relaxantes pour méditation');

    // Submit
    const submitButton = page.getByRole('button', { name: /créer|enregistrer/i });
    await submitButton.click();

    // Success message
    await expect(page.getByText(/playlist créée/i)).toBeVisible({ timeout: 3000 });

    // Modal should close
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should validate playlist name', async ({ page }) => {
    const createButton = page.getByRole('button', { name: /créer.*playlist/i });
    await createButton.click();

    // Try to submit without name
    const submitButton = page.getByRole('button', { name: /créer|enregistrer/i });
    await submitButton.click();

    // Validation error
    await expect(page.getByText(/nom.*requis/i)).toBeVisible({ timeout: 2000 });
  });

  test('should handle creation errors', async ({ page }) => {
    // Mock error
    await page.route('**/rest/v1/music_playlists', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Server error' }),
          headers: { 'content-type': 'application/json' }
        });
      } else {
        await route.continue();
      }
    });

    const createButton = page.getByRole('button', { name: /créer.*playlist/i });
    await createButton.click();

    await page.fill('input[name="playlistName"]', 'Ma Playlist');
    const submitButton = page.getByRole('button', { name: /créer/i });
    await submitButton.click();

    // Error message
    await expect(page.getByText(/erreur/i)).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Playlist Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock auth
    await page.route('**/auth/v1/user', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ user: mockUser }),
        headers: { 'content-type': 'application/json' }
      });
    });

    // Mock playlists
    await page.route('**/rest/v1/music_playlists*', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          body: JSON.stringify([mockPlaylist]),
          headers: { 'content-type': 'application/json' }
        });
      } else {
        await route.continue();
      }
    });

    // Mock playlist tracks
    await page.route('**/rest/v1/music_playlist_tracks*', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          body: JSON.stringify(mockPlaylistTracks),
          headers: { 'content-type': 'application/json' }
        });
      } else {
        await route.continue();
      }
    });

    // Mock tracks
    await page.route('**/rest/v1/music_generations*', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify(mockTracks),
        headers: { 'content-type': 'application/json' }
      });
    });

    await page.goto('/emotion-music');
  });

  test('should display playlists', async ({ page }) => {
    // Playlist should be visible
    await expect(page.getByText('Ma Playlist Zen')).toBeVisible();
    await expect(page.getByText(/musiques relaxantes/i)).toBeVisible();
  });

  test('should open playlist and show tracks', async ({ page }) => {
    // Click on playlist
    await page.getByText('Ma Playlist Zen').click();

    // Tracks should be visible
    await expect(page.getByText('Méditation Profonde')).toBeVisible();
    await expect(page.getByText('Concentration Focus')).toBeVisible();
  });

  test('should add track to playlist', async ({ page }) => {
    // Mock add track
    await page.route('**/rest/v1/music_playlist_tracks', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          body: JSON.stringify([{
            id: 'pt-3',
            playlist_id: 'playlist-1',
            generation_id: 'track-3',
            position: 2,
            added_at: new Date().toISOString()
          }]),
          headers: { 'content-type': 'application/json' }
        });
      } else {
        await route.continue();
      }
    });

    // Find "Add to Playlist" button on a track
    const trackCard = page.locator('[data-testid="track-card"]').filter({ hasText: 'Relaxation Totale' }).first();
    const addButton = trackCard.getByRole('button', { name: /ajouter.*playlist/i });
    await addButton.click();

    // Playlist selector should appear
    await expect(page.getByRole('dialog')).toBeVisible();

    // Select playlist
    await page.getByText('Ma Playlist Zen').click();

    // Success message
    await expect(page.getByText(/ajouté.*playlist/i)).toBeVisible({ timeout: 3000 });
  });

  test('should remove track from playlist', async ({ page }) => {
    // Mock delete
    await page.route('**/rest/v1/music_playlist_tracks*', async route => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 204,
          headers: { 'content-type': 'application/json' }
        });
      } else {
        await route.continue();
      }
    });

    // Open playlist
    await page.getByText('Ma Playlist Zen').click();

    // Find remove button on first track
    const trackCard = page.locator('[data-testid="playlist-track"]').first();
    const removeButton = trackCard.getByRole('button', { name: /retirer|supprimer/i });
    await removeButton.click();

    // Confirmation dialog
    const confirmButton = page.getByRole('button', { name: /confirmer|oui/i });
    await confirmButton.click();

    // Success message
    await expect(page.getByText(/retiré.*playlist/i)).toBeVisible({ timeout: 3000 });
  });

  test('should rename playlist', async ({ page }) => {
    // Mock update
    await page.route('**/rest/v1/music_playlists*', async route => {
      if (route.request().method() === 'PATCH') {
        await route.fulfill({
          status: 200,
          body: JSON.stringify([{
            ...mockPlaylist,
            name: 'Playlist Zen Modifiée'
          }]),
          headers: { 'content-type': 'application/json' }
        });
      } else {
        await route.continue();
      }
    });

    // Click edit button on playlist
    const playlistCard = page.locator('[data-testid="playlist-card"]').first();
    const editButton = playlistCard.getByRole('button', { name: /modifier|éditer/i });
    await editButton.click();

    // Edit form should appear
    await expect(page.getByRole('dialog')).toBeVisible();

    // Change name
    const nameInput = page.locator('input[name="playlistName"]');
    await nameInput.clear();
    await nameInput.fill('Playlist Zen Modifiée');

    // Submit
    const saveButton = page.getByRole('button', { name: /enregistrer|sauvegarder/i });
    await saveButton.click();

    // Success message
    await expect(page.getByText(/playlist modifiée/i)).toBeVisible({ timeout: 3000 });
  });

  test('should delete playlist', async ({ page }) => {
    // Mock delete
    await page.route('**/rest/v1/music_playlists*', async route => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 204,
          headers: { 'content-type': 'application/json' }
        });
      } else {
        await route.continue();
      }
    });

    // Click delete button on playlist
    const playlistCard = page.locator('[data-testid="playlist-card"]').first();
    const deleteButton = playlistCard.getByRole('button', { name: /supprimer/i });
    await deleteButton.click();

    // Confirmation dialog
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/êtes-vous sûr/i)).toBeVisible();

    // Confirm
    const confirmButton = page.getByRole('button', { name: /confirmer|supprimer/i });
    await confirmButton.click();

    // Success message
    await expect(page.getByText(/playlist supprimée/i)).toBeVisible({ timeout: 3000 });

    // Playlist should disappear
    await expect(page.getByText('Ma Playlist Zen')).not.toBeVisible();
  });
});

test.describe('Favorites', () => {
  test.beforeEach(async ({ page }) => {
    // Mock auth
    await page.route('**/auth/v1/user', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ user: mockUser }),
        headers: { 'content-type': 'application/json' }
      });
    });

    // Mock tracks
    await page.route('**/rest/v1/music_generations*', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify(mockTracks),
        headers: { 'content-type': 'application/json' }
      });
    });

    // Mock favorites (empty initially)
    await page.route('**/rest/v1/music_favorites*', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          body: JSON.stringify([]),
          headers: { 'content-type': 'application/json' }
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/emotion-music');
  });

  test('should add track to favorites', async ({ page }) => {
    // Mock add favorite
    await page.route('**/rest/v1/music_favorites', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          body: JSON.stringify([{
            id: 'fav-1',
            user_id: 'user-123',
            generation_id: 'track-1',
            created_at: new Date().toISOString()
          }]),
          headers: { 'content-type': 'application/json' }
        });
      } else {
        await route.continue();
      }
    });

    // Find favorite button on first track
    const trackCard = page.locator('[data-testid="track-card"]').first();
    const favoriteButton = trackCard.getByRole('button', { name: /favori|aimer/i });

    // Button should not be filled initially
    await expect(favoriteButton).toHaveAttribute('aria-pressed', 'false');

    // Click to add to favorites
    await favoriteButton.click();

    // Button should be filled
    await expect(favoriteButton).toHaveAttribute('aria-pressed', 'true');

    // Success toast
    await expect(page.getByText(/ajouté.*favoris/i)).toBeVisible({ timeout: 3000 });
  });

  test('should remove track from favorites', async ({ page }) => {
    // Mock track already in favorites
    await page.route('**/rest/v1/music_favorites*', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          body: JSON.stringify([{
            id: 'fav-1',
            user_id: 'user-123',
            generation_id: 'track-1',
            created_at: new Date().toISOString()
          }]),
          headers: { 'content-type': 'application/json' }
        });
      } else if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 204,
          headers: { 'content-type': 'application/json' }
        });
      } else {
        await route.continue();
      }
    });

    await page.reload();

    // Find favorite button
    const trackCard = page.locator('[data-testid="track-card"]').first();
    const favoriteButton = trackCard.getByRole('button', { name: /favori|aimer/i });

    // Button should be filled (already favorited)
    await expect(favoriteButton).toHaveAttribute('aria-pressed', 'true');

    // Click to remove from favorites
    await favoriteButton.click();

    // Button should not be filled
    await expect(favoriteButton).toHaveAttribute('aria-pressed', 'false');

    // Success toast
    await expect(page.getByText(/retiré.*favoris/i)).toBeVisible({ timeout: 3000 });
  });

  test('should display favorites page', async ({ page }) => {
    // Mock favorites
    await page.route('**/rest/v1/music_favorites*', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify([
          {
            id: 'fav-1',
            user_id: 'user-123',
            generation_id: 'track-1',
            created_at: new Date().toISOString()
          }
        ]),
        headers: { 'content-type': 'application/json' }
      });
    });

    // Navigate to favorites
    const favoritesLink = page.getByRole('link', { name: /favoris/i });
    await favoritesLink.click();

    // Should show favorited track
    await expect(page.getByText('Méditation Profonde')).toBeVisible();
  });
});

test.describe('Playlist Sharing', () => {
  test.beforeEach(async ({ page }) => {
    // Mock auth
    await page.route('**/auth/v1/user', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ user: mockUser }),
        headers: { 'content-type': 'application/json' }
      });
    });

    // Mock playlist
    await page.route('**/rest/v1/music_playlists*', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify([mockPlaylist]),
        headers: { 'content-type': 'application/json' }
      });
    });

    await page.goto('/emotion-music');
  });

  test('should generate share link', async ({ page }) => {
    // Click share button on playlist
    const playlistCard = page.locator('[data-testid="playlist-card"]').first();
    const shareButton = playlistCard.getByRole('button', { name: /partager/i });
    await shareButton.click();

    // Share modal should appear
    await expect(page.getByRole('dialog')).toBeVisible();

    // Share link should be displayed
    const shareLink = page.locator('input[readonly]').filter({ hasText: /http/i });
    await expect(shareLink).toBeVisible();

    const linkValue = await shareLink.inputValue();
    expect(linkValue).toContain('playlist-1');
  });

  test('should copy share link to clipboard', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-write', 'clipboard-read']);

    const playlistCard = page.locator('[data-testid="playlist-card"]').first();
    const shareButton = playlistCard.getByRole('button', { name: /partager/i });
    await shareButton.click();

    // Click copy button
    const copyButton = page.getByRole('button', { name: /copier/i });
    await copyButton.click();

    // Success toast
    await expect(page.getByText(/lien copié/i)).toBeVisible({ timeout: 3000 });

    // Verify clipboard content
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('playlist-1');
  });

  test('should toggle playlist visibility (public/private)', async ({ page }) => {
    // Mock update
    await page.route('**/rest/v1/music_playlists*', async route => {
      if (route.request().method() === 'PATCH') {
        await route.fulfill({
          status: 200,
          body: JSON.stringify([{
            ...mockPlaylist,
            is_public: true
          }]),
          headers: { 'content-type': 'application/json' }
        });
      } else {
        await route.continue();
      }
    });

    // Open share modal
    const playlistCard = page.locator('[data-testid="playlist-card"]').first();
    const shareButton = playlistCard.getByRole('button', { name: /partager/i });
    await shareButton.click();

    // Toggle public switch
    const publicSwitch = page.locator('input[type="checkbox"][name="isPublic"]');
    await publicSwitch.check();

    // Success message
    await expect(page.getByText(/playlist publique/i)).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Track Reordering', () => {
  test.beforeEach(async ({ page }) => {
    // Mock auth
    await page.route('**/auth/v1/user', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ user: mockUser }),
        headers: { 'content-type': 'application/json' }
      });
    });

    // Mock playlist with tracks
    await page.route('**/rest/v1/music_playlists*', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify([mockPlaylist]),
        headers: { 'content-type': 'application/json' }
      });
    });

    await page.route('**/rest/v1/music_playlist_tracks*', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify(mockPlaylistTracks),
        headers: { 'content-type': 'application/json' }
      });
    });

    await page.route('**/rest/v1/music_generations*', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify(mockTracks),
        headers: { 'content-type': 'application/json' }
      });
    });

    await page.goto('/emotion-music');
    await page.getByText('Ma Playlist Zen').click();
  });

  test('should reorder tracks with drag and drop', async ({ page }) => {
    // Mock reorder
    await page.route('**/rest/v1/rpc/reorder_playlist_tracks', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true }),
        headers: { 'content-type': 'application/json' }
      });
    });

    // Get first and second tracks
    const firstTrack = page.locator('[data-testid="playlist-track"]').first();
    const secondTrack = page.locator('[data-testid="playlist-track"]').nth(1);

    const firstTrackTitle = await firstTrack.textContent();

    // Drag first track to second position
    await firstTrack.dragTo(secondTrack);

    // Wait for reorder
    await page.waitForTimeout(1000);

    // First track should now be in second position
    const newSecondTrack = page.locator('[data-testid="playlist-track"]').nth(1);
    const newSecondTrackTitle = await newSecondTrack.textContent();

    expect(newSecondTrackTitle).toContain(firstTrackTitle);
  });

  test('should reorder tracks with keyboard', async ({ page }) => {
    // Focus on first track
    const firstTrack = page.locator('[data-testid="playlist-track"]').first();
    const moveDownButton = firstTrack.getByRole('button', { name: /descendre|down/i });

    if (await moveDownButton.isVisible()) {
      // Click move down
      await moveDownButton.click();

      // Track should move down
      await page.waitForTimeout(500);

      const newSecondTrack = page.locator('[data-testid="playlist-track"]').nth(1);
      await expect(newSecondTrack).toContainText('Méditation Profonde');
    }
  });
});
