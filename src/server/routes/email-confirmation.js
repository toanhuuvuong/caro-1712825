const express = require('express');

const controller = require('../controllers/email-confirmation');

const router = express.Router();

router.get('/', controller.get);

module.exports = router;