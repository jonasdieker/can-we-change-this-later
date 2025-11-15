# Walnut Scribe - Frontend Documentation

## Overview
Walnut Scribe is a warm, clinical symptom diary application that allows users to track their health symptoms through voice or text entries. The frontend is a vanilla JavaScript SPA (Single Page Application) with a clean, modular architecture.

## Tech Stack
- **Pure JavaScript (ES6 Modules)** - No framework dependencies
- **CSS Variables** - Theme system with warm, clinical color palette
- **External Libraries**:
  - Plotly.js (v2.35.2) - Timeline visualization
  - PapaParse (v5.4.1) - CSV parsing
- **Fonts**: Google Fonts - Nunito (300, 400, 500, 600, 700)

## Project Structure

```
frontend/
├── index.html              # Main HTML entry point
├── styles/
│   ├── base.css           # Reset, typography, base elements
│   ├── theme.css          # CSS variables (colors, spacing, shadows)
│   ├── layout.css         # Page layout, grid, navigation
│   └── components.css     # Buttons, modals, toasts, cards
├── js/
│   ├── app.js             # Main entry point, bootstrap logic
│   ├── state.js           # Global state management
│   ├── ui/
│   │   ├── tabs.js        # Bottom navigation tab switching
│   │   ├── speech_ui.js   # Voice/text entry UI handlers
│   │   ├── modal.js       # Modal dialog component
│   │   ├── timeline.js    # Plotly timeline chart
│   │   └── notifications.js # Toast notification system
│   ├── backend/
│   │   ├── api.js         # Generic POST JSON helper
│   │   ├── entry_api.js   # Symptom entry API calls
│   │   └── summary_api.js # Summary generation API calls
│   └── utils/
│       ├── csv_loader.js  # PapaParse CSV loader
│       ├── formatter.js   # Date/text formatting utilities
│       └── events.js      # Custom event helpers
├── assets/
│   └── icons/             # SVG icons (walnut, book, timeline, etc.)
└── data/
    └── symptome_db.csv    # Sample symptom database
```

## Architecture

### Module System
- Uses ES6 modules (`type="module"`)
- Each feature is self-contained in its own module
- Clear separation between UI, backend communication, and utilities

### State Management (js/state.js)
- Simple pub-sub pattern for reactive updates
- Tracks:
  - `selectedSymptomGroup` - Currently selected symptom category
  - `latestSummaryInstruction` - Last summary instruction given
  - `csvText` - Raw CSV data for backend submission

### UI Components

#### 1. **Tab Navigation** (js/ui/tabs.js)
- Three main tabs: Home, Timeline, Summary
- Bottom navigation with circular icon buttons
- Tab switching handled via `.active` class toggle

#### 2. **Home Tab**
- Voice entry button (with recording animation)
- Text entry button
- Opens modal for text input or triggers speech recording

#### 3. **Timeline Tab** (js/ui/timeline.js)
- Plotly heatmap visualization
- Shows symptom intensity over time
- Clickable cells reveal detailed symptom information
- Grid: Days (x-axis) × Symptom Groups (y-axis)

#### 4. **Summary Tab**
- Voice or text instruction for AI summary
- Displays context (selected symptom group, CSV status)
- Renders HTML summary from backend

#### 5. **Modal System** (js/ui/modal.js)
- Reusable modal for text input
- Used for both symptom entries and summary instructions
- Promise-based API for easy async handling

#### 6. **Notifications** (js/ui/notifications.js)
- Toast messages (info, success, error)
- Auto-dismiss after 4 seconds
- Manual close option

### Backend Communication

All API calls follow a consistent pattern:

```javascript
// js/backend/entry_api.js
export async function submitEntry(method, text, csvText)

// js/backend/summary_api.js
export async function generateSummary(instruction, selectedGroup, csvText)
```

**Expected Backend Endpoints:**
- `POST /entry` - Submit symptom entry (voice or text)
  - Body: `{ method: "voice"|"text", text: string, csvText: string }`
- `POST /summary` - Generate summary
  - Body: `{ instruction: string, selectedGroup: string|null, csvText: string }`

### CSS Theme System

**Color Palette** (styles/theme.css):
- `--walnut`: #A07C4B (primary brand color)
- `--teal`: #4FA8A3 (accent color)
- `--cream`: #FFFDF8 (background alt)
- `--sand`: #E8DCC2 (warm neutral)
- `--text-main`: #3C3A36 (dark brown text)
- `--text-muted`: #7B7467 (subtle text)

