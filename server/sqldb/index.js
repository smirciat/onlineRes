/**
 * Sequelize initialization module
 */

'use strict';

import path from 'path';
import config from '../config/environment';
import Sequelize from 'sequelize';

var options = config.sequelize.options;
options.dialect='postgres';
options.dialectOptions={ssl:true};

var db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.uri, options)
};

// Insert models below
db.Order = db.sequelize.import('../api/order/order.model');
db.Customer = db.sequelize.import('../api/customer/customer.model');
db.Workorder = db.sequelize.import('../api/workorder/workorder.model');
db.Inventory = db.sequelize.import('../api/inventory/inventory.model');
db.Order = db.sequelize.import('../api/order/order.model');
db.AllScheduledFlight = db.sequelize.import('../api/allScheduledFlight/allScheduledFlight.model');
db.REFRunwayChecklist = db.sequelize.import('../api/REF_RunwayChecklist/REF_RunwayChecklist.model');
db.SmsName = db.sequelize.import('../api/smsName/smsName.model');
db.Sm = db.sequelize.import('../api/sm/sm.model');
db.Timesheet = db.sequelize.import('../api/timesheet/timesheet.model');
db.Del = db.sequelize.import('../api/del/del.model');
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
