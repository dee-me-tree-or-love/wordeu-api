'use strict';

const WordModel = require('./model.js');

module.exports = class WordController {

    constructor(db) {

        this.db = db;
    }

    // create without a check for existance of this word
    create(title, callback) {
        if(!callback){
            throw new Error('no callback specified');
        }

        const word = WordModel(this.db);
        word.save(
            { title: title },
            callback
        );
        return word;
    }

    get(pageId, callback){

        if(!callback){
            throw new Error('no callback specified');
        }

        // TODO: implement search here

        const word = WordModel(this.db);
        word.where({title:pageId},callback);
        return word;
    }
}
