'use strict';

const DOMAIN = 'words';

// instead of making circular requests, 
// use the callback to initialize and access the app.
module.exports = (app, db, ctrls) => {

    // route declaration
    // CREATE NEW WORD

    // TODO: make proper route and controller inheritance
    // TODO: make controllers get the full request object instead

    app.post(`/${DOMAIN}/new`, (req, res) => {

        const ctrl = new ctrls.WordController(db);

        const cb = (err, word) => {
            if (err) {
                res.status(500).send(JSON.stringify({ error: err }));
                return;
            }
            if (word) {
                console.log('word created: ', word);

                res.send(JSON.stringify(word));
            }
        }

        console.log('creating word');
        try {

            const user = ctrl.create(req.body.title, cb);
        } catch (e) {

            res.status(500).send(JSON.stringify({ error: e }));
        }
    });

    app.get(`/${DOMAIN}/:title`, (req, res) => {

        const ctrl = new ctrls.WordController(db);

        const cb = (err, word) => {
            if (err) {
                res.status(500).send(JSON.stringify({ error: err }));
                return;
            }
            if (word) {
                console.log('word retrieved: ', word);

                res.send(JSON.stringify(word));
            }
        }

        console.log('getting a word');
        try {

            const word = ctrl.get(req.params.title, cb);
        } catch (e) {
            console.log(e)
            res.status(500).send(JSON.stringify({ error: e }));
        }

    });
};