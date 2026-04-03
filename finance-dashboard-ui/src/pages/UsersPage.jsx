import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // View detail — GET /api/users/{id}
  const [viewUser, setViewUser] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // ── fetch all users  GET /api/users ───────────────────────────────────────
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/users");
      setUsers(res.data);
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // ── view single user  GET /api/users/{id} ─────────────────────────────────
  const openView = async (id) => {
    setViewLoading(true);
    setViewUser(null);
    try {
      const res = await api.get(`/api/users/${id}`);
      setViewUser(res.data);
    } catch {
      alert("Failed to fetch user details.");
    } finally {
      setViewLoading(false);
    }
  };

  // ── update role  PATCH /api/users/{id}/role ────────────────────────────────
  const handleRoleChange = async (id, role) => {
    try {
      await api.patch(`/api/users/${id}/role`, { role });
      fetchUsers();
    } catch {
      alert("Failed to update role.");
    }
  };

  // ── update status  PATCH /api/users/{id}/status ───────────────────────────
  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/api/users/${id}/status`, { status });
      fetchUsers();
    } catch {
      alert("Failed to update status.");
    }
  };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <div className="page-content">
        <h2>Users</h2>
        {error && <p className="error-msg">{error}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "#888" }}>No users found</td>
                </tr>
              )}
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>

                  {/* Inline role update — PATCH /api/users/{id}/role */}
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="inline-select"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="ANALYST">ANALYST</option>
                      <option value="VIEWER">VIEWER</option>
                    </select>
                  </td>

                  <td>
                    <span className={`badge ${u.status === "ACTIVE" ? "income" : "expense"}`}>
                      {u.status}
                    </span>
                  </td>

                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>

                  <td>
                    {/* View — GET /api/users/{id} */}
                    <button className="btn-view" onClick={() => openView(u.id)}>View</button>

                    {/* Toggle status — PATCH /api/users/{id}/status */}
                    {u.status === "ACTIVE" ? (
                      <button
                        className="btn-delete"
                        onClick={() => handleStatusChange(u.id, "INACTIVE")}
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        className="btn-edit"
                        onClick={() => handleStatusChange(u.id, "ACTIVE")}
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ── View Detail Modal  GET /api/users/{id} ── */}
        {(viewUser || viewLoading) && (
          <div className="modal-overlay" onClick={() => setViewUser(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>User Detail</h3>
              {viewLoading ? (
                <p>Loading...</p>
              ) : viewUser && (
                <div className="detail-grid">
                  <div className="detail-row"><span>ID</span><span>{viewUser.id}</span></div>
                  <div className="detail-row"><span>Name</span><span>{viewUser.name}</span></div>
                  <div className="detail-row"><span>Email</span><span>{viewUser.email}</span></div>
                  <div className="detail-row">
                    <span>Role</span>
                    <span className="badge income">{viewUser.role}</span>
                  </div>
                  <div className="detail-row">
                    <span>Status</span>
                    <span className={`badge ${viewUser.status === "ACTIVE" ? "income" : "expense"}`}>
                      {viewUser.status}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span>Created At</span>
                    <span>{new Date(viewUser.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              )}
              <div className="modal-actions" style={{ marginTop: "16px" }}>
                <button className="btn-outline" onClick={() => setViewUser(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
