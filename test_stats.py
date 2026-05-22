from database.stats_manager import get_dashboard_stats

stats = get_dashboard_stats()

print("\n📊 DASHBOARD STATS")
print("------------------")
print("Total Workouts:", stats["total_workouts"])
print("Total Reps:", stats["total_reps"])
print("Calories Burned:", stats["estimated_calories"])
print("Streak Days:", stats["streak_days"])