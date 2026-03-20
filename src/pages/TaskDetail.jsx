import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      const guestTasks = JSON.parse(localStorage.getItem("guestTasks") || "[]");
      const found = guestTasks.find((t) => String(t.id) === String(id));
      found ? setTask(found) : navigate("/");
      setLoading(false);
      return;
    }
    const fetchTask = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTask(res.data);
      } catch {
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const updateStatus = async (status) => {
    if (updating) return;
    setUpdating(true);
    if (!isLoggedIn) {
      const guestTasks = JSON.parse(localStorage.getItem("guestTasks") || "[]");
      const updated = guestTasks.map((t) => String(t.id) === String(id) ? { ...t, status } : t);
      localStorage.setItem("guestTasks", JSON.stringify(updated));
      setTask((prev) => ({ ...prev, status }));
      setUpdating(false);
      return;
    }
    try {
      const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/tasks/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTask(res.data);
    } catch {
      alert("Couldn't update status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const deleteTask = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    setDeleting(true);
    if (!isLoggedIn) {
      const guestTasks = JSON.parse(localStorage.getItem("guestTasks") || "[]");
      localStorage.setItem("guestTasks", JSON.stringify(guestTasks.filter((t) => String(t.id) !== String(id))));
      navigate("/");
      return;
    }
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
    } catch {
      alert("Couldn't delete task. Please try again.");
      setDeleting(false);
    }
  };

  const priorityColor = { high: "text-red-500", medium: "text-amber-500", low: "text-green-500" };
  const priorityBg    = { high: "bg-red-50",    medium: "bg-amber-50",    low: "bg-green-50"   };
  const priorityDot   = { high: "bg-red-500",   medium: "bg-amber-400",   low: "bg-green-500"  };

  const statusConfig = {
    todo:          { label: "To Do",       badge: "bg-gray-100 text-gray-500"   },
    "in-progress": { label: "In Progress", badge: "bg-blue-100 text-blue-700"   },
    done:          { label: "Done",        badge: "bg-green-100 text-green-700" },
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400 font-sans">
      Loading task...
    </div>
  );

  if (!task) return null;

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-10">

      {/* Top Navbar */}
      <nav className="bg-gray-900 px-5 py-3 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <button onClick={() => navigate("/")} className="text-white text-2xl bg-transparent border-none cursor-pointer">
          ✅
        </button>
        <span className="text-white text-base font-bold">Task Details</span>
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

      <div className="max-w-lg mx-auto mt-6 px-4 flex flex-col gap-4">

        {/* Title Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 ${priorityBg[task.priority] || "bg-gray-100"}`}>
            <div className={`w-2 h-2 rounded-full ${priorityDot[task.priority] || "bg-gray-400"}`} />
            <span className={`text-xs font-bold uppercase tracking-wide ${priorityColor[task.priority] || "text-gray-500"}`}>
              {task.priority || "No"} Priority
            </span>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2 leading-snug">{task.title}</h2>

          {task.description ? (
            <p className="text-sm text-gray-500 leading-relaxed mb-3">{task.description}</p>
          ) : (
            <p className="text-sm text-gray-300 italic mb-3">No description added.</p>
          )}

          {task.dueDate && (
            <div className="flex items-center gap-1.5">
              <span className="text-sm">📅</span>
              <span className="text-xs text-gray-400">Due {task.dueDate}</span>
            </div>
          )}
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Current Status</p>

          <div className="flex gap-2">
            {["todo", "in-progress", "done"].map((s) => {
              const isActive = task.status === s;
              return (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={updating}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition
                    ${isActive
                      ? "bg-gray-900 text-white border-2 border-gray-900"
                      : "bg-white text-gray-400 border border-gray-200 hover:border-gray-400"}
                    ${updating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {statusConfig[s].label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 mt-4">
            <span className="text-xs text-gray-400">Marked as</span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusConfig[task.status]?.badge || "bg-gray-100 text-gray-500"}`}>
              {statusConfig[task.status]?.label || "To Do"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex-1 py-3.5 rounded-xl bg-white text-gray-700 text-sm font-semibold border border-gray-200 hover:bg-gray-50 transition"
          >
            ← Back to Tasks
          </button>
          <button
            onClick={deleteTask}
            disabled={deleting}
            className={`flex-1 py-3.5 rounded-xl text-sm font-semibold border border-red-200 text-red-500 transition
              ${deleting ? "opacity-60 cursor-not-allowed bg-red-50" : "bg-white hover:bg-red-50 cursor-pointer"}`}
          >
            {deleting ? "Deleting..." : "🗑 Delete Task"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default TaskDetails;