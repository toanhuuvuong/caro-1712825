const express = require('express');

const controller = require('../controllers/move');
const authentication = require('../services/authentication');

const router = express.Router();

router.get('/', authentication.ensureAuthenticated, controller.getList);

router.get('/:id', authentication.ensureAuthenticated, controller.getById);
router.get('/match/:matchId', authentication.ensureAuthenticated, controller.getByMatchId);

router.post('/', authentication.ensureAuthenticated, controller.post);

router.put('/:id', authentication.ensureAuthenticated, controller.putById);

module.exports = router;