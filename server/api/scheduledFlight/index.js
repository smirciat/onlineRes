'use strict';

var express = require('express');
var controller = require('./scheduledFlight.controller');

var router = express.Router();

router.post('/', controller.index);
router.get('/:id', controller.show);
router.post('/create', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
