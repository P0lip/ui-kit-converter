import chai from 'chai';
import transform from '../src/ast/transform';

require('it-each')({ testPerIteration: true });

const { expect } = chai;

describe('Transformer', () => {
  it.each(global.fixtures, 'fixture %s', ['name'], ({ content, expected }) => {
    expect(transform(content)).to.equal(expected);
  });
});
