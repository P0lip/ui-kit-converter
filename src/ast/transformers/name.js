import { asAttribute, b } from '../builders';
import { determineUIKitComponent, isIntrinsicElement } from '../../utils';

export default function(openingElement, closingElement) {
  if (!this.isStyled) {
    return;
  }

  const {
    attributes,
    name: { name: nodeName },
  } = openingElement;

  const { baseComponent, as } = determineUIKitComponent(nodeName, {
    isFlex: this.isFlex,
  });

  if (!this.imports.includes(baseComponent)) {
    this.imports.push(baseComponent);
  }

  if (as !== null && !isIntrinsicElement(as) && !this.imports.includes(as)) {
    this.imports.push(as);
  }

  if (closingElement !== null) {
    closingElement.name = b.jsxIdentifier(baseComponent);
  }
  openingElement.name = b.jsxIdentifier(baseComponent);

  if (as !== null) {
    attributes.unshift(asAttribute(as));
  }
}
