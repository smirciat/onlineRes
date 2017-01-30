/**
 * Del model events
 */

'use strict';

import {EventEmitter} from 'events';
var Del = require('../../sqldb').Del;
var DelEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DelEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Del.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    DelEvents.emit(event + ':' + doc._id, doc);
    DelEvents.emit(event, doc);
    done(null);
  }
}

export default DelEvents;
