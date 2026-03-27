// @ts-nocheck
import { render } from '@testing-library/react';
import SecurityWidget from '@/components/security/SecurityWidget';
import React from 'react';

test('renders security widget with no incidents', () => {
  const { getByText } = render(<SecurityWidget incidents={[]} />);
  expect(getByText(/Aucun incident/i)).toBeTruthy();
});
