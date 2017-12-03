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


module.exports = (app, db, controllers) => {
  const dataHandler = controllers.dataHandler();
  // new word
  app.post(`/${DOMAIN}/new`, (req, res) => {
    console.log('New user called');
    if (!req.body.title) {
      res.status(400).send(JSON.stringify({ error: { message: 'no word title specified' } }));
      return;
    }

    const wordController = controllers.Word(db);
    wordController
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

    const wordController = controllers.Word(db);
    wordController
      .getByTitle(req.params.title)
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

    const wordController = controllers.Word(db);
    wordController
      .ensure(req.params.title)
      .then((data) => {
        dataHandler(data, res);
      })
      .catch((err) => {
        console.log(`/${DOMAIN}/title problem: `, err);
        res.status(500).send(JSON.stringify({ error: err }));
      });
  });

  app.post(`/${DOMAIN}/relation/create`, (req, res) => {
    console.log('Creating a new translation relation');

    console.log(req.body);
    // TODO: create a util verificator of the body
    if (!(req.body.rootTitle && req.body.targetTitle && req.body.relationType)) {
      res.status(400).send(JSON.stringify({ error: { message: 'no root or target translation word or relation type specified' } }));
      return;
    }
  
    const wordController = controllers.Word(db);
  
    // sanity check
    let relType = req.body.relationType;
    relType = (relType.charAt(0).toUpperCase() + relType.slice(1).toLowerCase());
    if (!(wordController.WORD_RELATIONS.includes(relType))) {
      res.status(400).send(JSON.stringify({ error: { message: `relation type ${req.body.relationType} not in ${wordController.WORD_RELATIONS}` } }));
      return;
    }

    // add new relation
    wordController.addRelation(req.body.rootTitle, req.body.targetTitle, relType)
      .then((data) => {
        dataHandler(data, res);
      })
      .catch((err) => {
        console.log(`/${DOMAIN}/translation/create problem: `, err);
        res.status(500).send(JSON.stringify({ error: err }));
      });
  });
};
