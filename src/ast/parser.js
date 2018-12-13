import * as parser from '@babel/parser';

export default {
  parse: source =>
    parser.parse(source, {
      plugins: ['typescript', 'jsx', 'classProperties', 'decorators-legacy'],
      sourceType: 'unambiguous',
      tokens: true,
    }),
};
