import json
import os

def load_exercise(name):
    file_path = f"exercises/{name}.json"

    if not os.path.exists(file_path):
        print("Exercise config not found:", name)
        return None

    with open(file_path, "r") as f:
        config = json.load(f)

    return config