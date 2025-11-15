import io
import wave
from typing import Any, Dict, Optional

import numpy as np
import openai
import sounddevice as sd
import yaml


def load_config(config_path: str) -> Dict[str, Any]:
    with open(config_path, "r") as f:
        return yaml.safe_load(f)
    

def record_wav_bytesio(duration: float, samplerate: int = 16000, channels: int = 1) -> io.BytesIO:
    # Record (sounddevice commonly returns float32 in -1..1)
    frames = sd.rec(int(duration * samplerate), samplerate=samplerate, channels=channels, dtype='float32')
    sd.wait()

    # If multi-channel, keep all channels (wave supports multi-channel)
    # Convert float32 -> int16 PCM
    pcm16 = (frames * 32767).astype(np.int16)

    buf = io.BytesIO()
    with wave.open(buf, 'wb') as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(2)            # 2 bytes for int16
        wf.setframerate(samplerate)
        wf.writeframes(pcm16.tobytes())

    buf.seek(0)
    # Optional: set name attribute if some API checks it
    buf.name = "recording.wav"
    return buf


class SimpleOpenAIWhisper:
    def __init__(self):
        self.api_key = load_config("config.yaml").get("openai_key")
        if not self.api_key:
            raise ValueError("Provide OPENAI_API_KEY environment variable or pass api_key")
        openai.api_key = self.api_key
    
    def transcribe(self, duration: int, use_test_file: bool = True) -> str:
        """Transcribe audio either from a test file or by recording live audio."""
        if use_test_file:
            audio_file = self._get_test_audio()
        else:
            audio_file = record_wav_bytesio(duration)

        with open("temp_audio.wav", "wb") as f:
            f.write(audio_file.read())

        # exit()
        client = openai.OpenAI(api_key=self.api_key)
        transcription = client.audio.transcriptions.create(
            model="gpt-4o-transcribe",
            file=audio_file
        )

        return transcription.text

    def _record_audio(self, duration: int) -> np.ndarray:
        fs = 16000  # Sample rate
        print("Recording...")
        recording = sd.rec(int(duration * fs), samplerate=fs, channels=1)
        sd.wait()  # Wait until recording is finished
        print("Recording complete.")
        return recording
    
    def _get_test_audio(self):
        audio_file= open("KL_su15.wav", "rb")
        return audio_file


if __name__ == "__main__":
    whisper = SimpleOpenAIWhisper()
    whisper.transcribe(duration=5, use_test_file=False)
