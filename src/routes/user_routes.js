'use strict';

const DOMAIN = 'users';
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
    app.get(`/${DOMAIN}/pid/:pageId`, (req, res) => {
        
        const ctrl = new ctrls.UserController(db);
        
        // TODO: see if that can be moved outside
        const cb = (err, user) => {
            if (err) {
                res.status(500).send(JSON.stringify({ error: err }));
                return;
            }
            if (user) {
                console.log('user retrieved: ', user);
                res.send(JSON.stringify(user));
            }
        }

        console.log('getting user, pid: ',req.params.pageId);
        try{

            const user = ctrl.get(req.params.pageId, cb);
        } catch(e){

            res.status(500).send(JSON.stringify({error: e}));            
        }

    });

    // POST A NEW WORD FOR A USER TO LEARN
    /* creates a relationship */
    app.post(`/${DOMAIN}/pid/:userId/words/learn`, (req, res) => {
       
        const userCtrl = new ctrls.UserController(db);
        
        const cb = (err, word) => {
            if (err) {
                res.status(500).send(JSON.stringify({ error: err }));
                return;
            }
            if (word) {
                console.log('word added to dictionary: ', word);
                res.send(JSON.stringify(user));
            }
        }

        try{

            userCtrl.addWord(req.body.word, cb);
        }catch (e){
       
            res.status(500).send(JSON.stringify({error: e}));                   
        }
    });

    // GET USER ADDED (LEARNING) WORDS
    app.get(`/${DOMAIN}/pid/:userId/words`, (req, res) => {
        res.send('Still a todo...');
    });

    // GET RELATIVE USER STATS
    app.get(`/${DOMAIN}/pid/:userId/ranking`, (req, res) => {
        res.send('Still a todo...');
    })

    // GET ALL USERS
    app.get(`/${DOMAIN}/all/`, (req, res) => {
        const ctrl = new ctrls.UserController(db);
        
        // TODO: see if that can be moved outside
        const cb = (err, users) => {
            if (err) {
                res.status(500).send(JSON.stringify({ error: err }));
                return;
            }
            if (users) {
                console.log('users retrieved: ',users.length);
                res.send(JSON.stringify(users));
            }
        }

        console.log('getting users');
        try{

            const user = ctrl.getAll(cb);
        } catch(e){

            res.status(500).send(JSON.stringify({error: e}));            
        }

    });

    // GET ALL USER STATS
    app.get(`/${DOMAIN}/all/ranking`, (req, res) => {
        console.log(req);
        res.send('Still a todo...');
    });
};