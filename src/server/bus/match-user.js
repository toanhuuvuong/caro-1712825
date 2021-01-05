const mongodb = require("mongodb");

const matchUserDAO = require('../dao/match-user');

const ObjectId = mongodb.ObjectId;

module.exports = {
	findAll: function() {
    return new Promise(function(resolve, reject) {
      const query = {};

      matchUserDAO.find(query)
      .then(function(matchUsers) {
        return resolve(matchUsers);
      })
      .catch(function(err) {
        return reject(err);
      });
    });
	},
	findById: function(id) {
    return new Promise(function(resolve, reject) {
      const query = {_id: ObjectId(id)};

      matchUserDAO.find(query)
      .then(function(matchUsers) {
        if(!matchUsers || matchUsers.length === 0) {
          return resolve(null);
        }

        return resolve(matchUsers[0]);
      })
      .catch(function(err) {
        return reject(err);
      });
    });
	},
  findByMatchId: function(matchId) {
    return new Promise(function(resolve, reject) {
      const query = {matchId: matchId};

      matchUserDAO.find(query)
      .then(function(matchUsers) {
        return resolve(matchUsers);
      })
      .catch(function(err) {
        return reject(err);
      });
    });
  },
  findByUserId: function(userId) {
    return new Promise(function(resolve, reject) {
      const query = {userId: userId};

      matchUserDAO.find(query)
      .then(function(matchUsers) {
        return resolve(matchUsers);
      })
      .catch(function(err) {
        return reject(err);
      });
    });
  },
	insertOne: function(model) {
    return new Promise(function(resolve, reject) {
      const newValue = {
        ...model,
        isDeleted: false,
        createdDate: null,
        createdBy: 'Unknown',
        modifiedDate: null,
        modifiedBy: 'Unknown'
      };

      matchUserDAO.insertOne(newValue)
      .then(function(result) {
        if(result.result.ok !== 1) {
          return resolve(null);
        }

        return resolve(newValue);
      })
      .catch(function(err) {
        return reject(err);
      });
    });
	},
	updateById: function(id, model) {
    return new Promise(function(resolve, reject) {
      const query = {_id: ObjectId(id)};
      const newValue = {
        $set: model
      };

      matchUserDAO.update(query, newValue)
      .then(function(result) {
        return resolve(result);
      })
      .catch(function(err) {
        return reject(err);
      });
    });
  },
	deleteById: function(id) {
    return new Promise(function(resolve, reject) {
      const query = {_id: ObjectId(id)};

      matchUserDAO.deleteOne(query)
      .then(function(result) {
        return resolve(result);
      })
      .catch(function(err) {
        return reject(err);
      });
    });
	}
};