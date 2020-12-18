const mongoConnection = require('./connection');
const dbConfig = require('../config/db');

const url = dbConfig.DB_URL_CONNECT;
const dbName = dbConfig.DB_NAME;

module.exports = {
	update: function(collectionName, query, newDocument) {
		return new Promise(function(resolve, reject) {
			mongoConnection.getConnection(url, dbName)
			.then(function([db, dbo]) {
				dbo.collection(collectionName)
				.updateOne(query, newDocument, {writeConcern: {w: "majority", wtimeout: 5000}}, function(err, result) {
					if (err) {
						return reject(err);
					}

					db.close();

					return resolve(result);
				});
			})
			.catch(function(err) {
				return reject(err);
			});
		});
	},
	insertOne: function(collectionName, newDocument) {
		return new Promise(function(resolve, reject) {
			mongoConnection.getConnection(url, dbName)
			.then(function([db, dbo]) {
				dbo.collection(collectionName)
				.insertOne(newDocument, { writeConcern: { w: "majority", wtimeout: 5000 } }, function(err, result) {
					if (err) {
						return reject(err);
					}

					db.close();

					return resolve(result);
				});
			})
			.catch(function(err) {
				return reject(err);
			});
		});
	},
	insertMany: function(collectionName, listDocument) {
		return new Promise(function(resolve, reject) {
			mongoConnection.getConnection(url, dbName)
			.then(function([db, dbo]) {
        dbo.collection(collectionName)
        .insertMany(listDocument, { writeConcern: { w: "majority", wtimeout: 5000 } }, function(err, result) {
          if (err) {
						return reject(err);
					}

					db.close();

					return resolve(result);
        });
      })
      .catch(function(err) {
				return reject(err);
			});
		});
	},
	deleteOne: function(collectionName, query) {
		return new Promise(function(resolve, reject) {
			mongoConnection.getConnection(url, dbName)
			.then(function([db, dbo]) {
        dbo.collection(collectionName)
        .deleteOne(query, { writeConcern: { w: "majority", wtimeout: 5000 } }, function(err, result) {
          if (err) {
						return reject(err);
					}

					db.close();

					return resolve(result);
        });
      })
      .catch(function(err) {
				return reject(err);
			});
		});
	},
	find: function(collectionName, query, options = {}) {
		return new Promise(function(resolve, reject) {
			mongoConnection.getConnection(url, dbName)
			.then(function([db, dbo]) {
        dbo.collection(collectionName)
        .find(query)
        .sort(options)
        .toArray(function(err, result) {
          if (err) {
						return reject(err);
					}

					db.close();

					return resolve(result);
        });
      })
      .catch(function(err) {
				return reject(err);
			});
		});
	},
	aggregate: function(collectionName, group, options = {}, having = {}) {
		return new Promise(function(resolve, reject) {
			mongoConnection.getConnection(url, dbName)
			.then(function([db, dbo]) {
        dbo.collection(collectionName)
        .aggregate([group, options, having])
        .toArray(function (err, result) {
          if (err) {
						return reject(err);
					}

					db.close();

					return resolve(result);
        });
      })
      .catch(function(err) {
				return reject(err);
			});
		});
	}
};