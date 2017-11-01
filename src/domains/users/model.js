'use strict';

const model = require('seraph-model');
const word = require('../words/model.js');

const MODEL_LABEL = 'User';

module.exports = (db) => {
    const User = model(db, MODEL_LABEL);
    User.schema = {
        name: { type: String, required: true },
        // double check the type of the page id
        page_id: {type: String, required: true},
        date_joined: {type: Date, default: "2017-01-09T00:00:00"} 
    };
    User.setUniqueKey('page_id');
    User.compose(word,'words','LEARNS');
    return User;
}