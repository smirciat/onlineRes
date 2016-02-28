/**
 * UserAttribute model events
 */

'use strict';

import {EventEmitter} from 'events';
var UserAttribute = require('../../sqldb').UserAttribute;
var UserAttributeEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
UserAttributeEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  UserAttribute.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    UserAttributeEvents.emit(event + ':' + doc._id, doc);
    UserAttributeEvents.emit(event, doc);
    done(null);
  }
}

export default UserAttributeEvents;
