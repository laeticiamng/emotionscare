import type { Preview } from '@storybook/react';
import React from 'react';
import { MockMusicProvider } from '../tests/utils/MockMusicProvider';
import '../src/index.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <MockMusicProvider>
        <div style={{ padding: '2rem', background: 'var(--ec-bg-soft)', minHeight: '100vh' }}>
          <Story />
        </div>
      </MockMusicProvider>
    )
  ],
  parameters: {
    controls: {
      expanded: true
    },
    options: {
      storySort: {
        order: ['Design System']
      }
    },
    docs: {
      description: {
        component: 'Design system EmotionsCare : composants premium, accessibles, sans représentation chiffrée. '
      }
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true
          }
        ]
      }
    }
  }
};

export default preview;
