/**
 * REFRunwayChecklist model events
 */

'use strict';

import {EventEmitter} from 'events';
var REFRunwayChecklist = require('../../sqldb').REFRunwayChecklist;
var REFRunwayChecklistEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
REFRunwayChecklistEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  REFRunwayChecklist.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    REFRunwayChecklistEvents.emit(event + ':' + doc._id, doc);
    REFRunwayChecklistEvents.emit(event, doc);
    done(null);
  }
}

export default REFRunwayChecklistEvents;
