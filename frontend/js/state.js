// Global application state and simple subscription system.

const state = {
  selectedSymptomGroup: null,
  latestSummaryInstruction: '',
  csvText: '',
  summaryHtml: '',
};

const subscribers = new Map();

/**
 * Subscribe to a given key in the state.
 */
export function subscribe(key, callback) {
  if (!subscribers.has(key)) {
    subscribers.set(key, new Set());
  }
  subscribers.get(key).add(callback);
}

/**
 * Unsubscribe.
 */
export function unsubscribe(key, callback) {
  if (!subscribers.has(key)) return;
  subscribers.get(key).delete(callback);
}

/**
 * Set a value and notify.
 */
export function setState(key, value) {
  if (!(key in state)) {
    console.warn('Unknown state key:', key);
  }
  state[key] = value;
  if (subscribers.has(key)) {
    for (const cb of subscribers.get(key)) {
      try {
        cb(value);
      } catch (err) {
        console.error('Subscriber error for', key, err);
      }
    }
  }
}

/**
 * Get a frozen copy of state.
 */
export function getState() {
  return Object.freeze({ ...state });
}
