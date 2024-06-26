'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/email', auth.isAuthenticated(), controller.email);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.post('/resetpassword', controller.adminChangePassword);
router.put('/:id/email', auth.isAuthenticated(), controller.changeEmail);
router.get('/email', auth.isAuthenticated(), controller.email);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);

export default router;