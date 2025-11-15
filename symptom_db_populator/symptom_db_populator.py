# symptom_processor_minimal.py
# Minimal CSV generator using pandas and OpenAI

import os
import json
import hashlib
import io
import re
import sys
import yaml
import pandas as pd
from openai import OpenAI


PROMPT = """
I will upload a JSON file with symptom recordings.

Produce EXACTLY ONE CSV row per recording, with columns:

symptom_id,recording_id,symptom_group,symptom_description,symptom_intensity

Rules:
- symptom_id = SHA-256(recording_id + symptom_group + symptom_description)
- symptom_group = 1-word body-region label
- symptom_description = short summary
- symptom_intensity = 0–10

Return ONLY the CSV inside a fenced code block.
"""


def extract_csv_from_output(text: str) -> str:
    """Extract CSV between ```csv ... ```."""
    m = re.search(r"```(?:csv)?\n(.*?)```", text, re.S)
    return m.group(1).strip() if m else text.strip()


def compute_symptom_id(row):
    s = f"{row['recording_id']}|{row['symptom_group']}|{row['symptom_description']}"
    return hashlib.sha256(s.encode()).hexdigest()


def symptom_transformer():
    """Transform raw symptom JSON into a CSV database using an OpenAI model."""
    input_path = os.path.join("..", "data", "recording_database.json")
    config_path = os.path.join("..", "config.yaml")

    # Load OpenAI API key
    try:
        with open(config_path) as f:
            api_key = yaml.safe_load(f)["openai_api_key"]
    except Exception:
        print("config.yaml missing or invalid.", file=sys.stderr)
        sys.exit(1)

    client = OpenAI(api_key=api_key)

    # Load JSON data
    with open(input_path, encoding="utf-8") as f:
        raw_json = json.load(f)

    # Ask model for CSV
    response = client.chat.completions.create(
        model="gpt-5.1",
        temperature=0.0,
        messages=[
            {"role": "system", "content": "You output CSV only."},
            {"role": "user", "content": PROMPT},
            {"role": "user", "content": json.dumps(raw_json, ensure_ascii=False, indent=2)},
        ],
    )

    csv_text = extract_csv_from_output(response.choices[0].message.content)

    # Parse CSV with pandas
    df = pd.read_csv(io.StringIO(csv_text))

    # Compute symptom_id
    df["symptom_id"] = df.apply(compute_symptom_id, axis=1)

    # Ensure ./output exists
    os.makedirs("output", exist_ok=True)

    out_path = "output/symptom_database.csv"
    df.to_csv(out_path, index=False)

    print(f"Done: {out_path}")


if __name__ == "__main__":
    symptom_transformer()
