const express = require('express');

const controller = require('../../controllers/user/matches-history');
const authentication = require('../../services/authentication');

const router = express.Router();

router.get('/', authentication.ensureAuthenticated, controller.getList);

module.exports = router;