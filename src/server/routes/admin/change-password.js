const express = require('express');

const controller = require('../../controllers/admin/change-password');
const authentication = require('../../services/authentication');

const router = express.Router();

router.put('/', authentication.ensureAuthenticated, controller.put);

module.exports = router;