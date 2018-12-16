import * as postcss from 'postcss';
import { selectorDelimiter } from './utils';

export const stylesheet = new class extends Map {
  constructor(...args) {
    super(...args);

    this.index = 0;
    this.order = new Map();
  }

  resolve(selectors) {
    return new Map(
      selectors
        .filter(selector => super.has(selector))
        .sort(
          (selectorA, selectorB) =>
            this.order.get(selectorA) - this.order.get(selectorB),
        )
        .flatMap(selector => Object.entries(super.get(selector))),
    );
  }

  set(selector, rules) {
    const existingRules = super.get(selector);
    if (existingRules !== void 0) {
      Object.assign(existingRules, rules);
    } else {
      super.set(selector, rules);
    }

    this.order.set(selector, this.index++); // eslint-disable-line no-plusplus

    return true;
  }
}();

const isSimpleSelector = selector => /^[.#][a-zA-z\-_/]+$/.test(selector);

function getDecls(node) {
  return node.nodes.reduce((decls, childNode) => {
    if (childNode.type === 'decl') {
      decls[childNode.prop] = childNode.value;
    }

    return decls;
  }, {});
}

export default (source, opts) => {
  const root = postcss.parse(source, opts);

  for (const node of root.nodes) {
    if (node.type !== 'rule') continue;

    if (/[#.]/.test(node.selector)) {
      let rules = null;

      for (const selector of node.selector
        .split(selectorDelimiter)
        .filter(isSimpleSelector)) {
        if (rules === null) {
          rules = getDecls(node);
        }

        stylesheet.set(selector, rules);
      }
    }
  }
};
