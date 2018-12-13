import { asAttribute, b, jsxAttribute } from './builders';
import { findAttributeNode } from './utils';
import { collectStyles, determineProperComponent } from '../utils';

export default context => ({
  visitJSXOpeningElement(path) {
    const { node } = path;
    const {
      attributes,
      name: { name: nodeName },
    } = node;

    if (!/^[a-z]/.test(nodeName)) {
      this.traverse(path);
      return;
    }

    const attrNode = findAttributeNode(node, 'style');
    if (attrNode === null) {
      this.traverse(path);
      return;
    }

    const styles = collectStyles(attrNode.value.expression);

    if (styles !== null) {
      if (styles.meta.isEmpty) {
        attributes.splice(attributes.indexOf(attrNode), 1);
      }

      const { baseComponent, as } = determineProperComponent(
        nodeName,
        styles.meta,
      );

      if (!context.imports.includes(baseComponent)) {
        context.imports.push(baseComponent);
      }
      node.name = b.jsxIdentifier(baseComponent);

      // fixme: handle SpreadElement properly...
      node.attributes.unshift(...styles.props.map(jsxAttribute));

      if (as !== null) {
        node.attributes.unshift(asAttribute(as));
      }
    }

    if (path.parentPath !== void 0) {
      const {
        parentPath: { node: parentNode },
      } = path;
      if (parentNode.closingElement !== null) {
        parentNode.closingElement.name = b.jsxIdentifier(node.name.name);
      }
    }

    this.traverse(path);
  },
});
