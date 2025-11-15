from flask import Flask, jsonify, request

from backend.services.speech_to_text import SimpleOpenAIWhisper
from backend.services.summarizer import Summarizer
from backend.services.symptom_transformer import symptom_transformer
from backend.utils import (get_patient_record, write_patient_record,
                           write_symptoms)

app = Flask(__name__)

# Global whisper instance
tts = None
summarizer = None
symptom_transformer_instance = None

def get_stt_instance():
    """Get or create whisper instance."""
    global tts
    if tts is None:
        try:
            tts = SimpleOpenAIWhisper()
        except Exception as e:
            raise Exception(f"Failed to initialize Whisper: {str(e)}")
    return tts

def get_symptom_transformer():
    """Get or create symptom transformer instance."""
    global symptom_transformer_instance
    if symptom_transformer_instance is None:
        try:
            symptom_transformer_instance = symptom_transformer()
        except Exception as e:
            raise Exception(f"Failed to initialize Symptom Transformer: {str(e)}")
    return symptom_transformer_instance

def get_summarizer():
    """Get or create summarizer instance."""
    global summarizer
    if summarizer is None:
        try:
            summarizer = Summarizer()
        except Exception as e:
            raise Exception(f"Failed to initialize Summarizer: {str(e)}")
    return summarizer

@app.route("/", methods=['GET'])
def home():
    return "Welcome to the Speech-to-Text API!"

@app.route('/api/start-recording-entry', methods=['POST'])
def start_recording_entry():
    """Start recording audio from microphone."""
    try:
        stt_instance = get_stt_instance()
        result = stt_instance.start_recording()
        
        if result["status"] == "success":
            return jsonify(result), 200
        else:
            return jsonify(result), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    
@app.route('/api/start-recording-summary', methods=['POST'])
def start_recording_summary():
    """Start recording audio from microphone."""
    try:
        stt_instance = get_stt_instance()
        result = stt_instance.start_recording()
        
        if result["status"] == "success":
            return jsonify(result), 200
        else:
            return jsonify(result), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/stop-recording-entry', methods=['POST'])
def stop_recording_entry():
    """Stop recording and transcribe the audio."""
    try:
        stt_instance = get_stt_instance()
        result = stt_instance.stop_recording()

        patient_id = request.args.get("patient_id", "patient_123")  # Example patient ID
        
        if result["status"] == "success":
            patient_record = get_patient_record("data/patient_data.json", patient_id)
            patient_record.append(result["transcription"])
            write_patient_record("data/patient_data.json", patient_id, patient_record)
            return jsonify(result), 200
        else:
            return jsonify(result), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/stop-recording-summary', methods=['POST'])
def stop_recording_summary():
    """Stop recording and transcribe the audio."""
    try:
        stt_instance = get_stt_instance()
        result = stt_instance.stop_recording()
        
        if result["status"] == "success":
            symptom_transformer_instance = get_symptom_transformer()
            write_symptoms("data/patient_data.json", symptom_transformer_instance)
            summarizer_instance = get_summarizer()
            summary = summarizer_instance.summarize(result["transcription"], patient_record=get_patient_record("data/patient_data.json"))
            result["summary"] = summary
            return jsonify(result), 200
        else:
            return jsonify(result), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    
@app.route('/api/text-summary', methods=['GET'])
def text_summary():
    """A placeholder endpoint for symptom transformation."""
    try:
        symptoms = symptom_transformer()
        return jsonify({
            "status": "success",
            "symptoms": symptoms
        }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
