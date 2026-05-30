import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

const AddJob = () => {
  const [form, setForm] = useState({
    company: "",
    position: "",
    status: "Pending",
    jobLocation: "Remote",
    jobType: "Full-time",
  });
  const [error, setError] = useState("");
  const { token } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://job-tracker2.onrender.com/api/v1/jobs", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add job");
    }
  };

  const inputStyle = {
    display: "block", width: "100%", padding: "10px 14px",
    borderRadius: "8px", border: "1px solid #ddd",
    fontSize: "14px", marginBottom: "1rem",
    outline: "none", background: "#fff",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", width: "440px", maxWidth: "90vw", border: "1px solid #eee" }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
          <button onClick={() => navigate("/dashboard")}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", padding: "0" }}>
            ←
          </button>
          <h2 style={{ fontSize: "18px", fontWeight: "600" }}>Add New Job</h2>
        </div>

        {error && <p style={{ color: "red", marginBottom: "1rem", fontSize: "14px" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: "13px", color: "#666", marginBottom: "4px", display: "block" }}>Company</label>
          <input type="text" placeholder="e.g. Google" value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            style={inputStyle} required />

          <label style={{ fontSize: "13px", color: "#666", marginBottom: "4px", display: "block" }}>Position</label>
          <input type="text" placeholder="e.g. Frontend Developer" value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
            style={inputStyle} required />

          <label style={{ fontSize: "13px", color: "#666", marginBottom: "4px", display: "block" }}>Location</label>
          <input type="text" placeholder="e.g. Remote, New York" value={form.jobLocation}
            onChange={(e) => setForm({ ...form, jobLocation: e.target.value })}
            style={inputStyle} />

          <label style={{ fontSize: "13px", color: "#666", marginBottom: "4px", display: "block" }}>Job Type</label>
          <select value={form.jobType}
            onChange={(e) => setForm({ ...form, jobType: e.target.value })}
            style={inputStyle}>
            {["Full-time", "Part-time", "Contract", "Internship"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <label style={{ fontSize: "13px", color: "#666", marginBottom: "4px", display: "block" }}>Status</label>
          <select value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            style={inputStyle}>
            {["Pending", "Interview", "Accepted", "Declined"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <button type="submit"
            style={{ width: "100%", padding: "11px", background: "#534AB7", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: "500", marginTop: "0.5rem" }}>
            Add Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddJob;