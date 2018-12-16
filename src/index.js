#!/usr/bin/env node
import 'core-js/fn/array/flat-map';
import 'object.fromentries/auto';
import transform from './ast/transform';
import processStylesheet from './stylesheets';
import argv from './cli/index';
import fs from './fs';

(async () => {
  try {
    if (argv.stylesheet) {
      // const axios = await import('axios');
      const axios = require('axios');
      await Promise.all(
        argv.stylesheet.map(async link => {
          if (link.startsWith('http')) {
            processStylesheet((await axios.get(link)).data);
          }
        }),
      );
    }

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
