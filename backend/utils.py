import json
from typing import Any

import pandas as pd
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


def write_symptoms(file: str, data: pd.DataFrame) -> None:
    with open(file, "w") as f:
        data.to_csv(file, index=False)

def get_symptoms(file: str) -> pd.DataFrame:
    return pd.read_csv(file)

