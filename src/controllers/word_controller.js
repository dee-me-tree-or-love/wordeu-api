// TODO: add inhertance, observe code duplication!

const MSG_SESSION_INIT = 'initializing session';
const MSG_SESSION_CLOSED = 'session closed';

module.exports = class WordController {
  /**
   * Instantiates a new Controller object with the driver
   * @param {neo4j-driver} db
   */
  constructor(db) {
    // neo4j driver
    this.db = db;
    this.LABEL = 'Word';
    this.WORD_RELATIONS = {
      'TRANSLATES':'Translates',
      'SYNONYM':'Synonym'
    };

  }

  create(title) {
    console.log(MSG_SESSION_INIT);
    const session = this.db.session();
    try {
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
            console.log(MSG_SESSION_CLOSED);
          });
          console.log('created word!: ', res.records);
          return res.records.map((record) => {
            return (record.get('word')).properties;
          });
        })
        .catch((err) => {
          console.log(err);
          session.close(() => {
            console.log(MSG_SESSION_CLOSED);
          });
          return { error: err };
        });
      return promise;
    } catch (e) {
      console.log(e);
      session.close(() => {
        console.log(MSG_SESSION_CLOSED);
      });
      return (e);
    }
  }


  getByTitle(title) {
    console.log(MSG_SESSION_INIT);
    const session = this.db.session();
    // console.log(session);
    try {
      const query = `MATCH (word:${this.LABEL}{title:{_title}}) RETURN word;`;
      console.log('query:', query);
      const promise = session.run(
        query,
        { _title: title.toLowerCase() }
      )
        .then((res) => {
          session.close(() => {
            console.log(MSG_SESSION_CLOSED);
          });
          return res.records.map((record) => {
            return (record.get('word')).properties;
          });
        })
        .catch((err) => {
          console.log(err);
          session.close(() => {
            console.log(MSG_SESSION_CLOSED);
          });
          return { error: err };
        });
      return promise;
    } catch (e) {
      console.log(e);
      session.close(() => {
        console.log(MSG_SESSION_CLOSED);
      });
      return (e);
    }
  }

  getTranslations(title) {
    console.log(MSG_SESSION_INIT);
    const session = this.db.session();
    // console.log(session);
    try {
      // MATCH (n:Word {title: 'cueillette'})<-[r:Translates]-(t) RETURN t
      const query = `MATCH (n:${this.LABEL} 
                    {title: {_title}})<-[r:${this.WORD_RELATIONS.TRANSLATES}]-(t) 
                    RETURN t;`;
      console.log('query:', query);
      const promise = session.run(
        query,
        { _title: title.toLowerCase() }
      )
        .then((res) => {
          session.close(() => {
            console.log(MSG_SESSION_CLOSED);
          });
          return res.records.map((record) => {
            return (record.get('t').properties);
          });
        })
        .catch((err) => {
          console.log(err);
          session.close(() => {
            console.log(MSG_SESSION_CLOSED);
          });
          return { error: err };
        });
      return promise;
    } catch (e) {
      console.log(e);
      session.close(() => {
        console.log(MSG_SESSION_CLOSED);
      });
      return (e);
    }
  }

  ensure(title) {
    console.log(MSG_SESSION_INIT);
    const session = this.db.session();
    try {
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
            console.log(MSG_SESSION_CLOSED);
          });
          return res.records.map((record) => {
            return (record.get('word')).properties;
          });
        })
        .catch((err) => {
          console.log(err);
          session.close(() => {
            console.log(MSG_SESSION_CLOSED);
          });
          return { error: err };
        });
      return promise;
    } catch (e) {
      console.log(e);
      session.close(() => {
        console.log(MSG_SESSION_CLOSED);
      });
      return (e);
    }
  }

  addRelation(rootTitle, targetTitle, relationType) {
    console.log(MSG_SESSION_INIT);
    const session = this.db.session();
    try {
      // console.log(session);
      /*
      MATCH (w:Word{title:'orange'}), (u:Word{title:'sinaasappel'})
      MERGE (w)-[r:Translates]->(u)
      RETURN w,r,u
      */
      const query = `MATCH (w:${this.LABEL}{title:{_rootTitle}}), (u:${this.LABEL}{title:{_targetTitle}})
      MERGE (w)-[r:${relationType}]->(u)
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
            console.log(MSG_SESSION_CLOSED);
          });
          // TODO: find some better way to return data
          console.log(res.records);
          return res.records;
        })
        .catch((err) => {
          console.log(err);
          session.close(() => {
            console.log(MSG_SESSION_CLOSED);
          });
          return { error: err };
        });
      return promise;
    } catch (e) {
      console.log(e);
      session.close(() => {
        console.log(MSG_SESSION_CLOSED);
      });
      return (e);
    }
  }
};
