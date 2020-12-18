const bcrypt = require('bcryptjs');

const userBUS = require('../../bus/user');

module.exports = {
	put: function(req, res, next) {
    const id = req.user.id;
    const {password} = req.body;

    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        res.json({ok: false, messageCode: 'bcrypt_gensalt_fail'});
        throw err;
      }

      bcrypt.hash(password, salt, function(err, hash) {
        if (err) {
          res.json({ok: false, messageCode: 'bcrypt_hash_fail'});
          throw err;
        }

        userBUS.updateById(id, {password: hash})
        .then(function(data) {
          if(data.result.ok !== 1) {
            res.json({ok: false, messageCode: 'update_fail'});
          } else {
            res.json({ok: true, messageCode: 'update_success'});
          }
        })
        .catch(function(err) {
          console.trace(err);
          res.json({ok: false, messageCode: 'update_fail'});
        });
      });
    });
	}
};