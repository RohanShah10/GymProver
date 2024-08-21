// components/SetGroup.js
export default function SetGroup({ index, set, onSetChange, onRemoveSet }) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div>
        <label className="block text-lg font-medium mb-2">
          Set {index + 1} - Reps
        </label>
        <input
          className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          type="number"
          value={set.reps}
          onChange={(e) => onSetChange(index, "reps", e.target.value)}
          placeholder="Enter number of reps"
          required
        />
      </div>
      <div>
        <label className="block text-lg font-medium mb-2">Weight</label>
        <input
          className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          type="number"
          value={set.weight}
          onChange={(e) => onSetChange(index, "weight", e.target.value)}
          placeholder="Enter weight used"
          required
        />
      </div>
      <div className="flex items-end">
        <button
          type="button"
          onClick={onRemoveSet}
          className="bg-red-600 hover:bg-red-700 text-lg font-semibold p-4 rounded-lg w-full transition-transform transform hover:scale-105"
        >
          Remove Set
        </button>
      </div>
    </div>
  );
}
