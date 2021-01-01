const express = require('express');

const controller = require('../controllers/forgot-password');
const authentication = require('../services/authentication');

const router = express.Router();

router.post('/', authentication.forwardAuthenticated, controller.post);

module.exports = router;