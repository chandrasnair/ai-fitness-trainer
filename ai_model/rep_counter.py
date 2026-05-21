class RepCounter:
    def __init__(self, max_reps=20):
        self.count = 0
        self.max_reps = max_reps

        self.state_history = []
        self.cooldown = 0

        self.last_valid_state = "STANDING"

    def update(self, state):

        # reduce cooldown every frame
        if self.cooldown > 0:
            self.cooldown -= 1

        # store last few states (stability check)
        self.state_history.append(state)
        if len(self.state_history) > 5:
            self.state_history.pop(0)

        # majority voting (prevents flicker)
        stable_state = max(set(self.state_history),
                           key=self.state_history.count)

        # REP RULE:
        # SQUAT -> STANDING = 1 rep
        if (self.last_valid_state == "SQUAT"
                and stable_state == "STANDING"
                and self.cooldown == 0):

            self.count += 1
            self.cooldown = 15   # prevents double counting

        self.last_valid_state = stable_state

        return self.count

    def is_complete(self):
        return self.count >= self.max_reps