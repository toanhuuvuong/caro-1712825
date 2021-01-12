const messageBUS = require('../bus/message');

module.exports = {
	getList: function(req, res, next) {
    messageBUS.findAll()
    .then(function(messages) {
			res.json({ok: true, messageCode: 'find_all_success', items: messages});
    })
    .catch(function(err) {
      console.trace(err);
      res.json({ok: false, messageCode: 'find_all_fail'});
    });
	},
	getById: function(req, res, next) {
		const {id} = req.params;

    messageBUS.findById(id)
    .then(function(message) {
			if(!message) {
				res.json({ok: false, messageCode: 'not_exist'});
			} else {
				res.json({ok: true, messageCode: 'find_by_id_success', item: message});
			}
    })
    .catch(function(err) {
      console.trace(err);
      res.json({ok: false, messageCode: 'find_by_id_fail'});
    });
  },
  post: function(req, res, next) {
    const model = req.body;

    messageBUS.insertOne(model)
    .then(function(message) {
			if(!message) {
				res.json({ok: false, messageCode: 'insert_fail'});
			} else {
				res.json({ok: true, messageCode: 'insert_success', item: message});
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

    messageBUS.updateById(id, model)
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