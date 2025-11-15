import json
from typing import Any

import yaml


def load_config(config_path: str) -> dict[str, Any]:
    with open(config_path, "r") as f:
        return yaml.safe_load(f)
    

def get_patient_record(file: str) -> list[dict[str, Any]]:
    # Placeholder function to get patient record from DB
    return json.load(open(file))


def write_patient_record(file: str, record: list[dict[str, Any]]) -> None:
    # Placeholder function to write patient record to DB
    data = record
    with open(file, "w") as f:
        json.dump(data, f, indent=4)


def write_symptoms(file: str, patient_id: str, summary: str) -> None:
    data = json.load(open(file))
    data[patient_id]['symptoms'] = summary
    with open(file, "w") as f:
        json.dump(data, f, indent=4)