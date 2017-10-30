'use strict';

const UserModel = require('./model.js');

module.exports = class UserController {

    constructor(db) {

        this.db = db;
    }

    create(pageId, userName, callback) {
        if(!callback){
            throw 'no callback specified';
        }
        const user = UserModel(this.db);
        user.save(
            { page_id: pageId, name: userName },
            callback
        );
        return user;
    }
}
