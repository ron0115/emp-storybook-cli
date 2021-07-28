'use strict';

const execa = require('execa');
const { mkdirp, remove, writeFileSync } = require('fs-extra');
const { join, resolve } = require('path');

jest.setTimeout(1000 * 60 * 10);

const genPath = join(__dirname, '../public');

const generatedFiles = ['index.html', 'iframe.html', 'main.css'];

beforeEach(() => remove(genPath));
afterAll(() => remove(genPath));

const run = (args = [], options = {}) =>
  execa(
    'node',
    [resolve(__dirname, '../bin/cli.js'), 'build'].concat(args),
    options
  );

describe('storybook build', () => {
  it('creates a project in the current directory', async () => {
    // Create a project in the current directory
    await run();
    // Assert for the generated files
    generatedFiles.forEach((file) => expect(join(genPath, file)).toBeTruthy());
  });
});
