import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [categoryTotals, setCategoryTotals] = useState([]);
  const [recent, setRecent] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, c, r, m] = await Promise.all([
          api.get("/api/dashboard/summary"),
          api.get("/api/dashboard/category-totals"),
          api.get("/api/dashboard/recent"),
          api.get("/api/dashboard/monthly-trends"),
        ]);
        setSummary(s.data);
        setCategoryTotals(c.data);
        setRecent(r.data);
        setMonthlyTrends(m.data);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <><Navbar /><div className="page-content">Loading...</div></>;
  if (error) return <><Navbar /><div className="page-content error-msg">{error}</div></>;

  return (
    <>
      <Navbar />
      <div className="page-content">
        <h2>Dashboard</h2>

        {/* Summary Cards */}
        <div className="cards-row">
          <div className="card income">
            <p>Total Income</p>
            <h3>₹ {summary?.totalIncome}</h3>
          </div>
          <div className="card expense">
            <p>Total Expense</p>
            <h3>₹ {summary?.totalExpense}</h3>
          </div>
          <div className="card balance">
            <p>Net Balance</p>
            <h3>₹ {summary?.netBalance}</h3>
          </div>
        </div>

        {/* Category Totals */}
        <div className="section">
          <h3>Category Totals</h3>
          <table className="data-table">
            <thead>
              <tr><th>Category</th><th>Total Amount</th></tr>
            </thead>
            <tbody>
              {categoryTotals.map((c, i) => (
                <tr key={i}>
                  <td>{c.category}</td>
                  <td>₹ {c.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Records */}
        <div className="section">
          <h3>Recent Records</h3>
          <table className="data-table">
            <thead>
              <tr><th>Date</th><th>Type</th><th>Category</th><th>Amount</th><th>Notes</th></tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.id}>
                  <td>{r.date}</td>
                  <td><span className={`badge ${r.type.toLowerCase()}`}>{r.type}</span></td>
                  <td>{r.category}</td>
                  <td>₹ {r.amount}</td>
                  <td>{r.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Monthly Trends */}
        <div className="section">
          <h3>Monthly Trends</h3>
          <table className="data-table">
            <thead>
              <tr><th>Year</th><th>Month</th><th>Income</th><th>Expense</th></tr>
            </thead>
            <tbody>
              {monthlyTrends.map((m, i) => (
                <tr key={i}>
                  <td>{m.year}</td>
                  <td>{m.month}</td>
                  <td>₹ {m.totalIncome}</td>
                  <td>₹ {m.totalExpense}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
