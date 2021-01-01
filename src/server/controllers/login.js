const jwt = require('jsonwebtoken');

const securityUtil = require('../utils/security');
const userBUS = require('../bus/user');

module.exports = {
	post: function(req, res, next) {
		const {username, password} = req.body;

    userBUS.findByUsername(username)
    .then(function(user) {
			if(!user || !user.password) {
				res.json({ok: false, messageCode: 'not_register'});
			} else {
        if(user.isDeleted) {
          res.json({ok: false, messageCode: 'not_permission'});
        } else {
          securityUtil.compare(password, user.password)
          .then(function(isMatch) {
            if(isMatch) {
              const payload = {
                id: user._id.toString(),
                username: user.username,
                name: user.name,
                role: user.role
              };
              const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
              
              res.json({ok: true, messageCode: "login_success", token: token, userId: payload.id, role: payload.role});
            } else {
              res.json({ok: false, messageCode: 'wrong_password'});
            }
          })
          .catch(function(err) {
            res.json({ok: false, messageCode: 'bcrypt_compare_fail'});
          });
        }
			}
    })
    .catch(function(err) {
      console.trace(err);
      res.json({ok: false, messageCode: 'find_by_username_fail'});
    });
	}
};