/**
 * AircraftSch model events
 */

'use strict';

import {EventEmitter} from 'events';
var AircraftSch = require('../../sqldb').AircraftSch;
var AircraftSchEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
AircraftSchEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  AircraftSch.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    AircraftSchEvents.emit(event + ':' + doc._id, doc);
    AircraftSchEvents.emit(event, doc);
    done(null);
  }
}

export default AircraftSchEvents;
