import math


def calculate_angle(a, b, c):
    a = [a.x, a.y]
    b = [b.x, b.y]
    c = [c.x, c.y]

    ba = [a[0] - b[0], a[1] - b[1]]
    bc = [c[0] - b[0], c[1] - b[1]]

    cosine_angle = (ba[0] * bc[0] + ba[1] * bc[1]) / (
        math.sqrt(ba[0] ** 2 + ba[1] ** 2) *
        math.sqrt(bc[0] ** 2 + bc[1] ** 2)
    )

    cosine_angle = max(min(cosine_angle, 1.0), -1.0)

    return math.degrees(math.acos(cosine_angle))


def get_state(pose, config):
    hip = pose[23]
    knee = pose[25]
    ankle = pose[27]

    angle = calculate_angle(hip, knee, ankle)

    if angle >= 160:
        state = "STANDING"
    elif 110 <= angle < 160:
        state = "BENDING"
    else:
        state = "SQUAT"

    feedback = ""

    return state, angle, feedback