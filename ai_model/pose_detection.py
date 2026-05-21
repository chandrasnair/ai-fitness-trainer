import cv2
import mediapipe as mp
import time
import pygame

from mediapipe.tasks import python
from mediapipe.tasks.python import vision

from exercises.config_loader import load_exercise
from ai_model.rep_counter import RepCounter
from ai_model.posture_logic import get_state

from utils.timer import start_timer, time_remaining
from utils.safety_manager import is_safe_to_continue


# -------------------------
# MUSIC CONTROLLER
# -------------------------
music_started = False


def play_music(exercise):
    global music_started

    if music_started:
        return

    music_map = {
        "squat": "music/squat.mp3",
        "pushup": "music/pushup.mp3"
    }

    file = music_map.get(exercise)

    if file:
        pygame.mixer.init()
        pygame.mixer.music.load(file)
        pygame.mixer.music.play(-1)

    music_started = True


# -------------------------
# MAIN WORKOUT ENGINE
# -------------------------
def run_workout(exercise):

    config = load_exercise(exercise)

    if not config:
        print("Invalid exercise")
        return

    # INIT SYSTEMS
    counter = RepCounter(max_reps=config["max_reps"])

    start_timer(config.get("duration", 60))

    # LOAD MODEL
    base_options = python.BaseOptions(
        model_asset_path="models/pose_landmarker_lite.task"
    )

    options = vision.PoseLandmarkerOptions(
        base_options=base_options,
        running_mode=vision.RunningMode.VIDEO
    )

    landmarker = vision.PoseLandmarker.create_from_options(options)

    # CAMERA
    cap = cv2.VideoCapture(0)

    print(f"\n🏋️ Starting {exercise} workout...")

    while cap.isOpened():

        # TIMER CHECK
        remaining = time_remaining()

        if remaining <= 0:
            print("⏱️ Workout time finished!")
            break

        ret, frame = cap.read()

        if not ret:
            break

        # MEDIAPIPE IMAGE
        mp_image = mp.Image(
            image_format=mp.ImageFormat.SRGB,
            data=frame
        )

        timestamp_ms = int(time.time() * 1000)

        result = landmarker.detect_for_video(
            mp_image,
            timestamp_ms
        )

        state = "NO POSE"
        angle = 0

        # -------------------------
        # POSE PROCESSING
        # -------------------------
        if result.pose_landmarks:

            for pose in result.pose_landmarks:

                # GET POSTURE STATE
                state, angle = get_state(
                    pose,
                    config
                )

                # SAFETY CHECK
                if not is_safe_to_continue(
                    counter.count,
                    config["max_reps"]
                ):
                    print("🛑 Safety limit reached!")

                    cap.release()
                    cv2.destroyAllWindows()

                    return

                # UPDATE REPS
                counter.update(state)

                # WORKOUT COMPLETE
                if counter.is_complete():

                    print("🎉 Workout Complete!")

                    cap.release()
                    cv2.destroyAllWindows()

                    return

                # DRAW LANDMARKS
                for landmark in pose:

                    h, w, _ = frame.shape

                    x = int(landmark.x * w)
                    y = int(landmark.y * h)

                    cv2.circle(
                        frame,
                        (x, y),
                        4,
                        (0, 255, 0),
                        -1
                    )

        # -------------------------
        # PLAY MUSIC SAFELY
        # -------------------------
        try:
            play_music(exercise)
        except:
            pass

        # -------------------------
        # UI DISPLAY
        # -------------------------
        cv2.putText(
            frame,
            f"Exercise: {exercise}",
            (50, 50),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (255, 255, 0),
            2
        )

        cv2.putText(
            frame,
            f"State: {state}",
            (50, 100),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 0, 255),
            2
        )

        cv2.putText(
            frame,
            f"Reps: {counter.count}",
            (50, 150),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 255, 255),
            2
        )

        cv2.putText(
            frame,
            f"Time Left: {remaining}s",
            (50, 200),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (255, 255, 255),
            2
        )

        # SHOW WINDOW
        cv2.imshow(
            "AI Fitness Trainer",
            frame
        )

        # QUIT
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # CLEANUP
    cap.release()
    cv2.destroyAllWindows()

    try:
        pygame.mixer.music.stop()
    except:
        pass