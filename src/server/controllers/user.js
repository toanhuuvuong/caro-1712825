const userBUS = require('../bus/user');

module.exports = {
	getList: function(req, res, next) {
    userBUS.findAll()
    .then(function(users) {
			res.json({ok: true, messageCode: 'find_all_success', items: users});
    })
    .catch(function(err) {
      console.trace(err);
      res.json({ok: false, messageCode: 'find_all_fail'});
    });
	},
	getById: function(req, res, next) {
		const {id} = req.params;

    userBUS.findById(id)
    .then(function(user) {
			if(!user) {
				res.json({ok: false, messageCode: 'not_exist'});
			} else {
				res.json({ok: true, messageCode: 'find_by_id_success', item: user});
			}
    })
    .catch(function(err) {
      console.trace(err);
      res.json({ok: false, messageCode: 'find_by_id_fail'});
    });
	},
	putById: function(req, res, next) {
    const id = req.user.id;
    const model = req.body;

    userBUS.updateById(id, model)
    .then(function(data) {
			if(data.result.ok !== 1) {
				res.json({ok: false, messageCode: 'update_by_id_not_ok'});
			} else {
				res.json({ok: true, messageCode: 'update_by_id_success'});
			}
    })
    .catch(function(err) {
      console.trace(err);
      res.json({ok: false, messageCode: 'update_by_id_fail'});
    });
	}
};