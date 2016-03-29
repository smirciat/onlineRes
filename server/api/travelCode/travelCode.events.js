/**
 * TravelCode model events
 */

'use strict';

import {EventEmitter} from 'events';
var TravelCode = require('../../sqldb').TravelCode;
var TravelCodeEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
TravelCodeEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  TravelCode.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    TravelCodeEvents.emit(event + ':' + doc._id, doc);
    TravelCodeEvents.emit(event, doc);
    done(null);
  }
}

export default TravelCodeEvents;
