const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs-extra');

const resolveApp = (relativePath) => path.resolve(process.cwd(), relativePath);
const resolveLocal = (relativePath) => path.resolve(__dirname, relativePath);
const basePath = resolveApp('./src');
const storyPath = resolveApp('./stories');
const packageJSON = require(resolveLocal('../package.json'));
const webpack = require('webpack');
const getConfigFile = (path = './storybook.config.js') => {
  const jsConfigCb = resolveApp(path);
  return fs.existsSync(jsConfigCb) && require(jsConfigCb);
};
const projectConfig = getConfigFile();
const projectPkgJSON = getConfigFile('./package.json');

const getConfig = (
  config = {
    rules: [],
  }
) => {
  const include = [basePath, storyPath, resolveLocal('../.storybook')];
  // CSS
  const cssModuleReg = /(.*\.module).(s?css)+$/;
  const cssNormalReg = /^(?!.*\.module).*\.(s?css)+$/;
  const sassResouceLoader = {
    loader: require.resolve('sass-resources-loader'),
    options: {
      resources: resolveLocal('./css/globals.scss'),
    },
  };
  config.module.rules = config.module.rules.filter(
    (rule) => !rule.test.toString().includes('css')
  );
  // css-modules
  config.module.rules.push({
    test: cssModuleReg,
    use: [
      'style-loader',
      {
        loader: require.resolve('css-loader'),
        options: {
          modules: {
            localIdentName: '[name]__[local]__[hash:base64:5]',
          },
        },
      },
      'sass-loader',
      sassResouceLoader,
    ],
    sideEffects: true,
    include,
  });

  // normal css
  config.module.rules.push({
    test: cssNormalReg,
    use: [
      {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            parser: 'postcss-scss',
          },
          // https://juejin.im/post/5b2cc251f265da5976548453
        },
      },
      {
        loader: MiniCssExtractPlugin.loader,
        // TODO: 非css-modules的hmr失效
        options: {
          // hmr: true,
          // reloadAll: true
        },
      },
      'css-loader',
      'sass-loader',
      sassResouceLoader,
    ].filter(Boolean),
    include,
    // https://github.com/storybookjs/storybook/issues/4802#issuecomment-446233703
    sideEffects: true, // 👈 ADD THIS
  });

  config.plugins.push(new MiniCssExtractPlugin());

  config.resolve.extensions.push('.ts', '.tsx');

  config.resolve.alias = {
    '@': basePath,
    '@stories': storyPath,
    src: basePath,
  };
  // webpack5
  config.resolve.fallback = {
    fs: false,
    tls: false,
    net: false,
    path: false,
    zlib: false,
    http: false,
    https: false,
    stream: false,
    crypto: false,
    assert: false,
  };
  // console.log(config.module.rules)
  config.module.rules[0].exclude = new RegExp(
    `node_modules\/(?!(${packageJSON.name.replace('/', '/')})\/).*`
  );

  const webpackCb = projectConfig.webpack;
  return webpackCb ? webpackCb(config) : config;
};

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
  webpackFinal: (config) => {
    return getConfig(config);
  },
  getConfig,
  managerWebpack: (config) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        // __THEME_TITLE__: projectConfig.theme.brandTitle || packageJSON.name,
        // __THEME_BASE__: projectConfig.theme.base,
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
  },
};

let config = defaultConfig;
const storybookCb = projectConfig.storybook;
if (storybookCb) {
  config = storybookCb(defaultConfig);
}
// Export a function. Accept the base config as the only param.
module.exports = config;
module.exports.packageJSON = packageJSON;
module.exports.projectConfig = projectConfig;
