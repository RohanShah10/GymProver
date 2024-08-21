import { useState, useEffect } from "react";
import { auth, database } from "../firebase/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, onValue, push, remove, update } from "firebase/database";
import WorkoutForm from "../components/WorkoutForm";
import WorkoutList from "../components/WorkoutList";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import Navbar from "../components/Navbar";

export default function Home() {
  const [user, setUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadWorkouts(currentUser.uid, selectedDate);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [selectedDate]);

  const loadWorkouts = (userId, date) => {
    if (!userId || !date) {
      console.error("User ID or date is missing");
      return;
    }

    setLoading(true);
    const workoutRef = ref(
      database,
      `workouts/${userId}/${date.format("YYYY-MM-DD")}`
    );
    onValue(
      workoutRef,
      (snapshot) => {
        const data = [];
        snapshot.forEach((childSnapshot) => {
          data.push({ key: childSnapshot.key, ...childSnapshot.val() });
        });
        setWorkouts(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error loading workouts: ", error);
        setLoading(false);
      }
    );
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Error during logout: ", error);
    }
  };

  const addWorkout = (workout) => {
    if (!user || !selectedDate) {
      console.error("User or selected date is missing");
      return;
    }

    setLoading(true); // Start loading
    const workoutRef = ref(
      database,
      `workouts/${user.uid}/${selectedDate.format("YYYY-MM-DD")}`
    );
    push(workoutRef, workout)
      .then(() => {
        console.log("Workout added successfully");
        setLoading(false); // End loading
      })
      .catch((error) => {
        console.error("Error adding workout: ", error);
        setLoading(false); // End loading
      });
  };

  const deleteWorkout = (workoutKey) => {
    if (!user || !selectedDate || !workoutKey) {
      console.error("Missing parameters for deleting workout");
      return;
    }

    setLoading(true); // Start loading
    const workoutRef = ref(
      database,
      `workouts/${user.uid}/${selectedDate.format("YYYY-MM-DD")}/${workoutKey}`
    );
    remove(workoutRef)
      .then(() => {
        console.log("Workout deleted successfully");
        setLoading(false); // End loading
      })
      .catch((error) => {
        console.error("Error deleting workout: ", error);
        setLoading(false); // End loading
      });
  };

  const editSet = (workoutKey, setIndex, newSet) => {
    if (!user || !selectedDate || !workoutKey) {
      console.error("Missing parameters for editing workout set");
      return;
    }

    setLoading(true); // Start loading
    const workoutRef = ref(
      database,
      `workouts/${user.uid}/${selectedDate.format("YYYY-MM-DD")}/${workoutKey}`
    );
    onValue(
      workoutRef,
      (snapshot) => {
        const workout = snapshot.val();
        if (!workout || !workout.sets || !workout.sets[setIndex]) {
          console.error("Invalid workout or set index");
          setLoading(false);
          return;
        }

        workout.sets[setIndex] = newSet;
        update(workoutRef, workout)
          .then(() => {
            console.log("Workout set updated successfully");
            setLoading(false); // End loading
          })
          .catch((error) => {
            console.error("Error updating workout set: ", error);
            setLoading(false); // End loading
          });
      },
      { onlyOnce: true }
    );
  };

  const duplicateSet = (workoutKey, set) => {
    if (!user || !selectedDate || !workoutKey) {
      console.error("Missing parameters for duplicating workout set");
      return;
    }

    const workoutRef = ref(
      database,
      `workouts/${user.uid}/${selectedDate.format("YYYY-MM-DD")}/${workoutKey}`
    );

    onValue(
      workoutRef,
      (snapshot) => {
        const workout = snapshot.val();

        // Ensure that workout and sets exist and are in the correct format
        if (!workout || !Array.isArray(workout.sets)) {
          console.error("Invalid workout or sets structure");
          return;
        }

        // Add the duplicate set to the array
        const newSet = { ...set };
        workout.sets.push(newSet);

        // Ensure that the structure being sent to Firebase is correct
        update(workoutRef, { sets: workout.sets })
          .then(() => {
            console.log("Set duplicated successfully");
          })
          .catch((error) => {
            console.error("Error duplicating set: ", error);
          });
      },
      { onlyOnce: true }
    );
  };

  const deleteSet = (workoutKey, setIndex) => {
    if (!user || !selectedDate || !workoutKey) {
      console.error("Missing parameters for deleting workout set");
      return;
    }

    const workoutRef = ref(
      database,
      `workouts/${user.uid}/${selectedDate.format("YYYY-MM-DD")}/${workoutKey}`
    );

    onValue(
      workoutRef,
      (snapshot) => {
        const workout = snapshot.val();

        // Ensure that workout and sets exist and are in the correct format
        if (!workout || !Array.isArray(workout.sets)) {
          console.error("Invalid workout or sets structure");
          return;
        }

        // Remove the set at the specified index
        workout.sets.splice(setIndex, 1);

        // Update the workout in Firebase
        update(workoutRef, { sets: workout.sets })
          .then(() => {
            console.log("Set deleted successfully");
          })
          .catch((error) => {
            console.error("Error deleting set: ", error);
          });
      },
      { onlyOnce: true }
    );
  };

  const handleDateChange = (days) => {
    const newDate = selectedDate.add(days, "day");
    const today = dayjs();

    if (newDate.isAfter(today, "day")) {
      return; // Do nothing if the new date is in the future
    }

    setSelectedDate(newDate);
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Gym Tracker</h1>
          <div className="flex justify-center items-center mb-4 space-x-4">
            <button
              onClick={() => handleDateChange(-1)}
              className="bg-gray-700 hover:bg-gray-600 text-lg font-semibold px-4 py-2 rounded-lg transition-transform transform hover:scale-105"
            >
              Previous Day
            </button>
            <h2 className="text-xl sm:text-2xl">
              {selectedDate.format("MMMM D, YYYY")}
            </h2>
            <button
              onClick={() => handleDateChange(1)}
              className="bg-gray-700 hover:bg-gray-600 text-lg font-semibold px-4 py-2 rounded-lg transition-transform transform hover:scale-105"
              disabled={selectedDate.isSame(dayjs(), "day")}
            >
              Next Day
            </button>
          </div>
        </div>
        {loading ? (
          <div className="text-center text-lg">Loading...</div>
        ) : (
          <>
            <WorkoutForm onAddWorkout={addWorkout} />
            <WorkoutList
              workouts={workouts}
              onDeleteWorkout={deleteWorkout}
              onEditSet={editSet}
              onDuplicateSet={duplicateSet}
              onDeleteSet={deleteSet}
            />
          </>
        )}
      </div>
    </div>
  );
}
