'use strict';
// require the configurations 
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
// neo4j connection
const db = require('seraph')(process.env.DB_URL);

const app = express();
let server;
// support parsing of application/json type post data
app.use(bodyParser.json());
// support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));


/* App startup */
let p = new Promise((resolve, reject) => { resolve() });
p.then(() => {
        server = app.listen(process.env.PORT || 5005, () => {
            console.log('Express server listening on port %d in %s mode',
                server.address().port, app.settings.env);
                // require routes:
                require('./src/routes/index.js')(app, {});
        });
    });

module.exports = app;