import { test, expect } from '@playwright/test';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const flagsPath = path.join(__dirname, '../../src/lib/flags/flags.json');

test.beforeAll(() => {
  const flags = JSON.parse(readFileSync(flagsPath, 'utf-8'));
  flags['new-audio-engine'] = true;
  writeFileSync(flagsPath, JSON.stringify(flags));
});

test.afterAll(() => {
  const flags = JSON.parse(readFileSync(flagsPath, 'utf-8'));
  flags['new-audio-engine'] = false;
  writeFileSync(flagsPath, JSON.stringify(flags));
});

test('audio player smoke', async ({ page }) => {
  await page.goto('/modules/mood-mixer');
  const playButton = page.getByRole('button', { name: 'Lecture' });
  await playButton.click();
  const slider = page.getByLabel('Volume');
  await slider.fill('0.5');
  await expect(playButton).toBeVisible();
});
