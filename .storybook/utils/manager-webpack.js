const { getConfigFile, projectConfig } = require('./common');
const webpack = require('webpack');

const projectPkgJSON = getConfigFile('./package.json');

const encodeDefined = (obj) => {
  for (const key in obj) {
    obj[key] = JSON.stringify(obj[key]);
  }
  return obj;
};

const customThemeDefined = (config) => {
  const __config_theme__ = encodeDefined({
    base: (projectConfig.theme && projectConfig.theme.base) || 'light',
    brandTitle:
      (projectConfig.theme && projectConfig.theme.brandTitle) ||
      projectPkgJSON.description ||
      projectPkgJSON.name,
    ...encodeDefined(projectConfig.theme || {}),
  });
  const __config_addons__ = encodeDefined(projectConfig.addons || {});
  config.plugins.push(
    new webpack.DefinePlugin({
      __config_theme__,
      __config_addons__,
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
