import json
import os
from datetime import datetime


HISTORY_FILE = "database/workout_history.json"


def save_workout_session(
    exercise,
    reps_completed,
    target_reps,
    status
):

    calories = round(reps_completed * 0.35, 2)

    session = {
        "exercise": exercise,

        "reps_completed": reps_completed,

        "target_reps": target_reps,

        "extra_reps_done": reps_completed > target_reps,

        "calories_burned": calories,

        "status": status,

        "date_time": datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )
    }

    history = []

    if os.path.exists(HISTORY_FILE):

        try:
            with open(HISTORY_FILE, "r") as file:
                history = json.load(file)

        except:
            history = []

    history.append(session)

    with open(HISTORY_FILE, "w") as file:
        json.dump(
            history,
            file,
            indent=4
        )

    