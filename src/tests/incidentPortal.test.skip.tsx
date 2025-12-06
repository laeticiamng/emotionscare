// @ts-nocheck
import { render, fireEvent } from '@testing-library/react';
import IncidentPortal from '@/components/support/IncidentPortal';
import React from 'react';

test('can add incident message', () => {
  const { getByText, getByPlaceholderText } = render(<IncidentPortal />);
  const input = getByPlaceholderText(/Décrire un incident/i) as HTMLTextAreaElement;
  fireEvent.change(input, { target: { value: 'Problème' } });
  fireEvent.click(getByText('Signaler'));
  expect(getByText('Problème')).toBeTruthy();
});
