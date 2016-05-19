# profane
A profanity detector.

## Usage
```js

var Profane = require('profane');
var p = new Profane();

// get the set of all inappropriate words in a string
var wordCounts = p.getWordCounts("hell no dude");
console.log(wordCounts);

/*

{
  'hell': 1,
  'dude': 1,
}

*/

// get an associative array of all of categories found,
// where the key is the category and the value is the number
// of words found for that category
var categoryCounts = p.getCategoryCounts("hell no dude");
console.log(categoryCounts);

/*

{
  'inappropriate': 1,
  'informal': 1,
  'religious': 1,
}

*/

p.addWord("nasty", ["inappropriate", "gross"]);
wordCounts = p.getWordCounts("you are nasty");
console.log(wordCounts);

/*
{
  'nasty': 1,
}
*/


if (p.wordHasCategory("nasty", "gross")) {
  console.log("This will be printed");
}

p.removeWord("nasty");

if (p.hasWord("nasty")) {
  console.log("This won't be printed");
}

p.clearWords();
if (p.hasWord("hell")) {
  console.log("This won't be printed");
}

p.addWord("hell", ["religious"]);
p.addCategoriesForWord("hell", ["inappropriate"]);
p.removeCategoriesForWord("hell", ["religious"]);
p.setCategoriesForWord("hell", ["inappropriate", "religious"]);


```
