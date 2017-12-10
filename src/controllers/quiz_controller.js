/* IDEA: make model classes that will describe 
* the structure and properties of the data types (nodes and relationships)
* used in the graph
*/
module.exports = class QuizController {
  /**
   * Instantiates a new Controller object with the driver
   * @param {neo4j-driver} db
   */
  constructor(db) {
    // neo4j driver
    this.db = db;
  }

  // TODO: move to a separate module!
  compareStrings(text, search) {
    this.levensteinDistance(text, search);
    // FIXME: change the implementation to actual damn LD already!
    return (text == search);
  }

  levensteinDistance(text, search) {
    // cost operations
    const insertCost = (char) => { return 1; };
    const removeCost = (char) => { return 1; };
    const updateCost = (charA, charB) => { return charA !== charB ? 1 : 0 };
    // aliases for the two strings
    const sa = text;
    const sb = search;
    // initialize the two dimensional array
    let dist = new Array(sa.length);
    console.log(dist.length)
    for (let key = 0; key < 3; key++) {
      dist[key] = new Array(sb.length);
    }
    // populate the array
    for (let i = 0; i < sa.length; i++) {
      dist[i, 0] = i;
    }
    for (let i = 0; i < sb.length; i++) {
      dist[0, i] = i;
    }
    // the bottom up computation
    for (let i = 0; i < sa.length; i++) {
      for (let j = 0; j < sb.length; j++) {
        // TODO: compute the three values and select the minimal
        Math.min()
      }
    }

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
            console.log(`number of options: ${options.length}`)
            // TODO: add a smart way of selecting the words to practice 
            // (score based weighting maybe)
            const choice = Math.round((Math.random() * 10)) % options.length;
            console.log(`choice ${choice}`);
            return options[choice];

          } else {
            // data handler will take care of correct response
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
    // first get translations for the quiz word, 
    // then try to check if answer matches any
    console.log('initializing session');
    try {
      const session = this.db.session();
      // get translations
      const query = ` MATCH (n:Word 
                      {title: {_title}})<-[r:Translates]-(t) 
                      RETURN t;`;
      const promise = session.run(
        query,
        {
          _title: quizWord,
        }
      )
        .then((res) => {
          // compare the translations now
          session.close(() => {
            console.log('session closed');
          });

          const options = res.records.map((record) => {

            const translation = record.get('t');
            const option = translation.properties.title;
            const similarity = this.compareStrings(option, answer);

            const comparisson = {
              word: translation,
              similarity: similarity
            }

            return comparisson;
          });

          // check if all of them are false, return all the options there are
          console.log(options);

          return options;
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
