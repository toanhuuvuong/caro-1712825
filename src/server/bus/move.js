const mongodb = require("mongodb");

const moveDAO = require('../dao/move');

const ObjectId = mongodb.ObjectId;

module.exports = {
	findAll: function() {
    return new Promise(function(resolve, reject) {
      const query = {};

      moveDAO.find(query)
      .then(function(moves) {
        return resolve(moves);
      })
      .catch(function(err) {
        return reject(err);
      });
    });
	},
	findById: function(id) {
    return new Promise(function(resolve, reject) {
      const query = {_id: ObjectId(id)};

      moveDAO.find(query)
      .then(function(moves) {
        if(!moves || moves.length === 0) {
          return resolve(null);
        }

        return resolve(moves[0]);
      })
      .catch(function(err) {
        return reject(err);
      });
    });
	},
  findByMatchId: function(matchId) {
    return new Promise(function(resolve, reject) {
      const query = {matchId: matchId};

      moveDAO.find(query, {move: 1})
      .then(function(moves) {
        return resolve(moves);
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

      moveDAO.insertOne(newValue)
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

      moveDAO.update(query, newValue)
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

      moveDAO.deleteOne(query)
      .then(function(result) {
        return resolve(result);
      })
      .catch(function(err) {
        return reject(err);
      });
    });
	}
};