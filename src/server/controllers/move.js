const moveBUS = require('../bus/move');

module.exports = {
	getList: function(req, res, next) {
    moveBUS.findAll()
    .then(function(moves) {
			res.json({ok: true, messageCode: 'find_all_success', items: moves});
    })
    .catch(function(err) {
      console.trace(err);
      res.json({ok: false, messageCode: 'find_all_fail'});
    });
	},
	getById: function(req, res, next) {
		const {id} = req.params;

    moveBUS.findById(id)
    .then(function(move) {
			if(!move) {
				res.json({ok: false, messageCode: 'not_exist'});
			} else {
				res.json({ok: true, messageCode: 'find_by_id_success', item: move});
			}
    })
    .catch(function(err) {
      console.trace(err);
      res.json({ok: false, messageCode: 'find_by_id_fail'});
    });
  },
  getByMatchId: function(req, res, next) {
		const {matchId} = req.params;

    moveBUS.findByMatchId(matchId)
    .then(function(moves) {
			if(!moves) {
				res.json({ok: false, messageCode: 'not_exist'});
			} else {
				res.json({ok: true, messageCode: 'find_by_id_success', items: moves});
			}
    })
    .catch(function(err) {
      console.trace(err);
      res.json({ok: false, messageCode: 'find_by_id_fail'});
    });
  },
  post: function(req, res, next) {
    const model = req.body;

    moveBUS.insertOne(model)
    .then(function(move) {
			if(!move) {
				res.json({ok: false, messageCode: 'insert_fail'});
			} else {
				res.json({ok: true, messageCode: 'insert_success', item: move});
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

    moveBUS.updateById(id, model)
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