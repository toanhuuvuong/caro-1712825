const userBUS = require('../../bus/user');

module.exports = {
	getList: function(req, res, next) {
    userBUS.findAllOrderByTrophies()
    .then(function(users) {
			res.json({ok: true, messageCode: 'find_all_success', items: users});
    })
    .catch(function(err) {
      console.trace(err);
      res.json({ok: false, messageCode: 'find_all_fail'});
    });
	}
};