// @ts-nocheck
import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import VibesHeatmap from '../VibesHeatmap';

describe('VibesHeatmap', () => {
  it('renders a stable accessible grid', () => {
    const { container } = render(
      <VibesHeatmap
        points={[
          { date: '2024-05-06', vibe: 'calm', intensity: 'medium', meta: { count: 2, total: 3 } },
          { date: '2024-05-07', vibe: 'bright', intensity: 'deep', meta: { count: 3, total: 3 } },
          { date: '2024-05-08', vibe: undefined, meta: { count: 0, total: 0 } },
        ]}
        titleId="title"
        descriptionId="desc"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});

