import cv2
import time

cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

if not cap.isOpened():
    print("Camera not opened")
    exit()

print("Camera opened successfully")

time.sleep(1)

while True:
    ret, frame = cap.read()

    if not ret:
        print("Frame not received")
        break

    print("Frame shape:", frame.shape)

    cv2.imshow("Camera Test", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()