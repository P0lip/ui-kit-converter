import yargs from 'yargs';
import * as path from 'path';

const cwd = process.cwd();

yargs
  .option('ignore', {
    alias: 'i',
    default: ['node_modules', '**/*.{test,spec}.{js,jsx,ts,tsx}'],
    description: 'Pattern of files to ignore',
    type: 'array',
  })
  .option('pattern', {
    default: ['**/*.{t,j}s{x,}'],
    description: 'File pattern to match against',
    type: 'array',
  });

const { argv } = yargs;

export { argv };

export default {
  ignore: argv.ignore,
  pattern: argv.pattern,
  cwd: argv._[argv._.length - 1]
    ? path.resolve(cwd, argv._[argv._.length - 1])
    : cwd,
};
