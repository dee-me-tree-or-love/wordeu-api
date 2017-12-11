const matching = require('../utils/matching.js');

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
    this.scoreDegrees = {
      best: 6,
      okay: 3,
      not_so_well: -1,
    }
  }

  // TODO: move to a separate module!
  compareStrings(text, search) {
    const editDistance = matching.levensteinDistance(text, search);
    return {
      editDistance: editDistance,
      score: 1 - (editDistance) / Math.max(text.length, search.length)
    };
  }

  getScoreDegree(score) {
    return Object.keys(this.scoreDegrees)
      .reduce((degree, key) => {
        return (this.scoreDegrees[key] == score) ? key : degree
      });
  }

  calculateScore(similarity) {
    if (similarity > 0.7) {
      return this.scoreDegrees.best;
    }
    if (similarity > 0.5) {
      return this.scoreDegrees.okay;
    }
    return this.scoreDegrees.not_so_well;
  }

  updateUserLearnScore(pageId, title, score) {
    console.log('updating user score');
    try {
      const session = this.db.session();
      const query = ` MATCH (p:User {page_id:{_pid}}), (p)-[r:learns]->(word:Word {title:{_title}}) 
                      SET r.score = COALESCE(r.score,0) + ({_score});`;
      const promise = session.run(
        query,
        {
          _pid: pageId,
          _title: title,
          _score: score
        }
      )
        .then((res) => {
          session.close(() => {
            console.log('session closed');
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


  getNewQuizWord(pageId) {
    console.log('initializing session');
    try {
      const session = this.db.session();
      // TODO: get only words that have at least one recorded translation
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

            const word = record.get('t').properties.title;
            const similarity = this.compareStrings(word, answer);

            const comparisson = {
              word: word,
              similarity: similarity.score,
              editDistance: similarity.editDistance
            }

            return comparisson;
          });

          // find the best
          const best = options.reduce((a, b) => {
            return (a.similarity > b.similarity) ? a : b;
          })
          const score = this.calculateScore(best.similarity);

          const resp = {
            best_match: best,
            answer: answer,
            score: score,
            degree: this.getScoreDegree(score),
            options: options
          };

          this.updateUserLearnScore(pageId, quizWord, score);
          return resp;
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
