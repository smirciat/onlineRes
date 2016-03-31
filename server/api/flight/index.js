'use strict';

var express = require('express');
var controller = require('./flight.controller');

import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', auth.isAuthenticated(),controller.index);
router.get('/:id', auth.isAuthenticated(),controller.show);
router.post('/', auth.hasRole('admin'), controller.create);

router.post('/o', auth.hasRole('admin'), controller.oneD);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/', auth.hasRole('admin'), auth.isAuthenticated(),controller.create);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.put('/superdelete/:id', auth.hasRole('admin'), controller.destroy);
module.exports = router;
