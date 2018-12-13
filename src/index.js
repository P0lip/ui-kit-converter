#!/usr/bin/env node
import transform from './ast/transform';
import argv from './cli/index';
import fs from './fs';

(async () => {
  try {
    await fs({
      cwd: argv.cwd,
      ignore: argv.ignore,
      pattern: argv.pattern,
      transform,
    });
    process.exit(0);
  } catch (ex) {
    console.error(ex);
    process.exit(1);
  }
})();
