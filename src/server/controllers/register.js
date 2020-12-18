const bcrypt = require('bcryptjs');

const userBUS = require('../bus/user');

module.exports = {
	post: function(req, res, next) {
		const {username, name, password} = req.body;
        
    userBUS.findByUsername(username)
    .then(function(user) {
      if(user) {
        res.json({ok: false, messageCode: 'username_existed'});
      } else {
        const newUser = {
          username: username,
          password: password,
          name: name,
          avatar: null,
          role: 'user'
        };

        bcrypt.genSalt(10, function(err, salt) {
          if (err) {
            res.json({ok: false, messageCode: 'bcrypt_gensalt_fail'});
            throw err;
          }

          bcrypt.hash(newUser.password, salt, function(err, hash) {
            if (err) {
              res.json({ok: false, messageCode: 'bcrypt_hash_fail'});
              throw err;
            }

            newUser.password = hash;

            userBUS.insertOne(newUser)
            .then(function(user) {
              if(!user) {
                res.json({ok: false, messageCode: 'register_fail'});
              } else {
                res.json({ok: true, messageCode: 'register_success', item: user});
              }
            })
            .catch(function(err) {
              console.trace(err);
              res.json({ok: false, messageCode: 'register_fail'});
            });
          });
        });
      }
    })
    .catch(function(err) {
      console.trace(err);
      res.json({ok: false, messageCode: 'register_fail'});
    });
	}
};