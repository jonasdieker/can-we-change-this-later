import { postJson, hitEndpoint } from './api.js';

export function startRecordingEntry() {
  return postJson('http://127.0.0.1:5000/api/start-recording-entry', {
    timestamp: new Date().toISOString(),
  });
}

export async function stopRecordingEntry() {
  return hitEndpoint('http://127.0.0.1:5000/api/stop-recording-entry', {
    timestamp: new Date().toISOString(),
  });
}

export function sendTextEntry(text) {
  return postJson('http://127.0.0.1:5000/api/text-entry', {
    text,
    timestamp: new Date().toISOString(),
  });
}
