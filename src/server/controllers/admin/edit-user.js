const userBUS = require('../../bus/user');

module.exports = {
	put: function(req, res, next) {
    const {userId} = req.params;
    const {isDeleted} =req.body;

    console.log(userId);

    userBUS.updateById(userId, {isDeleted: isDeleted})
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
	}
};