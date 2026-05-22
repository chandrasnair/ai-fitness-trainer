class RepCounter:
    def __init__(self, max_reps=20):
        self.count = 0
        self.max_reps = max_reps

        self.state_history = []
        self.cooldown = 0
        self.last_rep_counted = False

        self.went_down = False
        self.reached_bottom = False
        self.squat_frames = 0

    def update(self, state):
        self.last_rep_counted = False

        if self.cooldown > 0:
            self.cooldown -= 1

        self.state_history.append(state)

        if len(self.state_history) > 8:
            self.state_history.pop(0)

        stable_state = max(
            set(self.state_history),
            key=self.state_history.count
        )

        if stable_state == "BENDING":
            self.went_down = True

        elif stable_state == "SQUAT":
            self.squat_frames += 1

            if self.squat_frames >= 8:
                self.reached_bottom = True

        elif stable_state == "STANDING":
            if (
                self.went_down
                and self.reached_bottom
                and self.cooldown == 0
            ):
                self.count += 1
                self.cooldown = 25
                self.last_rep_counted = True

            self.went_down = False
            self.reached_bottom = False
            self.squat_frames = 0

        return self.count

    def did_count_rep(self):
        return self.last_rep_counted

    def is_complete(self):
        return self.count >= self.max_reps