import { addons } from '@storybook/addons'
import { create } from '@storybook/theming/create'
const theme = create({
  base: 'light',
  brandTitle: 'GE-COMPONENTS'
})

addons.setConfig({
  panelPosition: 'bottom',
  theme,
  collapsedRoots: ['@act', '@hooks', '@hoc', '@mobile']
})
