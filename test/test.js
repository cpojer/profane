var fs = require('fs');
var Profane = require('../lib/profane');
var _ = require('lodash');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.profane = {
    setUp: function(done) {
        // setup here if necessary
        this.p = new Profane();
        done();
    },

    loads_default_dictionary: function(test) {
        test.expect(1);
        test.ok(_.keys(this.p.getWords()).length > 0);
        test.done();
    },

    has_word: function(test) {
        test.expect(3);
        test.equals(this.p.hasWord("hell"), true);
        test.equals(this.p.hasWord("1 1 1"), false);
        test.equals(this.p.hasWord(undefined), false);
        test.done();
    },

    add_word: function(test) {
        test.expect(3);
        var word = "1 1 1";
        test.equals(this.p.hasWord(word), false);
        this.p.addWord(word, ["inappropriate"]);
        test.equals(this.p.hasWord(word), true);
        test.equals(this.p.wordHasCategory(word, "inappropriate"), true);
        test.done();
    },

    remove_word: function(test) {
        test.expect(2);
        var word = "dude";
        test.equals(this.p.hasWord(word), true);
        this.p.removeWord(word);
        test.equals(this.p.hasWord(word), false);
        test.done();
    },

    clear_words: function(test) {
        test.expect(2);
        test.equals(_.keys(this.p.getWords()).length > 0, true);
        this.p.clearWords();
        test.equals(_.keys(this.p.getWords()).length === 0, true);
        test.done();
    },

    word_has_category: function(test) {
        test.expect(1);
        test.equal(this.p.wordHasCategory("hell", "inappropriate"), true);
        test.done();
    },

    add_categories_for_word: function(test) {
        test.expect(5);
        var categories = this.p.getCategoriesForWord("hell");
        var catLength = categories.length;
        test.equal(catLength, 2);

        this.p.addCategoriesForWord("hell", ["a", "b", "c"])
        categories = this.p.getCategoriesForWord("hell");
        catLength = categories.length;
        test.equal(catLength, 5);

        test.ok(this.p.wordHasCategory("hell", "a"));
        test.ok(this.p.wordHasCategory("hell", "b"));
        test.ok(this.p.wordHasCategory("hell", "c"));

        test.done();
    },

    set_categories_for_word: function(test) {
        test.expect(5);
        var categories = this.p.getCategoriesForWord("hell");
        var catLength = categories.length;
        test.equal(catLength, 2);

        this.p.setCategoriesForWord("hell", ["a", "b", "c"])
        categories = this.p.getCategoriesForWord("hell");
        catLength = categories.length;
        test.equal(catLength, 3);

        test.ok(this.p.wordHasCategory("hell", "a"));
        test.ok(this.p.wordHasCategory("hell", "b"));
        test.ok(this.p.wordHasCategory("hell", "c"));

        test.done();
    },

    remove_categories_for_word: function(test) {
        test.expect(4);
        var categories = this.p.getCategoriesForWord("hell");
        var catLength = categories.length;
        test.equal(catLength, 2);

        this.p.removeCategoriesForWord("hell", ["inappropriate"])
        categories = this.p.getCategoriesForWord("hell");
        catLength = categories.length;
        test.equal(catLength, 1);

        test.ok(!this.p.wordHasCategory("hell", "inappropriate"));
        test.ok(this.p.wordHasCategory("hell", "religious"));

        test.done();
    },

    get_words: function(test) {
        test.expect(2);
        var words = this.p.getWords();
        test.equals(_.keys(words).length > 0, true);
        var categories = words['hell'];
        test.equals(categories.length > 0, true);
        test.done();
    },

    get_word_counts: function(test) {
        test.expect(5);
        var wordCounts = {};
        wordCounts = this.p.getWordCounts("bob");
        test.equals(_.keys(wordCounts).length, 0);
        wordCounts = this.p.getWordCounts("hellHellhell hell no dude");
        test.equals(_.keys(wordCounts).length, 2);
        test.equals(wordCounts['hell'], 4);
        test.equals(wordCounts['dude'], 1);
        test.ok(!('no' in wordCounts));
        test.done();
    },

    get_category_counts: function(test) {
        test.expect(5);
        var categories = {};
        categories = this.p.getCategoryCounts("bob");
        test.equals(_.keys(categories).length, 0);
        categories = this.p.getCategoryCounts("hellHellhell hell no dude");
        test.equals(_.keys(categories).length, 3);
        test.equals(categories['inappropriate'], 4);
        test.equals(categories['informal'], 1);
        test.equals(categories['religious'], 4);
        test.done();
    },

    text_is_bad: function(test) {
        test.expect(2);
        test.ok(!this.p.textIsBad("good text"));
        test.ok(this.p.textIsBad("real fucking bad text"));
        test.done();
    },

    load_words: function(test) {
        test.expect(5);
        this.p.clearWords();
        test.equal(_.keys(this.p.getWords()).length, 0);
        this.p.loadWords('test/fixtures/dictionary.json');
        test.equal(_.keys(this.p.getWords()).length, 2);
        test.ok(this.p.hasWord("dude"));
        test.ok(this.p.hasWord("babe"));
        test.ok(this.p.wordHasCategory("babe", "sexist"));
        test.done();
    },

    load_words_from_dictionary_object: function(test) {
        var dictionary = {
            "dude": ["inappropriate"],
            "babe": ["inappropriate", "sexist"]
        };

        test.expect(5);
        this.p.clearWords();
        test.equal(_.keys(this.p.getWords()).length, 0);
        this.p.loadWordsFromDictionaryObject(dictionary);
        test.equal(_.keys(this.p.getWords()).length, 2);
        test.ok(this.p.hasWord("dude"));
        test.ok(this.p.hasWord("babe"));
        test.ok(this.p.wordHasCategory("babe", "sexist"));
        test.done();
    }

};
