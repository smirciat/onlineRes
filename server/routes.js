/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/dels', require('./api/del'));
  app.use('/api/scheduledFlights', require('./api/scheduledFlight'));
  app.use('/api/projects', require('./api/project'));
  app.use('/api/chats', require('./api/chat'));
  app.use('/api/aircraftSchs', require('./api/aircraftSch'));
  app.use('/api/pilotSchs', require('./api/pilotSch'));
  app.use('/api/travelCodes', require('./api/travelCode'));
  app.use('/api/flights', require('./api/flight'));
  app.use('/api/mails', require('./api/mail'));
  app.use('/api/userAttributes', require('./api/userAttribute'));
  app.use('/api/reservations', require('./api/reservation'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
}
