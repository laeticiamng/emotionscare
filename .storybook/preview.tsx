import type { Preview } from '@storybook/react';
import React from 'react';
import { MockMusicProvider } from '../tests/utils/MockMusicProvider';

const preview: Preview = {
  decorators: [
    (Story) => (
      <MockMusicProvider>
        <Story />
      </MockMusicProvider>
    )
  ]
};

export default preview;
