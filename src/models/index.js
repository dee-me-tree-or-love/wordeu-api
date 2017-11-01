const UserModel = require('./user_model.js');
const WordModel = require('./word_model.js');

module.exports = {
  User: (db) => {
    return new UserModel(db);
  },
  Word: (db) => {
    return new WordModel(db);
  }
};
