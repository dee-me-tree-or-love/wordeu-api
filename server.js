'use strict';
// require the configurations 
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
// neo4j connection
const db = require('seraph')({
    user: process.env.DB_USER || 'neo4j',
    pass: process.env.DB_PASS || 'neo4j'
});
// controllers module loader
const ctrls = require('./src/domains/controllers.js');

const app = express();
let server;
// support parsing of application/json type post data
app.use(bodyParser.json());
// support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));


/* App startup */
server = app.listen(process.env.PORT || 5005, () => {
    console.log('Express server listening on port %d in %s mode',
        server.address().port, app.settings.env);
    // require routes:
    require('./src/routes/index.js')(app, db, ctrls);
});

module.exports = app;