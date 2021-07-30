const { EmpStorybookCli } = require('../dist/index');

/**
 * @type {EmpStorybookCli}
 */
module.exports = {
  // custom storybook config: https://storybook.js.org/docs/react/configure/overview
  storybook: {
    // override your storybook config, auto detect base on your project rootpath
    stories: ['./stories/**/*.stories.@(jsx|tsx)'],
  },
  // custom preview webpack config
  previewWebpack: (config) => {
    return config;
  },
  // custom manager webpack config
  managerWebpack: (config) => config,
  // https://storybook.js.org/docs/react/configure/theming
  theme: {
    // auto get description/name in package.json, or custom by brandTitle
    brandTitle: 'EMP组件库',
    // 'light' | 'dark'
    theme: 'light',
  },
  // https://storybook.js.org/docs/react/configure/features-and-behavior
  addons: {},
};
