import { useState } from "react";
import workoutOptions from "../workoutOptions";

export default function WorkoutForm({ onAddOrUpdateWorkout }) {
  const [exerciseName, setExerciseName] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(workoutOptions);
  const [sets, setSets] = useState([{ reps: "", weight: "" }]);

  const handleExerciseNameChange = (e) => {
    const value = e.target.value;
    setExerciseName(value);

    // Filter the options based on the current input
    const filtered = workoutOptions.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleSetChange = (index, e) => {
    const { name, value } = e.target;
    const newSets = [...sets];
    newSets[index][name] = value;
    setSets(newSets);
  };

  const addSet = () => {
    setSets([...sets, { reps: "", weight: "" }]);
  };

  const deleteSet = (index) => {
    const newSets = sets.filter((_, i) => i !== index);
    setSets(newSets);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (exerciseName && sets.every((set) => set.reps && set.weight)) {
      onAddOrUpdateWorkout({ exerciseName, sets });
      setExerciseName("");
      setSets([{ reps: "", weight: "" }]);
    } else {
      alert("Please fill out all fields.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-4 rounded-lg shadow-md mb-8"
    >
      <div className="mb-4">
        <label className="block text-white text-sm font-bold mb-2">
          Exercise Name
        </label>
        <input
          type="text"
          value={exerciseName}
          onChange={handleExerciseNameChange}
          className="w-full p-2 rounded bg-gray-700 text-white"
          list="exercise-options"
          placeholder="Start typing or select an option"
        />
        <datalist id="exercise-options">
          {filteredOptions.map((option, index) => (
            <option key={index} value={option} />
          ))}
        </datalist>
      </div>

      <div className="mb-4">
        {sets.map((set, index) => (
          <div key={index} className="flex items-center mb-2 space-x-2">
            <input
              type="number"
              name="reps"
              placeholder="Reps"
              value={set.reps}
              onChange={(e) => handleSetChange(index, e)}
              className="w-1/3 p-2 rounded bg-gray-700 text-white"
            />
            <input
              type="number"
              name="weight"
              placeholder="Weight"
              value={set.weight}
              onChange={(e) => handleSetChange(index, e)}
              className="w-1/3 p-2 rounded bg-gray-700 text-white"
            />
            <button
              type="button"
              onClick={() => deleteSet(index)}
              className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={addSet}
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
        >
          Add Set
        </button>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded"
        >
          Save Workout
        </button>
      </div>
    </form>
  );
}
