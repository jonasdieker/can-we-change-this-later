import os

from flask import Flask, jsonify

from backend.services.speech_to_text import SimpleOpenAIWhisper

app = Flask(__name__)

# Global whisper instance
whisper = None

def get_whisper_instance():
    """Get or create whisper instance."""
    global whisper
    if whisper is None:
        try:
            whisper = SimpleOpenAIWhisper()
        except Exception as e:
            raise Exception(f"Failed to initialize Whisper: {str(e)}")
    return whisper

@app.route("/", methods=['GET'])
def home():
    return "Welcome to the Speech-to-Text API!"

@app.route('/api/start-recording', methods=['POST'])
def start_recording():
    """Start recording audio from microphone."""
    try:
        whisper_instance = get_whisper_instance()
        result = whisper_instance.start_recording()
        
        if result["status"] == "success":
            return jsonify(result), 200
        else:
            return jsonify(result), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/stop-recording', methods=['POST'])
def stop_recording():
    """Stop recording and transcribe the audio."""
    try:
        whisper_instance = get_whisper_instance()
        result = whisper_instance.stop_recording()
        
        if result["status"] == "success":
            return jsonify(result), 200
        else:
            return jsonify(result), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/recording-status', methods=['GET'])
def recording_status():
    """Check if currently recording."""
    try:
        whisper_instance = get_whisper_instance()
        return jsonify({
            "status": "success",
            "is_recording": whisper_instance.is_recording
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
