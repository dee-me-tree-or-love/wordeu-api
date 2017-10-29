'use strict';

const userROutes = require('./user_routes.js');

// the call to the routes index function 
module.exports = (app, db) => {
    userROutes(app, db);
};

