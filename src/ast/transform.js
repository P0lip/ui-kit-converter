import * as recast from 'recast';
import * as t from 'ast-types';
import parser from './parser';
import visitors from './visitors';
import { b } from './builders';
import { UI_KIT_NAME } from '../consts';

export default source => {
  const ast = recast.parse(source, { parser });
  const {
    program: { body },
  } = ast;

  const imports = [];
  const context = {
    imports,
  };

  t.visit(ast, visitors(context));

  insertImports: if (imports.length > 0) {
    // let's be naive and screw require/SystemJS calls and dynamic imports
    let importNode = null;
    for (const node of body) {
      if (node.type !== 'ImportDeclaration') break;
      if (node.source.value === UI_KIT_NAME) {
        importNode = node;
        break;
      }
    }

    if (importNode === null) {
      body.unshift(
        b.importDeclaration(
          imports.map(decl =>
            b.importSpecifier(b.identifier(decl), b.identifier(decl)),
          ),
          b.literal(UI_KIT_NAME),
        ),
      );
    } else {
      for (const specifier of importNode.specifiers) {
        if (specifier.type === 'ImportNamespaceSpecifier') {
          break insertImports;
        }

        if (specifier.imported.name !== specifier.local.name) {
          break insertImports;
        }

        const index = imports.indexOf(specifier.imported.name);
        if (index !== -1) {
          imports.splice(index, 1);
        }
      }

      for (const missingImport of imports) {
        importNode.specifiers.push(
          b.importSpecifier(
            b.identifier(missingImport),
            b.identifier(missingImport),
          ),
        );
      }
    }
  }

  return recast.print(ast).code;
};
