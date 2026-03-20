import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [guestTasks, setGuestTasks] = useState([]);
  const [showGuestMsg, setShowGuestMsg] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  useEffect(() => {
    if (isLoggedIn) {
      const fetchTasks = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/tasks`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setTasks(res.data);
        } catch {
          console.log("Fetch error");
        }
      };
      fetchTasks();
    } else {
      const saved = JSON.parse(localStorage.getItem("guestTasks") || "[]");
      setGuestTasks(saved);
    }
  }, []);

  const allTasks = isLoggedIn ? tasks : guestTasks;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      setShowGuestMsg(true);
      setTimeout(() => setShowGuestMsg(false), 3000);
    }
  };

  const priorityDot = {
    high: "bg-red-500",
    medium: "bg-amber-400",
    low: "bg-green-500",
  };

  const statusStyle = {
    done: "bg-green-100 text-green-700",
    "in-progress": "bg-blue-100 text-blue-700",
    todo: "bg-gray-100 text-gray-500",
  };

  const statusLabel = {
    done: "Done",
    "in-progress": "In Progress",
    todo: "To Do",
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-20">

      {/* Top Navbar */}
      <nav className="bg-gray-900 px-5 py-3 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <span className="text-white text-lg font-bold">✅ TaskApp</span>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-white text-sm border border-gray-600 rounded-lg px-4 py-1.5 hover:bg-gray-700 transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-gray-900 text-sm font-semibold rounded-lg px-4 py-1.5 hover:bg-gray-200 transition"
          >
            Login
          </button>
        )}
      </nav>

      {/* Guest Banner */}
      {!isLoggedIn && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-5 py-2.5 flex justify-between items-center">
          <p className="text-xs text-yellow-800">
            👋 You're in guest mode — tasks won't be saved to the cloud.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-amber-400 text-white text-xs font-semibold px-3 py-1 rounded-md hover:bg-amber-500 transition"
          >
            Login to Save
          </button>
        </div>
      )}

      {/* Guest toast msg */}
      {showGuestMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 whitespace-nowrap">
          🔒 Please login to view your profile
          <button
            onClick={() => navigate("/login")}
            className="ml-2 text-amber-400 font-bold hover:text-amber-300 transition"
          >
            Login →
          </button>
        </div>
      )}

      {/* Section Header */}
      <div className="bg-white px-5 py-4 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">My Tasks</h1>
        <span className="text-sm text-gray-400">{allTasks.length} tasks</span>
      </div>

      {/* Task List */}
      <div className="max-w-lg mx-auto mt-5 px-4 flex flex-col gap-3">
        {allTasks.map((task) => (
          <div
            key={task._id || task.id}
            onClick={() => navigate(`/task/${task._id || task.id}`)}
            className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm cursor-pointer hover:shadow-md transition"
          >
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${priorityDot[task.priority] || "bg-gray-300"}`} />

            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium text-gray-900 truncate ${task.status === "done" ? "line-through opacity-50" : ""}`}>
                {task.title}
              </p>
              {task.dueDate && (
                <p className="text-xs text-gray-400 mt-0.5">📅 Due {task.dueDate}</p>
              )}
            </div>

            <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${statusStyle[task.status] || "bg-gray-100 text-gray-500"}`}>
              {statusLabel[task.status] || "To Do"}
            </span>
          </div>
        ))}

        {allTasks.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-20">No tasks yet. Hit + to add one!</p>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2.5">
        <button onClick={() => navigate("/")} className="text-2xl bg-transparent border-none cursor-pointer">🏠</button>
        <button
          onClick={() => navigate(isLoggedIn ? "/create-task" : "/create-task?guest=true")}
          className="bg-gray-900 text-white w-12 h-12 rounded-full text-2xl flex items-center justify-center -mt-5 shadow-lg hover:bg-gray-700 transition"
        >+</button>
        <button onClick={handleProfileClick} className="text-2xl bg-transparent border-none cursor-pointer">👤</button>
      </div>

    </div>
  );
};

export default Home;