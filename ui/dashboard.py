import cv2
import numpy as np

from database.stats_manager import get_dashboard_stats


WINDOW_NAME = "AI Fitness Trainer"


def show_dashboard():
    stats = get_dashboard_stats()

    while True:
        frame = np.zeros((768, 1366, 3), dtype=np.uint8)

        cv2.putText(
            frame,
            "AI FITNESS DASHBOARD",
            (380, 100),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.5,
            (240, 255, 240),
            3
        )

        cards = [
            ("STREAK DAYS", stats["streak_days"]),
            ("WORKOUTS", stats["total_workouts"]),
            ("TOTAL REPS", stats["total_reps"]),
            ("CALORIES", stats["estimated_calories"])
        ]

        x = 130

        for title, value in cards:
            cv2.rectangle(
                frame,
                (x, 220),
                (x + 250, 390),
                (35, 50, 35),
                -1
            )

            cv2.line(
                frame,
                (x, 220),
                (x + 250, 220),
                (120, 170, 90),
                3
            )

            cv2.putText(
                frame,
                title,
                (x + 35, 275),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.65,
                (180, 215, 180),
                1
            )

            cv2.putText(
                frame,
                str(value),
                (x + 80, 345),
                cv2.FONT_HERSHEY_SIMPLEX,
                1.6,
                (245, 255, 245),
                3
            )

            x += 290

        cv2.putText(
            frame,
            "Press ENTER to Start Workout    Press Q to Quit",
            (360, 650),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (180, 210, 180),
            1
        )

        cv2.imshow(WINDOW_NAME, frame)

        key = cv2.waitKey(1) & 0xFF

        if key == 13:
            return "start"

        if key == ord("q"):
            return "quit"