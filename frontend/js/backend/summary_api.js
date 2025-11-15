import { postJson } from './api.js';

export function startRecordingSummary() {
  return postJson('/start-recording-summary', {
    timestamp: new Date().toISOString(),
  });
}

/**
 * Expects server to return HTML summary string.
 */
export async function stopRecordingSummary() {
  const res = await postJson('/stop-recording-summary', {
    timestamp: new Date().toISOString(),
  });
  return typeof res === 'string' ? res : res.html || '';
}

/**
 * @param {string} text - typed instruction
 * Expects server to return HTML summary string.
 */
export async function sendTextSummary(text) {
  const res = await postJson('/text-summary', {
    instruction: text,
    timestamp: new Date().toISOString(),
  });
  return typeof res === 'string' ? res : res.html || '';
}
