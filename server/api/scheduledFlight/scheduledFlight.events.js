/**
 * ScheduledFlight model events
 */

'use strict';

import {EventEmitter} from 'events';
var ScheduledFlight = require('../../sqldb').ScheduledFlight;
var ScheduledFlightEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ScheduledFlightEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  ScheduledFlight.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    ScheduledFlightEvents.emit(event + ':' + doc._id, doc);
    ScheduledFlightEvents.emit(event, doc);
    done(null);
  }
}

export default ScheduledFlightEvents;
