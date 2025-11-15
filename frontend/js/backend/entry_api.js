import { postJson } from './api.js';

export function startRecordingEntry() {
  return postJson('/start-recording-entry', {
    timestamp: new Date().toISOString(),
  });
}

export function stopRecordingEntry() {
  return postJson('/stop-recording-entry', {
    timestamp: new Date().toISOString(),
  });
}

export function sendTextEntry(text) {
  return postJson('/text-entry', {
    text,
    timestamp: new Date().toISOString(),
  });
}
