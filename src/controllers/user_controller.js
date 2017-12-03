module.exports = class UserController {
  /**
   * Instantiates a new Controller object with the driver
   * @param {neo4j-driver} db
   */
  constructor(db) {
    // neo4j driver
    this.db = db;
    this.LABEL = 'User';
    this.WORD_RELATIONS = [
      'Learns',
      // 'Knows', TODO: think of a use case
      'Added'
    ];
  }

  create(pageId, name) {
    console.log('initializing session');
    try {
      const session = this.db.session();
      const query = `CREATE (user:${this.LABEL}{page_id:{_pageId},name:{_name},created:{_created}}) RETURN user;`;
      const promise = session.run(
        query,
        {
          _pageId: pageId,
          _name: name,
          _created: Date.now()
        }
      )
        .then((res) => {
          session.close(() => {
            console.log('session closed');
          });
          console.log('created user!: ', res.records);
          return res.records.map((record) => {
            return (record.get('user')).properties;
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

  ensure(pageId, name) {
    console.log('initializing session');
    try {
      const session = this.db.session();
      // console.log(session);
      const query = `MERGE (user:${this.LABEL}{page_id:{_pageId}}) 
        ON CREATE SET user.created = {_created} , user.name = {_name}
        RETURN user;`;
      console.log('query:', query);
      const promise = session.run(
        query,
        {
          _pageId: pageId.toLowerCase(),
          _name: name,
          _created: Date.now()
        }
      )
        .then((res) => {
          console.log(res);
          session.close(() => {
            console.log('session closed');
          });
          return res.records.map((record) => {
            return (record.get('user')).properties;
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

  getByPageId(pageId) {
    console.log('initializing session');
    try {
      const session = this.db.session();
      // console.log(session);
      const query = `MATCH (user:${this.LABEL}{page_id:{_pageId}}) RETURN user LIMIT 1;`;
      console.log('query:', query);
      const promise = session.run(
        query,
        { _pageId: pageId }
      )
        .then((res) => {
          session.close(() => {
            console.log('session closed');
          });
          return res.records.map((record) => {
            return (record.get('user')).properties;
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

  addWord(pageId, targetTitle, relationType) {
    console.log('initializing session');
    try {
      const session = this.db.session();
      const query = `MATCH (user:${this.LABEL}{page_id:{_pageId}}), (word:Word{title:{_targetTitle}})
      MERGE (user)-[r:${relationType}]->(word)
        ON CREATE SET r.created = {_created}
      RETURN user,r,word;`;
      const promise = session.run(
        query,
        {
          _pageId: pageId,
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
