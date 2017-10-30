'use strict';

const UserModel = require('./model.js');

module.exports = class UserController {

    constructor(db) {

        this.db = db;
    }

    create(pageId, userName) {

        const user = UserModel(this.db);
        user.save(
            { page_id: pageId, name: userName },
            function (err, user) {
                console.log('error saving:', err);
                // TODO: think if this maybe should be reorganized in a more senseful way
                console.log('user', user);
            }
        );
        return user;
    }
}
