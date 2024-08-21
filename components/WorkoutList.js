export default function WorkoutList({ workouts, onDeleteWorkout, onEditSet }) {
  return (
    <div className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md scrollbar">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6">
        Today's Workouts
      </h2>
      <ul className="space-y-4">
        {workouts.map((workout) => (
          <li
            key={workout.key}
            className="bg-gray-700 p-4 sm:p-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            <strong className="block text-lg sm:text-xl mb-4">
              {workout.exerciseName}
            </strong>
            {workout.sets.map((set, index) => (
              <p key={index} className="flex justify-between items-center">
                <span className="text-sm sm:text-lg">
                  Set {index + 1}: {set.reps} reps @ {set.weight} lbs
                </span>
                <span>
                  <button
                    className="text-red-500 hover:text-red-700 ml-4 transition-transform transform hover:scale-110"
                    onClick={() => onDeleteWorkout(workout.key, index)}
                  >
                    Delete
                  </button>
                  <button
                    className="text-blue-500 hover:text-blue-700 ml-2 transition-transform transform hover:scale-110"
                    onClick={() => {
                      const newReps = prompt(
                        "Enter new number of reps:",
                        set.reps
                      );
                      const newWeight = prompt("Enter new weight:", set.weight);
                      if (newReps !== null && newWeight !== null) {
                        onEditSet(workout.key, index, {
                          reps: newReps,
                          weight: newWeight,
                        });
                      }
                    }}
                  >
                    Edit
                  </button>
                </span>
              </p>
            ))}
            <div className="mt-4">
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-transform transform hover:scale-105"
                onClick={() => onDeleteWorkout(workout.key)}
              >
                Delete Workout
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
