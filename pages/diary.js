import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { auth, database } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import dayjs from "dayjs";
import FileSaver from "file-saver";

export default function Diary() {
  const [user, setUser] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadWorkoutHistory(currentUser.uid, selectedMonth);
      }
    });
  }, [selectedMonth]);

  const loadWorkoutHistory = (userId, month) => {
    const workoutRef = ref(database, `workouts/${userId}`);
    onValue(workoutRef, (snapshot) => {
      const data = {};
      snapshot.forEach((childSnapshot) => {
        const date = childSnapshot.key;
        if (dayjs(date).isSame(month, "month")) {
          data[date] = childSnapshot.val();
        }
      });
      setWorkoutHistory(data);
    });
  };

  const handleMonthChange = (direction) => {
    setSelectedMonth(selectedMonth.add(direction, "month"));
  };

  const downloadWorkouts = () => {
    const workouts = [];

    Object.keys(workoutHistory).forEach((date) => {
      const workoutsOnDate = workoutHistory[date];

      Object.values(workoutsOnDate).forEach((workout) => {
        workout.sets.forEach((set) => {
          workouts.push({
            date,
            exerciseName: workout.exerciseName,
            reps: set.reps,
            weight: set.weight,
          });
        });
      });
    });

    const csvContent = [
      ["Date", "Exercise", "Reps", "Weight"],
      ...workouts.map((row) => [
        row.date,
        row.exerciseName,
        row.reps,
        row.weight,
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    FileSaver.saveAs(blob, "workouts.csv");
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-4">Diary</h1>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => handleMonthChange(-1)}
            className="bg-gray-700 hover:bg-gray-600 text-lg font-semibold px-4 py-2 rounded-lg"
          >
            Previous Month
          </button>
          <h2 className="text-2xl">{selectedMonth.format("MMMM YYYY")}</h2>
          <button
            onClick={() => handleMonthChange(1)}
            className="bg-gray-700 hover:bg-gray-600 text-lg font-semibold px-4 py-2 rounded-lg"
          >
            Next Month
          </button>
        </div>

        <div className="flex justify-end mb-4">
          <button
            onClick={downloadWorkouts}
            className="bg-green-600 hover:bg-green-700 text-lg font-semibold px-4 py-2 rounded-lg"
          >
            Download Workouts
          </button>
        </div>

        <div>
          {Object.keys(workoutHistory).length > 0 ? (
            <ul className="space-y-4">
              {Object.entries(workoutHistory).map(([date, workouts]) => (
                <li key={date} className="bg-gray-700 p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold">
                    {dayjs(date).format("MMMM D, YYYY")}
                  </h3>
                  {Object.values(workouts).map((workout, index) => (
                    <div key={index} className="mt-2">
                      <strong>{workout.exerciseName}</strong>
                      <ul className="ml-4 mt-2 space-y-1">
                        {workout.sets.map((set, i) => (
                          <li key={i}>
                            Set {i + 1}: {set.reps} reps @ {set.weight} lbs
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-lg">No workouts recorded for this month.</p>
          )}
        </div>
      </div>
    </div>
  );
}
