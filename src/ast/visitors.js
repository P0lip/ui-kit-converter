import { collectAttributes } from './utils';
import { isIntrinsicElement } from '../utils';
import transformAttributes from './transformers/attributes';
import transformName from './transformers/name';

export default context => ({
  visitJSXElement(path) {
    const { node } = path;
    const {
      openingElement,
      openingElement: {
        attributes,
        name: { name: nodeName },
      },
      closingElement,
    } = node;

    if (isIntrinsicElement(nodeName)) {
      const attributesMap = collectAttributes(openingElement);
      if (attributesMap !== void 0 && attributesMap.size > 0) {
        transformAttributes.call(context, attributes, attributesMap);
        transformName.call(context, openingElement, closingElement, nodeName);
      }
    }

    this.traverse(path);
  },
});
