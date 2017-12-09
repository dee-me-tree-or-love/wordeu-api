module.exports = class QuizController {
  /**
   * Instantiates a new Controller object with the driver
   * @param {neo4j-driver} db
   */
  constructor(db) {
    // neo4j driver
    this.db = db;
  }

  getNewQuizWord(pageId) {
    console.log('initializing session');
    try {
      const session = this.db.session();
      // MATCH (p:User {page_id:'121'}), (p)-[r:learns]->(w) RETURN w
      const query = `MATCH (p:User {page_id:{_pid}}), (p)-[r:learns]->(word) RETURN word;`;
      const promise = session.run(
        query,
        {
          _pid: pageId,
        }
      )
        .then((res) => {
          session.close(() => {
            console.log('session closed');
          });

          const options = res.records.map((record) => {
            return (record.get('word')).properties;
          });

          if (options.length > 0) {

            const options = res.records.map((record) => {
              return (record.get('word')).properties;
            });
            const choice = Math.round((Math.random() * 10)) % 3
            console.log(`choice ${choice}`);
            return options[choice];

          } else {
            return options
          }

        })
        .catch((err) => {
          console.log(err);
          session.close(() => {
            console.log('session closed');
          });
          return { error: err };
        });
      return promise;
    } catch (e) {
      console.log(e);
      return { error: e };
    }
  }

  assessQuizWordTranslation(pageId, quizWord, answer) {
    // TODO: implement
    console.log('initializing session');
    try {
      const session = this.db.session();
      const query = ``;
      const promise = session.run(
        query,
        {
          _pageId: pageId,
        }
      )
        .then((res) => {
          session.close(() => {
            console.log('session closed');
          });
          console.log(res.records);
          return res.records;
        })
        .catch((err) => {
          console.log(err);
          session.close(() => {
            console.log('session closed');
          });
          return { error: err };
        });
      return promise;
    } catch (e) {
      console.log(e);
      return { error: e };
    }
  }
};
