import Profane from './profane.js';
import {test, expect} from 'vitest';

test('`getWordFrequencies` without using whole word match', () => {
  const p = new Profane();
  expect(Object.keys(p.getWordFrequencies('bob')).length).toEqual(0);
  expect(p.getWordFrequencies('hellHellhell hell no dumbass'))
    .toMatchInlineSnapshot(`
    {
      "ass": 1,
      "dumbass": 1,
      "hell": 4,
    }
  `);
});

test('`getWordFrequencies` using whole word match', () => {
  const p = new Profane({wholeWordsOnly: true});
  expect(p.getWordFrequencies('bob')).toMatchInlineSnapshot('{}');
  expect(
    p.getWordFrequencies(
      'hellHellhell hell nohell nohello hELl dumbass hello dumbassy no edumbass edumbasss',
    ),
  ).toMatchInlineSnapshot(`
    {
      "dumbass": 1,
      "hell": 2,
    }
  `);
});

test('`getCategoryFrequencies` without using whole word match', () => {
  const p = new Profane();
  expect(p.getCategoryFrequencies('bob')).toMatchInlineSnapshot('{}');
  expect(p.getCategoryFrequencies('hellHellhell hell no dumbass'))
    .toMatchInlineSnapshot(`
    {
      "inappropriate": 4,
      "insult": 2,
      "religious": 4,
      "sexual": 1,
    }
  `);
});

test('`getCategoryFrequencies` using whole word match', () => {
  const p = new Profane({wholeWordsOnly: true});
  expect(p.getCategoryFrequencies('bob')).toMatchInlineSnapshot('{}');
  expect(
    p.getCategoryFrequencies(
      'hellHellhell hell nohell nohello hELl dumbass hello dumbassy no edumbass edumbasss',
    ),
  ).toMatchInlineSnapshot(`
    {
      "inappropriate": 2,
      "insult": 1,
      "religious": 2,
    }
  `);
});

test('`check` using whole word match', () => {
  const p = new Profane({wholeWordsOnly: true});
  expect(p.check('good text')).toBe(false);
  expect(p.check('real fucking bad text')).toBe(true);
  expect(p.check('real sfucking bad text')).toBe(false);
  expect(p.check('this is not 4ss')).toBe(true);
});

test('`check` without using whole word match', () => {
  const p = new Profane();
  expect(p.check('good text')).toBe(false);
  expect(p.check('real fucking bad text')).toBe(true);
  expect(p.check('real sfucking bad text')).toBe(true);
});

test('`censor`', () => {
  const p = new Profane({wholeWordsOnly: true});
  expect(p.censor('good text')).toMatchInlineSnapshot('"good text"');
  expect(p.censor('real fucking bad text')).toMatchInlineSnapshot(
    '"real ******* bad text"',
  );
  expect(p.censor('real fucking bad text', '_')).toMatchInlineSnapshot(
    '"real _______ bad text"',
  );
  expect(p.censor('real sfucking bad text')).toMatchInlineSnapshot(
    '"real sfucking bad text"',
  );
});
