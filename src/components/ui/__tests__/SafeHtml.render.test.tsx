// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock DOMPurify
vi.mock('dompurify', () => ({
  default: {
    sanitize: (html: string) => html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ''),
  },
}));

import SafeHtml from '@/components/ui/SafeHtml';

describe('SafeHtml — rendu sécurisé', () => {
  it('rend du texte simple', () => {
    render(<SafeHtml html="Bonjour le monde" />);
    expect(screen.getByText('Bonjour le monde')).toBeInTheDocument();
  });

  it('rend du HTML formaté', () => {
    const { container } = render(<SafeHtml html="<strong>Gras</strong> et <em>italique</em>" />);
    expect(container.querySelector('strong')).toBeTruthy();
    expect(container.querySelector('em')).toBeTruthy();
  });

  it('neutralise les scripts', () => {
    const { container } = render(
      <SafeHtml html='<p>Safe</p><script>alert("xss")</script>' />
    );
    expect(container.innerHTML).not.toContain('<script>');
    expect(screen.getByText('Safe')).toBeInTheDocument();
  });

  it('rend rien pour une chaîne vide', () => {
    const { container } = render(<SafeHtml html="" />);
    expect(container.textContent).toBe('');
  });
});
