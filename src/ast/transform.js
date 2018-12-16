import * as recast from 'recast';
import * as t from 'ast-types';
import parser from './parser';
import visitors from './visitors';
import insertImports from './transformers/ui-kit-imports';
import insertEmotion from './transformers/emotion';
import insertPragma from './transformers/pragma';

export default source => {
  const ast = recast.parse(source, { parser });
  const {
    program: { body },
  } = ast;

  const imports = [];
  const context = {
    imports,
    isStyled: false,
    isFlex: false,
  };

  t.visit(ast, visitors(context));

  if (imports.length > 0) {
    insertImports(body, imports);
    insertEmotion(body);
    insertPragma(body);
  }

  return recast.print(ast).code;
};
