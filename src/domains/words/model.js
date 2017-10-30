'use strict';

const model = require('seraph-model');

const MODEL_LABEL = 'Word';

module.exports = (db) => {
    const Word = model(db, MODEL_LABEL);
    Word.schema = {
        title: { type: String, required: true },
        // double check the type of the page id
    };
    Word.setUniqueKey('title');
    return Word;
}