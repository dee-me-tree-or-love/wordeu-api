'use strict';

const userRoutes = require('./user_routes.js');
const wordRoutes = require('./word_routes.js');

// the call to the routes index function 
module.exports = (app, db, ctrls) => {
    userRoutes(app, db, ctrls);
    wordRoutes(app, db, ctrls);
};

