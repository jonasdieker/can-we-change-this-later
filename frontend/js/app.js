import { initTabs } from './ui/tabs.js';
import { initHomeEntryUI, initSummaryUI } from './ui/speech_ui.js';
import { initTimeline } from './ui/timeline.js';
import { loadCsv } from './utils/csv_loader.js';
import { subscribe, setState } from './state.js';
import { showToast } from './ui/notifications.js';

async function bootstrap() {
  initTabs();
  initHomeEntryUI();
  initSummaryUI();

  try {
    const { rows, text } = await loadCsv('../data/symptoms_database.csv');
    setState('csvText', text);
    const csvStatus = document.getElementById('summary-csv-status');
    if (csvStatus) {
      csvStatus.textContent = `Loaded ${rows.length} records from symptom_database.csv`;
    }
    initTimeline('timeline-chart', rows);
  } catch (err) {
    console.error(err);
    const csvStatus = document.getElementById('summary-csv-status');
    if (csvStatus) {
      csvStatus.textContent = 'Failed to load CSV.';
      csvStatus.style.color = '#a43f3a';
    }
    showToast('Failed to load CSV data.', 'error');
  }

  subscribe('selectedSymptomGroup', (group) => {
    const el = document.getElementById('summary-selected-group');
    if (el) el.textContent = group || 'None selected';
  });

  subscribe('latestSummaryInstruction', (value) => {
    const el = document.getElementById('summary-instruction');
    if (!el) return;
    el.textContent = value || 'None yet';
    el.classList.toggle('empty', !value);
  });
}

document.addEventListener('DOMContentLoaded', bootstrap);
