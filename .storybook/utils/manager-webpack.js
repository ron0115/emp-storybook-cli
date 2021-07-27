const { getConfigFile, projectConfig } = require('./common');
const webpack = require('webpack');

const projectPkgJSON = getConfigFile('./package.json');

const customThemeDefined = (config) => {
  config.plugins.push(
    new webpack.DefinePlugin({
      __THEME__: {
        base: JSON.stringify(
          (projectConfig.theme && projectConfig.theme.base) || 'light'
        ),
        brandTitle: JSON.stringify(
          (projectConfig.theme && projectConfig.theme.brandTitle) ||
            projectPkgJSON.description ||
            projectPkgJSON.name
        ),
      },
    })
  );
  return config;
};

const getManagerWebpackConfig = (config) => {
  config = customThemeDefined(config);
  const webpackCb = projectConfig.managerWebpack;
  return webpackCb ? webpackCb(config) : config;
};
module.exports = {
  getManagerWebpackConfig,
  customThemeDefined,
};
