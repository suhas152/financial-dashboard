import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/records">Records</Link>
        {role === "ADMIN" && <Link to="/users">Users</Link>}
      </div>
      <div className="nav-user">
        <span>{email} ({role})</span>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
    </nav>
  );
}
