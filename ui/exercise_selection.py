import cv2
import numpy as np

from exercises.exercise_library import exercise_library


WINDOW_NAME = "AI Fitness Trainer"


def select_exercise():

    selected = 0

    cv2.namedWindow(
        WINDOW_NAME,
        cv2.WINDOW_NORMAL
    )

    cv2.setWindowProperty(
        WINDOW_NAME,
        cv2.WND_PROP_FULLSCREEN,
        cv2.WINDOW_FULLSCREEN
    )

    while True:

        frame = np.zeros((768, 1366, 3), dtype=np.uint8)

        overlay = frame.copy()

        cv2.rectangle(
            overlay,
            (0, 0),
            (1366, 768),
            (12, 20, 12),
            -1
        )

        cv2.addWeighted(
            overlay,
            0.9,
            frame,
            0.1,
            0,
            frame
        )

        # -------------------------
        # TITLE
        # -------------------------
        cv2.putText(
            frame,
            "AI FITNESS TRAINER",
            (430, 110),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.5,
            (240, 255, 240),
            3
        )

        cv2.putText(
            frame,
            "SELECT YOUR WORKOUT",
            (470, 180),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (180, 210, 180),
            1
        )

        # -------------------------
        # CARD SETTINGS
        # -------------------------
        card_width = 320
        card_height = 320
        gap = 50

        total_width = (
            len(exercise_library) * card_width
            + (len(exercise_library) - 1) * gap
        )

        start_x = (1366 - total_width) // 2

        # -------------------------
        # DRAW CARDS
        # -------------------------
        for i, exercise in enumerate(exercise_library):

            x1 = start_x + (i * (card_width + gap))
            y1 = 250

            x2 = x1 + card_width
            y2 = y1 + card_height

            # SELECTED CARD
            if i == selected:

                cv2.rectangle(
                    frame,
                    (x1, y1),
                    (x2, y2),
                    (55, 85, 55),
                    -1
                )

                cv2.rectangle(
                    frame,
                    (x1, y1),
                    (x2, y2),
                    (120, 170, 90),
                    3
                )

            else:

                cv2.rectangle(
                    frame,
                    (x1, y1),
                    (x2, y2),
                    (30, 40, 30),
                    -1
                )

            # EXERCISE NAME
            cv2.putText(
                frame,
                exercise["name"],
                (x1 + 40, y1 + 90),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (245, 255, 245),
                2
            )

            # CATEGORY
            cv2.putText(
                frame,
                exercise["category"],
                (x1 + 40, y1 + 145),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.65,
                (180, 220, 180),
                1
            )

            # LEVEL
            cv2.putText(
                frame,
                f"Level : {exercise['level']}",
                (x1 + 40, y1 + 190),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (200, 215, 200),
                1
            )

            # GOAL
            cv2.putText(
                frame,
                f"Goal : {exercise['goal']}",
                (x1 + 40, y1 + 225),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (200, 215, 200),
                1
            )

            # DESCRIPTION
            cv2.putText(
                frame,
                exercise["description"],
                (x1 + 40, y1 + 275),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.55,
                (170, 200, 170),
                1
            )

        # -------------------------
        # CONTROLS
        # -------------------------
        cv2.putText(
            frame,
            "← → Navigate    ENTER Select    Q Quit",
            (430, 690),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.75,
            (170, 200, 170),
            1
        )

        cv2.imshow(WINDOW_NAME, frame)

        key = cv2.waitKey(1)

        # LEFT
        if key == 81 or key == ord('a'):
            selected = (selected - 1) % len(exercise_library)

        # RIGHT
        elif key == 83 or key == ord('d'):
            selected = (selected + 1) % len(exercise_library)

        # ENTER
        elif key == 13:
            return exercise_library[selected]["id"]

        # QUIT
        elif key == ord('q'):
            return None