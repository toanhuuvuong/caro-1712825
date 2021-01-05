const mongodb = require("mongodb");

const matchDAO = require('../dao/match');

const ObjectId = mongodb.ObjectId;

module.exports = {
	findAll: function() {
    return new Promise(function(resolve, reject) {
      const query = {};

      matchDAO.find(query)
      .then(function(matches) {
        return resolve(matches);
      })
      .catch(function(err) {
        return reject(err);
      });
    });
	},
	findById: function(id) {
    return new Promise(function(resolve, reject) {
      const query = {_id: ObjectId(id)};

      matchDAO.find(query)
      .then(function(matches) {
        if(!matches || matches.length === 0) {
          return resolve(null);
        }

        return resolve(matches[0]);
      })
      .catch(function(err) {
        return reject(err);
      });
    });
	},
  findByRoomId: function(roomId) {
    return new Promise(function(resolve, reject) {
      const query = {roomId: roomId};

      matchDAO.find(query)
      .then(function(matches) {
        return resolve(matches);
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

      matchDAO.insertOne(newValue)
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

      matchDAO.update(query, newValue)
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

      matchDAO.deleteOne(query)
      .then(function(result) {
        return resolve(result);
      })
      .catch(function(err) {
        return reject(err);
      });
    });
	}
};