# Walnut Scribe - Medical Symptom Tracking Application

## Project Overview

**Walnut Scribe** is a full-stack web application for tracking and analyzing medical symptoms, developed for the Nucleate Hackathon. It enables users to record symptoms via voice or text, visualize symptom patterns over time, and generate AI-powered medical summaries for healthcare consultations.

### Key Features
- Voice and text symptom entry with AI transcription (OpenAI Whisper)
- Interactive timeline visualization of symptom history (Plotly.js)
- AI-powered medical summaries (GPT-4)
- Structured symptom database with intensity tracking (0-10 scale)

## Architecture

### Technology Stack

**Backend**
- Python 3.9.6
- Flask (REST API)
- OpenAI API (Whisper for speech-to-text, GPT-4/GPT-5.1 for summarization)
- sounddevice, numpy (audio processing)
- pandas (data manipulation)
- PyYAML (configuration)

**Frontend**
- Vanilla JavaScript (ES6 Modules)
- Plotly.js v2.35.2 (visualization)
- PapaParse v5.4.1 (CSV parsing)
- Pure CSS with custom design system

## Directory Structure

```
/
├── backend/
│   ├── app.py                      # Main Flask application
│   ├── utils.py                    # Utilities (config, DB operations)
│   └── services/
│       ├── speech_to_text.py      # OpenAI Whisper integration
│       ├── summarizer.py          # GPT-4 summarization
│       └── symptom_populator.py   # Transform recordings to CSV
├── frontend/
│   ├── index.html                  # Main entry point
│   ├── claude.md                   # Frontend-specific documentation
│   ├── styles/                     # Modular CSS
│   │   ├── base.css
│   │   ├── theme.css
│   │   ├── layout.css
│   │   └── components.css
│   ├── js/                         # ES6 modular JavaScript
│   │   ├── app.js                 # Application bootstrap
│   │   ├── state.js               # Global state management
│   │   ├── ui/                    # UI components
│   │   ├── backend/               # API communication layer
│   │   └── utils/                 # Utility modules
│   ├── assets/icons/              # SVG icons
│   └── data/
│       └── symptom_database.csv   # Structured symptom records
├── enf_hackathon/                  # Python virtual environment
├── main_backend.py                 # Backend entry point
├── requirements.txt                # Python dependencies
└── config.yaml                     # Configuration (gitignored)
```

## Setup Instructions

### Prerequisites
- Python 3.9+
- OpenAI API key
- Modern web browser with ES6 support

### Backend Setup

1. **Activate virtual environment**:
   ```bash
   source enf_hackathon/bin/activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Create configuration file** (`config.yaml`):
   ```yaml
   openai_key: "your-openai-api-key-here"
   ```

4. **Create required data files**:
   ```bash
   mkdir -p data
   echo '[]' > data/recording_database.json
   ```

5. **Run the backend server**:
   ```bash
   python main_backend.py
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Start HTTP server** (required for ES6 modules):
   ```bash
   cd frontend
   python3 -m http.server 8000
   ```

2. **Open in browser**:
   ```
   http://localhost:8000
   ```

Note: Must use HTTP server, not `file://` protocol due to CORS/MIME type requirements.

## API Endpoints

### Backend API (Flask)

```
GET  http://127.0.0.1:5000/                              # Health check
POST http://127.0.0.1:5000/api/start-recording-entry    # Start voice symptom entry
POST http://127.0.0.1:5000/api/stop-recording-entry     # Stop recording & transcribe
POST http://127.0.0.1:5000/api/start-recording-summary  # Start voice summary instruction
POST http://127.0.0.1:5000/api/stop-recording-summary   # Stop recording & generate summary
POST http://127.0.0.1:5000/api/text-summary             # Generate summary from text
```

### Request/Response Examples

**POST http://127.0.0.1:5000/api/start-recording-entry**
```json
Response: {
  "status": "recording",
  "message": "Recording started"
}
```

**POST http://127.0.0.1:5000/api/stop-recording-entry**
```json
Request: {
  "recording_date": "2025-11-15T09:24:00.000Z"
}

Response: {
  "status": "success",
  "transcription": "I have knee pain when walking..."
}
```

**POST http://127.0.0.1:5000/api/text-summary**
```json
Request: {
  "summary_text": "Summarize my knee pain symptoms"
}

Response: {
  "status": "success",
  "summary": "<html>AI-generated medical summary</html>"
}
```

## Data Models

### Symptom CSV Format (`symptom_database.csv`)
```csv
symptom_id,recording_id,symptom_group,symptom_description,symptom_intensity
<sha256>,<id>,<group>,<description>,0-10
```

Fields:
- `symptom_id`: SHA-256 hash identifier
- `recording_id`: Links to recording entry
- `symptom_group`: Category (e.g., "knee", "headache", "sleep")
- `symptom_description`: Detailed description
- `symptom_intensity`: 0-10 severity scale

### Recording Database (`recording_database.json`)
```json
[
  {
    "entry_id": 1,
    "recording_date": "2025-11-15T09:24:00.000Z",
    "transcription": "I have knee pain when walking..."
  }
]
```

## Key Components

### 1. Home Tab - Symptom Entry
- **Voice Entry**: Record via microphone with real-time feedback
  - OpenAI Whisper transcription
  - Stored in JSON recording database
