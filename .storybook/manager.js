import { addons } from '@storybook/addons';
import { create } from '@storybook/theming/create';

const theme = create({
  base: __THEME__.base,
  brandTitle: __THEME__.brandTitle,
});

addons.setConfig({
  panelPosition: 'bottom',
  theme,
  collapsedRoots: ['@act', '@hooks', '@hoc', '@mobile'],
});
