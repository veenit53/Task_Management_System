import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTask(res.data);
      } catch {
        alert("Task not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const updateStatus = async (status) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/tasks/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTask(res.data);
    } catch {
      alert("Failed to update");
    }
  };

  const deleteTask = async () => {
    if (!confirm("Delete this task?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
    } catch {
      alert("Failed to delete");
    }
  };

  const priorityColor = { high: "#ef4444", medium: "#f59e0b", low: "#22c55e" };

  if (loading) return <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>Loading...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "sans-serif" }}>

      {/* Header */}
      <div style={{ background: "#fff", padding: "16px 20px", borderBottom: "1px solid #e5e5e5", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>←</button>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>Task Details</h1>
      </div>

      <div style={{ maxWidth: 500, margin: "24px auto", padding: "0 16px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Title & Priority */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "18px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: priorityColor[task.priority] || "#aaa", flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: priorityColor[task.priority], fontWeight: 600, textTransform: "uppercase" }}>{task.priority} priority</span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 8 }}>{task.title}</h2>
          {task.description && <p style={{ fontSize: 14, color: "#777", lineHeight: 1.5 }}>{task.description}</p>}
          {task.dueDate && <p style={{ fontSize: 12, color: "#aaa", marginTop: 10 }}>Due {task.dueDate}</p>}
        </div>

        {/* Status */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "18px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
          <p style={{ fontSize: 13, color: "#555", fontWeight: 500, marginBottom: 10 }}>Status</p>
          <div style={{ display: "flex", gap: 8 }}>
            {["todo", "in-progress", "done"].map(s => (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 10, cursor: "pointer",
                  border: task.status === s ? "2px solid #111" : "1px solid #e5e5e5",
                  background: task.status === s ? "#111" : "#fff",
                  color: task.status === s ? "#fff" : "#555",
                  fontWeight: 600, fontSize: 12,
                  textTransform: "capitalize",
                }}
              >
                {s === "in-progress" ? "In Progress" : s === "done" ? "Done" : "To Do"}
              </button>
            ))}
          </div>
        </div>

        {/* Delete */}
        <button
          onClick={deleteTask}
          style={{
            padding: "14px", borderRadius: 12,
            background: "#fff", color: "#ef4444",
            border: "1px solid #fecaca",
            fontSize: 15, fontWeight: 600, cursor: "pointer",
          }}
        >
          Delete Task
        </button>
      </div>
    </div>
  );
};

export default TaskDetails;