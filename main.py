import cv2
import numpy as np

from ui.dashboard import show_dashboard
from ui.exercise_selection import select_exercise

from ai_model.pose_detection import (
    run_workout,
    create_pose_landmarker
)

from demo.exercise_demo import (
    play_demo,
    countdown
)


def show_loading_screen(message):

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
        (480, 360),
        cv2.FONT_HERSHEY_SIMPLEX,
        1.2,
        (240, 255, 240),
        2
    )

    cv2.putText(
        frame,
        "Please wait...",
        (580, 420),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.8,
        (180, 220, 180),
        1
    )

    cv2.imshow(
        "AI Fitness Trainer",
        frame
    )

    cv2.waitKey(1)


print("\n🏋️ AI FITNESS TRAINER STARTED\n")

dashboard_action = show_dashboard()

if dashboard_action == "quit":
    exit()

exercise = select_exercise()

if exercise is None:
    print("Workout cancelled")
    exit()

print(f"\nStarting {exercise} demo...\n")

last_demo_frame = play_demo(exercise)

show_loading_screen("Preparing camera...")

cap = cv2.VideoCapture(0)

for _ in range(10):
    cap.read()

show_loading_screen("Loading AI coach...")

landmarker = create_pose_landmarker()

countdown(last_demo_frame)

print(f"\nStarting {exercise} workout...\n")

run_workout(exercise, cap, landmarker)

cap.release()