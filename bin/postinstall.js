const fs = require('fs-extra');
const { execSync } = require('child_process');
const { resolveLocal } = require('../.storybook/utils/common');

console.info('postinstall start...');
if (
  fs.existsSync(resolveLocal('node_modules/@storybook')) &&
  !fs.existsSync(resolveLocal('node_modules/react'))
) {
  console.info(
    'Global install mode, not exists react, start install react react-dom'
  );
  execSync(
    'npm i react@16.8.0 react-dom@16.8.0',
    {
      cwd: resolveLocal(''),
      stdio: 'inherit',
      shell: process.platform === 'win32',
    },
    (err, stdout, stderr) => {
      if (err) {
        console.log(err);
      }
    }
  );
} else {
  console.info('not global install mode, exit.');
}
