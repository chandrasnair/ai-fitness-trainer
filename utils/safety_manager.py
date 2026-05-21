# -------------------------
# SAFETY MANAGER
# -------------------------

def is_safe_to_continue(current_reps, max_reps):
    """
    Prevents user from overdoing reps
    """
    if current_reps >= max_reps:
        return False
    return True


def should_stop_workout(current_reps, max_reps, time_left):
    """
    Stops workout if:
    - reps exceeded OR
    - time is over
    """
    if current_reps >= max_reps:
        return True

    if time_left <= 0:
        return True

    return False


def warning_level(current_reps, max_reps):
    """
    Gives intensity feedback (for UI later)
    """
    ratio = current_reps / max_reps

    if ratio < 0.7:
        return "SAFE"
    elif ratio < 1.0:
        return "WARNING"
    else:
        return "DANGER"