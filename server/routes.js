/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';
import lusca from 'lusca';
import * as auth from './auth/auth.service';

export default function(app) {
  app.use('/api/things/mobile', require('./api/thing/indexMobile'));
  app.use('/api/users/mobile', require('./api/user/indexMobile'));
  app.use('/api/reservations/mobile', require('./api/reservation/indexMobile'));
  app.use('/api/dels', require('./api/del'));//no CSRF needed, not worried about this one
  app.use('/api/mails/mobile', require('./api/mail/indexMobile'));
  app.use('/api/userAttributes/mobile', require('./api/userAttribute/indexMobile'));
  app.use('/api/scheduledFlights/mobile', require('./api/scheduledFlight/indexMobile'));
  
  app.use('/auth/mobile', require('./auth/indexMobile'));
  
  app.use(lusca.csrf({angular:true}));
    //routes below this require CSRF tokens, all browser routes 
  app.get('/pdf', auth.hasRole('applicant'),function(req, res){
    if (req.query) {
      var filename = req.query.filename;
      var tempFile="./pdfs/" + filename;
      res.sendFile(tempFile, {root: __dirname});
    }
    else res.status(500);
  });
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
