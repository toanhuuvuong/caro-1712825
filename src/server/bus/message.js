const mongodb = require("mongodb");

const messageDAO = require('../dao/message');

const ObjectId = mongodb.ObjectId;

module.exports = {
	findAll: function() {
    return new Promise(function(resolve, reject) {
      const query = {};

      messageDAO.find(query)
      .then(function(messages) {
        return resolve(messages);
      })
      .catch(function(err) {
        return reject(err);
      });
    });
	},
	findById: function(id) {
    return new Promise(function(resolve, reject) {
      const query = {_id: ObjectId(id)};

      messageDAO.find(query)
      .then(function(messages) {
        if(!messages || messages.length === 0) {
          return resolve(null);
        }

        return resolve(messages[0]);
      })
      .catch(function(err) {
        return reject(err);
      });
    });
	},
  findByMatchId: function(matchId) {
    return new Promise(function(resolve, reject) {
      const query = {matchId: matchId};

      messageDAO.find(query)
      .then(function(messages) {
        return resolve(messages);
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

      messageDAO.insertOne(newValue)
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

      messageDAO.update(query, newValue)
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

      messageDAO.deleteOne(query)
      .then(function(result) {
        return resolve(result);
      })
      .catch(function(err) {
        return reject(err);
      });
    });
	}
};