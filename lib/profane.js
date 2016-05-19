var _ = require('lodash');
var SwearJar = require('./myswearjar');
var fs = require('fs');

function checkForWords(text) {
    return this.sj.checkForWords(text);
}

function checkForCategories(text) {
    return this.sj.scorecard(text);
}

function clearWords() {
    this.sj.clearWords();
}

function getWords() {
    return this.sj.getWords();
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
    this.sj.addWord(word, categories);
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

var Profane = function() {
    this.sj = new SwearJar();
};

Profane.prototype = {
    checkForWords: checkForWords,
    checkForCategories: checkForCategories,
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
    loadWordsFromDictionaryObject: loadWordsFromDictionaryObject
};

module.exports = Profane;
