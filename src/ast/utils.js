import { getCSSRuleName, isSupportedCSSRule } from '../utils';
import { b } from './builders';
import { stylesheet } from '../stylesheets';

export const collectAttributes = ({ attributes }) => {
  if (attributes === void 0) return void 0;

  const nodes = new Map();

  let { length: i } = attributes;

  while (i) {
    i -= 1;
    const attribute = attributes[i];
    if (attribute.type !== 'JSXAttribute') {
      continue;
    }

    const {
      name: { name },
    } = attribute;

    if (!nodes.has(name)) {
      nodes.set(name, attribute);
    } else {
      attributes.splice(i, 1);
    }
  }

  return nodes;
};

const formatClassName = className => `.${className}`;

export function getClassNames(attributesMap) {
  const node = attributesMap.get('className');

  if (node === void 0) return null;

  if (node.value.type === 'StringLiteral') {
    return node.value.value.split(/\s+/).map(formatClassName);
  }

  if (
    node.value.expression === void 0 ||
    node.value.expression.type !== 'CallExpression'
  ) {
    return null;
  }

  const callExpression = node.value.expression;

  // todo: try to pass path to getClassNames to make use of referencesImport to make it bulletproof
  // path.referencesImport('classnames')

  // but for now let's just naively assume cls/cn/classnames references classnames
  if (['cn', 'cls', 'classnames'].includes(callExpression.callee.name)) {
    return callExpression.arguments
      .filter(arg => arg.type === 'StringLiteral')
      .flatMap(classes => classes.value.split(/\s+/))
      .map(formatClassName);
  }

  return null;
}

export function getAttributeExpressionValue(node, type = 'ObjectExpression') {
  if (
    node !== void 0 &&
    node.value.expression !== void 0 &&
    node.value.expression.type === type
  ) {
    return node.value.expression;
  }

  return null;
}

export function collectStyles(attributesMap) {
  const styleNode = attributesMap.get('style');
  const idNode = attributesMap.get('id');
  const classNames = getClassNames(attributesMap);

  const stylesheetRules = stylesheet.resolve(
    [idNode !== void 0 && idNode.value.value, ...(classNames || [])],
    isSupportedCSSRule,
  );

  const rules = new Map();
  const toAttach = [];

  for (const [rule, value] of stylesheetRules) {
    const ruleName = getCSSRuleName(rule);
    const ruleValue = Number.isNaN(Number(value))
      ? b.stringLiteral(value)
      : b.numericLiteral(Number(value));

    if (isSupportedCSSRule(ruleName)) {
      rules.set(ruleName, ruleValue);
    } else {
      toAttach.push(b.objectProperty(b.identifier(ruleName), ruleValue));
    }
  }

  const styleValue = getAttributeExpressionValue(styleNode);

  if (styleValue === null) {
    return rules;
  }

  const { properties } = styleValue;

  let { length: i } = properties;
  while (i) {
    i -= 1;
    const prop = properties[i];

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
      if (!rules.has(name)) {
        rules.set(name, value);
      }

      properties.splice(i, 1);
    }
  }

  properties.unshift(...toAttach);

  return rules;
}

export const isUnsupportedImportSpecifier = specifier => {
  if (specifier.type === 'ImportNamespaceSpecifier') {
    return true;
  }

  return specifier.imported.name !== specifier.local.name;
};

// let's be naive and screw require/SystemJS calls and dynamic imports
export const findImport = (body, source) => {
  for (const node of body) {
    if (node.type !== 'ImportDeclaration') break;

    if (node.source.value === source) {
      return node;
    }
  }

  return null;
};
