var fs = require('fs');
var Profane = require('profane');
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

exports.solemn = {
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
    check_for_words: function(test) {
        test.expect(5);
        var violations = [];

        violations = this.p.checkForWords("bob");
        test.equals(violations.length, 0);

        violations = this.p.checkForWords("hell no dude");
        test.equals(violations.length, 2);
        test.ok(_.indexOf(violations, 'hell') > -1);
        test.ok(_.indexOf(violations, 'dude') > -1);
        test.ok(_.indexOf(violations, 'no') === -1);
        test.done();
    },

    check_for_categories: function(test) {
        test.expect(5);
        var categories = {};

        categories = this.p.checkForCategories("bob");
        test.equals(_.keys(categories).length, 0);

        categories = this.p.checkForCategories("hell no dude");
        test.equals(_.keys(categories).length, 3);
        test.equals(categories['inappropriate'], 1);
        test.equals(categories['informal'], 1);
        test.equals(categories['religious'], 1);
        test.done();
    },
};
