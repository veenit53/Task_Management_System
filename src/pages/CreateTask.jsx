import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const CreateTask = () => {
  const [form, setForm] = useState({ title: "", description: "", priority: "medium", dueDate: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showGuestMsg, setShowGuestMsg] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const isGuest = !isLoggedIn || new URLSearchParams(location.search).get("guest") === "true";

  const priorityOptions = [
    { value: "low",    emoji: "🟢", color: "text-green-600", border: "border-green-400", bg: "bg-green-50" },
    { value: "medium", emoji: "🟡", color: "text-amber-500", border: "border-amber-400", bg: "bg-amber-50" },
    { value: "high",   emoji: "🔴", color: "text-red-500",   border: "border-red-400",   bg: "bg-red-50"   },
  ];

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setError("Please enter a title for your task.");
      return;
    }
    setError("");

    if (isGuest) {
      const existing = JSON.parse(localStorage.getItem("guestTasks") || "[]");
      const newTask = { ...form, id: Date.now(), status: "todo" };
      localStorage.setItem("guestTasks", JSON.stringify([...existing, newTask]));
      navigate("/");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_BASE_URL}/tasks`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      setShowGuestMsg(true);
      setTimeout(() => setShowGuestMsg(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-24">

      {/* Top Navbar */}
      <nav className="bg-gray-900 px-5 py-3 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <button
          onClick={() => navigate("/")}
          className="text-white text-2xl bg-transparent border-none cursor-pointer"
        >
          ✅
        </button>
        <span className="text-white text-base font-bold">New Task</span>
        {isLoggedIn ? (
          <button
            onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}
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
      {isGuest && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-5 py-2.5 flex justify-between items-center">
          <p className="text-xs text-yellow-800">
            👋 Guest mode — this task will only be saved on this device.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-amber-400 text-white text-xs font-semibold px-3 py-1 rounded-md hover:bg-amber-500 transition"
          >
            Login to Sync
          </button>
        </div>
      )}

      {/* Guest Toast */}
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

      {/* Form */}
      <div className="max-w-lg mx-auto mt-6 px-4 flex flex-col gap-4">

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
            ⚠️ {error}
          </div>
        )}

        {/* Title */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={form.title}
            onChange={e => { setForm({ ...form, title: e.target.value }); setError(""); }}
            className="w-full mt-2 pb-2 border-b-2 border-gray-100 focus:border-gray-400 text-base text-gray-900 outline-none bg-transparent transition"
          />
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Description</label>
          <textarea
            placeholder="Add some details... (optional)"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full mt-2 pb-2 border-b-2 border-gray-100 focus:border-gray-400 text-sm text-gray-500 outline-none bg-transparent resize-none transition font-sans"
          />
        </div>

        {/* Priority */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Priority</label>
          <div className="flex gap-2 mt-3">
            {priorityOptions.map(({ value, emoji, color, border, bg }) => {
              const isActive = form.priority === value;
              return (
                <button
                  key={value}
                  onClick={() => setForm({ ...form, priority: value })}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold capitalize transition border-2
                    ${isActive
                      ? `${bg} ${border} ${color}`
                      : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"}`}
                >
                  {emoji} {value}
                </button>
              );
            })}
          </div>
        </div>

        {/* Due Date */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Due Date</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={e => setForm({ ...form, dueDate: e.target.value })}
            className="w-full mt-2 pb-2 border-b-2 border-gray-100 focus:border-gray-400 text-sm text-gray-500 outline-none bg-transparent transition"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-4 rounded-2xl text-white text-base font-bold shadow-md transition
            ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-700 cursor-pointer"}`}
        >
          {loading ? "Creating..." : isGuest ? "💾 Save Task Locally" : "✅ Create Task"}
        </button>

      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2.5">
        <button
          onClick={() => navigate("/")}
          className="text-2xl bg-transparent border-none cursor-pointer"
        >🏠</button>
        <button
          disabled
          className="bg-gray-900 text-white w-12 h-12 rounded-full text-2xl flex items-center justify-center -mt-5 shadow-lg opacity-40 cursor-default"
        >+</button>
        <button
          onClick={handleProfileClick}
          className="text-2xl bg-transparent border-none cursor-pointer"
        >👤</button>
      </div>

    </div>
  );
};

export default CreateTask;