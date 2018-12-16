import { collectStyles, getAttributeExpressionValue } from '../utils';
import { jsxAttribute } from '../builders';

function excludeSpecialStyles([rule, { value }]) {
  return rule !== 'display' || value !== 'flex';
}

export default function(attributes, attributesMap) {
  const styleNode = attributesMap.get('style');
  const styleProps = getAttributeExpressionValue(styleNode);
  const styles = collectStyles(attributesMap);

  if (styles === null) return;
  this.isStyled = styles.size > 0;

  if (styleProps !== null && styleProps.properties.length === 0) {
    attributes.splice(attributes.indexOf(styleNode), 1);
  }

  const display = styles.get('display');

  // fixme: handle SpreadElement properly...
  attributes.unshift(
    ...[...styles].filter(excludeSpecialStyles).map(jsxAttribute),
  );

  this.isFlex = display !== void 0 && display.value === 'flex';
}
