// Speech and text UI wiring for Home (entries) and Summary (instructions).

import { openTextModal } from './modal.js';
import { startRecordingEntry, stopRecordingEntry, sendTextEntry } from '../backend/entry_api.js';
import { startRecordingSummary, stopRecordingSummary, sendTextSummary } from '../backend/summary_api.js';
import { setState } from '../state.js';
import { showToast } from './notifications.js';

export function initHomeEntryUI() {
  const voiceBtn = document.getElementById('btn-entry-voice');
  const textBtn = document.getElementById('btn-entry-text');

  if (!voiceBtn || !textBtn) return;

  let recordingEntry = false;

  voiceBtn.addEventListener('click', async () => {
    try {
      if (!recordingEntry) {
        recordingEntry = true;
        voiceBtn.classList.add('recording');
        await startRecordingEntry();
        showToast('Recording entry…', 'info');
      } else {
        recordingEntry = false;
        voiceBtn.classList.remove('recording');
        await stopRecordingEntry();
        showToast('Entry recorded.', 'success');
      }
    } catch (err) {
      console.error(err);
      recordingEntry = false;
      voiceBtn.classList.remove('recording');
      showToast('Could not record entry.', 'error');
    }
  });

  textBtn.addEventListener('click', async () => {
    const { action, text } = await openTextModal({
      title: 'New symptom entry',
      label: 'Describe your symptoms in your own words:',
      placeholder: 'For example: Since yesterday evening I have a pulsing headache around my temples…',
      sendLabel: 'Submit entry',
    });
    if (action !== 'send' || !text) return;
    try {
      await sendTextEntry(text);
      showToast('Entry submitted.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Could not submit entry.', 'error');
    }
  });
}

export function initSummaryUI() {
  const voiceBtn = document.getElementById('btn-summary-voice');
  const textBtn = document.getElementById('btn-summary-text');
  const summaryHtmlEl = document.getElementById('summary-html');
  const summaryInstructionEl = document.getElementById('summary-instruction');

  if (!voiceBtn || !textBtn || !summaryHtmlEl || !summaryInstructionEl) return;

  let recordingSummary = false;

  voiceBtn.addEventListener('click', async () => {
    try {
      if (!recordingSummary) {
        recordingSummary = true;
        voiceBtn.classList.add('recording');
        await startRecordingSummary();
        showToast('Recording summary instruction…', 'info');
      } else {
        recordingSummary = false;
        voiceBtn.classList.remove('recording');
        const html = await stopRecordingSummary();
        summaryHtmlEl.innerHTML = html || '<p class="placeholder">No summary returned.</p>';
        setState('summaryHtml', html);
        setState('latestSummaryInstruction', '(recorded instruction)');
        summaryInstructionEl.textContent = '(recorded instruction)';
        summaryInstructionEl.classList.remove('empty');
        showToast('Summary updated.', 'success');
      }
    } catch (err) {
      console.error(err);
      recordingSummary = false;
      voiceBtn.classList.remove('recording');
      showToast('Could not process summary recording.', 'error');
    }
  });

  textBtn.addEventListener('click', async () => {
    const { action, text } = await openTextModal({
      title: 'Summary instruction',
      label: 'How should the summary be phrased?',
      placeholder: 'For example: Focus on migraine-like headaches in the last 14 days and sleep disturbances.',
      sendLabel: 'Send instruction',
    });
    if (action !== 'send' || !text) return;

    try {
      const html = await sendTextSummary(text);
      summaryHtmlEl.innerHTML = html || '<p class="placeholder">No summary returned.</p>';
      setState('summaryHtml', html);
      setState('latestSummaryInstruction', text);
      summaryInstructionEl.textContent = text;
      summaryInstructionEl.classList.remove('empty');
      showToast('Summary updated.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Could not update summary.', 'error');
    }
  });
}
