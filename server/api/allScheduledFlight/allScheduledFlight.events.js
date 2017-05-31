/**
 * AllScheduledFlight model events
 */

'use strict';

import {EventEmitter} from 'events';
var AllScheduledFlight = require('../../sqldb').AllScheduledFlight;
var AllScheduledFlightEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
AllScheduledFlightEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  AllScheduledFlight.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    AllScheduledFlightEvents.emit(event + ':' + doc._id, doc);
    AllScheduledFlightEvents.emit(event, doc);
    done(null);
  }
}

export default AllScheduledFlightEvents;
