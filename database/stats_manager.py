import json
import os
from datetime import datetime, timedelta


HISTORY_FILE = "database/workout_history.json"


def load_history():
    if not os.path.exists(HISTORY_FILE):
        return []

    try:
        with open(HISTORY_FILE, "r") as file:
            return json.load(file)
    except:
        return []


def get_total_workouts():
    history = load_history()
    return len(history)


def get_total_reps():
    history = load_history()
    total = 0

    for session in history:
        total += session.get("reps_completed", 0)

    return total


def get_estimated_calories():
    history = load_history()

    total_calories = 0

    for session in history:
        total_calories += session.get(
            "calories_burned",
            0
        )

    return round(total_calories, 2)


def get_streak_days():
    history = load_history()

    if not history:
        return 0

    workout_dates = set()

    for session in history:
        date_time = session.get("date_time", "")

        try:
            date = datetime.strptime(
                date_time,
                "%Y-%m-%d %H:%M:%S"
            ).date()

            workout_dates.add(date)

        except:
            pass

    if not workout_dates:
        return 0

    streak = 0
    today = datetime.now().date()

    while today in workout_dates:
        streak += 1
        today -= timedelta(days=1)

    return streak


def get_dashboard_stats():
    return {
        "total_workouts": get_total_workouts(),
        "total_reps": get_total_reps(),
        "estimated_calories": get_estimated_calories(),
        "streak_days": get_streak_days()
    }