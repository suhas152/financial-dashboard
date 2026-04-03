import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const emptyForm = { amount: "", type: "INCOME", category: "", date: "", notes: "" };

export default function RecordsPage() {
  const role = localStorage.getItem("role");
  const isAdmin = role === "ADMIN";

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter
  const [filters, setFilters] = useState({ type: "", category: "", startDate: "", endDate: "" });

  // Add / Edit form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // View detail  — GET /api/records/{id}
  const [viewRecord, setViewRecord] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // ── fetch all records ──────────────────────────────────────────────────────
  const fetchRecords = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/records");
      setRecords(res.data);
    } catch {
      setError("Failed to load records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecords(); }, []);

  // ── filter ─────────────────────────────────────────────────────────────────
  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const applyFilter = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      const res = await api.get("/api/records/filter", { params });
      setRecords(res.data);
    } catch {
      setError("Failed to apply filter.");
    } finally {
      setLoading(false);
    }
  };

  const clearFilter = () => {
    setFilters({ type: "", category: "", startDate: "", endDate: "" });
    fetchRecords();
  };

  // ── view single record  GET /api/records/{id} ──────────────────────────────
  const openView = async (id) => {
    setViewLoading(true);
    setViewRecord(null);
    try {
      const res = await api.get(`/api/records/${id}`);
      setViewRecord(res.data);
    } catch {
      alert("Failed to fetch record details.");
    } finally {
      setViewLoading(false);
    }
  };

  // ── add / edit form ────────────────────────────────────────────────────────
  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (record) => {
    setForm({
      amount: record.amount,
      type: record.type,
      category: record.category,
      date: record.date,
      notes: record.notes || "",
    });
    setEditId(record.id);
    setFormError("");
    setShowForm(true);
  };

  // POST /api/records  |  PUT /api/records/{id}
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      if (editId) {
        await api.put(`/api/records/${editId}`, payload);
      } else {
        await api.post("/api/records", payload);
      }
      setShowForm(false);
      fetchRecords();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save record.");
    } finally {
      setFormLoading(false);
    }
  };

  // DELETE /api/records/{id}
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await api.delete(`/api/records/${id}`);
      fetchRecords();
    } catch {
      alert("Failed to delete record.");
    }
  };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h2>Records</h2>
          {isAdmin && (
            <button className="btn-primary" onClick={openAdd}>+ Add Record</button>
          )}
        </div>

        {/* Filter bar — available to ALL roles */}
        <div className="filter-bar">
          <select name="type" value={filters.type} onChange={handleFilterChange}>
            <option value="">All Types</option>
            <option value="INCOME">INCOME</option>
            <option value="EXPENSE">EXPENSE</option>
          </select>
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={filters.category}
            onChange={handleFilterChange}
          />
          <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
          <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
          <button className="btn-secondary" onClick={applyFilter}>Apply Filter</button>
          <button className="btn-outline" onClick={clearFilter}>Clear</button>
        </div>

        {error && <p className="error-msg">{error}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Notes</th>
                <th>Created By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "#888" }}>
                    No records found
                  </td>
                </tr>
              )}
              {records.map((r) => (
                <tr key={r.id}>
                  <td>{r.date}</td>
                  <td>
                    <span className={`badge ${r.type.toLowerCase()}`}>{r.type}</span>
                  </td>
                  <td>{r.category}</td>
                  <td>₹ {r.amount}</td>
                  <td>{r.notes || "-"}</td>
                  <td>{r.createdBy}</td>
                  <td>
                    {/* View — all roles */}
                    <button className="btn-view" onClick={() => openView(r.id)}>View</button>

                    {/* Edit / Delete — ADMIN only */}
                    {isAdmin && (
                      <>
                        <button className="btn-edit" onClick={() => openEdit(r)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(r.id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ── View Detail Modal  GET /api/records/{id} ── */}
        {(viewRecord || viewLoading) && (
          <div className="modal-overlay" onClick={() => setViewRecord(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Record Detail</h3>
              {viewLoading ? (
                <p>Loading...</p>
              ) : viewRecord && (
                <div className="detail-grid">
                  <div className="detail-row"><span>ID</span><span>{viewRecord.id}</span></div>
                  <div className="detail-row"><span>Amount</span><span>₹ {viewRecord.amount}</span></div>
                  <div className="detail-row">
                    <span>Type</span>
                    <span className={`badge ${viewRecord.type.toLowerCase()}`}>{viewRecord.type}</span>
                  </div>
                  <div className="detail-row"><span>Category</span><span>{viewRecord.category}</span></div>
                  <div className="detail-row"><span>Date</span><span>{viewRecord.date}</span></div>
                  <div className="detail-row"><span>Notes</span><span>{viewRecord.notes || "-"}</span></div>
                  <div className="detail-row"><span>Created By</span><span>{viewRecord.createdBy}</span></div>
                  <div className="detail-row"><span>Created At</span><span>{new Date(viewRecord.createdAt).toLocaleString()}</span></div>
                  <div className="detail-row"><span>Updated At</span><span>{new Date(viewRecord.updatedAt).toLocaleString()}</span></div>
                </div>
              )}
              <div className="modal-actions" style={{ marginTop: "16px" }}>
                <button className="btn-outline" onClick={() => setViewRecord(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Add / Edit Modal  POST or PUT /api/records ── */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>{editId ? "Edit Record" : "Add Record"}</h3>
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleFormChange}
                    required
                    min="0.01"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select name="type" value={form.type} onChange={handleFormChange}>
                    <option value="INCOME">INCOME</option>
                    <option value="EXPENSE">EXPENSE</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <input
                    type="text"
                    name="notes"
                    value={form.notes}
                    onChange={handleFormChange}
                  />
                </div>
                {formError && <p className="error-msg">{formError}</p>}
                <div className="modal-actions">
                  <button type="submit" className="btn-primary" disabled={formLoading}>
                    {formLoading ? "Saving..." : "Save"}
                  </button>
                  <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
