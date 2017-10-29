'use strict';

const DOMAIN = 'users';

// instead of making circular requests, 
// use the callback to initialize and access the app.
module.exports = (app, db) => {
    // route declaration
    // CREATE NEW USER
    app.post(`/${DOMAIN}/new`, (req, res) => { 

    });
    // GET USER BY ID
    app.get(`/${DOMAIN}/:userId`, (req,res)=>{

    });
    // GET USER ADDED (LEARNING) WORDS
    app.get(`/${DOMAIN}/:userId/dictionary`, (req,res)=>{

    });
    // GET RELATIVE USER STATS
    app.get(`/${DOMAIN}/:userId/statistics`, (req,res)=>{

    })
    // GET ALL USER STATS
    app.get(`/${DOMAIN}/all/statistcs`, (req, res)=>{

    });
};