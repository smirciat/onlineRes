/**
 * Workorder model events
 */

'use strict';

import {EventEmitter} from 'events';
var Workorder = require('../../sqldb').Workorder;
var WorkorderEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
WorkorderEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Workorder.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    WorkorderEvents.emit(event + ':' + doc._id, doc);
    WorkorderEvents.emit(event, doc);
    done(null);
  }
}

export default WorkorderEvents;
