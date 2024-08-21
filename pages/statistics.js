import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { auth, database } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import dayjs from "dayjs";
import Chart from "chart.js/auto";

export default function Statistics() {
  const [user, setUser] = useState(null);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [totalSets, setTotalSets] = useState(0);
  const [totalReps, setTotalReps] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [exerciseDistribution, setExerciseDistribution] = useState({});
  const [personalRecords, setPersonalRecords] = useState({});
  const [workoutData, setWorkoutData] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadStatistics(currentUser.uid);
      }
    });
  }, []);

  const loadStatistics = (userId) => {
    const workoutRef = ref(database, `workouts/${userId}`);
    let workoutsCount = 0;
    let setsCount = 0;
    let repsCount = 0;
    let weightCount = 0;
    const distribution = {};
    const records = {};
    const progressData = [];

    onValue(workoutRef, (snapshot) => {
      snapshot.forEach((dateSnapshot) => {
        workoutsCount++;
        dateSnapshot.forEach((workoutSnapshot) => {
          const workout = workoutSnapshot.val();
          const { exerciseName, sets } = workout;

          if (!distribution[exerciseName]) {
            distribution[exerciseName] = 0;
          }
          distribution[exerciseName] += 1;

          sets.forEach((set) => {
            setsCount++;
            repsCount += parseInt(set.reps, 10);
            weightCount += parseInt(set.weight, 10);

            if (
              !records[exerciseName] ||
              parseInt(set.weight, 10) > records[exerciseName]
            ) {
              records[exerciseName] = parseInt(set.weight, 10);
            }
          });

          progressData.push({
            date: dateSnapshot.key,
            exerciseName,
            maxWeight: Math.max(...sets.map((set) => parseInt(set.weight, 10))),
          });
        });
      });

      setTotalWorkouts(workoutsCount);
      setTotalSets(setsCount);
      setTotalReps(repsCount);
      setTotalWeight(weightCount);
      setExerciseDistribution(distribution);
      setPersonalRecords(records);
      setWorkoutData(progressData);

      renderProgressChart(progressData);
      renderExerciseDistributionChart(distribution);
    });
  };

  const renderProgressChart = (data) => {
    const ctx = document.getElementById("progressChart").getContext("2d");
    const formattedData = {};

    data.forEach(({ date, exerciseName, maxWeight }) => {
      if (!formattedData[exerciseName]) {
        formattedData[exerciseName] = [];
      }
      formattedData[exerciseName].push({ date, maxWeight });
    });

    const datasets = Object.entries(formattedData).map(
      ([exerciseName, values]) => ({
        label: exerciseName,
        data: values.map((v) => ({
          x: dayjs(v.date).format("MMM D"),
          y: v.maxWeight,
        })),
        fill: false,
        borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
          Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)}, 1)`,
        tension: 0.1,
      })
    );

    new Chart(ctx, {
      type: "line",
      data: {
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: "category",
            labels: [
              ...new Set(data.map(({ date }) => dayjs(date).format("MMM D"))),
            ],
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Max Weight (lbs)",
            },
          },
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              boxWidth: 10,
              boxHeight: 10,
              font: {
                size: 12,
              },
            },
          },
        },
      },
    });
  };

  const renderExerciseDistributionChart = (distribution) => {
    const ctx = document
      .getElementById("exerciseDistributionChart")
      .getContext("2d");

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: Object.keys(distribution),
        datasets: [
          {
            label: "# of Workouts",
            data: Object.values(distribution),
            backgroundColor: Object.keys(distribution).map(
              () =>
                `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                  Math.random() * 255
                )}, ${Math.floor(Math.random() * 255)}, 0.6)`
            ),
            borderColor: Object.keys(distribution).map(
              () =>
                `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                  Math.random() * 255
                )}, ${Math.floor(Math.random() * 255)}, 1)`
            ),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              boxWidth: 10,
              boxHeight: 10,
              font: {
                size: 12,
              },
            },
          },
        },
      },
    });
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">Statistics</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Workout Overview</h2>
            <p className="text-md sm:text-lg">
              Total Workouts: {totalWorkouts}
            </p>
            <p className="text-md sm:text-lg">Total Sets: {totalSets}</p>
            <p className="text-md sm:text-lg">Total Reps: {totalReps}</p>
            <p className="text-md sm:text-lg">
              Total Weight Lifted: {totalWeight} lbs
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Personal Records</h2>
            <ul>
              {Object.entries(personalRecords).map(([exercise, weight]) => (
                <li key={exercise} className="text-md sm:text-lg">
                  {exercise}: {weight} lbs
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Exercise Distribution</h2>
          <div className="relative h-64 sm:h-96">
            <canvas id="exerciseDistributionChart"></canvas>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Progress Over Time</h2>
          <div className="relative h-64 sm:h-96">
            <canvas id="progressChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
