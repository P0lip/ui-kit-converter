export const findAttributeNode = ({ attributes }, name) => {
  let node = null;
  let { length: i } = attributes;

  while (i) {
    i -= 1;
    const attribute = attributes[i];
    if (attribute.type !== 'JSXAttribute') {
      continue;
    }

    if (attribute.name.name !== name) {
      continue;
    }

    if (node === null) {
      node = attribute;
    } else {
      attributes.splice(i, 1);
    }
  }

  if (
    node === null ||
    node.value.type === 'StringLiteral' ||
    node.value.expression.type !== 'ObjectExpression' ||
    node.value.expression.properties.length === 0
  ) {
    return null;
  }

  return node;
};
