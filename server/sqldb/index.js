/**
 * Sequelize initialization module
 */

'use strict';

import path from 'path';
import config from '../config/environment';
import Sequelize from 'sequelize';

var db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
};

// Insert models below
db.Del = db.sequelize.import('../api/del/del.model');
db.Delete = db.sequelize.import('../api/delete/delete.model');
db.ScheduledFlight = db.sequelize.import('../api/scheduledFlight/scheduledFlight.model');
db.Project = db.sequelize.import('../api/project/project.model');
db.Chat = db.sequelize.import('../api/chat/chat.model');
db.AircraftSch = db.sequelize.import('../api/aircraftSch/aircraftSch.model');
db.PilotSch = db.sequelize.import('../api/pilotSch/pilotSch.model');
db.TravelCode = db.sequelize.import('../api/travelCode/travelCode.model');
db.Flight = db.sequelize.import('../api/flight/flight.model');
db.Mail = db.sequelize.import('../api/mail/mail.model');
db.UserAttribute = db.sequelize.import('../api/userAttribute/userAttribute.model');
db.Reservation = db.sequelize.import('../api/reservation/reservation.model');
db.Thing = db.sequelize.import('../api/thing/thing.model');
db.User = db.sequelize.import('../api/user/user.model');

export default db;
