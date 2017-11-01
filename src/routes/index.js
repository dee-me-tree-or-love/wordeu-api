const userRoutes = require('./user_routes.js');
const wordRoutes = require('./word_routes.js');

// the call to the routes index function
module.exports = {
  config: (app, db, models) => {
    userRoutes(app, db, models);
    wordRoutes(app, db, models);
  }
};
