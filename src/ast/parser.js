import * as parser from '@babel/parser';

import opts from '../cli/index';

export default {
  parse: source =>
    parser.parse(source, {
      plugins: [
        'classProperties',
        'jsx',
        ...((opts.parser && opts.parser.plugins) || [
          'typescript',
          'decorators-legacy',
        ]),
      ],
      sourceType: 'unambiguous',
      tokens: true,
      ranges: true,
    }),
};
