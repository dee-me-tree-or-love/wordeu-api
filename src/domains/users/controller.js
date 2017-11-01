'use strict';

const UserModel = require('./model.js');

module.exports = class UserController {

    constructor(db) {

        this.db = db;
    }

    create(pageId, userName, callback) {
        if (!callback) {
            throw new Error('no callback specified');
        }

        const user = UserModel(this.db);
        user.save(
            { page_id: pageId, name: userName },
            callback
        );
        return user;
    }

    get(pageId, callback) {

        if (!callback) {
            throw new Error('no callback specified');
        }

        const user = UserModel(this.db);
        user.where({ page_id: pageId }, callback);
        return user;
    }


    getAll(callback) {

        if (!callback) {
            throw new Error('no callback specified');
        }

        const model = UserModel(this.db);
        model.findAll(callback);
        return model;
    }

    addWords(user, words, callback) {

        const model = UserModel(this.db);
        model.compose()

        for (let key in words) {
            model.push(user, 'words', words[key], callback);
        }

    }

}
