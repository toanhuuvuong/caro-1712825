const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userBUS = require('../bus/user');

module.exports = {
	post: function(req, res, next) {
		const {username, password} = req.body;

    userBUS.findByUsername(username)
    .then(function(user) {
			if(!user || !user.password) {
				res.json({ok: false, messageCode: 'not_register'});
			} else {
				bcrypt.compare(password, user.password, function(err, isMatch) {
					if(err) {
            res.json({ok: false, messageCode: 'bcrypt_compare_fail'});
						throw err;
					}

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
				});
			}
    })
    .catch(function(err) {
      console.trace(err);
      res.json({ok: false, messageCode: 'find_by_username_fail'});
    });
	}
};