const mongodb = require("mongodb");

const verificationTokenDAO = require('../dao/verification-token');

const ObjectId = mongodb.ObjectId;

const EXPIRATION = 24 * 60 * 60 * 1000;

module.exports = {
	findAll: function() {
    return new Promise(function(resolve, reject) {
      const query = {};

      verificationTokenDAO.find(query)
      .then(function(verificationTokens) {
        return resolve(verificationTokens);
      })
      .catch(function(err) {
        return reject(err);
      });
    });
	},
	findById: function(id) {
    return new Promise(function(resolve, reject) {
      const query = {_id: ObjectId(id)};

      verificationTokenDAO.find(query)
      .then(function(verificationTokens) {
        if(!verificationTokens || verificationTokens.length === 0) {
          return resolve(null);
        }

        return resolve(verificationTokens[0]);
      })
      .catch(function(err) {
        return reject(err);
      });
    });
  },
  findByCode: function(code) {
    return new Promise(function(resolve, reject) {
      const query = {code: code};

      verificationTokenDAO.find(query)
      .then(function(verificationTokens) {
        if(!verificationTokens || verificationTokens.length === 0) {
          return resolve(null);
        }

        return resolve(verificationTokens[0]);
      })
      .catch(function(err) {
        return reject(err);
      });
    });
	},
	findByUserId: function(userId) {
    return new Promise(function(resolve, reject) {
      const query = {userId: userId};

      verificationTokenDAO.find(query)
      .then(function(verificationTokens) {
        if(!verificationTokens || verificationTokens.length === 0) {
          return resolve(null);
        }

        return resolve(verificationTokens[0]);
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
        expiryDate: Date.now() + EXPIRATION,
        isDeleted: false,
        createdDate: null,
        createdBy: 'Unknown',
        modifiedDate: null,
        modifiedBy: 'Unknown'
      };

      verificationTokenDAO.insertOne(newValue)
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

      verificationTokenDAO.update(query, newValue)
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

      verificationTokenDAO.deleteOne(query)
      .then(function(result) {
        return resolve(result);
      })
      .catch(function(err) {
        return reject(err);
      });
    });
	}
};