// Timeline grid using Plotly scatter squares.

import { setState } from '../state.js';
import { formatDate, formatIntensity } from '../utils/formatter.js';
import { showToast } from './notifications.js';

/**
 * Initialize the timeline grid.
 * @param {string} containerId
 * @param {Array<object>} rows
 */
export function initTimeline(containerId, rows) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (typeof Plotly === 'undefined') {
    console.error('Plotly not available.');
    return;
  }

  // Aggregate by (date/recording_id, group) with max intensity.
  console.log('Timeline rows:', rows);
  console.log('First row sample:', rows[0]);

  const agg = new Map();
  for (const row of rows) {
    // Try to get date from various column names, or use recording_id as fallback
    const date = (
  row.recording_date ||
  row.symptome_date ||
  row.symptom_date ||
  ''
).toString().slice(0, 10);
    const group = row.symptom_group || 'Other';
    const intensity = Number(row.symptome_intensity ?? row.symptom_intensity ?? row.intensity ?? 0) || 0;
    const desc = row.symptome_description || row.symptom_description || '';

    console.log('Processing row:', { date, group, intensity, desc });

    if (!date || !group) {
      console.log('Skipping row - missing date or group:', { date, group });
      continue;
    }
    const key = `${date}__${group}`;
    const existing = agg.get(key);
    if (!existing || intensity > existing.intensity) {
      agg.set(key, { date, group, intensity, description: desc });
    }
  }

  const points = Array.from(agg.values());
  console.log('Aggregated points:', points);

  if (!points.length) {
    container.innerHTML = '<p class="placeholder">No symptom data to display.</p>';
    return;
  }

  // Get unique symptom groups and assign each a distinct color
  const uniqueGroups = [...new Set(points.map(p => p.group))];
  const groupColors = {
    // Define color palette for different symptom groups
    0: { r: 160, g: 124, b: 75 },   // Walnut brown
    1: { r: 79, g: 168, b: 163 },   // Teal
    2: { r: 206, g: 140, b: 94 },   // Warm orange
    3: { r: 93, g: 139, b: 82 },    // Green
    4: { r: 164, g: 63, b: 58 },    // Warm red
    5: { r: 120, g: 105, b: 160 },  // Purple
    6: { r: 180, g: 150, b: 50 },   // Gold
    7: { r: 75, g: 130, b: 150 },   // Blue-gray
  };

  const groupToColor = new Map();
  uniqueGroups.forEach((group, idx) => {
    const colorIdx = idx % Object.keys(groupColors).length;
    groupToColor.set(group, groupColors[colorIdx]);
  });

  // Group points by symptom group and sort by date
  const pointsByGroup = new Map();
  uniqueGroups.forEach(group => {
    const groupPoints = points
      .filter(p => p.group === group && p.intensity > 0)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    pointsByGroup.set(group, groupPoints);
  });

  // Create traces for each symptom group
  const traces = [];
  uniqueGroups.forEach((group, idx) => {
    const groupPoints = pointsByGroup.get(group);
    if (!groupPoints.length) return;

    const baseColor = groupToColor.get(group);
    const colorStr = `rgba(${baseColor.r},${baseColor.g},${baseColor.b},0.85)`;
    const lineColorStr = `rgba(${baseColor.r},${baseColor.g},${baseColor.b},0.4)`;

    const x = groupPoints.map(p => p.date);
    const y = groupPoints.map(p => p.group);
    const intensities = groupPoints.map(p => p.intensity);
    const sizes = groupPoints.map(p => 10 + (p.intensity / 10) * 30);

    traces.push({
      type: 'scatter',
      mode: 'lines+markers',
      x,
      y,
      text: intensities,
      customdata: groupPoints.map(p => [p.description, p.intensity, p.date]),
      line: {
        width: 2,
        color: lineColorStr,
      },
      marker: {
        symbol: 'square',
        size: sizes,
        color: colorStr,
        line: {
          width: 1.6,
          color: 'rgba(90, 78, 64, 0.5)',
        },
      },
      hovertemplate:
        '<b>%{y}</b><br>%{x}<br>Intensity: %{text}<extra></extra>',
    });
  });

  const layout = {
    margin: { l: 80, r: 10, t: 10, b: 30 },
    xaxis: {
      title: '',
      type: 'date',
      tickformat: '%b %d',
      gridcolor: 'rgba(214,206,194,0.5)',
      zeroline: false,
    },
    yaxis: {
      title: '',
      type: 'category',
      gridcolor: 'rgba(214,206,194,0.5)',
      zeroline: false,
    },
    paper_bgcolor: '#FFFDF8',
    plot_bgcolor: '#FFFDF8',
    hovermode: 'closest',
    showlegend: false,
  };

  const config = {
    responsive: true,
    displaylogo: false,
    displayModeBar: false,
  };

  Plotly.newPlot(container, traces, layout, config);

  container.on('plotly_click', (eventData) => {
    const point = eventData.points?.[0];
    if (!point) return;
    const date = point.x;
    const group = point.y;
    const [description, intensity] = point.customdata || [];

    if (!description) {
      console.log('No customdata found for point:', point);
      return;
    }

    updateDetails({ date, group, intensity, description });
    setState('selectedSymptomGroup', group);
    showToast(`Selected group: ${group}`, 'info', 2200);
  });
}

function updateDetails({ date, group, intensity, description }) {
  const placeholder = document.getElementById('details-placeholder');
  const list = document.getElementById('details-list');
  const dateEl = document.getElementById('detail-date');
  const groupEl = document.getElementById('detail-group');
  const intensityEl = document.getElementById('detail-intensity');
  const descEl = document.getElementById('detail-description');

  if (placeholder) placeholder.classList.add('hidden');
  if (list) list.classList.remove('hidden');

  if (dateEl) dateEl.textContent = formatDate(date);
  if (groupEl) groupEl.textContent = group;
  if (intensityEl) intensityEl.textContent = formatIntensity(intensity);
  if (descEl) descEl.textContent = description || 'No description.';
}
