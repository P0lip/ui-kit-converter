import chai from 'chai';
import processStylesheet, { stylesheet } from '../src/stylesheets';

require('it-each')();

const { expect } = chai;

describe('Stylesheet', () => {
  describe('resolve', () => {
    it('resolves styles for given selectors', () => {
      processStylesheet('.foo { display: flex; margin: 0; }');
      processStylesheet('#foo { display: block }');
      expect(
        Object.fromEntries(stylesheet.resolve(['.foo', '#foo'])),
      ).to.deep.equal({
        display: 'block',
        margin: '0',
      });
    });
  });
});

describe('Stylesheet parsing', () => {
  beforeEach(() => {
    stylesheet.clear(); // singleton ;p
  });

  // todo: this could be supported
  it('ignores pseudo selectors for now', () => {
    processStylesheet('.foo:hover { display: flex }');
    expect(stylesheet.size).to.equal(0);
  });

  // todo: limited cases could be supported
  it('ignores attribute selectors for now', () => {
    processStylesheet('.foo[name="test"] { display: flex }');
    processStylesheet('#foo[name^="test"] { display: flex }');
    processStylesheet('#foo[name$="test"] { display: flex }');
    processStylesheet('.bar[name~="test"] { display: flex }');

    expect(stylesheet.size).to.equal(0);
  });

  // todo: limited cases could be supported
  it('ignores attribute selectors for now', () => {
    processStylesheet('.foo[name="test"] { display: flex }');
    expect(stylesheet.size).to.equal(0);
  });

  it('handles classes', () => {
    processStylesheet('.foo { display: flex }');
    expect(...stylesheet).to.deep.equal(['.foo', { display: 'flex' }]);
  });

  it('handles ids', () => {
    processStylesheet('#abc { display: flex }');
    expect(...stylesheet).to.deep.equal(['#abc', { display: 'flex' }]);
  });

  it('handles multiple matching selectors', () => {
    processStylesheet(
      '.foo, #test, image, #test .foo { position: relative; margin: 0 auto; }',
    );

    expect(stylesheet.size).to.equal(2);
    expect(stylesheet.get('.foo')).to.deep.equal({
      position: 'relative',
      margin: '0 auto',
    });
    expect(stylesheet.get('#test')).to.deep.equal({
      position: 'relative',
      margin: '0 auto',
    });
  });

  it('merges declarations', () => {
    processStylesheet('.foo { border: none; }');
    processStylesheet('.foo { position: relative; }');
    processStylesheet('.foo { position: absolute; }');

    expect(...stylesheet).to.deep.equal([
      '.foo',
      { border: 'none', position: 'absolute' },
    ]);
  });

  it('de-duplicates rule declarations', () => {
    processStylesheet('.foo { display: flex; display: block; }');
    expect(...stylesheet).to.deep.equal(['.foo', { display: 'block' }]);
  });

  it('reuse stylesheet instance', () => {
    processStylesheet('.foo { foo: bar }');
    processStylesheet('#test, test, .abc { bar: foo }');

    expect(stylesheet.size).to.equal(3);
  });
});
