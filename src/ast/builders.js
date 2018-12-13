import * as t from 'ast-types';

const { builders: b } = t;

export const jsxAttribute = ([name, value]) =>
  b.jsxAttribute(
    b.jsxIdentifier(name),
    value.type === 'StringLiteral'
      ? b.literal(value.value)
      : b.jsxExpressionContainer(value),
  );

export const asAttribute = component =>
  jsxAttribute([
    'as',
    /^[A-Z]/.test(component)
      ? b.identifier(component)
      : b.stringLiteral(component),
  ]);

export { b };
