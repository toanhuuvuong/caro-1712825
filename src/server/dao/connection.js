const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

module.exports = {
  getConnection: function (url, dbName) {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(url, {useUnifiedTopology: true}, function (err, db) {
        if (err) {
          return reject(err);
        }

        const dbo = db.db(dbName);

        return resolve([db, dbo]);
      });
    });
  }
};