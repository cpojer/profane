import fs from "fs";
import Profane from "../lib/profane.js";
import _ from "lodash";
import test from "ava";

test.beforeEach((t) => {
  // This runs before each test
  t.context.p = new Profane();
});

test("loads_default_dictionary", (t) => {
  t.plan(1);
  t.true(_.keys(t.context.p.getWords()).length > 0);
});

test("has_word", (t) => {
  t.plan(3);
  t.true(t.context.p.hasWord("hell"));
  t.false(t.context.p.hasWord("1 1 1"));
  t.false(t.context.p.hasWord(undefined));
});

test("add_word", (t) => {
  t.plan(3);
  const word = "1 1 1";
  t.false(t.context.p.hasWord(word));
  t.context.p.addWord(word, ["inappropriate"]);
  t.true(t.context.p.hasWord(word));
  t.true(t.context.p.wordHasCategory(word, "inappropriate"));
});

test("remove_word", (t) => {
  t.plan(2);
  const word = "dude";
  t.true(t.context.p.hasWord(word));
  t.context.p.removeWord(word);
  t.false(t.context.p.hasWord(word));
});

test("clear_words", (t) => {
  t.plan(2);
  t.true(_.keys(t.context.p.getWords()).length > 0);
  t.context.p.clearWords();
  t.true(_.keys(t.context.p.getWords()).length === 0);
});

test("word_has_category", (t) => {
  t.plan(1);
  t.true(t.context.p.wordHasCategory("hell", "inappropriate"));
});

test("add_categories_for_word", (t) => {
  t.plan(5);
  var categories = t.context.p.getCategoriesForWord("hell");
  var catLength = categories.length;
  t.is(catLength, 2);

  t.context.p.addCategoriesForWord("hell", ["a", "b", "c"]);
  categories = t.context.p.getCategoriesForWord("hell");
  catLength = categories.length;
  t.is(catLength, 5);

  t.true(t.context.p.wordHasCategory("hell", "a"));
  t.true(t.context.p.wordHasCategory("hell", "b"));
  t.true(t.context.p.wordHasCategory("hell", "c"));
});

test("set_categories_for_word", (t) => {
  t.plan(5);
  var categories = t.context.p.getCategoriesForWord("hell");
  var catLength = categories.length;
  t.is(catLength, 2);

  t.context.p.setCategoriesForWord("hell", ["a", "b", "c"]);
  categories = t.context.p.getCategoriesForWord("hell");
  catLength = categories.length;
  t.is(catLength, 3);

  t.true(t.context.p.wordHasCategory("hell", "a"));
  t.true(t.context.p.wordHasCategory("hell", "b"));
  t.true(t.context.p.wordHasCategory("hell", "c"));
});

test("remove_categories_for_word", (t) => {
  t.plan(4);
  var categories = t.context.p.getCategoriesForWord("hell");
  var catLength = categories.length;
  t.is(catLength, 2);

  t.context.p.removeCategoriesForWord("hell", ["inappropriate"]);
  categories = t.context.p.getCategoriesForWord("hell");
  catLength = categories.length;
  t.is(catLength, 1);

  t.true(!t.context.p.wordHasCategory("hell", "inappropriate"));
  t.true(t.context.p.wordHasCategory("hell", "religious"));
});

test("get_words", (t) => {
  t.plan(2);
  const words = t.context.p.getWords();
  t.true(_.keys(words).length > 0);
  const categories = words["hell"];
  t.true(categories.length > 0);
});

test("get_word_counts without using whole word match", (t) => {
  t.plan(5);
  var wordCounts = t.context.p.getWordCounts("bob");
  t.is(_.keys(wordCounts).length, 0);
  wordCounts = t.context.p.getWordCounts("hellHellhell hell no dude");
  t.is(_.keys(wordCounts).length, 2);
  t.is(wordCounts["hell"], 4);
  t.is(wordCounts["dude"], 1);
  t.true(!("no" in wordCounts));
});

test("get_word_counts using whole word match", (t) => {
  t.plan(5);
  t.context.p.setUseWholeWordMatch(true);
  var wordCounts = t.context.p.getWordCounts("bob");
  t.is(_.keys(wordCounts).length, 0);
  wordCounts = t.context.p.getWordCounts(
    "hellHellhell hell nohell nohello hELl dude hello dudey no edude edudes"
  );
  t.is(_.keys(wordCounts).length, 2);
  t.is(wordCounts["hell"], 2);
  t.is(wordCounts["dude"], 1);
  t.true(!("no" in wordCounts));
});

test("get_category_counts without using whole word match", (t) => {
  t.plan(5);
  var categories = t.context.p.getCategoryCounts("bob");
  t.is(_.keys(categories).length, 0);
  categories = t.context.p.getCategoryCounts("hellHellhell hell no dude");
  t.is(_.keys(categories).length, 3);
  t.is(categories["inappropriate"], 4);
  t.is(categories["informal"], 1);
  t.is(categories["religious"], 4);
});

test("get_category_counts using whole word match", (t) => {
  t.plan(5);
  t.context.p.setUseWholeWordMatch(true);
  var categories = t.context.p.getCategoryCounts("bob");
  t.is(_.keys(categories).length, 0);
  categories = t.context.p.getCategoryCounts(
    "hellHellhell hell nohell nohello hELl dude hello dudey no edude edudes"
  );
  t.is(_.keys(categories).length, 3);
  t.is(categories["inappropriate"], 2);
  t.is(categories["informal"], 1);
  t.is(categories["religious"], 2);
});

test("text_is_bad without using whole word match", (t) => {
  t.plan(3);
  t.context.p.setUseWholeWordMatch(true);
  t.false(t.context.p.textIsBad("good text"));
  t.true(t.context.p.textIsBad("real fucking bad text"));
  t.false(t.context.p.textIsBad("real sfucking bad text"));
});

test("text_is_bad using whole word match", (t) => {
  t.plan(3);
  t.false(t.context.p.textIsBad("good text"));
  t.true(t.context.p.textIsBad("real fucking bad text"));
  t.true(t.context.p.textIsBad("real sfucking bad text"));
});

test("get_use_whole_word_match by default should be false", (t) => {
  t.plan(1);
  t.false(t.context.p.getUseWholeWordMatch());
});

test("set_use_whole_word_match", (t) => {
  t.plan(2);
  t.false(t.context.p.getUseWholeWordMatch());
  t.context.p.setUseWholeWordMatch(true);
  t.true(t.context.p.getUseWholeWordMatch());
});

test("load_words", (t) => {
  t.plan(5);
  t.context.p.clearWords();
  t.is(_.keys(t.context.p.getWords()).length, 0);
  t.context.p.loadWords("test/fixtures/dictionary.json");
  t.is(_.keys(t.context.p.getWords()).length, 2);
  t.true(t.context.p.hasWord("dude"));
  t.true(t.context.p.hasWord("babe"));
  t.true(t.context.p.wordHasCategory("babe", "sexist"));
});

test("load_words_from_dictionary_object", (t) => {
  var dictionary = {
    dude: ["inappropriate"],
    babe: ["inappropriate", "sexist"],
  };

  t.plan(5);
  t.context.p.clearWords();
  t.is(_.keys(t.context.p.getWords()).length, 0);
  t.context.p.loadWordsFromDictionaryObject(dictionary);
  t.is(_.keys(t.context.p.getWords()).length, 2);
  t.true(t.context.p.hasWord("dude"));
  t.true(t.context.p.hasWord("babe"));
  t.true(t.context.p.wordHasCategory("babe", "sexist"));
});
