#!/usr/bin/env node
const cac = require('cac');
const cli = cac('emp-storybook');
const { runBuild, runDev } = require('../dist/index');
const pkg = require('../package.json');

cli.command('dev', '启动Storybook Dev').alias('d').action(runDev);

cli.command('build', '构建Storybook').alias('b').action(runBuild);

cli.help();

cli.version(pkg.version);

cli.parse();
