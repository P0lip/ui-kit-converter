import { SUPPORTED_RULES } from './consts';

export const selectorDelimiter = /\s*,\s*/;

export function getCSSRuleName(rule) {
  if (/padding|margin/.test(rule)) {
    return rule.replace(/(m|p)(?:argin|adding)(.)?/, '$1$2').toLowerCase();
  }

  return rule.replace(/-(.)/g, (_, l) => l.toUpperCase());
}

export const isSupportedCSSRule = rule => SUPPORTED_RULES.has(rule);

export const isIntrinsicElement = name =>
  name !== void 0 && /^[a-z]/.test(name);

export function determineUIKitComponent(tagName, meta) {
  let baseComponent = 'Box';
  let as = null;

  if (meta.isFlex) {
    baseComponent = 'Flex';
  }

  switch (tagName) {
    case 'div':
      break;
    case 'a':
      if (baseComponent === 'Flex') {
        as = 'Link';
      } else {
        baseComponent = 'Link';
      }

      break;
    case 'button':
      if (baseComponent === 'Flex') {
        as = 'Button';
      } else {
        baseComponent = 'Button';
      }

      break;
    default:
      as = tagName;
  }

  return {
    baseComponent,
    as,
  };
}
