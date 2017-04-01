/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';
import lusca from 'lusca';

export default function(app) {
  // Insert routes below
  app.use('/api/mobileThings', require('./api/mobileThing'));
  app.use('/api/dels', require('./api/del'));
  app.use('/api/scheduledFlights', require('./api/scheduledFlight'));
  app.use('/api/mails', require('./api/mail'));
  app.use('/api/userAttributes', require('./api/userAttribute'));
  app.use('/api/reservations', require('./api/reservation'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));
  app.use(lusca.csrf({angular:true}));
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
}
