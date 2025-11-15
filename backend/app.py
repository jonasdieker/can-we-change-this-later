from datetime import datetime
from pathlib import Path

import pandas as pd
from flask import Flask, jsonify, request

from backend.services.speech_to_text import SimpleOpenAIWhisper
from backend.services.summarizer import Summarizer
from backend.services.symptom_populator import symptom_transformer
from backend.utils import (get_patient_record, load_config,
                           write_patient_record, write_symptoms, get_symptoms)

from flask_cors import CORS

app = Flask(__name__)

CORS(app)

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
        
        if result["status"] == "success":
            patient_record = get_patient_record("data/recording_database.json")
            entry = {
                "entry_id": patient_record[-1]["entry_id"] + 1 if patient_record else 1,
                "recording_date": datetime.now().isoformat(),
                "transcription": result["transcription"]
            }
            patient_record.append(entry)
            write_patient_record("data/recording_database.json", patient_record)

            len_diff = len(patient_record) - len(get_symptoms("data/symptoms_database.csv"))

            symptoms = symptom_transformer(patient_record[-len_diff:], api_key=load_config("config.yaml").get("openai_key"))
            combined_symptoms = pd.concat([get_symptoms("data/symptoms_database.csv"), symptoms], ignore_index=True)
            write_symptoms("data/symptoms_database.csv", combined_symptoms)
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
            assert Path("data/symptoms_database.csv").exists(), "Symptoms database file not found."
            print("Getting summarizer instance...")
            summarizer_instance = get_summarizer()
            print("summarizing...")
            result["summary"] = summarizer_instance.summarize(result["transcription"], patient_record=get_symptoms("data/symptoms_database.csv"))
            print("summarized worked...")
            return jsonify(result), 200
        else:
            return jsonify(result), 400
    except Exception as e:
        print(result)
        return jsonify({"status": "error", "message": str(e)}), 500
    
@app.route('/api/text-summary', methods=['GET'])
def text_summary():
    """A placeholder endpoint for symptom transformation."""
    try:
        text = request.args.get('text', '')
        if not text:
            return jsonify({"status": "error", "message": "No text provided"}), 400
        symptoms = symptom_transformer("data/recording_database.json", api_key=load_config("config.yaml").get("openai_key"))
        write_symptoms("data/symptoms.csv", symptoms)
        summarizer_instance = get_summarizer()
        summary = summarizer_instance.summarize(text, patient_record=get_patient_record("data/symptoms.csv"))
        return jsonify({"status": "success", "summary": summary}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
