import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
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
  }, []);

  const priorityColor = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#22c55e",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "sans-serif", paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ background: "#fff", padding: "16px 20px", borderBottom: "1px solid #e5e5e5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111" }}>My Tasks</h1>
        <span style={{ fontSize: 13, color: "#888" }}>{tasks.length} tasks</span>
      </div>

      {/* Task List */}
      <div style={{ maxWidth: 500, margin: "20px auto", padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {tasks.map((task) => (
          <div
            key={task._id}
            onClick={() => navigate(`/task/${task._id}`)}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
              cursor: "pointer",
            }}
          >
            <div style={{
              width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
              background: priorityColor[task.priority] || "#aaa",
            }} />

            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: 15, fontWeight: 500, color: "#111",
                textDecoration: task.status === "done" ? "line-through" : "none",
                opacity: task.status === "done" ? 0.5 : 1,
              }}>
                {task.title}
              </p>
              {task.dueDate && (
                <p style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>Due {task.dueDate}</p>
              )}
            </div>

            <span style={{
              fontSize: 11, padding: "3px 10px", borderRadius: 20,
              background: task.status === "done" ? "#dcfce7" : task.status === "in-progress" ? "#dbeafe" : "#f3f4f6",
              color: task.status === "done" ? "#16a34a" : task.status === "in-progress" ? "#2563eb" : "#666",
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}>
              {task.status === "in-progress" ? "In Progress" : task.status === "done" ? "Done" : "To Do"}
            </span>
          </div>
        ))}

        {tasks.length === 0 && (
          <p style={{ textAlign: "center", color: "#aaa", marginTop: 60, fontSize: 14 }}>No tasks yet. Add one!</p>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#fff", borderTop: "1px solid #e5e5e5",
        display: "flex", justifyContent: "space-around", alignItems: "center",
        padding: "10px 0",
      }}>
        <button onClick={() => navigate("/home")} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>🏠</button>
        <button
          onClick={() => navigate("/create-task")}
          style={{
            background: "#111", color: "#fff", border: "none",
            width: 48, height: 48, borderRadius: "50%", fontSize: 24,
            cursor: "pointer", marginTop: -20,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >+</button>
        <button onClick={() => navigate("/profile")} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>👤</button>
      </div>
    </div>
  );
};

export default Home;