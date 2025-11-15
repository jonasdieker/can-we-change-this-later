// Simple event hub.

const listeners = new Map();

export function on(type, handler) {
  if (!listeners.has(type)) {
    listeners.set(type, new Set());
  }
  listeners.get(type).add(handler);
}

export function off(type, handler) {
  if (!listeners.has(type)) return;
  listeners.get(type).delete(handler);
}

export function emit(type, payload) {
  if (!listeners.has(type)) return;
  for (const handler of listeners.get(type)) {
    try {
      handler(payload);
    } catch (err) {
      console.error('Event handler error', type, err);
    }
  }
}
