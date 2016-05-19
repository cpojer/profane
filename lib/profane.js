var _ = require('lodash');
var SwearJar = require('./myswearjar');
var fs = require('fs');

function getWordCounts(text) {
    return this.sj.getWordCounts(text);
}

function getCategoryCounts(text) {
    return this.sj.getCategoryCounts(text);
}

function textIsBad(text) {
    return this.sj.textIsBad(text);
}

function clearWords() {
    this.sj.clearWords();
}

function getWords() {
    return this.sj.getWords();
}

function loadWords(jsonFilePath, shouldAppendWords, shouldAppendCategoriesForWords) {
    if (!shouldAppendWords) {
        this.clearWords();
    }
    var dictionary = JSON.parse(fs.readFileSync(jsonFilePath) + '');
    this.loadWordsFromDictionaryObject(dictionary, shouldAppendWords, shouldAppendCategoriesForWords);
}

function loadWordsFromDictionaryObject(dictionary, shouldAppendWords, shouldAppendCategoriesForWords) {
    for (word in dictionary) {
        var categories = dictionary[word];
        if (shouldAppendCategoriesForWords) {
            this.addCategoriesForWord(word, categories);
        } else {
            this.setCategoriesForWord(word, categories);
        }
    }
}

function addWord(word, categories) {
    this.sj.addWord(word, categories);
}

function addCategoriesForWord(word, categories) {
    var oldCategories = this.getCategoriesForWord(word);
    var newCategories = _.union(oldCategories, categories);
    this.setCategoriesForWord(word, newCategories);
}

function removeCategoriesForWord(word, categories) {
    var oldCategories = this.getCategoriesForWord(word);
    var newCategories = _.difference(oldCategories, categories);
    this.setCategoriesForWord(word, newCategories);
}

function setCategoriesForWord(word, categories) {
    this.sj.setCategoriesForWord(word, categories);
}

function getCategoriesForWord(word) {
    return this.sj.getCategoriesForWord(word);
}

function removeWord(word) {
    this.sj.removeWord(word);
}

function hasWord(word) {
    return this.sj.hasWord(word);
}

function wordHasCategory(word, category) {
    var categories = this.getCategoriesForWord(word);
    return _.indexOf(categories, category) > -1;
}

var Profane = function() {
    this.sj = new SwearJar();
};

Profane.prototype = {
    getWordCounts: getWordCounts,
    getCategoryCounts: getCategoryCounts,
    textIsBad: textIsBad,

    loadWords: loadWords,
    addWord: addWord,
    hasWord: hasWord,
    removeWord: removeWord,
    clearWords: clearWords,
    getWords: getWords,
    addCategoriesForWord: addCategoriesForWord,
    getCategoriesForWord: getCategoriesForWord,
    setCategoriesForWord: setCategoriesForWord,
    removeCategoriesForWord: removeCategoriesForWord,
    loadWordsFromDictionaryObject: loadWordsFromDictionaryObject,
    wordHasCategory: wordHasCategory,
};

module.exports = Profane;
