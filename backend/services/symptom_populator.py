
# Minimal CSV generator using pandas and OpenAI

import hashlib
import io
import json
import re

import pandas as pd
from openai import OpenAI

PROMPT = """
I will upload a JSON file with symptom recordings.

Produce EXACTLY ONE CSV row per recording, with columns:

symptom_id,recording_id,recording_date,symptom_group,symptom_description,symptom_intensity

Rules:
- symptom_id = SHA-256(recording_id + symptom_group + symptom_description)
- recording_date = ISO 8601 calendar date of the recording (YYYY-MM-DD, no time)
- symptom_group = 1-word body-region label
- symptom_description = short summary
- symptom_intensity = integer from 0 to 10

Return ONLY the CSV inside a fenced code block.
"""



def extract_csv_from_output(text: str) -> str:
    """Extract CSV between ```csv ... ```."""
    m = re.search(r"```(?:csv)?\n(.*?)```", text, re.S)
    return m.group(1).strip() if m else text.strip()


def compute_symptom_id(row):
    s = f"{row['recording_id']}|{row['symptom_group']}|{row['symptom_description']}"
    return hashlib.sha256(s.encode()).hexdigest()


def symptom_transformer(raw_json: pd.DataFrame, api_key: str) -> pd.DataFrame:
    """Transform raw symptom JSON into a CSV database using an OpenAI model."""
    client = OpenAI(api_key=api_key)

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
    print(df.head())
    return df


if __name__ == "__main__":
    symptom_transformer()