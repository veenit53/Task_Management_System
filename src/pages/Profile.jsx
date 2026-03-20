import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [userRes, tasksRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_BASE_URL}/tasks`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        // API returns { success: true, user: { fullname, username, ... } }
        setUser(userRes.data.user);
        setTasks(tasksRes.data);
      } catch {
        console.log("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Build display name from fullname object
  const displayName = user?.fullname
    ? `${user.fullname.firstname} ${user.fullname.lastname || ""}`.trim()
    : user?.username || "User";

  const avatarLetter = displayName.charAt(0).toUpperCase();

  const taskCounts = {
    todo: tasks.filter((t) => t.status === "todo").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  const statusCards = [
    { label: "To Do",       count: taskCounts.todo,          bg: "bg-gray-50",  text: "text-gray-700",  border: "border-gray-200",  dot: "bg-gray-400"  },
    { label: "In Progress", count: taskCounts["in-progress"], bg: "bg-blue-50",  text: "text-blue-700",  border: "border-blue-200",  dot: "bg-blue-500"  },
    { label: "Done",        count: taskCounts.done,           bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400 font-sans">
      Loading profile...
    </div>
  );

  // ── Guest view ──────────────────────────────────────────────
  if (!isLoggedIn) return (
    <div className="min-h-screen bg-gray-100 font-sans pb-20">
      <nav className="bg-gray-900 px-5 py-3 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <span className="text-white text-lg font-bold">✅ TaskApp</span>
        <button
          onClick={() => navigate("/login")}
          className="bg-white text-gray-900 text-sm font-semibold rounded-lg px-4 py-1.5 hover:bg-gray-200 transition"
        >
          Login
        </button>
      </nav>

      <div className="max-w-lg mx-auto mt-24 px-6 flex flex-col items-center text-center gap-5">
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-4xl">
          👤
        </div>
        <h2 className="text-xl font-bold text-gray-800">You're not logged in</h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          Login to see your profile, track your tasks, and sync everything across devices.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="w-full py-3.5 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-700 transition shadow-md"
        >
          Login to your account
        </button>
        <button
          onClick={() => navigate("/")}
          className="text-sm text-gray-400 hover:text-gray-600 transition"
        >
          ← Back to Tasks
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2.5">
        <button onClick={() => navigate("/")} className="text-2xl bg-transparent border-none cursor-pointer">🏠</button>
        <button
          onClick={() => navigate("/create-task?guest=true")}
          className="bg-gray-900 text-white w-12 h-12 rounded-full text-2xl flex items-center justify-center -mt-5 shadow-lg hover:bg-gray-700 transition"
        >+</button>
        <button className="text-2xl bg-transparent border-none cursor-pointer opacity-40">👤</button>
      </div>
    </div>
  );

  // ── Logged-in view ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-20">

      <nav className="bg-gray-900 px-5 py-3 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <span className="text-white text-lg font-bold">✅ TaskApp</span>
        <button
          onClick={handleLogout}
          className="text-white text-sm border border-gray-600 rounded-lg px-4 py-1.5 hover:bg-gray-700 transition"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-lg mx-auto mt-6 px-4 flex flex-col gap-4">

        {/* Avatar + Name + Username */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center text-center gap-3">
          <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center text-3xl font-bold text-white">
            {avatarLetter}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{displayName}</h2>
            <p className="text-sm text-gray-400 mt-0.5">@{user?.username}</p>
          </div>
          <span className="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full">
            ✅ Logged in
          </span>
        </div>

        {/* Total Tasks */}
        <div className="bg-white rounded-2xl px-5 py-4 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Total Tasks</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{tasks.length}</p>
          </div>
          <div className="text-4xl">📋</div>
        </div>

        {/* Status Breakdown */}
        <div className="grid grid-cols-3 gap-3">
          {statusCards.map(({ label, count, bg, text, border, dot }) => (
            <div key={label} className={`${bg} border ${border} rounded-2xl p-4 flex flex-col gap-2`}>
              <div className={`w-2.5 h-2.5 rounded-full ${dot}`} />
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className={`text-xs font-semibold ${text}`}>{label}</p>
            </div>
          ))}
        </div>

        {/* View Tasks */}
        <button
          onClick={() => navigate("/")}
          className="w-full py-3.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition shadow-sm text-sm"
        >
          📋 View All Tasks
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-3.5 bg-white border border-red-200 text-red-500 font-semibold rounded-2xl hover:bg-red-50 transition shadow-sm text-sm"
        >
          🚪 Logout
        </button>

      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2.5">
        <button onClick={() => navigate("/")} className="text-2xl bg-transparent border-none cursor-pointer">🏠</button>
        <button
          onClick={() => navigate("/create-task")}
          className="bg-gray-900 text-white w-12 h-12 rounded-full text-2xl flex items-center justify-center -mt-5 shadow-lg hover:bg-gray-700 transition"
        >+</button>
        <button className="text-2xl bg-transparent border-none cursor-pointer opacity-40">👤</button>
      </div>

    </div>
  );
};

export default Profile;