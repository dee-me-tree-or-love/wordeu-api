
const DOMAIN = 'users';

// instead of calling require many times,
// use the parameter access the app.

const dataHandler = (data, res) => {
  if (data.length === 0) {
    res.status(404).send(JSON.stringify({ error: { message: 'No records found' } }));
  }
  if (data.error) {
    res.status(500).send(JSON.stringify({ error: data.error }));
  }
  res.send(JSON.stringify(data));
};

module.exports = (app, db, models) => {
  // new user
  app.post(`/${DOMAIN}/new`, (req, res) => {
    console.log('New user called');

    const userModel = models.User(db);
    userModel
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

    const userModel = models.User(db);
    userModel.getByPageId(req.params.pageId)
      .then((data) => {
        dataHandler(data, res);
      })
      .catch((err) => {
        console.log(`/${DOMAIN}/pid problem: `, err);
        res.status(500).send(JSON.stringify({ error: err }));
      });
  });
};