**Design Tokens**:
- Border radius: 22px (lg), 16px (md), 10px (sm)
- Shadows: Soft, warm shadows with brown tones
- Transitions: 0.18s ease-out (fast, smooth)

## Key Features

### 1. Voice Recording
- Visual feedback: Walnut icon changes, button pulses
- Uses Web Speech API (implementation in speech_ui.js)
- Auto-transcription and submission

### 2. Timeline Visualization
- Plotly heatmap with custom styling
- Interactive hover and click events
- Opacity represents symptom intensity (0-10 scale)
- Groups symptoms by category

### 3. CSV Data Loading
- PapaParse handles CSV parsing
- Expected CSV format:
  ```csv
  date,symptom_group,intensity,description
  2025-01-15,Neurological,7,Headache and dizziness
  ```

### 4. Summary Generation
- AI-powered summary based on user instruction
- Contextual: Can filter by symptom group
- Returns HTML for medical documentation

## Common Issues & Troubleshooting

### Issue: CSS Not Loading (Current Problem)

**Symptoms**: HTML renders but no styling applied

**Likely Causes**:
1. **CORS/MIME Type Issues with ES Modules**
   - Live Server may have strict MIME type requirements
   - Solution: Use a proper local server (not just opening HTML file)

2. **Module Loading Errors**
   - Check browser console for CORS errors
   - Modules require HTTP/HTTPS protocol (not `file://`)

**Solutions**:

#### Option 1: Use Live Server Correctly
```bash
# If using VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
# Ensure it opens as http://127.0.0.1:5500/index.html
```

#### Option 2: Use Python HTTP Server
```bash
cd /Users/pan/Desktop/NucleateHackathonGit/frontend
python3 -m http.server 8000
# Open: http://localhost:8000
```

#### Option 3: Use Node.js http-server
```bash
npx http-server -p 8000
# Open: http://localhost:8000
```

#### Option 4: Disable CORS (Chrome only, for development)
```bash
# macOS
open -na "Google Chrome" --args --disable-web-security --user-data-dir="/tmp/chrome_dev"
```

### Debugging Steps:
1. Open browser DevTools (F12 or Cmd+Opt+I)
2. Check **Console** for JavaScript errors (especially module loading)
3. Check **Network** tab:
   - Verify CSS files load (200 status)
   - Check if .js modules load (should be `application/javascript` MIME type)
4. Check **Elements** tab:
   - Verify `<link>` tags in `<head>`
   - Check if styles are applied to elements

## Development Workflow

### Running the App
1. Ensure backend is running (see ../backend/README.md)
2. Start local development server (see solutions above)
3. Open browser to http://localhost:8000 (or appropriate port)

### Making Changes

**CSS Changes**:
- Edit appropriate file in `styles/`
- Changes should hot-reload with Live Server

**JavaScript Changes**:
- ES modules reload automatically
- Check console for errors after changes

**Adding New Features**:
1. Create module in appropriate directory (`ui/`, `backend/`, `utils/`)
2. Import in `app.js` or relevant parent module
3. Initialize in `bootstrap()` function if needed

## API Integration

The frontend expects a backend with these endpoints:

### POST /entry
Submit a new symptom entry (voice or text).

**Request**:
```json
{
  "method": "voice" | "text",
  "text": "I have a headache and feel dizzy",
  "csvText": "<current CSV contents>"
}
```

**Response**: Text or JSON confirmation

### POST /summary
Generate a medical summary.

**Request**:
```json
{
  "instruction": "Summarize neurological symptoms for the past week",
  "selectedGroup": "Neurological" | null,
  "csvText": "<current CSV contents>"
}
```

**Response**: HTML string (rendered in summary tab)

## Browser Compatibility
- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- ES6 module support required
- Web Speech API (for voice features)
- Plotly.js (loaded via CDN)

## Future Improvements
- [ ] Offline support (Service Worker)
- [ ] Export summary as PDF
- [ ] Voice playback of entries
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Progressive Web App (PWA) installability

## Resources
- [ES6 Modules Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Plotly.js Documentation](https://plotly.com/javascript/)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [PapaParse Docs](https://www.papaparse.com/docs)
