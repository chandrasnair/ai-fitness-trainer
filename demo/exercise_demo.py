import cv2
import os

def show_demo(exercise):

    # map exercise → video file
    video_map = {
        "squat": "demo/squat.mp4",
        "pushup": "demo/pushup.mp4"
    }

    video_path = video_map.get(exercise)

    if video_path is None or not os.path.exists(video_path):
        print("❌ Demo video not found for:", exercise)
        return

    cap = cv2.VideoCapture(video_path)

    print(f"\n🎬 Playing demo for: {exercise}")
    print("Press ENTER in terminal to continue...")

    while cap.isOpened():
        ret, frame = cap.read()

        if not ret:
            break  # video finished

        # overlay text
        cv2.putText(frame, f"DEMO: {exercise}", (50, 80),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 255), 3)

        cv2.putText(frame, "Watch correct posture", (50, 140),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

        cv2.putText(frame, "Press ENTER in terminal to start workout",
                    (50, 200),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7,
                    (0, 255, 0), 2)

        cv2.imshow("Exercise Demo", frame)

        key = cv2.waitKey(25) & 0xFF

        # ESC exits demo early
        if key == 27:
            break

    cap.release()
    cv2.destroyAllWindows()