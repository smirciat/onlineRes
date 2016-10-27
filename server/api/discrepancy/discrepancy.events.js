/**
 * Discrepancy model events
 */

'use strict';

import {EventEmitter} from 'events';
var Discrepancy = require('../../sqldb').Discrepancy;
var DiscrepancyEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DiscrepancyEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Discrepancy.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    DiscrepancyEvents.emit(event + ':' + doc._id, doc);
    DiscrepancyEvents.emit(event, doc);
    done(null);
  }
}

export default DiscrepancyEvents;