- **Text Entry**: Manual symptom description via modal

### 2. Timeline Tab - Visualization
- **Interactive Plotly Timeline**: Heatmap-style grid
  - X-axis: Dates
  - Y-axis: Symptom groups
  - Color-coded by symptom type
  - Size/opacity reflects intensity
- **Detail View**: Click cells for full symptom information

### 3. Summary Tab - AI Reports
- Voice or text instructions for summary generation
- GPT-4 analyzes patient history
- Returns HTML-formatted medical summary

## File Reference Guide

### Critical Backend Files
- `backend/app.py:1-200` - Flask API endpoints, request handling
- `backend/services/speech_to_text.py:1-100` - Audio recording, Whisper API
- `backend/services/summarizer.py:1-80` - GPT-4 summarization logic
- `backend/services/symptom_populator.py:1-150` - JSON to CSV transformation
- `backend/utils.py:1-100` - Configuration loading, database utilities

### Critical Frontend Files
- `frontend/index.html:1-100` - Main HTML structure, tab navigation
- `frontend/js/app.js:1-50` - Bootstrap, event listeners, initialization
- `frontend/js/state.js:1-50` - Pub-sub state management
- `frontend/js/ui/timeline.js:1-250` - Plotly visualization logic
- `frontend/js/ui/speech_ui.js:1-150` - Voice/text entry handlers
- `frontend/js/backend/entry_api.js:1-50` - API calls for symptom entry
- `frontend/js/backend/summary_api.js:1-50` - API calls for summaries

### Configuration Files
- `requirements.txt:1-20` - Python dependencies
- `main_backend.py:1-30` - Backend entry point
- `config.yaml` - OpenAI API key (gitignored, must create)

## Design System

### Color Palette (Warm Clinical Theme)
```css
--walnut: #A07C4B       /* Primary brand */
--teal: #4FA8A3         /* Accent */
--cream: #FFFDF8        /* Background */
--sand: #E8DCC2         /* Warm neutral */
--text-main: #3C3A36    /* Dark brown text */
```

### Spacing & Sizing
- Border radius: 22px (large), 16px (medium), 10px (small)
- Transitions: 0.18s ease-out
- Font: Nunito (Google Fonts)

## Development Workflow

### Adding a New Symptom Entry Method
1. Update `frontend/js/ui/speech_ui.js` - Add UI handler
2. Create API endpoint in `backend/app.py`
3. Add service logic in `backend/services/`
4. Test with both voice and text inputs

### Modifying the Timeline Visualization
1. Edit `frontend/js/ui/timeline.js` - Update Plotly configuration
2. Adjust CSS in `frontend/styles/components.css` if needed
3. Update data loading in `frontend/js/utils/csv_loader.js`

### Adding a New AI Feature
1. Add OpenAI API call in `backend/services/`
2. Create Flask endpoint in `backend/app.py`
3. Add frontend API wrapper in `frontend/js/backend/`
4. Connect to UI in `frontend/js/ui/`

## Known Issues & Limitations

### API Endpoint Mismatch
- Frontend documentation suggests `/entry` and `/summary` endpoints
- Backend actually uses `/api/start-recording-entry`, etc.
- May need reconciliation for consistency

### Configuration Requirements
- `config.yaml` must be created manually (not in repo)
- `data/` directory and files must exist
- OpenAI API key required for all AI features

### Browser Compatibility
- Requires ES6 module support
- Must use HTTP/HTTPS (not file://)
- Tested on modern Chrome/Firefox

## Testing

Currently no automated tests are present. To test manually:

1. **Voice Entry**: Click microphone, speak, verify transcription
2. **Text Entry**: Click text icon, type, submit
3. **Timeline**: Check CSV loads, cells render, tooltips work
4. **Summary**: Test both voice and text summary generation

## Repository Information

- **GitHub**: https://github.com/jonasdieker/can-we-change-this-later
- **Branch**: main
- **Type**: Hackathon project (Nucleate Hackathon)

## Recent Development Activity

Based on git history:
1. Symptom populator functionality
2. Frontend UI refinement
3. Summarizer service integration
4. Merge conflict resolutions
5. Initial backend/frontend setup

## Future Improvements

- Add comprehensive test suite (pytest, Jest)
- Implement error logging/monitoring
- Add Docker containerization
- Create proper README.md
- Standardize API endpoint naming
- Add user authentication
- Implement data export features
- Add symptom analytics/insights

## Contributing

For hackathon team members:
1. Create feature branch from `main`
2. Make changes, commit with descriptive messages
3. Create PR for review
4. Ensure API endpoints match frontend expectations

## Troubleshooting

### "Module not found" errors
- Ensure using HTTP server, not file:// protocol
- Check browser console for CORS errors

### OpenAI API errors
- Verify `config.yaml` exists with valid API key
- Check API key has sufficient credits

### Data not loading
- Ensure `data/recording_database.json` exists
- Check `frontend/data/symptom_database.csv` is accessible
- Verify backend is running on port 5000

### Timeline not rendering
- Check CSV format matches expected schema
- Open browser console for JavaScript errors
- Verify Plotly.js CDN is loading

## Additional Documentation

- See `frontend/claude.md` for detailed frontend architecture
- Check inline comments in `backend/services/` for AI service details
- Review `frontend/js/state.js` for state management patterns
