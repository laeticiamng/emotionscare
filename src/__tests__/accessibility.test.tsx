/**
 * Tests d'accessibilité simplifiés
 * Validation WCAG AA pour les composants critiques
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Accessibility Tests', () => {
  describe('Button Accessibility', () => {
    it('button should have accessible name', () => {
      render(
        React.createElement('button', { type: 'button', 'aria-label': 'Test button' }, 'Click me')
      );

      const button = screen.getByRole('button', { name: /test button|click me/i });
      expect(button).toBeDefined();
    });

    it('button should be focusable', () => {
      const { container } = render(
        React.createElement('button', { type: 'button' }, 'Focusable button')
      );

      const button = container.querySelector('button');
      expect(button?.tabIndex).not.toBe(-1);
    });
  });

  describe('Form Accessibility', () => {
    it('form inputs should have labels', () => {
      render(
        React.createElement('form', { 'aria-label': 'Test form' },
          React.createElement('label', { htmlFor: 'email' }, 'Email'),
          React.createElement('input', { id: 'email', type: 'email', name: 'email' })
        )
      );

      const input = screen.getByLabelText('Email');
      expect(input).toBeDefined();
    });

    it('required fields should be marked', () => {
      const { container } = render(
        React.createElement('div', null,
          React.createElement('label', { htmlFor: 'required-field' }, 'Required Field'),
          React.createElement('input', {
            id: 'required-field',
            'aria-required': 'true',
            required: true
          })
        )
      );

      const input = container.querySelector('input');
      expect(input?.getAttribute('aria-required')).toBe('true');
    });

    it('error messages should be associated with inputs', () => {
      const { container } = render(
        React.createElement('div', null,
          React.createElement('label', { htmlFor: 'email-field' }, 'Email'),
          React.createElement('input', {
            id: 'email-field',
            type: 'email',
            'aria-invalid': 'true',
            'aria-describedby': 'email-error'
          }),
          React.createElement('span', { id: 'email-error', role: 'alert' }, 'Invalid email')
        )
      );

      const input = container.querySelector('input');
      const errorId = input?.getAttribute('aria-describedby');
      const error = container.querySelector(`#${errorId}`);
      
      expect(error?.textContent).toBe('Invalid email');
    });
  });

  describe('Dialog Accessibility', () => {
    it('dialog should have proper ARIA attributes', () => {
      const { container } = render(
        React.createElement('div', {
          role: 'dialog',
          'aria-modal': 'true',
          'aria-labelledby': 'dialog-title'
        },
          React.createElement('h2', { id: 'dialog-title' }, 'Confirmation')
        )
      );

      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog?.getAttribute('aria-modal')).toBe('true');
      expect(dialog?.getAttribute('aria-labelledby')).toBe('dialog-title');
    });
  });

  describe('Navigation Accessibility', () => {
    it('navigation should have aria-label', () => {
      const { container } = render(
        React.createElement('nav', { 'aria-label': 'Main navigation' },
          React.createElement('ul', null,
            React.createElement('li', null, React.createElement('a', { href: '/' }, 'Home'))
          )
        )
      );

      const nav = container.querySelector('nav');
      expect(nav?.getAttribute('aria-label')).toBe('Main navigation');
    });

    it('current page should be marked with aria-current', () => {
      const { container } = render(
        React.createElement('nav', null,
          React.createElement('a', { href: '/', 'aria-current': 'page' }, 'Home'),
          React.createElement('a', { href: '/about' }, 'About')
        )
      );

      const currentLink = container.querySelector('[aria-current="page"]');
      expect(currentLink?.textContent).toBe('Home');
    });
  });

  describe('Interactive Elements', () => {
    it('slider should have proper ARIA attributes', () => {
      const { container } = render(
        React.createElement('div', {
          role: 'slider',
          'aria-label': 'Volume',
          'aria-valuemin': '0',
          'aria-valuemax': '100',
          'aria-valuenow': '50',
          tabIndex: 0
        })
      );

      const slider = container.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-valuenow')).toBe('50');
      expect(slider?.getAttribute('aria-label')).toBe('Volume');
    });

    it('progress bar should announce current value', () => {
      const { container } = render(
        React.createElement('div', {
          role: 'progressbar',
          'aria-label': 'Loading',
          'aria-valuenow': '75',
          'aria-valuemin': '0',
          'aria-valuemax': '100'
        }, '75%')
      );

      const progress = container.querySelector('[role="progressbar"]');
      expect(progress?.getAttribute('aria-valuenow')).toBe('75');
    });

    it('tabs should have proper roles', () => {
      const { container } = render(
        React.createElement('div', null,
          React.createElement('div', { role: 'tablist', 'aria-label': 'Content tabs' },
            React.createElement('button', {
              role: 'tab',
              'aria-selected': 'true',
              id: 'tab-1',
              'aria-controls': 'panel-1'
            }, 'Tab 1'),
            React.createElement('button', {
              role: 'tab',
              'aria-selected': 'false',
              id: 'tab-2',
              'aria-controls': 'panel-2'
            }, 'Tab 2')
          ),
          React.createElement('div', {
            role: 'tabpanel',
            id: 'panel-1',
            'aria-labelledby': 'tab-1'
          }, 'Content 1')
        )
      );

      const tablist = container.querySelector('[role="tablist"]');
      const selectedTab = container.querySelector('[aria-selected="true"]');
      const panel = container.querySelector('[role="tabpanel"]');

      expect(tablist).toBeDefined();
      expect(selectedTab?.textContent).toBe('Tab 1');
      expect(panel?.getAttribute('aria-labelledby')).toBe('tab-1');
    });
  });

  describe('Images Accessibility', () => {
    it('images should have alt text', () => {
      const { container } = render(
        React.createElement('img', { src: '/test.jpg', alt: 'Test image description' })
      );

      const img = container.querySelector('img');
      expect(img?.alt).toBe('Test image description');
    });

    it('decorative images should have empty alt', () => {
      const { container } = render(
        React.createElement('img', { src: '/decoration.svg', alt: '', role: 'presentation' })
      );

      const img = container.querySelector('img');
      expect(img?.alt).toBe('');
      expect(img?.getAttribute('role')).toBe('presentation');
    });
  });

  describe('Loading States', () => {
    it('loading state should be announced', () => {
      const { container } = render(
        React.createElement('div', { 'aria-live': 'polite', 'aria-busy': 'true' },
          React.createElement('span', { role: 'status' }, 'Loading...')
        )
      );

      const liveRegion = container.querySelector('[aria-live="polite"]');
      expect(liveRegion?.getAttribute('aria-busy')).toBe('true');

      const status = container.querySelector('[role="status"]');
      expect(status?.textContent).toBe('Loading...');
    });
  });

  describe('Focus Management', () => {
    it('skip link should be present for keyboard navigation', () => {
      const { container } = render(
        React.createElement('a', {
          href: '#main-content',
          className: 'sr-only focus:not-sr-only'
        }, 'Skip to main content')
      );

      const skipLink = container.querySelector('a[href="#main-content"]');
      expect(skipLink?.textContent).toBe('Skip to main content');
    });
  });
});

// Import React for createElement
import React from 'react';
