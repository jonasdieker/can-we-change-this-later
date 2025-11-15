# Walnut Scribe

> A warm, clinical diary for tracking and analyzing medical symptoms with AI-powered insights

![Walnut Scribe](frontend/assets/icons/walnut.svg)

## Vision

**Walnut Scribe** empowers patients to take control of their health journey by providing an intuitive, AI-enhanced symptom tracking experience. Our mission is to bridge the communication gap between patients and healthcare providers by transforming scattered symptom observations into structured, medically-relevant summaries.

### Why Walnut Scribe?

- **Effortless Tracking**: Capture symptoms through voice or text in seconds
- **Intelligent Organization**: AI automatically structures your entries into a comprehensive symptom database
- **Visual Insights**: Interactive timeline visualization reveals patterns over time
- **Doctor-Ready Summaries**: Generate professional medical summaries for consultations with a single voice command or text instruction
- **Privacy-Focused**: Your health data stays local on your machine

### Perfect For

- Patients managing chronic conditions
- Pre-appointment preparation
- Tracking recovery progress
- Identifying symptom patterns and triggers
- Creating detailed medical histories

## Features

### 🎤 Voice & Text Entry
- Record symptoms naturally by speaking or typing
- Automatic transcription using OpenAI Whisper
- Background processing into structured data

### 📊 Interactive Timeline
- Visualize symptom intensity over time
- Color-coded symptom groups
- Click to view detailed descriptions
- Identify patterns and correlations

### 🤖 AI-Powered Summaries
- Generate medical summaries on demand
- Natural language instructions (e.g., "Focus on knee pain in the last 2 weeks")
- HTML-formatted output ready for sharing with healthcare providers
- Powered by GPT-4 for medically-relevant insights

### 🎨 Warm Clinical Design
- Calming, professional interface
- Accessibility-focused
- Mobile-responsive design

## Technology Stack

**Frontend**
- Vanilla JavaScript (ES6 Modules)
- Plotly.js for interactive visualizations
- PapaParse for CSV data handling
- Custom CSS with warm clinical theme

**Backend**
- Python 3.9+ with Flask
- OpenAI API (Whisper + GPT-4)
- sounddevice for audio recording
- pandas for data manipulation

## Quick Start

### Prerequisites
- Python 3.9 or higher
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Modern web browser (Chrome, Firefox, Safari)

### Installation

See [Installation_instructions.md](Installation_instructions.md) for detailed setup instructions.

**Quick version:**

1. **Clone the repository**
   ```bash
   git clone https://github.com/jonasdieker/can-we-change-this-later.git
   cd we-can-change-this-later
   ```

2. **Set up backend**
   ```bash
   python3 -m venv env
   source env/bin/activate
   pip install -r requirements.txt
   ```

3. **Configure API key**
   Create `config.yaml`:
   ```yaml
   openai_key: "your-openai-api-key-here"
   ```

4. **Create data files**
   ```bash
   mkdir -p data
   echo '[]' > data/recording_database.json
   ```

5. **Run the application**

   Terminal 1 - Backend:
   ```bash
   python3 main_backend.py
   ```

   Terminal 2 - Frontend:
   ```bash
   cd frontend
   python3 -m http.server 8000
   ```

6. **Open in browser**
   ```
   http://localhost:8000
   ```

## Usage

### Recording a Symptom Entry

1. Navigate to the **Home** tab
2. Click the **Voice entry** button or **Text entry** button
3. Speak naturally or type your symptoms
4. Walnut Scribe automatically transcribes and structures your entry

### Viewing Your Timeline

1. Navigate to the **Timeline** tab
2. View your symptom history as an interactive heatmap
3. Click any cell to see detailed information
4. Identify patterns in symptom intensity and frequency

### Generating a Summary

1. Navigate to the **Summary** tab
2. Click **Voice instruction** or **Text instruction**
3. Describe what you want summarized (e.g., "Create a summary for my doctor focusing on headaches")
4. Receive a professional HTML summary ready to share

## Project Structure

```
/
├── backend/
│   ├── app.py                      # Flask API endpoints
│   ├── utils.py                    # Configuration and database utilities
│   └── services/
│       ├── speech_to_text.py      # Whisper integration
│       ├── summarizer.py          # GPT-4 summarization
│       └── symptom_populator.py   # Recording → CSV transformation
├── frontend/
│   ├── index.html                  # Main application
│   ├── styles/                     # Modular CSS
│   ├── js/                         # ES6 JavaScript modules
│   ├── assets/icons/              # SVG icons
│   └── data/                      # Symptom database
├── data/                           # Runtime data (gitignored)
│   ├── recording_database.json    # Voice transcriptions
│   └── symptoms_database.csv      # Structured symptom data
├── main_backend.py                 # Backend entry point
├── requirements.txt                # Python dependencies
├── config.yaml                     # API configuration (gitignored)
└── README.md                       # This file
```

## API Endpoints

```
GET  http://127.0.0.1:5000/                              # Health check
POST http://127.0.0.1:5000/api/start-recording-entry    # Start voice entry
POST http://127.0.0.1:5000/api/stop-recording-entry     # Stop & transcribe
POST http://127.0.0.1:5000/api/start-recording-summary  # Start voice summary
POST http://127.0.0.1:5000/api/stop-recording-summary   # Stop & generate summary
POST http://127.0.0.1:5000/api/text-summary             # Text-based summary
```

## Data Format

### Symptom CSV Schema
```csv
symptom_id,recording_id,symptom_group,symptom_description,symptom_intensity
<sha256>,<id>,<group>,<description>,0-10
```

### Recording JSON Schema
```json
[
  {
    "entry_id": 1,
    "recording_date": "2025-11-15T09:24:00.000Z",
    "transcription": "I have knee pain when walking..."
  }
]
```

## Development

### Running Tests
*(Tests coming soon)*

### Contributing
This is a hackathon project. For contributions:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Known Limitations
- No user authentication (single-user application)
- Data stored locally only (no cloud sync)
- Requires manual OpenAI API key configuration
- Limited to one active recording session at a time

## Future Roadmap

- [ ] Multi-user support with authentication
- [ ] Cloud backup and synchronization
- [ ] Mobile app (iOS/Android)
- [ ] PDF export for summaries
- [ ] Medication tracking
- [ ] Appointment scheduling integration
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Offline support with service workers

## Privacy & Security

- **Local-first**: All data stored on your machine
- **No tracking**: No analytics or third-party services (except OpenAI API)
- **API security**: Your OpenAI API key never leaves your machine
- **HTTPS recommended**: Use HTTPS in production for API calls

## License

This project was created for the Nucleate Hackathon. See repository for license details.

## Acknowledgments

- Built for the Nucleate Hackathon Nov 2025
- Powered by OpenAI (Whisper & GPT-4)
- Visualization by Plotly.js
- Icons and design inspired by warm, accessible healthcare UX

## Support

- **Documentation**: See `claude.md` and `frontend/claude.md` for detailed technical documentation
- **Issues**: [GitHub Issues](https://github.com/jonasdieker/can-we-change-this-later/issues)
- **Questions**: Create an issue or discussion in the repository

---

Made with care for better patient-doctor communication 🌰
