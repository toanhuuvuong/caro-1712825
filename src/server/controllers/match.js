const matchBUS = require('../bus/match');

module.exports = {
	getList: function(req, res, next) {
    matchBUS.findAll()
    .then(function(matches) {
			res.json({ok: true, messageCode: 'find_all_success', items: matches});
    })
    .catch(function(err) {
      console.trace(err);
      res.json({ok: false, messageCode: 'find_all_fail'});
    });
	},
	getById: function(req, res, next) {
		const {id} = req.params;

    matchBUS.findById(id)
    .then(function(match) {
			if(!match) {
				res.json({ok: false, messageCode: 'not_exist'});
			} else {
				res.json({ok: true, messageCode: 'find_by_id_success', item: match});
			}
    })
    .catch(function(err) {
      console.trace(err);
      res.json({ok: false, messageCode: 'find_by_id_fail'});
    });
  },
  post: function(req, res, next) {
    const model = req.body;

    matchBUS.insertOne(model)
    .then(function(match) {
			if(!match) {
				res.json({ok: false, messageCode: 'insert_fail'});
			} else {
				res.json({ok: true, messageCode: 'insert_success', item: match});
			}
    })
    .catch(function(err) {
      console.trace(err);
      res.json({ok: false, messageCode: 'insert_fail'});
    });
	},
	putById: function(req, res, next) {
    const {id} = req.params;
    const model = req.body;

    matchBUS.updateById(id, model)
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