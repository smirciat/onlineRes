'use strict';

var express = require('express');
var controller = require('./reservation.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(),controller.show);
router.get('/user/:id', auth.isAuthenticated(),controller.batch);
router.post('/day', auth.isAuthenticated(),controller.daily);
router.post('/o', auth.hasRole('admin'), controller.oneF);
router.post('/', auth.isAuthenticated(),controller.create);
router.put('/:id', auth.isAuthenticated(),controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.superUpdate);
router.patch('/', auth.isAuthenticated(),controller.create);
router.put('/delete/:id', auth.isAuthenticated(),controller.destroy);
router.put('/superdelete/:id', auth.hasRole('admin'), controller.superDestroy);


module.exports = router;
