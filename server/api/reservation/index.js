'use strict';

var express = require('express');
var controller = require('./reservation.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', auth.isAuthenticated(),controller.show);
router.get('/user/:id', auth.isAuthenticated(),controller.batch);
router.get('/day', auth.isAuthenticated(),controller.daily);
router.post('/', auth.isAuthenticated(),controller.create);
router.put('/:id', auth.isAuthenticated(),controller.update);
router.patch('/:id', auth.isAuthenticated(),controller.update);
router.put('/delete/:id', auth.isAuthenticated(),controller.destroy);


module.exports = router;
