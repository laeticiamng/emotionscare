// @ts-nocheck
/**
 * Tests pour SafeHtml - composant anti-XSS centralisé
 * Couvre : sanitisation DOMPurify, classes CSS, tags autorisés
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SafeHtml } from '../SafeHtml';

describe('SafeHtml', () => {
  it('rend le HTML sécurisé', () => {
    render(<SafeHtml html="<p>Hello world</p>" />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('neutralise les scripts XSS', () => {
    const { container } = render(
      <SafeHtml html='<p>Safe</p><script>alert("xss")</script>' />
    );
    expect(container.querySelector('script')).toBeNull();
    expect(screen.getByText('Safe')).toBeInTheDocument();
  });

  it('neutralise les event handlers inline', () => {
    const { container } = render(
      <SafeHtml html='<img src="x" onerror="alert(1)" />' />
    );
    const img = container.querySelector('img');
    // DOMPurify supprime onerror
    expect(img?.getAttribute('onerror')).toBeNull();
  });

  it('neutralise javascript: dans les href', () => {
    const { container } = render(
      <SafeHtml html='<a href="javascript:alert(1)">Click</a>' />
    );
    const link = container.querySelector('a');
    // DOMPurify supprime soit le href soit le lien entier
    if (link) {
      const href = link.getAttribute('href');
      expect(href === null || !href.includes('javascript:')).toBe(true);
    }
    // Si le lien est supprimé entièrement, c'est aussi sécurisé
  });

  it('applique className', () => {
    const { container } = render(
      <SafeHtml html="<p>Styled</p>" className="test-class" />
    );
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('respecte les tags autorisés', () => {
    const { container } = render(
      <SafeHtml
        html="<b>Bold</b><i>Italic</i><script>bad</script>"
        allowedTags={['b']}
      />
    );
    expect(container.querySelector('b')).toBeTruthy();
    expect(container.querySelector('i')).toBeNull();
    expect(container.querySelector('script')).toBeNull();
  });

  it('respecte les attributs autorisés', () => {
    const { container } = render(
      <SafeHtml
        html='<a href="https://safe.com" target="_blank">Link</a>'
        allowedAttr={['href']}
      />
    );
    const link = container.querySelector('a');
    expect(link?.getAttribute('href')).toBe('https://safe.com');
    // target non autorisé → supprimé
    expect(link?.getAttribute('target')).toBeNull();
  });

  it('rend une chaîne vide sans erreur', () => {
    const { container } = render(<SafeHtml html="" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('OWASP payload: balises imbriquées', () => {
    const { container } = render(
      <SafeHtml html='<div><img src=x onerror="alert(1)"><svg onload="alert(2)"></svg></div>' />
    );
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('onload')).toBeNull();
  });
});
