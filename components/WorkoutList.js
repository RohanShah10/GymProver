export default function WorkoutList({
  workouts,
  onDeleteWorkout,
  onEditSet,
  onDuplicateSet,
  onDeleteSet,
}) {
  return (
    <div>
      {workouts.map((workout, index) => (
        <div
          key={workout.key}
          className="bg-gray-800 p-4 mb-4 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold mb-2">{workout.exerciseName}</h2>
          {workout.sets.map((set, setIndex) => (
            <div
              key={setIndex}
              className="flex justify-between items-center bg-gray-700 p-2 rounded mb-2"
            >
              <div>
                <p>Reps: {set.reps}</p>
                <p>Weight: {set.weight} lbs</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEditSet(workout.key, setIndex, set)}
                  className="bg-blue-500 hover:bg-blue-400 text-white text-sm px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDuplicateSet(workout.key, set)}
                  className="bg-green-500 hover:bg-green-400 text-white text-sm px-2 py-1 rounded"
                >
                  Duplicate
                </button>
                <button
                  onClick={() => onDeleteSet(workout.key, setIndex)}
                  className="bg-red-600 hover:bg-red-500 text-white text-sm px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => onDeleteWorkout(workout.key)}
            className="bg-red-600 hover:bg-red-500 text-white text-sm px-2 py-1 rounded"
          >
            Delete Workout
          </button>
        </div>
      ))}
    </div>
  );
}
