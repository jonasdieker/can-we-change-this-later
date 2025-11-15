# Installation Instructions - Walnut Scribe

Complete step-by-step guide to set up and run Walnut Scribe on your local machine.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [Running the Application](#running-the-application)
4. [Verification](#verification)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

1. **Python 3.9 or higher**
   - Check version: `python3 --version`
   - Download: [python.org](https://www.python.org/downloads/)

2. **pip (Python package manager)**
   - Usually comes with Python
   - Check version: `pip3 --version`

3. **Modern Web Browser**
   - Chrome 90+, Firefox 88+, or Safari 14+
   - Must support ES6 modules

4. **OpenAI API Key**
   - Sign up at [OpenAI Platform](https://platform.openai.com/)
   - Generate an API key from [API Keys page](https://platform.openai.com/api-keys)
   - Ensure you have credits available (Whisper + GPT-4 usage)

### Optional (Recommended)

- **Git** for cloning the repository
- **VS Code** with Live Server extension (alternative to Python HTTP server)

---

## Installation Steps

### Step 1: Clone or Download the Repository

**Option A: Using Git**
```bash
git clone https://github.com/jonasdieker/can-we-change-this-later.git
cd NucleateHackathonGit
```

**Option B: Download ZIP**
1. Download the repository as ZIP
2. Extract to your desired location
3. Navigate to the folder in terminal

### Step 2: Activate Python Virtual Environment

The project includes a pre-configured virtual environment:

**macOS/Linux:**
```bash
source enf_hackathon/bin/activate
```

**Windows:**
```bash
enf_hackathon\Scripts\activate
```

You should see `(enf_hackathon)` in your terminal prompt.

### Step 3: Install Python Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- Flask (web framework)
- openai (API client)
- sounddevice (audio recording)
- numpy (audio processing)
- pandas (data manipulation)
- PyYAML (configuration)
- scipy (audio utilities)

### Step 4: Create Configuration File

Create a file named `config.yaml` in the project root directory:

```bash
touch config.yaml
```

Edit `config.yaml` and add your OpenAI API key:

```yaml
openai_key: "sk-proj-your-actual-api-key-here"
```

⚠️ **Important:** Replace `sk-proj-your-actual-api-key-here` with your real OpenAI API key.

### Step 5: Create Required Data Directories and Files

```bash
# Create data directory if it doesn't exist
mkdir -p data

# Create empty recording database
echo '[]' > data/recording_database.json

# Create empty symptoms database (if not already present)
touch data/symptoms_database.csv
```

**Optional:** Copy sample data
```bash
# If you want to start with sample data
cp frontend/data/symptom_database.csv data/symptoms_database.csv
```

---

## Running the Application

You need to run **two servers simultaneously**: one for the backend (Python Flask) and one for the frontend (static file server).

### Terminal 1: Start the Backend Server

1. **Ensure virtual environment is activated**
   ```bash
   source enf_hackathon/bin/activate  # macOS/Linux
   # OR
   enf_hackathon\Scripts\activate     # Windows
   ```

2. **Run the Flask backend**
   ```bash
   python3 main_backend.py
   ```

3. **Expected output:**
   ```
   * Serving Flask app 'backend.app'
   * Debug mode: on
   WARNING: This is a development server. Do not use it in a production deployment.
   * Running on http://127.0.0.1:5000
   Press CTRL+C to quit
   ```

4. **Keep this terminal running**

### Terminal 2: Start the Frontend Server

Open a **new terminal window/tab** in the same project directory.

**Option A: Python HTTP Server (Recommended)**
```bash
cd frontend
python3 -m http.server 8000
```

Expected output:
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

**Option B: VS Code Live Server**
1. Install "Live Server" extension in VS Code
2. Right-click `frontend/index.html`
3. Select "Open with Live Server"
4. It will open on `http://127.0.0.1:5500` (default)

**Option C: Node.js http-server**
```bash
cd frontend
npx http-server -p 8000
```

### Step 3: Open in Browser

Navigate to:
```
http://localhost:8000
```

Or if using VS Code Live Server:
```
http://127.0.0.1:5500
```

---

## Verification

### Backend Health Check

Test if the backend is running:

**Option 1: Browser**
- Open `http://127.0.0.1:5000/` in your browser
- You should see a JSON response like: `{"status": "ok"}`

**Option 2: Terminal**
```bash
curl http://127.0.0.1:5000/
```

### Frontend Check

1. Open the application in your browser
2. You should see:
   - **Home tab**: Walnut icon with "Voice entry" and "Text entry" buttons
   - **Timeline tab**: Interactive chart (if sample data loaded)
   - **Summary tab**: "Voice instruction" and "Text instruction" buttons

### API Integration Check

1. Navigate to the **Home** tab
2. Click **Text entry**
3. Type a test symptom (e.g., "Slight headache this morning")
4. Submit
5. Check for:
   - Green success toast: "Entry submitted"
   - Backend terminal shows POST request
6. Navigate to **Timeline** to see if entry appears (may take a moment)

---

## Troubleshooting

### Issue: "ModuleNotFoundError" when running backend

**Solution:**
```bash
# Ensure virtual environment is activated
source enf_hackathon/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: "CSS not loading" or "Module not found" in browser

**Cause:** Using `file://` protocol instead of HTTP server

**Solution:**
- Always use an HTTP server (Python, Live Server, etc.)
- Never open `index.html` directly by double-clicking
- Ensure you're accessing via `http://localhost:8000` or similar

### Issue: "OpenAI API error" or "Unauthorized"

**Possible causes:**
1. Invalid API key in `config.yaml`
2. API key has no credits
3. `config.yaml` not in project root

**Solution:**
```bash
# Check config.yaml exists
ls -la config.yaml

# Verify API key format (should start with sk-proj- or sk-)
cat config.yaml

# Test API key directly
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Issue: Backend starts but API calls fail (404 or CORS errors)

**Cause:** Frontend trying to call wrong URL

**Solution:**
- Check that backend is running on `http://127.0.0.1:5000`
- Verify API endpoints in browser console (F12 → Network tab)
- Ensure all frontend API calls use `http://127.0.0.1:5000/api/...`

### Issue: "Port already in use"

**For Backend (Port 5000):**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port
# Edit main_backend.py and change port number
```

**For Frontend (Port 8000):**
```bash
# Use a different port
python3 -m http.server 8001
```

### Issue: No audio recording / microphone not working

**Solutions:**
1. **Grant microphone permissions** in browser settings
2. **macOS:** System Preferences → Security & Privacy → Microphone
3. **Windows:** Settings → Privacy → Microphone
4. **Check sounddevice:**
   ```bash
   python3 -c "import sounddevice; print(sounddevice.query_devices())"
   ```

### Issue: Timeline not showing data

**Possible causes:**
1. CSV file is empty or missing
2. CSV format is incorrect
3. Path to CSV is wrong

**Solution:**
```bash
# Check if CSV exists and has data
cat frontend/data/symptom_database.csv

# Check backend data folder
ls -la data/

# Copy sample data if needed
cp frontend/data/symptom_database.csv data/symptoms_database.csv
```

### Issue: Summary generation fails

**Possible causes:**
1. No symptom data in database
2. OpenAI API quota exceeded
3. Network connectivity issues

**Solution:**
1. Check backend terminal for error messages
2. Verify OpenAI API credits: [OpenAI Usage Dashboard](https://platform.openai.com/usage)
3. Test with text summary first (simpler than voice)

---

## System-Specific Notes

### macOS

- If you get "command not found: python3", try `python` instead
- For microphone access, check System Preferences → Security & Privacy
- If sounddevice installation fails, install PortAudio:
  ```bash
  brew install portaudio
  pip install sounddevice
  ```

### Windows

- Use `python` instead of `python3` in most cases
- Activate virtual environment with: `enf_hackathon\Scripts\activate`
- If sounddevice fails, install Visual C++ Build Tools

### Linux

- Install system dependencies:
  ```bash
  sudo apt-get install python3-dev portaudio19-dev
  ```
- For ALSA audio errors, install: `sudo apt-get install libasound2-dev`

---

## Next Steps

After successful installation:

1. **Read the full documentation:**
   - `README.md` - Project overview and vision
   - `claude.md` - Technical documentation
   - `frontend/claude.md` - Frontend architecture details

2. **Try the features:**
   - Record a voice symptom entry
   - Add text entries
   - View the timeline
   - Generate an AI summary

3. **Customize:**
   - Modify CSS in `frontend/styles/` for your preferred theme
   - Adjust symptom categories in the backend logic

4. **Explore the code:**
   - Backend API: `backend/app.py`
   - Frontend entry point: `frontend/js/app.js`
   - AI services: `backend/services/`

---

## Production Deployment Notes

⚠️ **This setup is for development only.** For production:

1. Use a production WSGI server (Gunicorn, uWSGI)
2. Enable HTTPS for all connections
3. Add authentication and user management
4. Use environment variables for API keys (not `config.yaml`)
5. Implement proper database (PostgreSQL, MongoDB)
6. Add rate limiting and request validation
7. Set up proper CORS policies
8. Use a production frontend build process

---

## Support

If you encounter issues not covered here:

1. Check the browser console (F12) for JavaScript errors
2. Check the backend terminal for Python errors
3. Review `claude.md` for detailed technical information
4. Create an issue on GitHub with:
   - Your OS and Python version
   - Error messages (full stack trace)
   - Steps to reproduce

---

**Happy tracking! 🌰**
