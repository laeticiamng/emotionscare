import { EventEmitter } from 'events';

/**
 * Global event emitter used to notify modules when the user mode changes.
 * Other modules can listen to 'modeChange' to react accordingly.
 */
export const modeEmitter = new EventEmitter();
