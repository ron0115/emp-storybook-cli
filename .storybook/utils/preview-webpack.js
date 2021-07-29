const { projectConfig, resolveApp, resolveLocal } = require('./common');
const basePath = resolveApp('./src');
const storyPath = resolveApp('./stories');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { customThemeDefined } = require('./manager-webpack');

const packageJSON = require(resolveLocal('package.json'));
const getPreviewWebpackConfig = (
  config = {
    rules: [],
  }
) => {
  const include = [basePath, storyPath, resolveLocal('.storybook')]; // CSS
  const cssModuleReg = /(.*\.module).(s?css)+$/;
  const cssNormalReg = /^(?!.*\.module).*\.(s?css)+$/;
  const sassResouceLoader = {
    loader: require.resolve('sass-resources-loader'),
    options: {
      resources: resolveLocal('.storybook/css/globals.scss'),
    },
  };
  config.module.rules = config.module.rules.filter(
    (rule) => !rule.test.toString().includes('css')
  );
  // css-modules
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

  // normal css
  config.module.rules.push({
    test: cssNormalReg,
    use: [
      {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            parser: 'postcss-scss',
          },
        },
      },
      {
        // TODO: 非css-modules的hmr失效
        // TOOD: 先锁定webpack5.0.0，如果升级，考虑webpack5跟mimicss插件一起升级才能兼容
        loader: MiniCssExtractPlugin.loader,
        options: {
          // hmr: true,
          // reloadAll: true
        },
      },
      'css-loader',
      'sass-loader',
      sassResouceLoader,
    ].filter(Boolean),
    include, // https://github.com/storybookjs/storybook/issues/4802#issuecomment-446233703
    sideEffects: true, // 👈 ADD THIS
  });

  config.plugins.push(new MiniCssExtractPlugin());

  config.resolve.extensions.push('.ts', '.tsx');

  config.resolve.alias = {
    '@': basePath,
    '@stories': storyPath,
    src: basePath,
  }; // webpack5
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

  config.module.rules[0].exclude = new RegExp(
    `node_modules\/(?!(${packageJSON.name})\/).*`
  );
  // useful in global install mode
  config.module.rules[0].include.push(resolveLocal('.storybook'));

  config = customThemeDefined(config);

  const webpackCb = projectConfig.previewWebpack;
  return webpackCb ? webpackCb(config) : config;
};

module.exports = {
  getPreviewWebpackConfig,
};
