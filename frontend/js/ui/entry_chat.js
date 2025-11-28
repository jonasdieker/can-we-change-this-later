// Entry chat overlay for post-recording questions

let currentTranscription = '';

/**
 * Show the entry chat overlay with the recorded transcription
 * @param {string} transcription - The transcribed text from the recording
 */
export function showEntryChatOverlay(transcription) {
  currentTranscription = transcription;

  const overlay = document.getElementById('entry-chat-overlay');
  const responseEl = document.getElementById('entry-chat-response');

  if (!overlay || !responseEl) {
    console.error('Entry chat overlay: Required elements not found');
    return;
  }

  // Display the transcription as the initial response
  responseEl.textContent = `I recorded: "${transcription}"`;

  // Show the overlay
  overlay.classList.remove('hidden');
}

/**
 * Hide the entry chat overlay
 */
export function hideEntryChatOverlay() {
  const overlay = document.getElementById('entry-chat-overlay');
  if (!overlay) return;

  overlay.classList.add('hidden');
  currentTranscription = '';
}

/**
 * Initialize entry chat overlay event listeners
 */
export function initEntryChatOverlay() {
  const overlay = document.getElementById('entry-chat-overlay');
  const closeBtn = document.getElementById('entry-chat-close');
  const responseEl = document.getElementById('entry-chat-response');

  if (!overlay || !closeBtn || !responseEl) {
    console.error('Entry chat overlay: Failed to initialize - missing elements');
    return;
  }

  // Close button handler
  closeBtn.addEventListener('click', hideEntryChatOverlay);
}
