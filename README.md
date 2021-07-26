# emp-storybook-cli

> 0 配置 Storybook React 组件库 CLI

## 使用

创建 `*.stories.tsx`, 即可为你组件创建 storybook 文档！

> 默认目录：`root_dir/src`或者`root_dir/stories`

### CLI

向`package.json`中添加对应 script

```json
{
  "scripts": {
    "docs:dev": "emp-storybook dev",
    "docs:build": "emp-storybook build"
  }
}
```

### 自定义 Storybook 或者 webpack 配置

```js
const {EmpStorybookCli} = require('emp-storybook-cli')
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

/**
 * @type {EmpStorybookCli}
 */
module.exports = {
  // https://storybook.js.org/docs/react/configure/overview
  storybook: config => {
    return {
      ...config,
      // override your storybook config
      stories: [path.resolve(__dirname, './src/**/*.stories.@(jsx|tsx)')],
    }
  },
  webpack: (config) => {
    config.plugins.push(new ModuleFederationPlugin({...}))
    return config
  }
}

```

## 注意事项

### 仓库请使用 yarn

不限于@emp 项目，但仅支持`webpack@5`以上版本的现有项目，并且需要在项目中使用`yarn resolutions`锁定 webpack 和相关插件的版本

> 拷贝如下代码到`package.json`追加到配置末尾即可。

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
    "mini-css-extract-plugin": "^0.9.0"
  }
}
```

## 已知问题

1. storybook 仍不支持 remotes 包，由于源码仍未兼容 bootstrap 写法, 详见
   https://github.com/storybookjs/storybook/issues/15177
