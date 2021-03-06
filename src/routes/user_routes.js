const DOMAIN = 'users';

module.exports = (app, db, controllers) => {
  const dataHandler = controllers.dataHandler();

  // new user
  app.post(`/${DOMAIN}/new`, (req, res) => {
    console.log('New user called');

    if (!(req.body.page_id && req.body.name)) {
      res.status(400).send(JSON.stringify({ error: { message: 'no user page id or name specified' } }));
      return;
    }

    const userController = controllers.User(db);
    userController
      .create(req.body.page_id, req.body.name)
      .then((data) => {
        dataHandler(data, res);
      })
      .catch((err) => {
        console.log(`/${DOMAIN}/new problem`);
        res.status(500).send(JSON.stringify({ error: err }));
      });
  });

  app.get(`/${DOMAIN}/pid/:pageId`, (req, res) => {
    console.log('Getting user');

    const userController = controllers.User(db);
    userController.getByPageId(req.params.pageId)
      .then((data) => {
        dataHandler(data, res);
      })
      .catch((err) => {
        console.log(`/${DOMAIN}/pid problem: `, err);
        res.status(500).send(JSON.stringify({ error: err }));
      });
  });

  app.put(`/${DOMAIN}/pid/ensure/:pageId`, (req, res) => {
    console.log('Ensuring a word with exact title match exists');
    if (!req.body.name) {
      // TODO: add custom error objects
      res.status(400).send(JSON.stringify({ error: { message: 'no name specified' } }));
      return;
    }

    const userController = controllers.User(db);
    userController.ensure(req.params.pageId, req.body.name)
      .then((data) => {
        dataHandler(data, res);
      })
      .catch((err) => {
        console.log(`/${DOMAIN}/title problem: `, err);
        res.status(500).send(JSON.stringify({ error: err }));
      });
  });

  app.post(`/${DOMAIN}/pid/:pageId/add/word`, (req, res) => {
    if (!(req.body.targetTitle && req.body.relationType)) {
      res.status(400).send(JSON.stringify({ error: { message: 'no target word or relation type specified' } }));
      return;
    }
    console.log(req.body.relationType);
    const userController = controllers.User(db);

    let relType = req.body.relationType;
    relType = (relType.charAt(0).toUpperCase() + relType.slice(1).toLowerCase());
    if (!(userController.WORD_RELATIONS.includes(relType))) {
      res.status(400).send(JSON.stringify({ error: { message: `relation type ${req.body.relationType} not in ${userController.WORD_RELATIONS}` } }));
      return;
    }

    userController.addWord(req.params.pageId, req.body.targetTitle, req.body.relationType)
      .then((data) => {
        dataHandler(data, res);
      })
      .catch((err) => {
        console.log(`/${DOMAIN}/pid/:pageId/word problem: `, err);
        res.status(500).send(JSON.stringify({ error: err }));
      });
  });
};