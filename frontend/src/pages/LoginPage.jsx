import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate("/dashboard");
    } catch (e) {
      setError(e.response?.data?.error || "Login nahi ho paya");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: "420px" }}>
      <div className="card" style={{ marginTop: "40px" }}>
        <h2 style={{ fontSize: "26px", marginBottom: "6px", textAlign: "center" }}>Wapas Aao! 👋</h2>
        <p style={{ color: "var(--text-muted)", textAlign: "center", marginBottom: "24px" }}>Apne Saathi account mein login karo</p>

        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="aapka@email.com" value={form.email} onChange={e => set("email", e.target.value)} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={form.password} onChange={e => set("password", e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()} />
        </div>

        {error && (
          <div style={{ background: "#FEE2E2", color: "#DC2626", padding: "10px 14px", borderRadius: "8px", marginBottom: "14px", fontSize: "14px" }}>
            ⚠️ {error}
          </div>
        )}

        <button className="btn btn-primary" onClick={submit} disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: "16px" }}>
          {loading ? "Login ho raha hai..." : "🔐 Login"}
        </button>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "var(--text-muted)" }}>
          Account nahi hai? <Link to="/register" style={{ color: "var(--orange)", fontWeight: 600 }}>Register Karo</Link>
        </p>

        <div style={{ borderTop: "1px solid var(--border)", marginTop: "20px", paddingTop: "14px" }}>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center" }}>
            💡 Account ke bina bhi <Link to="/search" style={{ color: "var(--teal)" }}>Saathi dhund sakte ho</Link> aur directly contact kar sakte ho
          </p>
        </div>
      </div>
    </div>
  );
}
