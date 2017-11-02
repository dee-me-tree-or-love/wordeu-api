// require the configurations
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const neo4j = require('neo4j-driver').v1;
const routes = require('./src/routes/index.js');
const models = require('./src/models/index.js');

console.log(process.pid);

// neo4j connection
const db = neo4j.driver(
  process.env.DB_URL || 'http://localhost:7474',
  neo4j.auth.basic(
    process.env.DB_USER || 'neo4j',
    process.env.DB_PASS || 'admin'
  )
);

// console.log(db);
const app = express();

// support different data in parameters
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* App startup */
const server = app.listen(process.env.PORT || 5005, () => {
  console.log(
    'Express server listening on port %d in %s mode',
    server.address().port,
    app.settings.env
  );

  routes.config(app, db, models);
});


/* Graceful app shutdown */
const shutDown = () => {
  console.log('Received kill signal, shutting down gracefully');
  // console.log(db);
  server.close(() => {
    db.close(() => {
      console.log('closed driver');
      process.exit(0);
    });
    console.info('Closed remaining connections');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 500);
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

module.exports = app;
