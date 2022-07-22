import badwords from './badwords-en.json' assert {type: 'json'};
import escapeStringRegexp from 'escape-string-regexp';

type WordList = Record<string, ReadonlyArray<string>>;

const NORMALIZERS: ReadonlyArray<[RegExp, string]> = [
  [/0/g, 'o'],
  [/1/g, 'i'],
  [/3/g, 'e'],
  [/4/g, 'a'],
  [/5/g, 's'],
  [/6/g, 'g'],
  [/7/g, 't'],
  [/8/g, 'b'],
  [/ph/g, 'f'],
];

const normalize = (text: string) => {
  NORMALIZERS.forEach(([word, replacement]) => {
    text = text.replace(word, replacement);
  });
  return text;
};

export function getWordList(): WordList {
  const copy: WordList = {};
  for (const [key, value] of Object.entries(badwords)) {
    copy[key] = value;
  }
  return copy;
}

export default class Profane {
  private words: WordList;

  constructor(
    private readonly options: {
      words?: WordList;
      normalize?: boolean;
      wholeWordsOnly?: boolean;
    } = {normalize: true, wholeWordsOnly: false, words: badwords},
  ) {
    this.words = this.options.words || badwords;
    this.options.normalize = !('normalize' in this.options)
      ? true
      : this.options.normalize;
  }

  private scan(
    text: string,
    callback: (
      word: string,
      index: number,
      categories: ReadonlyArray<string>,
    ) => boolean | void,
  ) {
    if (this.options.normalize) {
      text = normalize(text);
    }
    Object.keys(this.words).forEach((badWord) => {
      const regex = new RegExp(
        this.options.wholeWordsOnly
          ? '\\b' + escapeStringRegexp(badWord) + '\\b'
          : escapeStringRegexp(badWord),
        'ig',
      );

      let match;
      while ((match = regex.exec(text))) {
        if (callback(match[0], match.index, this.words[badWord]) === false) {
          break;
        }
      }
    });
  }

  check(text: string) {
    let hasWord = false;
    this.scan(text, () => {
      hasWord = true;
      return false;
    });
    return hasWord;
  }

  censor(censored: string, replacement: string = '*') {
    this.scan(censored, (word, index) => {
      censored =
        censored.substring(0, index) +
        word.replace(/\S/g, replacement) +
        censored.substring(index + word.length);
    });
    return censored;
  }

  getWordFrequencies(text: string) {
    const frequencies: Record<string, number> = {};
    this.scan(text, (word) => {
      word = word.toLowerCase();
      frequencies[word] = (frequencies[word] || 0) + 1;
    });
    return frequencies;
  }

  getCategoryFrequencies(text: string) {
    const frequencies: Record<string, number> = {};
    this.scan(text, (_, __, categories) =>
      categories.forEach((category) => {
        frequencies[category] = (frequencies[category] || 0) + 1;
      }),
    );
    return frequencies;
  }
}
