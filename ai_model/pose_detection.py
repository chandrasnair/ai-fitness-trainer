import cv2
import mediapipe as mp
import time

from mediapipe.tasks import python
from mediapipe.tasks.python import vision

# Load model (IMPORTANT PATH)
base_options = python.BaseOptions(
    model_asset_path="models/pose_landmarker_lite.task"
)

options = vision.PoseLandmarkerOptions(
    base_options=base_options,
    running_mode=vision.RunningMode.VIDEO
)

landmarker = vision.PoseLandmarker.create_from_options(options)

cap = cv2.VideoCapture(0)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Convert frame for MediaPipe
    mp_image = mp.Image(
        image_format=mp.ImageFormat.SRGB,
        data=frame
    )

    timestamp_ms = int(time.time() * 1000)

    # Detect pose
    result = landmarker.detect_for_video(mp_image, timestamp_ms)

    # -----------------------------
    # DRAW LANDMARKS (FIXED PART)
    # -----------------------------
    if result.pose_landmarks:
        for pose in result.pose_landmarks:
            for landmark in pose:
                h, w, _ = frame.shape
                x = int(landmark.x * w)
                y = int(landmark.y * h)

                cv2.circle(frame, (x, y), 4, (0, 255, 0), -1)

    # Show output
    cv2.imshow("AI Fitness Trainer - Pose Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()