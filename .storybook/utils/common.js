const path = require('path');
const fs = require('fs-extra');

const resolveApp = (relativePath) => path.resolve(process.cwd(), relativePath);

const getConfigFile = (path = './storybook.config.js') => {
  const jsConfigCb = resolveApp(path);
  return fs.existsSync(jsConfigCb) && require(jsConfigCb);
};

const projectConfig = getConfigFile();

module.exports = {
  getConfigFile,
  resolveApp,
  projectConfig,
};
