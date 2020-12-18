const express = require('express');

const controller = require('../controllers/user');
const authentication = require('../services/authentication');

const router = express.Router();

router.get('/', authentication.ensureAuthenticated, controller.getList);

router.get('/:id', authentication.ensureAuthenticated, controller.getById);

router.put('/:id', authentication.ensureAuthenticated, controller.putById);

module.exports = router;