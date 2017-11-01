module.exports = class UserModel {
  /**
   * Instantiates a new Model object with the driver
   * @param {neo4j-driver} db
   */
  constructor(db) {
    // neo4j driver
    this.db = db;
    this.LABEL = 'User';
  }

  create(pageId, name) {
    console.log('initializing session');
    try {
      const session = this.db.session();
      // console.log(session);
      // CREATE (n:User{page_id:'456',name:'Carl'}) RETURN n;
      const query = `CREATE (user:${this.LABEL}{page_id:{_pageId},name:{_name}}) RETURN user;`;
      // console.log('query:', query);
      const promise = session.run(
        query,
        {
          _pageId: pageId,
          _name: name
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
};
