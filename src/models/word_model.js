// TODO: add inhertance, observe code duplication!
module.exports = class WordModel {
  /**
   * Instantiates a new Model object with the driver
   * @param {neo4j-driver} db
   */
  constructor(db) {
    // neo4j driver
    this.db = db;
    this.LABEL = 'Word';
    this.TRANSLATE_RELATION = 'Translates';
  }

  create(title) {
    console.log('initializing session');
    try {
      const session = this.db.session();
      const query = `CREATE (word:${this.LABEL}{title:{_title},created:{_created}}) RETURN word;`;
      // console.log('query:', query);
      const promise = session.run(
        query,
        {
          _title: title.toLowerCase(),
          _created: Date.now()
        }
      )
        .then((res) => {
          session.close(() => {
            console.log('session closed');
          });
          console.log('created word!: ', res.records);
          return res.records.map((record) => {
            return (record.get('word')).properties;
          });
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


  getByTitle(title) {
    console.log('initializing session');
    try {
      const session = this.db.session();
      // console.log(session);
      const query = `MATCH (word:${this.LABEL}{title:{_title}}) RETURN word;`;
      console.log('query:', query);
      const promise = session.run(
        query,
        { _title: title.toLowerCase() }
      )
        .then((res) => {
          session.close(() => {
            console.log('session closed');
          });
          return res.records.map((record) => {
            return (record.get('word')).properties;
          });
        })
        .catch((err) => {
          console.log(err);
          session.close(() => {
            console.log('session closed');
          });
          return {};
        });
      return promise;
    } catch (e) {
      console.log(e);
      return (e);
    }
  }

  ensure(title) {
    console.log('initializing session');
    try {
      const session = this.db.session();
      // console.log(session);
      const query = `MERGE (word:${this.LABEL}{title:{_title}}) 
        ON CREATE SET word.created = {_created}
        RETURN word;`;
      console.log('query:', query);
      const promise = session.run(
        query,
        {
          _title: title.toLowerCase(),
          _created: Date.now()
        }
      )
        .then((res) => {
          console.log(res);
          session.close(() => {
            console.log('session closed');
          });
          return res.records.map((record) => {
            return (record.get('word')).properties;
          });
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
      return (e);
    }
  }

  addTranslation(rootTitle, targetTitle) {
    console.log('initializing session');
    try {
      const session = this.db.session();
      // console.log(session);
      /*
      MATCH (w:Word{title:'orange'}), (u:Word{title:'sinaasappel'})
      MERGE (w)-[r:Translates]->(u)
      RETURN w,r,u
      */
      const query = `MATCH (w:${this.LABEL}{title:{_rootTitle}}), (u:${this.LABEL}{title:{_targetTitle}})
      MERGE (w)-[r:${this.TRANSLATE_RELATION}]->(u)
        ON CREATE SET r.created = {_created}
      RETURN w,r,u;`;
      const promise = session.run(
        query,
        {
          _rootTitle: rootTitle.toLowerCase(),
          _targetTitle: targetTitle.toLowerCase(),
          _created: Date.now()
        }
      )
        .then((res) => {
          session.close(() => {
            console.log('session closed');
          });
          // TODO: find some better way to return data
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
