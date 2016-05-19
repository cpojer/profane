// extended and modified by Will Riley from Ramon Torres' swearjar.  the badwords were
// also seeded from Ramon Torres' swearjar

// Here is his original copyright
/*
Copyright (c) 2014 Ramon Torres

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var fs = require('fs');
var _ = require('lodash');

var SwearJar = function(badWords) {
    if (badWords === undefined) {
        this._badWords = {};
        this.loadWords(__dirname + '/badwords.json');
    } else {
        this._badWords = badWords;
    }
}

SwearJar.prototype = {

    scan: function(text, callback) {
        var word, key, match;
        var regex = /\w+/g

        while (match = regex.exec(text)) {
            word = match[0];
            key = word.toLowerCase();

            if (key in this._badWords) {
                if (callback(word, match.index, this._badWords[key]) === false) {
                    break;
                }
            }
        }
    },

    textIsBad: function(text) {
        var hasWord = false;

        this.scan(text, function(word, index, categories) {
            hasWord = true;
            return false; // Stop on first match
        });

        return hasWord;
    },

    censorText: function(text) {
        var censored = text;

        this.scan(text, function(word, index, categories) {
            censored = censored.substr(0, index) +
                word.replace(/\S/g, '*') +
                censored.substr(index + word.length);
        });

        return censored;
    },

    loadWords: function(path) {
        this._badWords = JSON.parse(fs.readFileSync(path) + '');
    },

    getWords: function() {
        return this._badWords;
    },

    clearWords: function() {
        this._badWords = {};
    },

    addWord: function(word, categories) {
        var words = this.getWords();
        words[word] = categories;
    },

    getCategoriesForWord: function(word) {
        var words = this.getWords();
        if (word in words) {
            return words[word];
        } else {
            return [];
        }
    },

    setCategoriesForWord: function(word, categories) {
        var words = this.getWords();
        words[word] = categories;
    },

    removeWord: function(word) {
        var words = this.getWords();
        delete words[word];
    },

    hasWord: function(word) {
        if (word === undefined) {
            return false;
        }
        var words = this.getWords();
        return word in words;
    },

    getWordCounts: function(text) {
        var freqs = {};
        this.scan(text, function(word, index, categories) {
            if (word in freqs) {
                freqs[word] += 1;
            } else {
                freqs[word] = 1;
            }
        });
        return freqs;
    },

    getCategoryCounts: function(text) {
        var freqs = {};
        this.scan(text, function(word, index, categories) {
            for (var i = 0; i < categories.length; i += 1) {
                var cat = categories[i];
                if (cat in freqs) {
                    freqs[cat] += 1;
                } else {
                    freqs[cat] = 1;
                }
            };
        });
        return freqs;
    },

};

module.exports = SwearJar;
