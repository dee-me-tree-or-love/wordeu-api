const userRoutes = require('./user_routes.js');
const wordRoutes = require('./word_routes.js');

// the call to the routes index function
module.exports = {
  config: (app, db, controllers) => {
    userRoutes(app, db, controllers);
    wordRoutes(app, db, controllers);
  }
};
