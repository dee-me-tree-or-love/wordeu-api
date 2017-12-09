const DOMAIN = 'quiz';

module.exports = (app, db, controllers) => {
  const dataHandler = controllers.dataHandler();

  // an endpoint to get a new quiz word returns a word
  app.get(`/${DOMAIN}/quiz-word/`, (req, res) => {
    console.log('New quiz word called');

    // FIXME: make a clear parameter specification!
    if (!(req.body.page_id)) {
      res.status(400).send(JSON.stringify({ error: { message: 'no user page id' } }));
      return;
    }

    const quizController = controllers.Quiz(db);

    quizController
      .getNewQuizWord(req.body.page_id)
      .then((data) => {
        dataHandler(data, res);
      })
      .catch((err) => {
        console.log(`/${DOMAIN}/quiz-word problem`);
        res.status(500).send(JSON.stringify({ error: err }));
      });

  });

  // an enpdoint to asses quiz word translation returns a score and remarks
  app.put(`/${DOMAIN}/quiz-word/answer`, (req, res) => {
    console.log('Quiz word answer called');

    if (!(req.body.page_id && req.body.quiz_word && req.body.answer)) {
      res.status(400).send(JSON.stringify({ error: { message: 'no user page id' } }));
      return;
    }

  });

}
