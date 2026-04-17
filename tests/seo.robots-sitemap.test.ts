// @ts-nocheck
/**
 * Non-regression: robots.txt and sitemap.xml are present, valid, and aligned.
 * - robots.txt allows crawling of /, declares Sitemap URL
 * - sitemap.xml is well-formed XML and lists key public routes
 * - public routes referenced in sitemap are NOT disallowed by robots.txt
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROBOTS_PATH = resolve(__dirname, '../public/robots.txt');
const SITEMAP_PATH = resolve(__dirname, '../public/sitemap.xml');

let robots = '';
let sitemap = '';

beforeAll(() => {
  robots = readFileSync(ROBOTS_PATH, 'utf-8');
  sitemap = readFileSync(SITEMAP_PATH, 'utf-8');
});

describe('robots.txt', () => {
  it('declares User-agent: * and Allow: /', () => {
    expect(robots).toMatch(/User-agent:\s*\*/i);
    expect(robots).toMatch(/Allow:\s*\//i);
  });

  it('declares the Sitemap URL', () => {
    expect(robots).toMatch(/Sitemap:\s*https:\/\/emotionscare\.com\/sitemap\.xml/i);
  });

  it('blocks application and admin spaces', () => {
    expect(robots).toMatch(/Disallow:\s*\/app\//);
    expect(robots).toMatch(/Disallow:\s*\/admin\//);
    expect(robots).toMatch(/Disallow:\s*\/auth\//);
  });

  it('explicitly allows generative AI crawlers (GEO)', () => {
    expect(robots).toMatch(/User-agent:\s*GPTBot/i);
    expect(robots).toMatch(/User-agent:\s*OAI-SearchBot/i);
    expect(robots).toMatch(/User-agent:\s*PerplexityBot/i);
    expect(robots).toMatch(/User-agent:\s*ClaudeBot/i);
    expect(robots).toMatch(/User-agent:\s*Google-Extended/i);
  });
});

describe('sitemap.xml', () => {
  it('is a valid XML urlset', () => {
    expect(sitemap).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    expect(sitemap).toMatch(/<urlset[^>]*xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/);
    expect(sitemap).toMatch(/<\/urlset>\s*$/);
  });

  const REQUIRED_URLS = [
    'https://emotionscare.com/',
    'https://emotionscare.com/pricing',
    'https://emotionscare.com/about',
    'https://emotionscare.com/contact',
    'https://emotionscare.com/faq',
    'https://emotionscare.com/help',
    'https://emotionscare.com/security',
    'https://emotionscare.com/use-cases',
    'https://emotionscare.com/how-it-adapts',
    'https://emotionscare.com/legal/privacy',
    'https://emotionscare.com/legal/terms',
    'https://emotionscare.com/legal/cookies',
    'https://emotionscare.com/legal/mentions',
  ];

  for (const url of REQUIRED_URLS) {
    it(`lists public URL ${url}`, () => {
      expect(sitemap).toContain(`<loc>${url}</loc>`);
    });
  }
});

describe('robots ↔ sitemap consistency', () => {
  it('does not Disallow any URL listed in the sitemap', () => {
    const disallows = Array.from(robots.matchAll(/^Disallow:\s*(\S+)/gim)).map((m) => m[1]);
    const locs = Array.from(sitemap.matchAll(/<loc>https:\/\/emotionscare\.com(\/[^<]*)<\/loc>/g)).map(
      (m) => m[1] || '/',
    );

    for (const loc of locs) {
      for (const rule of disallows) {
        // Treat trailing slash rule as prefix; otherwise exact or prefix match
        const isPrefixRule = rule.endsWith('/');
        const matches = isPrefixRule ? loc.startsWith(rule) : loc === rule || loc.startsWith(`${rule}/`);
        if (matches) {
          throw new Error(`Sitemap URL "${loc}" is disallowed by robots rule "${rule}"`);
        }
      }
    }
    expect(disallows.length).toBeGreaterThan(0);
    expect(locs.length).toBeGreaterThan(0);
  });
});
