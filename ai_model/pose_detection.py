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

from utils.safety_manager import is_safe_to_continue
from utils.voice_coach import speak
from database.workout_history import save_workout_session


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


def show_finish_screen(frame, counter, safe_max_reps):

    calories = round(counter.count * 0.35, 2)

    while True:

        finish_frame = frame.copy()
        overlay = finish_frame.copy()

        cv2.rectangle(
            overlay,
            (0, 0),
            (1366, 768),
            (10, 18, 10),
            -1
        )

        cv2.addWeighted(
            overlay,
            0.72,
            finish_frame,
            0.28,
            0,
            finish_frame
        )

        cv2.putText(
            finish_frame,
            "SESSION COMPLETE",
            (560, 150),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.75,
            (185, 215, 185),
            1
        )

        cv2.putText(
            finish_frame,
            "WORKOUT",
            (525, 265),
            cv2.FONT_HERSHEY_SIMPLEX,
            2.1,
            (245, 255, 245),
            3
        )

        cv2.putText(
            finish_frame,
            "COMPLETE",
            (510, 350),
            cv2.FONT_HERSHEY_SIMPLEX,
            2.1,
            (245, 255, 245),
            3
        )

        cv2.line(
            finish_frame,
            (450, 395),
            (915, 395),
            (120, 170, 90),
            3
        )

        cv2.rectangle(
            finish_frame,
            (405, 435),
            (690, 535),
            (35, 50, 35),
            -1
        )

        cv2.rectangle(
            finish_frame,
            (730, 435),
            (970, 535),
            (35, 50, 35),
            -1
        )

        cv2.putText(
            finish_frame,
            "TOTAL REPS",
            (500, 472),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.55,
            (180, 210, 180),
            1
        )

        cv2.putText(
            finish_frame,
            str(counter.count),
            (515, 522),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.3,
            (245, 255, 245),
            2
        )

        cv2.putText(
            finish_frame,
            "CALORIES",
            (795, 472),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.55,
            (180, 210, 180),
            1
        )

        cv2.putText(
            finish_frame,
            str(calories),
            (800, 522),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.3,
            (245, 255, 245),
            2
        )

        if counter.max_reps < safe_max_reps:

            cv2.rectangle(
                finish_frame,
                (455, 585),
                (690, 650),
                (55, 80, 55),
                -1
            )

            cv2.line(
                finish_frame,
                (455, 585),
                (690, 585),
                (120, 170, 90),
                2
            )

            cv2.putText(
                finish_frame,
                "PRESS Y",
                (520, 627),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.95,
                (245, 255, 245),
                2
            )

            cv2.rectangle(
                finish_frame,
                (735, 585),
                (920, 650),
                (35, 45, 35),
                -1
            )

            cv2.putText(
                finish_frame,
                "PRESS Q",
                (775, 627),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.9,
                (210, 220, 210),
                2
            )

            cv2.putText(
                finish_frame,
                "EXTRA REPS",
                (500, 680),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (180, 205, 180),
                1
            )

            cv2.putText(
                finish_frame,
                "FINISH",
                (790, 680),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (180, 205, 180),
                1
            )

        else:

            cv2.putText(
                finish_frame,
                "SAFE LIMIT REACHED",
                (540, 610),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (220, 255, 220),
                2
            )

            cv2.putText(
                finish_frame,
                "PRESS Q TO EXIT",
                (585, 675),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (190, 210, 190),
                1
            )

        cv2.imshow(
            "AI Fitness Trainer",
            finish_frame
        )

        key = cv2.waitKey(1) & 0xFF

        if key == ord('y') and counter.max_reps < safe_max_reps:
            return "extra"

        if key == ord('q'):
            return "finish"


def create_pose_landmarker():

    base_options = python.BaseOptions(
        model_asset_path="models/pose_landmarker_lite.task"
    )

    options = vision.PoseLandmarkerOptions(
        base_options=base_options,
        running_mode=vision.RunningMode.VIDEO
    )

    return vision.PoseLandmarker.create_from_options(options)


