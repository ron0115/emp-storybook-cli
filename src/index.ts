import { StorybookConfig } from '@storybook/core-common/types/index';
const { spawn } = require('child_process');
const path = require('path');
const rimraf = require('rimraf');

export const runStorybook = ({
  configDir = path.resolve(__dirname, '../.storybook'),
  outputDir = '.out',
  command = 'build-storybook',
  commandParams = [''],
}) => {
  return new Promise((resolve, reject) => {
    const params = ['--config-dir', configDir];
    if (command === 'build-storybook') {
      rimraf.sync(outputDir);
      params.push('--output-dir');
      params.push(outputDir);
    }
    const spawned = spawn(
      path.join('node_modules', '.bin', command),
      [...params, ...commandParams],
      {
        stdio: 'inherit',
        shell: process.platform === 'win32',
      }
    );

    spawned.on('exit', (code: any) => {
      if (code === 0) {
        resolve('emp-storybook-cli success');
      } else {
        reject(new Error('emp-storybook-cli success fail'));
      }
    });
  });
};

export const runBuild = async () =>
  await runStorybook({
    command: 'build-storybook',
    commandParams: ['--docs'],
    outputDir: 'public',
  });

export const runDev = async () =>
  await runStorybook({
    command: 'start-storybook',
    commandParams: ['-p', '6006', '--docs'],
  });

export type EmpStorybookCli = {
  storybook?: (config: StorybookConfig) => StorybookConfig;
  previewWebpack?: StorybookConfig['webpackFinal'];
  theme?: {
    base?: 'light' | 'dark';
    brandTitle?: string;
  };
  managerWebpack?: StorybookConfig['webpackFinal']
};

export { StorybookConfig } from '@storybook/core-common/types/index';
