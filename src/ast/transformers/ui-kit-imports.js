import { UI_KIT_SOURCE_NAME } from '../../consts';
import { b } from '../builders';
import { findImport, isUnsupportedImportSpecifier } from '../utils';

export default (body, imports) => {
  const importNode = findImport(body, UI_KIT_SOURCE_NAME);

  if (importNode === null) {
    body.unshift(
      b.importDeclaration(
        imports.map(decl => b.importSpecifier(b.identifier(decl))),
        b.literal(UI_KIT_SOURCE_NAME),
      ),
    );

    return;
  }

  for (const specifier of importNode.specifiers) {
    if (isUnsupportedImportSpecifier(specifier)) {
      return;
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
};
