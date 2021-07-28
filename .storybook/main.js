const fs = require('fs-extra');
const { getPreviewWebpackConfig } = require('./utils/preview-webpack');
const { getManagerWebpackConfig } = require('./utils/manager-webpack');
const { projectConfig, resolveApp } = require('./utils/common');

const defaultConfig = {
  core: {
    builder: 'webpack5',
  },
  stories: [
    fs.existsSync(resolveApp('./stories')) &&
      resolveApp('./stories/**/*.stories.@(jsx|tsx)'),
    fs.existsSync(resolveApp('./src')) &&
      resolveApp('./src/**/*.stories.@(jsx|tsx)'),
  ].filter(Boolean),
  typescript: {
    // also valid 'react-docgen-typescript' | false
    reactDocgen: 'react-docgen-typescript',
    // https://github.com/hipstersmoothie/react-docgen-typescript-plugin
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
      // 不忽略childrenProps
      skipChildrenPropWithoutDoc: false,
      propFilter: (prop) => {
        if (prop.declarations !== undefined && prop.declarations.length > 0) {
          const hasPropAdditionalDescription = prop.declarations.find(
            (declaration) => {
              return !declaration.fileName.includes('node_modules');
            }
          );
          return Boolean(hasPropAdditionalDescription);
        }
        return false;
      },
    },
  },
  addons: ['@storybook/addon-docs', '@storybook/addon-actions'],
  // preview webpack
  webpackFinal: (config) => getPreviewWebpackConfig(config),
  // manager webpack
  managerWebpack: (config) => getManagerWebpackConfig(config),
};

const genConfig = (config) => {
  if (config.stories) {
    config.stories = config.stories.map((item) => resolveApp(item));
  }
  return config;
};

let config = defaultConfig;
const storybook = projectConfig.storybook;
if (storybook && typeof storybook === 'function') {
  config = storybook(defaultConfig);
} else if (storybook && typeof storybook === 'object') {
  config = {
    ...defaultConfig,
    ...genConfig(storybook),
  };
}
// Export a function. Accept the base config as the only param.
module.exports = config;
