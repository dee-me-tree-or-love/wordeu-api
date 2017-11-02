const DOMAIN = 'words';

// const dataHandler = (data, res) => {
//   if (data.length === 0) {
//     res.status(404).send(JSON.stringify({ error: { message: 'No records found' } }));
//     return;
//   }
//   if (data.error) {
//     res.status(500).send(JSON.stringify({ error: data.error }));
//     return;
//   }
//   res.send(JSON.stringify(data));
// };


module.exports = (app, db, models) => {
  const dataHandler = models.dataHandler();
  // new word
  app.post(`/${DOMAIN}/new`, (req, res) => {
    console.log('New user called');
    if (!req.body.title) {
      res.status(400).send(JSON.stringify({ error: { message: 'no word title specified' } }));
      return;
    }

    const wordModel = models.Word(db);
    wordModel
      .create(req.body.title)
      .then((data) => {
        dataHandler(data, res);
      })
      .catch((err) => {
        console.log(`/${DOMAIN}/new problem`);
        res.status(500).send(JSON.stringify({ error: err }));
      });
  });

  app.get(`/${DOMAIN}/title/:title`, (req, res) => {
    console.log('Getting word by exact title match');

    const wordModel = models.Word(db);
    wordModel.getByTitle(req.params.title)
      .then((data) => {
        dataHandler(data, res);
      })
      .catch((err) => {
        console.log(`/${DOMAIN}/title problem: `, err);
        res.status(500).send(JSON.stringify({ error: err }));
      });
  });

  app.put(`/${DOMAIN}/title/ensure/:title`, (req, res) => {
    console.log('Ensuring a word with exact title match exists');

    const wordModel = models.Word(db);
    wordModel.ensure(req.params.title)
      .then((data) => {
        dataHandler(data, res);
      })
      .catch((err) => {
        console.log(`/${DOMAIN}/title problem: `, err);
        res.status(500).send(JSON.stringify({ error: err }));
      });
  });

  app.post(`/${DOMAIN}/translation/create`, (req, res) => {
    console.log('Creating a new translation relation');

    console.log(req.body);
    console.log(req.body.rootTitle);
    console.log(req.body.targetTitle);
    if (!(req.body.rootTitle && req.body.targetTitle)) {
      res.status(400).send(JSON.stringify({ error: { message: 'no root or target translation word specified' } }));
      return;
    }

    const wordModel = models.Word(db);
    wordModel.addTranslation(req.body.rootTitle, req.body.targetTitle)
      .then((data) => {
        dataHandler(data, res);
      })
      .catch((err) => {
        console.log(`/${DOMAIN}/translation/create problem: `, err);
        res.status(500).send(JSON.stringify({ error: err }));
      });
  });
};
