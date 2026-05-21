import math

# -------------------------
# ANGLE CALCULATION
# -------------------------
def calculate_angle(a, b, c):
    a = [a.x, a.y]
    b = [b.x, b.y]
    c = [c.x, c.y]

    ba = [a[0] - b[0], a[1] - b[1]]
    bc = [c[0] - b[0], c[1] - b[1]]

    cosine_angle = (ba[0]*bc[0] + ba[1]*bc[1]) / (
        math.sqrt(ba[0]**2 + ba[1]**2) * math.sqrt(bc[0]**2 + bc[1]**2)
    )

    angle = math.degrees(math.acos(cosine_angle))
    return angle


# -------------------------
# MAIN POSTURE LOGIC
# -------------------------
def get_state(pose, config):

    # default joints for squat (can expand later via JSON)
    hip = pose[23]
    knee = pose[25]
    ankle = pose[27]

    angle = calculate_angle(hip, knee, ankle)

    # thresholds from config (fallback if missing)
    stand = config.get("stand_angle", 165)
    bend = config.get("bend_angle", 95)

    # STABLE CLASSIFICATION
    if angle > stand:
        state = "STANDING"

    elif angle > bend:
        state = "BENDING"

    else:
        state = "SQUAT"

    return state, angle