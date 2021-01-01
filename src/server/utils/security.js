const bcrypt = require('bcryptjs');

const LOG_ROUNDS_DEFAULT = 10;

module.exports = {
  encrypt: function(plainText) {
    return new Promise(function(resolve, reject) {
      bcrypt.genSalt(LOG_ROUNDS_DEFAULT, function(err, salt) {
        if (err) {     
          reject(err);
        }
        bcrypt.hash(plainText, salt, function(err, hash) {
          if (err) {
            reject(err);
          }
          resolve(hash);
        });
      });
    });
  },
  compare: function(plainText, hashed) {
    return new Promise(function(resolve, reject) {
      bcrypt.compare(plainText, hashed, function(err, isMatch) {
        if(err) {
          reject(err);
        }
        resolve(isMatch);
      });
    });
  }
};