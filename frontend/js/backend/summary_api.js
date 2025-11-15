import { postJson, hitEndpoint } from './api.js';

export function startRecordingSummary() {
  return postJson('http://127.0.0.1:5000/api/start-recording-summary', {
    timestamp: new Date().toISOString(),
  });
}

/**
 * Expects server to return HTML summary string.
 */
export async function stopRecordingSummary() {
  const res = await hitEndpoint('http://127.0.0.1:5000/api/stop-recording-summary', {
    timestamp: new Date().toISOString(),
  });
  return typeof res === 'string' ? res : res.summary || res.html || '';
}

/**
 * @param {string} text - typed instruction
 * Expects server to return HTML summary string.
 */
export async function sendTextSummary(text) {
  const res = await postJson('http://127.0.0.1:5000/api/text-summary', {
    instruction: text,
    timestamp: new Date().toISOString(),
  });
  return typeof res === 'string' ? res : res.summary || res.html || '';
}
