const express = require('express');

const controller = require('../../controllers/admin/edit-user');
const authentication = require('../../services/authentication');

const router = express.Router();

router.put('/:userId', authentication.ensureAuthenticated, controller.put);

module.exports = router;