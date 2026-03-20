import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateTask = () => {
  const [form, setForm] = useState({ title: "", description: "", priority: "medium", dueDate: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    if (!form.title.trim()) return alert("Title is required");
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_BASE_URL}/tasks`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "sans-serif" }}>

      {/* Header */}
      <div style={{ background: "#fff", padding: "16px 20px", borderBottom: "1px solid #e5e5e5", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>←</button>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>New Task</h1>
      </div>

      {/* Form */}
      <div style={{ maxWidth: 500, margin: "24px auto", padding: "0 16px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Title */}
        <div>
          <label style={{ fontSize: 13, color: "#555", fontWeight: 500 }}>Title *</label>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            style={{
              width: "100%", marginTop: 6, padding: "12px 14px",
              borderRadius: 10, border: "1px solid #e5e5e5",
              fontSize: 15, outline: "none", background: "#fff",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Description */}
        <div>
          <label style={{ fontSize: 13, color: "#555", fontWeight: 500 }}>Description</label>
          <textarea
            placeholder="Add some details..."
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            rows={3}
            style={{
              width: "100%", marginTop: 6, padding: "12px 14px",
              borderRadius: 10, border: "1px solid #e5e5e5",
              fontSize: 15, outline: "none", background: "#fff",
              resize: "none", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Priority */}
        <div>
          <label style={{ fontSize: 13, color: "#555", fontWeight: 500 }}>Priority</label>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            {["low", "medium", "high"].map(p => (
              <button
                key={p}
                onClick={() => setForm({ ...form, priority: p })}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 10, cursor: "pointer",
                  border: form.priority === p ? "2px solid #111" : "1px solid #e5e5e5",
                  background: form.priority === p ? "#111" : "#fff",
                  color: form.priority === p ? "#fff" : "#555",
                  fontWeight: 600, fontSize: 13,
                  textTransform: "capitalize",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label style={{ fontSize: 13, color: "#555", fontWeight: 500 }}>Due Date</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={e => setForm({ ...form, dueDate: e.target.value })}
            style={{
              width: "100%", marginTop: 6, padding: "12px 14px",
              borderRadius: 10, border: "1px solid #e5e5e5",
              fontSize: 15, outline: "none", background: "#fff",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            marginTop: 8, padding: "14px", borderRadius: 12,
            background: "#111", color: "#fff", border: "none",
            fontSize: 16, fontWeight: 600, cursor: "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Creating..." : "Create Task"}
        </button>
      </div>
    </div>
  );
};

export default CreateTask;