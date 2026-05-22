import pyttsx3
import time
import threading
import pygame


last_spoken_time = 0
voice_cooldown = 3
is_speaking = False


def lower_music():
    try:
        current = pygame.mixer.music.get_volume()

        while current > 0.25:
            current -= 0.05
            pygame.mixer.music.set_volume(current)
            time.sleep(0.03)

    except:
        pass


def restore_music():
    try:
        current = pygame.mixer.music.get_volume()

        while current < 0.75:
            current += 0.05
            pygame.mixer.music.set_volume(current)
            time.sleep(0.03)

    except:
        pass


def _speak_thread(message):
    global is_speaking

    try:
        # Smoothly lower music
        lower_music()

        engine = pyttsx3.init()

        engine.setProperty("rate", 155)
        engine.setProperty("volume", 1.0)

        engine.say(message)
        engine.runAndWait()

        # Smoothly restore music
        restore_music()

    except Exception as e:
        print("Voice error:", e)

    is_speaking = False


def speak(message, force=False):
    global last_spoken_time
    global is_speaking

    if not message:
        return

    current_time = time.time()

    if is_speaking:
        return

    if (
        not force
        and current_time - last_spoken_time < voice_cooldown
    ):
        return

    last_spoken_time = current_time

    is_speaking = True

    thread = threading.Thread(
        target=_speak_thread,
        args=(message,),
        daemon=True
    )

    thread.start()