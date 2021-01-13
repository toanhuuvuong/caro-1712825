const matchBUS = require('../../bus/match');
const user = require('../../dao/user');

module.exports = {
	getList: function(req, res, next) {
    const userId = req.user.id;
    
    matchBUS.findByUserIdOrderByCreatedDate(userId)
    .then(function(users) {
			res.json({ok: true, messageCode: 'find_all_success', items: users});
    })
    .catch(function(err) {
      console.trace(err);
      res.json({ok: false, messageCode: 'find_all_fail'});
    });
	}
};