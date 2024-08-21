import { useState } from "react";
import SetGroup from "./SetGroup";

export default function WorkoutForm({ onAddWorkout }) {
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState([{ reps: "", weight: "" }]);

  const addSet = () => {
    setSets([...sets, { reps: "", weight: "" }]);
  };

  const removeSet = (index) => {
    const newSets = sets.filter((_, i) => i !== index);
    setSets(newSets);
  };

  const handleSetChange = (index, field, value) => {
    const newSets = [...sets];
    newSets[index][field] = value;
    setSets(newSets);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddWorkout({ exerciseName, sets });
    setExerciseName("");
    setSets([{ reps: "", weight: "" }]);
  };

  return (
    <div className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md mb-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium mb-2">Exercise</label>
          <input
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            type="text"
            placeholder="Enter exercise name"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            required
          />
        </div>
        {sets.map((set, index) => (
          <SetGroup
            key={index}
            index={index}
            set={set}
            onSetChange={handleSetChange}
            onRemoveSet={() => removeSet(index)}
          />
        ))}
        <div className="flex justify-between space-x-4">
          <button
            type="button"
            onClick={addSet}
            className="bg-green-600 hover:bg-green-700 text-lg font-semibold p-3 rounded-lg transition-transform transform hover:scale-105"
          >
            Add Another Set
          </button>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-lg font-semibold p-3 rounded-lg transition-transform transform hover:scale-105"
          >
            Add Workout
          </button>
        </div>
      </form>
    </div>
  );
}
