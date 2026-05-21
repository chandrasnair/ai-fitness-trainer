from ai_model.pose_detection import run_workout

print("\n🏋️ AI FITNESS TRAINER STARTED\n")

print("Select Exercise:")
print("1. Squat")
print("2. Pushup")

choice = input("Enter choice: ")

if choice == "1":
    exercise = "squat"
elif choice == "2":
    exercise = "pushup"
else:
    print("Invalid choice")
    exit()

print(f"\nStarting {exercise} workout...\n")

run_workout(exercise)