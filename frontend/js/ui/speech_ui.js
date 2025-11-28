// Speech and text UI wiring for Home (entries) and Summary (instructions).

import { openTextModal } from './modal.js';
import { startRecordingEntry, stopRecordingEntry, sendTextEntry } from '../backend/entry_api.js';
import { startRecordingSummary, stopRecordingSummary, sendTextSummary } from '../backend/summary_api.js';
import { setState } from '../state.js';
import { showToast } from './notifications.js';
import { showEntryChatOverlay } from './entry_chat.js';
import { loadCsv } from '../utils/csv_loader.js';
import { initTimeline } from './timeline.js';

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
        voiceBtn.classList.add('processing');
        voiceBtn.disabled = true;
        showToast('Processing entry…', 'info');

        try {
          const result = await stopRecordingEntry();
          voiceBtn.classList.remove('processing');
          voiceBtn.disabled = false;
          showToast('Entry recorded.', 'success');

          // Show chat overlay with transcription
          const transcription = result?.transcription || result?.text || 'Entry recorded successfully';
          showEntryChatOverlay(transcription);

          // Automatically reload timeline data without full page refresh
          console.log('Reloading timeline data...');
          setTimeout(async () => {
            try {
              console.log('Fetching CSV from backend...');
              const { rows, text } = await loadCsv('http://127.0.0.1:5000/api/symptoms-csv');
              console.log('CSV loaded, rows count:', rows.length);
              console.log('First few rows:', rows.slice(0, 3));
              setState('csvText', text);
              console.log('Reinitializing timeline...');
              initTimeline('timeline-chart', rows);
              console.log('Timeline reloaded with new data');
              showToast('Timeline updated!', 'info');
            } catch (err) {
              console.error('Failed to reload timeline:', err);
              console.error('Error details:', err.message, err.stack);
            }
          }, 3000); // Wait 3 seconds for backend to finish saving
        } catch (stopErr) {
          console.error('Error stopping recording:', stopErr);
          voiceBtn.classList.remove('processing');
          voiceBtn.disabled = false;
          showToast('Error processing entry.', 'error');
        }
      }
    } catch (err) {
      console.error('Voice entry error:', err);
      console.error('Error stack:', err.stack);
      recordingEntry = false;
      voiceBtn.classList.remove('recording', 'processing');
      voiceBtn.disabled = false;
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
      showToast('Processing entry…', 'info');
      await sendTextEntry(text);
      showToast('Entry submitted.', 'success');

      // Show chat overlay with the entered text
      showEntryChatOverlay(text);

      // Automatically reload timeline data
      setTimeout(async () => {
        try {
          const { rows, text: csvText } = await loadCsv('http://127.0.0.1:5000/api/symptoms-csv');
          setState('csvText', csvText);
          initTimeline('timeline-chart', rows);
          console.log('Timeline reloaded with new data');
        } catch (err) {
          console.error('Failed to reload timeline:', err);
        }
      }, 2000);
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
        voiceBtn.classList.add('processing');
        voiceBtn.disabled = true;
        showToast('Generating summary…', 'info');
        const html = await stopRecordingSummary();
        voiceBtn.classList.remove('processing');
        voiceBtn.disabled = false;
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
      voiceBtn.classList.remove('recording', 'processing');
      voiceBtn.disabled = false;
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
      showToast('Generating summary…', 'info');
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

export function initExportPDF() {
  const exportBtn = document.getElementById('btn-export-pdf');
  const summaryHtmlEl = document.getElementById('summary-html');

  if (!exportBtn || !summaryHtmlEl) return;

  exportBtn.addEventListener('click', () => {
    const summaryContent = summaryHtmlEl.innerHTML;

    // Check if there's actual content (not just placeholder)
    if (!summaryContent || summaryContent.includes('No summary yet')) {
      showToast('No summary to export. Generate a summary first.', 'error');
      return;
    }

    // Create a printable window with the summary
    const printWindow = window.open('', '_blank');
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Walnut Scribe - Medical Summary</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            color: #2D2520;
            line-height: 1.6;
          }
          h1, h2, h3, h4 {
            color: #F09200;
            margin-top: 1.5em;
          }
          h1 { font-size: 24px; border-bottom: 2px solid #F09200; padding-bottom: 10px; }
          h2 { font-size: 20px; }
          h3 { font-size: 18px; }
          p { margin: 1em 0; }
          ul, ol { margin: 1em 0; padding-left: 2em; }
          table { border-collapse: collapse; width: 100%; margin: 1em 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #FFF9F0; color: #F09200; font-weight: 600; }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #F09200;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #8B7355;
            text-align: center;
          }
          @media print {
            body { margin: 0; padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Walnut Scribe</h1>
          <p style="color: #8B7355; font-size: 14px;">Medical Symptom Summary</p>
          <p style="font-size: 12px; color: #8B7355;">Generated: ${new Date().toLocaleString()}</p>
        </div>
        ${summaryContent}
        <div class="footer">
          <p>Generated with Walnut Scribe - A warm, clinical diary for your symptoms</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load, then trigger print dialog
    printWindow.onload = () => {
      printWindow.print();
    };

    showToast('Opening print dialog for PDF export...', 'info', 2500);
  });
}

export function initSendToDoctor() {
  const sendBtn = document.getElementById('btn-send-doctor');
  const summaryHtmlEl = document.getElementById('summary-html');

  if (!sendBtn || !summaryHtmlEl) return;

  sendBtn.addEventListener('click', () => {
    const summaryContent = summaryHtmlEl.innerHTML;

    // Check if there's actual content (not just placeholder)
    if (!summaryContent || summaryContent.includes('No summary yet')) {
      showToast('No summary to send. Generate a summary first.', 'error');
      return;
    }

    // Placeholder: This feature is not yet implemented
    showToast('Send to Doctor feature coming soon!', 'info', 3000);

    // TODO: Implement email or secure messaging integration
    // Could integrate with:
    // - Email (mailto: link with summary)
    // - FHIR API for EHR integration
    // - Secure messaging service
    // - Practice management system API
  });
}
