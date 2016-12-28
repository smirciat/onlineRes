/**
 * Inventory model events
 */

'use strict';

import {EventEmitter} from 'events';
var Inventory = require('../../sqldb').Inventory;
var InventoryEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
InventoryEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Inventory.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    InventoryEvents.emit(event + ':' + doc._id, doc);
    InventoryEvents.emit(event, doc);
    done(null);
  }
}

export default InventoryEvents;
