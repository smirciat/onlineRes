'use strict';

var express = require('express');
var controller = require('./reservation.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/user/:id', auth.isAuthenticated(),controller.batch);
router.post('/', auth.isAuthenticated(),controller.create);
router.put('/:id', auth.isAuthenticated(),controller.update);
router.patch('/', auth.isAuthenticated(),controller.create);
router.put('/delete/:id', auth.isAuthenticated(),controller.destroy);


module.exports = router;
