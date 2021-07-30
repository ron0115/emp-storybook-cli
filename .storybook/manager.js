import { addons } from '@storybook/addons';
import { create } from '@storybook/theming/create';

const decodeDefined = (obj) => {
  for (const key in obj) {
    try {
      if (JSON.parse(obj[key])) {
        obj[key] = JSON.parse(obj[key]);
        typeof obj[key] === 'string' &&
          (obj[key] = obj[key].substr(1, obj[key].length - 2));
      }
    } catch {}
  }
  return obj;
};
const theme = create({
  base: __config_theme__.base,
  brandTitle: __config_theme__.brandTitle,
  ...decodeDefined(__config_theme__),
});

addons.setConfig({
  panelPosition: 'bottom',
  theme,
  collapsedRoots: ['@act', '@hooks', '@hoc', '@mobile'],
  ...decodeDefined(__config_addons__),
});