def run_workout(exercise, cap=None, landmarker=None):
    global current_card
    global last_card_switch

    config = load_exercise(exercise)

    if not config:
        print("Invalid exercise")
        return

    prescribed_reps = config["max_reps"]
    safe_max_reps = config.get("safe_max_reps", prescribed_reps + 5)

    counter = RepCounter(max_reps=prescribed_reps)

    # Session timing
    # Target duration is only a suggested time, not a hard stop.
    # Workout completion depends mainly on reps.
    session_start_time = time.time()
    target_duration = config.get("duration", 60)

    # Safety limit prevents the camera from running forever.
    safe_session_limit = config.get("safe_session_limit", 600)

    duration_warning_given = False

    if landmarker is None:
        landmarker = create_pose_landmarker()

    if cap is None:
        cap = cv2.VideoCapture(0)

    visible_feedback = ""
    last_feedback_time = 0
    feedback_duration = 2.5
    feedback_cooldown = 4
    bending_frames = 0

    print(f"\n🏋️ Starting {exercise} workout...")
    speak("Workout started", force=True)

    while cap.isOpened():

        elapsed_seconds = int(time.time() - session_start_time)

        if (
            elapsed_seconds >= target_duration
            and counter.count < counter.max_reps
            and not duration_warning_given
        ):
            visible_feedback = "Take your time. Complete the reps."
            speak("Take your time. Complete the reps.", force=True)
            last_feedback_time = time.time()
            duration_warning_given = True

        if elapsed_seconds >= safe_session_limit:
            print("⏱️ Safe session limit reached!")
            visible_feedback = "Safe time limit reached"
            break

        ret, frame = cap.read()

        if not ret:
            break

        frame = cv2.resize(frame, (1366, 768))
        clean_finish_frame = frame.copy()

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
        feedback = ""

        if result.pose_landmarks:

            for pose in result.pose_landmarks:

                state, angle, feedback = get_state(
                    pose,
                    config
                )

                if not is_safe_to_continue(
                    counter.count,
                    safe_max_reps
                ):
                    print("🛑 Safety limit reached!")
                    cap.release()
                    cv2.destroyAllWindows()
                    return

                counter.update(state)

                if state == "BENDING":
                    bending_frames += 1
                else:
                    bending_frames = 0

                if (
                    bending_frames > 18
                    and time.time() - last_feedback_time > feedback_cooldown
                ):
                    visible_feedback = "Go lower"
                    speak("Go lower")
                    last_feedback_time = time.time()

                if (
                    counter.did_count_rep()
                    and time.time() - last_feedback_time > 1
                ):
                    visible_feedback = "Excellent form"
                    speak("Excellent form")
                    last_feedback_time = time.time()

                if counter.is_complete():
                    action = show_finish_screen(
                        clean_finish_frame,
                        counter,
                        safe_max_reps
                    )

                    if action == "extra":
                        extra_reps = 5
                        counter.max_reps = min(
                            counter.max_reps + extra_reps,
                            safe_max_reps
                        )

                        target_duration += 60
                        duration_warning_given = False

                        visible_feedback = "Extra set started"
                        speak("Extra set started", force=True)
                        last_feedback_time = time.time()

                    else:

                        save_workout_session(
                            exercise=exercise,
                            reps_completed=counter.count,
                            target_reps=counter.max_reps,
                            status="completed"
                        )

                        cap.release()
                        cv2.destroyAllWindows()

                        try:
                            pygame.mixer.music.stop()
                        except:
                            pass

                        return

        try:
            play_music(exercise)
        except:
            pass

        if time.time() - last_card_switch > 7:
            current_card = next(card_cycle)
            last_card_switch = time.time()

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
            f"{counter.count} / {counter.max_reps}",
            (60, 375),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.4,
            (255, 255, 255),
            2
        )

        elapsed_minutes = elapsed_seconds // 60
        elapsed_secs = elapsed_seconds % 60
        elapsed_text = f"{elapsed_minutes:02d}:{elapsed_secs:02d}"

        cv2.putText(
            frame,
            "ELAPSED TIME",
            (60, 485),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (190, 220, 190),
            1
        )

        cv2.putText(
            frame,
            elapsed_text,
            (60, 540),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.35,
            (220, 255, 220),
            2
        )

        progress = min(counter.count / counter.max_reps, 1)

        bar_x = 60
        bar_y = 610
        bar_width = 300
        bar_height = 12

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

        card_x1 = 50
        card_y1 = 650
        card_x2 = 395
        card_y2 = 755

        cv2.rectangle(
            frame,
            (card_x1, card_y1),
            (card_x2, card_y2),
            (45, 60, 40),
            -1
        )

        cv2.line(
            frame,
            (card_x1, card_y1),
            (card_x2, card_y1),
            (120, 170, 90),
            2
        )

        cv2.putText(
            frame,
            "AI INSIGHT",
            (75, 688),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.55,
            (205, 225, 205),
            1
        )

        words = current_card.split()
        lines = []
        current_line = ""

        for word in words:

            test_line = current_line + word + " "

            if len(test_line) <= 21:
                current_line = test_line
            else:
                lines.append(current_line.strip())
                current_line = word + " "

        if current_line:
            lines.append(current_line.strip())

        lines = lines[:3]

        y = 718

        for line in lines:

            cv2.putText(
                frame,
                line,
                (75, y),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.72,
                (245, 245, 245),
                1
            )

            y += 28

        if (
            visible_feedback != ""
            and time.time() - last_feedback_time < feedback_duration
        ):

            popup_overlay = frame.copy()

            text_size, _ = cv2.getTextSize(
                visible_feedback,
                cv2.FONT_HERSHEY_SIMPLEX,
                0.75,
                1
            )

            text_width = text_size[0]

            box_width = text_width + 50
            box_height = 42

            box_x1 = 760
            box_y1 = 640

            box_x2 = box_x1 + box_width
            box_y2 = box_y1 + box_height

            cv2.rectangle(
                popup_overlay,
                (box_x1, box_y1),
                (box_x2, box_y2),
                (35, 50, 35),
                -1
            )

            cv2.addWeighted(
                popup_overlay,
                0.65,
                frame,
                0.35,
                0,
                frame
            )

            cv2.line(
                frame,
                (box_x1, box_y1),
                (box_x2, box_y1),
                (120, 170, 90),
                2
            )

            cv2.putText(
                frame,
                visible_feedback,
                (box_x1 + 25, box_y1 + 29),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.75,
                (245, 255, 245),
                1
            )

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

        key = cv2.waitKey(1) & 0xFF

        if key == ord('q'):
            break

        if key == ord('t'):

            if counter.count < counter.max_reps:
                counter.count += 1

            if counter.count >= counter.max_reps:

                action = show_finish_screen(
                    clean_finish_frame,
                    counter,
                    safe_max_reps
                )

                if action == "extra":

                    counter.max_reps = min(
                        counter.max_reps + 5,
                        safe_max_reps
                    )

                    target_duration += 60
                    duration_warning_given = False

                elif action == "finish":

                    save_workout_session(
                        exercise=exercise,
                        reps_completed=counter.count,
                        target_reps=counter.max_reps,
                        status="completed"
                    )

                    cap.release()
                    cv2.destroyAllWindows()

                    try:
                        pygame.mixer.music.stop()
                    except:
                        pass

                    break

    cap.release()
    cv2.destroyAllWindows()

    try:
        pygame.mixer.music.stop()
    except:
        pass


if __name__ == "__main__":
    import sys

    exercise = "squat"

    if len(sys.argv) > 1:
        exercise = sys.argv[1]

    print("Starting workout from command line:", exercise)
    run_workout(exercise)