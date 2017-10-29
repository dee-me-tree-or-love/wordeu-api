'use strict';
// require the configurations 
require('dotenv').config();


// the express framework
const express = require('express');
const bodyParser = require('body-parser');


const app = express();
let server;
app.use(bodyParser.json());

// require routes:
require('./app/routes')(app, {});


/* App startup */
let p = new Promise((resolve, reject) => { resolve() });
p.then(() => db.open('./db/database.sqlite', { Promise })) // open the database -> change to neo4j
    .then(() => db.migrate({ force: 'last' }))
    .catch(err => console.error(err.stack))
    .then(() => {
        server = app.listen(process.env.PORT || 5000, () => {
            console.log('Express server listening on port %d in %s mode',
                server.address().port, app.settings.env);
        });
    });

module.exports = app;