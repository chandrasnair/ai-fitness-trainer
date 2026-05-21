import time

_start_time = None
_duration = 0
_paused_time = 0
_is_running = False


# -------------------------
# START / RESUME TIMER
# -------------------------
def start_timer(duration):
    global _start_time, _duration, _is_running, _paused_time

    _duration = duration

    # resume support
    if _paused_time != 0:
        _start_time = time.time() - _paused_time
    else:
        _start_time = time.time()

    _is_running = True


# -------------------------
# PAUSE TIMER (for future use)
# -------------------------
def pause_timer():
    global _paused_time, _is_running

    if _start_time is not None:
        _paused_time = time.time() - _start_time
        _is_running = False


# -------------------------
# TIME REMAINING
# -------------------------
def time_remaining():
    if _start_time is None:
        return 0

    elapsed = time.time() - _start_time
    remaining = _duration - elapsed

    return max(0, int(remaining))


# -------------------------
# CHECK TIMER STATUS
# -------------------------
def is_time_over():
    return time_remaining() <= 0


# -------------------------
# RESET TIMER
# -------------------------
def reset_timer():
    global _start_time, _duration, _paused_time, _is_running

    _start_time = None
    _duration = 0
    _paused_time = 0
    _is_running = False