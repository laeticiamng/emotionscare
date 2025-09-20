import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'light',
  brandTitle: 'EmotionsCare Design System',
  brandUrl: 'https://emotionscare.dev',
  brandImage: undefined,
  appBg: '#f9fafb',
  appContentBg: '#ffffff',
  appBorderRadius: 16,
  colorPrimary: '#2563eb',
  colorSecondary: '#059669',
  textColor: '#111827'
});

addons.setConfig({
  theme,
  panelPosition: 'right'
});
