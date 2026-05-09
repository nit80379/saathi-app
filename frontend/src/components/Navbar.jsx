import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, User, LayoutDashboard, Search } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={{
      background: "white",
      borderBottom: "1px solid var(--border)",
      padding: "0 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "60px",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 1px 8px rgba(0,0,0,0.06)"
    }}>
      <Link to="/" style={{ textDecoration: "none" }}>
        <span className="brand" style={{ fontSize: "26px", color: "var(--orange)", fontWeight: 800 }}>
          🤝 Saathi
        </span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Link to="/search" className="btn btn-outline" style={{ padding: "7px 16px", fontSize: "14px" }}>
          <Search size={15} /> Saathi Dhundo
        </Link>

        {user ? (
          <>
            <Link to="/dashboard" className="btn" style={{
              background: "var(--orange-light)", color: "var(--orange-dark)",
              padding: "7px 16px", fontSize: "14px"
            }}>
              <LayoutDashboard size={15} /> Dashboard
            </Link>
            <button onClick={handleLogout} className="btn btn-danger" style={{ padding: "7px 14px", fontSize: "14px" }}>
              <LogOut size={15} />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline" style={{ padding: "7px 16px", fontSize: "14px" }}>
              Login
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: "7px 16px", fontSize: "14px" }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
