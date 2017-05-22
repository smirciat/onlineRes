'use strict';

var express = require('express');
var controller = require('./answer.controller');

var router = express.Router();

router.get('/answer', controller.answer);
router.post('/event', controller.event);
router.post('/final-fallback', controller.final);

module.exports = router;
