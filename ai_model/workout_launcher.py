import sys
import cv2
import numpy as np
import time

from demo.exercise_demo import play_demo, countdown
from ai_model.pose_detection import run_workout


def loading_screen():

    messages = [
        "Initializing AI Coach...",
        "Preparing Camera...",
        "Stand in Position..."
    ]

    for message in messages:

        frame = np.zeros((768, 1366, 3), dtype=np.uint8)

        overlay = frame.copy()

        cv2.rectangle(
            overlay,
            (0, 0),
            (1366, 768),
            (10, 18, 10),
            -1
        )

        cv2.addWeighted(
            overlay,
            0.85,
            frame,
            0.15,
            0,
            frame
        )

        cv2.putText(
            frame,
            message,
            (430, 360),
            cv2.FONT_HERSHEY_DUPLEX,
            1.2,
            (240, 255, 240),
            2
        )

        cv2.putText(
            frame,
            "FitFusion AI Trainer",
            (520, 440),
            cv2.FONT_HERSHEY_DUPLEX,
            0.8,
            (180, 220, 180),
            1
        )

        cv2.imshow(
            "AI Fitness Trainer",
            frame
        )

        cv2.waitKey(1)
        time.sleep(1)


def main():

    exercise = "squat"

    if len(sys.argv) > 1:
        exercise = sys.argv[1]

    last_frame = play_demo(exercise)

    countdown(last_frame)

    loading_screen()

    run_workout(exercise)


if __name__ == "__main__":
    main()