import cv2
import mediapipe as mp
import time
import pygame
import itertools

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
# SMART CARD SYSTEM
# -------------------------
smart_cards = [

    "Consistency builds strength.",
    "Controlled movement improves form.",
    "Every rep counts.",
    "Maintain steady breathing.",
    "Stay focused. Stay strong.",
    "Hydration improves endurance.",
    "Quality reps matter more than speed.",
    "Recovery is part of growth."

]

card_cycle = itertools.cycle(smart_cards)

current_card = next(card_cycle)

last_card_switch = time.time()


# -------------------------
# MAIN WORKOUT ENGINE
# -------------------------
def run_workout(exercise):

    global current_card
    global last_card_switch

    config = load_exercise(exercise)

    if not config:

        print("Invalid exercise")

        return

    # -------------------------
    # INIT SYSTEMS
    # -------------------------
    counter = RepCounter(
        max_reps=config["max_reps"]
    )

    start_timer(
        config.get("duration", 60)
    )

    # -------------------------
    # LOAD MODEL
    # -------------------------
    base_options = python.BaseOptions(
        model_asset_path="models/pose_landmarker_lite.task"
    )

    options = vision.PoseLandmarkerOptions(
        base_options=base_options,
        running_mode=vision.RunningMode.VIDEO
    )

    landmarker = vision.PoseLandmarker.create_from_options(
        options
    )

    # -------------------------
    # CAMERA
    # -------------------------
    cap = cv2.VideoCapture(0)

    print(f"\n🏋️ Starting {exercise} workout...")

    while cap.isOpened():

        # -------------------------
        # TIMER CHECK
        # -------------------------
        remaining = time_remaining()

        if remaining <= 0:

            print("⏱️ Workout time finished!")

            break

        ret, frame = cap.read()

        if not ret:

            break

        # -------------------------
        # FULLSCREEN RESIZE
        # -------------------------
        frame = cv2.resize(
            frame,
            (1366, 768)
        )

        # -------------------------
        # MEDIAPIPE IMAGE
        # -------------------------
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

        # -------------------------
        # PLAY MUSIC
        # -------------------------
        try:

            play_music(exercise)

        except:
            pass

        # -------------------------
        # CHANGE SMART CARD
        # -------------------------
        if time.time() - last_card_switch > 7:

            current_card = next(card_cycle)

            last_card_switch = time.time()

        # -------------------------
        # GLASS OVERLAY
        # -------------------------
        overlay = frame.copy()

        cv2.rectangle(
            overlay,
            (20, 20),
            (420, 740),
            (25, 35, 25),
            -1
        )

        alpha = 0.78

        cv2.addWeighted(
            overlay,
            alpha,
            frame,
            1 - alpha,
            0,
            frame
        )

        # -------------------------
        # HEADER
        # -------------------------
        cv2.putText(
            frame,
            "AI FITNESS TRAINER",
            (60, 75),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (240, 255, 240),
            2
        )

        cv2.line(
            frame,
            (60, 105),
            (360, 105),
            (120, 170, 90),
            2
        )

        # -------------------------
        # EXERCISE
        # -------------------------
        cv2.putText(
            frame,
            "EXERCISE",
            (60, 170),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (190, 220, 190),
            1
        )

        cv2.putText(
            frame,
            exercise.upper(),
            (60, 220),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.3,
            (255, 255, 255),
            2
        )

        # -------------------------
        # REPS
        # -------------------------
        cv2.putText(
            frame,
            "REPETITIONS",
            (60, 320),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (190, 220, 190),
            1
        )

        cv2.putText(
            frame,
            f"{counter.count} / {config['max_reps']}",
            (60, 375),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.4,
            (255, 255, 255),
            2
        )

        # -------------------------
        # TIMER
        # -------------------------
        cv2.putText(
            frame,
            "TIME REMAINING",
            (60, 485),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (190, 220, 190),
            1
        )

        cv2.putText(
            frame,
            f"{remaining}s",
            (60, 540),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.35,
            (220, 255, 220),
            2
        )

        # -------------------------
        # PROGRESS BAR
        # -------------------------
        progress = counter.count / config["max_reps"]

        bar_x = 60
        bar_y = 610

        bar_width = 300
        bar_height = 12

        # BAR BACKGROUND
        cv2.rectangle(
            frame,
            (bar_x, bar_y),
            (
                bar_x + bar_width,
                bar_y + bar_height
            ),
            (55, 65, 55),
            -1
        )

        # BAR FILL
        cv2.rectangle(
            frame,
            (bar_x, bar_y),
            (
                int(bar_x + (bar_width * progress)),
                bar_y + bar_height
            ),
            (120, 170, 90),
            -1
        )

        # -------------------------
        # AI INSIGHT CARD
        # -------------------------
        card_x1 = 50
        card_y1 = 650

        card_x2 = 395
        card_y2 = 755

        # CARD
        cv2.rectangle(
            frame,
            (card_x1, card_y1),
            (card_x2, card_y2),
            (45, 60, 40),
            -1
        )

        # TOP ACCENT
        cv2.line(
            frame,
            (card_x1, card_y1),
            (card_x2, card_y1),
            (120, 170, 90),
            2
        )

        # TITLE
        cv2.putText(
            frame,
            "AI INSIGHT",
            (75, 690),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.58,
            (205, 225, 205),
            1
        )

        # -------------------------
        # TEXT WRAP
        # -------------------------
        words = current_card.split()

        line1 = ""
        line2 = ""

        for word in words:

            test = line1 + word + " "

            if len(test) < 24:

                line1 = test

            else:

                line2 += word + " "

        # LINE 1
        cv2.putText(
            frame,
            line1.strip(),
            (75, 720),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.62,
            (245, 245, 245),
            1
        )

        # LINE 2
        cv2.putText(
            frame,
            line2.strip(),
            (75, 748),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.62,
            (245, 245, 245),
            1
        )

        # -------------------------
        # WINDOW
        # -------------------------
        cv2.namedWindow(
            "AI Fitness Trainer",
            cv2.WINDOW_NORMAL
        )

        cv2.setWindowProperty(
            "AI Fitness Trainer",
            cv2.WND_PROP_FULLSCREEN,
            cv2.WINDOW_FULLSCREEN
        )

        cv2.imshow(
            "AI Fitness Trainer",
            frame
        )

        # -------------------------
        # QUIT
        # -------------------------
        if cv2.waitKey(1) & 0xFF == ord('q'):

            break

    # -------------------------
    # CLEANUP
    # -------------------------
    cap.release()

    cv2.destroyAllWindows()

    try:

        pygame.mixer.music.stop()

    except:
        pass