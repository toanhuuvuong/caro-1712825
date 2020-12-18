const mongodb = require("mongodb");

const userDAO = require('../dao/user');

const ObjectId = mongodb.ObjectId;

module.exports = {
	findAll: function() {
    return new Promise(function(resolve, reject) {
      const query = {};

      userDAO.find(query)
      .then(function(users) {
        return resolve(users);
      })
      .catch(function(err) {
        return reject(err);
      });
    });
	},
	findById: function(id) {
    return new Promise(function(resolve, reject) {
      const query = {_id: ObjectId(id)};

      userDAO.find(query)
      .then(function(users) {
        if(!users || users.length === 0) {
          return resolve(null);
        }

        return resolve(users[0]);
      })
      .catch(function(err) {
        return reject(err);
      });
    });
	},
	findByUsername: function(username) {
    return new Promise(function(resolve, reject) {
      const query = {username: username};

      userDAO.find(query)
      .then(function(users) {
        if(!users || users.length === 0) {
          return resolve(null);
        }

        return resolve(users[0]);
      })
      .catch(function(err) {
        return reject(err);
      });
    });
  }, 
  findByGoogleId: function(googleId) {
    return new Promise(function(resolve, reject) {
      const query = {googleId: googleId};

      userDAO.find(query)
      .then(function(users) {
        if(!users || users.length === 0) {
          return resolve(null);
        }

        return resolve(users[0]);
      })
      .catch(function(err) {
        return reject(err);
      });
    });
  },
  findByFacebookId: function(facebookId) {
    return new Promise(function(resolve, reject) {
      const query = {facebookId: facebookId};

      userDAO.find(query)
      .then(function(users) {
        if(!users || users.length === 0) {
          return resolve(null);
        }

        return resolve(users[0]);
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

      userDAO.insertOne(newValue)
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

      userDAO.update(query, newValue)
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

      userDAO.deleteOne(query)
      .then(function(result) {
        return resolve(result);
      })
      .catch(function(err) {
        return reject(err);
      });
    });
	}
};