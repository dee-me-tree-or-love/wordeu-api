const UserController = require('./user_controller.js');
const WordController = require('./word_controller.js');
const QuizController = require('./quiz_controller.js');


module.exports = {
  User: (db) => {
    return new UserController(db);
  },
  Word: (db) => {
    return new WordController(db);
  },
  Quiz: (db) => {
    return new QuizController(db);
  },

  // IDEA: candidate to be moved to a separate driver (helper) entity

  dataHandler: () => {
    const dataHandler = (data, res) => {
      if (data.length === 0) {
        res.status(404).send(
          JSON.stringify({error: { message: 'No records found'}})
        );
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
