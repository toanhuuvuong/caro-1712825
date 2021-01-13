const express = require('express');

const controller = require('../../controllers/user/charts');
const authentication = require('../../services/authentication');

const router = express.Router();

router.get('/', authentication.ensureAuthenticated, controller.getList);

module.exports = router;