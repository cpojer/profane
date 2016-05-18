var _ = require('lodash');
var sj = require('swearjar');

// extend swearjar

sj.getWords = function() {
    return this._badWords;
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

function loadWords(jsonFilePath, shouldAppendWords, shouldAppendCategoriesForWords) {
    if (shouldAppendWords) {
        var newJson = require(jsonFilePath);
        for (word in newJson) {
            var categories = newJson[word];
            if (shouldAppendCategoriesForWords) {
                addCategoriesForWord(word, categories);
            } else {
                setCategoriesForWord(word, categories);
            }
        }
    } else {
        sj.loadBadWords(jsonFilePath);
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
    addCategoriesForWord: addCategoriesForWord,
    getCategoriesForWord: getCategoriesForWord,
    setCategoriesForWord: setCategoriesForWord,
    removeCategoriesForWord: removeCategoriesForWord,
};
