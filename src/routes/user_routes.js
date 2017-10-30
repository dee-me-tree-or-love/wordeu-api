'use strict';

const DOMAIN = 'users';

// instead of making circular requests, 
// use the callback to initialize and access the app.
module.exports = (app, db, ctrls) => {
    // route declaration
    // CREATE NEW USER
    app.post(`/${DOMAIN}/new`, (req, res) => {

        const ctrl = new ctrls.UserController(db);
        const cb = (err, user) => {
            if (err) {
                res.status(500).send(JSON.stringify({ error: err }));
                return;
            }
            if (user) {
                console.log('user created: ', user);
                res.send(JSON.stringify(user));

            }
        }
        console.log('creating user');
        try {

            const user = ctrl.create(req.body.pageId, req.body.name, cb);
        } catch (e){

            res.status(500).send(JSON.stringify({error: e}));
        }
    });
    // GET USER BY ID
    app.get(`/${DOMAIN}/:userId`, (req, res) => {
        res.send('Still a todo...');
    });
    // GET USER ADDED (LEARNING) WORDS
    app.get(`/${DOMAIN}/:userId/dictionary`, (req, res) => {
        res.send('Still a todo...');
    });
    // GET RELATIVE USER STATS
    app.get(`/${DOMAIN}/:userId/statistics`, (req, res) => {
        res.send('Still a todo...');
    })
    // GET ALL USER STATS
    app.get(`/${DOMAIN}/all/statistcs`, (req, res) => {
        console.log(req);
        res.send('Still a todo...');
    });
};