const securityUtil = require('../utils/security');
const userBUS = require('../bus/user');
const verificationTokenBUS = require('../bus/verification-token');
const mailUtil = require('../utils/mail');

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

        securityUtil.encrypt(newUser.password)
        .then(function(hash) {
          newUser.password = hash;

          userBUS.insertOne(newUser)
          .then(function(user) {
            if(!user) {
              res.json({ok: false, messageCode: 'register_fail'});
            } else {
              // Send mail
              securityUtil.encrypt(user._id.toString())
              .then(function(hash) {
                const newToken = {
                  code: hash,
                  userId: user._id.toString()
                };
                verificationTokenBUS.insertOne(newToken)
                .then(function(token) {
                  mailUtil.sendText(
                    'Caro 1712825 Mail Server', 
                    username, 
                    'EMAIL CONFIRMATION',
                    'Active your account: ' + process.env.SERVER_URL + '/email-confirmation?code=' + token.code
                  )
                  .then(function(info) {
                    res.json({ok: true, messageCode: 'register_success', item: user});
                  })
                  .catch(function(err) {
                    console.trace(err);
                    res.json({ok: false, messageCode: 'send_mail_fail'});
                  });
                })
                .catch(function(err) {
                  res.json({ok: false, messageCode: 'insert_token_fail'});
                });
              })
              .catch(function(err) {
                res.json({ok: false, messageCode: 'encrypt_token_fail'});
              });
            }
          })
          .catch(function(err) {
            console.trace(err);
            res.json({ok: false, messageCode: 'register_fail'});
          });
        })
        .catch(function(err) {
          res.json({ok: false, messageCode: 'bcrypt_encrypt_fail'});
        });
      }
    })
    .catch(function(err) {
      console.trace(err);
      res.json({ok: false, messageCode: 'register_fail'});
    });
	}
};