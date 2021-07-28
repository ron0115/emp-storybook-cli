# emp-storybook-cli

> 0 配置 Storybook React 组件库 CLI

## 使用

### 全局安装

安装

```sh
npm i -g emp-storybook-cli
```

运行 `dev` / `build`

```sh
# 调试
emp-storybook dev
# 构建
emp-storybook build
```

### 局部安装

0. 安装 CLI

```sh
yarn add emp-storybook-cli -D
```

1. 创建 `*.stories.tsx`, 即可为你组件创建 storybook 文档！

> 默认匹配目录：`root_dir/src`或者`root_dir/stories`，可通过`storybook.config.js`覆盖配置

2. 向`package.json`中添加对应 script

```json
{
  "scripts": {
    "docs:dev": "emp-storybook dev",
    "docs:build": "emp-storybook build"
  }
}
```

3. 执行 cli

开发

```sh
yarn docs:dev
```

构建

```sh
yarn docs:build
```

### 自定义 Storybook 配置

在项目根目录新建`storybook.config.js`,相关配置项见如下注释

```js
const {EmpStorybookCli} = require('emp-storybook-cli')
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

/**
 * @type {EmpStorybookCli}
 */
module.exports = {
  // custom storybook config: https://storybook.js.org/docs/react/configure/overview
  storybook: config => {
    return {
      ...config,
      // override your storybook config
      stories: [path.resolve(__dirname, './src/**/*.stories.@(jsx|tsx)')],
    }
  },
  // custom preview webpack config
  previewWebpack: (config) => {
    config.plugins.push(new ModuleFederationPlugin({...}))
    return config
  },
  // custom preview webpack config
  managerWebpack: config => config,
  // custom theme config
  theme: {
    // auto get description/name in package.json, or custom by brandTitle
    brandTitle: 'EMP组件库',
    // 'light' | 'dark'
    theme: 'light'
  }
}

```

## 注意事项

### 关于 webpack5

> 如果你的项目不基于 webpack 构建，可忽略以下事项

如果你项目中依赖有 webpack，请确保支持`webpack > 5`，并且请在项目中使用`yarn resolutions`锁定 webpack 和相关插件的版本，防止与现有版本冲突导致构建失败。

> 拷贝如下代码到`package.json`即可。

```json
{
  "resolutions": {
    "webpack": "^5.0.0",
    "css-loader": "^5.0.0",
    "dotenv-webpack": "^6.0.0",
    "html-webpack-plugin": "^5.0.0",
    "style-loader": "^2.0.0",
    "terser-webpack-plugin": "^5.0.0",
    "webpack-dev-middleware": "^4.1.0",
    "webpack-virtual-modules": "^0.4.2",
    "mini-css-extract-plugin": "^1.3.9"
  }
}
```

#### 已知问题

1. webpack5 模式下，storybook 仍不支持 remotes 包，由于源码仍未兼容 bootstrap 写法, 详见
   https://github.com/storybookjs/storybook/issues/15177
