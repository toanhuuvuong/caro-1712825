const securityUtil = require('../utils/security');
const mailUtil = require('../utils/mail');
const mailConfig = require('../config/mail');
const userBUS = require('../bus/user');

module.exports = {
	post: function(req, res, next) {
		const {username} = req.body;

    userBUS.findByUsername(username)
    .then(function(user) {
			if(!user) {
				res.json({ok: false, messageCode: 'not_register'});
			} else {
        let newPassword = mailConfig.PASSWORD_RESET;
        mailUtil.sendText(
          'Caro 1712825 Mail Server', 
          username, 
          'RESET PASSWORD',
          'Your new password: ' + newPassword
        )
        .then(function(info) {
          securityUtil.encrypt(newPassword)
          .then(function(hash) {
            newPassword = hash;
            userBUS.updateById(user._id.toString(), {password: newPassword})
            .then(function(data) {
              if(data.result.ok !== 1) {
                res.json({ok: false, messageCode: 'update_user_fail'});
              } else {
                res.json({ok: true, messageCode: 'send_mail_success'});
              }
            })
            .catch(function(err) {
              res.json({ok: false, messageCode: 'update_user_fail'});
            });
          })
          .catch(function(err) {
            res.json({ok: false, messageCode: 'encrypt_fail'});
          });
        })
        .catch(function(err) {
          console.trace(err);
          res.json({ok: false, messageCode: 'send_mail_fail'});
        });
			}
    })
    .catch(function(err) {
      console.trace(err);
      res.json({ok: false, messageCode: 'find_by_username_fail'});
    });
	}
};