const DOMAIN = 'words';

// instead of calling require many times,
// use the parameter access the app.

module.exports = (app, db, models) => {
  // new user
  app.post(`/${DOMAIN}/new`, (req, res) => {
    console.log('New word called');

    const error = { message: 'Daaaamn son!' };
    // TODO: figure out what's wrong!
    res.status(500).send(JSON.stringify(error));
  });
};
