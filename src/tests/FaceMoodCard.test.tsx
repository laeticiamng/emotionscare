// @ts-nocheck
import { render, screen } from '@testing-library/react';
import React from 'react';
import FaceMoodCard from '@/components/dashboard/FaceMoodCard';

describe('FaceMoodCard', () => {
  it('shows emoji when joy > .5', () => {
    render(<FaceMoodCard data={{ joy_face_avg: 0.7, valence_face_avg: 0.2 }} />);
    expect(screen.getByRole('img', { name: /happy/i })).toBeInTheDocument();
  });
});
