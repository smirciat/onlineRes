/**
 * PilotSch model events
 */

'use strict';

import {EventEmitter} from 'events';
var PilotSch = require('../../sqldb').PilotSch;
var PilotSchEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PilotSchEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  PilotSch.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    PilotSchEvents.emit(event + ':' + doc._id, doc);
    PilotSchEvents.emit(event, doc);
    done(null);
  }
}

export default PilotSchEvents;
