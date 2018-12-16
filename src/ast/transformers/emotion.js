import { EMOTION_SOURCE_NAME, PRAGMA_VALUE } from '../../consts';
import { b } from '../builders';
import { findImport, isUnsupportedImportSpecifier } from '../utils';

export default body => {
  const importNode = findImport(body, EMOTION_SOURCE_NAME);

  if (importNode === null) {
    body.unshift(
      b.importDeclaration(
        [b.importSpecifier(b.identifier(PRAGMA_VALUE))],
        b.literal(EMOTION_SOURCE_NAME),
      ),
    );

    return;
  }

  for (const specifier of importNode.specifiers) {
    if (isUnsupportedImportSpecifier(specifier)) {
      return;
    }

    if (specifier.imported.name === PRAGMA_VALUE) {
      return;
    }
  }

  importNode.specifiers.push(
    b.importSpecifier(b.identifier(PRAGMA_VALUE), b.identifier(PRAGMA_VALUE)),
  );
};
