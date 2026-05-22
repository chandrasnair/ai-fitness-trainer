import cv2
import os
import numpy as np


WINDOW_NAME = "AI Fitness Trainer"


def play_demo(exercise):
    video_path = f"demo/{exercise}.mp4"

    if not os.path.exists(video_path):
        print("Demo video not found. Skipping demo...")
        return None

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        print("Demo video could not be opened. Skipping demo...")
        return None

    last_frame = None

    cv2.namedWindow(
        WINDOW_NAME,
        cv2.WINDOW_NORMAL
    )

    cv2.setWindowProperty(
        WINDOW_NAME,
        cv2.WND_PROP_FULLSCREEN,
        cv2.WINDOW_FULLSCREEN
    )

    print("\nPlaying exercise demo...")
    print("Press S to skip demo\n")

    while cap.isOpened():
        ret, frame = cap.read()

        if not ret:
            break

        frame = cv2.resize(frame, (1366, 768))
        last_frame = frame.copy()

        overlay = frame.copy()

        cv2.rectangle(
            overlay,
            (0, 0),
            (1366, 95),
            (20, 35, 20),
            -1
        )

        cv2.addWeighted(
            overlay,
            0.75,
            frame,
            0.25,
            0,
            frame
        )

        cv2.putText(
            frame,
            f"{exercise.upper()} DEMO",
            (60, 62),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.15,
            (240, 255, 240),
            2
        )

        cv2.putText(
            frame,
            "Press S to skip",
            (1080, 60),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (200, 220, 200),
            1
        )

        cv2.imshow(WINDOW_NAME, frame)

        key = cv2.waitKey(25) & 0xFF

        if key == ord('s'):
            break

    cap.release()

    return last_frame


def countdown(base_frame=None):
    if base_frame is None:
        base_frame = np.zeros((768, 1366, 3), dtype=np.uint8)

    for number in [3, 2, 1]:
        frame = base_frame.copy()

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
            0.65,
            frame,
            0.35,
            0,
            frame
        )

        cv2.putText(
            frame,
            str(number),
            (640, 380),
            cv2.FONT_HERSHEY_SIMPLEX,
            4,
            (240, 255, 240),
            6
        )

        cv2.putText(
            frame,
            "Get Ready",
            (610, 470),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (180, 220, 180),
            2
        )

        cv2.imshow(WINDOW_NAME, frame)
        cv2.waitKey(1000)