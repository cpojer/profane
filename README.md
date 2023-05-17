# @nkzw/profane

Zero dependency profanity detector based on [Swearjar](https://github.com/raymondjavaxx/swearjar-node) and [Profane](https://github.com/willynilly/profane).

_Note: Some examples may contain offensive language for illustration purposes._

## install

```
npm install @nkzw/profane
```

## Usage

### `new Profane(`[`options?`](#options)`)`

Create a new instance:

```js
import Profane from 'profane';

const profane = new Profane();
```

### `check(text: string): boolean`

Check if a text matches the word list:

```js
profance.check('Hell no'); // true
profance.check('H3ll no'); // true
profane.check('Banana Banana Banana'); // false
```

### `censor(censored: string, replacement?: string): string;`

Censor words matching the word list:

```js
profane.censor('Hell no'); // '**** no'
profane.censor('Hell no', '•'); // '•••• no'
```

### `getWordFrequencies(text: string): Record<string, number>;`

Get the word frequencies of words matching the word list:

````js

```js
const frequencies = profane.getWordFrequencies('horniest hornet fart');
````

```json
{
  "horniest": 1,
  "fart": 1
}
```

### `getCategoryFrequencies(text: string): Record<string, number>;`

Get the category frequencies of words matching the word list:

```js
const frequencies = profane.getCategoryFrequencies('horniest hornet fart');
```

```json
{
  "inappropriate": 1,
  "sexual": 1
}
```

## Options

### `words: Record<string, ReadonlyArray<string>>`

You can configure your Profane instance with a custom word list by supplying an object with word definitions:

```js
const profane = new Profane({
  words: {
    happy: ['inappropriate'],
    awesome: ['elated'],
  },
});

profane.check('Mr. Happy is awesome'); // true
profane.getCategoryFrequencies('Mr. Happy is awesome'); // {inappropriate: 1, elated: 1}
```

You can receive a _copy_ of the word list through the `getWordList()` function:

```js
import { getWordList } from '@nkzw/profane';

getWordList(); // Record<string, ReadonlyArray<string>>
```

### `normalize?: boolean`

Determines whether to normalize [Leet](https://en.wikipedia.org/wiki/Leet) or not. _Defaults to `true`'._

```js
new Profane({ normalize: false }).check('H3ll'); // false
new Profane({ normalize: true }).check('H3ll'); // true
```

### `wholeWordsOnly?: boolean`

Whether to match only on whole words or not. _Defaults to `false`'._

```js
new Profane({ wholeWordsOnly: false }).check('shell'); // true
new Profane({ wholeWordsOnly: true }).check('shell'); // false
```

## Updates to the word list

The default word list was lifted from [Swearjar](https://github.com/raymondjavaxx/swearjar-node) and may be out-of-date. Please feel free to send Pull Requests with new and updated definitions.
