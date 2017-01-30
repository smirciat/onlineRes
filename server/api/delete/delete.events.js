/**
 * Delete model events
 */

'use strict';

import {EventEmitter} from 'events';
var Delete = require('../../sqldb').Delete;
var DeleteEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DeleteEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Delete.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    DeleteEvents.emit(event + ':' + doc._id, doc);
    DeleteEvents.emit(event, doc);
    done(null);
  }
}

export default DeleteEvents;
