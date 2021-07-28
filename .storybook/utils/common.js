const path = require('path');
const fs = require('fs-extra');

const resolveApp = (relativePath) => {
  // fix process.cwd get wrong globs of using \
  return path.posix.join(process.cwd().split(path.sep).join('/'), relativePath);
};

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
