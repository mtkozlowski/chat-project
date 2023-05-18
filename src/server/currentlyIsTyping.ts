import { EventEmitter } from 'events';

const ee = new EventEmitter();

export const currentlyTyping: Record<string, { lastTyped: Date }> =
  Object.create(null);

const interval = setInterval(() => {
  let updated = false;
  const now = Date.now();
  for (const [key, value] of Object.entries(currentlyTyping)) {
    if (now - value.lastTyped.getTime() > 3e3) {
      delete currentlyTyping[key];
      updated = true;
    }
  }
  if (updated) {
    ee.emit('isTypingUpdate');
  }
}, 2e3);
process.on('SIGTERM', () => clearInterval(interval));
