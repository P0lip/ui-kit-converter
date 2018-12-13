import { SUPPORTED_RULES } from './consts';

export function getCSSRuleName(rule) {
  if (/padding|margin/.test(rule)) {
    return rule.replace(/(m|p)(?:argin|adding)(.)?/, '$1$2').toLowerCase();
  }

  return rule.replace(/-(.)/, (_, l) => l.toUpperCase());
}

export const isSupportedCSSRule = rule => SUPPORTED_RULES.has(rule);

export function collectStyles(node) {
  if (node === void 0 || node.type !== 'ObjectExpression') {
    return null;
  }

  const props = [];
  const styles = {
    meta: {
      isEmpty: false,
      isFlex: false,
    },
    props,
  };

  let { length: i } = node.properties;
  while (i) {
    i -= 1;
    const prop = node.properties[i];

    if (prop.type === 'SpreadElement') {
      // fixme: provide better support for it
      continue;
    }

    if (prop.computed) {
      continue;
    }

    const { value } = prop;

    const name = getCSSRuleName(
      prop.key.type === 'StringLiteral' ? prop.key.value : prop.key.name,
    );

    if (isSupportedCSSRule(name)) {
      if (
        name === 'display' &&
        value.type === 'StringLiteral' &&
        value.value === 'flex'
      ) {
        styles.meta.isFlex = true;
      } else {
        props.push([name, value]);
      }

      node.properties.splice(i, 1);
    }
  }

  styles.meta.isEmpty = node.properties.length === 0;
  return styles;
}

export function determineProperComponent(tagName, meta) {
  let baseComponent = 'Box';
  let as = null;

  if (meta.isFlex) {
    baseComponent = 'Flex';
  } else if (tagName === 'button') {
    baseComponent = 'Button';
  }

  switch (tagName) {
    case 'div':
      break;
    case 'button':
      if (baseComponent === 'Button') {
        break;
      }
    // eslint-disable-next-line no-fallthrough
    default:
      as = tagName;
  }

  return {
    baseComponent,
    as,
  };
}
