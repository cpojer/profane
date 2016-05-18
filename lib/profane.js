var _ = require('lodash');
var sj = require('swearjar');
var fs = require('fs');

// extend swearjar

sj.getWords = function() {
    return this._badWords;
}

sj.clearWords = function() {
    this._badWords = {};
}

sj.addWord = function(word, categories) {
    var words = this.getWords();
    words[word] = categories;
};

sj.getCategoriesForWord = function(word) {
    var words = this.getWords();
    if (word in words) {
        return words[word];
    } else {
        return [];
    }
}

sj.setCategoriesForWord = function(word, categories) {
    var words = this.getWords();
    words[word] = categories;
}

sj.removeWord = function(word) {
    var words = this.getWords();
    delete words[word];
}

sj.checkForWords = function(text) {
    var words = {};
    this.scan(text, function(word, index, categories) {
        words = _.union(words, [word]);
    });
    return words;
}

function checkForWords(text) {
    return sj.checkForWords(text);
}

function checkForCategories(text) {
    return sj.scorecard(text);
}

function clearWords() {
    sj.clearWords();
}

function getWords() {
    return sj.getWords();
}

function loadWords(jsonFilePath, shouldAppendWords, shouldAppendCategoriesForWords) {
    if (!shouldAppendWords) {
        clearWords();
    }
    var dictionary = JSON.parse(fs.readFileSync(jsonFilePath) + '');
    loadWordsFromDictionaryObject(dictionary, shouldAppendWords, shouldAppendCategoriesForWords);
}

function loadWordsFromDictionaryObject(dictionary, shouldAppendWords, shouldAppendCategoriesForWords) {
    for (word in dictionary) {
        var categories = dictionary[word];
        if (shouldAppendCategoriesForWords) {
            addCategoriesForWord(word, categories);
        } else {
            setCategoriesForWord(word, categories);
        }
    }
}

function addWord(word, categories) {
    sj.addWord(word, categories);
}

function addCategoriesForWord(word, categories) {
    var oldCategories = getCategoriesForWord(word);
    var newCategories = _.union(oldCategories, categories);
    setCategoriesForWord(word, newCategories);
}

function removeCategoriesForWord(word, categories) {
    var oldCategories = getCategoriesForWord(word);
    var newCategories = _.difference(oldCategories, categories);
    setCategoriesForWord(word, newCategories);
}

function setCategoriesForWord(word, categories) {
    sj.setCategoriesForWord(word, categories);
}

function getCategoriesForWord(word) {
    return sj.getCategoriesForWord(word);
}

function removeWord(word) {
    sj.removeWord(word);
}

module.exports = {
    checkForWords: checkForWords,
    checkForCategories: checkForCategories,
    loadWords: loadWords,
    addWord: addWord,
    removeWord: removeWord,
    clearWords: clearWords,
    getWords: getWords,
    addCategoriesForWord: addCategoriesForWord,
    getCategoriesForWord: getCategoriesForWord,
    setCategoriesForWord: setCategoriesForWord,
    removeCategoriesForWord: removeCategoriesForWord,
    loadWordsFromDictionaryObject: loadWordsFromDictionaryObject
};
