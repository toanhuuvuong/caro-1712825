
const verificationTokenBUS = require('../bus/verification-token');
const userBUS = require('../bus/user');

module.exports = {
	get: function(req, res, next) {
		const {code} = req.query;

    verificationTokenBUS.findByCode(code)
    .then(function(token) {
			if(!token) {
				res.json({ok: false, messageCode: 'token_not_exist'});
			} else {
        if(token.isDeleted) {
          res.json({ok: false, messageCode: 'token_used'});
        } else {
          const current = Date.now();
          if(current > token.expiryDate) {
            res.json({ok: false, messageCode: 'token_expiried'});
          } else {
            userBUS.updateById(token.userId, {isDeleted: false})
            .then(function(data) {
              if(data.result.ok !== 1) {
                res.json({ok: false, messageCode: 'update_user_fail'});
              } else {
                verificationTokenBUS.updateById(token._id.toString(), {isDeleted: true})
                .then(function(data){
                  if(data.result.ok !== 1) {
                    res.json({ok: false, messageCode: 'update_token_fail'});
                  } else {
                    res.json({ok: true, messageCode: 'confirm_success'});
                  }
                })
                .catch(function(err) {
                  res.json({ok: false, messageCode: 'update_token_fail'});
                });
              }
            })
            .catch(function(err) {
              res.json({ok: false, messageCode: 'update_user_fail'});
            });
          }
        }
			}
    })
    .catch(function(err) {
      console.trace(err);
      res.json({ok: false, messageCode: 'find_token_code_fail'});
    });
	}
};