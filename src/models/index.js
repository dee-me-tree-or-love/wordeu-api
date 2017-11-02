const UserModel = require('./user_model.js');
const WordModel = require('./word_model.js');

module.exports = {
  User: (db) => {
    return new UserModel(db);
  },
  Word: (db) => {
    return new WordModel(db);
  },
  dataHandler: () => {
    const dataHandler = (data, res) => {
      if (data.length === 0) {
        res.status(404).send(JSON.stringify({ error: { message: 'No records found' } }));
        return;
      }
      if (data.error) {
        res.status(500).send(JSON.stringify({ error: data.error }));
        return;
      }
      res.send(JSON.stringify(data));
    };
    return dataHandler;
  }
};
