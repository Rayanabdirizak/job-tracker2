import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

const statusColors = {
  Pending: { background: "#fff3cd", color: "#856404" },
  Interview: { background: "#cfe2ff", color: "#084298" },
  Accepted: { background: "#d1e7dd", color: "#0a3622" },
  Declined: { background: "#f8d7da", color: "#842029" },
};

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [editJob, setEditJob] = useState(null);
  const { token, user, logout } = useAppContext();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get("https://job-tracker2.onrender.com/api/v1/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(data.jobs);
    } catch (err) {
      setError("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await axios.delete(`https://job-tracker2.onrender.com/api/v1/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (err) {
      setError("Failed to delete job");
    }
  };

  const updateJob = async () => {
    try {
      const { data } = await axios.patch(
        `https://job-tracker2.onrender.com/api/v1/jobs/${editJob._id}`,
        editJob,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs(jobs.map((j) => (j._id === editJob._id ? data.job : j)));
      setEditJob(null);
    } catch (err) {
      setError("Failed to update job");
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const filtered = jobs.filter((job) => {
    const matchSearch =
      job.position.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || job.status === statusFilter;
    const matchType = typeFilter === "All" || job.jobType === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const inputStyle = {
    padding: "8px 12px", borderRadius: "8px",
    border: "1px solid #ddd", fontSize: "14px",
    background: "#fff", outline: "none",
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "1.5rem" }}>

      {/* Navbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", paddingBottom: "1rem", borderBottom: "1px solid #eee" }}>
        <h1 style={{ fontSize: "20px", fontWeight: "600" }}>💼 Job Tracker</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#e8e4ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "600", color: "#534AB7" }}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: "14px", color: "#666" }}>{user?.username}</span>
          <button onClick={() => navigate("/add-job")}
            style={{ padding: "8px 16px", background: "#534AB7", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>
            + Add Job
          </button>
          <button onClick={() => { logout(); navigate("/login"); }}
            style={{ padding: "8px 16px", background: "#fff0f0", color: "#c0392b", border: "1px solid #fcc", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "2rem" }}>
        {["Pending", "Interview", "Accepted", "Declined"].map((status) => (
          <div key={status} style={{ background: "#fff", borderRadius: "10px", padding: "1rem", textAlign: "center", border: "1px solid #eee" }}>
            <div style={{ fontSize: "28px", fontWeight: "600", color: "#333" }}>
              {jobs.filter((j) => j.status === status).length}
            </div>
            <div style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>{status}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <input style={{ ...inputStyle, flex: 1, minWidth: "160px" }}
          placeholder="Search by job or company..."
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <select style={{ ...inputStyle, minWidth: "130px" }}
          value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All status</option>
          {["Pending", "Interview", "Accepted", "Declined"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select style={{ ...inputStyle, minWidth: "130px" }}
          value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="All">All types</option>
          {["Full-time", "Part-time", "Contract", "Internship"].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

      {/* Jobs */}
      {loading && <p style={{ color: "#888" }}>Loading jobs...</p>}
      {!loading && filtered.length === 0 && <p style={{ color: "#888" }}>No jobs found.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.map((job) => (
          <div key={job._id} style={{ background: "#fff", border: "1px solid #eee", borderRadius: "12px", padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "4px" }}>{job.position}</h3>
              <div style={{ fontSize: "13px", color: "#666", display: "flex", gap: "12px" }}>
                <span>🏢 {job.company}</span>
                <span>📍 {job.jobLocation}</span>
                <span>⏱ {job.jobType}</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ padding: "4px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: "500", ...statusColors[job.status] }}>
                {job.status}
              </span>
              <button onClick={() => setEditJob({ ...job })}
                style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontSize: "13px" }}>
                ✏️ Edit
              </button>
              <button onClick={() => deleteJob(job._id)}
                style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #fcc", background: "#fff0f0", color: "#c0392b", cursor: "pointer", fontSize: "13px" }}>
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editJob && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", width: "400px", maxWidth: "90vw" }}>
            <h2 style={{ marginBottom: "1.5rem", fontSize: "18px" }}>Edit Job</h2>
            {["company", "position", "jobLocation"].map((field) => (
              <input key={field} value={editJob[field] || ""}
                onChange={(e) => setEditJob({ ...editJob, [field]: e.target.value })}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                style={{ ...inputStyle, display: "block", width: "100%", marginBottom: "1rem" }} />
            ))}
            <select value={editJob.jobType}
              onChange={(e) => setEditJob({ ...editJob, jobType: e.target.value })}
              style={{ ...inputStyle, display: "block", width: "100%", marginBottom: "1rem" }}>
              {["Full-time", "Part-time", "Contract", "Internship"].map((t) => <option key={t}>{t}</option>)}
            </select>
            <select value={editJob.status}
              onChange={(e) => setEditJob({ ...editJob, status: e.target.value })}
              style={{ ...inputStyle, display: "block", width: "100%", marginBottom: "1.5rem" }}>
              {["Pending", "Interview", "Accepted", "Declined"].map((s) => <option key={s}>{s}</option>)}
            </select>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={updateJob}
                style={{ flex: 1, padding: "10px", background: "#534AB7", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>
                Save Changes
              </button>
              <button onClick={() => setEditJob(null)}
                style={{ flex: 1, padding: "10px", background: "#f5f5f5", border: "1px solid #ddd", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;